# Notification Service (Carrick Demo)

This service is part of a multi-repository microservice demo showcasing Carrick's ability to detect cross-repository API inconsistencies.

Built with [Hono 4](https://hono.dev) served over Node.js via `@hono/node-server`.

## Overview

The Notification Service is a stateless aggregator. It holds no data of its own: every response is assembled from live calls to the User Service and the Order Service.

## API Endpoints

### Service Status
- **URL**: `/api/notifications/status`
- **Method**: GET
- **Upstream calls**: `GET {USER_SERVICE_URL}/api/users` (reads `count`), `GET {ORDER_SERVICE_URL}/api/orders` (reads array length)
- **Response**:
  ```typescript
  {
    service: string;
    status: string;
    timestamp: string;
    userCount: number;
    orderCount: number;
  }
  ```
- If either upstream call fails, the endpoint still responds `200` with `userCount` and `orderCount` zeroed and `status` set to `"active"`. It never returns a non-200.

### Order Notification Detail
- **URL**: `/api/notifications/order/:id`
- **Method**: GET
- **Upstream calls**: `GET {ORDER_SERVICE_URL}/api/orders/:id`
- **Response**:
  ```typescript
  {
    orderDetails: OrderWithUser;
    message: string;
  }
  ```
- `orderDetails` is the Order Service response body re-emitted unchanged.
- Returns `404` (empty body) when the Order Service returns `404`, and `500` (empty body) on any other failure.

## Configuration

Environment variables:
- `PORT` - Port to run the service on (default: 3003)
- `USER_SERVICE_URL` - URL of the User Service (default: http://localhost:3001)
- `ORDER_SERVICE_URL` - URL of the Order Service (default: http://localhost:3002)

## Development

### Install Dependencies
```bash
npm install
```

### Start in Development Mode
```bash
npm run dev
```

### Build TypeScript
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Carrick Configuration

This service includes a `carrick.json` configuration file that identifies:
- Service name: `notification-service`
- Depends on `USER_SERVICE_URL` for user data
- Depends on `ORDER_SERVICE_URL` for order data
- Internal domains: `localhost:3001`, `localhost:3002`

## Type Definitions

Type definitions in the `types/` directory define the API contract for this service:
- `User` - Imported from User Service to ensure compatibility
- `Order` and `OrderWithUser` - Imported from Order Service to ensure compatibility
- `Notification` and `OrderNotificationData` - Reserved for future notification persistence; not used by the current endpoints

These shared type definitions enable Carrick to detect API inconsistencies across repositories.
<!-- carrick: cross-repo PR-rerun test trigger -->

Last Carrick pipeline test: 2026-07-10 (onboarding walkthrough).

Scanned with carrick 0.3.0 (type-compat v2).
Verdict backfill pass after order-service 0.3.0 stub landed.
Re-scan on carrick 0.3.1 (v2 correctness batch: poison containment, wrapped-envelope, inline-literal).
<!-- carrick reindex 1784718195-24376 (v2 verdict persistence) -->