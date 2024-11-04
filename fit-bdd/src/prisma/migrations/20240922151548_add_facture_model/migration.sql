-- CreateTable
CREATE TABLE "Facture" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "s3url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
