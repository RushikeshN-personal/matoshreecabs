-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_customerId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "guestMobile" TEXT,
ADD COLUMN     "guestName" TEXT,
ALTER COLUMN "customerId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_guestMobile_idx" ON "Booking"("guestMobile");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

