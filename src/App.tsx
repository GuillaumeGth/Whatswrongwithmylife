import React, { useState, useEffect, useRef } from 'react'

export default function App(): React.ReactElement {
  // Salaire annuel brut en dollars USD — valeur initiale 1 000 000
  const [salary, setSalary] = useState<number>(1000000)
  // Taux d'imposition en pourcentage — valeur initiale 30 (%)
  const [taxRate, setTaxRate] = useState<number>(30)
  // Nombre de jours de congé — valeur initiale 25
  const [vacationDays, setVacationDays] = useState<number>(25)
  // Temps de travail par jour (heures) — valeur initiale 8
  const [hoursPerDay, setHoursPerDay] = useState<number>(8)

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

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Bienvenue — Whatswrongwithmylife (Vite + React + TypeScript)</h1>
        <p>Application de démarrage créée automatiquement.</p>
      </header>
      <main>
        <section style={{ maxWidth: 720, margin: '1rem auto' }}>
          {/* Contrôles regroupés : salaire, taux d'imposition, jours de congé */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 12,
              marginBottom: 6,
            }}
          >
            <div>
              <label htmlFor="salary-input" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Salaire annuel brut (USD)
              </label>
              <input
                id="salary-input"
                type="number"
                step={1000}
                min={0}
                value={salary}
                onChange={(e: any) => setSalary(Number(e.target.value) || 0)}
                style={{ padding: '0.5rem 0.6rem', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label htmlFor="tax-input" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Taux d'imposition (%)
              </label>
              <input
                id="tax-input"
                type="number"
                step={0.1}
                min={0}
                max={100}
                value={taxRate}
                onChange={(e: any) => setTaxRate(Number(e.target.value) || 0)}
                style={{ padding: '0.5rem 0.6rem', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label htmlFor="vacation-input" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Nombre de jours de congé
              </label>
              <input
                id="vacation-input"
                type="number"
                step={1}
                min={0}
                max={365}
                value={vacationDays}
                onChange={(e: any) => setVacationDays(Number(e.target.value) || 0)}
                style={{ padding: '0.5rem 0.6rem', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label htmlFor="hours-input" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Temps de travail par jour (heures)
              </label>
              <input
                id="hours-input"
                type="number"
                step={0.5}
                min={0}
                max={24}
                value={hoursPerDay}
                onChange={(e: any) => setHoursPerDay(Number(e.target.value) || 0)}
                style={{ padding: '0.5rem 0.6rem', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* résumé affiché ci-dessous */}


          <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>

            <div>
              <strong>Montant perçu depuis l'arrivée :</strong> {formatUsdCents(amountSinceArrival)}
              <div style={{ fontSize: 12, color: '#666' }}>{(elapsedMs / 1000).toFixed(1)} secondes écoulées</div>
            </div>

            {/* Le rappel du taux d'imposition a été supprimé (l'input reste) */}

            <div>
              <strong>Salaire net estimé :</strong>{' '}
              {formatUsd(Math.round(salary * (1 - taxRate / 100)))}
            </div>

            <div>
              <strong>Jours de congé :</strong> {vacationDays}
            </div>

            <div>
              <strong>Jours ouvrés estimés par an (excl. weekends):</strong> {WORKING_DAYS_PER_YEAR}
            </div>

            <div>
              <strong>Jours ouvrés restants (après congés):</strong> {effectiveWorkingDays}
            </div>

            <div>
              <strong>Salaire annuel net estimé :</strong> {formatUsd(netAnnual)}
            </div>

            <div>
              <strong>Salaire journalier net (en tenant compte des weekends & congés):</strong>{' '}
              {effectiveWorkingDays > 0 ? formatUsd(netPerWorkday) : 'N/A'}
            </div>

            <div>
              <strong>Temps de travail par jour (heures):</strong> {hoursPerDay}
            </div>

            <div>
              <strong>Salaire horaire net (estimation) :</strong>{' '}
              {effectiveWorkingDays > 0 && hoursPerDay > 0 ? formatUsdCents(netPerHour) : 'N/A'}
            </div>
          </div>

          {/* plus d'inputs — tout est géré dans le groupe ci-dessus */}

          <hr style={{ margin: '1.2rem 0' }} />

          <p>Éditez <code>src/App.tsx</code> pour ajuster ou styliser davantage l'input.</p>
        </section>
      </main>
    </div>
  )
}
