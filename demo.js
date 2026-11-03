/* ===== DEMO STATE ===== */
const state = {
  sophieKnown: false,
  sophieName: 'Sophie',
  sophieEmail: 'sophie.martin@email.fr',
  exitIntentShown: false,
  sessionStart: Date.now(),
  hotelBrowsed: false,
  chatOpened: false,
  whatsappShown: false,
  fromInsta: new URLSearchParams(window.location.search).get('ref') === 'insta',
};

/* ===== PERSONNALISATION INSTA — hero immédiat si ?ref=insta ===== */
if (state.fromInsta) {
  document.addEventListener('DOMContentLoaded', () => {
    const heroImg = document.getElementById('hero-img');
    const heroTitle = document.getElementById('hero-title');
    const persoBadge = document.getElementById('perso-badge');
    const heroCta = document.getElementById('hero-cta');
    const heroLabel = document.getElementById('hero-label');
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroImg) heroImg.src = 'assets/hero-noel.jpg';
    if (persoBadge) persoBadge.style.display = 'inline-flex';
    if (heroLabel) heroLabel.textContent = '✨ Offre spéciale familles — Noël 2026';
    if (heroTitle) heroTitle.innerHTML = 'La magie de Noël en famille,<br>rien que pour vous&nbsp;!';
    if (heroSubtitle) heroSubtitle.textContent = 'Découvrez notre sélection hébergements pour les fêtes · Offre exclusive -10%';
    if (heroCta) { heroCta.textContent = 'Voir les offres de Noël'; heroCta.href = '#section-hotel-recos'; }
    addDCSignal('Source Insta · segment famille Noël IDF');
    updateDCInterest('Hébergement famille Noël');
    showHotelRecos();
  });
}

/* ===== SESSION TIMER (DC panel) ===== */
setInterval(() => {
  const elapsed = Math.floor((Date.now() - state.sessionStart) / 1000);
  const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const s = (elapsed % 60).toString().padStart(2, '0');
  const el = document.getElementById('dc-duration');
  if (el) el.textContent = `${m}:${s}`;
}, 1000);

/* ===== SOCIAL PROOF COUNTER ===== */
(function () {
  const base = 1247;
  let offset = 0;
  setInterval(() => {
    const delta = Math.floor(Math.random() * 3) - 1;
    offset += delta;
    const el = document.getElementById('social-proof-count');
    if (el) el.textContent = (base + offset).toLocaleString('fr-FR');
  }, 4500);
})();

/* ===== BOOKING TABS ===== */
function switchTab(tab) {
  document.querySelectorAll('.booking-tab').forEach(t => t.classList.remove('booking-tab--active'));
  const idx = tab === 'hotel' ? 0 : 1;
  document.querySelectorAll('.booking-tab')[idx].classList.add('booking-tab--active');
}

/* ===== HOTEL BROWSING DETECTION → behavioral recos ===== */
(function () {
  // Personnalisation UNIQUEMENT si on revient de hotels.html (via referrer OU flag one-shot).
  // Le flag est effacé immédiatement après consommation — un refresh de index.html repart à zéro.
  const cameFromHotels = document.referrer.includes('hotels.html') || document.referrer.includes('hotel-marvel.html');
  const flagSet = sessionStorage.getItem('dlp_visited_hotels') === '1';

  if (cameFromHotels || flagSet) {
    // Consomme le flag (one-shot) — le refresh ne re-déclenche plus la perso
    sessionStorage.removeItem('dlp_visited_hotels');

    state.hotelBrowsed = true;
    const heroImg = document.getElementById('hero-img');
    const heroTitle = document.getElementById('hero-title');
    const persoBadge = document.getElementById('perso-badge');
    const heroCta = document.getElementById('hero-cta');
    if (heroImg) heroImg.src = 'assets/hero-noel.jpg';
    if (persoBadge) persoBadge.style.display = 'inline-flex';
    if (heroTitle) heroTitle.innerHTML = 'Vous cherchez un hôtel&nbsp;?';
    if (heroCta) { heroCta.textContent = 'Voir les offres hôtels'; heroCta.href = 'hotels.html'; }
    addDCSignal('Hero personnalisé · visite hôtels détectée');
    updateDCInterest('Hébergement famille');
    showHotelRecos();
  }
})();

