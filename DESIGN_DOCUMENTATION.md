# 🛒 Srini Commerce — Design Documentation

> Tech-Stack: Spring Boot · React · PostgreSQL · JWT

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Backend Design](#3-backend-design)
   - [Technology Stack](#31-technology-stack)
   - [Package Structure](#32-package-structure)
   - [Database Schema](#33-database-schema)
   - [REST API Endpoints](#34-rest-api-endpoints)
   - [Authentication & Security](#35-authentication--security)
4. [Frontend Design](#4-frontend-design)
   - [Technology Stack](#41-technology-stack)
   - [Routing & Pages](#42-routing--pages)
   - [State Management](#43-state-management)
   - [Design System](#44-design-system)
   - [Component Library](#45-component-library)
5. [UI/UX Design Principles](#5-uiux-design-principles)
6. [Data Flow](#6-data-flow)
7. [Key User Flows](#7-key-user-flows)

---

## 1. Project Overview

Srini Commerce is a full-stack e-commerce platform that allows users to browse products by category, manage a shopping cart, place orders, and track order history. An administrative dashboard is provided for managing products and viewing sales analytics.

### Core Features

The system is designed as a full-featured e-commerce platform with both user-facing and administrative capabilities. It implements secure JWT-based authentication, enabling users to sign up and log in with role-based access control for USER and ADMIN roles. Users can browse products efficiently through category-based filtering and search functionality, making product discovery intuitive. A client-side persistent shopping cart allows users to manage items with quantity controls seamlessly. During checkout, the system ensures stock validation and collects delivery address details to maintain order integrity. Additionally, users can view their complete order history on a dedicated "My Orders" page, with the option to cancel orders when applicable. On the administrative side, an integrated dashboard provides full control over product management through CRUD operations, along with sales analytics to monitor business performance.

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│                   React + Vite (Port 5173)              │
│   ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │
│   │AuthContext│  │CartContext│  │Pages / Components    │ │
│   └──────────┘  └──────────┘  └──────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │  HTTP/REST (JSON)
                         │  Authorization: Bearer <JWT>
┌────────────────────────▼────────────────────────────────┐
│                    BACKEND (API)                         │
│               Spring Boot 3.x (Port 8080)               │
│  ┌───────────┐  ┌──────────┐  ┌────────────────────┐   │
│  │Controllers│  │ Services  │  │   Security / JWT   │   │
│  └───────────┘  └──────────┘  └────────────────────┘   │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Repositories (Spring Data JPA)          │  │
│  └───────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │  JDBC
┌────────────────────────▼────────────────────────────────┐
│                   DATABASE                              │
│              PostgreSQL 15 (Port 5432)                  │
│          Database: mydb                                 │
└─────────────────────────────────────────────────────────┘
```

**Communication:** All frontend-to-backend communication is via REST API calls using `axios` through a centralized `api.js` client that automatically attaches the JWT Bearer token stored in `localStorage`.

---

## 3. Backend Design

### 3.1 Technology Stack

The application is built using a modern and robust technology stack designed for scalability and maintainability. At its core, it leverages Spring Boot (version 3.x) as the primary backend framework, running on Java version 17 or higher to ensure performance and compatibility with modern features. For data persistence, it utilizes Spring Data JPA in combination with Hibernate to handle object-relational mapping seamlessly. The database layer is powered by PostgreSQL version 15, providing a reliable and efficient storage solution. Security is implemented using Spring Security integrated with JWT (JSON Web Tokens) to enable stateless authentication and authorization. The project is managed and built using Apache Maven, which handles dependencies and build lifecycle. Additionally, schema management is configured with automatic synchronization using the ddl-auto=update setting, allowing the database schema to evolve alongside the application without manual intervention.

### 3.2 Package Structure

```
com.example.demo/
├── DemoApplication.java          # Entry point
├── controller/
│   ├── AuthController.java       # /api/auth/** (signup, login)
│   ├── ProductController.java    # /api/products/** (public)
│   ├── CategoryController.java   # /api/categories (public)
│   ├── OrderController.java      # /api/orders/** (authenticated)
│   ├── AdminProductController.java # /api/admin/products/** (ADMIN)
│   ├── AdminSalesController.java # /api/admin/sales/** (ADMIN)
│   └── HelloController.java      # /hello (health check)
├── entity/
│   ├── User.java
│   ├── Product.java
│   ├── Category.java
│   ├── Order.java
│   └── OrderItem.java
├── dto/                          # Data Transfer Objects
├── model/                        # Request/Response models
├── repository/                   # Spring Data JPA interfaces
├── service/                      # Business logic layer
└── security/                     # JWT filter, config, utilities
```

### 3.3 Database Schema

#### `users`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY |
| `email` | VARCHAR | UNIQUE, NOT NULL |
| `password` | VARCHAR | NOT NULL (BCrypt hashed) |
| `role` | VARCHAR | `'USER'` or `'ADMIN'` |

#### `categories`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY |
| `name` | VARCHAR | NOT NULL |

#### `products`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY |
| `name` | VARCHAR | NOT NULL |
| `description` | TEXT | — |
| `price` | DECIMAL | NOT NULL |
| `stock` | INTEGER | NOT NULL |
| `image_url` | VARCHAR | — |
| `category_id` | BIGINT | FK → `categories.id` |

#### `orders`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY |
| `user_id` | BIGINT | FK → `users.id` |
| `status` | VARCHAR | `PENDING`, `CONFIRMED`, `CANCELLED` |
| `total_amount` | DECIMAL | — |
| `created_at` | TIMESTAMP | — |
| `address` | TEXT | — |

#### `order_items`
| Column | Type | Constraints |
|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY |
| `order_id` | BIGINT | FK → `orders.id` |
| `product_id` | BIGINT | FK → `products.id` |
| `quantity` | INTEGER | NOT NULL |
| `price` | DECIMAL | Price at time of purchase |

### 3.4 REST API Endpoints

#### Authentication — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | None | Register new user |
| POST | `/api/auth/login` | None | Login, returns JWT token |

#### Products — `/api/products`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | None | List all products (with optional category filter) |
| GET | `/api/products/{id}` | None | Get product by ID |

#### Categories — `/api/categories`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/categories` | None | List all categories |

#### Orders — `/api/orders`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | USER | Place a new order (validates stock) |
| GET | `/api/orders/my` | USER | Get current user's orders |
| PUT | `/api/orders/{id}/cancel` | USER | Cancel an order |

#### Admin — `/api/admin`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/products` | ADMIN | List all products |
| POST | `/api/admin/products` | ADMIN | Create a product |
| PUT | `/api/admin/products/{id}` | ADMIN | Update a product |
| DELETE | `/api/admin/products/{id}` | ADMIN | Delete a product |
| GET | `/api/admin/sales` | ADMIN | Sales summary analytics |

### 3.5 Authentication & Security

- **Mechanism:** Stateless JWT (JSON Web Token)
- **Token Storage:** Browser `localStorage`
- **Token Expiry:** 86,400,000 ms (24 hours)
- **Password Hashing:** BCrypt via Spring Security
- **JWT Secret:** 256-bit hex key configured in `application.properties`
- **Filter Chain:** A custom `JwtAuthFilter` intercepts every request, validates the token, and sets the `SecurityContext`
- **CORS:** Configured to allow the React dev origin (`http://localhost:5173`)

---

## 4. Frontend Design

### 4.1 Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (with Vite) |
| Language | JavaScript (JSX) |
| Routing | React Router DOM v6 |
| HTTP Client | Axios (via `api.js`) |
| Icons | Lucide React |
| Fonts | Google Fonts — **Inter** |
| State | React Context API |
| Styling | Vanilla CSS with CSS Custom Properties |

### 4.2 Routing & Pages

| Route | Component | Access | Description |
|---|---|---|---|
| `/` | `Home.jsx` | Public | Product listing with hero banner & category filters |
| `/product/:id` | `ProductDetail.jsx` | Public | Individual product view with add-to-cart |
| `/login` | `Login.jsx` | Public | Login form |
| `/signup` | `Signup.jsx` | Public | Registration form |
| `/cart` | `Cart.jsx` | Public | Shopping cart with quantity management |
| `/checkout` | `Checkout.jsx` | USER | Multi-step checkout with address & payment |
| `/orders` | `Orders.jsx` | USER | Order history and cancellation |
| `/admin` | `AdminDashboard.jsx` | ADMIN | Product management & sales stats |

### 4.3 State Management

The app uses two React Contexts:

#### `AuthContext`
```
State:  user { id, email, role, token }
Actions: login(userData), logout()
Storage: Persisted to localStorage
```

#### `CartContext`
```
State:  cart [ { productId, name, price, quantity, stock } ]
Actions: addToCart(product), removeFromCart(id),
         updateQuantity(id, qty), clearCart()
Storage: In-memory (reset on page reload)
```

### 4.4 Design System

#### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#2563eb` | Primary actions, links, brand |
| `--primary-hover` | `#1d4ed8` | Hover state for primary |
| `--primary-light` | `#eff6ff` | Primary tint backgrounds |
| `--accent` | `#f97316` | Call-to-action, badges, highlights |
| `--accent-hover` | `#ea6c0a` | Hover state for accent |
| `--success` | `#16a34a` | Success states, completed steps |
| `--error` | `#dc2626` | Errors, destructive actions |
| `--bg` | `#f8fafc` | Page background |
| `--surface` | `#ffffff` | Cards, modals, navbar |
| `--surface-hover` | `#f1f5f9` | Hover over surfaces |
| `--border` | `#e2e8f0` | Default borders |
| `--border-strong` | `#cbd5e1` | Stronger borders |
| `--text` | `#0f172a` | Primary text |
| `--text-secondary` | `#475569` | Secondary text |
| `--text-muted` | `#94a3b8` | Placeholders, disabled text |

#### Typography

- **Font Family:** Inter (Google Fonts) — weights 300, 400, 500, 600, 700, 800
- **Font Smoothing:** `-webkit-font-smoothing: antialiased`

#### Spacing & Radius

| Token | Value |
|---|---|
| `--radius-sm` | `8px` |
| `--radius` | `12px` |
| `--radius-lg` | `20px` |

#### Shadows

| Token | Value |
|---|---|
| `--shadow-sm` | Subtle card shadow |
| `--shadow` | Elevated card shadow |
| `--shadow-lg` | Modal / dropdown shadow |

### 4.5 Component Library

#### Buttons

| Class | Style | Use Case |
|---|---|---|
| `.btn-primary` | Blue filled, subtle shadow | Main CTAs |
| `.btn-accent` | Orange filled, subtle shadow | Add to cart, buy now |
| `.btn-outline` | Transparent + border | Secondary actions |
| `.btn-ghost` | Transparent, no border | Nav items, icon buttons |

All buttons feature:
- `transition: all 0.2s ease`
- `translateY(-1px)` on hover for lift effect
- `box-shadow` elevation on hover

#### Badges

| Class | Color | Semantic Use |
|---|---|---|
| `.badge-blue` | Blue | Status: Pending / Info |
| `.badge-green` | Green | Status: Confirmed / Success |
| `.badge-red` | Red | Status: Cancelled / Error |
| `.badge-orange` | Orange | Status: Processing / Warning |

#### Cards

- `.card` — Standard product/content card with hover lift (`translateY(-4px)`)
- `.glass-card` — Admin dashboard stat cards with flat design
- `.product-card` — Product listing card with image container (`220px` height)

#### Forms

- `.input-group` — Label + input wrapper with 20px bottom margin
- Focus ring: `3px` blue tint ring on focus (`rgba(37,99,235,0.1)`)
- All inputs share consistent `11px 16px` padding

#### Utility Classes

| Class | Description |
|---|---|
| `.container` | Max-width `1320px`, padding `40px 5%`, centered |
| `.grid` | Auto-fill grid, min `260px` columns, `24px` gap |
| `.divider` | Horizontal rule using `--border` color |
| `.fade-up` | Entry animation — `opacity 0 → 1`, `translateY(20px → 0)` |
| `.toast` | Fixed bottom-right notification |
| `.stars` | Star rating — amber `#fbbf24` color |
| `.hero-section` | Blue gradient banner with decorative circles |
| `.category-pill` | Vertical icon + label filter button |
| `.step-indicator` | Multi-step progress tracker (checkout flow) |

---

## 5. UI/UX Design Principles

### Visual Strategy: Clean, White-Mode Commerce

The platform deliberately uses a **white-mode, light aesthetic** to maximize product visibility and conversion — modeled after leading commerce platforms.

1. **High Contrast, Minimal Noise** — Dark text (`#0f172a`) on white surfaces ensures maximum readability with no distractions.

2. **Purposeful Color Usage** — Color is used sparingly and semantically:
   - Blue = navigation & trust (primary actions)
   - Orange = urgency & purchase (add-to-cart, buy)
   - Green = success & confirmation
   - Red = destructive actions only

3. **Micro-animations for Engagement:**
   - Cards lift `4–6px` on hover with shadow escalation
   - Buttons lift `1px` on hover
   - Dropdown menus appear with subtle transitions
   - Page entry uses `fadeUp` animation

4. **Sticky Navigation** — The navbar is `position: sticky; top: 0` with `z-index: 200` so users always have access to cart and account actions during scrolling.

5. **Cart Badge** — A dynamic count badge overlays the cart icon to reduce friction and encourage checkout progression.

6. **Responsive Grid** — Product grids use `auto-fill` with `minmax(260px, 1fr)` to naturally adapt to any screen width without media queries.

7. **Accessible Focus States** — All interactive form elements display a visible `3px` focus ring colored in the primary blue.

---

## 6. Data Flow

### Login Flow
```
User enters email/password
        │
        ▼
POST /api/auth/login
        │
        ▼
Backend: validate credentials → generate JWT
        │
        ▼
Frontend: store { token, role, email } in AuthContext + localStorage
        │
        ▼
Axios interceptor attaches "Authorization: Bearer <token>" to all future requests
```

### Add to Cart → Checkout
```
User clicks "Add to Cart" on ProductDetail
        │
        ▼
CartContext.addToCart({ product, quantity })
        │
        ▼
User navigates to /cart → adjusts quantities
        │
        ▼
User proceeds to /checkout → enters shipping address
        │
        ▼
POST /api/orders (body: { items[], address })
Backend validates stock for each item
        │
    ┌───┴─────────────────┐
    │                     │
Stock OK              Insufficient stock
    │                     │
Order created         Error response → frontend shows error toast
    │
    ▼
CartContext.clearCart()
User redirected to /orders
```

---

## 7. Key User Flows

### 7.1 New User Registration
1. Navigate to `/signup`
2. Enter email + password → `POST /api/auth/signup`
3. Redirect to `/login`

### 7.2 Browsing & Filtering Products
1. Land on `/` (Home) — Hero banner + category pills
2. Click a category pill → products filtered by category
3. Use search bar → real-time client-side filter by name
4. Click product card → navigate to `/product/:id`

### 7.3 Placing an Order
1. Add items to cart from product detail page
2. Navigate to `/cart` — review items, adjust quantity
3. Click "Proceed to Checkout" → `/checkout`
4. Step 1: Enter shipping address
5. Step 2: Review order summary
6. Confirm → `POST /api/orders` with stock validation
7. Success → cart cleared, navigate to `/orders`

### 7.4 Admin: Manage Products
1. Log in with ADMIN-role account
2. Navigate to `/admin` via user dropdown
3. View product table → edit or delete existing products
4. Click "Add Product" → fill form → `POST /api/admin/products`
5. View sales summary at top of dashboard

---

## Appendix: Configuration Reference

### Backend (`application.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=postgres
spring.jpa.hibernate.ddl-auto=update
app.jwt.expiration-ms=86400000
```

### Frontend (`api.js`)
```js
// Base URL: http://localhost:8080
// Automatically attaches JWT from localStorage on every request
```

### CORS
- Frontend origin: `http://localhost:5173`
- Backend CORS allowed for full REST methods

---