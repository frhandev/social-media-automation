import { ScheduleErrors } from "./ScheduleErrors";

export type ScheduleValidation = {
  valid: boolean;
  errors: ScheduleErrors;
  scheduledAt: string | null;
};