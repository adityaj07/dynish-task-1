import { config } from "dotenv";
import { cleanEnv, port, str } from "envalid";
config();

export const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  PORT: port(),
  API_VERSION: str(),
  FE_URL: str(),
  API_URL: str(),
  VAPID_PUBLIC_KEY: str(),
  VAPID_PRIVATE_KEY: str(),
  VAPID_SUBJECT: str(),
});
