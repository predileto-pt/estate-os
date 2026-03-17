"use client";

import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { PropertyDetailProvider } from "./property-detail-context";
import { PropertyList } from "./property-list";
import { PropertyDetailPanel } from "./property-detail-panel";
import { FAKE_PROPERTIES } from "./fake-data";

export function PropertiesPageContent({
  dict,
  locale,
}: {
  dict: Dictionary["dashboard"];
  locale: Locale;
}) {
  const properties = FAKE_PROPERTIES;

  return (
    <PropertyDetailProvider properties={properties}>
      <main className="max-w-7xl mx-auto px-4 py-4 lg:px-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-2" />
          <div className="col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold font-heading">
                {dict.imoveis}
              </h1>
              <Link href={`/${locale}/imoveis/novo`}>
                <Button variant="primary">
                  {dict.addProperty}
                </Button>
              </Link>
            </div>
            <PropertyList properties={properties} dict={dict} locale={locale} />
          </div>
          <div className="col-span-2" />
        </div>
      </main>
      <PropertyDetailPanel properties={properties} />
    </PropertyDetailProvider>
  );
}
