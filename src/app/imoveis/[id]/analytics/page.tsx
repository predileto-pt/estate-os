import { MainWrapper } from "@/components/main-wrapper";
import { AgentInsightsPanel } from "@/components/deal/agent-insights-panel";
import { MOCK_INTELLIGENCE } from "@/lib/mock-deal-data";

export default async function PropertyAnalyticsPage() {
  return (
    <MainWrapper>
      <AgentInsightsPanel intelligence={MOCK_INTELLIGENCE} />
    </MainWrapper>
  );
}
