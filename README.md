# Srini Commerce

Srini Commerce is a full-stack e-commerce web application that allows users to browse products by category, manage a shopping cart, place orders, and track order history. Admins can manage products and view sales analytics through a dedicated dashboard.

- **Backend:** Spring Boot (Maven, Spring Web, Spring Data JPA, Spring Security, JWT, PostgreSQL)
- **Frontend:** React (Vite, functional components + hooks, React Router, Axios)

---

## Backend (Spring Boot)

**Location:** `demo/`

### Run

```bash
cd demo
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`.

### Configuration

Edit `demo/src/main/resources/application.properties` before running:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=postgres
spring.datasource.password=your_password
app.jwt.secret=your_jwt_secret
app.jwt.expiration-ms=86400000
```

Make sure PostgreSQL is running and the database `mydb` exists.

### Main Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | None | Register a new user |
| POST | `/api/auth/login` | None | Login and receive a JWT token |
| GET | `/api/products` | None | List all products (optional `?category=` filter) |
| GET | `/api/products/{id}` | None | Get a single product by ID |
| GET | `/api/categories` | None | List all categories |
| POST | `/api/orders` | USER | Place a new order (validates stock) |
| GET | `/api/orders/my` | USER | Get the current user's orders |
| PUT | `/api/orders/{id}/cancel` | USER | Cancel an order |
| GET | `/api/admin/products` | ADMIN | List all products (admin view) |
| POST | `/api/admin/products` | ADMIN | Create a new product |
| PUT | `/api/admin/products/{id}` | ADMIN | Update a product |
| DELETE | `/api/admin/products/{id}` | ADMIN | Delete a product |
| GET | `/api/admin/sales` | ADMIN | View sales summary analytics |

### Auth & Role Rules

- All requests to protected endpoints require the header: `Authorization: Bearer <token>`
- Token is returned from `/api/auth/login` and expires after **24 hours**.
- Two roles exist: `USER` (shopper) and `ADMIN` (store manager).
- Positive balance → should receive money; negative balance → owes money.

---

## Frontend (React)

**Location:** `frontend/`

### Install & Run

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

Make sure the backend is running before using the UI so API calls succeed.

### Pages

| Route | Description |
|---|---|
| `/` | Home — hero banner, category filters, product grid |
| `/product/:id` | Product detail page with add-to-cart |
| `/login` | Login form |
| `/signup` | Registration form |
| `/cart` | Shopping cart with quantity management |
| `/checkout` | Multi-step checkout with address input |
| `/orders` | Order history with cancellation option |
| `/admin` | Admin dashboard — product management + sales stats |

The app has four main parts:

- **Navbar** — sticky navigation with cart badge and user account dropdown
- **Product Listing** — filterable, searchable grid of products
- **Cart & Checkout** — multi-step order flow with real-time stock validation
- **Admin Dashboard** — product CRUD and sales analytics (ADMIN role only)

---

## Project Structure

```
demo/                         # Spring Boot backend
├── src/main/java/com/example/demo/
│   ├── controller/           # REST controllers
│   ├── entity/               # JPA entities (User, Product, Order, etc.)
│   ├── repository/           # Spring Data JPA repositories
│   ├── service/              # Business logic
│   ├── security/             # JWT filter and Spring Security config
│   └── dto/                  # Data Transfer Objects
└── src/main/resources/
    └── application.properties

frontend/                     # React frontend
└── src/
    ├── pages/                # Route-level page components
    ├── context/              # AuthContext, CartContext
    ├── api.js                # Axios instance with JWT interceptor
    ├── App.jsx               # Router and Navbar
    └── index.css             # Global design system (CSS variables)
```
