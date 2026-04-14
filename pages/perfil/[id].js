import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabase'
import ModalAviso from '../../components/ModalAviso'

export default function PerfilPage() {
  const router = useRouter()
  const { id } = router.query
  const [prof, setProf]         = useState(null)
  const [loading, setLoad]      = useState(true)
  const [fotoIdx, setFotoIdx]   = useState(0)
  const [modalOpen, setModal]   = useState(false)
  const [tipoContato, setTipo]  = useState(null)
  const [isFav, setFav]         = useState(false)
  const [denOpen, setDen]       = useState(false)
  const [denMotivo, setDenM]    = useState('')

  useEffect(() => {
    if (!id) return
    supabase.from('profiles')
      .select('*,photos(id,url,is_cover,order,type,status)')
      .eq('id', id).eq('status','active').single()
      .then(({ data }) => { setProf(data); setLoad(false) })
    const favs = JSON.parse(localStorage.getItem('dojobs_favoritos')||'{}')
    setFav(!!favs[id])
  }, [id])

  function toggleFav() {
    const favs = JSON.parse(localStorage.getItem('dojobs_favoritos')||'{}')
    if (favs[id]) delete favs[id]; else favs[id] = true
    localStorage.setItem('dojobs_favoritos', JSON.stringify(favs))
    setFav(!isFav)
  }

  function abrirContato(tipo) { setTipo(tipo); setModal(true) }

  async function confirmarContato() {
    setModal(false)
    try { await supabase.from('profiles').update({ clicks_count:(prof.clicks_count||0)+1 }).eq('id',id) } catch(e){}
    if (tipoContato==='whatsapp' && prof.whatsapp_hash) window.open('https://wa.me/55'+prof.whatsapp_hash, '_blank')
    else if (tipoContato==='link' && prof.external_link) window.open(prof.external_link, '_blank')
  }

  async function enviarDenuncia() {
    if (!denMotivo.trim()) return
    await supabase.from('reports').insert({ profile_id: id, reason:'other', description: denMotivo })
    setDen(false); setDenM('')
    alert('Denuncia enviada. Obrigado!')
  }

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#555' }}>Carregando...</div>
  if (!prof) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#555' }}>Perfil nao encontrado.</div>

  const fotos = (prof.photos||[]).filter(p=>p.status==='approved'&&p.type!=='video').sort((a,b)=>(a.order||0)-(b.order||0))

  return (
    <>
      <Head><title>{prof.display_name} - DoJobApp</title></Head>
      <div style={{ maxWidth:600, margin:'0 auto', minHeight:'100vh', background:'#0a0a14' }}>

        {/* Fotos */}
        <div style={{ position:'relative', background:'#1a1a2e' }}>
          {fotos.length > 0 ? (
            <>
              <div style={{ position:'relative', overflow:'hidden', height:360 }}>
                <img src={fotos[fotoIdx]?.url} alt={prof.display_name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                {fotos.length > 1 && (
                  <>
                    <button onClick={() => setFotoIdx(i => Math.max(0,i-1))} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.5)', border:'none', color:'#fff', width:36, height:36, borderRadius:18, fontSize:18 }}>‹</button>
                    <button onClick={() => setFotoIdx(i => Math.min(fotos.length-1,i+1))} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,0.5)', border:'none', color:'#fff', width:36, height:36, borderRadius:18, fontSize:18 }}>›</button>
                  </>
                )}
              </div>
              {fotos.length > 1 && (
                <div style={{ display:'flex', justifyContent:'center', gap:4, padding:'8px 0', background:'rgba(0,0,0,0.5)', position:'absolute', bottom:0, left:0, right:0 }}>
                  {fotos.map((_,i) => <div key={i} onClick={() => setFotoIdx(i)} style={{ width:i===fotoIdx?16:6, height:6, borderRadius:3, background:i===fotoIdx?'#fff':'rgba(255,255,255,0.4)', cursor:'pointer', transition:'width 0.2s' }} />)}
                </div>
              )}
            </>
          ) : <div style={{ height:200, background:'#1a1a2e' }} />}

          {/* Voltar + Fav */}
          <button onClick={() => router.back()} style={{ position:'absolute', top:50, left:16, background:'rgba(0,0,0,0.55)', border:'none', color:'#fff', borderRadius:20, padding:'7px 14px', fontSize:13, fontWeight:700 }}>← Voltar</button>
          <button onClick={toggleFav} style={{ position:'absolute', top:50, right:16, background:'rgba(0,0,0,0.55)', border:'none', color:isFav?'#FF4D6D':'rgba(255,255,255,0.6)', fontSize:24, borderRadius:20, padding:'4px 10px' }}>{isFav?'♥':'♡'}</button>
          {prof.online && <div style={{ position:'absolute', top:50, left:'50%', transform:'translateX(-50%)', background:'rgba(34,197,94,0.8)', borderRadius:12, padding:'4px 10px', display:'flex', alignItems:'center', gap:4 }}><div style={{ width:6, height:6, borderRadius:3, background:'#fff' }}/><span style={{ color:'#fff', fontSize:11, fontWeight:700 }}>Online</span></div>}
        </div>

        {/* Info */}
        <div style={{ padding:20 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:6 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                <span style={{ fontSize:22, fontWeight:800, color:'#fff' }}>{prof.display_name}</span>
                {prof.profile_age && <span style={{ color:'rgba(255,255,255,0.6)', fontSize:14 }}>{prof.profile_age}a</span>}
                {prof.verified && <span style={{ background:'#6C63FF', borderRadius:6, width:16, height:16, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800 }}>V</span>}
              </div>
              <div style={{ fontSize:13, color:'#666' }}>{prof.home_city}{prof.home_state?', '+prof.home_state:''}</div>
            </div>
            {(prof.price_program||prof.price_per_hour) && (
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:22, fontWeight:800, color:'#22c55e' }}>R${prof.price_program||prof.price_per_hour}</div>
                <div style={{ fontSize:11, color:'#555' }}>{prof.price_program?'programa':'por hora'}</div>
              </div>
            )}
          </div>

          {prof.tagline && <div style={{ fontSize:15, color:'#aaa', fontStyle:'italic', marginBottom:12, lineHeight:'22px' }}>"{prof.tagline}"</div>}
          {prof.bio && <div style={{ fontSize:14, color:'#999', lineHeight:'22px', marginBottom:16 }}>{prof.bio}</div>}

          {/* Tags */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
            {prof.price_overnight && <Pill label={`Pernoite R$${prof.price_overnight}`} />}
            {prof.attends_outcall && <Pill label="Hotel" />}
            {prof.attends_incall  && <Pill label="Recebe" />}
            {prof.attends_couples && <Pill label="Casal" cor="#FF4D6D" />}
            {prof.travel_radius_km>0 && <Pill label={`Viaja ${prof.travel_radius_km}km`} cor="#22c55e" />}
            {(prof.payment_methods||[]).map(p => <Pill key={p} label={p} />)}
          </div>

          {/* Botoes de contato */}
          <div style={{ display:'flex', gap:10, marginBottom:12 }}>
            {prof.whatsapp_hash ? (
              <button onClick={() => abrirContato('whatsapp')} style={{ flex:1, background:'#25D366', color:'#fff', border:'none', borderRadius:12, padding:14, fontWeight:700, fontSize:15 }}>WhatsApp</button>
            ) : (
              <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:12, padding:14, textAlign:'center', color:'#444', fontSize:13 }}>Sem contato</div>
            )}
            {prof.external_link && (
              <button onClick={() => abrirContato('link')} style={{ flex:1, background:'rgba(255,255,255,0.08)', color:'#fff', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, padding:14, fontWeight:700, fontSize:15 }}>Ver mais</button>
            )}
          </div>

          <button onClick={() => setDen(true)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.2)', fontSize:12, padding:'8px 0' }}>Denunciar este perfil</button>
        </div>

        {/* Banner */}
        <div style={{ height:50, background:'#111', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <iframe src="https://adserver.juicyads.com/adshow.php?adzone=1113978" width="300" height="50" frameBorder="0" scrolling="no" style={{ border:0 }} />
        </div>

        {/* Modal aviso */}
        {modalOpen && <ModalAviso prof={prof} tipo={tipoContato} onClose={() => setModal(false)} onConfirm={confirmarContato} />}

        {/* Modal denuncia */}
        {denOpen && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
            <div style={{ background:'#1a1a2e', borderRadius:'20px 20px 0 0', padding:'24px 24px 40px', width:'100%', maxWidth:500 }}>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Denunciar perfil</div>
              <textarea value={denMotivo} onChange={e=>setDenM(e.target.value)} placeholder="Descreva o motivo..."
                style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1px solid #2a2a3e', borderRadius:10, padding:12, color:'#fff', fontSize:14, minHeight:100, resize:'none', outline:'none' }} />
              <button onClick={enviarDenuncia} style={{ width:'100%', background:'#ef4444', border:'none', borderRadius:12, padding:14, color:'#fff', fontWeight:700, fontSize:15, marginTop:12 }}>Enviar denuncia</button>
              <button onClick={() => setDen(false)} style={{ width:'100%', background:'none', border:'none', color:'#555', fontSize:13, padding:10 }}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function Pill({ label, cor='#6C63FF' }) {
  return <span style={{ background:cor+'22', borderRadius:12, padding:'5px 10px', color:cor, fontSize:12, fontWeight:500 }}>{label}</span>
}
