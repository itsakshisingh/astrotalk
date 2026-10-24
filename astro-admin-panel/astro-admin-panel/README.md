# Jyotish Console — Admin Panel (UI only)

React + Vite + Tailwind CSS admin panel for the astrology platform, with two roles:
**Super Admin** and **Astrologer**. This is a UI-only build — all data is mocked in
`src/data/mockData.js` — wire it up to your Express backend once the UI is approved.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). On the login screen,
pick a role tab (Super Admin / Astrologer) and submit with any email/password — it's
a UI mock, so it logs you straight in.

```bash
npm run build      # production build into /dist
npm run preview    # preview the production build locally
```

## Project structure

```
src/
  main.jsx                 entry point, wraps app in BrowserRouter
  App.jsx                  all routes + role-based guards
  index.css                Tailwind directives + font import
  context/AppContext.jsx   role state + mock CRUD actions (login, approve, status change...)
  data/mockData.js         mock data — replace with real API calls
  components/
    AppLayout.jsx           sidebar + topbar shell
    Sidebar.jsx              role-aware nav links
    Topbar.jsx               search / notifications / account
    ProtectedRoute.jsx       redirects to /login, restricts pages by role
    ProductModal.jsx         add-product form
    ui.jsx                   Avatar, Badge, StatCard, EmptyState, etc.
  pages/
    Login.jsx
    Dashboard.jsx
    PendingAstrologers.jsx  (super admin only)
    AllAstrologers.jsx      (super admin only)
    Appointments.jsx        (both — filtered by role)
    Products.jsx            (both — filtered by role)
    Profile.jsx             (astrologer only)
```

## Routes → your backend endpoints

Each page's header shows the matching endpoint(s) in-app. Summary:

| Page                    | Route              | Backend endpoint(s) |
|--------------------------|--------------------|----------------------|
| Login                    | `/login`           | `POST /api/auth/login` |
| Dashboard                 | `/`                | — (aggregate of below) |
| Pending Astrologers       | `/astrologers/pending` | `GET /api/admin/astrologers/pending`, `PATCH /api/admin/astrologers/:id/status` |
| All Astrologers           | `/astrologers`     | `GET /api/admin/astrologers` |
| Appointments (admin)      | `/appointments`    | `GET /api/appointments`, `PATCH /api/appointments/:id/status` |
| My Appointments (astro.)  | `/appointments`    | `GET /api/appointments/astrologer/:astrologerId`, `PATCH /api/appointments/:id/status` |
| Products (admin)          | `/products`        | `GET /api/products`, `POST /api/products`, `DELETE /api/products/:id` |
| My Products (astrologer)  | `/products`        | `GET /api/products/creator/:userId`, `POST /api/products`, `DELETE /api/products/:id` |
| My Profile (astrologer)   | `/profile`         | `GET /api/astrologer/profile/:userId`, `PUT /api/astrologer/profile/:userId` |

## Connecting to your real backend

1. Replace the arrays in `src/data/mockData.js` with `fetch`/`axios` calls inside
   `src/context/AppContext.jsx` (e.g. in a `useEffect` on mount, or in `login()`).
2. Swap the mock `login()` in `AppContext.jsx` for a real call to
   `POST /api/auth/login`, store the returned JWT (e.g. in memory or `httpOnly` cookie
   if your backend supports it), and attach it to subsequent requests.
3. `decideAstrologer`, `changeAppointmentStatus`, `addProduct`, and `deleteProduct` in
   `AppContext.jsx` are where you'd fire the corresponding `PATCH` / `POST` / `DELETE`
   requests instead of only updating local state.
4. For product/profile image uploads, use `FormData` and post to
   `/api/upload/profile-image`, `/api/upload/product-image`, or
   `/api/upload/product-images` (or directly to `POST /api/products` with
   `multipart/form-data`, since that route accepts files too).

## Notes

- Tailwind theme uses the default palette (slate/amber/emerald/rose/violet) — deep
  midnight background with a brass-gold accent, avoiding the generic purple-gradient
  "mystic" look.
- Fully responsive: sidebar becomes an off-canvas drawer under `md` breakpoint, tables
  scroll horizontally on small screens.
- `lucide-react` is used for icons — already in `package.json`.
