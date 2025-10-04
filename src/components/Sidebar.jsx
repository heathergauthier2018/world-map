import React from 'react'

export default function Sidebar({ country, pins, onEditPin, onDeletePin }){
  return (
    <div className="card" style={{minHeight:420}}>
      <div className="section">
        <h2 style={{margin:'6px 0'}}>Explore</h2>
        {!country && <p>Select a country on the globe.</p>}
        {country && (
          <div className="grid">
            <div className="label">Country</div><div><strong>{country.name}</strong></div>
            {country.flag && <img src={country.flag} alt="flag" style={{height:28}}/>}
            <div className="label">Capital</div><div>{country.capital || '—'}</div>
            <div className="label">Region</div><div>{country.region || '—'}{country.subregion ? ` • ${country.subregion}` : ''}</div>
            <div className="label">Population</div><div>{country.population?.toLocaleString?.() || '—'}</div>
            <div className="label">Income Level</div><div>{country.incomeLevel || '—'}</div>
            <div className="label">Languages</div><div>{country.languages?.join(', ') || '—'}</div>
            <div className="label">Currencies</div><div>{country.currencies?.join(', ') || '—'}</div>
          </div>
        )}
      </div>

      <div className="section">
        <h3 style={{margin:'6px 0'}}>Your Pins</h3>
        {pins.length===0 ? <p>No pins yet.</p> : (
          <div className="list">
            {pins.map(p => (
              <div className="item" key={p.id}>
                <div className="meta">
                  <div className="name">{p.name || 'Untitled Place'}</div>
                  <div className="sub">{p.type || 'place'} — {p.category || 'uncategorized'}</div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button className="button" onClick={()=>{
                    const name = prompt('Name', p.name) ?? p.name
                    const type = prompt('Type (city/state/country/place)', p.type) ?? p.type
                    const category = prompt('Category', p.category) ?? p.category
                    onEditPin({ ...p, name, type, category })
                  }}>Edit</button>
                  <button className="button" style={{background:'#ffe8ee',borderColor:'#f2b0bf',color:'#7c1f31'}} onClick={()=>onDeletePin(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
