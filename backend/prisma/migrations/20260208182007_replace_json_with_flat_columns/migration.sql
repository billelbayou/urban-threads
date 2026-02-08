/*
  Warnings:

  - You are about to drop the column `personalInfos` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddresse` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "personalInfos",
DROP COLUMN "shippingAddresse",
ADD COLUMN     "apartment" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "streetAddress" TEXT;
