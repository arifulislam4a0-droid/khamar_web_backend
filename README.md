# খামার কেন্দুয়া এগ্রো Backend

## Run

1. `.env.example` কপি করে `.env` বানান
2. dependency install করুন
   ```bash
   npm install
   ```
3. admin seed করুন
   ```bash
   npm run seed:admin
   ```
4. dev server run করুন
   ```bash
   npm run dev
   ```

## API Base

`http://localhost:5000/api`

## Admin Auth

### POST `/admin-auth/login`
```json
{
  "username": "admin",
  "password": "ChangeThisStrongPassword123!"
}
```

### GET `/admin-auth/profile`
Header:
```text
Authorization: Bearer YOUR_TOKEN
```

## Category
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`
- `PUT /categories/reorder/all`

## Product
- `GET /products/admin-home`
- `GET /products/:id`
- `GET /products/:id/share-link`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

## Public
- `GET /public/home`
- `GET /public/products/:slug`

## Order
- `POST /orders`
- `GET /orders?status=incoming`
- `PUT /orders/:id/status`
