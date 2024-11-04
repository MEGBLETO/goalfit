/*
  Warnings:

  - A unique constraint covering the columns `[contact]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `surname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "contact" TEXT,
ADD COLUMN     "surname" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_contact_key" ON "User"("contact");
