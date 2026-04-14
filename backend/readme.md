# 🚀 Backend Setup (Initial)

This README covers the **basic backend setup only** (current stage).

---

# 📦 Tech Stack (Current)

* Node.js
* Express
* Prisma
* PostgreSQL
* JWT
* Zod
* Winston
* Nodemailer
* Helmet
* CORS
* Morgan

---

# 📁 Project Structure

```
project-root/
│
├── src/
│   ├── app.js
│   ├── server.js
│
├── .env
├── package.json
```

---

# ⚙️ Environment Variables

Create a `.env` file in root:

```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
```

---

# 📦 Install Dependencies

```bash
npm install express cors dotenv bcrypt jsonwebtoken zod prisma @prisma/client winston nodemailer helmet express-rate-limit morgan express-async-handler
```

### Dev Dependency

```bash
npm install -D nodemon
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

# 🧱 Basic Server Setup

## src/server.js

```js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## src/app.js

```js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

export default app;
```

---

# 🧠 Notes

* `dotenv.config()` is used only in `server.js`
* `app.js` contains only Express setup
* This is the base setup before adding Prisma, Auth, etc.

---
