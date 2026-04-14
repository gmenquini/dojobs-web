import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

const ABAS = [{id:'inicio',l:'Inicio'},{id:'perfil',l:'Perfil'},{id:'fotos',l:'Fotos'},{id:'anuncio',l:'Anuncio'},{id:'plano',l:'Plano'},{id:'avisos',l:'Avisos'}]

export default function PainelAnunciante() {
  const router = useRouter()
  const [aba, setAba]           = useState('inicio')
  const [user, setUser]         = useState(null)
  const [prof, setProf]         = useState(null)
  const [loading, setLoad]      = useState(true)
  const [saving, setSaving]     = useState(false)
  const [notifs, setNotifs]     = useState([])
  const [fotos, setFotos]       = useState([])
  const [uploadLoading, setUL]  = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace('/anunciante/login'); return }
      setUser(user)
      const { data: p } = await supabase.from('profiles').select('*,photos(id,url,is_cover,order,type,status)').eq('user_id', user.id).single()
      if (!p) { router.replace('/anunciante/cadastro'); return }
      setProf(p); setFotos(p.photos||[]); setLoad(false)
      const { data: ns } = await supabase.from('notifications').select('*').eq('profile_id', p.id).eq('read', false).order('created_at',{ascending:false}).limit(20)
      setNotifs(ns||[])
    })
  }, [])

  async function salvarPerfil(updates) {
    setSaving(true)
    const { data, error } = await supabase.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', prof.id).select().single()
    setSaving(false)
    if (!error) setProf(data)
    return error
  }

  async function uploadFoto(file) {
    setUL(true)
    const ext = file.name.split('.').pop()
    const path = `${prof.id}/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('profile-photos').upload(path, file, { upsert: true })
    if (upErr) { setUL(false); alert('Erro ao fazer upload'); return }
    const { data: { publicUrl } } = supabase.storage.from('profile-photos').getPublicUrl(path)
    const { data: foto } = await supabase.from('photos').insert({ profile_id: prof.id, url: publicUrl, type: 'image', status: 'pending', order: fotos.length }).select().single()
    if (foto) setFotos(p => [...p, foto])
    setUL(false)
  }

  async function deletarFoto(fotoId) {
    if (!confirm('Deletar foto?')) return
    await supabase.from('photos').delete().eq('id', fotoId)
    setFotos(p => p.filter(f => f.id !== fotoId))
  }

  async function definirCapa(fotoId) {
    await supabase.from('photos').update({ is_cover: false }).eq('profile_id', prof.id)
    await supabase.from('photos').update({ is_cover: true }).eq('id', fotoId)
    setFotos(p => p.map(f => ({ ...f, is_cover: f.id === fotoId })))
  }

  async function logout() {
    await supabase.auth.signOut()
    router.replace('/')
  }

  async function marcarLido(id) {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifs(p => p.filter(n => n.id !== id))
  }

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#555' }}>Carregando...</div>
  if (!prof) return null

  const fotosAprovadas = fotos.filter(f => f.status === 'approved' && f.type !== 'video')
  const maxFotos = prof.plan === 'premium' ? 10 : prof.plan === 'pro' ? 3 : 1

  return (
    <div style={{ maxWidth:600, margin:'0 auto', minHeight:'100vh', paddingBottom:80 }}>
      {/* Header */}
      <div style={{ padding:'50px 16px 16px', borderBottom:'1px solid #1a1a2e', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:18, fontWeight:800 }}>{prof.display_name}</div>
          <div style={{ fontSize:12, color:prof.status==='active'?'#22c55e':prof.status==='pending'?'#f59e0b':'#ef4444', fontWeight:600, marginTop:2 }}>
            {prof.status==='active'?'Ativo':prof.status==='pending'?'Aguardando aprovacao':'Suspenso'}
          </div>
        </div>
        <button onClick={logout} style={{ background:'none', border:'1px solid #2a2a3e', borderRadius:10, padding:'8px 14px', color:'#aaa', fontSize:13 }}>Sair</button>
      </div>

      {/* Abas */}
      <div style={{ display:'flex', overflowX:'auto', borderBottom:'1px solid #1a1a2e', gap:0 }}>
        {ABAS.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)} style={{ padding:'12px 16px', background:'none', border:'none', color:aba===a.id?'#fff':'#555', fontWeight:600, fontSize:13, borderBottom:aba===a.id?'2px solid #6C63FF':'2px solid transparent', whiteSpace:'nowrap', position:'relative' }}>
            {a.l}
            {a.id==='avisos' && notifs.length > 0 && <span style={{ position:'absolute', top:8, right:8, background:'#FF4D6D', borderRadius:10, width:16, height:16, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800 }}>{notifs.length}</span>}
          </button>
        ))}
      </div>

      <div style={{ padding:16 }}>
        {/* ABA INICIO */}
        {aba === 'inicio' && (
          <div>
            <div style={{ display:'flex', gap:12, marginBottom:16 }}>
              <Stat label="Views" value={prof.views_count||0} />
              <Stat label="Contatos" value={prof.clicks_count||0} />
              <Stat label="Fotos" value={`${fotosAprovadas.length}/${maxFotos}`} />
            </div>

            {prof.status === 'pending' && (
              <div style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:12, padding:14, marginBottom:16 }}>
                <div style={{ color:'#f59e0b', fontWeight:700, marginBottom:4 }}>Perfil em analise</div>
                <div style={{ color:'#aaa', fontSize:13 }}>Seu perfil esta sendo analisado. Voce sera notificado por email quando for aprovado.</div>
              </div>
            )}

            <div style={{ display:'flex', gap:10, marginBottom:16 }}>
              <button onClick={() => setAba('perfil')} style={{ flex:1, background:'#6C63FF', border:'none', borderRadius:12, padding:14, color:'#fff', fontWeight:700, fontSize:14 }}>Editar perfil</button>
              <button onClick={() => setAba('fotos')} style={{ flex:1, background:'rgba(255,255,255,0.08)', border:'1px solid #2a2a3e', borderRadius:12, padding:14, color:'#fff', fontWeight:700, fontSize:14 }}>Gerenciar fotos</button>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={async () => { const err = await salvarPerfil({ online: !prof.online }); if (!err) setProf(p=>({...p,online:!p.online})) }}
                style={{ flex:1, background:prof.online?'rgba(34,197,94,0.15)':'rgba(255,255,255,0.06)', border:`1px solid ${prof.online?'#22c55e':'#2a2a3e'}`, borderRadius:12, padding:12, color:prof.online?'#22c55e':'#aaa', fontWeight:700, fontSize:13 }}>
                {prof.online ? '● Online' : '○ Offline'}
              </button>
              <button onClick={async () => { if (confirm(prof.paused?'Reativar perfil?':'Pausar perfil?')) await salvarPerfil({ paused: !prof.paused }) }}
                style={{ flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid #2a2a3e', borderRadius:12, padding:12, color:'#aaa', fontWeight:700, fontSize:13 }}>
                {prof.paused ? 'Reativar' : 'Pausar'}
              </button>
            </div>
          </div>
        )}

        {/* ABA PERFIL */}
        {aba === 'perfil' && (
          <FormPerfil prof={prof} onSave={salvarPerfil} saving={saving} />
        )}

        {/* ABA FOTOS */}
        {aba === 'fotos' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div style={{ fontSize:14, fontWeight:700 }}>Fotos ({fotos.length}/{maxFotos})</div>
              {fotos.length < maxFotos && (
                <label style={{ background:'#6C63FF', color:'#fff', borderRadius:10, padding:'8px 16px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  {uploadLoading ? 'Enviando...' : '+ Adicionar'}
                  <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => e.target.files[0] && uploadFoto(e.target.files[0])} disabled={uploadLoading} />
                </label>
              )}
            </div>
            {fotos.length === 0 ? (
              <div style={{ textAlign:'center', padding:40, color:'#555', border:'2px dashed #2a2a3e', borderRadius:14 }}>Nenhuma foto ainda. Adicione sua primeira foto!</div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8 }}>
                {fotos.map(f => (
                  <div key={f.id} style={{ position:'relative', aspectRatio:'1', borderRadius:10, overflow:'hidden', border:f.is_cover?'2px solid #6C63FF':'2px solid transparent' }}>
                    <img src={f.url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0)', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:6 }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.5)'}
                      onMouseLeave={e=>e.currentTarget.style.background='rgba(0,0,0,0)'}>
                      {f.status === 'pending' && <span style={{ background:'rgba(245,158,11,0.9)', borderRadius:6, padding:'2px 6px', fontSize:9, fontWeight:700, color:'#fff', alignSelf:'flex-start' }}>Pendente</span>}
                      {f.is_cover && <span style={{ background:'rgba(108,99,255,0.9)', borderRadius:6, padding:'2px 6px', fontSize:9, fontWeight:700, color:'#fff', alignSelf:'flex-start' }}>Capa</span>}
                      <div style={{ display:'flex', gap:4, justifyContent:'flex-end' }}>
                        {!f.is_cover && <button onClick={() => definirCapa(f.id)} style={{ background:'rgba(108,99,255,0.8)', border:'none', borderRadius:6, padding:'4px 6px', color:'#fff', fontSize:9, fontWeight:700 }}>Capa</button>}
                        <button onClick={() => deletarFoto(f.id)} style={{ background:'rgba(239,68,68,0.8)', border:'none', borderRadius:6, padding:'4px 6px', color:'#fff', fontSize:9, fontWeight:700 }}>Del</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABA ANUNCIO */}
        {aba === 'anuncio' && (
          <FormAnuncio prof={prof} onSave={salvarPerfil} saving={saving} />
        )}

        {/* ABA PLANO */}
        {aba === 'plano' && (
          <div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Seu plano atual: <span style={{ color:'#6C63FF', textTransform:'capitalize' }}>{prof.plan}</span></div>
            {[{id:'free',nome:'Free',preco:'Gratis',fotos:'1 foto'},{id:'pro',nome:'Pro',preco:'R$49/mes',fotos:'3 fotos'},{id:'premium',nome:'Premium',preco:'R$89/mes',fotos:'10 fotos + 1 video'}].map(p => (
              <div key={p.id} style={{ background:prof.plan===p.id?'rgba(108,99,255,0.12)':'#1a1a2e', border:`1px solid ${prof.plan===p.id?'#6C63FF':'#2a2a3e'}`, borderRadius:12, padding:16, marginBottom:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:p.id==='premium'?'#d97706':p.id==='pro'?'#6C63FF':'#fff' }}>{p.nome}</div>
                  <div style={{ fontSize:12, color:'#555', marginTop:2 }}>{p.fotos}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight:800, color:'#22c55e', fontSize:14 }}>{p.preco}</div>
                  {prof.plan !== p.id && p.id !== 'free' && (
                    <button style={{ background:'#6C63FF', border:'none', borderRadius:8, padding:'6px 12px', color:'#fff', fontSize:11, fontWeight:700, marginTop:4 }}>Assinar</button>
                  )}
                  {prof.plan === p.id && <div style={{ fontSize:11, color:'#6C63FF', fontWeight:600, marginTop:4 }}>Plano atual</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABA AVISOS */}
        {aba === 'avisos' && (
          <div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Notificacoes {notifs.length > 0 && <span style={{ background:'#FF4D6D', borderRadius:10, padding:'2px 8px', fontSize:11, marginLeft:8 }}>{notifs.length}</span>}</div>
            {notifs.length === 0 ? (
              <div style={{ textAlign:'center', padding:40, color:'#555' }}>Sem notificacoes novas.</div>
            ) : notifs.map(n => (
              <div key={n.id} style={{ background:'#1a1a2e', borderRadius:12, padding:14, marginBottom:10, border:'1px solid #2a2a3e', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{n.title}</div>
                  <div style={{ color:'#aaa', fontSize:13 }}>{n.body}</div>
                  <div style={{ color:'#555', fontSize:11, marginTop:4 }}>{new Date(n.created_at).toLocaleDateString('pt-BR')}</div>
                </div>
                <button onClick={() => marcarLido(n.id)} style={{ background:'none', border:'none', color:'#555', fontSize:18, padding:'0 0 0 10px' }}>x</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div style={{ flex:1, background:'#1a1a2e', borderRadius:12, padding:'12px 16px', border:'1px solid #2a2a3e', textAlign:'center' }}>
      <div style={{ fontSize:22, fontWeight:800, color:'#6C63FF' }}>{value}</div>
      <div style={{ fontSize:11, color:'#555', marginTop:2 }}>{label}</div>
    </div>
  )
}

function FormPerfil({ prof, onSave, saving }) {
  const [form, setForm] = useState({
    display_name: prof.display_name||'', tagline: prof.tagline||'', bio: prof.bio||'',
    home_city: prof.home_city||'', home_state: prof.home_state||'',
    price_per_hour: prof.price_per_hour||'', price_program: prof.price_program||'',
    price_overnight: prof.price_overnight||'', whatsapp_hash: prof.whatsapp_hash||'',
    external_link: prof.external_link||'', profile_age: prof.profile_age||'',
  })
  const [msg, setMsg] = useState('')

  function set(k,v) { setForm(p=>({...p,[k]:v})) }

  async function salvar() {
    const err = await onSave({
      display_name: form.display_name, tagline: form.tagline||null, bio: form.bio||null,
      home_city: form.home_city, home_state: form.home_state,
      price_per_hour: form.price_per_hour ? +form.price_per_hour : null,
      price_program: form.price_program ? +form.price_program : null,
      price_overnight: form.price_overnight ? +form.price_overnight : null,
      whatsapp_hash: form.whatsapp_hash.replace(/\D/g,'')||null,
      external_link: form.external_link||null,
      profile_age: form.profile_age ? +form.profile_age : null,
    })
    setMsg(err ? 'Erro ao salvar.' : 'Salvo!')
    setTimeout(() => setMsg(''), 3000)
  }

  const campos = [
    {k:'display_name',l:'Nome artistico *',p:'Como quer ser conhecido(a)'},
    {k:'tagline',l:'Frase de destaque',p:'Ex: Discreta e sofisticada em SP',max:100},
    {k:'home_city',l:'Cidade',p:'Sao Paulo'},{k:'home_state',l:'Estado',p:'SP'},
    {k:'profile_age',l:'Idade (publica)',p:'Ex: 25',type:'number'},
    {k:'price_program',l:'Programa (R$)',p:'Ex: 250',type:'number'},
    {k:'price_per_hour',l:'Hora (R$)',p:'Ex: 300',type:'number'},
    {k:'price_overnight',l:'Pernoite (R$)',p:'Opcional',type:'number'},
    {k:'whatsapp_hash',l:'WhatsApp (so numeros)',p:'11999999999'},
    {k:'external_link',l:'Link externo (OF, Privacy...)',p:'https://...'},
  ]

  return (
    <div>
      {campos.map(c => (
        <div key={c.k} style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>{c.l}</div>
          <input type={c.type||'text'} placeholder={c.p} value={form[c.k]} onChange={e=>set(c.k,e.target.value)} maxLength={c.max}
            style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:12, padding:14, color:'#fff', fontSize:15, outline:'none' }} />
        </div>
      ))}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>Bio / Descricao</div>
        <textarea placeholder="Conte quem voce e, seu estilo, o que te diferencia..." value={form.bio} onChange={e=>set('bio',e.target.value)}
          style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:12, padding:14, color:'#fff', fontSize:15, outline:'none', minHeight:120, resize:'vertical' }} />
      </div>
      {msg && <div style={{ background:msg==='Salvo!'?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)', border:`1px solid ${msg==='Salvo!'?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)'}`, borderRadius:10, padding:12, marginBottom:12, color:msg==='Salvo!'?'#22c55e':'#ef4444', fontSize:13 }}>{msg}</div>}
      <button onClick={salvar} disabled={saving} style={{ width:'100%', background:'#6C63FF', border:'none', borderRadius:14, padding:16, color:'#fff', fontWeight:700, fontSize:15 }}>
        {saving ? 'Salvando...' : 'Salvar perfil'}
      </button>
    </div>
  )
}

