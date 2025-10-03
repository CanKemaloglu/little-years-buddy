import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from "date-fns";

export interface AgeBreakdown {
  days: number;
  weeks: number;
  months: number;
  years: number;
}

export const calculateAge = (birthdate: string, atDate?: Date): AgeBreakdown => {
  const birth = new Date(birthdate);
  const today = atDate || new Date();

  return {
    days: differenceInDays(today, birth),
    weeks: differenceInWeeks(today, birth),
    months: differenceInMonths(today, birth),
    years: differenceInYears(today, birth),
  };
};
