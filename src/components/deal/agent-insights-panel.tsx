"use client";

import { useState } from "react";
import { BookOpen, Check, AlertTriangle, Info, ChevronDown } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { PropertyIntelligence, BuyerScore, PropertyAlert, SuggestedAction, IntentLevel } from "@/lib/mock-deal-data";

interface AgentInsightsPanelProps {
  intelligence: PropertyIntelligence;
  locale: string;
}

const INTENT_LABELS: Record<IntentLevel, string> = {
  hot: "Quente",
  warm: "Morno",
  cold: "Frio",
};


function BuyerRow({ buyer, locale }: { buyer: BuyerScore; locale: string }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
      <div className="flex size-8 items-center justify-center bg-gray-100 text-xs font-bold text-gray-600 shrink-0">
        {buyer.score}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{buyer.name}</p>
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 font-medium",
              buyer.intentLevel === "hot" && "bg-red-50 text-red-700",
              buyer.intentLevel === "warm" && "bg-amber-50 text-amber-700",
              buyer.intentLevel === "cold" && "bg-blue-50 text-blue-700",
            )}
          >
            {INTENT_LABELS[buyer.intentLevel]}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Orçamento: {formatPrice(buyer.budget.min, locale)} – {formatPrice(buyer.budget.max, locale)}
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {buyer.matchReasons.map((r) => (
            <span key={r} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5">
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: PropertyAlert }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 border p-3",
        alert.type === "success" && "border-green-200 bg-green-50",
        alert.type === "warning" && "border-amber-200 bg-amber-50",
        alert.type === "info" && "border-blue-200 bg-blue-50",
      )}
    >
      {alert.type === "success" && <Check size={16} className="text-green-500 shrink-0 mt-0.5" />}
      {alert.type === "warning" && <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />}
      {alert.type === "info" && <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />}
      <div>
        <p className="text-xs font-medium">{alert.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{alert.description}</p>
      </div>
    </div>
  );
}

function ActionCard({ action }: { action: SuggestedAction }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-0">
      <span
        className={cn(
          "size-2 rounded-full mt-1.5 shrink-0",
          action.priority === "high" && "bg-red-500",
          action.priority === "medium" && "bg-amber-500",
          action.priority === "low" && "bg-gray-400",
        )}
      />
      <div>
        <p className="text-xs font-medium">{action.action}</p>
        <p className="text-xs text-gray-400">{action.reason}</p>
      </div>
    </div>
  );
}

export function AgentInsightsPanel({ intelligence, locale }: AgentInsightsPanelProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-3 hover:bg-indigo-50/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-600" />
          <span className="text-xs font-medium text-indigo-700 uppercase tracking-wide">
            Insights do Agente
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-indigo-400 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-4">
          {/* Deal Probability */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-700">{intelligence.dealProbability}%</p>
              <p className="text-[10px] text-gray-400 uppercase">Prob. de Negócio</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">{intelligence.estimatedDaysToClose}</p>
              <p className="text-[10px] text-gray-400 uppercase">Dias Est. p/ Fecho</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">{intelligence.topBuyers.length}</p>
              <p className="text-[10px] text-gray-400 uppercase">Compradores</p>
            </div>
          </div>

          {/* Price Analysis */}
          <div>
            <h4 className="text-xs text-gray-400 uppercase mb-2">Análise de Preço</h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Média de Mercado</span>
                <span>{formatPrice(intelligence.priceAnalysis.marketAverage, locale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Intervalo Sugerido</span>
                <span>
                  {formatPrice(intelligence.priceAnalysis.suggestedRange.min, locale)} –{" "}
                  {formatPrice(intelligence.priceAnalysis.suggestedRange.max, locale)}
                </span>
              </div>
            </div>
          </div>

          {/* Top Buyers */}
          <div>
            <h4 className="text-xs text-gray-400 uppercase mb-2">
              Principais Compradores
            </h4>
            <div>
              {intelligence.topBuyers.map((b) => (
                <BuyerRow key={b.id} buyer={b} locale={locale} />
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div>
            <h4 className="text-xs text-gray-400 uppercase mb-2">Alertas</h4>
            <div className="space-y-2">
              {intelligence.alerts.map((a, i) => (
                <AlertCard key={i} alert={a} />
              ))}
            </div>
          </div>

          {/* Suggested Actions */}
          <div>
            <h4 className="text-xs text-gray-400 uppercase mb-2">Ações Sugeridas</h4>
            <div>
              {intelligence.suggestedActions.map((a, i) => (
                <ActionCard key={i} action={a} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
