import { useEffect, useState } from 'react'
export default function useLocalStore(key, initial){
  const [value,setValue] = useState(()=>{
    try{ const v = JSON.parse(localStorage.getItem(key)); return v ?? initial }catch{ return initial }
  })
  useEffect(()=>{ localStorage.setItem(key, JSON.stringify(value)) }, [key, value])
  return [value, setValue]
}
