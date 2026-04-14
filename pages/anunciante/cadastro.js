import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function Cadastro() {
  const router = useRouter()
  const [etapa, setEtapa]  = useState(1)
  const [form, setForm]    = useState({ nome:'', cidade:'', estado:'', preco:'' })
  const [aceitouTermos, setTermos] = useState(false)
  const [aceitouMaior, setMaior]   = useState(false)
  const [loading, setLoad] = useState(false)
  const [erro, setErro]    = useState('')

  function set(k,v) { setForm(p=>({...p,[k]:v})) }

  async function salvar() {
    if (!form.nome.trim()) { setErro('Nome artistico e obrigatorio'); return }
    if (!aceitouTermos || !aceitouMaior) { setErro('Aceite os termos e confirme a maioridade'); return }
    setLoad(true); setErro('')
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('profiles').upsert({
      user_id: user.id, display_name: form.nome, home_city: form.cidade,
      home_state: form.estado.toUpperCase(), price_per_hour: form.preco ? parseInt(form.preco) : null,
      status: 'pending', gender: 'mulher', terms_accepted_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    setLoad(false)
    if (error) { setErro(error.message); return }
    setEtapa(2)
  }

  return (
    <div style={{ maxWidth:480, margin:'0 auto', minHeight:'100vh', padding:'60px 24px 40px' }}>
      <div style={{ display:'flex', justifyContent:'center', gap:40, marginBottom:32 }}>
        {['Perfil','Verificacao'].map((e,i) => (
          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div style={{ width:32, height:32, borderRadius:16, background:i+1<=etapa?'#6C63FF':'#1a1a2e', border:`2px solid ${i+1<=etapa?'#6C63FF':'#2a2a3e'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700 }}>{i+1}</div>
            <span style={{ fontSize:10, color:i+1<=etapa?'#6C63FF':'#555', fontWeight:600 }}>{e}</span>
          </div>
        ))}
      </div>

      {etapa === 1 && (
        <>
          <div style={{ fontSize:22, fontWeight:800, marginBottom:6 }}>Seu perfil</div>
          <div style={{ color:'#aaa', fontSize:13, marginBottom:24 }}>Preencha as informacoes basicas.</div>
          {erro && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:12, color:'#ef4444', fontSize:13, marginBottom:16 }}>{erro}</div>}
          {[{k:'nome',l:'Nome artistico *',p:'Como quer ser conhecido(a)'},{k:'cidade',l:'Cidade',p:'Ex: Sao Paulo'},{k:'estado',l:'Estado',p:'Ex: SP'},{k:'preco',l:'Preco por hora (R$)',p:'Ex: 300',type:'number'}].map(c => (
            <div key={c.k} style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>{c.l}</div>
              <input type={c.type||'text'} placeholder={c.p} value={form[c.k]} onChange={e=>set(c.k,e.target.value)} maxLength={c.k==='estado'?2:undefined}
                style={{ width:'100%', background:'rgba(255,255,255,0.07)', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'14px', color:'#fff', fontSize:15, outline:'none' }} />
            </div>
          ))}
          <div style={{ background:'rgba(108,99,255,0.08)', border:'1px solid rgba(108,99,255,0.2)', borderRadius:12, padding:14, marginBottom:20 }}>
            {[{state:aceitouMaior,set:setMaior,label:'Declaro que tenho 18 anos ou mais'},{state:aceitouTermos,set:setTermos,label:'Li e aceito os Termos de Uso e Politica de Privacidade'}].map((c,i) => (
              <div key={i} onClick={() => c.set(v=>!v)} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:i===0?10:0, cursor:'pointer' }}>
                <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${c.state?'#6C63FF':'#333'}`, background:c.state?'#6C63FF':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {c.state && <span style={{ color:'#fff', fontSize:11, fontWeight:700 }}>V</span>}
                </div>
                <span style={{ color:'#aaa', fontSize:13, lineHeight:'19px' }}>{c.label}</span>
              </div>
            ))}
          </div>
          <button onClick={salvar} disabled={loading} style={{ width:'100%', background:'#6C63FF', border:'none', borderRadius:14, padding:16, color:'#fff', fontWeight:700, fontSize:15 }}>
            {loading ? 'Salvando...' : 'Continuar'}
          </button>
          <button onClick={() => router.replace('/anunciante/painel')} style={{ width:'100%', background:'none', border:'none', color:'#555', fontSize:13, padding:12, marginTop:4 }}>Preencher depois</button>
        </>
      )}

      {etapa === 2 && (
        <>
          <div style={{ fontSize:22, fontWeight:800, marginBottom:6 }}>Verificacao de identidade</div>
          <div style={{ background:'rgba(108,99,255,0.12)', border:'1px solid rgba(108,99,255,0.25)', borderRadius:12, padding:14, marginBottom:20 }}>
            <div style={{ color:'#aaa', fontSize:13, lineHeight:'20px' }}>Seu perfil foi criado! Envie os documentos para aparecer no feed publico. Seus documentos ficam seguros e nao sao compartilhados.</div>
          </div>
          <div style={{ color:'#aaa', fontSize:14, marginBottom:20 }}>O envio de documentos esta disponivel apenas no app mobile por enquanto.</div>
          <button onClick={() => router.replace('/anunciante/painel')} style={{ width:'100%', background:'#6C63FF', border:'none', borderRadius:14, padding:16, color:'#fff', fontWeight:700, fontSize:15 }}>Ir para o painel</button>
        </>
      )}
    </div>
  )
}
