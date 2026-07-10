# Nordi Native Mobile App

Native iOS and Android foundation for Northbridge Digital customers.

Built with Expo, React Native, and TypeScript. This app is a thin client over the Phase 22 authenticated dashboard transport endpoint.

## Prerequisites

- Node.js 20+
- npm
- Xcode (for iOS simulator)
- Android Studio (for Android emulator)
- Expo CLI (`npx expo`)

## Environment

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_API_BASE_URL` | NDP API base URL (default `http://localhost:3000`) |
| `EXPO_PUBLIC_ORGANIZATION_ID` | Default organization for dashboard requests |
| `EXPO_PUBLIC_DASHBOARD_VERSION` | Requested dashboard BFF version |

## Development sign-in

Phase 22 in-memory bearer tokens:

- `token-customer-1` — multi-team access to `org-acme`
- `token-customer-2` — single-team access to `org-acme`

Start the NDP web server first:

```bash
cd ../..
npm run dev
```

Then start the mobile app:

```bash
cd apps/nordi-mobile
npm install
npm start
```

Run platforms:

```bash
npm run ios
npm run android
```

## Validation

```bash
npm run typecheck
npm test
npm run validate:expo
```

From the repository root, also run Phase 22 transport tests:

```bash
npx vitest run lib/ndp/mobile-bff/dashboard-service/
```

## Architecture

```
Native App (Expo Router)
    ↓
MobileDashboardApiClient
    ↓
GET /api/mobile/v1/dashboard
    ↓
Dashboard BFF + Composition Engine
```

The app renders server-provided DTOs only. It does not compose dashboard sections, aggregate recommendations, or infer KPIs locally.

## Store configuration

- iOS bundle identifier: `com.northbridge.nordi`
- Android application ID: `com.northbridge.nordi`
- EAS profiles: `development`, `preview`, `production` (see `eas.json`)

Store submission is out of scope for this phase.

## Limitations

- Development bearer-token auth only
- Dashboard tab is fully connected; other tabs are native placeholders
- Read-only offline cache for last successful dashboard when network fails
- No chat, workforce messaging, approvals, billing, or team management
- No physical device testing performed in CI for this phase
