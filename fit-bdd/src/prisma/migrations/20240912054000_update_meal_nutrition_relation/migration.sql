/*
  Warnings:

  - You are about to drop the column `mealId` on the `Nutrition` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_nutritionId_fkey";

-- DropIndex
DROP INDEX "Nutrition_mealId_key";

-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "nutritionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Nutrition" DROP COLUMN "mealId";

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_nutritionId_fkey" FOREIGN KEY ("nutritionId") REFERENCES "Nutrition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
