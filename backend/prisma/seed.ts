import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/utils/prisma";
import config from "../src/config/config";

async function main() {
  console.log("Seeding database...");

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: config.ADMIN_EMAIL },
  });

  if (existingAdmin) {
    console.log("Admin user already exists!");
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(config.ADMIN_PASSWORD, 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      firstName: config.ADMIN_FIRST_NAME,
      lastName: config.ADMIN_LAST_NAME,
      email: config.ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created successfully!");
  console.log({
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
