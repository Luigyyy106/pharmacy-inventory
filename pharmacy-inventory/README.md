# PharmaDSA — Pharmacy Inventory Management System
### React + Node.js/Express + Supabase (PostgreSQL)

A full-stack pharmacy inventory system featuring real implementations of classic Data Structures & Algorithms — powered by **Supabase** as the cloud database backend.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Recharts                  |
| Backend   | Node.js, Express                    |
| Database  | Supabase (PostgreSQL)               |
| DB Driver | `pg` (node-postgres)                |
| HTTP      | Axios                               |
| DSA       | Custom JS implementations           |

---

## What Changed from MySQL Version

| Area            | Before (MySQL)              | After (Supabase/PostgreSQL)          |
|-----------------|-----------------------------|--------------------------------------|
| `package.json`  | `mysql2`                    | `pg`                                 |
| `config/db.js`  | `mysql2` Pool               | `pg` Pool + SSL + `?` → `$n` helper  |
| Schema types    | `INT AUTO_INCREMENT`        | `SERIAL`                             |
| Schema types    | `DECIMAL`                   | `NUMERIC`                            |
| Schema types    | `TIMESTAMP`                 | `TIMESTAMPTZ`                        |
| Schema types    | `ENUM(...)`                 | `VARCHAR + CHECK`                    |
| Insert return   | `result.insertId`           | `RETURNING id` → `rows[0].id`        |
| Placeholders    | `?`                         | `$1, $2, ...` (auto-converted)       |
| Connection      | localhost credentials        | Supabase connection string + SSL     |
| updated_at      | `ON UPDATE CURRENT_TIMESTAMP`| PostgreSQL trigger function          |

> The `pool.execute()` helper in `db.js` automatically converts `?` placeholders to `$1,$2,...` so **all route files stay identical** to the MySQL version.

---

## Project Structure

```
pharmacy-inventory/
├── database/
│   └── schema.sql              ← PostgreSQL schema (run in Supabase SQL Editor)
├── backend/
│   ├── server.js
│   ├── .env                    ← Supabase connection string goes here
│   ├── package.json            ← uses `pg` instead of `mysql2`
│   ├── config/
│   │   └── db.js               ← pg Pool with SSL + ? → $n converter
│   ├── algorithms/
│   │   └── dsa.js              ← Unchanged (pure JS, DB-agnostic)
│   └── routes/
│       ├── medicines.js        ← RETURNING id for INSERT
│       └── transactions.js
└── frontend/                   ← Unchanged (React)
    └── src/
        └── components/
```

---

## Algorithms Implemented

### Sorting

| Algorithm      | Best       | Average    | Worst      | Space    |
|----------------|------------|------------|------------|----------|
| Quick Sort     | O(n log n) | O(n log n) | O(n²)      | O(log n) |
| Merge Sort     | O(n log n) | O(n log n) | O(n log n) | O(n)     |
| Heap Sort      | O(n log n) | O(n log n) | O(n log n) | O(1)     |
| Insertion Sort | O(n)       | O(n²)      | O(n²)      | O(1)     |
| Selection Sort | O(n²)      | O(n²)      | O(n²)      | O(1)     |
| Bubble Sort    | O(n)       | O(n²)      | O(n²)      | O(1)     |

### Searching

| Algorithm     | Time     | Space | Requirement  |
|---------------|----------|-------|--------------|
| Linear Search | O(n)     | O(1)  | None         |
| Binary Search | O(log n) | O(1)  | Sorted array |

### Data Structures

| Structure  | Use Case                                           |
|------------|----------------------------------------------------|
| Min-Heap   | Priority queue sorted by earliest expiry date      |
| Hash Map   | O(1) medicine lookup by ID                         |

---

## Setup — Step by Step

### Step 1 — Create a Supabase Project

1. Go to **https://supabase.com** and sign in (or create a free account).
2. Click **New Project**, give it a name (e.g. `pharmacy-inventory`), set a strong DB password, and choose a region close to you.
3. Wait ~1 minute for the project to provision.

---

### Step 2 — Run the Schema in Supabase

1. In your Supabase project, go to **SQL Editor** → **New Query**.
2. Open `database/schema.sql` from this project.
3. Paste the entire contents into the SQL Editor.
4. Click **Run** (▶).

You should see 25 medicines and 6 sample transactions seeded automatically.

> To verify: go to **Table Editor** → `medicines` → you should see 25 rows.

---

### Step 3 — Get Your Supabase Connection String

1. In Supabase, go to **Project Settings** → **Database**.
2. Scroll down to **Connection string** → select the **URI** tab.
3. Copy the string — it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefgh.supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with the password you set when creating the project.

---

### Step 4 — Configure the Backend `.env`

Open `backend/.env` and paste your connection string:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
PORT=5000
```

That's the only value you need. The `DB_HOST`, `DB_USER`, etc. fields are fallbacks and can be left as-is.

---

### Step 5 — Install & Run the Backend

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
✅  Connected to Supabase PostgreSQL
🏥  Pharmacy Inventory API running on port 5000
```

Test it: open **http://localhost:5000/api/health** — you should get a JSON `OK` response.

---

### Step 6 — Install & Run the Frontend

Open a **second terminal**:

```bash
cd frontend
npm install
npm start
```

App opens at **http://localhost:3000**. Both terminals must stay running.

---

## API Reference

### Medicines

| Method | Endpoint                                | Description                     |
|--------|-----------------------------------------|---------------------------------|
| GET    | `/api/medicines`                        | List all (sort + search params) |
| GET    | `/api/medicines/:id`                    | Get single medicine             |
| POST   | `/api/medicines`                        | Add new medicine                |
| PUT    | `/api/medicines/:id`                    | Update medicine                 |
| DELETE | `/api/medicines/:id`                    | Delete medicine                 |
| POST   | `/api/medicines/:id/stock`              | Stock in / out / adjustment     |
| GET    | `/api/medicines/analytics/stats`        | Inventory statistics            |
| GET    | `/api/medicines/analytics/expiry-queue` | Min-heap expiry priority list   |

#### Query Parameters — `GET /api/medicines`

| Param        | Options                                                      | Default  |
|--------------|--------------------------------------------------------------|----------|
| `sortBy`     | `name` `price` `quantity` `expiry_date` `category` `brand`  | `name`   |
| `order`      | `asc` `desc`                                                 | `asc`    |
| `algorithm`  | `quick` `merge` `heap` `bubble` `selection` `insertion`      | `quick`  |
| `search`     | any string                                                   | —        |
| `searchAlgo` | `linear` `binary`                                            | `linear` |
| `category`   | category name or `all`                                       | `all`    |

### Transactions

| Method | Endpoint                           | Description                   |
|--------|------------------------------------|-------------------------------|
| GET    | `/api/transactions`                | All transactions (latest 50)  |
| GET    | `/api/transactions/medicine/:id`   | Transactions for one medicine |

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `SSL connection required` | Already handled — `ssl: { rejectUnauthorized: false }` is set in `db.js` |
| `password authentication failed` | Wrong password in `DATABASE_URL`. Re-copy from Supabase → Settings → Database |
| `connection refused` | Check your Project Ref in the URL. It should be `db.XXXXXXXX.supabase.co` |
| `relation "medicines" does not exist` | Schema hasn't been run yet — go to Supabase SQL Editor and run `schema.sql` |
| `Module not found: pg` | Run `npm install` inside the `backend/` folder |

---

## License

MIT — free to use for academic or commercial purposes.
