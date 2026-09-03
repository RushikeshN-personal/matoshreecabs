-- CreateEnum
CREATE TYPE "DriverApplicationStatus" AS ENUM ('NEW', 'REVIEWING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "DriverApplication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT NOT NULL,
    "licenceNo" TEXT NOT NULL,
    "licenceExpiry" TIMESTAMP(3),
    "experienceYrs" INTEGER NOT NULL DEFAULT 0,
    "ownsVehicle" BOOLEAN NOT NULL DEFAULT false,
    "vehicleType" TEXT,
    "vehicleNumber" TEXT,
    "preferredTrips" TEXT,
    "notes" TEXT,
    "status" "DriverApplicationStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriverApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DriverApplication_status_idx" ON "DriverApplication"("status");