function showHotelRecos() {
  const section = document.getElementById('section-hotel-recos');
  if (!section) return;

  // Personnalisation selon profil Sophie
  const pillLabel = document.getElementById('recos-pill-label');
  const title = document.getElementById('recos-title');
  const subtitle = document.getElementById('recos-subtitle');
  if (state.sophieKnown) {
    if (pillLabel) pillLabel.textContent = 'Sélectionné pour vous, ' + state.sophieName;
    if (title) title.textContent = 'Nos hébergements sélectionnés pour vous';
    if (subtitle) subtitle.textContent = 'Basé sur votre navigation, voici notre sélection idéale pour votre famille';
  } else {
    if (pillLabel) pillLabel.textContent = 'Cela pourrait vous intéresser';
    if (title) title.textContent = 'Nos hébergements coup de cœur';
    if (subtitle) subtitle.textContent = 'Découvrez nos meilleures adresses pour un séjour inoubliable';
  }

  section.style.display = 'block';
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.5s, transform 0.5s';
  requestAnimationFrame(() => {
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
  });
  // Also reveal the complementary products block
  const complSection = document.getElementById('section-produits-compl');
  if (complSection) {
    complSection.style.display = 'block';
    complSection.style.opacity = '0';
    complSection.style.transition = 'opacity 0.6s 0.3s';
    requestAnimationFrame(() => { complSection.style.opacity = '1'; });
  }
  updateDCPage('Recommandations hôtels');
}

function updateDCInterest(interest) {
  const el = document.getElementById('dc-interest');
  if (el) el.textContent = interest;
}
function updateDCPage(page) {
  const el = document.getElementById('dc-page');
  if (el) el.textContent = page;
}

/* ===== EXIT INTENT DETECTION — coin haut gauche (zone 80×80px) ===== */
document.addEventListener('mousemove', (e) => {
  if (e.clientX < 80 && e.clientY < 80 && !state.exitIntentShown && !state.sophieKnown) {
    state.exitIntentShown = true;
    showExitIntent();
  }
});

function showExitIntent() {
  const overlay = document.getElementById('exit-intent-overlay');
  if (overlay) overlay.style.display = 'flex';
}
function closeExitIntent(event) {
  if (event && event.target !== document.getElementById('exit-intent-overlay')) return;
  const overlay = document.getElementById('exit-intent-overlay');
  if (overlay) overlay.style.display = 'none';
}

/* ===== EMAIL CAPTURE + PROFILE RECONCILIATION (waou mechanic #2) ===== */
function captureEmail(event) {
  event.preventDefault();
  const email = document.getElementById('email-input').value;
  if (!email) return;
  const overlay = document.getElementById('exit-intent-overlay');
  if (overlay) overlay.style.display = 'none';
  state.sophieKnown = true;
  reconcileProfile();
}

