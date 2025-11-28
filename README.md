# Whatswrongwithmylife

This repository now contains a minimal React + Vite app at the repository root (moved from the former `frontend/` folder).

Quick start (from repository root):

```bash
# install dependencies
npm install

# start dev server
npm run dev

# build for production
npm run build

# preview production build
npm run preview
```

## Ajout — Textbox salaire (exemple)

Une textbox contrôlée a été ajoutée à `src/App.tsx` pour représenter un **salaire annuel brut** en dollars (USD).

- Valeur initiale : `1000000` (1 000 000 USD)
- L'input est de type number et met à jour l'état local.
- La valeur affichée est formatée en USD (ex. $1,000,000).

### Champ — Taux d'imposition

- Valeur initiale : `30` (30%)
- L'input est de type number (pourcentage) et permet de voir une estimation du salaire net après impôt affichée dans l'UI.

### Champ — Nombre de jours de congé

- Valeur initiale : `25`
- L'input est de type number (entier) et affiche le nombre de jours de congé dans l'interface.

### Calcul — Salaire journalier net (estimation)

L'application affiche également une estimation du **salaire journalier net** en tenant compte :

- des weekends (on suppose 52 semaines -> 104 jours de weekend par an),

Formule simple utilisée :

### Montant perçu en temps réel

L'application affiche maintenant aussi un compteur du **montant perçu depuis l'arrivée sur la page**, actualisé toutes les 0,1 seconde (100 ms). Ce compteur prend le salaire annuel net estimé et le répartit sur le **temps travaillé par an** (jours ouvrés restants × heures/jour) puis multiplie par le temps écoulé depuis l'ouverture de la page pour estimer le montant déjà perçu. Si le temps travaillé ne peut pas être calculé (ex. heures/jour ou jours ouvrés nuls), le compteur revient au calcul basé sur l'année complète.

### Temps de travail par jour et salaire horaire

Un nouvel input **"Temps de travail par jour (heures)"** permet de définir le nombre d'heures travaillées par jour (valeur initiale 8). L'application utilise cette valeur pour estimer le **salaire horaire net** :

- Salaire horaire net = Salaire journalier net / Temps de travail par jour

Le salaire journalier net est calculé en tenant compte des weekends et des jours de congé (comme décrit ci-dessus). Le salaire horaire est affiché formaté avec 2 décimales.
- Salaire annuel net = Salaire annuel brut * (1 - taux d'imposition/100)
- Jours ouvrés estimés par an = 365 - 104 (= 261)
- Jours ouvrés restants = Jours ouvrés estimés - jours de congé
- Salaire journalier net = Salaire annuel net / Jours ouvrés restants (si > 0)

Cela donne une estimation pratique de ton salaire net par jour ouvré (en USD). Note : ce calcul est volontairement simple et n'inclut pas les jours fériés ni les variations spécifiques de calendrier.

Pour tester rapidement en local :

```bash
# installer les dépendances (si nécessaire)
npm install

# démarrer le serveur de développement
npm run dev

# ouvrir http://localhost:5173 (ou l'URL indiquée par Vite)
```
If you prefer a TypeScript or alternate template, you can scaffold with the official Vite creator locally:

```bash
npm create vite@latest
```
