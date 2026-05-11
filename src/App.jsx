import { useState, useEffect } from 'react'
import './App.css'

const STORAGE_KEY = 'hydroCalc_v1'

const DEFAULTS = {
  preset:   'herbs',
  targetEC: 1.4,
  targetPH: 5.8,
  volumeL:  15,
  koefEC:   3.0,
  koefPH:   1.125,
}

const PRESETS = {
  herbs:  { targetEC: 1.4, targetPH: 5.8 },
  salads: { targetEC: 1.0, targetPH: 5.8 },
}

function loadCfg() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

function saveCfg(cfg) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)) } catch {}
}

// Round up to nearest 0.5
function roundHalf(x) {
  return Math.ceil(x * 2) / 2
}

// ── Reusable components ───────────────────────────────────────────────────────

function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="collapsible">
      <button
        className="collapsible-toggle"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="collapsible-label">{title}</span>
        <span className={`toggle-arrow${open ? ' open' : ''}`}>▼</span>
      </button>
      {open && <div className="collapsible-body">{children}</div>}
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="card">
      <h2 className="card-title">{title}</h2>
      {children}
    </div>
  )
}

function NumInput({ id, label, value, step, min, max, placeholder, onChange }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type="number"
        step={step}
        min={min}
        max={max}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function BigNum({ value, unit, color }) {
  return (
    <div className="bignum-row">
      <span className={`big-number ${color}`}>{value}</span>
      <span className="num-unit">{unit}</span>
    </div>
  )
}

function TipBox({ children }) {
  return <div className="tip-box">{children}</div>
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [cfg, setCfgState] = useState(loadCfg)
  const [measuredEC, setMeasuredEC] = useState('')
  const [measuredPH, setMeasuredPH] = useState('')
  const [showNewTank, setShowNewTank] = useState(false)

  // Persist to localStorage and clear the new-tank result whenever cfg changes.
  useEffect(() => {
    saveCfg(cfg)
    setShowNewTank(false)
  }, [cfg])

  function setCfg(patch) {
    setCfgState(prev => ({ ...prev, ...patch }))
  }

  function setPreset(p) {
    if (p === 'custom') {
      setCfg({ preset: 'custom' })
    } else {
      setCfg({ preset: p, ...PRESETS[p] })
    }
  }

  // ── Derived calculations ──────────────────────────────────────────────────

  const ecResult = (() => {
    if (!measuredEC) return null
    const m = parseFloat(measuredEC)
    if (isNaN(m)) return null
    const diff = cfg.targetEC - m
    if (Math.abs(diff) <= 0.05) return { type: 'ok' }
    if (diff > 0.05) return { type: 'add', ml: roundHalf(diff * cfg.volumeL / cfg.koefEC) }
    return { type: 'high' }
  })()

  const phResult = (() => {
    if (!measuredPH) return null
    const m = parseFloat(measuredPH)
    if (isNaN(m)) return null
    const diff = m - cfg.targetPH
    if (Math.abs(diff) <= 0.1) return { type: 'ok' }
    if (diff > 0.1) return { type: 'add', drops: Math.round(diff * cfg.volumeL / cfg.koefPH) }
    return { type: 'low' }
  })()

  const newTank = showNewTank
    ? {
        supermix: roundHalf(cfg.targetEC * cfg.volumeL / cfg.koefEC),
        bnzym:    roundHalf(cfg.volumeL / 10),
      }
    : null

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <header className="app-header">
        <h1>🌱 Hydro kalkulačka</h1>
        <p>Věž 15 L · BioNova</p>
      </header>

      <div className="container">

        {/* ⚙️ Nastavení */}
        <Collapsible title="⚙️ Nastavení">
          <label>Plodina</label>
          <div className="preset-group">
            {[
              ['herbs',  '🌿 Bylinky'],
              ['salads', '🥬 Saláty'],
              ['custom', '✏️ Vlastní'],
            ].map(([key, lbl]) => (
              <button
                key={key}
                className={`preset-btn${cfg.preset === key ? ' active' : ''}`}
                onClick={() => setPreset(key)}
              >
                {lbl}
              </button>
            ))}
          </div>

          {cfg.preset === 'custom' && (
            <div className="custom-row">
              <NumInput
                id="customEC" label="Cílové EC"
                step="0.1" min="0.1" max="5"
                value={cfg.targetEC}
                onChange={v => { if (+v > 0) setCfg({ targetEC: +v }) }}
              />
              <NumInput
                id="customPH" label="Cílové pH"
                step="0.1" min="4" max="9"
                value={cfg.targetPH}
                onChange={v => { if (+v > 0) setCfg({ targetPH: +v }) }}
              />
            </div>
          )}

          <NumInput
            id="volumeL" label="Objem nádrže (L)"
            step="0.5" min="1" max="1000"
            value={cfg.volumeL}
            onChange={v => { if (+v > 0) setCfg({ volumeL: +v }) }}
          />
        </Collapsible>

        {/* 🆕 Nová nádrž */}
        <Card title="🆕 Nová nádrž">
          <button className="btn btn-primary" onClick={() => setShowNewTank(true)}>
            Spočítat dávkování
          </button>
          {newTank && (
            <div className="new-tank-result">
              <div className="divider" />
              <div className="result-item">
                <div className="result-label">Hydro Supermix</div>
                <BigNum value={newTank.supermix} unit="ml" color="ec" />
              </div>
              <div className="result-item">
                <div className="result-label">BN-Zym</div>
                <BigNum value={newTank.bnzym} unit="ml" color="ec" />
              </div>
              <p className="reminder">
                Nejdřív rozmíchej Hydro Supermix, potom přidej BN-Zym.
                Po naplnění změř pH a uprav v sekci níže.
              </p>
            </div>
          )}
        </Card>

        {/* 📈 Doplnit hnojivo */}
        <Card title="📈 Doplnit hnojivo">
          <NumInput
            id="measuredEC" label="Naměřené EC (mS/cm)"
            step="0.01" min="0" max="15"
            value={measuredEC}
            placeholder="např. 0.8"
            onChange={setMeasuredEC}
          />
          {ecResult && (
            <div className="result-area">
              {ecResult.type === 'ok'   && <p className="status-ok">✅ EC je v pořádku</p>}
              {ecResult.type === 'high' && <p className="status-warn">⚠️ EC je vyšší než cíl. Dolij vodu nebo počkej na přirozený pokles.</p>}
              {ecResult.type === 'add'  && (
                <>
                  <BigNum value={ecResult.ml} unit="ml Hydro Supermix" color="ec" />
                  <TipBox>💡 Přidej polovinu, počkej 5 minut, znovu změř, dorovni zbytek. Hnojivo se rozmíchává postupně.</TipBox>
                </>
              )}
            </div>
          )}
        </Card>

        {/* ⬇️ Snížit pH */}
        <Card title="⬇️ Snížit pH">
          <NumInput
            id="measuredPH" label="Naměřené pH"
            step="0.1" min="0" max="14"
            value={measuredPH}
            placeholder="např. 7.5"
            onChange={setMeasuredPH}
          />
          {phResult && (
            <div className="result-area">
              {phResult.type === 'ok'  && <p className="status-ok">✅ pH je v pořádku</p>}
              {phResult.type === 'low' && <p className="status-warn">⚠️ pH je nižší než cíl. Nemáš pH+, doporučení: dolij čerstvou vodu (zvedne pH).</p>}
              {phResult.type === 'add' && (
                <>
                  <BigNum value={phResult.drops} unit="kapek pH-" color="ph" />
                  <TipBox>💡 Začni polovinou, počkej 2 minuty, znovu změř. pH reaguje skokově.</TipBox>
                </>
              )}
            </div>
          )}
        </Card>

        {/* ⚙️ Kalibrace */}
        <Collapsible title="⚙️ Kalibrace">
          <p className="calib-intro">Pokud dávkování v praxi nesedí, uprav si koeficienty:</p>
          <NumInput
            id="koefEC"
            label="EC koeficient — o kolik mS/cm zvedne 1 ml hnojiva v 1 L vody"
            step="0.1" min="0.1" max="20"
            value={cfg.koefEC}
            onChange={v => { if (+v > 0) setCfg({ koefEC: +v }) }}
          />
          <NumInput
            id="koefPH"
            label="pH koeficient — o kolik sníží 1 kapka pH- pH v 1 L vody"
            step="0.05" min="0.01" max="10"
            value={cfg.koefPH}
            onChange={v => { if (+v > 0) setCfg({ koefPH: +v }) }}
          />
          <button
            className="btn btn-secondary"
            style={{ marginTop: 6 }}
            onClick={() => setCfg({ koefEC: DEFAULTS.koefEC, koefPH: DEFAULTS.koefPH })}
          >
            Reset na defaultní
          </button>
          <p className="calib-tip">
            Tip: změř pH/EC před přidáním hnojiva nebo pH-, dodej spočítané množství, znovu změř.
            Pokud výsledek nesedí, uprav koeficient.
          </p>
        </Collapsible>

      </div>
    </>
  )
}