function reconcileProfile() {
  // 1. Header account label → "Bonjour Sophie"
  const accountLabel = document.getElementById('header-account-label');
  if (accountLabel) {
    accountLabel.textContent = `Bonjour ${state.sophieName}`;
    accountLabel.style.color = '#FFD700';
    accountLabel.style.fontWeight = '700';
  }
  // 2. Hero label update
  const heroLabel = document.getElementById('hero-label');
  const heroSubtitle = document.getElementById('hero-subtitle');
  if (heroLabel) heroLabel.textContent = `Bienvenue, ${state.sophieName} !`;
  if (heroSubtitle) heroSubtitle.textContent = 'Votre séjour de Noël en famille vous attend';

  // 3. Show reconciliation toast
  const toast = document.getElementById('reconciliation-toast');
  if (toast) {
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 5000);
  }
  // 4. Data Cloud panel — known profile
  activateDCKnownProfile();

  // 5. Update booking hotel default
  const hotelVal = document.getElementById('booking-hotel-value');
  if (hotelVal) hotelVal.textContent = 'Disney Sequoia Lodge (recommandé)';

  // 6. Woody now knows Sophie — update chat greeting
  state.chatGreetingUpdated = true;

  // 7. Woody speech bubble — invite Sophie to chat with the agent
  setTimeout(() => {
    const bubble = document.getElementById('chat-bubble');
    if (bubble) bubble.style.display = 'block';
    // Small bounce animation on chat trigger
    const trigger = document.getElementById('chat-trigger');
    if (trigger) {
      trigger.style.animation = 'none';
      trigger.style.transform = 'scale(1.15)';
      setTimeout(() => { trigger.style.transform = ''; }, 600);
    }
    addDCSignal('Bulle Woody activée · invitation agent');
  }, 1200);
}

/* ===== DATA CLOUD PANEL ===== */
let dcPanelOpen = false;
function toggleDCPanel() {
  dcPanelOpen = !dcPanelOpen;
  const panel = document.getElementById('dc-panel');
  if (panel) panel.classList.toggle('open', dcPanelOpen);
}

function activateDCKnownProfile() {
  const status = document.getElementById('dc-panel');
  if (!status) return;
  // Status label
  const statusEl = document.querySelector('.dc-panel__status');
  const statusLabel = document.getElementById('dc-status-label');
  if (statusEl) { statusEl.classList.remove('dc-panel__status--unknown'); statusEl.classList.add('dc-panel__status--known'); }
  if (statusLabel) statusLabel.textContent = 'Profil réconcilié — Sophie Martin';
  // Show hidden fields
  ['dc-field-name', 'dc-field-email', 'dc-field-propensity'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('dc-field--hidden'); el.style.animation = 'fadeInUp 0.4s ease'; }
  });
  document.getElementById('dc-name').textContent = state.sophieName + ' Martin';
  document.getElementById('dc-email').textContent = state.sophieEmail;
  // Reconciliation section
  const recoSection = document.getElementById('dc-reconciliation-section');
  if (recoSection) { recoSection.classList.remove('dc-panel__section--hidden'); }
  document.getElementById('dc-known-id').textContent = state.sophieEmail;
  // Auto-open DC panel for demo effect
  if (!dcPanelOpen) {
    dcPanelOpen = true;
    const p = document.getElementById('dc-panel');
    if (p) p.classList.add('open');
  }
}

/* ===== AGENT WOODY 2.0 ===== */

