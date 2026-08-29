# Clickable car & stay detail cards

Right now cars, hotels and villas are plain rows with a name, price and a few tags. This adds a photo to every one of them and a full detail view you can open with a click.

## What changes

**1. Photos everywhere**
Each car and each stay gets its own image (12 cars, 12 stays across the 6 destinations), generated and stored in the project. Rows and feed cards show a thumbnail; the detail view shows the large photo.

**2. Click a car → detail view**
Opens a panel showing:
- Large vehicle photo
- Condition block: overall condition rating (e.g. "Excellent – 2024 model"), mileage, cleanliness/service note, last serviced
- Specs: type, seats, transmission, fuel, A/C, luggage capacity
- Pickup location, included perks, insurance and cancellation terms
- Price per day and the Add-to-basket button (same ripple/pop behaviour as today)

**3. Click a hotel / villa / resort → detail view**
Opens a panel showing:
- Large property photo
- Condition & standard block: rating, year built or last renovated, room condition note, cleanliness score
- Room details: room type, size, beds, max guests, view
- Amenities list, area, check-in/out, cancellation policy
- Price per night and the Add-to-basket button

The Add button keeps working directly from the row, so nothing gets slower for people who already know what they want. Clicking anywhere else on the row opens the detail.

## Where it applies

- Cars and Stays tabs inside each destination modal
- The standalone Flights / Cars / Stays feeds on the landing page

## Technical notes

- Extend `Car` and `Stay` types in `src/lib/travel-catalog.ts` with `image`, `condition`, `conditionNote`, plus car fields (`year`, `mileage`, `fuel`, `luggage`, `lastServiced`, `insurance`, `cancellation`) and stay fields (`renovated`, `roomType`, `roomSize`, `beds`, `maxGuests`, `view`, `amenities[]`, `checkIn`, `checkOut`, `cancellation`). Fill values for all 12 cars and 12 stays.
- Generate images into `public/images/car-*.jpg` and `public/images/stay-*.jpg`.
- New `src/components/travel/vehicle-stay-detail.tsx` with `CarDetailDialog` and `StayDetailDialog`, styled with existing tokens (gold/black theme safe, no hardcoded colors).
- Update `Row` in `destination-explorer.tsx` to accept an optional thumbnail and `onOpen` handler; wire the cars/stays tabs and `category-feeds.tsx` to open the dialogs.
- Dialog stacking: since these open from inside the destination modal, render the detail as a nested dialog with the existing shadcn `Dialog`.
