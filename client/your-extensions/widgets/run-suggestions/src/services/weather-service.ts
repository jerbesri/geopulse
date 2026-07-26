import { DateTime } from "luxon";
import { FORECAST_INTERVAL_HOURS, REDLANDS_TIME_ZONE } from "./time";
import type { OpenMeteoHourlyResponse } from "./types";

export const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
export const WEATHER_UNAVAILABLE = "Max Temp: unavailable, Precip: unavailable";
const EXTREME_HEAT_THRESHOLD_F = 100;
const REQUEST_TIMEOUT_MS = 10_000;

export async function getWeatherForInterval(
  lat: number,
  lng: number,
  dateISO: string,
): Promise<string> {
  try {
    const intervalStart = DateTime.fromISO(dateISO, { setZone: true }).setZone(REDLANDS_TIME_ZONE);
    if (!intervalStart.isValid) {
      return WEATHER_UNAVAILABLE;
    }

    const intervalEnd = intervalStart.plus({ hours: FORECAST_INTERVAL_HOURS });
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),
      hourly: "temperature_2m,precipitation",
      temperature_unit: "fahrenheit",
      precipitation_unit: "inch",
      timezone: REDLANDS_TIME_ZONE,
      start_date: intervalStart.toISODate(),
      end_date: intervalEnd.minus({ milliseconds: 1 }).toISODate(),
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(`${OPEN_METEO_URL}?${params.toString()}`, {
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new Error(`Open-Meteo returned ${response.status}`);
    }

    const payload = (await response.json()) as OpenMeteoHourlyResponse;
    const samples = getIntervalSamples(payload, intervalStart, intervalEnd);
    if (samples.length === 0) {
      throw new Error("Open-Meteo returned no hourly samples for the interval");
    }

    const maxTemperature = Math.max(...samples.map((sample) => sample.temperature));
    const precipitation = samples.reduce((total, sample) => total + sample.precipitation, 0);
    const heatWarning = maxTemperature >= EXTREME_HEAT_THRESHOLD_F ? " (EXTREME HEAT)" : "";

    return `Max Temp: ${maxTemperature.toFixed(1)}°F${heatWarning}, Precip: ${precipitation.toFixed(2)} in`;
  } catch {
    return WEATHER_UNAVAILABLE;
  }
}

interface WeatherSample {
  temperature: number;
  precipitation: number;
}

function getIntervalSamples(
  payload: OpenMeteoHourlyResponse,
  intervalStart: DateTime,
  intervalEnd: DateTime,
): WeatherSample[] {
  const times = payload.hourly?.time;
  const temperatures = payload.hourly?.temperature_2m;
  const precipitation = payload.hourly?.precipitation;
  if (!times || !temperatures || !precipitation ||
      times.length !== temperatures.length || times.length !== precipitation.length) {
    return [];
  }

  const samples: WeatherSample[] = [];
  times.forEach((time, index) => {
    const sampleTime = DateTime.fromISO(time, { zone: REDLANDS_TIME_ZONE });
    const temperature = temperatures[index];
    const precipitationAmount = precipitation[index];
    if (sampleTime >= intervalStart && sampleTime < intervalEnd &&
        typeof temperature === "number" && Number.isFinite(temperature) &&
        typeof precipitationAmount === "number" && Number.isFinite(precipitationAmount)) {
      samples.push({ temperature, precipitation: precipitationAmount });
    }
  });

  return samples;
}