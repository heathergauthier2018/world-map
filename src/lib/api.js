export async function resolveISO2(anyIso){
  if(!anyIso) return null
  const s = anyIso.trim().toUpperCase()
  if(s.length===2) return s
  if(s.length===3){
    const r = await fetch(`https://restcountries.com/v3.1/alpha/${s}`)
    const arr = await r.json()
    return Array.isArray(arr) && arr[0]?.cca2 ? arr[0].cca2.toUpperCase() : null
  }
  return null
}
export async function fetchCountryFacts(isoAny){
  const iso2 = await resolveISO2(isoAny)
  if(!iso2) return null
  const [restC, wb] = await Promise.all([
    fetch(`https://restcountries.com/v3.1/alpha/${iso2}`).then(r=>r.json()).catch(()=>null),
    fetch(`https://api.worldbank.org/v2/country/${iso2}?format=json`).then(r=>r.json()).catch(()=>null)
  ])
  const rc = Array.isArray(restC) ? restC[0] : null
  const wbC = Array.isArray(wb) && Array.isArray(wb[1]) ? wb[1][0] : null
  return {
    iso2,
    name: rc?.name?.common || wbC?.name || 'Unknown',
    flag: rc?.flags?.svg || rc?.flags?.png || null,
    capital: Array.isArray(rc?.capital) ? rc.capital[0] : (wbC?.capitalCity || null),
    region: rc?.region || wbC?.region?.value || null,
    subregion: rc?.subregion || null,
    population: rc?.population || null,
    area: rc?.area || null,
    currencies: rc?.currencies ? Object.keys(rc.currencies) : null,
    languages: rc?.languages ? Object.values(rc.languages) : null,
    incomeLevel: wbC?.incomeLevel?.value || null,
    latitude: wbC?.latitude || (rc?.latlng?.[0] ?? null),
    longitude: wbC?.longitude || (rc?.latlng?.[1] ?? null)
  }
}
