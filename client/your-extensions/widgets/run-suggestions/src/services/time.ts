import { DateTime } from "luxon";
import { StagingPipelineError, type NormalizedTargetTime } from "./types";

export const REDLANDS_TIME_ZONE = "America/Los_Angeles";
export const FORECAST_INTERVAL_HOURS = 8;

const OFFSET_SUFFIX = /(?:Z|[+-]\d{2}:\d{2})$/i;
const LOCAL_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

export function normalizeTargetTime(targetTimeISO: string): NormalizedTargetTime {
  const value = targetTimeISO.trim();
  const localMatch = LOCAL_DATE_TIME.exec(value);
  let target: DateTime;

  if (OFFSET_SUFFIX.test(value)) {
    target = DateTime.fromISO(value, { setZone: true });
  } else if (localMatch) {
    target = DateTime.fromObject(
      {
        year: Number(localMatch[1]),
        month: Number(localMatch[2]),
        day: Number(localMatch[3]),
        hour: Number(localMatch[4]),
        minute: Number(localMatch[5]),
        second: Number(localMatch[6] ?? 0),
      },
      { zone: REDLANDS_TIME_ZONE },
    );

    const roundTrip = target.toFormat("yyyy-MM-dd'T'HH:mm:ss");
    const expected = `${value.length === 16 ? value + ":00" : value}`;
    if (roundTrip !== expected) {
      throw invalidTime(targetTimeISO);
    }
  } else {
    throw invalidTime(targetTimeISO);
  }

  if (!target.isValid) {
    throw invalidTime(targetTimeISO);
  }

  const localStart = target.setZone(REDLANDS_TIME_ZONE);
  const localEnd = localStart.plus({ hours: FORECAST_INTERVAL_HOURS });

  return {
    instantISO: target.toUTC().toISO({ suppressMilliseconds: true }),
    arcgisTimestamp: target.toUTC().toFormat("yyyy-MM-dd HH:mm:ss"),
    localStartISO: localStart.toISO({ suppressMilliseconds: true }),
    localEndISO: localEnd.toISO({ suppressMilliseconds: true }),
  };
}

function invalidTime(value: string): StagingPipelineError {
  return new StagingPipelineError(
    "INVALID_TIME",
    `Invalid target time "${value}". Enter a valid Redlands date and time.`,
  );
}