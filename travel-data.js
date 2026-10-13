/* =========================================================
 * Travel page data（travel.html）
 * ---------------------------------------------------------
 * ここに旅程を追加すると、カード・地図・国旗・統計が自動で更新されます。
 * 表示のロジックは travel.js にあります。
 *
 *  title     : 旅程名 { ja, en }（片方だけでも可）
 *  start/end : 日程 'YYYY-MM-DD'（日付が曖昧なら 'YYYY-MM' / 'YYYY' も可。不明なら省略）
 *  purpose   : 用事 ['sightseeing' | 'study' | 'research' | 'work']（観光 / 研修 / 研究 / 仕事。複数可）
 *  note      : ひとこと { ja, en }（省略可）
 *  color     : 旅程のテーマカラー '#rrggbb'（省略時は自動で割り当て。地図の経路・カードのアクセントに使用）
 *  city      : 訪れた都市（カードに表示・国数/都市数の集計に使用）
 *    country   : 国コード（ISO 3166-1 alpha-2 の小文字。COUNTRIES に定義）
 *    city      : 都市名 { ja, en }
 *  stops     : 経由地（日本の出発地から帰着地まで、移動順）。地図のルートと「経由地」欄に使用
 *    country / city : 同上
 *    lat / lng : 緯度経度（必須。Google マップで右クリック → 座標をコピー）
 *    by        : その地点への移動手段 'plane' | 'train' | 'bus' | 'car' | 'ship' | 'walk'（省略可）
 *  links     : [{ icon, href, label: { ja, en } }]（省略可）
 *  photos    : ['assets/travel/xxx.jpg', ...]（省略可）
 *  tbd       : true で「要確認」バッジを表示（下書き用。確認できたら削除してください）
 * ========================================================= */

