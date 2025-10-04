import React, { useEffect, useState } from 'react'
import GlobeView from './components/GlobeView.jsx'
import Sidebar from './components/Sidebar.jsx'
import useLocalStore from './hooks/useLocalStore.js'
import { fetchCountryFacts } from './lib/api.js'
import './styles.css'

export default function App(){
  const [countryRaw, setCountryRaw] = useState(null)
  const [country, setCountry] = useState(null)
  const [pins, setPins] = useLocalStore('world-globe-pro:pins', [])

  useEffect(()=>{
    let cancel=false
    ;(async ()=>{
      if(!countryRaw){ setCountry(null); return }
      const facts = await fetchCountryFacts(countryRaw.iso)
      if(!cancel) setCountry(facts)
    })()
    return ()=>{ cancel=true }
  }, [countryRaw])

  const addPin = (pin)=> setPins([{ id: crypto.randomUUID?.() || String(Date.now()), name:'', type:'place', category:'', ...pin }, ...pins])
  const updatePin = (pin)=> setPins(pins.map(p=> p.id===pin.id ? pin : p))
  const deletePin = (id)=> setPins(pins.filter(p=> p.id!==id))

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <h1>🌍 World Globe Pro</h1>
          <div className="sub">Explore the world in 3D • Click a country for live facts • Save places you love</div>
        </div>
        <div className="actions">
          <button className="button primary" onClick={()=>addPin({})}>Quick Add Pin (at center)</button>
          <a className="button" href="https://github.com/heathergauthier2018/world-map" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </header>

      <div className="layout">
        <div className="card">
          <div className="globe-wrap">
            <GlobeView onCountrySelect={setCountryRaw} pins={pins} onAddPin={addPin}/>
            <div className="globe-hint">Drag to rotate • Scroll to zoom • Click a country for details • Shift+Click to add a pin</div>
          </div>
          <div className="section">
            <div className="label">Legend</div>
            <div className="list">
              <div className="item"><span className="name">Visited</span><span className="sub">Mark your trips</span></div>
              <div className="item"><span className="name">Wishlist</span><span className="sub">Places to go</span></div>
            </div>
          </div>
        </div>

        <Sidebar country={country} pins={pins} onEditPin={updatePin} onDeletePin={deletePin} />
      </div>
    </div>
  )
}
