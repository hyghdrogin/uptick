import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  APP_NAME: process.env.APP_NAME,
  MONGO_URL: process.env.MONGO_URL as string,
};

const incompleteEntry = Object.entries(config)
  .map(([key, value]) => [key, !!value])
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (incompleteEntry.length > 0) {
  throw new Error(`Missing Configuration: ${incompleteEntry.join(", ")}`);
}

export default config;
