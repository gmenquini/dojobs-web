import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import CardPerfil from '../components/CardPerfil'

export default function Favoritos() {
  const router = useRouter()
  const [perfis, setPerfis] = useState([])
  const [loading, setLoad]  = useState(true)
  const [favIds, setFavIds] = useState({})

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('dojobs_favoritos')||'{}')
    setFavIds(favs)
    const ids = Object.keys(favs)
    if (!ids.length) { setLoad(false); return }
    supabase.from('profiles').select('id,display_name,tagline,home_city,home_state,profile_age,price_per_hour,price_program,online,verified,attends_outcall,attends_couples,payment_methods,photos(id,url,is_cover,status,type)').in('id',ids).eq('status','active')
      .then(({ data }) => { setPerfis(data||[]); setLoad(false) })
  }, [])

  function remover(id) {
    const novos = {...favIds}; delete novos[id]
    setFavIds(novos); setPerfis(p=>p.filter(x=>x.id!==id))
    localStorage.setItem('dojobs_favoritos', JSON.stringify(novos))
  }

  return (
    <div style={{ maxWidth:600, margin:'0 auto', minHeight:'100vh' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'50px 16px 16px', borderBottom:'1px solid #1a1a2e' }}>
        <button onClick={() => router.back()} style={{ background:'none', border:'none', color:'#6C63FF', fontSize:14, fontWeight:600 }}>← Voltar</button>
        <span style={{ fontSize:16, fontWeight:700 }}>Favoritos</span>
      </div>
      {loading ? <div style={{ padding:40, textAlign:'center', color:'#555' }}>Carregando...</div>
      : perfis.length === 0 ? <div style={{ padding:60, textAlign:'center', color:'#555' }}>Nenhum favorito ainda.</div>
      : <div style={{ padding:10, display:'flex', flexDirection:'column', gap:10 }}>
          {perfis.map(p => <CardPerfil key={p.id} prof={p} isFav={true} onFav={() => remover(p.id)} />)}
        </div>}
    </div>
  )
}
