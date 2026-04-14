import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function LoginAnunciante() {
  const router = useRouter()
  const [phone, setPhone]  = useState('')
  const [otp, setOtp]      = useState('')
  const [sent, setSent]    = useState(false)
  const [loading, setLoad] = useState(false)
  const [erro, setErro]    = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/anunciante/painel')
    })
  }, [])

  async function enviar() {
    if (!phone.trim()) { setErro('Digite seu numero de celular'); return }
    setLoad(true); setErro('')
    const { error } = await supabase.auth.signInWithOtp({ phone: `+55${phone.replace(/\D/g,'')}` })
    setLoad(false)
    if (error) { setErro(error.message); return }
    setSent(true)
  }

  async function verificar() {
    if (otp.length < 6) { setErro('Digite o codigo de 6 digitos'); return }
    setLoad(true); setErro('')
    const { data, error } = await supabase.auth.verifyOtp({ phone: `+55${phone.replace(/\D/g,'')}`, token: otp, type: 'sms' })
    setLoad(false)
    if (error) { setErro(error.message); return }
    const { data: prof } = await supabase.from('profiles').select('id,status').eq('user_id', data.user.id).single()
    if (prof) router.replace('/anunciante/painel')
    else router.replace('/anunciante/cadastro')
  }

  return (
    <div style={{ maxWidth:480, margin:'0 auto', minHeight:'100vh', padding:'60px 24px 40px' }}>
      <button onClick={() => router.back()} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:14, marginBottom:24 }}>← Voltar</button>
      <div style={{ fontSize:24, fontWeight:800, marginBottom:6, letterSpacing:-0.5 }}>Anunciar no DoJobApp</div>
      <div style={{ color:'#aaa', fontSize:14, marginBottom:28 }}>Entre com seu numero de celular</div>

      {erro && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:12, color:'#ef4444', fontSize:13, marginBottom:16 }}>{erro}</div>}

      {!sent ? (
        <>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Celular</div>
          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            <div style={{ background:'rgba(255,255,255,0.07)', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'12px 14px', color:'#aaa', fontSize:14 }}>+55</div>
            <input type="tel" placeholder="(11) 99999-9999" value={phone} onChange={e=>setPhone(e.target.value)} onKeyDown={e=>e.key==='Enter'&&enviar()}
              style={{ flex:1, background:'rgba(255,255,255,0.07)', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'12px 14px', color:'#fff', fontSize:15, outline:'none' }} />
          </div>
          <button onClick={enviar} disabled={loading} style={{ width:'100%', background:'#6C63FF', border:'none', borderRadius:14, padding:16, color:'#fff', fontWeight:700, fontSize:15 }}>
            {loading ? 'Enviando...' : 'Enviar codigo SMS'}
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Codigo SMS</div>
          <input type="number" placeholder="000000" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&verificar()}
            style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1.5px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'14px', color:'#fff', fontSize:24, outline:'none', textAlign:'center', letterSpacing:10, marginBottom:16 }} />
          <button onClick={verificar} disabled={loading||otp.length<6} style={{ width:'100%', background:'#6C63FF', border:'none', borderRadius:14, padding:16, color:'#fff', fontWeight:700, fontSize:15, marginBottom:10, opacity:otp.length<6?0.5:1 }}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
          <button onClick={() => setSent(false)} style={{ width:'100%', background:'none', border:'1px solid rgba(255,255,255,0.15)', borderRadius:14, padding:14, color:'rgba(255,255,255,0.5)', fontSize:14 }}>Reenviar codigo</button>
        </>
      )}

      <div style={{ background:'rgba(108,99,255,0.1)', border:'1px solid rgba(108,99,255,0.2)', borderRadius:12, padding:14, marginTop:24 }}>
        {['Seu numero nao aparece no perfil publico','Usamos apenas para login seguro','Seus dados pessoais nao sao compartilhados'].map((t,i) => (
          <div key={i} style={{ color:'rgba(255,255,255,0.4)', fontSize:12, lineHeight:'20px' }}>(*) {t}</div>
        ))}
      </div>
    </div>
  )
}
