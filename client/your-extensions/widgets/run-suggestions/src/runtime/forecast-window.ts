export const resolveForecastTargetTime = (
  forecastWindow: string | undefined,
  now: Date = new Date(),
): Date => {
  if (!forecastWindow) {
    return new Date(now);
  }

  const trimmedValue = forecastWindow.trim();
  if (!trimmedValue) {
    return new Date(now);
  }

  const isoCandidate = new Date(trimmedValue);
  if (!Number.isNaN(isoCandidate.getTime())) {
    return isoCandidate;
  }

  if (trimmedValue === "next_hour") {
    return new Date(now.getTime() + 60 * 60 * 1000);
  }

  if (trimmedValue === "next_24_hours") {
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }

  return new Date(now);
};
