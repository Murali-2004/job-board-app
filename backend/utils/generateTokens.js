import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (userId, tokenVersion) => {
  return jwt.sign(
    {
      userId,
      tokenVersion,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

export const generateRefreshToken = (userId, tokenVersion) => {
  return jwt.sign(
    {
      userId,
      tokenVersion,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );
};
