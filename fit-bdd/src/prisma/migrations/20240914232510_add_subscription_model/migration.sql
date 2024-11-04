/*
  Warnings:

  - Added the required column `status` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
