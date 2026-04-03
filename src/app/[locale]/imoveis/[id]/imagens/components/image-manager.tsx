"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { PropertyResponse } from "@/lib/api/types";
import { useDictionary } from "@/components/dictionary-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  presignImageUploads,
  recordPropertyImage,
  deletePropertyImage,
  reorderPropertyImages,
} from "../actions";

type PropertyImage = PropertyResponse["images"][number];

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageManager({
  property,
  locale,
}: {
  property: PropertyResponse;
  locale: Locale;
}) {
  const { dashboard: dict } = useDictionary();
  const [images, setImages] = useState<PropertyImage[]>(
    [...property.images].sort((a, b) => a.display_order - b.display_order),
  );
  const [uploading, setUploading] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        ACCEPTED_TYPES.includes(f.type),
      );
      if (fileArray.length === 0) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setUploading(true);
      try {
        const presignResult = await presignImageUploads(
          property.id,
          fileArray.map((f) => ({ filename: f.name, content_type: f.type })),
        );
        if (presignResult.error !== null) return;

        for (let i = 0; i < fileArray.length; i++) {
          if (controller.signal.aborted) return;

          const file = fileArray[i];
          const presigned = presignResult.data.files[i];

          const uploadRes = await fetch(presigned.upload_url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
            signal: controller.signal,
          });

          if (!uploadRes.ok) continue;

          const recordResult = await recordPropertyImage({
            property_id: property.id,
            image_id: presigned.image_id,
            s3_key: presigned.s3_key,
            filename: file.name,
            content_type: file.type,
            size_bytes: file.size,
          });

          if (!controller.signal.aborted && recordResult.error === null) {
            setImages(
              [...recordResult.data.images].sort(
                (a, b) => a.display_order - b.display_order,
              ),
            );
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      } finally {
        if (!controller.signal.aborted) {
          setUploading(false);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [property.id],
  );

  const handleDelete = useCallback(
    async (imageId: string) => {
      if (!confirm(dict.deleteImageConfirm)) return;

      setImages((prev) => prev.filter((img) => img.id !== imageId));
      const result = await deletePropertyImage(imageId, property.id);
      if (result.error !== null) {
        setImages(
          [...property.images].sort(
            (a, b) => a.display_order - b.display_order,
          ),
        );
      }
    },
    [property.id, property.images, dict.deleteImageConfirm],
  );

  const handleDragStart = useCallback((index: number) => {
    dragIndexRef.current = index;
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (dragIndexRef.current === null || dragIndexRef.current === index) {
        setDragOverIndex(null);
        return;
      }
      setDragOverIndex(index);
    },
    [],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      setDragOverIndex(null);
      const fromIndex = dragIndexRef.current;
      dragIndexRef.current = null;
      if (fromIndex === null || fromIndex === dropIndex) return;

      const reordered = [...images];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(dropIndex, 0, moved);
      setImages(reordered);

      await reorderPropertyImages(
        property.id,
        reordered.map((img) => img.id),
      );
    },
    [images, property.id],
  );

  const handleDragEnd = useCallback(() => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  }, []);

  const handleDropZone = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload],
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/imoveis/${property.id}`}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold font-heading">{dict.images}</h1>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-md">
              {property.address}
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? dict.uploadingImages : dict.addImages}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>

      {/* Image grid */}
      {images.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">{dict.dragToReorder}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "group relative border border-gray-200 bg-white cursor-grab active:cursor-grabbing transition-all",
                  dragOverIndex === index &&
                    "ring-2 ring-blue-400 ring-offset-2",
                )}
              >
                <div className="aspect-4/3 bg-gray-100 overflow-hidden">
                  <img
                    src={img.download_url}
                    alt={img.filename}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-2 py-1.5 flex items-center justify-between">
                  <span className="text-xs text-gray-500 truncate flex-1">
                    {img.filename}
                  </span>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="text-xs text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 ml-2 cursor-pointer"
                  >
                    {dict.deleteImage}
                  </button>
                </div>
                {index === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-gray-900/70 text-white text-[10px] px-1.5 py-0.5">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty state / drop zone */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropZone}
          className="border-2 border-dashed border-gray-300 bg-white py-16 flex flex-col items-center justify-center gap-2 hover:border-gray-400 transition-colors"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <p className="text-sm text-gray-500">{dict.dropImagesHere}</p>
          <p className="text-xs text-gray-400">{dict.acceptedFormats}</p>
          <Button
            variant="default"
            className="mt-2"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? dict.uploadingImages : dict.addImages}
          </Button>
        </div>
      )}

      {/* Drop zone when images exist */}
      {images.length > 0 && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropZone}
          className="mt-4 border-2 border-dashed border-gray-200 bg-white py-8 flex flex-col items-center justify-center gap-1 hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-sm text-gray-400">{dict.dropImagesHere}</p>
          <p className="text-xs text-gray-300">{dict.acceptedFormats}</p>
        </div>
      )}
    </div>
  );
}