/* --- Scripted scenarios (4 triggers) --- */
const woodyScenarios = {

  hotel: {
    keyword: /h[oô]tel|séjour|chambre|nuit|hébergement/i,
    response: () => {
      const name = state.sophieKnown ? ` ${state.sophieName}` : '';
      return `🏨 Excellente idée${name} ! Avec vos 2 enfants pour Noël, je vous recommande le <strong>Disney Hotel New York — The Art of Marvel ★★★★</strong>.<br><br>Il inclut la <strong>coupe-file 2 attractions/jour</strong>, l'accès anticipé aux Parcs et un petit-déjeuner Disney thématique. Un vrai game-changer pour éviter les files d'attente avec des enfants !<br><br>👉 Tarif actuel : à partir de <strong>549 € / nuit</strong> — disponibilités limitées en décembre.`;
    },
    action: () => {
      scrollToSection('hotels');
      highlightSection('hotels');
      addDCSignal('Woody → Hôtel New York · segment famille validé');
      setTimeout(() => appendChatCard({
        tag: 'Recommandé pour vous',
        imgBg: '#8B0000',
        imgEmoji: '🦸',
        title: 'Disney Hotel New York — The Art of Marvel ★★★★',
        price: 'À partir de 549 €/nuit',
        link: 'hotels.html',
        linkLabel: 'Voir l\'hôtel & disponibilités →',
      }), 200);
    },
    followups: ['C\'est quoi la coupe-file ?', 'Options Noël enchanté ?', 'Comparer les hôtels'],
  },

  coupeFile: {
    keyword: /coupe.?fil|express|attraction|queue|file|attente/i,
    response: () => `⚡ La <strong>coupe-file Disneyland Paris</strong> vous permet de passer directement à l'entrée de certaines attractions sans faire la queue — un vrai must en période de fêtes !<br><br>Avec l'offre hôtel que je vous recommande, vous bénéficiez de <strong>2 coupe-files par jour</strong> inclus dans le prix. Parfait pour Big Thunder Mountain, Buzz Lightyear et la Mystic Manor — les préférées des 7–12 ans.<br><br>💡 Conseil : réservez vos coupe-files dès l'ouverture des Parcs via l'app officielle.`,
    action: () => {
      addDCSignal('Woody → Coupe-file · intérêt optimisation visite');
      setTimeout(() => appendChatCard({
        tag: 'Inclus dans votre séjour',
        imgBg: '#C8102E',
        imgEmoji: '⚡',
        title: 'Coupe-file 2 attractions/jour · Hôtel Marvel',
        price: 'Inclus dans Chambre + Coupe-file',
        link: 'coupe-file.html',
        linkLabel: 'Découvrir le Coupe-file →',
      }), 200);
      setTimeout(() => {
        sessionStorage.setItem('woody_open', '1');
        sessionStorage.setItem('woody_msg', '⚡ Profitez des coupe-files — vous gagnerez du temps et on vous propose une réduction exclusivité&nbsp;! Je reste avec vous.');
        window.location.href = 'coupe-file.html';
      }, 1500);
    },
    followups: ['Quelles attractions ?', 'L\'app Disney, c\'est comment ?', 'On réserve le séjour ?'],
  },

  noel: {
    keyword: /no[eë]l|décembre|f[eê]te|hiver|enchant[eé]|saison/i,
    response: () => {
      const name = state.sophieKnown ? ` ${state.sophieName}` : '';
      return `🎄 Le <strong>Noël Enchanté Disney 2026</strong>${name} débute le 7 novembre et court jusqu'au 10 janvier — c'est LA saison la plus magique de l'année !<br><br>Au programme pour votre famille :<br>• 🏰 Château illuminé & parade de Noël quotidienne<br>• 🎅 Rencontres avec le Père Noël & personnages Disney en costume de fête<br>• ✨ Mickey's Magical Fireworks & Snow (flocons de neige artificiels !)<br>• 🎭 Mickey et le Magicien — spectacle exclusif saison<br><br>⚠️ Les dates du 20–26 décembre partent en quelques heures — <strong>87 % de nos clients Noël famille IDF réservent avant novembre</strong>.`;
    },
    action: () => {
      scrollToSection('saisons-evenements');
      highlightSection('saisons-evenements');
      addDCSignal('Woody → Noël Enchanté · propension achat +12pt');
      setTimeout(() => appendChatCard({
        tag: 'Saison Noël 2026',
        imgBg: '#1B3A8C',
        imgEmoji: '🎄',
        title: 'Noël Enchanté Disney — 7 nov. 2026 → 10 jan. 2027',
        price: 'Billets datés dès 115 €/pers.',
        link: 'cart.html',
        linkLabel: 'Réserver vos billets Noël →',
      }), 200);
    },
    followups: ['C\'est quoi Mickey Fireworks ?', 'Meilleure date pour les enfants ?', 'Voir le programme complet'],
  },

  configure: {
    keyword: /plus proche|moins cher|proche du parc|comparer|meilleur hotel|quel hotel|configurateur|personnalis|aide.*choisir|choisir.*hotel/i,
    response: () => {
      const name = state.sophieKnown ? ` ${state.sophieName}` : '';
      return `🎯 Parfait${name} ! Je vais vous aider à trouver l'hôtel idéal selon vos critères.<br><br>Je lance le <strong>configurateur personnalisé Data 360</strong> — ajustez les curseurs et je vous montre les meilleures options en temps réel&nbsp;!`;
    },
    action: () => {
      addDCSignal('Woody → Configurateur hôtel · personnalisation active');
      setTimeout(() => {
        window.location.href = 'configure2.html';
      }, 1200);
    },
    followups: [],
  },

  hotelDetail: {
    keyword: /piscine|distance|parc|min|marche|navette|chambre|suite|restaurant|spa|petit.?d[eé]jeuner|aqua/i,
    response: () => {
      const name = state.sophieKnown ? ` ${state.sophieName}` : '';
      return `🏊 Bonne nouvelle${name} ! Le <strong>Disney Hotel New York — The Art of Marvel</strong> dispose bien d'une piscine intérieure chauffée — idéale même en décembre.<br><br>📍 <strong>Distance :</strong> 10 minutes à pied des Parcs, avec une navette gratuite toutes les 15 minutes si besoin.<br><br>L'hôtel propose aussi :<br>• Restaurant thématique Marvel avec personnages<br>• Spa et salle de fitness<br>• Petit-déjeuner Disney buffet en option<br><br>Je vous emmène directement sur la page de l'hôtel pour voir les photos et disponibilités !`;
    },
    action: () => {
      addDCSignal('Woody → Détail hôtel Marvel · piscine/distance');
      setTimeout(() => appendChatCard({
        tag: '🏊 Piscine intérieure incluse',
        imgBg: '#003087',
        imgEmoji: '🦸',
        title: 'Disney Hotel New York — The Art of Marvel',
        price: 'À partir de 494 € / nuit · famille 4 pers.',
        link: 'hotel-marvel.html',
        linkLabel: 'Voir l\'hôtel & disponibilités →',
      }), 200);
      setTimeout(() => {
        sessionStorage.setItem('woody_open', '1');
        sessionStorage.setItem('woody_msg', '🏊 Oui, le Disney Hotel New York dispose d\'une belle piscine intérieure chauffée — parfaite même en décembre pour vos enfants ! Je vous emmène sur la page de l\'hôtel pour voir les photos et disponibilités.');
        window.location.href = 'hotel-marvel.html';
      }, 2000);
    },
    followups: ['Réserver cet hôtel', 'Voir la piscine', 'Comparer les hôtels'],
  },

  reservation: {
    keyword: /r[eé]serv|panier|commander|acheter|prix|tarif|combien|disponibil/i,
    response: () => {
      const name = state.sophieKnown ? ` ${state.sophieName}` : '';
      return `🛒 Parfait${name} ! J'ai préparé la meilleure sélection pour votre famille (2 adultes + 2 enfants, Noël 2026) :<br><br><strong>📦 Pack recommandé Data 360 :</strong><br>• Hôtel New York Marvel · Chambre + Coupe-file · 2 nuits → <strong>1 098 €</strong><br>• Billets datés 2j/2 Parcs · 4 personnes → <strong>460 €</strong><br>• <strong>Total : 1 558 €</strong> · Annulation gratuite jusqu'au 15 déc.<br><br>💳 Paiement en 6 fois disponible · Meilleur prix garanti.`;
    },
    action: () => {
      addDCSignal('Woody → Réservation · signal achat fort · score 94/100');
      setTimeout(() => appendChatCard({
        tag: '⭐ Sélection personnalisée Data 360',
        imgBg: '#0E1A4C',
        imgEmoji: '🏰',
        title: 'Pack Noël Famille — Hôtel + Billets · 22–24 déc. 2026',
        price: '1 558 € · 2 adultes + 2 enfants',
        link: 'cart.html',
        linkLabel: 'Finaliser ma réservation →',
      }), 200);
    },
    followups: ['Paiement en plusieurs fois ?', 'Conditions d\'annulation', 'Confirmer la réservation'],
  },
};

