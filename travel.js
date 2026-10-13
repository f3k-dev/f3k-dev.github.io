/* =========================================================
 * Travel page (travel.html)
 * ---------------------------------------------------------
 * 旅程データは travel-data.js（TRIPS / COUNTRIES）に記述します。
 * このファイルはカード・地図・国旗・統計の描画のみを行います。
 * ========================================================= */
(function () {

  const HOME_COUNTRY = 'jp';  // 国旗・国数の集計から除外する国
  const CENTER_LNG = 135;     // 地図の中心経度（太平洋をまたぐルートを最短で描くため）

  const PURPOSES = {
    sightseeing: { ja: '観光', en: 'Sightseeing', icon: 'fa-solid fa-camera' },
    study:       { ja: '研修', en: 'Study', icon: 'fa-solid fa-graduation-cap' },
    research:    { ja: '研究', en: 'Research', icon: 'fa-solid fa-flask' },
    work:        { ja: '仕事', en: 'Work', icon: 'fa-solid fa-briefcase' },
  };

  // 旅程ごとのテーマカラー（古い旅程から順に割り当て。データに color があればそちらを優先）
  const TRIP_COLORS = ['#4a87e0', '#2fa6b9', '#7b6fe0', '#3a9e7c', '#d9922e', '#d76f8e', '#3f63b8', '#c9784a', '#4fa0a0', '#9a6fc9'];

  const TRANSPORT = { plane: 'fa-plane', train: 'fa-train', bus: 'fa-bus', car: 'fa-car', ship: 'fa-ship', walk: 'fa-person-walking' };


  // ===== helpers =====
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ja');
  const txt = (v) => (v == null ? { ja: '', en: '' }
    : typeof v === 'string' ? { ja: v, en: v }
    : { ja: v.ja ?? v.en ?? '', en: v.en ?? v.ja ?? '' });
  const pick = (v) => txt(v)[lang()];
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // scripts.js の言語切り替えが data-ja / data-en を読んで表示する
  const i18n = (v) => { const t = txt(v); return `data-ja="${esc(t.ja)}" data-en="${esc(t.en)}"`; };
  const country = (code) => COUNTRIES[code] || { ja: code.toUpperCase(), en: code.toUpperCase() };
  const unique = (arr) => [...new Set(arr)];
  const pad = (n) => String(n).padStart(2, '0');

  const parse = (s) => {
    if (!s) return null;
    const [y, m, d] = String(s).split('-').map(Number);
    return { y, m: m || null, d: d || null };
  };
  const md = (p) => (p.m ? (p.d ? `${pad(p.m)}.${pad(p.d)}` : pad(p.m)) : '');
  // 年は別表示するので月日のみ（年をまたぐ場合は終了側に年を付ける）
  const dateRange = (start, end) => {
    const a = parse(start), b = parse(end);
    if (!a || !a.m) return '';
    if (!b || end === start) return md(a);
    return `${md(a)} – ${b.y !== a.y ? `${b.y}.` : ''}${md(b)}`;
  };
  const dayCount = (start, end) => {
    const a = parse(start), b = parse(end);
    if (!a?.d || !b?.d) return 0;
    return Math.round((Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 864e5) + 1;
  };
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; })();
  const isUpcoming = (start) => !!start && start > today.slice(0, start.length);

  const wrapLng = (lng) => {
    let x = lng;
    while (x < CENTER_LNG - 180) x += 360;
    while (x > CENTER_LNG + 180) x -= 360;
    return x;
  };
  // "Los Angeles (LAX)" → "Los Angeles"（空港コードを除いて都市を照合する）
  const stripCode = (name) => name.replace(/\s*\(.*?\)\s*$/, '').trim();
  const cityKey = (c) => `${c.country}:${stripCode(txt(c.city).en).toLowerCase()}`;
  const stopKey = (s) => `${s.country}:${txt(s.city).en}:${s.lat},${s.lng}`;


  // ===== data =====
  const trips = TRIPS.map((t, i) => {
    const stops = (t.stops || []).map(s => ({ ...s, mlng: wrapLng(s.lng) }));

    // 訪れた都市（データの city をそのまま使う）
    const cities = t.city || [];

    const purpose = (t.purpose || []).filter(p => PURPOSES[p]);
    return {
      ...t,
      id: t.id || `trip-${i + 1}`,
      stops,
      cities,
      cityKeys: new Set(cities.map(cityKey)),
      purpose,
      countries: unique(cities.map(c => c.country)).filter(c => c !== HOME_COUNTRY),
    };
  }).sort((a, b) => {
    if (!a.start || !b.start) return (a.start ? -1 : 0) + (b.start ? 1 : 0);
    return b.start.localeCompare(a.start);
  });
  // 古い順に色を割り当てる（新しい旅程を追加しても既存の色が変わらないように）
  [...trips].reverse().forEach((t, i) => { t.color = t.color || TRIP_COLORS[i % TRIP_COLORS.length]; });
  const tripById = (id) => trips.find(t => t.id === id);


  // ===== render: trip cards =====
  const chip = (c, cls = '', tag = 'li') =>
    `<${tag} class="route__stop${cls}"><span class="fi fi-${c.country}"></span><span ${i18n(c.city)}></span></${tag}>`;

  function tripHTML(t) {
    const a = parse(t.start);
    const dates = dateRange(t.start, t.end);
    const days = dayCount(t.start, t.end);

    const flags = t.countries
      .map(c => `<span class="fi fi-${c} fis" title="${esc(country(c).en)}"></span>`).join('');

    const purposes = t.purpose.map(p => {
      const P = PURPOSES[p];
      return `<span class="purpose-tag"><i class="${P.icon}"></i><span ${i18n(P)}></span></span>`;
    }).join('');

    const cities = t.cities.map(c => chip(c)).join('');

    // 経由地（横並び）
    const stops = !t.stops.length ? '' : `
      <details class="trip__details">
        <summary>
          <i class="fa-solid fa-route"></i>
          <span data-ja="経由地" data-en="Route"></span>
          <span class="trip__details-count" data-ja="${t.stops.length}地点" data-en="${t.stops.length} stops"></span>
        </summary>
        <ol class="route route--stops">
          ${t.stops.map((s, i) => `
            <li class="route__leg">
              ${i ? `<i class="route__hop fa-solid ${TRANSPORT[s.by] || 'fa-chevron-right'}" aria-hidden="true"></i>` : ''}
              ${chip(s, '', 'span')}
            </li>`).join('')}
        </ol>
      </details>`;

    const photos = !(t.photos || []).length ? '' : `
      <div class="project-images trip__photos">
        ${t.photos.map(p => `<img src="${esc(p.src || p)}" alt="${esc(p.alt || pick(t.title))}" loading="lazy">`).join('')}
      </div>`;

    const links = (t.links || []).map(l =>
      `<a class="pill-link" href="${esc(l.href)}" target="_blank" rel="noopener"><i class="${l.icon || 'fa-solid fa-link'}"></i><span ${i18n(l.label)}></span></a>`
    ).join('');

    return `
      <div class="trip-wrap animated-item" id="${t.id}" data-animation="fade-in-up" data-delay="0.1s">
        <article class="trip" data-trip="${t.id}" style="--trip-color:${t.color}">
          <div class="trip__stub">
            <i class="fa-solid fa-plane trip__stub-icon" aria-hidden="true"></i>
            <span class="trip__year">${a ? a.y : '----'}</span>
            ${dates ? `<span class="trip__dates">${dates}</span>` : ''}
            ${days ? `<span class="trip__days" data-ja="${days}日間" data-en="${days} day${days > 1 ? 's' : ''}"></span>` : ''}
            ${isUpcoming(t.start) ? `<span class="trip-badge trip-badge--upcoming" data-ja="予定" data-en="Upcoming"></span>` : ''}
            ${t.tbd ? `<span class="trip-badge trip-badge--tbd" data-ja="要確認" data-en="TBD"></span>` : ''}
          </div>
          <div class="trip__main">
            <div class="trip__head">
              ${flags ? `<div class="trip__flags">${flags}</div>` : ''}
              <h3 class="trip__title" ${i18n(t.title)}></h3>
            </div>
            ${purposes ? `<div class="trip__purposes">${purposes}</div>` : ''}
            ${cities ? `<ol class="route route--cities">${cities}</ol>` : ''}
            ${t.note ? `<p class="trip__note" ${i18n(t.note)}></p>` : ''}
            ${stops}
            ${photos}
            <div class="project-links trip__links">
              ${links}
              ${t.stops.length ? `<button type="button" class="pill-link trip__map-btn" data-focus="${t.id}"><i class="fa-solid fa-map-location-dot"></i><span data-ja="地図で見る" data-en="View on map"></span></button>` : ''}
            </div>
          </div>
        </article>
      </div>`;
  }

  function renderList() {
    const groups = [];
    trips.forEach(t => {
      const key = t.start ? t.start.slice(0, 4) : '';
      let g = groups.find(g => g.key === key);
      if (!g) groups.push(g = { key, trips: [] });
      g.trips.push(t);
    });
    $('#trip-list').innerHTML = groups.map(g => `
      <section class="trip-year">
        <h2 class="trip-year__heading">
          <i class="fa-regular fa-calendar"></i>
          ${g.key || `<span data-ja="時期未設定" data-en="Undated"></span>`}
        </h2>
        <div class="trip-year__list">${g.trips.map(tripHTML).join('')}</div>
      </section>`).join('')
      + `<p class="trip-empty" hidden data-ja="該当する旅程はありません" data-en="No trips match the filter."></p>`;
  }


  // ===== render: stats & filters =====
  function renderStats() {
    const abroad = trips.flatMap(t => t.cities.filter(c => c.country !== HOME_COUNTRY));

    const values = {
      countries: unique(abroad.map(c => c.country)).length,
      cities: unique(abroad.map(cityKey)).length,
      trips: trips.length,
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    $$('[data-stat]').forEach(el => {
      const to = values[el.dataset.stat] || 0;
      if (reduced) { el.textContent = to.toLocaleString(); return; }
      const t0 = performance.now(), dur = 1200;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(to * (1 - (1 - p) ** 3)).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  function renderFilters() {
    // 国：古い訪問順（日付なしは最後）
    const order = [], counts = {};
    [...trips.filter(t => t.start).reverse(), ...trips.filter(t => !t.start)].forEach(t => {
      t.countries.forEach(c => {
        if (!counts[c]) { counts[c] = 0; order.push(c); }
        counts[c]++;
      });
    });
    $('#country-chips').innerHTML = order.map(c => `
      <button type="button" class="country-chip" data-country="${c}" aria-pressed="false">
        <span class="fi fi-${c} fis"></span>
        <span ${i18n(country(c))}></span>
        <span class="country-chip__count">${counts[c]}</span>
      </button>`).join('');

    const used = Object.keys(PURPOSES).filter(p => trips.some(t => t.purpose.includes(p)));
    $('#purpose-filter').innerHTML =
      `<button type="button" class="pub-filter__btn" data-purpose="all" aria-pressed="true" data-ja="すべて" data-en="All"></button>`
      + used.map(p => `<button type="button" class="pub-filter__btn" data-purpose="${p}" aria-pressed="false"><i class="${PURPOSES[p].icon}"></i><span ${i18n(PURPOSES[p])}></span></button>`).join('');

  }


  // ===== map (Leaflet) =====
  let map = null;
  const routes = new Map();   // tripId -> L.featureGroup
  const markers = new Map();  // stopKey -> { marker, stop, tripIds, visited }
  let focused = null;

  // 2点間を緩やかな弧で結ぶ（二次ベジェ）
  function arc(a, b, n = 40) {
    const [y1, x1] = a, [y2, x2] = b;
    const dx = x2 - x1, dy = y2 - y1;
    if (Math.hypot(dx, dy) < 1e-6) return [a, b];
    const k = 0.2 * (dx >= 0 ? 1 : -1);
    const cx = (x1 + x2) / 2 - dy * k, cy = (y1 + y2) / 2 + dx * k;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = 1 - t;
      pts.push([u * u * y1 + 2 * u * t * cy + t * t * y2, u * u * x1 + 2 * u * t * cx + t * t * x2]);
    }
    return pts;
  }

  // 訪れた都市・日本の発着地は通常サイズ、それ以外の経由地は小さめの国旗ピン
  function pinIcon(s, visited) {
    visited = visited || s.country === HOME_COUNTRY;
    const size = visited ? 24 : 16;
    return L.divIcon({
      className: 'map-pin-wrap',
      html: `<span class="map-pin${visited ? '' : ' map-pin--via'}"><span class="fi fi-${s.country} fis"></span></span>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  function initMap() {
    const el = $('#travel-map');
    if (!el) return;
    if (!window.L) { el.closest('.travel-map').hidden = true; return; }

    map = L.map(el, {
      scrollWheelZoom: false, minZoom: 1, maxZoom: 12, zoomSnap: 0.5,
      maxBounds: [[-70, -540], [82, 540]], maxBoundsViscosity: 1,
    });
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      maxZoom: 16,
    }).addTo(map);

    trips.forEach(t => {
      if (!t.stops.length) return;
      const g = L.featureGroup();
      const pts = t.stops.map(s => [s.lat, s.mlng]);
      for (let i = 1; i < pts.length; i++) {
        g.addLayer(L.polyline(arc(pts[i - 1], pts[i]), { color: t.color, weight: 3, opacity: 0.85, base: 0.85 }));
      }
      g.on('click', () => focusTrip(t.id, { scrollToCard: true }));
      routes.set(t.id, g.addTo(map));

      t.stops.forEach(s => {
        const key = stopKey(s);
        if (!markers.has(key)) markers.set(key, { stop: s, tripIds: new Set(), visited: false });
        const m = markers.get(key);
        m.tripIds.add(t.id);
        if (t.cityKeys.has(cityKey(s))) m.visited = true;
      });
    });

    markers.forEach((m, key) => {
      const s = m.stop;
      m.marker = L.marker([s.lat, s.mlng], { icon: pinIcon(s, m.visited), riseOnHover: true, zIndexOffset: m.visited ? 500 : 0 })
        .bindTooltip(() => `${pick(s.city)} <small>${pick(country(s.country))}</small>`, { direction: 'top', offset: [0, -10] })
        .bindPopup(() => popupHTML(key), { maxWidth: 260 })
        .addTo(map);
    });

    $('#map-reset').addEventListener('click', () => { setFocus(null); fitVisible(); });
    fitVisible(false);
  }

  function popupHTML(key) {
    const { stop: s, tripIds } = markers.get(key);
    const items = trips.filter(t => tripIds.has(t.id) && t.visible !== false).map(t => {
      const p = parse(t.start);
      const when = p ? `${p.y}${p.m ? '.' + pad(p.m) : ''}` : '----';
      return `<li><a href="#${t.id}" data-goto="${t.id}"><span class="map-pop__when">${when}</span>${pick(t.title)}</a></li>`;
    }).join('');
    return `<div class="map-pop">
      <p class="map-pop__city"><span class="fi fi-${s.country}"></span>${pick(s.city)}<small>${pick(country(s.country))}</small></p>
      <ul class="map-pop__list">${items}</ul>
    </div>`;
  }

  function fitVisible(animate = true) {
    if (!map) return;
    const b = L.latLngBounds([]);
    markers.forEach(({ marker }) => { if (map.hasLayer(marker)) b.extend(marker.getLatLng()); });
    if (b.isValid()) map.fitBounds(b, { padding: [30, 30], maxZoom: 5, animate });
    else map.setView([30, CENTER_LNG], 1.5);
  }

  // ルート・ピンの強調（id = null で全表示）
  function highlight(id) {
    if (!map) return;
    routes.forEach((g, tid) => {
      const on = !id || tid === id;
      g.eachLayer(l => l.setStyle({ opacity: on ? l.options.base : 0.08 }));
      if (tid === id) g.bringToFront();
    });
    markers.forEach(({ marker, tripIds }) => marker.setOpacity(!id || tripIds.has(id) ? 1 : 0.3));
  }

  function setFocus(id) {
    focused = id;
    $$('.trip').forEach(el => el.classList.toggle('is-active', el.dataset.trip === id));
    highlight(id);
  }

  function focusTrip(id, { scrollToMap = false, scrollToCard = false } = {}) {
    const t = tripById(id);
    if (!t) return;
    setFocus(id);
    if (map && routes.has(id)) {
      const b = L.latLngBounds(t.stops.map(s => [s.lat, s.mlng]));
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) map.fitBounds(b, { padding: [50, 50], maxZoom: 6 });
      else map.flyToBounds(b, { padding: [50, 50], maxZoom: 6, duration: 1.2 });
    }
    if (scrollToMap && window.matchMedia('(max-width: 1000px)').matches) {
      $('.travel-map').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (scrollToCard) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


  // ===== filter =====
  const state = { country: null, purpose: 'all' };

  function applyFilter() {
    let shown = 0;
    trips.forEach(t => {
      const ok = (!state.country || t.countries.includes(state.country))
        && (state.purpose === 'all' || t.purpose.includes(state.purpose));
      t.visible = ok;
      document.getElementById(t.id).hidden = !ok;
      if (ok) shown++;
      const g = routes.get(t.id);
      if (g) ok ? g.addTo(map) : g.remove();
    });
    $$('.trip-year').forEach(sec => { sec.hidden = !$$('.trip-wrap', sec).some(w => !w.hidden); });
    $('.trip-empty').hidden = shown > 0;

    markers.forEach(({ marker, tripIds }) => {
      const ok = [...tripIds].some(id => tripById(id).visible);
      ok ? marker.addTo(map) : marker.remove();
    });

    $$('.country-chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.country === state.country));
    $$('#purpose-filter [data-purpose]').forEach(b => b.setAttribute('aria-pressed', b.dataset.purpose === state.purpose));

    if (focused && !tripById(focused).visible) setFocus(null);
    else highlight(focused);
    fitVisible();
  }


  // ===== events =====
  function bindEvents() {
    $('#country-chips').addEventListener('click', (e) => {
      const b = e.target.closest('[data-country]');
      if (!b) return;
      state.country = state.country === b.dataset.country ? null : b.dataset.country;
      applyFilter();
    });
    $('#purpose-filter').addEventListener('click', (e) => {
      const b = e.target.closest('[data-purpose]');
      if (!b) return;
      state.purpose = b.dataset.purpose;
      applyFilter();
    });

    const list = $('#trip-list');
    list.addEventListener('click', (e) => {
      const b = e.target.closest('[data-focus]');
      if (b) focusTrip(b.dataset.focus, { scrollToMap: true });
    });
    $$('.trip', list).forEach(card => {
      card.addEventListener('mouseenter', () => highlight(card.dataset.trip));
      card.addEventListener('mouseleave', () => highlight(focused));
    });

    // 地図のポップアップから旅程カードへ
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-goto]');
      if (a) { setFocus(a.dataset.goto); map?.closePopup(); }
    });
  }


  // scripts.js（言語切り替え・アニメーション）より前に DOM を組み立てる
  renderList();
  renderFilters();
  renderStats();
  initMap();
  bindEvents();
  applyFilter();
})();