function FormAnuncio({ prof, onSave, saving }) {
  const [form, setForm] = useState({
    gender: prof.gender||'mulher',
    attends_outcall: prof.attends_outcall||false,
    attends_incall: prof.attends_incall||false,
    attends_couples: prof.attends_couples||false,
    payment_methods: prof.payment_methods||[],
    show_on_map: prof.show_on_map||false,
    advertise_by_city: prof.advertise_by_city||false,
  })
  const [msg, setMsg] = useState('')

  function tog(k) { setForm(p=>({...p,[k]:!p[k]})) }
  function togArr(k,v) { setForm(p=>({...p,[k]:p[k].includes(v)?p[k].filter(x=>x!==v):[...p[k],v]})) }

  async function salvar() {
    const err = await onSave(form)
    setMsg(err ? 'Erro ao salvar.' : 'Salvo!')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>Genero</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {['mulher','homem','trans_f','trans_m','nao_binario'].map(g => (
            <button key={g} onClick={() => setForm(p=>({...p,gender:g}))} style={{ border:`1px solid ${form.gender===g?'#6C63FF':'#2a2a3e'}`, borderRadius:20, padding:'8px 16px', background:form.gender===g?'#6C63FF':'#1a1a2e', color:'#fff', fontSize:13, fontWeight:600, textTransform:'capitalize' }}>
              {g.replace('_',' ')}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>Atendimento</div>
        {[['attends_outcall','Vai ao cliente (Hotel)'],['attends_incall','Recebe em casa/local proprio'],['attends_couples','Atende casais']].map(([k,l]) => (
          <div key={k} onClick={() => tog(k)} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #1a1a2e', cursor:'pointer' }}>
            <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${form[k]?'#6C63FF':'#333'}`, background:form[k]?'#6C63FF':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {form[k] && <span style={{ color:'#fff', fontSize:11, fontWeight:700 }}>V</span>}
            </div>
            <span style={{ color:'#ccc', fontSize:14 }}>{l}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>Pagamento</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {['pix','cartao','dinheiro','cripto'].map(p => (
            <button key={p} onClick={() => togArr('payment_methods',p)} style={{ border:`1px solid ${form.payment_methods.includes(p)?'#22c55e':'#2a2a3e'}`, borderRadius:20, padding:'8px 16px', background:form.payment_methods.includes(p)?'rgba(34,197,94,0.15)':'#1a1a2e', color:'#fff', fontSize:13, fontWeight:600, textTransform:'capitalize' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>Visibilidade</div>
        {[['show_on_map','Aparecer no mapa publico'],['advertise_by_city','Anunciar na minha cidade']].map(([k,l]) => (
          <div key={k} onClick={() => tog(k)} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #1a1a2e', cursor:'pointer' }}>
            <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${form[k]?'#6C63FF':'#333'}`, background:form[k]?'#6C63FF':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {form[k] && <span style={{ color:'#fff', fontSize:11, fontWeight:700 }}>V</span>}
            </div>
            <span style={{ color:'#ccc', fontSize:14 }}>{l}</span>
          </div>
        ))}
      </div>

      {msg && <div style={{ background:msg==='Salvo!'?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)', border:`1px solid ${msg==='Salvo!'?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)'}`, borderRadius:10, padding:12, marginBottom:12, color:msg==='Salvo!'?'#22c55e':'#ef4444', fontSize:13 }}>{msg}</div>}
      <button onClick={salvar} disabled={saving} style={{ width:'100%', background:'#6C63FF', border:'none', borderRadius:14, padding:16, color:'#fff', fontWeight:700, fontSize:15 }}>
        {saving ? 'Salvando...' : 'Salvar configuracoes'}
      </button>
    </div>
  )
}
