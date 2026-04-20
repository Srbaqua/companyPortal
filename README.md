# Company Suggestion Portal

Full-stack portal to collect student company recommendations and manage them through an admin dashboard.

---

## 1) What this project does

### Student Portal (`/`)
- View landing page
- Open suggestion form
- Submit:
  - Company Name *(required)*
  - Student Name *(required)*
  - Branch *(required)*
  - Reason *(optional)*
- Receive success/error toast feedback

### Admin Portal (`/admin`)
- Authenticate with admin key
- View suggestions by status:
  - New (includes duplicate)
  - Approved
  - Rejected
- Accept/reject suggestions
- View counts/stat cards
- Trigger export/download actions (backend route dependent)

---

## 2) Tech stack

### Client
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React icons

### Server
- Node.js + Express (API)
- Database-backed suggestion storage (MongoDB-style `_id` assumed by UI)

---

## 3) High-level architecture

- **Client** sends API calls to `NEXT_PUBLIC_API_URL`
- **Server** validates input/admin key, updates suggestion status, returns JSON
- **Admin routes** require `x-admin-key` header

---

## 4) Expected project structure

```text
company-portal/
├─ README.md
├─ client/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ globals.css
│  │  ├─ page.tsx              # Home + Suggestion form
│  │  └─ admin/
│  │     └─ page.tsx           # Admin dashboard
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ .env.local
└─ server/
   ├─ src/
   │  ├─ index.(ts|js)
   │  ├─ routes/
   │  ├─ controllers/
   │  ├─ models/
   │  └─ middleware/
   ├─ package.json
   └─ .env
```

---

## 5) API contract used by client

Base URL: `NEXT_PUBLIC_API_URL`

| Method | Route | Purpose | Headers |
|---|---|---|---|
| POST | `/api/suggestions` | Create suggestion | `Content-Type: application/json` |
| GET | `/api/admin/suggestions` | Fetch all suggestions for admin | `x-admin-key` |
| POST | `/api/admin/accept/:id` | Mark suggestion as approved | `x-admin-key` |
| POST | `/api/admin/reject/:id` | Mark suggestion as rejected | `x-admin-key` |

> Export endpoints can be added server-side and wired to admin buttons.

---

## 6) Setup instructions

## Prerequisites
- Node.js 18+
- npm 9+
- Running database for server

## Install dependencies

### Terminal 1: Server
```powershell
cd c:\Users\SourabhC\Desktop\company-portal\server
npm install
```

### Terminal 2: Client
```powershell
cd c:\Users\SourabhC\Desktop\company-portal\client
npm install
npm install framer-motion lucide-react
```

---

## 7) Environment variables

### Client: `client/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Server: `server/.env` (example)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/company_portal
ADMIN_KEY=your_strong_admin_key
CORS_ORIGIN=http://localhost:3000
```

---

## 8) Run in development

### Start server
```powershell
cd c:\Users\SourabhC\Desktop\company-portal\server
npm run dev
```

### Start client
```powershell
cd c:\Users\SourabhC\Desktop\company-portal\client
npm run dev
```

Open:
- Client: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

---

## 9) Functional flow

1. Student opens `/`
2. Student submits form
3. Server stores suggestion with status `new` (or `duplicate` if implemented)
4. Admin opens `/admin`, enters key
5. Admin reviews list and accepts/rejects
6. Status updates reflected in dashboard counters/tabs

---

## 10) Data model (minimum)

```ts
type Suggestion = {
  _id: string;
  companyName: string;
  studentName: string;
  branch: string;
  reason: string;
  status: "new" | "duplicate" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
};
```

---

## 11) Scripts (typical)

### Client
- `npm run dev` – start Next dev server
- `npm run start` – run production build
- `npm run lint` – lint code

### Server
- `npm run dev` – start API in watch mode
- `npm run start` – start API
- `npm run import:companies` – import sample companies from CSV


---

## 12) Troubleshooting

### Admin fetch fails
- Verify `NEXT_PUBLIC_API_URL`
- Verify server is running
- Verify `x-admin-key` value matches `ADMIN_KEY`

### CORS errors
- Set `CORS_ORIGIN=http://localhost:3000` in server `.env`
- Enable CORS middleware on server

---



## 14) Future improvements

- Proper admin auth (JWT/session)
- Pagination/search/filter in admin list
- CSV/XLS export routes
- Audit logs for admin actions
- Unit + integration tests (client and server)

---
