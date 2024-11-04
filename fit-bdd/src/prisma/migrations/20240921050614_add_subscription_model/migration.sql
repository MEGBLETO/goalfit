/*
  Warnings:

  - Added the required column `foodname` to the `Meal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MealPlan" DROP CONSTRAINT "MealPlan_userId_fkey";

-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "foodname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MealPlan" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
