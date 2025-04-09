import express from "express";
import cors from "cors";
import { config } from "dotenv";
import indexRouter from "../src/routers";
import { env } from "../src/utils/validateEnv";

const app = express();
app.use(express.json());
app.use(cors({}));

app.use(`/api/${env.API_VERSION}`, indexRouter);

app.listen(env.PORT, () => {
  console.log(`Server is running on port: ${env.PORT}`);
});

export default app;
