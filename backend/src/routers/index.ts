import { Router } from "express";
import orderRouter from "./order";

const indexRouter = Router({ mergeParams: true });

indexRouter.use("/orders", orderRouter);

export default indexRouter;
