import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Capability -> roles allowed (mirrors PRD §4 RBAC matrix).
const MATRIX: Record<string, Role[]> = {
  'catalogue.browse': [Role.CUSTOMER, Role.DRIVER, Role.ADMIN, Role.DEVELOPER],
  'booking.create': [Role.CUSTOMER, Role.ADMIN, Role.DEVELOPER],
  'booking.viewOwn': [Role.CUSTOMER],
  'booking.cancelOwn': [Role.CUSTOMER, Role.ADMIN, Role.DEVELOPER],
  'trip.viewAssigned': [Role.DRIVER, Role.ADMIN, Role.DEVELOPER],
  'trip.updateStatus': [Role.DRIVER, Role.ADMIN, Role.DEVELOPER],
  'trip.cancelAssigned': [Role.DRIVER, Role.ADMIN, Role.DEVELOPER],
  'trip.recordPayment': [Role.DRIVER, Role.ADMIN, Role.DEVELOPER],
  'booking.assignDriver': [Role.ADMIN, Role.DEVELOPER],
  'booking.confirm': [Role.ADMIN, Role.DEVELOPER],
  'rateCard.edit': [Role.ADMIN, Role.DEVELOPER],
  'content.manage': [Role.ADMIN, Role.DEVELOPER],
  'review.moderate': [Role.ADMIN, Role.DEVELOPER],
  'report.view': [Role.ADMIN, Role.DEVELOPER],
  'user.manage': [Role.DEVELOPER],
  'rbac.manage': [Role.DEVELOPER],
  'settings.manage': [Role.DEVELOPER],
  'audit.view': [Role.DEVELOPER],
};

const ALL_ROLES: Role[] = [
  Role.CUSTOMER,
  Role.DRIVER,
  Role.ADMIN,
  Role.DEVELOPER,
];

async function seedRbac(): Promise<void> {
  for (const [capability, allowedRoles] of Object.entries(MATRIX)) {
    for (const role of ALL_ROLES) {
      const allowed = allowedRoles.includes(role);
      await prisma.rolePermission.upsert({
        where: { role_capability: { role, capability } },
        update: { allowed },
        create: { role, capability, allowed },
      });
    }
  }
}

async function seedDeveloper(): Promise<void> {
  const email = 'amolmane303@gmail.com';
  const passwordHash = await bcrypt.hash('Mane@321', 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      name: 'Amol Mane',
      email,
      mobile: '9503082953',
      role: Role.DEVELOPER,
      passwordHash,
    },
  });
}

