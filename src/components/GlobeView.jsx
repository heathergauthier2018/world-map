import React, { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'

export default function GlobeView({ onCountrySelect, pins, onAddPin }){
  const globeRef = useRef()
  const [polys, setPolys] = useState([])

  useEffect(()=>{
    fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
      .then(res => res.json())
      .then(world => {
        const g = Globe()
        const geo = g.toGeoJSON(world)
        setPolys(geo.features)
      })
  }, [])

  return (
    <div className="globe-wrap">
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere
        atmosphereAltitude={0.18}
        polygonsData={polys}
        polygonCapColor={()=>'rgba(60,110,240,.55)'}
        polygonSideColor={()=>'rgba(40,60,120,.9)'}
        polygonStrokeColor={()=>'rgba(255,255,255,.6)'}
        polygonAltitude={()=>0.003}
        onPolygonClick={poly=>{
          const name = poly?.properties?.name || 'Unknown'
          const iso = poly?.id
          onCountrySelect({ name, iso })
          if(poly?.centroid && globeRef.current){
            const [lat,lng] = poly.centroid
            globeRef.current.pointOfView({ lat, lng, altitude: 2.2 }, 1200)
          }
        }}
      />
      <div className="globe-hint">Drag to rotate • Scroll to zoom • Click a country for details</div>
      <div
        onMouseDown={(e)=>{
          if(e.shiftKey && globeRef.current){
            const pov = globeRef.current.pointOfView()
            onAddPin({ lat: pov.lat, lng: pov.lng })
          }
        }}
        style={{position:'absolute', inset:0}}
      />
    </div>
  )
}
