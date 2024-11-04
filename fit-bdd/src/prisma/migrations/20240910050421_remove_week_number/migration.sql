/*
  Warnings:

  - You are about to drop the column `weekNumber` on the `MealPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MealPlan" DROP COLUMN "weekNumber";

-- CreateTable
CREATE TABLE "ProvisionalWeightEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProvisionalWeightEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProvisionalWeightEntry_userId_month_year_key" ON "ProvisionalWeightEntry"("userId", "month", "year");

-- AddForeignKey
ALTER TABLE "ProvisionalWeightEntry" ADD CONSTRAINT "ProvisionalWeightEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
