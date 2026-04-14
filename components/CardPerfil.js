import { useRouter } from 'next/router'

export default function CardPerfil({ prof, isFav, onFav, dist }) {
  const router = useRouter()
  const fotos = (prof.photos||[]).filter(p=>p.status==='approved'&&p.type!=='video')
  const capa = fotos.find(p=>p.is_cover)||fotos[0]

  return (
    <div onClick={() => router.push(`/perfil/${prof.id}`)} style={{ background:'#1a1a2e', borderRadius:14, display:'flex', padding:12, gap:12, border:'1px solid #2a2a3e', cursor:'pointer', transition:'border-color 0.2s' }}
      onMouseEnter={e=>e.currentTarget.style.borderColor='#6C63FF'}
      onMouseLeave={e=>e.currentTarget.style.borderColor='#2a2a3e'}>
      <div style={{ width:82, height:82, borderRadius:12, overflow:'hidden', background:'#0f0f1e', flexShrink:0, position:'relative' }}>
        {capa?.url && <img src={capa.url} alt={prof.display_name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
        {prof.online && <div style={{ position:'absolute', bottom:4, right:4, width:10, height:10, borderRadius:5, background:'#22c55e', border:'2px solid #1a1a2e' }} />}
        {fotos.length > 1 && <div style={{ position:'absolute', top:5, right:5, background:'rgba(0,0,0,0.6)', borderRadius:8, padding:'2px 5px', fontSize:9, fontWeight:700 }}>{fotos.length}</div>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:2 }}>
          <span style={{ fontSize:15, fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{prof.display_name}</span>
          {prof.verified && <span style={{ background:'#6C63FF', borderRadius:6, width:15, height:15, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, flexShrink:0 }}>V</span>}
          <button onClick={e=>{e.stopPropagation();onFav?.()}} style={{ marginLeft:'auto', background:'none', border:'none', fontSize:16, color:isFav?'#FF4D6D':'#444', flexShrink:0 }}>
            {isFav?'♥':'♡'}
          </button>
        </div>
        {prof.tagline && <div style={{ fontSize:12, color:'#666', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{prof.tagline}</div>}
        <div style={{ fontSize:11, color:'#555', display:'flex', alignItems:'center', gap:6 }}>
          <span>{prof.home_city}{prof.home_state?', '+prof.home_state:''}{prof.profile_age?' · '+prof.profile_age+'a':''}</span>
          {dist!=null && <span style={{ color:'#6C63FF', fontWeight:600 }}>{dist<1?(dist*1000).toFixed(0)+'m':dist.toFixed(1)+'km'}</span>}
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:4 }}>
          {(prof.price_program||prof.price_per_hour) && (
            <span style={{ background:'#0d2e1a', borderRadius:8, padding:'2px 7px', color:'#22c55e', fontSize:11, fontWeight:700 }}>
              R${prof.price_program||prof.price_per_hour}{!prof.price_program?'/h':''}
            </span>
          )}
          {prof.attends_outcall && <Tag>Hotel</Tag>}
          {prof.attends_couples && <Tag cor="#FF4D6D">Casal</Tag>}
          {prof.payment_methods?.includes('pix') && <Tag>Pix</Tag>}
        </div>
      </div>
    </div>
  )
}

function Tag({ children, cor='#6C63FF' }) {
  return <span style={{ background:cor+'22', borderRadius:8, padding:'2px 6px', color:cor, fontSize:10, fontWeight:500 }}>{children}</span>
}