// Images: Wikimedia Commons (CC-BY-SA), hotlink-safe and license-clean —
// not scraped from Google Images, which would carry no reuse rights.
// Rates: LOCAL/OUTSTATION/PICK_DROP/RENTAL base + extra/km, roughly tiered
// by vehicle class — starting points only, edit any of them from the admin
// panel's Vehicles & Rate Cards tab.
const VEHICLES = [
  { id: 'veh_sedan', name: 'Sedan', seating: 4, luggage: 2, fuelType: 'Petrol',
    features: ['AC', 'Music System', '4 Seats'],
    description:
      'A comfortable, fuel-efficient sedan built for airport runs and city hops — a roomy boot, a smooth ride, and easy to park on busy streets.',
    images: ['https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/vehicals/sedan.png'],
    rates: { LOCAL: 1500, OUTSTATION: 4500, PICK_DROP: 600, RENTAL: 1200 } },
  { id: 'veh_swift_dzire', name: 'Swift Dzire', seating: 4, luggage: 2, fuelType: 'Petrol',
    features: ['AC', 'Compact Sedan', '4 Seats'],
    description:
      'The Maruti Suzuki Swift Dzire — a proven, fuel-efficient compact sedan and one of India\'s most popular cab choices for city and airport trips.',
    images: ['https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/vehicals/swift_dzire.png'],
    // Real outstation tariff: 300km/₹4000, ₹13/extra km.
    rates: { LOCAL: 1500, OUTSTATION: 4000, PICK_DROP: 600, RENTAL: 1200 },
    outstationExtraKm: 13 },
  { id: 'veh_aura', name: 'Aura', seating: 4, luggage: 2, fuelType: 'Petrol',
    features: ['AC', 'Compact Sedan', '4 Seats'],
    description:
      'The Hyundai Aura — a nimble, well-appointed compact sedan, comfortable for city runs and short trips out of town.',
    images: ['https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/vehicals/aura.png'],
    rates: { LOCAL: 1400, OUTSTATION: 4200, PICK_DROP: 550, RENTAL: 1100 } },
  { id: 'veh_ertiga', name: 'Ertiga', seating: 6, luggage: 3, fuelType: 'Diesel',
    features: ['AC', 'Spacious', '6 Seats'],
    description:
      'Our go-to family MPV. Three rows of seating and generous luggage room make it the natural pick for group outstation trips and full-family outings.',
    images: ['https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/vehicals/Ertiga.png'],
    // Real outstation tariff: 300km/₹5000, ₹16/extra km.
    rates: { LOCAL: 1800, OUTSTATION: 5000, PICK_DROP: 700, RENTAL: 1400 },
    outstationExtraKm: 16 },
  { id: 'veh_rumion', name: 'Toyota Rumion', seating: 7, luggage: 3, fuelType: 'Petrol',
    features: ['AC', '3-Row MPV', '7 Seats'],
    description:
      'The Toyota Rumion — a spacious 7-seat MPV backed by Toyota\'s reliability, well suited to family outstation trips and airport group transfers.',
    images: ['https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/vehicals/Toyota_Rumion.png'],
    rates: { LOCAL: 1800, OUTSTATION: 5200, PICK_DROP: 700, RENTAL: 1400 } },
  { id: 'veh_kia_carens', name: 'Kia Carens', seating: 6, luggage: 3, fuelType: 'Petrol',
    features: ['AC', 'Premium MPV', '6 Seats'],
    description:
      'The Kia Carens — a modern 3-row MPV with a premium cabin, captain seats, and plenty of room for family trips and small group travel.',
    images: ['https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/vehicals/kia_carens.png'],
    rates: { LOCAL: 2000, OUTSTATION: 5800, PICK_DROP: 750, RENTAL: 1550 } },
  { id: 'veh_suv', name: 'SUV', seating: 7, luggage: 4, fuelType: 'Diesel',
    features: ['AC', 'Powerful', '7 Seats'],
    description:
      'A powerful 7-seater SUV for long-distance comfort — commanding road presence, higher ground clearance, and space for the whole group plus luggage.',
    images: ['https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/vehicals/suv.png'],
    rates: { LOCAL: 2200, OUTSTATION: 6200, PICK_DROP: 800, RENTAL: 1700 } },
  { id: 'veh_kia_ev', name: 'Kia EV', seating: 5, luggage: 3, fuelType: 'Electric',
    features: ['AC', 'Electric', '5 Seats'],
    description:
      'The Kia EV6 — a fully electric SUV with a premium, whisper-quiet ride. A great pick for local and short outstation trips where charging is convenient.',
    images: ['https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/vehicals/kia_ev.png'],
    rates: { LOCAL: 2300, OUTSTATION: 6500, PICK_DROP: 850, RENTAL: 1800 } },
  { id: 'veh_innova_crysta', name: 'Innova Crysta', seating: 7, luggage: 4, fuelType: 'Diesel',
    features: ['AC', 'Premium MPV', '7 Seats'],
    description:
      'The Toyota Innova Crysta — our top-tier MPV, prized for its ride comfort, reliability, and space on long outstation drives.',
    images: ['https://matoshreecabs-assets-2026.s3.ap-south-1.amazonaws.com/vehicals/innova.png'],
    // Real outstation tariff: 300km/₹6000, ₹20/extra km.
    rates: { LOCAL: 2500, OUTSTATION: 6000, PICK_DROP: 900, RENTAL: 1900 },
    outstationExtraKm: 20 },
];

// Vehicles retired from this list (renamed/replaced) but not deleted, since
// deleting would break any existing booking that references them (Postgres
// FK restrict) — deactivating keeps history intact while hiding them from
// the public catalogue, same as the admin "Deactivate" action.
const RETIRED_VEHICLE_IDS = ['veh_kia', 'veh_nexon'];

