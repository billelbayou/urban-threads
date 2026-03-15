// middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // safeParse or parse will use your schema logic
      const validatedData = await schema.parseAsync(req.body);

      // Replace req.body with the cleaned/coerced data from Zod
      req.body = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "fail",
          errors: error.flatten().fieldErrors,
        });
        return;
      }
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  };
