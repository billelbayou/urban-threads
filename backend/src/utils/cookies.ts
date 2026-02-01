import { Response } from "express";
import config from "../config/config.js";

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: config.COOKIE_EXPIRES_IN * 1000,
    sameSite: "none",
  });
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};
