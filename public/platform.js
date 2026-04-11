/* ═══════════════════════════════════════════════════════════════════════
   FUTBOL.AZ – Platform Features v2.0
   Audio · Profile · Store · Tournament · Daily Challenges · Achievements
   Difficulty Levels · "Who Are Ya?" Game
   ═══════════════════════════════════════════════════════════════════════ */
"use strict";

function pfStartWhoAreYaSection() {
  const game = (typeof GAMES_DATA !== "undefined") && GAMES_DATA.find(g => g.gameType === "whoarya");
  if (game && typeof openGamePlayer === "function") openGamePlayer(game);
}

// ─────────────────────────────── Platform Storage ────────────────────────────
const PLS = {
  users:         "faz_users",
  currentUser:   "faz_current_user",
  soundOn:       "faz_snd_on",
  volume:        "faz_snd_vol",
  daily:         "faz_daily",
  globalLB:      "faz_global_lb",
  activeTheme:   "faz_theme_id",
};

function pfGet(key, fallback) {
  try {
    const v = localStorage.getItem(PLS[key] || key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function pfSet(key, value) {
  try { localStorage.setItem(PLS[key] || key, JSON.stringify(value)); } catch {}
}

function pfUserKey(username, suffix) {
  return "faz_u_" + username.toLowerCase() + "_" + suffix;
}

function getUserData(username) {
  try {
    const v = localStorage.getItem(pfUserKey(username, "data"));
    return v !== null ? JSON.parse(v) : { gamesPlayed: 0, totalScore: 0, highScore: 0, coins: 0, inventory: [], achievements: [], badges: [], displayName: "", avatarEmoji: "⚽", favoriteTeam: "", totalRatings: 0 };
  } catch { return { gamesPlayed: 0, totalScore: 0, highScore: 0, coins: 0, inventory: [], achievements: [], badges: [], displayName: "", avatarEmoji: "⚽", favoriteTeam: "", totalRatings: 0 }; }
}

function saveUserData(username, data) {
  try { localStorage.setItem(pfUserKey(username, "data"), JSON.stringify(data)); } catch {}
}

// ═══════════════════════════════════════════════════════════════════════
//  AUDIO SYSTEM
// ═══════════════════════════════════════════════════════════════════════
let pfAudioCtx = null;
let pfBgmTimer = null;
let pfBgmGain = null;
let pfSfxGain = null;
let pfSoundOn = true;
let pfVolume = 0.5;
let pfBgmStep = 0;

function pfGetAudioCtx() {
  if (!pfAudioCtx) {
    pfAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    pfBgmGain = pfAudioCtx.createGain();
    pfBgmGain.gain.value = pfVolume * 0.15;
    pfBgmGain.connect(pfAudioCtx.destination);
    pfSfxGain = pfAudioCtx.createGain();
    pfSfxGain.gain.value = pfVolume * 0.5;
    pfSfxGain.connect(pfAudioCtx.destination);
  }
  if (pfAudioCtx.state === "suspended") pfAudioCtx.resume();
  return pfAudioCtx;
}

function pfPlaySfx(type) {
  if (!pfSoundOn) return;
  try {
    const ctx = pfGetAudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(pfSfxGain);

    switch (type) {
      case "click":
        osc.type = "sine";
        osc.frequency.value = 660;
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
        break;
      case "correct":
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.linearRampToValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
        break;
      case "wrong":
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
        break;
      case "goal": {
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((f, i) => {
          const o2 = ctx.createOscillator();
          const g2 = ctx.createGain();
          o2.connect(g2); g2.connect(pfSfxGain);
          o2.type = "sine"; o2.frequency.value = f;
          const t = now + i * 0.1;
          g2.gain.setValueAtTime(0, t);
          g2.gain.linearRampToValueAtTime(0.3, t + 0.05);
          g2.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
          o2.start(t); o2.stop(t + 0.45);
        });
        return;
      }
      case "gameover":
        osc.type = "square";
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.6);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now); osc.stop(now + 0.6);
        break;
      case "coin":
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(1320, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now); osc.stop(now + 0.2);
        break;
      case "reveal":
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
        break;
      default:
        osc.stop(now);
    }
  } catch {}
}

// Simple BGM: a repeating pentatonic melody
const PF_BGM_NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66, 261.63, 293.66, 329.63, 440.00];
const PF_BGM_BPM   = 108;

function pfStartBGM() {
  if (!pfSoundOn) return;
  pfStopBGM();
  try {
    const ctx = pfGetAudioCtx();
    const beatMs = (60000 / PF_BGM_BPM);

    function note() {
      if (!pfSoundOn || !pfBgmGain) return;
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.connect(g); g.connect(pfBgmGain);
      osc.type = "sine";
      osc.frequency.value = PF_BGM_NOTES[pfBgmStep % PF_BGM_NOTES.length];
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.4, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + (beatMs / 1000) * 0.85);
      osc.start(now);
      osc.stop(now + (beatMs / 1000));
      pfBgmStep++;
    }

    note();
    pfBgmTimer = setInterval(note, beatMs);
  } catch {}
}

function pfStopBGM() {
  if (pfBgmTimer) { clearInterval(pfBgmTimer); pfBgmTimer = null; }
}

function togglePlatformSound() {
  pfSoundOn = !pfSoundOn;
  pfSet("soundOn", pfSoundOn);
  if (pfSoundOn) { pfStartBGM(); }
  else { pfStopBGM(); }
  pfUpdateAudioUI();
  if (typeof showToast === "function") showToast(pfSoundOn ? "🔊 Səs açıldı" : "🔇 Səs söndürüldü");
}

function setPlatformVolume(val) {
  pfVolume = parseFloat(val);
  pfSet("volume", pfVolume);
  if (pfBgmGain) pfBgmGain.gain.value = pfVolume * 0.15;
  if (pfSfxGain) pfSfxGain.gain.value = pfVolume * 0.5;
}

function pfUpdateAudioUI() {
  const btn = document.getElementById("audio-toggle-btn");
  if (btn) btn.textContent = pfSoundOn ? "🔊" : "🔇";
  const vol = document.getElementById("audio-volume");
  if (vol) vol.value = pfVolume;
  const bar = document.getElementById("audio-bar");
  if (bar) bar.className = "audio-bar" + (pfSoundOn ? " on" : " off");
}

// ═══════════════════════════════════════════════════════════════════════
//  PROFILE SYSTEM
// ═══════════════════════════════════════════════════════════════════════
let pfCurrentUser = null;

function pfSimpleHash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
    h = h >>> 0;
  }
  return h.toString(36);
}

function pfGetUsers() { return pfGet("users", {}); }
function pfSaveUsers(u) { pfSet("users", u); }

function pfGetCurrentUser() {
  if (!pfCurrentUser) pfCurrentUser = pfGet("currentUser", null);
  return pfCurrentUser;
}

