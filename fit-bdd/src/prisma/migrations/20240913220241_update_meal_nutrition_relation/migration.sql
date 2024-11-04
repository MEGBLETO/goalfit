/*
  Warnings:

  - A unique constraint covering the columns `[userId,day]` on the table `WorkoutPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkoutPlan_userId_day_key" ON "WorkoutPlan"("userId", "day");
