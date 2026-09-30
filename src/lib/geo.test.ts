import { describe, expect, it } from 'vitest';
import { distanceKm } from './geo';

describe('distanceKm', () => {
  it('ноль для одной точки', () => expect(distanceKm({ lat: 51.77, lng: 55.1 }, { lat: 51.77, lng: 55.1 })).toBe(0));
  it('градус широты ≈ 111 км', () => expect(distanceKm({ lat: 50, lng: 55 }, { lat: 51, lng: 55 })).toBeCloseTo(111.2, 0));
  it('Москва — Санкт-Петербург ≈ 634 км', () =>
    expect(distanceKm({ lat: 55.7558, lng: 37.6173 }, { lat: 59.9343, lng: 30.3351 })).toBeCloseTo(634, -1));
});