/* --- Default fallback responses --- */
const woodyDefaults = [
  {
    text: `🤠 Bonne question ! Je peux vous aider sur les <strong>hôtels</strong>, le programme <strong>Noël Enchanté</strong>, les <strong>coupe-files</strong> ou directement vous préparer une <strong>réservation</strong> sur mesure pour votre famille.<br><br>Qu'est-ce qui vous intéresse le plus ?`,
    followups: ['Hôtels recommandés', 'Programme Noël 2026', 'Coupe-file attractions', 'Préparer ma réservation'],
  },
  {
    text: `💡 Pour une famille avec des enfants de 7 et 11 ans à Noël, voici mes top conseils :<br>• Arrivez dès 9h pour les grandes attractions<br>• Misez sur la <strong>coupe-file</strong> pour Big Thunder Mountain et Buzz Lightyear<br>• La parade de Noël a lieu à 17h30 — positionnez-vous tôt !<br><br>Voulez-vous que je vous prépare un itinéraire personnalisé ?`,
    followups: ['Oui, préparer l\'itinéraire', 'Coupe-files disponibles ?', 'Réserver le séjour'],
  },
];

let chatHistory = [];
let woodyDefaultIndex = 0;
let woodyExchangeCount = 0;

// Re-open Woody if navigated from another page with woody_open flag
document.addEventListener('DOMContentLoaded', function() {
  if (sessionStorage.getItem('woody_open') === '1') {
    sessionStorage.removeItem('woody_open');
    const msg = sessionStorage.getItem('woody_msg') || '';
    sessionStorage.removeItem('woody_msg');
    setTimeout(function() {
      const win = document.getElementById('chat-window');
      if (!win) return;
      if (!state.chatOpened) {
        state.chatOpened = true;
        const badge = document.getElementById('chat-badge');
        const bubble = document.getElementById('chat-bubble');
        if (badge) badge.style.display = 'none';
        if (bubble) bubble.style.display = 'none';
        initChat();
      }
      win.style.display = 'flex';
      win.style.flexDirection = 'column';
      if (msg) setTimeout(function() { appendChatMessage('bot', msg); }, 700);
    }, 400);
  }
});

