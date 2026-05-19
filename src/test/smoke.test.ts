import { describe, it, expect } from 'vitest';

describe('Sprint 0 — smoke test', () => {
  it('Vitest tourne', () => {
    expect(1 + 1).toBe(2);
  });

  it('TS strict actif (le check passe à la compile)', () => {
    const x: number = 42;
    expect(x).toBe(42);
  });
});
