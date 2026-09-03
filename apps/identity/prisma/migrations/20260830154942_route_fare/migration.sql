-- CreateTable
CREATE TABLE "RouteFare" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "mode" "BookingMode" NOT NULL,
    "fromCity" TEXT NOT NULL,
    "toCity" TEXT NOT NULL,
    "baseFare" DECIMAL(10,2) NOT NULL,
    "tollCharge" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "gstPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RouteFare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RouteFare_mode_fromCity_toCity_idx" ON "RouteFare"("mode", "fromCity", "toCity");

-- CreateIndex
CREATE UNIQUE INDEX "RouteFare_vehicleId_mode_fromCity_toCity_key" ON "RouteFare"("vehicleId", "mode", "fromCity", "toCity");

-- AddForeignKey
ALTER TABLE "RouteFare" ADD CONSTRAINT "RouteFare_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

