-- DropForeignKey
ALTER TABLE "MealPlan" DROP CONSTRAINT "MealPlan_afternoonMealId_fkey";

-- DropForeignKey
ALTER TABLE "MealPlan" DROP CONSTRAINT "MealPlan_eveningMealId_fkey";

-- DropForeignKey
ALTER TABLE "MealPlan" DROP CONSTRAINT "MealPlan_morningMealId_fkey";

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_morningMealId_fkey" FOREIGN KEY ("morningMealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_afternoonMealId_fkey" FOREIGN KEY ("afternoonMealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_eveningMealId_fkey" FOREIGN KEY ("eveningMealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
