import { Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RouteFareService } from './route-fare.service';
import { fareQuoteSchema } from '@matoshreecabs/shared';
import type { FareQuoteInput } from '@matoshreecabs/shared';

@Controller('fares')
export class RouteFareController {
  constructor(private readonly routeFares: RouteFareService) {}

  // Public — no auth. Returns { found: false } rather than a 404/error when
  // there's no mapped route, so the frontend can show a WhatsApp CTA instead
  // of treating it as a failure.
  @Get('quote')
  async quote(@Query(new ZodValidationPipe(fareQuoteSchema)) query: FareQuoteInput) {
    // LOCAL trips are single-city — the destination stop's city is ignored
    // for pricing purposes even if it technically differs from the pickup.
    const toCity = query.mode === 'LOCAL' ? query.fromCity : query.toCity;
    if (!toCity) return { found: false as const };
    const fare = await this.routeFares.findFare(query.vehicleId, query.mode, query.fromCity, toCity);
    if (!fare) return { found: false as const };
    return { found: true as const, fare };
  }
}
