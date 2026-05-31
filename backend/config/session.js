import MongoStore from "connect-mongo";
import dotenv from "dotenv";

dotenv.config();

/**
 * @description Express-session configuration with MongoDB-backed session store.
 * Uses secure cookies in production and lax cookies in development.
 * Sessions expire after 14 days in the store and cookies last 1 day.
 */
export const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    ttl: 14 * 24 * 60 * 60, // 14 days
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};