function toggleChat() {
  const win = document.getElementById('chat-window');
  const badge = document.getElementById('chat-badge');
  const bubble = document.getElementById('chat-bubble');
  if (!state.chatOpened) {
    state.chatOpened = true;
    if (badge) badge.style.display = 'none';
    if (bubble) bubble.style.display = 'none';
    initChat();
    updateDCPage('Chat Agent Woody');
    addDCSignal('Woody ouvert · signal engagement');
    win.style.display = 'flex';
    win.style.flexDirection = 'column';
  } else {
    // Manual toggle: reduce (hide) if open, show if hidden
    win.style.display = (win.style.display === 'none' || win.style.display === '') ? 'flex' : 'none';
    if (win.style.display === 'flex') win.style.flexDirection = 'column';
    if (badge && win.style.display === 'none') {
      badge.style.display = 'none';
    }
  }
}

function initChat() {
  chatHistory = [];
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  msgs.innerHTML = '';
  const greeting = state.sophieKnown
    ? `🤠 Howdy ${state.sophieName} ! Je vois que vous explorez Disneyland Paris pour Noël en famille — excellente idée ! Comment puis-je vous aider à préparer votre séjour magique ?`
    : `🤠 Howdy ! Je suis Woody, votre guide Disneyland Paris. Posez-moi vos questions sur les hôtels, le programme Noël ou la réservation — je suis là pour vous aider !`;
  setTimeout(() => {
    appendChatMessage('bot', greeting);
    setTimeout(() => appendFollowups(['Hôtels recommandés', 'Affiner ma recherche', 'Coupe-file attractions', 'Réserver mon séjour']), 400);
  }, 0);
}

