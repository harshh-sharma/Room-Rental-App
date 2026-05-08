import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./routes/auth.js";
import propertyRouter from "./routes/property.js";
import roomRouter from "./routes/room.js";
import agreementRouter from "./routes/agreement.js";
import billRouter from "./routes/bill.js";
import renterRouter from "./routes/reading.js"
import paymentConfigRouter from "./routes/paymentConfig.routes.js"
import paymentRouter from "./routes/payment.routes.js"
import errorMiddleware from "./middlewares/error.middleware.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get('/', (req, res) => {
    return res.send("API is Live ");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', userRouter);
app.use('/api/properties', propertyRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/agreements', agreementRouter);
app.use('/api/bills', billRouter);
app.use('/api/renter', renterRouter);
app.use('/api/payment-config', paymentConfigRouter);
app.use('/api/payment', paymentRouter);



app.use(errorMiddleware)

export default app;

