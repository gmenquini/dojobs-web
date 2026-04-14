import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase, distKm } from '../lib/supabase'
import AgeGate from '../components/AgeGate'
import CardPerfil from '../components/CardPerfil'

const GENEROS  = [{v:'mulher',l:'Mulher'},{v:'homem',l:'Homem'},{v:'trans_f',l:'Trans F'},{v:'trans_m',l:'Trans M'}]
const ATEND    = [{v:'outcall',l:'Hotel'},{v:'couples',l:'Casal'},{v:'travel',l:'Viaja'}]
const PAGTO    = [{v:'pix',l:'Pix'},{v:'cartao',l:'Cartao'},{v:'dinheiro',l:'Dinheiro'}]
const SERVICOS = [{v:'oral',l:'Oral'},{v:'completo',l:'Completo'},{v:'anal',l:'Anal'},{v:'beijo',l:'Beijo'},{v:'duplo',l:'Duplo'},{v:'fantasias',l:'Fantasias'},{v:'bdsm',l:'BDSM'},{v:'fetiche',l:'Fetiche'},{v:'massagem',l:'Massagem'},{v:'striptease',l:'Striptease'},{v:'namorada',l:'Namorada'},{v:'cam',l:'Online/Cam'}]
const RAIOS    = [5,10,20,50]

