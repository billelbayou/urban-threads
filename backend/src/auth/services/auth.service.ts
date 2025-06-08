import { generateToken } from "../utils/jwt.utils";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user.id);
    return { user, token };
  }

  async register(userData: { email: string; password: string; name: string }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await this.hashPassword(userData.password);
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);
    return { user, token };
  }

  async getCurrentUser(userId: string) {
    return prisma.user.findUnique({ where: { id: userId } });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export default new AuthService();
