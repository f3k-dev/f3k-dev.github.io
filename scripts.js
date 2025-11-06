(function(){
  const $ = (s, r=document)=> Array.from(r.querySelectorAll(s));
  const btnJA = document.getElementById('btn-ja');
  const btnEN = document.getElementById('btn-en');
  const LS_KEY = 'pref-lang';

  const setLang = (lang) => {
    const other = lang === 'ja' ? 'en' : 'ja';
    btnJA.setAttribute('aria-pressed', lang==='ja');
    btnEN.setAttribute('aria-pressed', lang==='en');

    $('[data-ja], [data-en]').forEach(el => {
      const ja = el.getAttribute('data-ja') ?? '';
      const en = el.getAttribute('data-en') ?? '';
      const text = (lang === 'en' ? (en || ja) : (ja || en));
      if(typeof el.placeholder === 'string'){
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    });

    document.documentElement.lang = lang;
    localStorage.setItem(LS_KEY, lang);
  };

  btnJA.addEventListener('click', ()=> setLang('ja'));
  btnEN.addEventListener('click', ()=> setLang('en'));

  // ✅ 初期言語を日本語固定にする
  const saved = localStorage.getItem(LS_KEY);
  const initialLang = saved || 'ja';
  setLang(initialLang);

  document.getElementById('year').textContent = new Date().getFullYear();
})();




/* --- scripts.js に追記 --- */

document.addEventListener("DOMContentLoaded", function() {
  
  // --- ヒーローセクションのアニメーション ---
  const animatedItems = document.querySelectorAll('.animated-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const animationType = item.dataset.animation;
        const animationDelay = item.dataset.delay || '0s';

        // ▼ 変更点: 'bounce' の分岐を削除 ▼
        if (animationType === 'fade-in-up') {
          item.style.animationName = 'fadeInUp';
        }
        // 他のアニメーションタイプもここに追加可能 (例: 'fade-in' など)

        // ▼ 変更点: 'bounce' の分岐を削除し、共通設定のみにする ▼
        item.style.animationDuration = '0.8s'; // アニメーションの速度
        item.style.animationIterationCount = '1';
        item.style.animationDelay = animationDelay;
        item.style.animationTimingFunction = 'ease-out';

        observer.unobserve(item);
      }
    });
  }, {
    threshold: 0.1
  });

  animatedItems.forEach(item => {
    observer.observe(item);
  });

  // --- スクロールダウンリンクのスムーススクロール ---
  // (この部分は変更ありません)
  const scrollLink = document.querySelector('.scroll-down-link');
  if (scrollLink) {
    scrollLink.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  }

  // ( ... 既存の言語切り替えスクリプトなど ... )
});










// ===== Starfield animation (upward shooting lines) =====
(function(){
  const canvas = document.getElementById('hero-stars');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w = 0, h = 0;
  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    canvas.width  = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const STAR_COUNT = prefersReduced ? 60 : 60; // 流れ星の本数
  const stars = [];

  function rand(min, max){ return Math.random() * (max - min) + min; }
  function spawnStar(){
    return {
      x: rand(0, w),
      y: h + rand(0, h),        // 画面の下側から出現
      speed: rand(60, 220),     // 上向きの速さ（px/s）
      length: rand(10, 34),      // 線の長さ
      width: rand(0.6, 1.6),    // 線の太さ
      alpha: rand(0.25, 0.9),   // 透明度
    };
  }
  for (let i = 0; i < STAR_COUNT; i++) stars.push(spawnStar());

  let last = performance.now();
  function frame(now){
    const dt = Math.min(0.033, (now - last) / 1000); // ~30fps分を上限
    last = now;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#ffffff';
    ctx.lineCap = 'round';

    for (const s of stars){
      s.y -= s.speed * dt; // 上方向へ移動（下→上）
      if (s.y + s.length < 0){
        const fresh = spawnStar(); // 上に抜けたら下で再出現
        s.x = fresh.x; s.y = fresh.y; s.speed = fresh.speed; s.length = fresh.length; s.width = fresh.width; s.alpha = fresh.alpha;
      }
      ctx.globalAlpha = s.alpha;
      ctx.lineWidth = s.width;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y + s.length);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    }

    if (!prefersReduced) requestAnimationFrame(frame);
  }

  if (!prefersReduced){
    requestAnimationFrame(frame);
  } else {
    // 低モーション設定のときは静止ドット
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i = 0; i < 60; i++){
      const x = rand(0, w), y = rand(0, h);
      ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI*2); ctx.fill();
    }
  }
})();