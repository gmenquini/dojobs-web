import { useState } from 'react'

export default function ModalAviso({ prof, tipo, onClose, onConfirm }) {
  const [check, setCheck] = useState(false)
  if (!prof) return null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.72)', zIndex:1000, display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
      <div style={{ background:'#1a1a2e', borderRadius:'20px 20px 0 0', padding:'24px 24px 40px', width:'100%', maxWidth:500, borderTop:'1px solid rgba(108,99,255,0.3)' }}>
        <div style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:16, textAlign:'center' }}>Aviso de seguranca</div>
        {['Nunca pague adiantado.','Se a foto nao conferir, desconfie e reporte.','DoJob e uma plataforma de anuncios.','Use Denunciar para reportar perfis falsos.'].map((txt,i) => (
          <div key={i} style={{ display:'flex', gap:10, marginBottom:10, alignItems:'flex-start' }}>
            <span style={{ color:'#f59e0b', fontWeight:800, fontSize:13 }}>!</span>
            <span style={{ color:'#aaa', fontSize:13, lineHeight:'19px' }}>{txt}</span>
          </div>
        ))}
        <div onClick={() => setCheck(v=>!v)} style={{ display:'flex', alignItems:'center', gap:12, background:'#0f0f1e', borderRadius:10, padding:12, cursor:'pointer', marginTop:8, marginBottom:16 }}>
          <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${check?'#6C63FF':'#333'}`, background:check?'#6C63FF':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {check && <span style={{ color:'#fff', fontSize:11, fontWeight:700 }}>V</span>}
          </div>
          <span style={{ color:'#ccc', fontSize:13, fontWeight:500 }}>Li e entendi</span>
        </div>
        <button onClick={onConfirm} disabled={!check} style={{ width:'100%', background:'#25D366', border:'none', borderRadius:14, padding:15, color:'#fff', fontWeight:700, fontSize:15, opacity:check?1:0.4, cursor:check?'pointer':'not-allowed' }}>
          Continuar para contato
        </button>
        <button onClick={onClose} style={{ width:'100%', background:'none', border:'none', color:'#aaa', fontSize:13, padding:12, marginTop:4 }}>Cancelar</button>
      </div>
    </div>
  )
}
