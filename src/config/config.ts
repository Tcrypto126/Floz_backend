// Import dotenv and call config method
import * as dotenv from 'dotenv';
dotenv.config();

type Environments = {
  db_uri: string;
};

type Config = {
  development: Environments;
  production: Environments;
};

const config = {
  development: {
    db_uri: process.env.DEV_DB_URI as string || "mongodb://127.0.0.1:27017/costestimate",
  },
  production: {
    db_uri: process.env.DB_URI as string,
  },
};

type ObjectIndex = keyof typeof config;

const mode: ObjectIndex =
  (process.env.NODE_ENV as ObjectIndex) || ("development" as ObjectIndex);

export default config[mode];
