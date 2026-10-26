"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Page } from "@/components/shared";

import { posts } from "@/lib/mock-data";

import {
  addCalendarDays,
  addCalendarMonths,
  calendarDayKey,
  getCalendarPeriodTitle,
  getCalendarPosts,
  getIstanbulTodayKey,
  groupCalendarPosts,
  parseDayKey,
  startOfCalendarWeek,
} from "@/lib/calendar";

import CalendarToolbar from "./CalendarToolbar";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import CalendarAgenda from "./CalendarAgenda";
import { CalendarView } from "@/types/calendar/CalendarView";

type Props = {
  initialTodayKey: string;
};

export default function CalendarPage({ initialTodayKey }: Props) {
  const [view, setView] = useState<CalendarView>("month");

  const [currentDate, setCurrentDate] = useState<Date>(() =>
    parseDayKey(initialTodayKey),
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialTodayKey,
  );

  const [todayKey, setTodayKey] = useState(initialTodayKey);

  const events = useMemo(() => getCalendarPosts(posts), []);

  const eventsByDate = useMemo(() => groupCalendarPosts(events), [events]);

  const selectedEvents = selectedDate
    ? (eventsByDate.get(selectedDate) ?? [])
    : [];

  const title = getCalendarPeriodTitle(currentDate, view);

  function selectDay(key: string) {
    setSelectedDate(key);

    // Also follow out-of-month days.
    setCurrentDate(parseDayKey(key));
  }

  function changePeriod(direction: -1 | 1) {
    if (view === "month") {
      const next = addCalendarMonths(currentDate, direction);

      setCurrentDate(next);
      setSelectedDate(calendarDayKey(next));
      return;
    }

    const weekStart = startOfCalendarWeek(currentDate);

    const next = addCalendarDays(weekStart, direction * 7);

    setCurrentDate(next);
    setSelectedDate(calendarDayKey(next));
  }

  function goToToday() {
    const key = getIstanbulTodayKey();

    setTodayKey(key);
    setSelectedDate(key);
    setCurrentDate(parseDayKey(key));
  }

  function changeView(nextView: CalendarView) {
    if (nextView === view) return;

    // Preserve the selected day whenever possible.
    if (selectedDate) {
      setCurrentDate(parseDayKey(selectedDate));
    }

    setView(nextView);
  }

  return (
    <Page className="space-y-7">
      <PageHeader
        eyebrow="Publishing"
        title="Content calendar"
        description="Explore your scheduled content across every channel, all in one place."
      />

      <CalendarToolbar
        title={title}
        view={view}
        onViewChange={changeView}
        onPrevious={() => changePeriod(-1)}
        onNext={() => changePeriod(1)}
        onToday={goToToday}
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="min-w-0 space-y-4">
          {view === "month" ? (
            <MonthView
              currentDate={currentDate}
              selectedDate={selectedDate}
              todayKey={todayKey}
              eventsByDate={eventsByDate}
              onSelectDate={selectDay}
            />
          ) : (
            <WeekView
              currentDate={currentDate}
              selectedDate={selectedDate}
              todayKey={todayKey}
              eventsByDate={eventsByDate}
              onSelectDate={selectDay}
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-subtle">
            <span>{events.length} posts with recorded schedules</span>

            <span>All times in Europe/Istanbul</span>
          </div>
        </div>

        <CalendarAgenda selectedDate={selectedDate} events={selectedEvents} />
      </div>
    </Page>
  );
}
