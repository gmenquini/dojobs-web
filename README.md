[Giuliano_READMEs_GitHub.html](https://github.com/user-attachments/files/28916344/Giuliano_READMEs_GitHub.html)
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Giuliano — READMEs GitHub</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f2; color: #1a1a1a; line-height: 1.6; }
.container { max-width: 820px; margin: 0 auto; padding: 2rem 1.5rem; }
h1 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.25rem; }
.subtitle { color: #777; font-size: 0.88rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #e0e0da; }
.tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1.5rem; }
.tab { padding: 6px 16px; border-radius: 20px; border: 1px solid #d0d0c8; background: #fff; font-size: 13px; cursor: pointer; color: #444; font-weight: 500; transition: all 0.15s; }
.tab.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
.sec { display: none; }
.sec.active { display: block; }
.card { background: #fff; border: 1px solid #e8e8e4; border-radius: 10px; padding: 1.4rem; margin-bottom: 1rem; }
.card-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin-bottom: 6px; }
.card-title { font-size: 0.95rem; font-weight: 600; margin-bottom: 4px; }
.card-sub { font-size: 0.83rem; color: #777; margin-bottom: 1rem; }
.copy-box { background: #f8f8f5; border: 1px solid #e0e0d8; border-radius: 8px; padding: 1.1rem 1.25rem; font-size: 0.85rem; line-height: 1.85; color: #2a2a2a; position: relative; white-space: pre-wrap; padding-right: 80px; font-family: 'Courier New', monospace; }
.copy-btn { position: absolute; top: 10px; right: 10px; background: #1a1a1a; color: #fff; border: none; border-radius: 6px; padding: 5px 14px; font-size: 11px; cursor: pointer; font-family: -apple-system, sans-serif; transition: all 0.15s; }
.copy-btn:hover { background: #333; }
.copy-btn.copied { background: #2e7d32; }
.tip { background: #fff8e1; border-left: 3px solid #f9a825; padding: 10px 14px; border-radius: 0 6px 6px 0; font-size: 0.83rem; color: #5d4037; margin-top: 1rem; line-height: 1.6; }
.steps { margin-top: 0.5rem; }
.step { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f0f0ec; align-items: flex-start; }
.step:last-child { border-bottom: none; }
.step-num { width: 24px; height: 24px; border-radius: 50%; background: #1a1a1a; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
.step-title { font-size: 0.9rem; font-weight: 600; margin-bottom: 2px; }
.step-desc { font-size: 0.82rem; color: #666; }
</style>
</head>
<body>
<div class="container">
  <h1>READMEs — GitHub</h1>
  <p class="subtitle">Copie cada README e cole direto no repositório correspondente no GitHub. Instruções de como fazer no final.</p>

  <div class="tabs">
    <button class="tab active" onclick="show('vizinho')">Do Vizinho</button>
    <button class="tab" onclick="show('condofy')">Condofy</button>
    <button class="tab" onclick="show('dojobs')">DoJobs</button>
    <button class="tab" onclick="show('daltonico')">DoDaltônico</button>
    <button class="tab" onclick="show('como')">Como publicar</button>
  </div>

  <!-- DO VIZINHO -->
  <div id="vizinho" class="sec active">
    <div class="card">
      <div class="card-label">Repositório: gmenquini/vizinho-vende-e-doa</div>
      <div class="card-title">Do Vizinho — README.md</div>
      <div class="card-sub">Copie tudo abaixo e cole no arquivo README.md do repositório</div>
      <div class="copy-box" id="readme-vizinho"># Do Vizinho

**Location-based neighborhood marketplace** — buy, sell, and donate items with people near you.

[![App Store](https://img.shields.io/badge/App%20Store-Download-blue?logo=apple)](https://apps.apple.com/app/id6760084153)
[![Play Store](https://img.shields.io/badge/Play%20Store-Download-green?logo=google-play)](https://play.google.com/store/apps/developer?id=gmenquini)

---

## What it does

Do Vizinho connects neighbors so they can exchange goods locally — without shipping, without strangers from across the country. Users can list items for sale or donation, browse what's available nearby on a map, and connect directly with the seller or donor.

**Core features:**
- Real-time geolocation — see listings on a map sorted by distance
- List items for sale or donation in under 60 seconds
- In-app messaging between buyer and seller
- In-app purchases and payment integration
- Available on iOS (App Store) and Android (Google Play)

---

## Tech stack

| Layer | Tech |
|-------|------|
| Mobile | React Native + Expo |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Maps | Google Maps API |
| Payments | App Store Billing + Google Play Billing |
| Notifications | Push notifications via Expo |

---

## Status

Live on App Store and Google Play.

---

## Developer

Built by [Giuliano Fabbrini Menquini](https://github.com/gmenquini)
gmenquini@gmail.com<button class="copy-btn" onclick="cp('readme-vizinho', this)">Copiar</button></div>
    </div>
  </div>

  <!-- CONDOFY -->
  <div id="condofy" class="sec">
    <div class="card">
      <div class="card-label">Repositório: gmenquini/condofy</div>
      <div class="card-title">Condofy — README.md</div>
      <div class="card-sub">Copie tudo abaixo e cole no arquivo README.md do repositório</div>
      <div class="copy-box" id="readme-condofy"># Condofy

**Bank reconciliation SaaS for property management companies** — automate the reconciliation of condominium financial records.

---

## What it does

Condofy helps property management companies (administradoras de condomínios) reconcile bank statements with their internal financial records automatically. It reduces hours of manual work to minutes by matching transactions, flagging discrepancies, and generating reconciliation reports.

**Core features:**
- Automated bank statement import and parsing
- Fuzzy matching of transactions with tolerance for fees and late charges
- Discrepancy detection and flagging
- Reconciliation reports by condominium
- Multi-condominium support from a single admin panel
- REST API built for integration with existing management systems

---

## Tech stack

| Layer | Tech |
|-------|------|
| Backend | Python · FastAPI |
| Database | PostgreSQL |
| Auth | JWT-based authentication |
| Deployment | Render |
| Frontend | React (admin panel) |

---

## Status

In active development. Backend API complete. Admin panel in progress.

---

## Developer

Built by [Giuliano Fabbrini Menquini](https://github.com/gmenquini)
gmenquini@gmail.com<button class="copy-btn" onclick="cp('readme-condofy', this)">Copiar</button></div>
    </div>
  </div>

  <!-- DOJOBS -->
  <div id="dojobs" class="sec">
    <div class="card">
      <div class="card-label">Repositório: gmenquini/dojobs-web</div>
      <div class="card-title">DoJobs — README.md</div>
      <div class="card-sub">Copie tudo abaixo e cole no arquivo README.md do repositório</div>
      <div class="copy-box" id="readme-dojobs"># DoJobs

**Professional services directory platform** — profile listings, service discovery, and subscription billing for adult entertainment professionals.

---

## What it does

DoJobs is a web and mobile platform where professionals can create verified profiles, list their services, set availability, and receive bookings. Clients can search, filter, and connect with professionals through the platform.

**Core features:**
- Professional profile creation with photos, description, and service listing
- Location-based search and filtering
- Subscription billing (monthly/annual plans)
- Admin panel for content moderation and user management
- Age verification flow
- JWT authentication with role-based access (user / professional / admin)

---

## Tech stack

| Layer | Tech |
|-------|------|
| Mobile | React Native + Expo |
| Web | Next.js |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Payments | Asaas (subscription billing) |
| Ad integration | JuicyAds |
| Admin | Custom Next.js admin panel (Vercel) |

---

## Status

Web platform live. Mobile app in development.

Admin panel: [dojobs-admin.vercel.app](https://dojobs-admin.vercel.app) (private)

---

## Developer

Built by [Giuliano Fabbrini Menquini](https://github.com/gmenquini)
gmenquini@gmail.com<button class="copy-btn" onclick="cp('readme-dojobs', this)">Copiar</button></div>
      <div class="tip">⚑ O README do DoJobs é neutro e profissional — descreve como plataforma de serviços para adultos sem detalhes explícitos. Isso é suficiente para recrutadores da indústria adulta entenderem o contexto, sem afastar outros.</div>
    </div>
  </div>

  <!-- DODALTONICO -->
  <div id="daltonico" class="sec">
    <div class="card">
      <div class="card-label">Repositório: gmenquini/dodaltonico</div>
      <div class="card-title">DoDaltônico — README.md</div>
      <div class="card-sub">Copie tudo abaixo e cole no arquivo README.md do repositório</div>
      <div class="copy-box" id="readme-daltonico"># DoDaltônico

**Color identification app for people with color blindness** — point your camera at anything and instantly know what color it is.

---

## What it does

DoDaltônico helps people with color blindness identify colors in real time using their phone camera. Point at any object, surface, or image and the app tells you exactly what color it is — with the color name in plain language, not just a hex code.

**Core features:**
- Real-time color detection via camera
- Color names in Portuguese and English
- Simple, accessible interface designed for low vision users
- Works offline — no internet required for core functionality
- Accessibility-first design: high contrast, large text, screen reader compatible

---

## Tech stack

| Layer | Tech |
|-------|------|
| Mobile | React Native + Expo |
| Color detection | Camera API + color analysis algorithm |
| Offline | Local processing, no server required |

---

## Why I built it

Color blindness affects approximately 1 in 12 men and 1 in 200 women worldwide. Simple daily tasks — choosing clothes, reading charts, identifying ripe fruit — can be genuinely difficult. DoDaltônico is a practical tool for a real problem.

---

## Status

Available on GitHub. Web demo in progress.

---

## Developer

Built by [Giuliano Fabbrini Menquini](https://github.com/gmenquini)
gmenquini@gmail.com<button class="copy-btn" onclick="cp('readme-daltonico', this)">Copiar</button></div>
      <div class="tip">⚑ O DoDaltônico tem uma história humana forte — "built this because I care about accessibility." Isso chama atenção de recrutadores que valorizam projetos com propósito social, especialmente na Europa.</div>
    </div>
  </div>

  <!-- COMO PUBLICAR -->
  <div id="como" class="sec">
    <div class="card">
      <div class="card-label">Passo a passo</div>
      <div class="card-title">Como adicionar o README em cada repositório</div>
      <div class="card-sub">Leva menos de 2 minutos por repositório. Não precisa instalar nada.</div>
      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-content">
            <div class="step-title">Acesse github.com/gmenquini</div>
            <div class="step-desc">Faça login na sua conta GitHub.</div>
          </div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-content">
            <div class="step-title">Clique no repositório (ex: vizinho-vende-e-doa)</div>
            <div class="step-desc">Abre a página do repositório.</div>
          </div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-content">
            <div class="step-title">Clique em "Add a README"</div>
            <div class="step-desc">Se o repositório não tem README ainda, aparece um botão verde "Add a README" na página principal. Clique nele.</div>
          </div>
        </div>
        <div class="step">
          <div class="step-num">4</div>
          <div class="step-content">
            <div class="step-title">Se já tem README: clique no arquivo README.md → ícone de lápis (editar)</div>
            <div class="step-desc">O ícone de lápis fica no canto superior direito do arquivo. Clica para editar direto no browser.</div>
          </div>
        </div>
        <div class="step">
          <div class="step-num">5</div>
          <div class="step-content">
            <div class="step-title">Apague o conteúdo atual e cole o README correspondente</div>
            <div class="step-desc">Use o botão "Copiar" na aba do projeto acima. Seleciona tudo no editor (Ctrl+A) e cola (Ctrl+V).</div>
          </div>
        </div>
        <div class="step">
          <div class="step-num">6</div>
          <div class="step-content">
            <div class="step-title">Clique em "Commit changes"</div>
            <div class="step-desc">Botão verde no canto superior direito. Deixa a mensagem padrão ou escreve "Add README". Confirma.</div>
          </div>
        </div>
        <div class="step">
          <div class="step-num">7</div>
          <div class="step-content">
            <div class="step-title">Repita para os outros 3 repositórios</div>
            <div class="step-desc">Do Vizinho → Condofy → DoJobs → DoDaltônico. Leva ~8 minutos no total.</div>
          </div>
        </div>
      </div>
      <div class="tip">⚑ Depois de adicionar os READMEs, acesse github.com/gmenquini e veja como ficou o perfil. Os 4 repositórios vão aparecer com descrição e tecnologias — muito mais profissional do que estava antes.</div>
    </div>
  </div>

</div>

<script>
function show(id) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  event.target.classList.add('active');
}
function cp(id, btn) {
  const el = document.getElementById(id);
  const clone = el.cloneNode(true);
  clone.querySelector('.copy-btn')?.remove();
  const text = clone.innerText.trim();
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copiado!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copied'); }, 2000);
  });
}
</script>
</body>
</html>
