"use client";

import { AnimatePresence, motion } from "motion/react";
import { useDictionary } from "@/components/dictionary-provider";
import { useProposalDetail, useSelectedProposal } from "./proposal-detail-context";
import { Small } from "@/components/ui/small";
import { useParams } from "next/navigation";
import { cn, formatPrice } from "@/lib/utils";
import type { Proposal, ProposalEvent } from "./proposal-types";

const eventIcons: Record<ProposalEvent["type"], { bg: string; icon: React.ReactNode }> = {
  created: {
    bg: "bg-gray-400",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  signature_requested: {
    bg: "bg-blue-500",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  owner_signed: {
    bg: "bg-green-500",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  applicant_signed: {
    bg: "bg-green-500",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  expired: {
    bg: "bg-gray-400",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  cancelled: {
    bg: "bg-red-500",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    ),
  },
};

export function ProposalDetailPanel({
  proposals,
}: {
  proposals: Proposal[];
}) {
  const selected = useSelectedProposal(proposals);
  const { close } = useProposalDetail();
  const dict = useDictionary().dashboard;
  const { locale } = useParams<{ locale: string }>();

  const eventLabel: Record<ProposalEvent["type"], string> = {
    created: dict.proposalEventCreated,
    signature_requested: dict.proposalEventSignatureRequested,
    owner_signed: dict.proposalEventOwnerSigned,
    applicant_signed: dict.proposalEventApplicantSigned,
    expired: dict.proposalEventExpired,
    cancelled: dict.proposalEventCancelled,
  };

  function formatEventDate(timestamp: string) {
    const date = new Date(timestamp);
    const loc = locale === "pt" ? "pt-PT" : "en-GB";
    const day = date.toLocaleDateString(loc, { day: "2-digit", month: "short" });
    const year = date.toLocaleDateString(loc, { year: "numeric" });
    const time = date.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" });
    return { day, year, time };
  }

  return (
    <AnimatePresence>
      {selected && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/10 z-40"
            onClick={close}
          />

          <motion.aside
            key="sidebar"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-[420px] bg-white border-l border-gray-200 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <h2 className="text-sm font-bold font-heading text-gray-900 truncate">
                {selected.property.title}
              </h2>
              <button
                onClick={close}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={dict.close}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Parties summary */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Small variant="label">{dict.proposalOwner}</Small>
                    <p className="text-xs text-gray-700 mt-0.5">{selected.owner.name}</p>
                  </div>
                  {selected.owner.signed ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {dict.contractSigned}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">{dict.proposalAwaitingSignature}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Small variant="label">{dict.proposalApplicant}</Small>
                    <p className="text-xs text-gray-700 mt-0.5">{selected.applicant.name}</p>
                  </div>
                  {selected.applicant.signed ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {dict.contractSigned}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">{dict.proposalAwaitingSignature}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Property summary */}
            <div className="px-4 py-3 border-b border-gray-100">
              <Small variant="label">{dict.property}</Small>
              <div className="space-y-1.5 mt-1">
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">{dict.propertyValue}: </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(selected.property.value, locale)}
                  </span>
                </div>
                {selected.property.monthlyRent != null && (
                  <div className="text-xs text-gray-500">
                    <span className="text-gray-400">{dict.monthlyRent}: </span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(selected.property.monthlyRent, locale)}/{dict.month}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="truncate">{selected.property.address}</span>
                </div>
              </div>
            </div>

            {/* Contract */}
            <div className="px-4 py-3 border-b border-gray-100">
              <Small variant="label">{dict.proposalContract}</Small>
              <div className="space-y-1.5 mt-1">
                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">{dict.propertyType}: </span>
                  {selected.contract.type === "arrendamento" ? dict.contractRental : dict.contractSale}
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  {selected.contract.signed ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16a34a" /><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span className="text-green-600">{dict.contractSigned}</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="2" /><path d="M8 12h8" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" /></svg>
                      <span className="text-gray-400">{dict.contractNotSigned}</span>
                    </>
                  )}
                </div>
                <div className="text-xs font-mono text-gray-400 truncate">
                  ID: {selected.contract.id}
                </div>
              </div>
            </div>

            {/* Event history */}
            <div className="px-4 py-3">
              <Small variant="label">{dict.proposalEventHistory}</Small>
              <div className="mt-3">
                {[...selected.events].reverse().map((event, idx) => {
                  const iconConfig = eventIcons[event.type];
                  const isLast = idx === selected.events.length - 1;
                  const { day, year, time } = formatEventDate(event.timestamp);
                  return (
                    <div key={event.id} className="flex">
                      {/* Left: timestamp */}
                      <div className="w-[80px] shrink-0 text-right pr-3 pt-0.5">
                        <p className="text-xs font-medium text-gray-700">{day}</p>
                        <p className="text-xs text-gray-400">{year}</p>
                        <p className="text-xs text-gray-400">{time}</p>
                      </div>

                      {/* Center: line + dot */}
                      <div className="flex flex-col items-center">
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", iconConfig.bg)}>
                          {iconConfig.icon}
                        </div>
                        {!isLast && <div className="w-px flex-1 bg-gray-200 my-1" />}
                      </div>

                      {/* Right: event info */}
                      <div className={cn("pl-3 pb-8", isLast && "pb-0")}>
                        <p className="text-xs font-medium text-gray-700">
                          {eventLabel[event.type]}
                        </p>
                        <p className="text-xs text-gray-500">{event.actor}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ID */}
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="text-xs font-mono text-gray-400 truncate">
                ID: {selected.id}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
