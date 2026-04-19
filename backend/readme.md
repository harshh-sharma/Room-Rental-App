# 🚀 Room Rental Backend (API)

This is a **production-ready backend** for a Room Rental & Property Management System.

It includes authentication, property management, validation, and clean architecture.

---

# 📦 Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* JWT Authentication
* Zod (Validation)
* Winston (Logging)
* Nodemailer (Email Service)
* Helmet (Security)
* CORS
* Morgan (Logging)

---

# 📁 Project Structure

```
project-root/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   ├── mailer.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── property.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── property.service.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── property.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validate.js
│   │
│   ├── validators/
│   │   ├── auth.validate.js
│   │   ├── property.validate.js
│   │
│   ├── utils/
│   │   ├── AppError.js
│   │   ├── asyncHandler.js
│   │   ├── logger.js
│   │   ├── sendMail.js
│   │
│   ├── app.js
│   ├── server.js
│
├── prisma/
│   ├── schema.prisma
│
├── .env
├── package.json
```

---

# ⚙️ Environment Variables

Create a `.env` file:

```
PORT=5000
DATABASE_URL=your_postgres_url

JWT_SECRET=your_secret
JWT_EXPIRY=5h

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

# 📦 Installation

```bash
npm install
```

---

# ▶️ Run Project

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

---

# 🧠 Features Implemented

## 🔐 Authentication

* User Registration
* Email Verification (with expiry)
* Login with JWT
* Protected Routes
* Role-based Authorization (OWNER, RENTER, ADMIN)

---

## 🏠 Property Module

### Owner APIs

* Create Property
* Get My Properties
* Update Property
* Delete Property

### Public APIs

* Get Public Properties
* Filter (city, state, search)
* Pagination support
* Get Single Property (public + private logic)

---

## ✅ Validation

* Zod-based request validation
* Centralized validation middleware

---

## 🛡️ Security

* Helmet (HTTP security)
* JWT authentication
* Role-based access control

---

## 📧 Email System

* Email verification via Nodemailer
* Token-based verification with expiry

---

## 📊 Logging

* Winston logger
* Console + file logging

---

# 🔗 API Endpoints

## Auth

```
POST   /api/auth/register
GET    /api/auth/verify-email
POST   /api/auth/login
GET    /api/auth/profile
```

---

## Property

```
POST   /api/properties           (Create)
GET    /api/properties/my        (Owner properties)
GET    /api/properties/public    (Public properties)
GET    /api/properties/:id       (Single property)
PUT    /api/properties/:id       (Update)
DELETE /api/properties/:id       (Delete)
```

---

# 🧠 Architecture

```text
Controller → Service → Prisma → Database
```

* Controllers → handle request/response
* Services → business logic
* Prisma → DB interaction

---

# ⚡ Notes

* `asyncHandler` used for error handling
* `AppError` for custom errors
* Clean separation of concerns
* Scalable structure for future modules (Rooms, Billing, etc.)

---

# 🚀 Upcoming Features

* Room Management
* Rent & Billing System
* Payment Integration (Razorpay)
* Notifications
* Analytics Dashboard

---

# 👨‍💻 Author

Harsh Sharma
MERN Stack Developer