async function seedVehicles(): Promise<void> {
  for (const v of VEHICLES) {
    await prisma.vehicle.upsert({
      where: { id: v.id },
      update: { name: v.name, description: v.description, seating: v.seating, luggage: v.luggage,
        fuelType: v.fuelType, features: v.features, images: v.images },
      create: {
        id: v.id, name: v.name, description: v.description, seating: v.seating,
        luggage: v.luggage, fuelType: v.fuelType, features: v.features, images: v.images,
      },
    });
    for (const [mode, baseRate] of Object.entries(v.rates)) {
      const extraKmRate =
        mode === 'OUTSTATION' && (v as any).outstationExtraKm !== undefined
          ? (v as any).outstationExtraKm
          : 12;
      const data = {
        baseRate,
        packageKm: 300,
        extraKmRate,
        extraHrRate: mode === 'LOCAL' || mode === 'RENTAL' ? 100 : 0,
        driverAllowance: mode === 'OUTSTATION' ? 300 : 0,
      };
      await prisma.rateCard.upsert({
        where: { vehicleId_mode: { vehicleId: v.id, mode: mode as any } },
        // `update` used to be `{}` — a real bug: re-running the seed never
        // actually applied new rate numbers to existing rows. Now it does.
        update: data,
        create: { vehicleId: v.id, mode: mode as any, ...data },
      });
    }
  }

  await prisma.vehicle.updateMany({
    where: { id: { in: RETIRED_VEHICLE_IDS } },
    data: { status: 'DISABLED' },
  });
}

// Starter route-fare mappings — the fixed, admin-editable fares that
// actually drive what a customer is charged (RateCard above is just the
// "starting from" reference shown on a cab's page). Anything not listed
// here has no fixed fare yet, so booking it falls back to a WhatsApp quote.
async function seedRouteFares(): Promise<void> {
  for (const v of VEHICLES) {
    // Local — stays within Pune. Reuses the LOCAL rate as the flat fare.
    await prisma.routeFare.upsert({
      where: { vehicleId_mode_fromCity_toCity: { vehicleId: v.id, mode: 'LOCAL', fromCity: 'Pune', toCity: 'Pune' } },
      update: {},
      create: { vehicleId: v.id, mode: 'LOCAL', fromCity: 'Pune', toCity: 'Pune', baseFare: v.rates.LOCAL, tollCharge: 0, gstPercent: 0 },
    });

    // Outstation — Pune <-> Mumbai, both directions, with an expressway toll.
    for (const [fromCity, toCity] of [['Pune', 'Mumbai'], ['Mumbai', 'Pune']] as const) {
      await prisma.routeFare.upsert({
        where: { vehicleId_mode_fromCity_toCity: { vehicleId: v.id, mode: 'OUTSTATION', fromCity, toCity } },
        update: {},
        create: { vehicleId: v.id, mode: 'OUTSTATION', fromCity, toCity, baseFare: v.rates.OUTSTATION, tollCharge: 400, gstPercent: 0 },
      });
    }

    // Pick & Drop — Pune <-> Mumbai Airport.
    for (const [fromCity, toCity] of [['Pune', 'Mumbai Airport'], ['Mumbai Airport', 'Pune']] as const) {
      await prisma.routeFare.upsert({
        where: { vehicleId_mode_fromCity_toCity: { vehicleId: v.id, mode: 'PICK_DROP', fromCity, toCity } },
        update: {},
        create: { vehicleId: v.id, mode: 'PICK_DROP', fromCity, toCity, baseFare: v.rates.OUTSTATION, tollCharge: 400, gstPercent: 0 },
      });
    }
  }
}

async function main(): Promise<void> {
  await seedRbac();
  await seedDeveloper();
  await seedVehicles();
  await seedRouteFares();
  // eslint-disable-next-line no-console
  console.log('Seed complete: RBAC matrix + developer (amolman303@gmail.com).');
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  })
  .finally(() => prisma.$disconnect());

