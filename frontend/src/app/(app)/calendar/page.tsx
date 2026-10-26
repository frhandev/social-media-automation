import CalendarPage from "@/components/Calendar/CalendarPage";
import { getIstanbulTodayKey } from "@/lib/calendar";

export default function Calendar() {
  const initialTodayKey = getIstanbulTodayKey();

  return <CalendarPage initialTodayKey={initialTodayKey} />;
}
