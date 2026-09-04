# Weather Report

A weather feature that is visible on the screen — a live weather strip on the home page users can see without clicking anything, which opens a full weather explorer when tapped.

## What you get

### Live weather strip on the home page (always visible)
- A horizontal "Weather now" section on the landing page showing live current conditions for featured destinations (Tokyo, Bali, Rio, Cape Town, Santorini, Marrakech): temperature, condition icon, high/low.
- Each card tappable — clicking it opens the full Weather page with that destination pre-loaded, so users can explore the detail.
- Updates automatically (TanStack Query cache + refetch interval).

### Full Weather page (`/weather`)
- Search box: type any country or city ("Japan", "Lagos", "Santorini") with live suggestions; pick one to load its weather.
- Current conditions card: temperature, feels-like, condition icon and label, humidity, wind, precipitation chance, sunrise/sunset, local time.
- 7-day forecast strip: day, icon, high/low, rain chance.
- Travel tips line that reacts to the forecast (e.g. "Pack rain gear — showers 5 of the next 7 days").
- Celsius/Fahrenheit toggle, remembered locally.
- Weather panel also embedded in the destination detail view in Explore.

### Entry points
- Main nav link (Explore, Passport & Visa, Hire a Pro, Track, Weather), dashboard quick action, and account dropdown item.

## Technical notes

- Data source: Open-Meteo (free, no key, no signup) — Geocoding API for country/city search, Forecast API for current + daily data.
- Server functions in `src/lib/weather.functions.ts`: `searchLocations(query)` and `getWeather(lat, lon, unit)`; the home strip fetches all six featured cities in one batched call.
- Fetching via TanStack Query keyed on location + unit; search input debounced.
- New route `src/routes/weather.tsx` (public, like Explore) with its own `head()` metadata, plus `src/components/travel/weather-panel.tsx` (current + forecast UI) and `src/components/travel/weather-strip.tsx` (home-page strip), with a small WMO weather-code → icon/label map.
- Styling uses existing semantic tokens and Card/Badge/Button components; no new colors.
- No database changes.
