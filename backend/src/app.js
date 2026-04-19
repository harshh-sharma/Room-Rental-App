import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./routes/auth.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get('/', (req, res) => {
    return res.send("API is Live ");
});

app.use('/api/auth', userRouter);
app.use(errorMiddleware)

export default app;