export default function Home() {
  const router = useRouter()
  const [ageOk, setAgeOk]         = useState(false)
  const [aba, setAba]             = useState('prox')
  const [perfis, setPerfis]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [busca, setBusca]         = useState('')
  const [cidade, setCidade]       = useState('')
  const [online, setOnline]       = useState(false)
  const [generos, setGeneros]     = useState([])
  const [atend, setAtend]         = useState([])
  const [pagtos, setPagtos]       = useState([])
  const [servicos, setServicos]   = useState([])
  const [filtrosOpen, setFOpen]   = useState(false)
  const [abaFiltro, setAbaF]      = useState('genero')
  const [raio, setRaio]           = useState(5)
  const [userLoc, setUserLoc]     = useState(null)
  const [locLoading, setLocLoad]  = useState(false)
  const [favoritos, setFavs]      = useState({})
  const mapRef = useRef(null)
  const mapInstRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ok = localStorage.getItem('dojobs_age_ok')
      setAgeOk(ok === '1')
      const favs = localStorage.getItem('dojobs_favoritos')
      if (favs) setFavs(JSON.parse(favs))
    }
  }, [])

  const buscar = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('profiles')
      .select('id,display_name,tagline,gender,profile_age,home_city,home_state,plan,verified,online,price_per_hour,price_program,lat,lng,show_on_map,attends_outcall,attends_incall,attends_couples,travel_radius_km,payment_methods,whatsapp_hash,external_link,photos(id,url,is_cover,order,type,status)')
      .eq('status','active').order('plan',{ascending:false}).limit(100)
    if (generos.length) q = q.in('gender', generos)
    if (online)         q = q.eq('online', true)
    if (cidade)         q = q.ilike('home_city', '%'+cidade+'%')
    if (busca)          q = q.ilike('display_name', '%'+busca+'%')
    if (atend.includes('outcall'))  q = q.eq('attends_outcall', true)
    if (atend.includes('couples'))  q = q.eq('attends_couples', true)
    if (atend.includes('travel'))   q = q.gt('travel_radius_km', 0)
    const { data } = await q
    setPerfis(data || [])
    setLoading(false)
  }, [generos, online, cidade, busca, atend, pagtos, servicos])

  useEffect(() => { if (ageOk) buscar() }, [ageOk, buscar])

  async function pedirLoc() {
    setLocLoad(true)
    navigator.geolocation?.getCurrentPosition(
      pos => { setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocLoad(false) },
      () => setLocLoad(false)
    )
  }

  useEffect(() => {
    if (aba === 'prox' && !userLoc) pedirLoc()
  }, [aba])

  // Inicializar mapa Leaflet
  useEffect(() => {
    if (aba !== 'mapa' || !mapRef.current || !userLoc) return
    if (mapInstRef.current) { mapInstRef.current.remove(); mapInstRef.current = null }

    const L = window.L
    if (!L) return

    const map = L.map(mapRef.current).setView([userLoc.lat, userLoc.lng], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
    L.circleMarker([userLoc.lat, userLoc.lng], { radius:8, color:'#2563eb', fillColor:'#3b82f6', fillOpacity:1 }).addTo(map).bindPopup('Voce esta aqui')

    const comGPS = perfis.filter(p => p.lat && p.lng && p.show_on_map)
    comGPS.forEach(p => {
      const cor = p.online ? '#22c55e' : '#6C63FF'
      L.circle([p.lat, p.lng], { radius:500, color:cor, fillColor:cor, fillOpacity:0.08, weight:1 }).addTo(map)
      L.circleMarker([p.lat, p.lng], { radius:7, color:'#fff', fillColor:cor, fillOpacity:1, weight:2 })
        .addTo(map)
        .bindPopup(`<strong>${p.display_name}</strong><br/>${p.home_city}${p.price_program?' · R$'+p.price_program:''}`)
        .on('click', () => router.push(`/perfil/${p.id}`))
    })

    mapInstRef.current = map
    return () => { if (mapInstRef.current) { mapInstRef.current.remove(); mapInstRef.current = null } }
  }, [aba, userLoc, perfis])

  function tog(arr, set, v) { set(p => p.includes(v) ? p.filter(x=>x!==v) : [...p,v]) }

  function toggleFav(id) {
    const novos = {...favoritos}
    if (novos[id]) delete novos[id]; else novos[id] = true
    setFavs(novos)
    localStorage.setItem('dojobs_favoritos', JSON.stringify(novos))
  }

  const perfisProx = userLoc && raio > 0
    ? perfis.filter(p => p.lat && p.lng && distKm(userLoc.lat, userLoc.lng, p.lat, p.lng) <= raio)
        .sort((a,b) => distKm(userLoc.lat,userLoc.lng,a.lat,a.lng) - distKm(userLoc.lat,userLoc.lng,b.lat,b.lng))
    : perfis.filter(p=>p.lat&&p.lng).sort((a,b)=>distKm(userLoc?.lat||0,userLoc?.lng||0,a.lat,a.lng)-distKm(userLoc?.lat||0,userLoc?.lng||0,b.lat,b.lng))

  const totalFiltros = generos.length + atend.length + pagtos.length + servicos.length + (online?1:0)
  const abas = [{id:'prox',l:'Perto de mim'},{id:'buscar',l:'Buscar'},{id:'mapa',l:'Mapa'}]
  const abasFiltro = [{id:'genero',l:'Genero'},{id:'servicos',l:'Servicos'},{id:'atend',l:'Atendimento'},{id:'pagto',l:'Pagamento'}]

  if (!ageOk) return <AgeGate onConfirm={() => setAgeOk(true)} />

  return (
    <>
      <Head>
        <title>DoJobApp</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6C63FF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" defer></script>
      </Head>

      <div style={{ maxWidth:600, margin:'0 auto', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
        {/* Header */}
        <div style={{ position:'sticky', top:0, zIndex:100, background:'rgba(10,10,20,0.95)', backdropFilter:'blur(12px)', borderBottom:'1px solid #1a1a2e' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 14px 0' }}>
            <span style={{ fontSize:20, fontWeight:800, color:'#6C63FF' }}>DoJobApp</span>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <button onClick={() => router.push('/favoritos')} style={{ background:'none', border:'none', color:'#FF4D6D', fontSize:13, fontWeight:700 }}>Favs</button>
              <button onClick={() => router.push('/anunciante/login')} style={{ background:'#FF4D6D', color:'#fff', border:'none', borderRadius:18, padding:'7px 14px', fontSize:12, fontWeight:700 }}>Anunciar</button>
            </div>
          </div>

          {/* Abas principais */}
          <div style={{ display:'flex', borderBottom:'1px solid #1a1a2e' }}>
            {abas.map(a => (
              <button key={a.id} onClick={() => setAba(a.id)} style={{ flex:1, padding:'12px 0', background:'none', border:'none', color:aba===a.id?'#fff':'#555', fontWeight:600, fontSize:13, borderBottom:aba===a.id?'2px solid #6C63FF':'2px solid transparent' }}>
                {a.l}
              </button>
            ))}
          </div>

          {/* Busca e filtros (exceto mapa) */}
          {aba !== 'mapa' && (
            <div style={{ padding:'8px 12px', borderBottom:'1px solid #1a1a2e' }}>
              {aba === 'buscar' && (
                <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                  <input placeholder="Buscar nome..." value={busca} onChange={e=>setBusca(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscar()}
                    style={{ flex:1, background:'#1a1a2e', border:'1px solid #2a2a3e', borderRadius:20, padding:'8px 14px', color:'#fff', fontSize:13, outline:'none' }} />
                  <input placeholder="Cidade..." value={cidade} onChange={e=>setCidade(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscar()}
                    style={{ width:100, background:'#1a1a2e', border:'1px solid #2a2a3e', borderRadius:20, padding:'8px 14px', color:'#fff', fontSize:13, outline:'none' }} />
                </div>
              )}
              {aba === 'prox' && (
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
                  {RAIOS.map(r => (
                    <button key={r} onClick={() => setRaio(r)} style={{ border:`1.5px solid ${raio===r?'#6C63FF':'#2a2a3e'}`, borderRadius:20, padding:'6px 14px', background:raio===r?'#6C63FF':'#1a1a2e', color:'#fff', fontSize:12, fontWeight:600 }}>
                      {r}km
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <button onClick={() => setOnline(v=>!v)} style={{ border:`1.5px solid ${online?'#22c55e':'#2a2a3e'}`, borderRadius:20, padding:'6px 14px', background:online?'#22c55e':'#1a1a2e', color:'#fff', fontSize:12, fontWeight:600 }}>
                  Online
                </button>
                <button onClick={() => setFOpen(v=>!v)} style={{ border:`1.5px solid ${filtrosOpen||totalFiltros>0?'#6C63FF':'#2a2a3e'}`, borderRadius:20, padding:'6px 14px', background:filtrosOpen||totalFiltros>0?'#6C63FF':'#1a1a2e', color:'#fff', fontSize:12, fontWeight:600 }}>
                  {totalFiltros > 0 ? `Filtros (${totalFiltros})` : 'Filtros'}
                </button>
                {totalFiltros > 0 && (
                  <button onClick={() => { setGeneros([]); setAtend([]); setPagtos([]); setServicos([]); setOnline(false) }} style={{ background:'none', border:'none', color:'#FF4D6D', fontSize:12, fontWeight:700 }}>Limpar</button>
                )}
              </div>

              {filtrosOpen && (
                <div style={{ background:'#0f0f1e', borderRadius:12, padding:12, marginTop:8 }}>
                  <div style={{ display:'flex', gap:6, marginBottom:10, overflowX:'auto' }}>
                    {abasFiltro.map(a => (
                      <button key={a.id} onClick={() => setAbaF(a.id)} style={{ border:'none', borderRadius:8, padding:'6px 12px', background:abaFiltro===a.id?'#6C63FF':'transparent', color:abaFiltro===a.id?'#fff':'#555', fontSize:12, fontWeight:600, whiteSpace:'nowrap', flexShrink:0 }}>
                        {a.l}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {abaFiltro==='genero'   && GENEROS.map(o  => <FChip key={o.v} active={generos.includes(o.v)}  onClick={()=>tog(generos,setGeneros,o.v)}>{o.l}</FChip>)}
                    {abaFiltro==='servicos' && SERVICOS.map(o => <FChip key={o.v} active={servicos.includes(o.v)} onClick={()=>tog(servicos,setServicos,o.v)} cor="#FF4D6D">{o.l}</FChip>)}
                    {abaFiltro==='atend'    && ATEND.map(o    => <FChip key={o.v} active={atend.includes(o.v)}    onClick={()=>tog(atend,setAtend,o.v)} cor="#f59e0b">{o.l}</FChip>)}
                    {abaFiltro==='pagto'    && PAGTO.map(o    => <FChip key={o.v} active={pagtos.includes(o.v)}   onClick={()=>tog(pagtos,setPagtos,o.v)}>{o.l}</FChip>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Conteudo */}
        <div style={{ flex:1 }}>
          {/* ABA PERTO DE MIM */}
          {aba === 'prox' && (
            !userLoc ? (
              <div style={{ padding:40, textAlign:'center' }}>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>Encontre profissionais perto de voce</div>
                <div style={{ color:'#555', fontSize:13, marginBottom:20 }}>Permita acesso a sua localizacao para ver quem esta proxima.</div>
                <button onClick={pedirLoc} style={{ background:'#6C63FF', color:'#fff', border:'none', borderRadius:14, padding:'14px 32px', fontWeight:700, fontSize:15 }}>
                  {locLoading ? 'Obtendo...' : 'Usar minha localizacao'}
                </button>
              </div>
            ) : loading ? (
              <div style={{ padding:40, textAlign:'center', color:'#555' }}>Carregando...</div>
            ) : perfisProx.length === 0 ? (
              <div style={{ padding:40, textAlign:'center', color:'#555' }}>Nenhuma profissional em {raio}km</div>
            ) : (
              <div style={{ padding:10, display:'flex', flexDirection:'column', gap:10 }}>
                {perfisProx.map(p => (
                  <CardPerfil key={p.id} prof={p} isFav={!!favoritos[p.id]} onFav={() => toggleFav(p.id)}
                    dist={distKm(userLoc.lat, userLoc.lng, p.lat, p.lng)} />
                ))}
              </div>
            )
          )}

          {/* ABA BUSCAR */}
          {aba === 'buscar' && (
            !busca && !cidade && totalFiltros === 0 ? (
              <div style={{ padding:60, textAlign:'center' }}>
                <div style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:8 }}>Buscar profissionais</div>
                <div style={{ color:'#555', fontSize:13, lineHeight:'20px' }}>Digite um nome, cidade ou use os filtros para encontrar profissionais.</div>
              </div>
            ) : loading ? (
              <div style={{ padding:40, textAlign:'center', color:'#555' }}>Carregando...</div>
            ) : (
              <div style={{ padding:10, display:'flex', flexDirection:'column', gap:10 }}>
                {perfis.length === 0 ? <div style={{ padding:40, textAlign:'center', color:'#555' }}>Nenhum perfil encontrado.</div> : perfis.map(p => (
                  <CardPerfil key={p.id} prof={p} isFav={!!favoritos[p.id]} onFav={() => toggleFav(p.id)} />
                ))}
              </div>
            )
          )}

          {/* ABA MAPA */}
          {aba === 'mapa' && (
            !userLoc ? (
              <div style={{ padding:40, textAlign:'center' }}>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>Mapa de profissionais</div>
                <div style={{ color:'#555', fontSize:13, marginBottom:20 }}>Permita sua localizacao para ver profissionais no mapa.</div>
                <button onClick={pedirLoc} style={{ background:'#6C63FF', color:'#fff', border:'none', borderRadius:14, padding:'14px 32px', fontWeight:700, fontSize:15 }}>
                  {locLoading ? 'Obtendo...' : 'Usar minha localizacao'}
                </button>
              </div>
            ) : (
              <div ref={mapRef} style={{ height:'calc(100vh - 160px)', width:'100%' }} />
            )
          )}
        </div>

        {/* Banner ads */}
        <div style={{ height:50, background:'#111', display:'flex', alignItems:'center', justifyContent:'center', position:'sticky', bottom:0 }}>
          <iframe src="https://adserver.juicyads.com/adshow.php?adzone=1113978" width="300" height="50" frameBorder="0" scrolling="no" style={{ border:0 }} />
        </div>
      </div>
    </>
  )
}

function FChip({ children, active, onClick, cor='#6C63FF' }) {
  return (
    <button onClick={onClick} style={{ border:`1px solid ${active?cor:'#2a2a3e'}`, borderRadius:20, padding:'7px 14px', background:active?cor:'#1a1a2e', color:'#fff', fontSize:13, fontWeight:600 }}>
      {children}
    </button>
  )
}