function appendChatMessage(role, html) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = `chat-msg chat-msg--${role}`;
  div.innerHTML = `
    ${role === 'bot' ? '<div class="chat-msg__avatar"><img src="assets/woody.png" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" alt="Woody"></div>' : ''}
    <div class="chat-msg__bubble">${html}</div>
    ${role === 'user' ? '<div class="chat-msg__avatar">👤</div>' : ''}
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  chatHistory.push({ role, text: html });
  return div;
}

function appendFollowups(questions) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs || !questions.length) return;
  const div = document.createElement('div');
  div.className = 'chat-followup';
  questions.forEach(q => {
    const btn = document.createElement('button');
    btn.className = 'chat-followup__btn';
    btn.textContent = q;
    btn.onclick = () => {
      div.remove();
      appendChatMessage('user', q);
      if (q === 'Affiner ma recherche') {
        addDCSignal('Woody → Configurateur · personnalisation active');
        setTimeout(() => { window.location.href = 'configure2.html'; }, 800);
      } else if (q === 'Coupe-file attractions') {
        addDCSignal('Woody → Coupe-file · intérêt optimisation visite');
        setTimeout(() => {
          sessionStorage.setItem('woody_open', '1');
          sessionStorage.setItem('woody_msg', '⚡ Profitez des coupe-files — vous gagnerez du temps et on vous propose une réduction exclusive ! Je reste avec vous.');
          window.location.href = 'coupe-file.html';
        }, 800);
      } else if (/marvel|new york|hôtel ny|hotel ny/i.test(q)) {
        addDCSignal('Woody → Hotel Marvel · page détail');
        setTimeout(() => {
          sessionStorage.setItem('woody_open', '1');
          sessionStorage.setItem('woody_msg', '🏰 Voici le Disney Hotel New York — The Art of Marvel ! Toutes les infos, photos et disponibilités pour votre séjour de Noël.');
          window.location.href = 'hotel-marvel.html';
        }, 800);
      } else {
        processWoodyResponse(q.toLowerCase());
      }
    };
    div.appendChild(btn);
  });
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendChatCard({ tag, imgBg, imgEmoji, title, price, link, linkLabel }) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.style.alignSelf = 'flex-start';
  div.style.width = '85%';
  div.innerHTML = `
    <div class="chat-card" onclick="window.location.href='${link}'">
      <div class="chat-card__img" style="background:${imgBg}">
        <div class="chat-card__img-placeholder">${imgEmoji}</div>
      </div>
      <div class="chat-card__body">
        <div class="chat-card__tag">${tag}</div>
        <div class="chat-card__title">${title}</div>
        <div class="chat-card__price">${price}</div>
      </div>
      <div class="chat-card__link">${linkLabel}</div>
    </div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTypingIndicator() {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'chat-msg chat-msg--bot';
  div.id = 'typing-indicator';
  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'chat-msg__avatar';
  const avatarImg = document.createElement('img');
  avatarImg.src = 'assets/woody.png';
  avatarImg.alt = 'Woody';
  avatarImg.style.cssText = 'width:32px;height:32px;border-radius:50%;object-fit:cover;';
  avatarDiv.appendChild(avatarImg);
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'chat-msg__bubble chat-typing';
  for (let i = 0; i < 3; i++) bubbleDiv.appendChild(document.createElement('span'));
  div.appendChild(avatarDiv);
  div.appendChild(bubbleDiv);
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  // If explicitly hidden (hotel-recos), reveal it first
  if (el.style.display === 'none') {
    el.style.display = 'block';
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s, transform 0.5s';
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

function highlightSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('section--highlight');
  setTimeout(() => el.classList.remove('section--highlight'), 2200);
}

function addDCSignal(label) {
  const content = document.getElementById('dc-panel');
  if (!content) return;
  // Update interest field
  const interest = document.getElementById('dc-interest');
  if (interest) {
    const map = {
      'Hôtel': 'Hébergement famille',
      'Coupe-file': 'Optimisation visite',
      'Noël': 'Noël Enchanté 2026',
      'Réservation': 'Intention achat forte',
      'Woody': 'Engagement chat',
    };
    for (const [k, v] of Object.entries(map)) {
      if (label.includes(k)) { interest.textContent = v; break; }
    }
  }
  // Add a signal entry in behavior section
  const section = content.querySelector('.dc-panel__section:nth-child(3)');
  if (!section) return;
  const sig = document.createElement('div');
  sig.className = 'dc-signal-toast';
  sig.innerHTML = `<span>⚡</span><span>${label}</span>`;
  section.appendChild(sig);
  setTimeout(() => sig.remove(), 5000);
  // Auto-open DC panel during chat interactions
  if (!dcPanelOpen) {
    dcPanelOpen = true;
    const panel = document.getElementById('dc-panel');
    if (panel) panel.classList.add('open');
  }
}

function processWoodyResponse(lower) {
  showTypingIndicator();
  const delay = 900 + Math.random() * 400;
  setTimeout(() => {
    removeTypingIndicator();
    woodyExchangeCount++;
    // Match scenario
    for (const [, scenario] of Object.entries(woodyScenarios)) {
      if (scenario.keyword.test(lower)) {
        const text = scenario.response();
        appendChatMessage('bot', text);
        scenario.action();
        setTimeout(() => appendFollowups(scenario.followups), 300);
        if (woodyExchangeCount >= 2) setTimeout(() => showWhatsAppOptIn(), 4000);
        return;
      }
    }
    // Fallback
    const fallback = woodyDefaults[woodyDefaultIndex % woodyDefaults.length];
    woodyDefaultIndex++;
    appendChatMessage('bot', fallback.text);
    setTimeout(() => appendFollowups(fallback.followups), 300);
    if (woodyExchangeCount >= 2) setTimeout(() => showWhatsAppOptIn(), 4000);
  }, delay);
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';
  // Remove any existing followup buttons
  const existing = document.querySelector('.chat-followup');
  if (existing) existing.remove();
  appendChatMessage('user', text);
  processWoodyResponse(text.toLowerCase());
}

/* WhatsApp opt-in (shown AFTER first full conversation, not at start) */
function showWhatsAppOptIn() {
  const msgs = document.getElementById('chat-messages');
  if (!msgs || state.whatsappShown) return;
  state.whatsappShown = true;
  setTimeout(() => {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg--bot';
    div.innerHTML = `
      <div class="chat-msg__avatar">🤠</div>
      <div class="chat-msg__bubble">
        📱 <strong>Une dernière chose !</strong><br>
        Vous souhaitez recevoir des rappels et mises à jour sur WhatsApp pour votre séjour ?<br>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button class="chat-followup__btn" onclick="this.closest('.chat-msg__bubble').innerHTML='✅ Parfait — vous recevrez vos infos sur WhatsApp !'">Oui, m\'inscrire</button>
          <button class="chat-followup__btn" onclick="this.closest('.chat-msg__bubble').innerHTML='OK, pas de problème !'">Non merci</button>
        </div>
      </div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    addDCSignal('WhatsApp opt-in proposé · canal messaging');
  }, 1000);
}

/* ===== DEMO HELPER: manual trigger for exit intent (newsletter button) ===== */
function triggerExitIntent() {
  if (!state.sophieKnown) showExitIntent();
}

/* ===== DC panel — initial page tracking ===== */
window.addEventListener('scroll', () => {
  const scroll = window.scrollY;
  const sections = [
    { id: 'hotels', label: 'Hébergement' },
    { id: 'saisons-evenements', label: 'Saisons & événements' },
    { id: 'univers', label: 'Univers Disney' },
    { id: 'en-ce-moment', label: 'En ce moment' },
    { id: 'hero', label: 'Accueil' },
  ];
  for (const sec of sections) {
    const el = document.getElementById(sec.id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
      updateDCPage(sec.label);
      break;
    }
  }
});
