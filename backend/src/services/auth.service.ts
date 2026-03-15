import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma.js";
import { generateToken } from "../utils/jwt.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";
import { Response } from "express";
import { Role } from "../generated/prisma/enums.js";
import config from "../config/config.js";
import {
  RegisterInput,
  LoginInput,
  UpdatePersonalInfoInput,
  UpdateShippingAddressInput,
} from "../schemas/index.js";

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Email is already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, config.BCRYPT_ROUNDS);

    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    return { message: "User created successfully", userId: user.id };
  }

  async login(data: LoginInput, res: Response) {
    const user = await prisma.user.findUnique({ 
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        country: true,
        city: true,
        state: true,
        postalCode: true,
        streetAddress: true,
        apartment: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      }
    });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user.id, user.role as Role);
    setAuthCookie(res, token);

    const { password: _, ...userWithoutPassword } = user;
    return { message: "You are logged in", user: userWithoutPassword };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        country: true,
        city: true,
        state: true,
        postalCode: true,
        streetAddress: true,
        apartment: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }

  async updatePersonalInfo(userId: string, data: UpdatePersonalInfoInput) {
    const updateData: Record<string, unknown> = {};
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.dateOfBirth !== undefined) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }

    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async updateShippingAddress(
    userId: string,
    data: UpdateShippingAddressInput,
  ) {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async logout(res: Response) {
    clearAuthCookie(res);
    return { message: "Logged out successfully" };
  }

  async getAllUsers(params: { page?: number; limit?: number } = {}) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteAccount(userId: string, res: Response) {
    // Orders have onDelete: Cascade or we manual delete?
    // In order.controller it was manual deleteMany for orders.
    await prisma.order.deleteMany({
      where: { userId },
    });

    // Cart and wishlist will be cascade deleted if set in schema
    await prisma.user.delete({
      where: { id: userId },
    });

    clearAuthCookie(res);
    return { message: "Account deleted successfully" };
  }
}

export const authService = new AuthService();