function pfLogin(username, password) {
  const users = pfGetUsers();
  const key   = username.toLowerCase().trim();
  const user  = users[key];
  if (!user) return { error: "İstifadəçi tapılmadı" };
  if (user.passwordHash !== pfSimpleHash(password)) return { error: "Şifrə yanlışdır" };
  pfCurrentUser = user;
  pfSet("currentUser", user);
  return { success: true, user };
}

function pfRegister(username, password) {
  const u = username.trim();
  if (u.length < 3) return { error: "İstifadəçi adı ən az 3 simvol" };
  if (password.length < 4) return { error: "Şifrə ən az 4 simvol" };
  const users = pfGetUsers();
  const key   = u.toLowerCase();
  if (users[key]) return { error: "Bu istifadəçi adı artıq var" };
  const AVATARS = ["⚽","🏆","🎯","⚡","🔥","🌟","🦁","🐯","🦊","🐺"];
  const user = {
    username: u,
    passwordHash: pfSimpleHash(password),
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    createdAt: Date.now(),
  };
  users[key] = user;
  pfSaveUsers(users);
  pfCurrentUser = user;
  pfSet("currentUser", user);
  // Init data
  saveUserData(u, { gamesPlayed: 0, totalScore: 0, highScore: 0, coins: 100, inventory: [], achievements: [], badges: [], displayName: u, avatarEmoji: user.avatar, favoriteTeam: "", totalRatings: 0 });
  return { success: true, user };
}

function pfLogout() {
  pfCurrentUser = null;
  try { localStorage.removeItem(PLS.currentUser); } catch {}
  pfUpdateNavProfile();
  if (typeof showToast === "function") showToast("👋 Çıxış edildi");
}

function pfUpdateNavProfile() {
  const user = pfGetCurrentUser();
  const btn  = document.getElementById("profile-nav-btn");
  const d = user ? getUserData(user.username) : null;
  const name = d?.displayName || user?.username;
  const avatar = d?.avatarEmoji || user?.avatar;
  if (btn) btn.innerHTML = user
    ? `${avatar} <span class="profile-nav-name">${typeof escapeHTML === "function" ? escapeHTML(name) : name}</span>`
    : "👤 Giriş";
  pfUpdateCoinsDisplay();
}

function pfGetUserCoins() {
  const u = pfGetCurrentUser();
  if (!u) return 0;
  return getUserData(u.username).coins || 0;
}

function pfAwardCoins(amount, silent) {
  const u = pfGetCurrentUser();
  if (!u) return;
  const d = getUserData(u.username);
  d.coins = (d.coins || 0) + amount;
  saveUserData(u.username, d);
  pfUpdateCoinsDisplay();
  if (amount > 0 && !silent && typeof showToast === "function") {
    showToast(`🪙 +${amount} Coin qazandınız!`);
  }
}

function pfUpdateCoinsDisplay() {
  const el = document.getElementById("coins-display");
  if (!el) return;
  const u = pfGetCurrentUser();
  if (u) {
    el.textContent = `🪙 ${pfGetUserCoins()}`;
    el.hidden = false;
  } else {
    el.hidden = true;
  }
}

function pfTrackGamePlayed(score) {
  const u = pfGetCurrentUser();
  if (!u) return;
  const d = getUserData(u.username);
  d.gamesPlayed = (d.gamesPlayed || 0) + 1;
  d.totalScore  = (d.totalScore  || 0) + score;
  d.highScore   = Math.max(d.highScore || 0, score);
  try {
    d.totalRatings = Object.keys(JSON.parse(localStorage.getItem("faz_ratings") || "{}")).length;
  } catch {}
  saveUserData(u.username, d);
  pfCheckAchievements(u.username);
}

