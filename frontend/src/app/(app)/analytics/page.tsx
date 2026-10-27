import AnalyticsPage from "@/components/Analytics/AnalyticsPage";
import { getIstanbulTodayKey } from "@/lib/calendar";

export const dynamic = "force-dynamic";

export default function Analytics() {
  const todayKey = getIstanbulTodayKey();

  return <AnalyticsPage todayKey={todayKey} />;
}
