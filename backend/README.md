# Bloomskin API (Express + PostgreSQL + Brevo)

## 1. Instalar dependencias

```bash
cd backend
npm install
```

## 2. Variables de entorno

```bash
cp .env.example .env
```

Completa al menos:

- `DATABASE_URL`
- `JWT_SECRET`
- `BREVO_API_KEY` (si usaras correos)
- `BREVO_SENDER_EMAIL`

## 3. Crear esquema en PostgreSQL

Ejecuta `backend/sql/schema.sql` en tu base de datos.

## 4. Crear primer usuario admin

1. Registra un usuario con `POST /api/auth/register`.
2. En PostgreSQL, cambia el rol:

```sql
UPDATE users SET role = 'admin' WHERE email = 'tu-correo@dominio.com';
```

## 5. Levantar API

```bash
npm run dev
```

API base: `http://localhost:5000`

## Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `GET /api/products`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `PATCH /api/products/:id/stock` (admin)
- `DELETE /api/products/:id` (admin)
- `POST /api/email/send-test` (admin, Brevo)
