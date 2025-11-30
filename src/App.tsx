import React, { useState, useEffect, useRef } from 'react'
import { formatDhms, secondsToDhms, secondsToEarnAmount } from './utils/time'
import Textbox from './components/Textbox'

export default function App(): React.ReactElement {
  // Salaire annuel brut en dollars USD — valeur initiale 1 000 000
  const [salary, setSalary] = useState<number>(1000000)
  // Taux d'imposition en pourcentage — valeur initiale 30 (%)
  const [taxRate, setTaxRate] = useState<number>(30)
  // Nombre de jours de congé — valeur initiale 25
  const [vacationDays, setVacationDays] = useState<number>(25)
  // Temps de travail par jour (heures) — valeur initiale 8
  const [hoursPerDay, setHoursPerDay] = useState<number>(8)
  // montant cible entré par l'utilisateur
  const [targetAmount, setTargetAmount] = useState<number>(1000)

  const formatUsd = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
  }

  const formatUsdCents = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
  }

  // Constantes simples pour le calcul du salaire journalier
  // On considère 52 semaines -> 104 jours de weekend (samedi + dimanche) par an
  const WEEKEND_DAYS_PER_YEAR = 52 * 2
  const WORKING_DAYS_PER_YEAR = 365 - WEEKEND_DAYS_PER_YEAR

  const netAnnual = Math.round(salary * (1 - taxRate / 100))
  const effectiveWorkingDays = Math.max(WORKING_DAYS_PER_YEAR - vacationDays, 0)
  const netPerWorkday = effectiveWorkingDays > 0 ? Math.round(netAnnual / effectiveWorkingDays) : 0
  const netPerHour = hoursPerDay > 0 ? netPerWorkday / hoursPerDay : 0

  // Montant perçu depuis l'arrivée sur la page (temps réel)
  const startTimeRef = useRef<number>(Date.now())
  const [elapsedMs, setElapsedMs] = useState<number>(0)
  // état stockant le montant perçu depuis l'arrivée — mis à jour en temps réel
  const [amountSinceArrivalState, setAmountSinceArrivalState] = useState<number>(0)

  useEffect(() => {
    // start timer once on mount (do not reset when inputs change)
    startTimeRef.current = Date.now()
    const id = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      setElapsedMs(elapsed)
    }, 100) // mise à jour toutes les 0.1s
    return () => clearInterval(id)
  }, [])

  // re-calculer le nombre total de millisecondes travaillées par an
  const workingMsPerYear = (effectiveWorkingDays > 0 && hoursPerDay > 0)
    ? effectiveWorkingDays * hoursPerDay * 3600 * 1000
    : 365 * 24 * 3600 * 1000 // fallback si pas de jours ouvrés ou heures définis

  // mettre à jour immédiatement le montant perçu si un des inputs change ou si le timer avance
  useEffect(() => {
    if (workingMsPerYear <= 0) {
      setAmountSinceArrivalState(0)
      return
    }

    setAmountSinceArrivalState((netAnnual / workingMsPerYear) * elapsedMs)
  }, [netAnnual, elapsedMs, workingMsPerYear])

  const amountSinceArrival = amountSinceArrivalState

  // temps nécessaire (en secondes) pour gagner le montant ciblé selon le salaire net et les ms travaillés par an
  const secondsNeededForTarget = secondsToEarnAmount(targetAmount, netAnnual, workingMsPerYear)
  const targetTimeLabel = (!isFinite(secondsNeededForTarget) || secondsNeededForTarget < 0)
    ? 'N/A'
    : `${formatDhms(Math.ceil(secondsNeededForTarget), hoursPerDay)} (${Math.ceil(secondsNeededForTarget)}s)`

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Whats wrong with my life</h1>
      </header>
      <main>
        <section style={{ minWidth: 720, margin: '1rem auto' }}>
          {/* Contrôles regroupés : salaire, taux d'imposition, jours de congé */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 12,
              marginBottom: 6,
            }}
          >
            <Textbox
              id="salary-input"
              label="Salaire annuel brut (USD)"
              type="number"
              step={1000}
              min={0}
              value={salary}
              onChange={(v) => setSalary(Number(v) || 0)}
            />

            <Textbox
              id="tax-input"
              label="Taux d'imposition (%)"
              type="number"
              step={0.1}
              min={0}
              max={100}
              value={taxRate}
              onChange={(v) => setTaxRate(Number(v) || 0)}
            />

            <Textbox
              id="vacation-input"
              label="Nombre de jours de congé"
              type="number"
              step={1}
              min={0}
              max={365}
              value={vacationDays}
              onChange={(v) => setVacationDays(Number(v) || 0)}
            />

            <Textbox
              id="hours-input"
              label="Temps de travail par jour (heures)"
              type="number"
              step={0.5}
              min={0}
              max={24}
              value={hoursPerDay}
              onChange={(v) => setHoursPerDay(Number(v) || 0)}
            />

            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <Textbox
                  id="target-input"
                  label="Montant cible (USD)"
                  type="number"
                  step={1}
                  min={0}
                  value={targetAmount}
                  onChange={(v) => setTargetAmount(Number(v) || 0)}
                />
              </div>
              <div style={{ fontSize: 13, color: '#333', minWidth: 160 }} aria-live="polite">
                {targetTimeLabel}
              </div>
            </div>
          </div>

          {/* résumé affiché ci-dessous */}


          <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>

            <div>
              <strong>Montant perçu depuis l'arrivée :</strong> {formatUsdCents(amountSinceArrival)}
              <div style={{ fontSize: 12, color: '#666' }}>
                {/* breakdown détaillé (affiche une seule fois) */}
                <div style={{ fontSize: 11, color: '#888' }}>
                  {(() => {
                    const parts = secondsToDhms(Math.floor(elapsedMs / 1000), hoursPerDay)
                    return `${parts.days}j ${parts.hours}h ${parts.minutes}m ${parts.seconds}s`
                  })()}
                </div>
              </div>
            </div>

            {/* Temps nécessaire pour atteindre un montant cible */}
            <div>
              <strong>Temps pour gagner </strong>{' '}
              <span style={{ fontWeight: 700 }}>{formatUsd(targetAmount)}</span>
              <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                {(() => {
                  const secondsNeeded = secondsToEarnAmount(targetAmount, netAnnual, workingMsPerYear)
                  if (!isFinite(secondsNeeded) || secondsNeeded < 0) return 'N/A'
                  // arrondir vers le haut pour être conservateur
                  return `${formatDhms(Math.ceil(secondsNeeded), hoursPerDay)} (${Math.ceil(secondsNeeded)}s)`
                })()}
              </div>
            </div>

            {/* Le rappel du taux d'imposition a été supprimé (l'input reste) */}

            {/* 'Salaire net estimé' supprimé car doublon — on garde 'Salaire annuel net estimé' plus bas */}

            {/* rappel du nombre de jours de congé supprimé (input conservé) */}

            {/* rappel des jours ouvrés supprimé (inclut weekends logique gardée) */}

            {/* rappel des jours ouvrés restants supprimé (logique conservée) */}

            <div>
              <strong>Salaire annuel net estimé :</strong> {formatUsd(netAnnual)}
            </div>

            <div>
              <strong>Salaire journalier net :</strong>{' '}
              {effectiveWorkingDays > 0 ? formatUsd(netPerWorkday) : 'N/A'}
            </div>

            {/* rappel des heures de travail supprimé (input conservé) */}

            <div>
              <strong>Salaire horaire net (estimation) :</strong>{' '}
              {effectiveWorkingDays > 0 && hoursPerDay > 0 ? formatUsdCents(netPerHour) : 'N/A'}
            </div>
          </div>

          {/* plus d'inputs — tout est géré dans le groupe ci-dessus */}
        </section>
      </main>
    </div>
  )
}
