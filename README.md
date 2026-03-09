# SuDer Backend Documentation

`suder_backend` is an Express API backed by PostgreSQL for users, drivers, rides, and payments.

## Tech Stack

- Node.js + Express 5
- PostgreSQL (`pg`)
- Stripe (`stripe`)
- Multer (profile image upload)
- CORS + dotenv

## Scripts

- `npm start` -> starts `index.js`

## Environment Variables

Create `suder_backend/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxx
BASEURL=http://localhost:5000
```

Variable usage in code:

- `DATABASE_URL` -> PostgreSQL pool connection
- `PORT` -> server port (default fallback is 3000)
- `STRIPE_SECRET_KEY` -> Stripe payment intent + confirmation
- `BASEURL` -> profile picture URL generation (`/uploads/...`)

## Local Setup

1. Install deps:
   - `npm install`
2. Configure `.env`
3. Start server:
   - `npm start`

On startup:

- `initDB()` runs automatically
- tables are created if missing: `users`, `drivers`, `rides`, `payments`
- uploads served from `/uploads`

## API Base URL

- Base: `http://localhost:5000/api`

## Route Groups

### User Routes (`/api/users`)

- `GET /` -> all users
- `GET /:id` -> user by ID
- `POST /` -> create user
- `POST /sync` -> sync Clerk user with DB
- `POST /profile_pic` -> upload profile picture
- `PUT /:id` -> update user profile
- `DELETE /:id` -> delete user

### Driver Routes (`/api/drivers`)

- `GET /` -> all drivers
- `GET /:id` -> driver by ID
- `POST /` -> become driver
- `PUT /verify/:id` -> toggle verification
- `PUT /location/:id` -> update live location
- `PUT /:id` -> update vehicle/license details
- `DELETE /:id` -> delete driver
- `GET /check/:id` -> check if user is a driver

### Ride Routes (`/api/rides`)

- `GET /requested` -> rides with `REQUESTED`
- `GET /` -> all rides
- `GET /:id` -> one ride
- `POST /` -> create ride
- `PUT /:id` -> full ride update
- `DELETE /:id` -> delete ride
- `GET /:id/driver` -> rides assigned to a driver
- `GET /:id/driver/dashboard` -> driver dashboard stats
- `GET /:id/driver/recent` -> recent trips for driver
- `GET /:id/driver/all` -> available rides + driver rides
- `PUT /:id/accept` -> accept requested ride
- `PUT /:id/start` -> start accepted ride
- `PUT /:id/complete` -> complete started ride
- `PUT /:id/cancel` -> cancel requested/accepted ride
- `GET /rider/:id/all` -> rider dashboard ride data

### Payment Routes (`/api/payments`)

- `GET /` -> all payments
- `GET /:id` -> payment by payment ID
- `GET /:id/check` -> payment by ride ID (success check)
- `POST /create-intent` -> create Stripe payment intent + DB row
- `POST /confirm` -> confirm payment from Stripe intent
- `PUT /:id` -> update payment
- `DELETE /:id` -> delete payment

## Business Logic Summary

- Ride fare:
  - distance from Haversine formula (`utils/distance.js`)
  - fare from `baseFare + perKmRate * distance`, minimum enforced (`utils/fare.js`)
- Ride lifecycle:
  - `REQUESTED` -> `ACCEPTED` -> `STARTED` -> `COMPLETED`
  - cancel allowed in `REQUESTED` or `ACCEPTED`
- Payments:
  - one successful payment per ride is enforced in code check (`getPaymentByRideId`)
  - platform fee and driver payout are calculated at creation

## Database Tables (Auto-created)

- `users`
- `drivers`
- `rides`
- `payments`

Schema is defined in `db.js` and executed via `initDB()`.

## Known Caveats

- In `routes/driverRoutes.js`, this route has a typo and is currently unreachable:
  - `router.put('/ /:id', toggleAvailability);`
  - it should likely be something like `router.put('/availability/:id', toggleAvailability);`
- CORS currently allows only `http://localhost:3000`.
