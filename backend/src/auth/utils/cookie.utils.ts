import config from "../../config/config";

export const setAuthCookie = (res: any, token: string): void => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: config.COOKIE_EXPIRES_IN * 1000,
    sameSite: "strict",
  });
};

export const clearAuthCookie = (res: any): void => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
