import { describe, expect, it } from 'vitest';
import { addMinutesToTime, timeRangesOverlap, timeToMinutes } from '../timeUtils';

describe('timeToMinutes', () => {
  it('convertit une heure en minutes depuis minuit', () => {
    expect(timeToMinutes('00:00')).toBe(0);
    expect(timeToMinutes('08:30')).toBe(510);
    expect(timeToMinutes('18:00')).toBe(1080);
  });
});

describe('addMinutesToTime', () => {
  it('ajoute des minutes en gérant le passage à l\'heure suivante', () => {
    expect(addMinutesToTime('08:00', 30)).toBe('08:30');
    expect(addMinutesToTime('08:45', 30)).toBe('09:15');
    expect(addMinutesToTime('09:00', 0)).toBe('09:00');
  });
});

describe('timeRangesOverlap', () => {
  it('détecte un chevauchement partiel', () => {
    // RDV de 45 min qui commence avant le créneau testé
    expect(timeRangesOverlap('08:30', '09:00', '08:00', '08:45')).toBe(true);
    // Créneau qui commence pendant un RDV
    expect(timeRangesOverlap('08:15', '08:45', '08:00', '09:00')).toBe(true);
  });

  it('détecte un chevauchement total', () => {
    expect(timeRangesOverlap('08:00', '09:00', '08:00', '09:00')).toBe(true);
    expect(timeRangesOverlap('08:15', '08:30', '08:00', '09:00')).toBe(true);
  });

  it('accepte des créneaux adjacents sans les considérer en conflit', () => {
    expect(timeRangesOverlap('08:00', '08:30', '08:30', '09:00')).toBe(false);
    expect(timeRangesOverlap('09:00', '09:30', '08:30', '09:00')).toBe(false);
  });

  it('accepte des créneaux disjoints', () => {
    expect(timeRangesOverlap('08:00', '08:30', '10:00', '10:30')).toBe(false);
  });
});
