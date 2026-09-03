-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('REQUESTED', 'DRIVER_ASSIGNED', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CLOSED', 'NEEDS_REASSIGNMENT', 'CANCELLED');
ALTER TABLE "Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'REQUESTED';
COMMIT;

-- DropForeignKey
ALTER TABLE "Refund" DROP CONSTRAINT "Refund_bookingId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "advance",
DROP COLUMN "balance",
ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelledBy" "Role";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "proofImage",
DROP COLUMN "type",
DROP COLUMN "upiTxnId",
DROP COLUMN "verificationStatus",
DROP COLUMN "verifiedAt",
DROP COLUMN "verifiedBy",
ADD COLUMN     "recordedBy" TEXT,
ALTER COLUMN "method" SET DEFAULT 'CASH';

-- DropTable
DROP TABLE "Refund";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "PaymentType";

-- DropEnum
DROP TYPE "RefundStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "DriverProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

