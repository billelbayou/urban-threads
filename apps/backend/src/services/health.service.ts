import { Request, Response } from "express";
import { s3Client } from "../services/storage.service.js";
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { prisma } from "../utils/prisma.js";

export const getHealth = async (_req: Request, res: Response) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    services: {
      database: "UNKNOWN",
      storage: "UNKNOWN",
    },
  };

  try {
    // 1. Check Database
    await prisma.$queryRaw`SELECT 1`;
    healthcheck.services.database = "HEALTHY";

    // 2. Check Storage
    await s3Client.send(new ListBucketsCommand({}));
    healthcheck.services.storage = "HEALTHY";

    res.status(200).json(healthcheck);
  } catch (error: any) {
    healthcheck.message = error.message;
    // We return 503 (Service Unavailable) if a core dependency is down
    res.status(503).json(healthcheck);
  }
};
