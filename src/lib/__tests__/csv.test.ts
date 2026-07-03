import { describe, expect, it } from 'vitest';
import { buildCsv, escapeCsvValue } from '../csv';

describe('escapeCsvValue', () => {
  it('laisse les valeurs simples inchangées', () => {
    expect(escapeCsvValue('Dupont')).toBe('Dupont');
    expect(escapeCsvValue(15000)).toBe('15000');
  });

  it('convertit null et undefined en chaîne vide', () => {
    expect(escapeCsvValue(null)).toBe('');
    expect(escapeCsvValue(undefined)).toBe('');
  });

  it('met entre guillemets les valeurs contenant une virgule', () => {
    expect(escapeCsvValue('Yaoundé, Cameroun')).toBe('"Yaoundé, Cameroun"');
  });

  it('double les guillemets internes', () => {
    expect(escapeCsvValue('dit "Papa"')).toBe('"dit ""Papa"""');
  });

  it('protège les retours à la ligne', () => {
    expect(escapeCsvValue('ligne 1\nligne 2')).toBe('"ligne 1\nligne 2"');
  });

  it('formate les dates en français', () => {
    expect(escapeCsvValue(new Date(2026, 0, 15))).toBe('15/01/2026');
  });
});

describe('buildCsv', () => {
  it('assemble en-têtes et lignes', () => {
    const csv = buildCsv(['Nom', 'Montant'], [['Dupont', 5000], ['Martin, Jean', 200]]);
    expect(csv).toBe('Nom,Montant\nDupont,5000\n"Martin, Jean",200\n');
  });

  it('produit uniquement la ligne d\'en-têtes sans données', () => {
    expect(buildCsv(['A', 'B'], [])).toBe('A,B\n');
  });
});
