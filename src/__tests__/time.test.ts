import { describe, it, expect } from 'vitest'
import { secondsToDhms, formatDhms, secondsToEarnAmount } from '../utils/time'

describe('secondsToDhms', () => {
  it('convertit 0 seconde', () => {
    expect(secondsToDhms(0)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  })

  it('convertit 1 seconde', () => {
    expect(secondsToDhms(1)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 1 })
  })

  it('convertit 90 secondes', () => {
    expect(secondsToDhms(90)).toEqual({ days: 0, hours: 0, minutes: 1, seconds: 30 })
  })

  it('convertit 3661 secondes (1h 1m 1s)', () => {
    expect(secondsToDhms(3661)).toEqual({ days: 0, hours: 1, minutes: 1, seconds: 1 })
  })

  it('convertit 90061 secondes (1j 1h 1m 1s)', () => {
    expect(secondsToDhms(90061)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 })
  })

  it('gère valeurs négatives', () => {
    expect(secondsToDhms(-90061)).toEqual({ days: -1, hours: -1, minutes: -1, seconds: -1 })
  })

  it('utilise dayHours différent de 24 (exemple 8h)', () => {
    // 1 jour = 8h = 28800s. 28800 + 3600 + 60 + 1 = 32461
    expect(secondsToDhms(32461, 8)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 })
  })

  it('utilise dayHours fractionnaire (7.5h)', () => {
    // 1 jour = 7.5h = 27000s. 27000 + 3600 + 60 + 1 = 30661
    expect(secondsToDhms(30661, 7.5)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 })
  })

  it('gère négatif quand dayHours custom', () => {
    expect(secondsToDhms(-32461, 8)).toEqual({ days: -1, hours: -1, minutes: -1, seconds: -1 })
  })
})

describe('formatDhms', () => {
  it('formate 0 seconde', () => {
    expect(formatDhms(0)).toBe('0s')
  })

  it('formate 3661 secondes', () => {
    expect(formatDhms(3661)).toBe('1h 1m 1s')
  })

  it('formate 90061 secondes', () => {
    expect(formatDhms(90061)).toBe('1j 1h 1m 1s')
  })

  it('formate en utilisant dayHours custom', () => {
    expect(formatDhms(32461, 8)).toBe('1j 1h 1m 1s')
  })

  it('calcul secondsToEarnAmount basique', () => {
    // netAnnual = 3600 USD pour simplifier, workingMsPerYear = 3600 * 1000 ms -> rate = 0.001 USD/ms (=> 1 USD par 1000 ms)
    const seconds = secondsToEarnAmount(1, 3600, 3600 * 1000)
    expect(seconds).toBeCloseTo(1, 6) // 1 second
  })
})
