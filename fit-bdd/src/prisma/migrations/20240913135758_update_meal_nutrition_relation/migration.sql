/*
  Warnings:

  - A unique constraint covering the columns `[userId,day]` on the table `MealPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MealPlan_userId_day_key" ON "MealPlan"("userId", "day");