// Profile Modal
function openProfileModal() {
  const modal = document.getElementById("profile-modal");
  if (!modal) return;
  const u = pfGetCurrentUser();
  if (u) pfRenderProfileView(u);
  else    pfRenderLoginView();
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeProfileModal() {
  const m = document.getElementById("profile-modal");
  if (m) m.hidden = true;
  document.body.style.overflow = "";
}

function pfRenderLoginView() {
  const body = document.getElementById("profile-modal-body");
  if (!body) return;
  body.innerHTML = `
    <div class="pf-auth-tabs">
      <button class="pf-tab active" id="tab-login" onclick="pfSwitchTab('login')">Giriş</button>
      <button class="pf-tab" id="tab-register" onclick="pfSwitchTab('register')">Qeydiyyat</button>
    </div>
    <div id="pf-login-form">
      <div class="pf-form-group">
        <label>İstifadəçi adı</label>
        <input type="text" id="pf-login-user" placeholder="istifadəçi adınız" maxlength="30" autocomplete="username">
      </div>
      <div class="pf-form-group">
        <label>Şifrə</label>
        <input type="password" id="pf-login-pass" placeholder="şifrəniz" maxlength="50" autocomplete="current-password">
      </div>
      <div id="pf-login-error" class="pf-error"></div>
      <button class="btn-primary pf-submit-btn" onclick="pfDoLogin()">🔐 Giriş et</button>
    </div>
    <div id="pf-register-form" style="display:none;">
      <div class="pf-form-group">
        <label>İstifadəçi adı</label>
        <input type="text" id="pf-reg-user" placeholder="istifadəçi adı (min 3 simvol)" maxlength="30" autocomplete="username">
      </div>
      <div class="pf-form-group">
        <label>Şifrə</label>
        <input type="password" id="pf-reg-pass" placeholder="şifrə (min 4 simvol)" maxlength="50" autocomplete="new-password">
      </div>
      <div id="pf-reg-error" class="pf-error"></div>
      <button class="btn-primary pf-submit-btn" onclick="pfDoRegister()">📝 Qeydiyyat</button>
    </div>`;
}

function pfSwitchTab(tab) {
  document.getElementById("pf-login-form").style.display    = tab === "login"    ? "" : "none";
  document.getElementById("pf-register-form").style.display = tab === "register" ? "" : "none";
  document.getElementById("tab-login").classList.toggle("active",    tab === "login");
  document.getElementById("tab-register").classList.toggle("active", tab === "register");
}

function pfDoLogin() {
  const un = (document.getElementById("pf-login-user")?.value || "").trim();
  const pw =  document.getElementById("pf-login-pass")?.value || "";
  const err = document.getElementById("pf-login-error");
  const res = pfLogin(un, pw);
  if (res.error) { if (err) err.textContent = "⚠️ " + res.error; return; }
  if (err) err.textContent = "";
  pfUpdateNavProfile();
  pfRenderProfileView(res.user);
  if (typeof showToast === "function") showToast(`👋 Xoş gəldiniz, ${res.user.avatar} ${res.user.username}!`);
}

function pfDoRegister() {
  const un = (document.getElementById("pf-reg-user")?.value || "").trim();
  const pw =  document.getElementById("pf-reg-pass")?.value || "";
  const err = document.getElementById("pf-reg-error");
  const res = pfRegister(un, pw);
  if (res.error) { if (err) err.textContent = "⚠️ " + res.error; return; }
  if (err) err.textContent = "";
  pfUpdateNavProfile();
  pfRenderProfileView(res.user);
  if (typeof showToast === "function") showToast(`🎉 Qeydiyyat uğurlu! Xoş gəldiniz, ${res.user.username}!`);
}

function pfRenderProfileView(user) {
  const body = document.getElementById("profile-modal-body");
  if (!body) return;
  const d   = getUserData(user.username);
  const ach = PF_ACHIEVEMENTS.filter(a => (d.achievements || []).includes(a.id));
  const displayName = d.displayName || user.username;
  const avatarEmoji = d.avatarEmoji || user.avatar || "⚽";
  const favoriteTeam = d.favoriteTeam || localStorage.getItem("favoriteTeam") || "";
  const totalRatings = Number.isFinite(d.totalRatings) ? d.totalRatings : (() => {
    try { return Object.keys(JSON.parse(localStorage.getItem("faz_ratings") || "{}")).length; } catch { return 0; }
  })();

  body.innerHTML = `
    <div class="pf-profile-header">
      <div class="pf-avatar">${avatarEmoji}</div>
      <div class="pf-profile-info">
        <h3 class="pf-username">${typeof escapeHTML === "function" ? escapeHTML(displayName) : displayName}</h3>
        <div class="pf-member-since">📅 ${new Date(user.createdAt).toLocaleDateString("az-AZ")}</div>
      </div>
    </div>

    <div class="pf-stats-grid">
      <div class="pf-stat-card">
        <span class="pf-stat-icon">🎮</span>
        <span class="pf-stat-val">${d.gamesPlayed || 0}</span>
        <span class="pf-stat-label">Oyun</span>
      </div>
      <div class="pf-stat-card">
        <span class="pf-stat-icon">⭐</span>
        <span class="pf-stat-val">${d.totalScore || 0}</span>
        <span class="pf-stat-label">Toplam Skor</span>
      </div>
      <div class="pf-stat-card">
        <span class="pf-stat-icon">🏆</span>
        <span class="pf-stat-val">${d.highScore || 0}</span>
        <span class="pf-stat-label">Ən Yüksək</span>
      </div>
      <div class="pf-stat-card">
        <span class="pf-stat-icon">⭐</span>
        <span class="pf-stat-val">${totalRatings}</span>
        <span class="pf-stat-label">Reytinq sayı</span>
      </div>
    </div>

    <div class="pf-section-title">👤 Profil Ayarları</div>
    <div class="pf-form-group">
      <label>Ad</label>
      <input type="text" id="pf-display-name" value="${typeof escapeHTML === "function" ? escapeHTML(displayName) : displayName}" maxlength="30">
    </div>
    <div class="pf-form-group">
      <label>Avatar Emoji</label>
      <select id="pf-avatar-emoji">
        ${["⚽","🏆","🔥","🦁","🌟","😎","🐯","⚡"].map(v => `<option value="${v}" ${v === avatarEmoji ? "selected" : ""}>${v}</option>`).join("")}
      </select>
    </div>
    <div class="pf-form-group">
      <label>Sevimli komanda</label>
      <input type="text" id="pf-favorite-team" value="${typeof escapeHTML === "function" ? escapeHTML(favoriteTeam) : favoriteTeam}" maxlength="60" placeholder="Komanda adı">
    </div>
    <button class="btn-primary pf-submit-btn" onclick="pfSaveProfileSettings()">💾 Profili yadda saxla</button>
    <a href="/profile.html" class="btn-secondary pf-submit-btn" style="display:inline-flex;margin-top:10px;justify-content:center;">👤 Profil səhifəsini aç</a>

    <div class="pf-section-title">🏅 Qazanılan Nişanlar</div>
    <div class="pf-badges-row">
      ${ach.length === 0 ? '<span class="pf-no-badges">Hələ nişan yoxdur. Oynayın!</span>' :
        ach.map(a => `<div class="pf-badge-chip" title="${typeof escapeHTML === "function" ? escapeHTML(a.desc) : a.desc}">${a.icon} ${typeof escapeHTML === "function" ? escapeHTML(a.name) : a.name}</div>`).join("")}
    </div>

    <div class="pf-section-title">🎒 Anbar</div>
    <div class="pf-inventory">
      ${(d.inventory || []).length === 0 ? '<span class="pf-no-badges">Anbar boşdur. Mağazaya baxın!</span>' :
        (d.inventory || []).map(id => {
          const item = PF_STORE_ITEMS.find(s => s.id === id);
          return item ? `<div class="pf-inv-item">${item.emoji} ${typeof escapeHTML === "function" ? escapeHTML(item.name) : item.name}</div>` : "";
        }).join("")}
    </div>

    <div class="pf-profile-actions">
      <button class="pf-change-pass-btn" onclick="pfShowChangePassword()">🔑 Şifrə dəyiş</button>
      <button class="btn-secondary pf-logout-btn" onclick="pfLogout(); closeProfileModal()">👋 Çıxış</button>
    </div>`;
}

function pfSaveProfileSettings() {
  const u = pfGetCurrentUser();
  if (!u) return;
  const d = getUserData(u.username);
  const displayName = (document.getElementById("pf-display-name")?.value || "").trim();
  const avatarEmoji = document.getElementById("pf-avatar-emoji")?.value || "⚽";
  const favoriteTeam = (document.getElementById("pf-favorite-team")?.value || "").trim();
  d.displayName = displayName || u.username;
  d.avatarEmoji = avatarEmoji;
  d.favoriteTeam = favoriteTeam;
  saveUserData(u.username, d);
  u.avatar = avatarEmoji;
  pfCurrentUser = u;
  pfSet("currentUser", u);
  try { localStorage.setItem("favoriteTeam", favoriteTeam); } catch {}
  try { localStorage.setItem("notificationsEnabled", localStorage.getItem("notificationsEnabled") || "false"); } catch {}
  pfUpdateNavProfile();
  pfRenderProfileView(u);
  if (typeof showToast === "function") showToast("✅ Profil məlumatları yeniləndi");
}

function pfShowChangePassword() {
  const body = document.getElementById("profile-modal-body");
  if (!body) return;
  const u = pfGetCurrentUser();
  if (!u) return;
  body.innerHTML += `
    <div class="pf-change-pass-box" id="pf-change-pass-box">
      <div class="pf-form-group">
        <label>Köhnə şifrə</label>
        <input type="password" id="pf-old-pass" placeholder="köhnə şifrə" maxlength="50">
      </div>
      <div class="pf-form-group">
        <label>Yeni şifrə</label>
        <input type="password" id="pf-new-pass" placeholder="yeni şifrə (min 4 simvol)" maxlength="50">
      </div>
      <div id="pf-pass-err" class="pf-error"></div>
      <button class="btn-primary pf-submit-btn" onclick="pfDoChangePassword()">💾 Yadda saxla</button>
    </div>`;
}

function pfDoChangePassword() {
  const u   = pfGetCurrentUser();
  if (!u) return;
  const old = document.getElementById("pf-old-pass")?.value || "";
  const nw  = document.getElementById("pf-new-pass")?.value || "";
  const err = document.getElementById("pf-pass-err");
  if (pfSimpleHash(old) !== u.passwordHash) {
    if (err) err.textContent = "⚠️ Köhnə şifrə yanlışdır"; return;
  }
  if (nw.length < 4) {
    if (err) err.textContent = "⚠️ Şifrə ən az 4 simvol"; return;
  }
  const users = pfGetUsers();
  users[u.username.toLowerCase()].passwordHash = pfSimpleHash(nw);
  pfSaveUsers(users);
  pfCurrentUser.passwordHash = pfSimpleHash(nw);
  pfSet("currentUser", pfCurrentUser);
  document.getElementById("pf-change-pass-box")?.remove();
  if (typeof showToast === "function") showToast("✅ Şifrə dəyişdirildi!");
}

// ═══════════════════════════════════════════════════════════════════════
//  STORE SYSTEM
// ═══════════════════════════════════════════════════════════════════════
const PF_STORE_ITEMS = [
  { id: "powerup_time",   name: "⏰ Zaman Artırıcı",    desc: "Oyunda +30 saniyə əlavə vaxt",           category: "powerup", price: 100, emoji: "⏰", consumable: true },
  { id: "powerup_2x",     name: "✨ 2× Skor",            desc: "Növbəti oyunda xalları 2 dəfə artırır",  category: "powerup", price: 150, emoji: "✨", consumable: true },
  { id: "powerup_hint",   name: "💡 İpucu",              desc: "Who Are Ya oyununda əlavə ipucu",        category: "powerup", price: 75,  emoji: "💡", consumable: true },
  { id: "powerup_skip",   name: "⏭️ Sual Atla",          desc: "Viktorinada bir sualı atlayın",          category: "powerup", price: 50,  emoji: "⏭️", consumable: true },
  { id: "skin_gold",      name: "🥇 Qızıl Tema",         desc: "Oyun arayüzünü qızıl rənglə bəzəyir",  category: "skin",    price: 500, emoji: "🥇", consumable: false },
  { id: "skin_neon",      name: "💜 Neon Tema",           desc: "Parlaq neon rəngli oyun arayüzü",       category: "skin",    price: 400, emoji: "💜", consumable: false },
  { id: "skin_ocean",     name: "🌊 Okean Tema",          desc: "Sakit okean rəngli arayüz",             category: "skin",    price: 300, emoji: "🌊", consumable: false },
  { id: "premium_wary",   name: "⭐ Premium Oyunçular",   desc: "Who Are Ya-da gizli futbolçular açılır", category: "premium", price: 250, emoji: "⭐", consumable: false },
];

function openStoreModal() {
  const modal = document.getElementById("store-modal");
  if (!modal) return;
  pfRenderStore();
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeStoreModal() {
  const m = document.getElementById("store-modal");
  if (m) m.hidden = true;
  document.body.style.overflow = "";
}

function pfRenderStore() {
  const body = document.getElementById("store-modal-body");
  if (!body) return;
  const u = pfGetCurrentUser();
  const d = u ? getUserData(u.username) : null;
  const coins = d ? (d.coins || 0) : 0;
  const inv   = d ? (d.inventory || []) : [];

  const cats = [
    { key: "powerup", label: "⚡ Gücləndiricilər" },
    { key: "skin",    label: "🎨 Temalər" },
    { key: "premium", label: "⭐ Premium" },
  ];

  body.innerHTML = `
    <div class="store-coins-bar">
      <span class="store-coins">🪙 ${coins} Coin</span>
      ${!u ? '<span class="store-login-hint">Alış etmək üçün giriş edin</span>' : ''}
    </div>
    ${cats.map(cat => `
      <div class="store-category-title">${cat.label}</div>
      <div class="store-items-grid">
        ${PF_STORE_ITEMS.filter(i => i.category === cat.key).map(item => {
          const owned   = inv.includes(item.id);
          const canAfford = coins >= item.price;
          const itemEsc = typeof escapeHTML === "function" ? escapeHTML : s => s;
          return `
            <div class="store-item-card${owned ? ' owned' : ''}">
              <div class="store-item-emoji">${item.emoji}</div>
              <div class="store-item-name">${itemEsc(item.name)}</div>
              <div class="store-item-desc">${itemEsc(item.desc)}</div>
              <div class="store-item-price">🪙 ${item.price}</div>
              ${owned
                ? `<div class="store-item-owned">✅ Var</div>`
                : u
                  ? `<button class="store-buy-btn${canAfford ? '' : ' cant-afford'}"
                        onclick="pfBuyItem('${item.id}')"
                        ${canAfford ? '' : 'disabled'}>
                        ${canAfford ? '🛒 Al' : '💸 Coin yetmir'}
                     </button>`
                  : `<button class="store-buy-btn cant-afford" onclick="openProfileModal(); closeStoreModal()">🔐 Giriş</button>`}
            </div>`;
        }).join("")}
      </div>`).join("")}`;
}

function pfBuyItem(itemId) {
  const u = pfGetCurrentUser();
  if (!u) return;
  const item = PF_STORE_ITEMS.find(i => i.id === itemId);
  if (!item) return;
  const d = getUserData(u.username);
  if ((d.coins || 0) < item.price) {
    if (typeof showToast === "function") showToast("💸 Coin yetmir!");
    return;
  }
  if (!item.consumable && (d.inventory || []).includes(itemId)) {
    if (typeof showToast === "function") showToast("✅ Bu məhsul artıq var!");
    return;
  }
  d.coins -= item.price;
  if (!d.inventory) d.inventory = [];
  if (item.consumable) {
    d.inventory.push(itemId);
  } else {
    if (!d.inventory.includes(itemId)) d.inventory.push(itemId);
  }
  saveUserData(u.username, d);
  pfUpdateCoinsDisplay();
  pfRenderStore();
  pfPlaySfx("coin");
  if (typeof showToast === "function") showToast(`✅ ${item.name} alındı!`);

  // Apply skin immediately
  if (itemId.startsWith("skin_")) pfApplySkin(itemId);
}

function pfHasItem(itemId) {
  const u = pfGetCurrentUser();
  if (!u) return false;
  const d = getUserData(u.username);
  return (d.inventory || []).includes(itemId);
}

function pfUseConsumable(itemId) {
  const u = pfGetCurrentUser();
  if (!u) return false;
  const d = getUserData(u.username);
  const idx = (d.inventory || []).indexOf(itemId);
  if (idx === -1) return false;
  d.inventory.splice(idx, 1);
  saveUserData(u.username, d);
  return true;
}

function pfApplySkin(skinId) {
  const skins = {
    skin_gold:  { "--accent": "#f59e0b", "--accent2": "#d97706", "--card-bg": "rgba(245,158,11,0.08)" },
    skin_neon:  { "--accent": "#a855f7", "--accent2": "#7c3aed", "--card-bg": "rgba(168,85,247,0.08)" },
    skin_ocean: { "--accent": "#0ea5e9", "--accent2": "#0284c7", "--card-bg": "rgba(14,165,233,0.08)" },
  };
  const vars = skins[skinId];
  if (!vars) return;
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

function pfApplyActiveSkin() {
  const u = pfGetCurrentUser();
  if (!u) return;
  const d = getUserData(u.username);
  const skinOrder = ["skin_gold", "skin_neon", "skin_ocean"];
  const activeSkin = skinOrder.find(s => (d.inventory || []).includes(s));
  if (activeSkin) pfApplySkin(activeSkin);
}

// ═══════════════════════════════════════════════════════════════════════
//  LEADERBOARD / TOURNAMENT
// ═══════════════════════════════════════════════════════════════════════
const PF_SIMULATED_LB = [
  { username: "ElçinAz⚡",     totalScore: 5200, gamesPlayed: 52, flag: "🇦🇿" },
  { username: "FutbolKing",     totalScore: 4750, gamesPlayed: 45, flag: "🇦🇿" },
  { username: "BakiStar",       totalScore: 4100, gamesPlayed: 40, flag: "🇦🇿" },
  { username: "QarabağFan",     totalScore: 3800, gamesPlayed: 38, flag: "🇦🇿" },
  { username: "NeftçiUlduzu",   totalScore: 3500, gamesPlayed: 35, flag: "🇦🇿" },
  { username: "ProGamer_AZ",    totalScore: 3200, gamesPlayed: 32, flag: "🇦🇿" },
  { username: "FootballWizard", totalScore: 2900, gamesPlayed: 30, flag: "🌍" },
  { username: "SporSever",      totalScore: 2600, gamesPlayed: 28, flag: "🇦🇿" },
  { username: "TaktikUstası",   totalScore: 2300, gamesPlayed: 25, flag: "🇦🇿" },
  { username: "GolKralı",       totalScore: 2000, gamesPlayed: 22, flag: "🇦🇿" },
];

function openLeaderboardModal() {
  const modal = document.getElementById("leaderboard-modal");
  if (!modal) return;
  pfRenderLeaderboard("global");
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLeaderboardModal() {
  const m = document.getElementById("leaderboard-modal");
  if (m) m.hidden = true;
  document.body.style.overflow = "";
}

function pfGetMergedLeaderboard() {
  const u = pfGetCurrentUser();
  const rows = [...PF_SIMULATED_LB];

  // Inject real user if logged in
  if (u) {
    const d = getUserData(u.username);
    const existing = rows.find(r => r.username.toLowerCase() === u.username.toLowerCase());
    if (!existing && (d.gamesPlayed || 0) > 0) {
      rows.push({ username: u.avatar + " " + u.username, totalScore: d.totalScore || 0, gamesPlayed: d.gamesPlayed || 0, flag: "🇦🇿", isMe: true });
    } else if (existing) {
      existing.totalScore = Math.max(existing.totalScore, d.totalScore || 0);
      existing.isMe = true;
    }
  }

  return rows.sort((a, b) => b.totalScore - a.totalScore);
}

function pfRenderLeaderboard(tab) {
  const body = document.getElementById("lb-modal-body");
  if (!body) return;

  const rows = pfGetMergedLeaderboard();
  const escFn = typeof escapeHTML === "function" ? escapeHTML : s => s;

  body.innerHTML = `
    <div class="lb-tabs">
      <button class="lb-tab${tab === 'global' ? ' active' : ''}" onclick="pfRenderLeaderboard('global')">🌍 Global</button>
      <button class="lb-tab${tab === 'monthly' ? ' active' : ''}" onclick="pfRenderLeaderboard('monthly')">📅 Aylıq</button>
    </div>
    <div class="lb-table">
      <div class="lb-header">
        <span>#</span><span>Oyunçu</span><span>Oyun</span><span>Skor</span>
      </div>
      ${rows.slice(0, 20).map((r, i) => {
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`;
        return `<div class="lb-row${r.isMe ? ' lb-me' : ''}">
          <span class="lb-rank">${medal}</span>
          <span class="lb-player">${r.flag} ${escFn(r.username)}</span>
          <span>${r.gamesPlayed}</span>
          <span class="lb-score">${r.totalScore}</span>
        </div>`;
      }).join("")}
    </div>
    <div class="lb-prize-box">
      <div class="lb-prize-title">🏆 Bu Ayin Mükafatları</div>
      <div class="lb-prizes">
        <div class="lb-prize">🥇 1-ci yer: 1000 🪙 Coin</div>
        <div class="lb-prize">🥈 2-ci yer: 500 🪙 Coin</div>
        <div class="lb-prize">🥉 3-cü yer: 250 🪙 Coin</div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════
//  DAILY CHALLENGES
// ═══════════════════════════════════════════════════════════════════════
const PF_DAILY_POOL = [
  { id: "dc1",  desc: "Penalti oyununda ən az 4 qol vurun",  gameType: "penalty",    target: 4,  reward: 80,  emoji: "⚽" },
  { id: "dc2",  desc: "Viktorinada 70+ xal əldə edin",       gameType: "quiz",       target: 70, reward: 100, emoji: "🧠" },
  { id: "dc3",  desc: "Qapıçı oyununda 20+ top tutun",       gameType: "goalkeeper", target: 20, reward: 90,  emoji: "🧤" },
  { id: "dc4",  desc: "Hədəf oyununda 15+ top vurun",        gameType: "goalrush",   target: 15, reward: 75,  emoji: "🎯" },
  { id: "dc5",  desc: "Sprint oyununda 2+ qol atın",         gameType: "sprint",     target: 2,  reward: 60,  emoji: "⚡" },
  { id: "dc6",  desc: "Proqnoz oyununda 3+ düzgün nəticə",   gameType: "predictor",  target: 3,  reward: 85,  emoji: "📊" },
  { id: "dc7",  desc: "Taktika oyununda 100+ xal əldə edin", gameType: "tactics",    target: 100,reward: 110, emoji: "♟️" },
  { id: "dc8",  desc: "Who Are Ya'da 3+ futbolçu tapın",     gameType: "whoarya",    target: 3,  reward: 120, emoji: "🕵️" },
];

function pfGetDailyChallenge() {
  const today    = new Date().toDateString();
  const stored   = pfGet("daily", null);
  if (stored && stored.date === today && stored.id) return stored;

  // Use date-based index so it changes daily (no hash needed)
  const d   = new Date();
  const idx = (d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate()) % PF_DAILY_POOL.length;
  const ch  = { ...PF_DAILY_POOL[idx], date: today, completed: false };
  pfSet("daily", ch);
  return ch;
}

function pfMarkDailyComplete() {
  const ch = pfGetDailyChallenge();
  ch.completed = true;
  pfSet("daily", ch);
  pfAwardCoins(ch.reward);
  pfPlaySfx("goal");
  if (typeof showToast === "function") showToast(`🎉 Günlük tapşırıq tamamlandı! +${ch.reward} Coin!`);
  pfUpdateDailyBadge();
}

function pfUpdateDailyBadge() {
  const ch  = pfGetDailyChallenge();
  const btn = document.getElementById("daily-nav-btn");
  if (btn) {
    const done = ch.completed;
    btn.classList.toggle("daily-done", done);
    btn.innerHTML = done ? "✅ Günlük" : "📅 Günlük <span class='daily-dot'></span>";
  }
}

function openDailyModal() {
  const modal = document.getElementById("daily-modal");
  if (!modal) return;
  pfRenderDailyChallenge();
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeDailyModal() {
  const m = document.getElementById("daily-modal");
  if (m) m.hidden = true;
  document.body.style.overflow = "";
}

function pfRenderDailyChallenge() {
  const body = document.getElementById("daily-modal-body");
  if (!body) return;
  const ch = pfGetDailyChallenge();
  const u  = pfGetCurrentUser();

  body.innerHTML = `
    <div class="daily-challenge-card${ch.completed ? ' completed' : ''}">
      <div class="daily-emoji">${ch.emoji}</div>
      <div class="daily-desc">${ch.desc}</div>
      <div class="daily-reward">🪙 Mükafat: <strong>${ch.reward} Coin</strong></div>
      ${ch.completed
        ? '<div class="daily-status done">✅ Tamamlandı!</div>'
        : u
          ? `<button class="btn-primary daily-start-btn" onclick="closeDailyModal(); pfOpenGameForChallenge('${ch.gameType}')">▶️ Oyna</button>`
          : '<div class="daily-status">🔐 Giriş edin</div>'}
    </div>
    <div class="daily-info">
      <p>Hər gün yeni tapşırıq gəlir. Tapşırığı yerinə yetirib coin qazanın!</p>
    </div>`;
}

function pfOpenGameForChallenge(gameType) {
  const game = (typeof GAMES_DATA !== "undefined") && GAMES_DATA.find(g => g.gameType === gameType);
  if (game && typeof openGamePlayer === "function") openGamePlayer(game);
}

// ═══════════════════════════════════════════════════════════════════════
//  ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════════════
const PF_ACHIEVEMENTS = [
  { id: "first_game",    name: "İlk Oyun",     icon: "🎮", desc: "İlk oyununuzu oynayın",              condition: d => d.gamesPlayed >= 1 },
  { id: "five_games",    name: "Müntəzəm",     icon: "🕹️", desc: "5 oyun oynayın",                     condition: d => d.gamesPlayed >= 5 },
  { id: "twenty_games",  name: "Oyunçu",       icon: "🎯", desc: "20 oyun oynayın",                    condition: d => d.gamesPlayed >= 20 },
  { id: "fifty_games",   name: "Veteran",      icon: "🏅", desc: "50 oyun oynayın",                    condition: d => d.gamesPlayed >= 50 },
  { id: "score_100",     name: "Başlanğıc",    icon: "💯", desc: "100 ümumi skor əldə edin",           condition: d => d.totalScore >= 100 },
  { id: "score_1000",    name: "Skor Ustası",  icon: "⭐", desc: "1000 ümumi skor əldə edin",          condition: d => d.totalScore >= 1000 },
  { id: "score_5000",    name: "Çempion",      icon: "🏆", desc: "5000 ümumi skor əldə edin",          condition: d => d.totalScore >= 5000 },
  { id: "high_80",       name: "Böyük Oyun",   icon: "🔥", desc: "Bir oyunda 80+ skor əldə edin",      condition: d => d.highScore >= 80 },
  { id: "rich",          name: "Coin Milyoner",icon: "🪙", desc: "500 coin yığın",                     condition: d => (d.coins || 0) >= 500 },
  { id: "collector",     name: "Kolleksioner", icon: "🗂️", desc: "3 mağaza məhsulu alın",              condition: d => (d.inventory || []).length >= 3 },
];

function pfCheckAchievements(username) {
  const d   = getUserData(username);
  if (!d.achievements) d.achievements = [];
  const newOnes = [];

  PF_ACHIEVEMENTS.forEach(a => {
    if (!d.achievements.includes(a.id) && a.condition(d)) {
      d.achievements.push(a.id);
      newOnes.push(a);
    }
  });

  if (newOnes.length > 0) {
    saveUserData(username, d);
    newOnes.forEach(a => {
      if (typeof showToast === "function") {
        showToast(`🏅 Nişan qazandınız: ${a.icon} ${a.name}!`);
      }
    });
  }
}

function openAchievementsModal() {
  const modal = document.getElementById("achievements-modal");
  if (!modal) return;
  pfRenderAchievements();
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeAchievementsModal() {
  const m = document.getElementById("achievements-modal");
  if (m) m.hidden = true;
  document.body.style.overflow = "";
}

function pfRenderAchievements() {
  const body = document.getElementById("achievements-modal-body");
  if (!body) return;
  const u = pfGetCurrentUser();
  const d = u ? getUserData(u.username) : { achievements: [] };
  const unlocked = d.achievements || [];

  body.innerHTML = `
    <div class="ach-grid">
      ${PF_ACHIEVEMENTS.map(a => {
        const done = unlocked.includes(a.id);
        return `<div class="ach-card${done ? ' unlocked' : ' locked'}">
          <div class="ach-icon">${a.icon}</div>
          <div class="ach-name">${typeof escapeHTML === "function" ? escapeHTML(a.name) : a.name}</div>
          <div class="ach-desc">${typeof escapeHTML === "function" ? escapeHTML(a.desc) : a.desc}</div>
          ${done ? '<div class="ach-status">✅</div>' : '<div class="ach-status locked-icon">🔒</div>'}
        </div>`;
      }).join("")}
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════
//  DIFFICULTY SYSTEM
// ═══════════════════════════════════════════════════════════════════════
let pfDifficulty = "normal"; // easy | normal | hard

function pfSetDifficulty(level) {
  pfDifficulty = level;
  document.querySelectorAll(".diff-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.diff === level);
  });
}

function pfGetDifficultyMultiplier() {
  return { easy: 0.75, normal: 1.0, hard: 1.5 }[pfDifficulty] || 1.0;
}

function pfGetDifficultyTimeMultiplier() {
  return { easy: 1.3, normal: 1.0, hard: 0.7 }[pfDifficulty] || 1.0;
}

// ═══════════════════════════════════════════════════════════════════════
//  WHO ARE YA GAME
// ═══════════════════════════════════════════════════════════════════════
const PF_WHO_PLAYERS = [
  { id:1,  name:"Lionel Messi",       aliases:["messi","leo messi","leo"],         club:"Inter Miami",  country:"Argentina",  pos:"Hücumçu",  num:10, col1:"#4f94cd",col2:"ff69b4",  emoji:"🐐" },
  { id:2,  name:"Cristiano Ronaldo",  aliases:["ronaldo","cr7","cristiano"],        club:"Al-Nassr",     country:"Portuqaliya",pos:"Hücumçu",  num:7,  col1:"#ffd700",col2:"#000",   emoji:"🦁" },
  { id:3,  name:"Kylian Mbappé",      aliases:["mbappe","kylian","mbappe"],         club:"Real Madrid",  country:"Fransa",     pos:"Hücumçu",  num:9,  col1:"#003DA5",col2:"#CE1126",emoji:"⚡" },
  { id:4,  name:"Erling Haaland",     aliases:["haaland","erling"],                 club:"Man City",     country:"Norveç",     pos:"Hücumçu",  num:9,  col1:"#6bcbe3",col2:"#1c2c4c",emoji:"🔵" },
  { id:5,  name:"Neymar Jr.",         aliases:["neymar","ney","neymar jr"],          club:"Al-Hilal",     country:"Braziliya",  pos:"Qanad",    num:10, col1:"#009c3b",col2:"#ffdf00", emoji:"🌟" },
  { id:6,  name:"Vinicius Jr.",       aliases:["vinicius","vini","vini jr"],         club:"Real Madrid",  country:"Braziliya",  pos:"Sol Qanad",num:7,  col1:"#FEBE10",col2:"#003DA5",emoji:"💫" },
  { id:7,  name:"Pedri",             aliases:["pedri","pedro gonzalez"],             club:"Barcelona",    country:"İspaniya",   pos:"Yarımmüd.",num:8,  col1:"#A50044",col2:"#004D98", emoji:"🔴" },
  { id:8,  name:"Kevin De Bruyne",   aliases:["de bruyne","kdb","kevin"],            club:"Man City",     country:"Belçika",    pos:"Yarımmüd.",num:17, col1:"#6bcbe3",col2:"#1c2c4c",emoji:"🎯" },
  { id:9,  name:"Robert Lewandowski",aliases:["lewandowski","lewy","robert lewa"],   club:"Barcelona",    country:"Polşa",      pos:"Hücumçu",  num:9,  col1:"#A50044",col2:"#004D98", emoji:"⚽" },
  { id:10, name:"Harry Kane",        aliases:["kane","harry"],                       club:"Bayern",       country:"İngiltərə",  pos:"Hücumçu",  num:9,  col1:"#DC052D",col2:"#fff",   emoji:"🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id:11, name:"Lamine Yamal",      aliases:["yamal","lamine"],                     club:"Barcelona",    country:"İspaniya",   pos:"Sağ Qanad",num:19, col1:"#A50044",col2:"#004D98", emoji:"✨" },
  { id:12, name:"Jude Bellingham",   aliases:["bellingham","jude"],                  club:"Real Madrid",  country:"İngiltərə",  pos:"Yarımmüd.",num:5,  col1:"#FEBE10",col2:"#003DA5",emoji:"💥" },
];

function startWhoareyaGame(game) {
  const gameArea = document.getElementById("game-area");
  if (!gameArea) return;

  const difficulty = pfDifficulty || "normal";
  const pool    = [...PF_WHO_PLAYERS].sort(() => Math.random() - 0.5);
  const count   = difficulty === "easy" ? 5 : difficulty === "hard" ? 10 : 7;
  const players = pool.slice(0, count);
  const maxHints = difficulty === "easy" ? 4 : difficulty === "hard" ? 2 : 3;

  let pIdx = 0, totalScore = 0, correctCount = 0;

  function renderRound() {
    const p = players[pIdx];
    const hintsUsed = { 0: false, 1: false, 2: false, 3: false };
    let blurLevel = 28;
    let attemptsLeft = 3;

    const HINTS = [
      { label: "Nömrə", value: `#${p.num}` },
      { label: "Klub",  value: p.club },
      { label: "Ölkə",  value: p.country },
      { label: "Mövqe", value: p.pos },
    ];

    gameArea.innerHTML = `
      <div class="way-container">
        <div class="way-progress">Futbolçu ${pIdx + 1}/${players.length} &nbsp;|&nbsp; 🏆 Skor: <span id="way-score">${totalScore}</span></div>

        <div class="way-player-card" id="way-card">
          <div class="way-blur-wrap" id="way-blur-wrap" style="filter:blur(${blurLevel}px)">
            <canvas id="way-canvas" width="200" height="260"></canvas>
          </div>
          <div class="way-emoji-reveal" id="way-emoji" style="opacity:0;font-size:4rem;">${p.emoji}</div>
        </div>

        <div class="way-hints-row" id="way-hints">
          ${HINTS.map((h, i) => `
            <div class="way-hint${i >= maxHints ? ' way-hint-locked' : ''}" id="hint-${i}">
              <span class="way-hint-label">${h.label}</span>
              <span class="way-hint-value" id="hv-${i}">?</span>
              ${i < maxHints
                ? `<button class="way-hint-btn" onclick="pfRevealHint(${i})" id="hbtn-${i}">💡 Göstər</button>`
                : `<span class="way-hint-locked-label">🔒</span>`}
            </div>`).join("")}
        </div>

        <div class="way-guess-area">
          <div class="way-attempts">❤️ ${attemptsLeft} cəhd qalıb</div>
          <input type="text" id="way-input" class="way-input" placeholder="Futbolçunun adını yazın…" maxlength="40"
            autocomplete="off" onkeydown="if(event.key==='Enter')pfCheckGuess()">
          <div class="way-guess-btns">
            <button class="btn-primary" onclick="pfCheckGuess()">✅ Yoxla</button>
            <button class="btn-secondary" onclick="pfSkipPlayer()">⏭️ Ötür</button>
          </div>
          <div class="way-msg" id="way-msg"></div>
        </div>
      </div>`;

    drawPlayerCard(p);

    window.pfRevealHint = function(idx) {
      if (hintsUsed[idx]) return;
      hintsUsed[idx] = true;
      blurLevel = Math.max(0, blurLevel - 7);
      const blurWrap = document.getElementById("way-blur-wrap");
      if (blurWrap) blurWrap.style.filter = `blur(${blurLevel}px)`;
      const hv = document.getElementById(`hv-${idx}`);
      if (hv) hv.textContent = HINTS[idx].value;
      const hbtn = document.getElementById(`hbtn-${idx}`);
      if (hbtn) hbtn.disabled = true;
      pfPlaySfx("reveal");
    };

    window.pfCheckGuess = function() {
      const input = document.getElementById("way-input");
      const msg   = document.getElementById("way-msg");
      if (!input) return;
      const guess = input.value.trim().toLowerCase();
      if (!guess) return;

      const correct = p.aliases.some(a => guess.includes(a)) || p.name.toLowerCase().includes(guess) || guess.includes(p.name.toLowerCase().split(" ")[1]);

      if (correct) {
        const hintsCount = Object.values(hintsUsed).filter(Boolean).length;
        const pts = Math.max(10, 100 - hintsCount * 20 - (3 - attemptsLeft) * 10);
        totalScore += pts;
        correctCount++;
        pfPlaySfx("correct");

        const blurWrap2 = document.getElementById("way-blur-wrap");
        const emojiEl   = document.getElementById("way-emoji");
        if (blurWrap2) blurWrap2.style.filter = "blur(0px)";
        if (emojiEl)   emojiEl.style.opacity = "1";

        if (msg) {
          msg.textContent = `🎉 Düzgün! ${p.name} — +${pts} xal!`;
          msg.className = "way-msg correct";
        }
        if (typeof setGpScore === "function") setGpScore(totalScore);

        setTimeout(() => {
          pIdx++;
          if (pIdx < players.length) renderRound();
          else pfEndWhoareya(totalScore, correctCount, players.length);
        }, 1800);

      } else {
        attemptsLeft--;
        pfPlaySfx("wrong");
        input.value = "";
        const attemptsEl = document.querySelector(".way-attempts");
        if (attemptsEl) attemptsEl.textContent = `❤️ ${attemptsLeft} cəhd qalıb`;
        if (msg) {
          msg.textContent = `❌ Yanlış! Yenidən cəhd edin.`;
          msg.className = "way-msg wrong";
        }

        if (attemptsLeft <= 0) {
          const blurWrap3 = document.getElementById("way-blur-wrap");
          const emojiEl3  = document.getElementById("way-emoji");
          if (blurWrap3) blurWrap3.style.filter = "blur(0px)";
          if (emojiEl3)  emojiEl3.style.opacity = "1";
          if (msg) {
            msg.textContent = `😔 Bu ${p.name} idi!`;
            msg.className = "way-msg wrong";
          }
          setTimeout(() => {
            pIdx++;
            if (pIdx < players.length) renderRound();
            else pfEndWhoareya(totalScore, correctCount, players.length);
          }, 2000);
        }
      }
    };

    window.pfSkipPlayer = function() {
      const blurWrap4 = document.getElementById("way-blur-wrap");
      const emojiEl4  = document.getElementById("way-emoji");
      if (blurWrap4) blurWrap4.style.filter = "blur(0px)";
      if (emojiEl4)  emojiEl4.style.opacity = "1";
      const msg4 = document.getElementById("way-msg");
      if (msg4) { msg4.textContent = `Bu ${p.name} idi!`; msg4.className = "way-msg wrong"; }
      pfPlaySfx("wrong");
      setTimeout(() => {
        pIdx++;
        if (pIdx < players.length) renderRound();
        else pfEndWhoareya(totalScore, correctCount, players.length);
      }, 1500);
    };
  }

  function drawPlayerCard(p) {
    const canvas = document.getElementById("way-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    // Jersey background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, p.col1);
    grad.addColorStop(1, p.col2 || p.col1);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(0, 0, W, H, 12) : ctx.rect(0, 0, W, H);
    ctx.fill();

    // Silhouette
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    // Body
    ctx.beginPath(); ctx.ellipse(W/2, H*0.62, W*0.28, H*0.3, 0, 0, Math.PI*2); ctx.fill();
    // Head
    ctx.fillStyle = "rgba(255,220,180,0.8)";
    ctx.beginPath(); ctx.arc(W/2, H*0.22, W*0.18, 0, Math.PI*2); ctx.fill();

    // Jersey number
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = `bold ${W * 0.28}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(p.num), W/2, H*0.62);
  }

  renderRound();
}

function pfEndWhoareya(score, correct, total) {
  if (typeof showGameOver === "function") {
    showGameOver(score, `🕵️ ${correct}/${total} futbolçu tapıldı<br>⭐ Toplam xal: ${score}`);
  }
  // Daily challenge check
  pfCheckDailyChallengeCompletion("whoarya", correct);
}

// ─── Daily challenge completion check ─────────────────────────────────────────
function pfCheckDailyChallengeCompletion(gameType, value) {
  const ch = pfGetDailyChallenge();
  if (ch.completed || ch.gameType !== gameType) return;
  if (value >= ch.target) pfMarkDailyComplete();
}

// ═══════════════════════════════════════════════════════════════════════
//  GAME-OVER INTEGRATION (award coins, track stats, daily check)
// ═══════════════════════════════════════════════════════════════════════
function pfOnGameOver(score) {
  // Award coins based on score
  const coinsEarned = Math.floor(score / 10) + 5;
  pfAwardCoins(coinsEarned, true);
  if (coinsEarned > 0) {
    pfPlaySfx("coin");
    if (typeof showToast === "function") {
      setTimeout(() => showToast(`🪙 +${coinsEarned} Coin qazandınız!`), 600);
    }
  }
  // Track stats
  pfTrackGamePlayed(score);
  // Daily check for current game
  if (typeof gpCurrentGame !== "undefined" && gpCurrentGame) {
    pfCheckDailyChallengeCompletion(gpCurrentGame.gameType, score);
  }
  // 2x bonus check
  if (pfHasItem("powerup_2x")) {
    pfUseConsumable("powerup_2x");
    pfAwardCoins(coinsEarned, false);
  }
  pfUpdateDailyBadge();
}

// ═══════════════════════════════════════════════════════════════════════
//  PLATFORM INIT
// ═══════════════════════════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  // Load sound preferences
  pfSoundOn = pfGet("soundOn", true);
  pfVolume  = pfGet("volume",  0.5);

  pfUpdateAudioUI();
  pfUpdateNavProfile();
  pfApplyActiveSkin();
  pfUpdateDailyBadge();

  // Start BGM on first user interaction
  const startAudio = () => {
    if (pfSoundOn) pfStartBGM();
    document.removeEventListener("click", startAudio);
    document.removeEventListener("keydown", startAudio);
  };
  document.addEventListener("click", startAudio);
  document.addEventListener("keydown", startAudio);

  // Wrap showGameOver from games.js to inject platform hooks
  if (typeof window.showGameOver === "function") {
    const _orig = window.showGameOver;
    window.showGameOver = function(score, statsHtml) {
      pfPlaySfx("gameover");
      _orig(score, statsHtml);
      pfOnGameOver(score);
    };
  }

  // Add who are ya to game engine dispatch
  if (typeof window.launchGameEngine === "function") {
    const _origLaunch = window.launchGameEngine;
    window.launchGameEngine = function(game) {
      if (game.gameType === "whoarya") {
        startWhoareyaGame(game);
      } else {
        _origLaunch(game);
      }
    };
  }

  // Close modals on backdrop click
  ["profile-modal","store-modal","leaderboard-modal","daily-modal","achievements-modal"].forEach(id => {
    const m = document.getElementById(id);
    if (m) m.addEventListener("click", e => { if (e.target === m) {
      m.hidden = true; document.body.style.overflow = "";
    }});
  });

  // Close on Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      ["profile-modal","store-modal","leaderboard-modal","daily-modal","achievements-modal"].forEach(id => {
        const m = document.getElementById(id);
        if (m && !m.hidden) { m.hidden = true; document.body.style.overflow = ""; }
      });
    }
  });
});
