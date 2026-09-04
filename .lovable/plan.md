# Weather Report

A new Weather tab where travelers can search any country or city and see current conditions plus a multi-day forecast — no API key or account needed.

## What you get

- New page at `/weather`, linked from the main nav (Explore, Passport & Visa, Hire a Pro, Track, Weather), the dashboard quick actions, and the account dropdown.
- Search box: type any country or city ("Japan", "Lagos", "Santorini") with live suggestions; pick one to load its weather.
- Current conditions card: temperature, feels-like, condition icon and label, humidity, wind, precipitation chance, sunrise/sunset, local time.
- 7-day forecast strip: day, icon, high/low, rain chance.
- Travel tips line that reacts to the forecast (e.g. "Pack rain gear — showers 5 of the next 7 days").
- Quick chips for the destinations already in the app (Tokyo, Bali, Rio, Cape Town, Santorini, Marrakech) so users can tap instead of type.
- Celsius/Fahrenheit toggle, remembered locally.
- Weather panel also embedded in the destination detail view in Explore, so each destination shows its own live forecast.

## Technical notes

- Data source: Open-Meteo (free, no key, no signup) — Geocoding API for country/city search, Forecast API for current + daily data. Calls go through a `createServerFn` in `src/lib/weather.functions.ts` so requests are server-side and cacheable.
- Fetching via TanStack Query (`useQuery`) keyed on location + unit; search input debounced.
- New route `src/routes/weather.tsx` (public, like Explore's sibling pages) with its own `head()` metadata, plus `src/components/travel/weather-panel.tsx` for the reusable current+forecast UI and a small WMO weather-code → icon/label map.
- Styling uses existing semantic tokens and Card/Badge/Button components; no new colors.
- No database changes.
