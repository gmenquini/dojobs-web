export default function AgeGate({ onConfirm }) {
  function confirmar() {
    localStorage.setItem('dojobs_age_ok', '1')
    onConfirm()
  }
  return (
    <div style={{ minHeight:'100vh', background:'#0a0a14', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:28 }}>
      <div style={{ fontSize:52, marginBottom:12 }}>💼</div>
      <div style={{ fontSize:28, fontWeight:800, color:'#fff', marginBottom:4, letterSpacing:-1 }}>DoJobApp</div>
      <div style={{ background:'rgba(255,77,109,0.1)', border:'1px solid rgba(255,77,109,0.25)', borderRadius:12, padding:16, margin:'24px 0', maxWidth:360, width:'100%' }}>
        <div style={{ color:'#FF4D6D', fontWeight:700, fontSize:14, marginBottom:4, textAlign:'center' }}>Conteudo adulto · 18+</div>
        <div style={{ color:'#aaa', fontSize:13, lineHeight:'19px', textAlign:'center' }}>Este aplicativo contem conteudo adulto. Confirme que voce tem 18 anos ou mais para continuar.</div>
      </div>
      <button onClick={confirmar} style={{ background:'#6C63FF', color:'#fff', border:'none', borderRadius:14, padding:'16px 0', width:'100%', maxWidth:360, fontSize:15, fontWeight:700, marginBottom:10 }}>
        Tenho 18 anos ou mais
      </button>
      <button style={{ background:'none', border:'1px solid rgba(255,255,255,0.15)', borderRadius:14, padding:'14px 0', width:'100%', maxWidth:360, color:'rgba(255,255,255,0.4)', fontSize:13 }}>
        Nao tenho 18 anos
      </button>
      <div style={{ color:'rgba(255,255,255,0.25)', fontSize:11, textAlign:'center', lineHeight:'16px', marginTop:20, maxWidth:320 }}>
        Ao continuar voce concorda com os Termos de Uso e Politica de Privacidade.
      </div>
    </div>
  )
}