const TRIPS = [
  {
    title: { en: 'Busan Trip' },
    start: '2026-12-06', end: '2026-12-08',
    purpose: ['sightseeing'],
    // note: { ja: 'UPMに訪問', en: 'Presenting at IROS 2026' },
    city: [
      { country: 'kr', city: { en: 'Busan' }},
    ],
    stops: [
      { country: 'jp', city: { en: 'Fukuoka (FUK)' }, lat: 33.5902, lng: 130.4017, by: 'plane' },
      { country: 'kr', city: { en: 'Busan (PUS)' }, lat: 35.1796, lng: 129.0756, by: 'plane' },
      { country: 'jp', city: { en: 'Fukuoka (FUK)' }, lat: 33.5902, lng: 130.4017, by: 'plane' },
    ],
    // tbd: true,
  },

  {
    title: { en: 'UPM Visit' },
    start: '2026-10-17', end: '2026-11-3',
    purpose: ['research'],
    // note: { ja: 'UPMに訪問', en: 'Presenting at IROS 2026' },
    city: [
      { country: 'sg', city: { en: 'Singapore' }},
      { country: 'my', city: { en: 'Kuala Lumpur' }},
      { country: 'hk', city: { en: 'Hong Kong' }},
    ],
    stops: [
      { country: 'jp', city: { en: 'Tokyo (NRT)' }, lat: 35.7734, lng: 140.3902, by: 'plane' },
      { country: 'tw', city: { en: 'Taipei (TPE)' }, lat: 25.0733, lng: 121.5313, by: 'plane' },
      { country: 'sg', city: { en: 'Singapore (SIN)' }, lat: 1.2903, lng: 103.8520, by: 'plane' },
      { country: 'my', city: { en: 'Kuala Lumpur (KUL/SZB)' }, lat: 3.1390, lng: 101.6869, by: 'plane' },
      { country: 'hk', city: { en: 'Hong Kong (HKG)' }, lat: 22.3193, lng: 114.1694, by: 'plane' },
      { country: 'jp', city: { en: 'Fukuoka (FUK)' }, lat: 33.5902, lng: 130.4017, by: 'plane' },
    ],
    // tbd: true,
  },

  {
    title: { en: 'IROS 2026' },
    start: '2026-09-23', end: '2026-10-7',
    purpose: ['research'],
    note: { ja: '国際会議 IROS 2026 にて発表', en: 'Presenting at IROS 2026' },
    city: [
      { country: 'us', city: { en: 'Los Angeles' }},
      { country: 'us', city: { en: 'Chicago' }},
      { country: 'us', city: { en: 'Pittsburgh' }},
      { country: 'us', city: { en: 'New York' }},
    ],
    stops: [
      { country: 'jp', city: { en: 'Fukuoka (FUK)' }, lat: 33.5902, lng: 130.4017 },
      { country: 'jp', city: { en: 'Tokyo (HND)' }, lat: 35.6762, lng: 139.6503, by: 'plane' },
      { country: 'us', city: { en: 'Los Angeles (LAX)' }, lat: 34.0522, lng: -118.2437, by: 'plane' },
      { country: 'us', city: { en: 'Chicago (ORD)' }, lat: 41.8781, lng: -87.6298, by: 'plane' },
      { country: 'us', city: { en: 'Pittsburgh (PIT)' }, lat: 40.4406, lng: -79.9959, by: 'plane' },
      { country: 'us', city: { en: 'New York (LGA/JFK)' }, lat: 40.7128, lng: -74.0060, by: 'plane' },
      { country: 'jp', city: { en: 'Tokyo (HND)' }, lat: 35.6762, lng: 139.6503, by: 'plane' },
      { country: 'jp', city: { en: 'Fukuoka (FUK)' }, lat: 33.5902, lng: 130.4017, by: 'plane' },
    ],
    // links: [
    //   { icon: 'fa-solid fa-external-link-alt', href: 'https://2026.ieee-iros.org/', label: { ja: 'IROS 2026', en: 'IROS 2026' } },
    // ],
  },

  
  {
    title: { en: 'RoboCup 2026' },
    start: '2026-06-29', end: '2026-07-07',
    purpose: ['research'],
    note: { en: '@Home 5th place / Open Challenge 1st place' },
    city: [
      { country: 'kr', city: { en: 'Incheon' }},
    ],
    stops: [
      { country: 'jp', city: { en: 'Fukuoka (FUK)' }, lat: 33.5902, lng: 130.4017, by: 'plane' },
      { country: 'kr', city: { en: 'Seoul (ICN)' }, lat: 37.4563, lng: 126.7052, by: 'plane' },
      { country: 'jp', city: { en: 'Fukuoka (FUK)' }, lat: 33.5902, lng: 130.4017, by: 'plane' },
    ],
    links: [
      { icon: 'fa-solid fa-newspaper', href: 'https://www.kyutech.ac.jp/whats-new/topics/entry-12249.html', label: { ja: 'ニュース記事', en: 'News' } },
    ],
  },


  {
    title: { en: 'Solo trip to Turkey & Egypt' },
    start: '2025-03-10', end: '2025-03-17',
    purpose: ['sightseeing'],
    note: { ja: '約1週間の一人旅．とにかく刺激的な国でした．', en: 'A one-week solo trip. Both countries were truly exciting.' },
    city: [
      { country: 'kr', city: { en: 'Seoul' }},
      { country: 'cn', city: { en: 'Beijing' }},
      { country: 'tr', city: { en: 'Istanbul' }},
      { country: 'eg', city: { en: 'Cairo' }},
      { country: 'eg', city: { en: 'Alexandria' }},
      { country: 'cn', city: { en: 'Shanghai' }},
    ],
    stops: [
      { country: 'jp', city: { en: 'Kitakyushu (KKJ)' }, lat: 33.8836, lng: 130.8750 },
      { country: 'kr', city: { en: 'Seoul (ICN)' }, lat: 37.4563, lng: 126.7052, by: 'plane' },
      { country: 'cn', city: { en: 'Beijing (PEK)' }, lat: 39.9042, lng: 116.4074, by: 'plane' },
      { country: 'tr', city: { en: 'Istanbul (IST/SAW)' }, lat: 41.0082, lng: 28.9784, by: 'plane' },
      { country: 'eg', city: { en: 'Cairo (CAI)' }, lat: 30.0444, lng: 31.2357, by: 'plane' },
      { country: 'cn', city: { en: 'Shanghai (PVG)' }, lat: 31.2304, lng: 121.4737, by: 'plane' },
      { country: 'jp', city: { en: 'Fukuoka (FUK)' }, lat: 33.5902, lng: 130.4017, by: 'plane' },
    ],
    // links: [
    //   { icon: 'fa-brands fa-youtube', href: 'https://www.youtube.com/watch?v=hsrkhvKkT8Q', label: { ja: '旅行動画を見る', en: 'Watch the video' } },
    // ],
  },

  {
    title: { en: 'Taiwan study trip' },
    start: '2024-03-04', end: '2024-03-07',
    purpose: ['study'],
    // note: { ja: '台北研修', en: 'A one-week solo trip. Both countries were truly exciting.' },
    city: [
      { country: 'tw', city: { en: 'Taipei' }},
      { country: 'tw', city: { en: 'Taichung' }},
    ],
    stops: [
      { country: 'jp', city: { en: 'Fukuoka (FUK)' }, lat: 33.5902, lng: 130.4017 },
      { country: 'tw', city: { en: 'Taipei (TPE)' }, lat: 25.0733, lng: 121.5313, by: 'plane' },
      { country: 'jp', city: { en: 'Fukuoka (FUK)' }, lat: 33.5902, lng: 130.4017, by: 'plane' },
    ],
    // links: [
    //   { icon: 'fa-brands fa-youtube', href: 'https://www.youtube.com/watch?v=hsrkhvKkT8Q', label: { ja: '旅行動画を見る', en: 'Watch the video' } },
    // ],
  },

  {
    title: { en: 'Solo trip to Thailand & Hong Kong' },
    start: '2023-09-13', end: '2023-09-18',
    purpose: ['sightseeing'],
    // note: { ja: '約1週間の一人旅．とにかく刺激的な国でした．', en: 'A one-week solo trip. Both countries were truly exciting.' },
    city: [
      { country: 'th', city: { en: 'Bangkok' }},
      { country: 'th', city: { en: 'Ayutthaya' }},
      { country: 'hk', city: { en: 'Hong Kong' }},
    ],
    stops: [
      { country: 'jp', city: { en: 'Fukuoka (FUK)' }, lat: 33.5902, lng: 130.4017 },
      { country: 'th', city: { en: 'Bangkok (BKK)' }, lat: 13.7563, lng: 100.5018, by: 'plane' },
      { country: 'hk', city: { en: 'Hong Kong (HKG)' }, lat: 22.3193, lng: 114.1694, by: 'plane' },
      { country: 'jp', city: { en: 'Osaka (KIX)' }, lat: 34.6937, lng: 135.5023, by: 'plane' }
    ],
    // links: [
    //   { icon: 'fa-brands fa-youtube', href: 'https://www.youtube.com/watch?v=hsrkhvKkT8Q', label: { ja: '旅行動画を見る', en: 'Watch the video' } },
    // ],
  },

  {
    title: { en: 'Seoul study trip' },
    start: '2023-03-02', end: '2023-03-04',
    purpose: ['study'],
    // note: { ja: 'ソウル研修', en: 'A one-week solo trip. Both countries were truly exciting.' },
    city: [
      { country: 'kr', city: { en: 'Seoul' }},
    ],
    stops: [
      { country: 'jp', city: { en: 'Fukuoka (FUK)' }, lat: 33.5902, lng: 130.4017 },
      { country: 'kr', city: { en: 'Seoul (ICN)' }, lat: 37.4563, lng: 126.7052, by: 'plane' },
      { country: 'jp', city: { en: 'Fukuoka (FUK)' }, lat: 33.5902, lng: 130.4017, by: 'plane' },
    ],
    // links: [
    //   { icon: 'fa-brands fa-youtube', href: 'https://www.youtube.com/watch?v=hsrkhvKkT8Q', label: { ja: '旅行動画を見る', en: 'Watch the video' } },
    // ],
  },

  {
    title: { en: 'School trip' },
    start: '2018-11-30', end: '2018-12-06',
    purpose: ['study'],
    note: { ja: '修学旅行', en: 'School trip' },
    city: [
      { country: 'sg', city: { en: 'Singapore' }},
      { country: 'au', city: { en: 'Brisbane' }},
      // { country: 'au', city: { en: 'Moreton Island' }},
    ],
    stops: [
      { country: 'jp', city: { en: 'Osaka (KIX)' }, lat: 34.6937, lng: 135.5023, by: 'plane' },
      { country: 'sg', city: { en: 'Singapore (SIN)' }, lat: 1.2903, lng: 103.8520, by: 'plane' },
      { country: 'au', city: { en: 'Brisbane (BNE)' }, lat: -27.4698, lng: 153.0251, by: 'plane' },
      { country: 'sg', city: { en: 'Singapore (SIN)' }, lat: 1.2903, lng: 103.8520, by: 'plane' },
      { country: 'jp', city: { en: 'Osaka (KIX)' }, lat: 34.6937, lng: 135.5023, by: 'plane' },
    ],
    // links: [
    //   { icon: 'fa-brands fa-youtube', href: 'https://www.youtube.com/watch?v=hsrkhvKkT8Q', label: { ja: '旅行動画を見る', en: 'Watch the video' } },
    // ],
  },
];

const COUNTRIES = {
  jp: { ja: '日本', en: 'Japan' },
  us: { ja: 'アメリカ', en: 'United States' },
  kr: { ja: '韓国', en: 'South Korea' },
  tr: { ja: 'トルコ', en: 'Türkiye' },
  eg: { ja: 'エジプト', en: 'Egypt' },
  sg: { ja: 'シンガポール', en: 'Singapore' },
  au: { ja: 'オーストラリア', en: 'Australia' },
  th: { ja: 'タイ', en: 'Thailand' },
  hk: { ja: '香港', en: 'Hong Kong' },
  tw: { ja: '台湾', en: 'Taiwan' },
  cn: { ja: '中国', en: 'China' },
  my: { ja: 'マレーシア', en: 'Malaysia' },
};
