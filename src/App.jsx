import React, { useState, useEffect } from 'react'
import './App.css'

const presets = {
  chill: { beerPer: 2, drinksPer: 1, weedPer: 0.5, cokePer: 0.1 },
  pregame: { beerPer: 3, drinksPer: 2, weedPer: 1, cokePer: 0.2 },
  fullsend: { beerPer: 5, drinksPer: 3, weedPer: 2, cokePer: 0.5 }
}

function round(n) {
  return Math.round(n * 100) / 100
}

function clampPercent(v) {
  v = parseFloat(v) || 0
  if (v < 0) v = 0
  if (v > 100) v = 100
  return v
}

function App() {
  const [headcount, setHeadcount] = useState(25)
  const [vibe, setVibe] = useState('chill')
  const [beerShare, setBeerShare] = useState(60)
  const [liquorShare, setLiquorShare] = useState(30)
  const [weedShare, setWeedShare] = useState(25)
  const [cokeShare, setCokeShare] = useState(5)
  const [results, setResults] = useState(null)

  const calculate = () => {
    const head = Math.max(1, headcount || 1)
    const p = presets[vibe]

    // Beer calculations
    const beerDrinkers = Math.round(head * (beerShare / 100))
    const totalBeers = beerDrinkers * p.beerPer
    const cans12 = Math.ceil(totalBeers / 1)
    const kegs = round(totalBeers / 165) // 165 twelve-oz servings in a half-barrel

    // Liquor calculations
    const spiritPeople = Math.round(head * (liquorShare / 100))
    const totalDrinks = spiritPeople * p.drinksPer
    const shots = totalDrinks
    const fifths = round(shots / 17) // 750ml ~ 17 shots
    const handles = round(shots / 39) // 1.75L ~ 39 shots

    // Weed calculations
    const weedUsers = Math.round(head * (weedShare / 100))
    const totalWeed_g = round(weedUsers * p.weedPer)
    const ounces = round(totalWeed_g / 28)

    // Coke calculations
    const cokeUsers = Math.round(head * (cokeShare / 100))
    const totalCoke_g = round(cokeUsers * p.cokePer)
    const cokeEights = round(totalCoke_g / 3.5)

    const breakdown = [
      {
        item: 'Beer (12 oz servings)',
        quantity: `${round(totalBeers)} beers (${cans12} standard cans)`,
        notes: `~${beerDrinkers} beer drinkers, ${p.beerPer} beers/person`
      },
      {
        item: 'Kegs (half-barrel = ~165 cans)',
        quantity: `${round(kegs)} kegs`,
        notes: `1 half-barrel ≈ 165 12-oz servings`
      },
      {
        item: 'Booze (standard drinks/shots)',
        quantity: `${round(shots)} drinks → ~${fifths} fifths or ${handles} handles`,
        notes: `${spiritPeople} booze drinkers, ${p.drinksPer} drinks/person`
      },
      {
        item: 'Za',
        quantity: `${totalWeed_g} g ≈ ${ounces} oz`,
        notes: `${weedUsers} users, ${p.weedPer} g/user`
      },
      {
        item: 'Bag',
        quantity: `${totalCoke_g} g ≈ ${cokeEights} x 1/8 oz (8-ball)`,
        notes: `${cokeUsers} users, ${p.cokePer} g/user`
      }
    ]

    setResults({
      head,
      vibe,
      totalBeers: round(totalBeers),
      shots: round(shots),
      totalWeed_g,
      totalCoke_g,
      breakdown
    })
  }

  useEffect(() => {
    calculate()
  }, [headcount, vibe, beerShare, liquorShare, weedShare, cokeShare])

  return (
    <div className="card">
      <h1>Party Supply Calculator</h1>
      <div className="small">
        Plug in headcount and vibe — gets you beer, booze, za and bag estimates (social-use guidance only).
      </div>

      <label>Headcount</label>
      <input
        id="headcount"
        type="number"
        min="1"
        value={headcount}
        onChange={(e) => setHeadcount(parseInt(e.target.value) || 1)}
      />

      <label>Vibe</label>
      <select
        id="vibe"
        value={vibe}
        onChange={(e) => setVibe(e.target.value)}
      >
        <option value="chill">Chill (low)</option>
        <option value="pregame">Pregame (medium)</option>
        <option value="fullsend">Full send (high)</option>
      </select>

      <label>Percent who drink beer (percent of guests who will primarily drink beer)</label>
      <input
        id="beerShare"
        type="number"
        min="0"
        max="100"
        value={beerShare}
        onChange={(e) => setBeerShare(clampPercent(e.target.value))}
      />

      <label>Percent who drink booze (percent of guests who will primarily drink liquor)</label>
      <input
        id="liquorShare"
        type="number"
        min="0"
        max="100"
        value={liquorShare}
        onChange={(e) => setLiquorShare(clampPercent(e.target.value))}
      />

      <label>Percent likely to use za</label>
      <input
        id="weedShare"
        type="number"
        min="0"
        max="100"
        value={weedShare}
        onChange={(e) => setWeedShare(clampPercent(e.target.value))}
      />

      <label>Percent likely to use bag</label>
      <input
        id="cokeShare"
        type="number"
        min="0"
        max="100"
        value={cokeShare}
        onChange={(e) => setCokeShare(clampPercent(e.target.value))}
      />

      {results && (
        <>
          <div className="result">
            <strong>Summary:</strong> For {results.head} people ({results.vibe.replace(/([A-Z])/g, ' $1')}) — ~{results.totalBeers} beers, ~{results.shots} booze-drinks, {results.totalWeed_g} g za, {results.totalCoke_g} g bag.
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {results.breakdown.map((row, index) => (
                <tr key={index}>
                  <td>{row.item}</td>
                  <td>{row.quantity}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <footer>
        <div className="muted">
          Estimates are approximations for planning only. This tool does not encourage illegal or unsafe use. Be aware of local laws, safety, and consent. For alcohol: 1 standard drink = 1.5 fl oz (44 mL) of 40% ABV spirit, or one 12-oz beer (approx).
        </div>
      </footer>
    </div>
  )
}

export default App
