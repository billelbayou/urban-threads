import request from "supertest";
import app from "../app.js";

export function getAuthCookie(): string[] {
  return ["token=test-jwt-token"];
}

export { request, app };
