import CalendarPage from "@/components/Calendar/CalendarPage";
import { getIstanbulTodayKey } from "@/lib/calendar";

export const dynamic = "force-dynamic";

export default function Calendar() {
  const initialTodayKey = getIstanbulTodayKey();

  return <CalendarPage initialTodayKey={initialTodayKey} />;
}
