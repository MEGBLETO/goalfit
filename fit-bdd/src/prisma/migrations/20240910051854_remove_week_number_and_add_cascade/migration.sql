/*
  Warnings:

  - You are about to drop the column `weekNumber` on the `WorkoutPlan` table. All the data in the column will be lost.
  - You are about to drop the `_WorkoutToWorkoutPlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "_WorkoutToWorkoutPlan" DROP CONSTRAINT "_WorkoutToWorkoutPlan_A_fkey";

-- DropForeignKey
ALTER TABLE "_WorkoutToWorkoutPlan" DROP CONSTRAINT "_WorkoutToWorkoutPlan_B_fkey";

-- AlterTable
ALTER TABLE "ProvisionalWeightEntry" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "workoutPlanId" INTEGER;

-- AlterTable
ALTER TABLE "WorkoutPlan" DROP COLUMN "weekNumber";

-- DropTable
DROP TABLE "_WorkoutToWorkoutPlan";

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_workoutPlanId_fkey" FOREIGN KEY ("workoutPlanId") REFERENCES "WorkoutPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
