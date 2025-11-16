import config from "../config/config";

export const setAuthCookie = (res: any, token: string): void => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: config.COOKIE_EXPIRES_IN * 1000,
    sameSite: "none",
  });
};

export const clearAuthCookie = (res: any): void => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};
