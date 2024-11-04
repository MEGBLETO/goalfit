-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "bodyPart" TEXT,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Workout" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropEnum
DROP TYPE "SubscriptionStatus";
