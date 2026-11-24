'use strict';

const TG_BOT_USERNAME = 'autobaron_game_bot';
const ADSGRAM_BLOCK_ID = '61631';

/* =========================================================
   АВТОБАРОН · этап 2
   Строгий симулятор авторынка и автобизнеса
   ========================================================= */


const ICONS = {
  garage: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 16.5V20h16v-3.5"/><path d="M3.6 11l1.7-4a2 2 0 0 1 1.8-1.3h9.8a2 2 0 0 1 1.8 1.3l1.7 4"/><path d="M3.6 11h16.8v5.2H3.6z"/><path d="M7 16.2h.01M17 16.2h.01"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6.4"/><path d="M16 16l4.2 4.2"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M11 4l1.7 4.5L17 10l-4.3 1.5L11 16l-1.7-4.5L5 10l4.3-1.5L11 4z"/><path d="M18 15.4l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9.9-2.3z"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a3.6 3.6 0 0 1 4.9 4.9l-1.6-1.6-3.3 3.3 1.6 1.6a3.6 3.6 0 0 1-4.9-4.9"/><path d="M12.4 13.4L4.6 21.2l-1.8-1.8 7.8-7.8"/></svg>',
  handshake: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12l4-4 3 3 2-2 3 3 3-3 3 3-5 5-3-3-2 2-3-3-5 5z"/></svg>',
  building: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V5.5A1.5 1.5 0 0 1 6.5 4h7A1.5 1.5 0 0 1 15 5.5V21"/><path d="M15 10h2.5A1.5 1.5 0 0 1 19 11.5V21"/><path d="M8 8h4M8 12h4M8 16h4M2.5 21h19"/></svg>',
  megaphone: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10v4a1 1 0 0 0 1 1h2l7 4V5L7 9H5a1 1 0 0 0-1 1z"/><path d="M17.5 9a4 4 0 0 1 0 6"/></svg>',
  scales: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M7 21h10"/><path d="M4 8h16"/><path d="M6.5 8l-2.5 5h5z"/><path d="M17.5 8L15 13h5z"/></svg>',
  truck: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 16.5V6.5h10v10"/><path d="M12.5 9.5h4l3 3v4h-7"/><circle cx="6" cy="18" r="1.7"/><circle cx="17" cy="18" r="1.7"/></svg>',
  glass: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h12l-1.4 6.2A5 5 0 0 1 12 14a5 5 0 0 1-4.6-3.8L6 4z"/><path d="M12 14v6M8.5 20h7"/></svg>',
  lock: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  star: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2.8l2.8 5.7 6.3.9-4.6 4.5 1.1 6.3L12 17.2l-5.6 3l1.1-6.3L2.9 9.4l6.3-.9L12 2.8z"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 1 3.5 10.9c-.6.5-1 1.2-1 2H9.5c0-.8-.4-1.5-1-2A6 6 0 0 1 12 3z"/></svg>',
  car: '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 15.5v3h17v-3"/><path d="M4.5 11l1.8-4.4A2 2 0 0 1 8.2 5.3h7.6a2 2 0 0 1 1.9 1.3L19.5 11"/><path d="M4.5 11h15v4.5h-15z"/><circle cx="7.6" cy="18" r="1.4"/><circle cx="16.4" cy="18" r="1.4"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  muteOn: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.4v5.2h3.3L12.7 19V5L7.3 9.4H4z"/><path d="M16.1 9a4.3 4.3 0 0 1 0 6"/><path d="M18.7 6.4a8.1 8.1 0 0 1 0 11.2"/></svg>',
  muteOff: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.4v5.2h3.3L12.7 19V5L7.3 9.4H4z"/><path d="M16.6 9.6l4.8 4.8M21.4 9.6l-4.8 4.8"/></svg>',
  body: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15.5v3h16v-3"/><path d="M4 11l2-4.2A2 2 0 0 1 7.8 5.5h8.4a2 2 0 0 1 1.8 1.3L20 11"/><path d="M4 11h16v4.5H4z"/></svg>',
  engine: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h2V8h4v2h4l2 2h3v4h-2v2H8v-2H4z"/><path d="M16 10V7h3"/></svg>',
  wash: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 20V9l5-4 5 4v11"/><path d="M10.5 20v-4a1.5 1.5 0 0 1 3 0v4"/><path d="M4 20h16"/></svg>',
  chat: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9h8M8 12.5h5"/></svg>'
};
function ic(name){
  return ICONS[name] || ICONS.search;
}

const SAVE_KEY = 'autobaron_save_v2';
const DIAG_COST = 2000;
const REFRESH_SECONDS = 60;
const START = { money: 180000, rep: 10 };

const bridgeApi = window.bridge || null;
let bridgeOnline = false;
let platformLanguage = 'ru';
let pgPaused = false;
let pgAudioEnabled = true;

let rewardedPending = null;
let rewardedDone = false;
let rewardedOpen = false;
let interstitialOpen = false;
let interstitialPending = null;
let interstitialTouched = false;
let interstitialFallback = 0;
let adShowing = 0;

const VIP_DURATION_MS = 24 * 60 * 60 * 1000;
const VIP_ADS_NEEDED = 5;
let vipModalActive = null;

function vipActive(){
  return !!(state && state.vipExpiresAt && Date.now() < state.vipExpiresAt);
}
function vipLeftText(){
  const ms = Math.max(0, (state.vipExpiresAt || 0) - Date.now());
  const totalMin = Math.ceil(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return isEn() ? (h + 'h ' + m + 'm') : (h + 'ч ' + m + 'м');
}
function pgBlocked(){ return pgPaused || !pgAudioEnabled || adShowing > 0; }
function pgAds(){ return (bridgeOnline && bridgeApi) ? bridgeApi.advertisement : null; }
function refreshAdState(){
  adShowing = (rewardedOpen ? 1 : 0) + (interstitialOpen ? 1 : 0);
  pgApplyAudio();
}
function pgSend(msg){
  if(!bridgeOnline || !bridgeApi || !bridgeApi.platform) return;
  try{
    const request = bridgeApi.platform.sendMessage(msg);
    if(request && request.catch) request.catch(function(){});
  }catch(e){ /* noop */ }
}

const LEAGUES = [
  { n:1, name:'Бюджет',  money:0,         rep:0,  dealer:false, range:'до 800 тыс ₽' },
  { n:2, name:'Комфорт', money:800000,    rep:12, dealer:false, range:'800 тыс – 2,2 млн ₽' },
  { n:3, name:'Бизнес',  money:2200000,   rep:25, dealer:false, range:'2,2 – 5,5 млн ₽' },
  { n:4, name:'Премиум', money:5500000,   rep:40, dealer:true,  range:'5,5 – 14 млн ₽' },
  { n:5, name:'Люкс',    money:14000000,  rep:55, dealer:true,  range:'14 млн ₽ и выше' }
];

const MODEL_COLORS = {
  1: ['#b9c0ca','#7c8593','#2b3441','#4e5a68','#5f3232','#22303f'],
  2: ['#cfd5de','#98a2ae','#1f2733','#3a4655','#4c362b','#1f3a4d'],
  3: ['#dde2e9','#a6aeba','#1a222c','#333d4b','#2e4438','#4a2c2c'],
  4: ['#e5e9ef','#b2bac5','#141a22','#2b3542','#3a2e42','#52302f'],
  5: ['#f0f2f5','#c3cad4','#0f141b','#232d39','#382a38','#542e2e']
};

const MODELS = [
  /* лига 1 — бюджет */
  { id:'granta',   name:'Volgar Start',            type:'sedan', league:1, base:420000,  yMin:2011, yMax:2024, engine:'1.6 AT',       drive:'Передний', power:106, liq:82 },
  { id:'vesta',    name:'Volgar Vesta',             type:'sedan', league:1, base:780000,  yMin:2015, yMax:2025, engine:'1.6 CVT',      drive:'Передний', power:113, liq:80 },
  { id:'niva',     name:'Volgar Terra',       type:'suv',   league:1, base:620000,  yMin:1985, yMax:2025, engine:'1.7 MT',       drive:'4WD',      power:83,  liq:68 },
  { id:'solaris',  name:'Koros Sol',        type:'sedan', league:1, base:700000,  yMin:2010, yMax:2024, engine:'1.6 AT',       drive:'Передний', power:123, liq:84 },
  { id:'rio',      name:'Koros Rio',                type:'hatch', league:1, base:650000,  yMin:2011, yMax:2023, engine:'1.6 AT',       drive:'Передний', power:123, liq:82 },
  { id:'polo',     name:'Nordland Compact',          type:'sedan', league:1, base:690000,  yMin:2010, yMax:2023, engine:'1.6 AT',       drive:'Передний', power:110, liq:80 },
  { id:'logan',    name:'Nordland Base',          type:'sedan', league:1, base:330000,  yMin:2004, yMax:2022, engine:'1.6 MT',       drive:'Передний', power:82,  liq:74 },
  { id:'focus3',   name:'Nordland Focus',           type:'hatch', league:1, base:620000,  yMin:2011, yMax:2019, engine:'1.6 AT',       drive:'Передний', power:125, liq:74 },
  { id:'lancer10', name:'Nippon Arrow',    type:'sedan', league:1, base:720000,  yMin:2007, yMax:2016, engine:'2.0 CVT',      drive:'Передний', power:150, liq:70 },
  { id:'prius30',  name:'Nippon H30',        type:'hatch', league:1, base:790000,  yMin:2009, yMax:2015, engine:'1.8 Hybrid',   drive:'Передний', power:136, liq:72 },
  { id:'nexia',    name:'Volgar Classic',           type:'sedan', league:1, base:230000,  yMin:1995, yMax:2015, engine:'1.5 MT',       drive:'Передний', power:75,  liq:62 },

  /* лига 2 — комфорт */
  { id:'camry50',  name:'Nippon Sail 50',      type:'sedan', league:2, base:1450000, yMin:2011, yMax:2017, engine:'2.5 AT',       drive:'Передний', power:181, liq:86 },
  { id:'octaviaA7',name:'Bohemia Octa A7',       type:'sedan', league:2, base:1350000, yMin:2013, yMax:2020, engine:'1.8 AT',       drive:'Передний', power:180, liq:82 },
  { id:'mazda6',   name:'Nippon Six',                type:'sedan', league:2, base:1400000, yMin:2012, yMax:2019, engine:'2.5 AT',       drive:'Передний', power:192, liq:78 },
  { id:'mark2',    name:'Nippon Crest 100',  type:'sedan', league:2, base:1650000, yMin:1996, yMax:2000, engine:'2.5 AT',       drive:'Задний',   power:280, liq:68 },
  { id:'rav4',     name:'Nippon Trail 4',            type:'suv',   league:2, base:1900000, yMin:2013, yMax:2018, engine:'2.0 CVT',      drive:'4WD',      power:146, liq:86 },
  { id:'sportage', name:'Koros Sport',           type:'suv',   league:2, base:1800000, yMin:2016, yMax:2021, engine:'2.0 AT',       drive:'4WD',      power:150, liq:80 },
  { id:'jolion',   name:'Eastline J1',           type:'suv',   league:2, base:1600000, yMin:2021, yMax:2024, engine:'1.5 DCT',      drive:'Передний', power:143, liq:78 },
  { id:'tiggo7',   name:'Eastline T7',      type:'suv',   league:2, base:1700000, yMin:2020, yMax:2024, engine:'1.5 CVT',      drive:'Передний', power:147, liq:76 },
  { id:'coolray',  name:'Eastline C3',          type:'suv',   league:2, base:1550000, yMin:2019, yMax:2024, engine:'1.5 DCT',      drive:'Передний', power:177, liq:75 },
  { id:'passatB8', name:'Nordland B8',           type:'sedan', league:2, base:2100000, yMin:2015, yMax:2020, engine:'2.0 TDI',      drive:'4WD',      power:190, liq:77 },
  { id:'accord8',  name:'Nippon A8',         type:'sedan', league:2, base:1100000, yMin:2008, yMax:2012, engine:'2.4 AT',       drive:'Передний', power:201, liq:76 },
  { id:'cx5',      name:'Nippon Cross 5',             type:'suv',   league:2, base:1800000, yMin:2017, yMax:2021, engine:'2.5 AT',       drive:'4WD',      power:194, liq:80 },

  /* лига 3 — бизнес */
  { id:'camry70',  name:'Nippon Sail 70',      type:'sedan', league:3, base:2900000, yMin:2018, yMax:2024, engine:'3.5 V6 AT',    drive:'Передний', power:249, liq:84 },
  { id:'bmw320d',  name:'Bavaros B32',           type:'sedan', league:3, base:3500000, yMin:2019, yMax:2024, engine:'2.0d AT',      drive:'Задний',   power:190, liq:82 },
  { id:'c200',     name:'Stuttgard C200',          type:'sedan', league:3, base:3200000, yMin:2014, yMax:2021, engine:'2.0 Turbo AT', drive:'Задний',   power:184, liq:80 },
  { id:'a6c8',     name:'Aurenia A6',             type:'sedan', league:3, base:4200000, yMin:2018, yMax:2023, engine:'2.0 Turbo AT', drive:'4WD',      power:245, liq:78 },
  { id:'monjaro',  name:'Eastline M9',          type:'suv',   league:3, base:3800000, yMin:2022, yMax:2025, engine:'2.0T AT',      drive:'4WD',      power:238, liq:76 },
  { id:'exeedvx',  name:'Eastline VX',               type:'suv',   league:3, base:3700000, yMin:2021, yMax:2025, engine:'2.0T AT',      drive:'4WD',      power:249, liq:72 },
  { id:'tank300',  name:'Eastline T3',               type:'suv',   league:3, base:3300000, yMin:2021, yMax:2025, engine:'2.0T AT',      drive:'4WD',      power:220, liq:79 },
  { id:'prado150', name:'Nippon Ranger 150', type:'suv', league:3, base:4500000, yMin:2010, yMax:2020, engine:'2.8d AT', drive:'4WD', power:177, liq:85 },
  { id:'rx350',    name:'Nippon Lux 350',            type:'suv',   league:3, base:5200000, yMin:2016, yMax:2022, engine:'3.5 V6 AT',    drive:'4WD',      power:301, liq:84 },
  { id:'k5',       name:'Koros K-Five',         type:'sedan', league:3, base:2800000, yMin:2020, yMax:2024, engine:'2.5 AT',       drive:'Передний', power:194, liq:78 },
  { id:'xc60',     name:'Nordland X60',             type:'suv',   league:3, base:4000000, yMin:2018, yMax:2023, engine:'2.0 Turbo AT', drive:'4WD',      power:250, liq:80 },

  /* лига 4 — премиум */
  { id:'x5',       name:'Bavaros X50',             type:'suv',   league:4, base:9500000,  yMin:2019, yMax:2024, engine:'3.0d AT',      drive:'4WD', power:286, liq:84 },
  { id:'eclass',   name:'Stuttgard E-Class',       type:'sedan', league:4, base:7500000,  yMin:2016, yMax:2023, engine:'2.0 Turbo AT', drive:'Задний', power:197, liq:82 },
  { id:'zeekr001', name:'Eastline 001',              type:'sport', league:4, base:7800000,  yMin:2021, yMax:2025, engine:'Электро 544 л.с.', drive:'4WD', power:544, liq:78 },
  { id:'l9',       name:'Eastline L9',             type:'suv',   league:4, base:8500000,  yMin:2022, yMax:2025, engine:'1.5T EREV',    drive:'4WD', power:449, liq:76 },
  { id:'tank500',  name:'Eastline T5',               type:'suv',   league:4, base:7200000,  yMin:2022, yMax:2025, engine:'3.0T AT',      drive:'4WD', power:354, liq:74 },
  { id:'lc300',    name:'Nippon Ranger 300',type:'suv',   league:4, base:11000000, yMin:2021, yMax:2025, engine:'3.5 V6 AT',    drive:'4WD', power:415, liq:88 },
  { id:'macan',    name:'Zuffen M1',          type:'suv',   league:4, base:9000000,  yMin:2019, yMax:2024, engine:'2.0 Turbo AT', drive:'4WD', power:245, liq:83 },
  { id:'rs6',      name:'Aurenia R6',               type:'sport', league:4, base:12500000, yMin:2013, yMax:2019, engine:'4.0 V8 AT',    drive:'4WD', power:560, liq:80 },
  { id:'m3',       name:'Bavaros R3',                 type:'sport', league:4, base:11500000, yMin:2021, yMax:2025, engine:'3.0T AT',      drive:'Задний', power:510, liq:82 },
  { id:'lx570',    name:'Nippon Lux 570',            type:'suv',   league:4, base:13500000, yMin:2008, yMax:2021, engine:'5.7 V8 AT',    drive:'4WD', power:367, liq:86 },

  /* лига 5 — люкс */
  { id:'m5',       name:'Bavaros M5',     type:'sedan', league:5, base:15000000, yMin:2018, yMax:2023, engine:'4.4 V8 AT',    drive:'4WD',      power:625, liq:80 },
  { id:'g63',      name:'Stuttgard G63',       type:'suv',   league:5, base:25000000, yMin:2019, yMax:2024, engine:'4.0 V8 AT',    drive:'4WD',      power:585, liq:84 },
  { id:'911turbo', name:'Zuffen GT-S',    type:'sport', league:5, base:28000000, yMin:2020, yMax:2024, engine:'3.8 PDK',      drive:'4WD',      power:650, liq:86 },
  { id:'rra',      name:'Albion Ranger', type:'suv', league:5, base:26000000, yMin:2022, yMax:2025, engine:'4.4 V8 AT',   drive:'4WD',      power:530, liq:82 },
  { id:'urus',     name:'Italica U1',       type:'suv',   league:5, base:30000000, yMin:2018, yMax:2023, engine:'4.0 V8 AT',    drive:'4WD',      power:650, liq:80 },
  { id:'bentley',  name:'Albion GT', type:'lux',   league:5, base:32000000, yMin:2018, yMax:2023, engine:'6.0 W12 AT',   drive:'4WD',      power:635, liq:78 },
  { id:'f8',       name:'Italica V8',             type:'sport', league:5, base:38000000, yMin:2019, yMax:2023, engine:'3.9 V8 DCT',   drive:'Задний',   power:720, liq:84 },
  { id:'ghost',    name:'Albion Sovereign',      type:'lux',   league:5, base:45000000, yMin:2020, yMax:2024, engine:'6.75 V12 AT',  drive:'Задний',   power:571, liq:82 }
];

const TYPE_LABEL = { sedan:'Седан', hatch:'Хэтчбек', suv:'Внедорожник', sport:'Спорткар', lux:'Люкс' };

const BUYERS = ['Артём','Дмитрий','Сергей','Марина','Олег','Ирина','Виктор','Алексей','Кристина','Роман','Максим','Елена','Павел','Анна','Тимур','Ольга'];
const SELLER_INTRO = [
  'Машина обслужена, вложений не требует. Торг возможен при быстром выкупе.',
  'Авто не битое, все работы по регламенту. Смотрите, торопитесь.',
  'Продаю срочно, поэтому готов обсудить цену.',
  'Состояние хорошее, всё работает. Серьёзным покупателям уступлю.'
];
const OFFER_LINES = [
  'Готов забрать сегодня, если договоримся.',
  'Торг возможен? Возьму сразу.',
  'Куда приезжать на осмотр?',
  'Машина не битая? Тогда беру.',
  'Предоплату внесу сразу, обсудим цену.',
  'Долго искал именно такую, готов брать.'
];
const BUYER_REFUSE = ['Нет, за такую цену не отдам.', 'Это слишком низко.', 'Не готов так сильно уступать.', 'Подожду другого покупателя.'];
const BUYERS_EN = ['Alex', 'Olivia', 'Mike', 'Sarah', 'David', 'Emma', 'Chris', 'Anna'];
const SELLER_INTRO_EN = [
  'Serviced on time, no extra investment needed. Open to offers for a fast sale.',
  'Clean car, all work done by the book. Take a look, it will go fast.',
  'Selling urgently, so the price is negotiable.',
  'Good condition, everything works. Serious buyers get a fair deal.'
];
const OFFER_LINES_EN = [
  'Open to offers? Ready to buy today.',
  'Can pay deposit right away — what is your best price?',
  'Cash in hand today, can pick it up.',
  'Any room to negotiate?',
  'Looking for a clean daily driver — is it available?',
  'Been searching for this one, ready to deal.'
];
const BUYER_REFUSE_EN = ['No, I will not sell at that price.', 'That is too low.', 'Not ready to drop that much.', 'I will wait for another buyer.'];
function pickBuyer(){ return choice(isEn() ? BUYERS_EN : BUYERS); }
function pickSellerIntro(){ return choice(isEn() ? SELLER_INTRO_EN : SELLER_INTRO); }
function pickOfferLine(){ return choice(isEn() ? OFFER_LINES_EN : OFFER_LINES); }
function pickRefuse(){ return choice(isEn() ? BUYER_REFUSE_EN : BUYER_REFUSE); }

const BARGAIN_OPTS = [
  { id:'polite', label:'Готов забрать сегодня — уступите?', text:'Готов забрать сегодня, если немного уступите по цене.', base:0.52, disc:[5,10] },
  { id:'facts',  label:'Вот что я нашёл в машине',          text:'Я посмотрел машину внимательно: есть вопросы по состоянию. Давайте адекватную цену.', base:0.34, disc:[8,15] },
  { id:'hard',   label:'Больше этой цены авто не стоит',    text:'Больше этой суммы машина не стоит. Забираю сейчас или ищу дальше.', base:0.26, disc:[10,15] }
];

const PREP_LABEL = { wash:'Мойка и полировка', body:'Ремонт кузова', engine:'Капиталка двигателя' };

const UPGRADES = [
  { key:'garage', name:'Расширение гаража', max:9, base:100000, growth:1.6, icon:'garage',
    desc:'Дополнительные машиноместа для оборота.',
    effect:l => 'Мест в гараже: ' + (1 + l) + ' из 10',
    next:l => 'Следующий уровень: ' + (2 + l) + ' мест' },
  { key:'tools', name:'Толщиномер и эндоскоп', max:10, base:150000, growth:1.55, icon:'search',
    desc:'Инструмент для проверки кузова, мотора и пробега.',
    effect:l => l >= 8 ? 'Осмотр полностью раскрывает мотор, кузов, документы и пробег'
      : l === 0 ? 'Базовый осмотр: только внешний вид и документы'
      : 'Осмотр: диапазон ±' + Math.max(3, 14 - l) + '% · история обслуживания подтверждается с шансом ' + (20 + l * 7) + '%',
    next:l => l + 1 >= 8 ? 'Следующий уровень: полное раскрытие скрытых дефектов'
      : 'Следующий уровень: ±' + Math.max(3, 13 - l) + '% · шанс подтвердить историю ' + (27 + l * 7) + '%' },
  { key:'detail', name:'Детейлинг-студия', max:10, base:180000, growth:1.55, icon:'sparkle',
    desc:'Собственная мойка, полировка и предпродажная подготовка.',
    effect:l => 'Мойка −' + Math.min(50, l * 5) + '% · наценка при продаже +' + (l * 1.5).toFixed(1) + '%',
    next:l => 'Следующий уровень: мойка −' + Math.min(50, (l + 1) * 5) + '% · наценка +' + ((l + 1) * 1.5).toFixed(1) + '%' },
  { key:'service', name:'Автосервис и подъёмник', max:10, base:220000, growth:1.55, icon:'wrench',
    desc:'Свой цех: дешевле и качественнее ремонт двигателя и кузова.',
    effect:l => 'Ремонт −' + Math.min(50, l * 5) + '% · восстановление +' + (l * 2) + ' пункта',
    next:l => 'Следующий уровень: ремонт −' + Math.min(50, (l + 1) * 5) + '% · восстановление +' + ((l + 1) * 2) + ' пункта' },
  { key:'brand', name:'Переговоры и личный бренд', max:10, base:160000, growth:1.55, icon:'handshake',
    desc:'Репутация усиливает давление на цену в обе стороны.',
    effect:l => 'Шанс успешного торга +' + (l * 2) + ' п.п.',
    next:l => 'Следующий уровень: шанс торга +' + ((l + 1) * 2) + ' п.п.' },
  { key:'dealer', name:'Официальный автосалон', max:10, base:2000000, growth:1.42, icon:'building',
    desc:'Статус открывает элитные лиги и доступ к VIP-клиентам.',
    effect:l => l === 0 ? 'Лиги 4–5 закрыты, VIP-покупатели недоступны'
      : 'Лиги 4–5 открыты · VIP-наценка +' + (10 + l * 2) + '%',
    next:l => l === 0 ? 'Следующий уровень: лиги 4–5 и VIP-офферы +12%'
      : 'Следующий уровень: VIP-наценка +' + (12 + l * 2) + '%' },
  { key:'marketing', name:'Маркетинг и PR', max:10, base:200000, growth:1.55, icon:'megaphone',
    desc:'Рекламные кампании ускоряют поток покупателей в гараже.',
    effect:l => 'Офферы быстрее на ' + Math.min(65, l * 7) + '% · VIP-шанс +' + (l * 2) + '%',
    next:l => 'Следующий уровень: офферы быстрее на ' + Math.min(65, (l + 1) * 7) + '% · VIP-шанс +' + ((l + 1) * 2) + '%' },
  { key:'legal', name:'Юридический отдел', max:10, base:260000, growth:1.55, icon:'scales',
    desc:'Проверка ПТС, залогов и ограничений до сделки.',
    effect:l => l === 0 ? 'Документы проверяются только платной диагностикой'
      : 'Автопроверка ПТС · штраф проблемных документов −' + Math.min(100, l * 18) + '%',
    next:l => l === 0 ? 'Следующий уровень: автопроверка ПТС и залогов'
      : 'Следующий уровень: штраф документов −' + Math.min(100, (l + 1) * 18) + '%' },
  { key:'buyout', name:'Служба выкупа и эвакуации', max:10, base:200000, growth:1.55, icon:'truck',
    desc:'Быстрый выкуп и эвакуация дают скидку у продавцов.',
    effect:l => l === 0 ? 'Покупка по цене продавца' : 'Скидка на покупку ' + buyoutPct(l) + '%',
    next:l => 'Следующий уровень: скидка на покупку ' + buyoutPct(l + 1) + '%' },
  { key:'lounge', name:'VIP-лаунж и кредитный брокер', max:10, base:300000, growth:1.55, icon:'glass',
    desc:'Покупатели берут авто в кредит дороже рынка.',
    effect:l => 'Цена продажи +' + (l * 3) + '%',
    next:l => 'Следующий уровень: цена продажи +' + ((l + 1) * 3) + '%' }
];

function buyoutPct(lvl){
  const l = typeof lvl === 'number' ? lvl : upg('buyout');
  return l > 0 ? Math.min(15, 1 + l * 1.5) : 0;
}

function buyPrice(l){
  const pct = buyoutPct();
  return Math.round(l.ask * (1 - pct / 100) / 1000) * 1000;
}

const ACHIEVEMENTS = [
  { id:'league2', tag:'Новый рынок', title:'Лига 2 открыта', test:() => leagueUnlocked(2),
    text:'Капитал и репутация вывели вас на комфорт-класс. На рынке появились свежие лоты.',
    perks:['Nippon Sail 50, Bohemia Octa A7, Nippon Six, Nippon Crest 100, Nippon Trail 4, Koros Sport, Eastline J1, Eastline T7, Eastline C3, Nordland B8',
      'Лимит торга повышен на 5%', 'Больше предложений в каждой ленте'] },
  { id:'league3', tag:'Новый рынок', title:'Лига 3 открыта', test:() => leagueUnlocked(3),
    text:'Бизнес-класс и кроссоверы теперь доступны для выкупа и перепродажи.',
    perks:['Nippon Sail 70, Bavaros B32, Stuttgard C200, Aurenia A6, Eastline M9, Eastline VX, Eastline T3, Nippon Ranger 150, Nippon Lux 350, Koros K-Five',
      'Доступ к закрытым лотам дилеров', 'Лимит торга повышен на 10%'] },
  { id:'league4', tag:'Элитный рынок', title:'Лига 4 открыта', test:() => leagueUnlocked(4),
    text:'Премиальные автомобили и спорткары вышли на ваш рынок.',
    perks:['Bavaros X50, Stuttgard E-Class, Eastline 001, Eastline L9, Eastline T5, Nippon Ranger 300, Zuffen M1, Aurenia R6, Bavaros R3, Nippon Lux 570',
      'VIP-покупатели с наценкой', 'Лимит торга повышен на 15%'] },
  { id:'league5', tag:'Элитный рынок', title:'Лига 5 открыта', test:() => leagueUnlocked(5),
    text:'Люкс и гиперкары. Вы играете в высшей лиге авторынка.',
    perks:['Bavaros M5, Stuttgard G63, Zuffen GT-S, Albion Ranger, Italica U1, Albion GT, Italica V8, Albion Sovereign',
      'Максимальная наценка на закрытых лотах', 'Эксклюзивные предложения каждый час'] },
  { id:'million', tag:'Бизнес-этап', title:'Первый миллион капитала', test:() => (state.stats.maxMoney || 0) >= 1000000, rewardRep:3,
    text:'Пиковый капитал достиг 1 000 000 ₽. Банк начинает разговаривать с вами иначе.',
    perks:['Репутация +3', 'Доступ к лотам дороже миллиона', 'Персональные условия выкупа'] },
  { id:'sold10', tag:'Бизнес-этап', title:'10 успешных сделок', test:() => state.stats.sold >= 10, rewardRep:5,
    text:'Десять закрытых сделок. Вы перестали быть новичком и стали перекупщиком.',
    perks:['Репутация +5', 'Продавцы уступают охотнее', 'Приоритет в очереди офферов'] },
  { id:'sold50', tag:'Бизнес-этап', title:'50 успешных сделок', test:() => state.stats.sold >= 50, rewardRep:10,
    text:'Пятьдесят сделок. Ваше имя знают на всем рынке.',
    perks:['Репутация +10', 'Статус «Магнат авторынка»', 'Максимальный приоритет у продавцов'] },
  { id:'dealer', tag:'Бизнес-этап', title:'Собственный автосалон', test:() => upg('dealer') > 0, rewardRep:5,
    text:'Статус официального автосалона открывает элитные лиги и VIP-клиентов.',
    perks:['Репутация +5', 'Лиги 4–5 и закрытые лоты', 'VIP-офферы с наценкой'] }
];

let achQueue = [];
let achOpen = false;

function medalSVG(){
  return '<svg viewBox="0 0 80 80" width="76" height="76" aria-hidden="true">' +
    '<defs>' +
      '<linearGradient id="achGold" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#fef3c7"/><stop offset=".4" stop-color="#fbbf24"/>' +
        '<stop offset=".75" stop-color="#b45309"/><stop offset="1" stop-color="#fde68a"/>' +
      '</linearGradient>' +
      '<linearGradient id="achRing" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#34d399"/><stop offset="1" stop-color="#065f46"/>' +
      '</linearGradient>' +
      '<radialGradient id="achGlow" cx=".35" cy=".25" r=".8">' +
        '<stop offset="0" stop-color="#ffffff" stop-opacity=".35"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>' +
      '</radialGradient>' +
    '</defs>' +
    '<circle cx="40" cy="40" r="33" fill="#0b0e14" opacity=".7"/>' +
    '<circle cx="40" cy="40" r="30" fill="url(#achRing)" opacity=".16"/>' +
    '<circle cx="40" cy="40" r="29" fill="#11161f" stroke="url(#achGold)" stroke-width="2"/>' +
    '<circle cx="40" cy="40" r="24" fill="url(#achGlow)"/>' +
    '<path d="M40 20 L45.3 32.6 L58.8 34 L48.6 43.2 L51.5 56.5 L40 49.7 L28.5 56.5 L31.4 43.2 L21.2 34 L34.7 32.6 Z" fill="url(#achGold)"/>' +
    '<path d="M18 62 A28 28 0 0 1 12 40" fill="none" stroke="url(#achGold)" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>' +
    '<path d="M62 62 A28 28 0 0 0 68 40" fill="none" stroke="url(#achGold)" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>' +
    '<circle cx="40" cy="40" r="30" fill="url(#achGlow)"/>' +
  '</svg>';
}

function sfxAchievement(){
  if(isMuted) return;
  const notes = [392, 523, 659, 784, 1046];
  notes.forEach(function(n, i){ tone(n, 0.55, 'triangle', 0.042, i * 0.085); });
  tone(196, 0.9, 'sine', 0.035, 0);
  tone(1318, 0.5, 'sine', 0.018, 0.42);
}

function checkAchievements(){
  let unlocked = false;
  ACHIEVEMENTS.forEach(function(a){
    if(state.ach.indexOf(a.id) !== -1) return;
    if(!a.test()) return;
    state.ach.push(a.id);
    if(a.rewardRep) state.rep = Math.min(100, state.rep + a.rewardRep);
    achQueue.push(a);
    unlocked = true;
  });
  if(unlocked){
    save();
    updateHeader();
  }
  if(!achOpen && achQueue.length) showAchievement(achQueue.shift());
}

function showAchievement(a){
  const root = $('achRoot');
  if(!root){ achQueue = []; return; }
  achOpen = true;
  root.innerHTML = '<div class="ach-backdrop" data-action="close-achievement"></div>' +
    '<div class="ach-modal" role="dialog" aria-modal="true">' +
      '<div class="ach-medal">' + medalSVG() + '</div>' +
      '<div class="ach-kicker">' + a.tag + '</div>' +
      '<h2 class="ach-title">' + a.title + '</h2>' +
      '<p class="ach-text">' + a.text + '</p>' +
      '<div class="ach-perks">' + a.perks.map(function(p){
        return '<div class="ach-perk"><span class="ach-check">' + ic('check') + '</span><span>' + p + '</span></div>';
      }).join('') + '</div>' +
      '<button class="btn ach-btn" data-action="close-achievement">Отлично!</button>' +
    '</div>';
  root.classList.add('open');
  document.body.style.overflow = 'hidden';
  syncModalLock();
  sfxAchievement();
}

function closeAchievement(){
  achOpen = false;
  const root = $('achRoot');
  if(root){ root.classList.remove('open'); root.innerHTML = ''; }
  syncModalLock();
  if(achQueue.length) setTimeout(function(){ if(!achOpen && achQueue.length) showAchievement(achQueue.shift()); }, 280);
}

/* ---------------- Состояние ---------------- */
let state;
let modal = null;
let audioCtx = null;
let isMuted = false;
let shownMoney = null;
let persistenceReady = false;
let pendingSave = false;
let emblemSeq = 0;
let chartSeq = 0;

function defaultState(){
  return {
    money: START.money,
    rep: START.rep,
    tab: 'market',
    filter: 0,
    cars: [],
    listings: [],
    muted: false,
    marketIn: REFRESH_SECONDS,
    adBonus: false,
    upgrades: { garage:0, tools:0, detail:0, service:0, brand:0, dealer:0, marketing:0, legal:0, buyout:0, lounge:0 },
    ach: [],
    vipExpiresAt: 0,
    vipAds: 0,
    auction: null,
    auctionIn: 120,
    news: null,
    newsIn: 180,
    stats: { sold:0, bought:0, profit:0, best:0, maxMoney:START.money },
    uid: 1,
    ver: 2
  };
}

/* ---------------- Утилиты ---------------- */
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rndInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const choice = arr => arr[Math.floor(Math.random() * arr.length)];
const modelOf = id => MODELS.find(m => m.id === id) || MODELS[0];
const findCar = uid => state.cars.find(c => c.uid === uid);
const findListing = id => state.listings.find(l => l.id === id);
const condClass = v => v >= 75 ? 'good' : v >= 50 ? 'warn' : 'bad';
const upg = key => state.upgrades[key] || 0;
const capacity = () => 1 + upg('garage');

function money(n){
  if(isEn()) return usdMoney(n);
  return (n < 0 ? '−' : '') + locNum(Math.abs(n)) + ' ' + cur();
}
function moneyShort(n){
  const sign = n < 0 ? '−' : '';
  const a = Math.abs(n);
  if(isEn()){
    const v = usdValue(n);
    if(v >= 1e6) return sign + '$' + (v / 1e6).toFixed(v >= 1e7 ? 1 : 2).replace(/\.0+$/, '') + 'M';
    return sign + '$' + v.toLocaleString('en-US');
  }
  if(a >= 1e9) return sign + (a / 1e9).toFixed(2).replace('.', isEn() ? '.' : ',') + (isEn() ? 'B ' + cur() : ' млрд ₽');
  if(a >= 1e6) return sign + (a / 1e6).toFixed(a >= 1e7 ? 1 : 2).replace('.', isEn() ? '.' : ',') + (isEn() ? 'M ' + cur() : ' млн ₽');
  return sign + locNum(a) + ' ' + cur();
}
function locNum(n){ return Math.round(n).toLocaleString(isEn() ? 'en-US' : 'ru-RU'); }
function usdValue(n){
  const a = Math.abs(n) / 90;
  if(a >= 5000) return Math.round(a / 50) * 50;
  if(a >= 1000) return Math.round(a / 10) * 10;
  if(a >= 100) return Math.round(a / 5) * 5;
  return Math.round(a);
}
function usdMoney(n){
  return (n < 0 ? '−' : '') + '$' + usdValue(n).toLocaleString('en-US');
}
function isEn(){ return !!(window.I18N && I18N.lang === 'en'); }
function cur(){ return isEn() ? '$' : '₽'; }
function driveText(v){ return (window.I18N && isEn()) ? I18N.t(v) : v; }
function num(n){ return locNum(n); }
function km(n){ return num(n) + (isEn() ? ' km' : ' км'); }
function timerText(sec){
  const v = Math.max(0, Math.round(sec));
  const m = Math.floor(v / 60);
  const s = v % 60;
  return m + ':' + (s < 10 ? '0' + s : s);
}

function carValue(car){
  const m = modelOf(car.modelId);
  const q = 0.58 * car.visual + 0.27 * car.engine + 0.15 * car.body;
  let v = m.base * (0.5 + 0.5 * (q / 100));
  v *= 1 - Math.min(0.2, Math.max(0, (car.mileage - 120000) / 420000));
  if(car.docs < 50) v *= Math.min(1, 0.82 + upg('legal') * 0.018);
  if(car.noHistory) v *= 0.96;
  if(car.year && car.year < 2000) v *= 0.94;
  v *= newsFactor(m);
  return Math.round(v / 1000) * 1000;
}

function leagueUnlocked(n){
  const L = LEAGUES[n - 1];
  if(!L) return false;
  if(L.money > (state.stats.maxMoney || 0)) return false;
  if(L.rep > state.rep) return false;
  if(L.dealer && upg('dealer') < 1) return false;
  return true;
}

/* ---------------- Звук ---------------- */
function ensureAudio(){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }catch(e){ return null; }
}
function unlockAudio(){
  const ctx = ensureAudio();
  if(!ctx) return Promise.resolve(null);
  if(ctx.state === 'suspended' || ctx.state === 'interrupted'){
    return ctx.resume().then(function(){ return ctx; }).catch(function(){ return ctx; });
  }
  return Promise.resolve(ctx);
}
function tone(freq, dur, type, gain, delay, endFreq){
  if(isMuted || pgBlocked()) return;
  const ctx = ensureAudio();
  if(!ctx) return;
  const play = function(){
    try{
      const t0 = ctx.currentTime + (delay || 0);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      if(endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(gain || 0.035, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.03);
    }catch(e){ /* noop */ }
  };
  if(ctx.state === 'suspended' || ctx.state === 'interrupted'){
    ctx.resume().then(play).catch(function(){});
  }else{
    play();
  }
}
function sfxClick(){ if(isMuted) return; tone(620, 0.04, 'triangle', 0.025); }
function sfxCoin(){ if(isMuted) return; tone(1046, 0.1, 'triangle', 0.04); tone(1568, 0.15, 'triangle', 0.032, 0.06); tone(2093, 0.2, 'sine', 0.024, 0.12); }
function sfxError(){ if(isMuted) return; tone(165, 0.16, 'sawtooth', 0.025); }
function sfxBuy(){ if(isMuted) return; tone(392, 0.09, 'sine', 0.04); tone(523, 0.09, 'sine', 0.04, 0.09); tone(659, 0.18, 'sine', 0.04, 0.18); }

function resumeAudio(){
  if(isMuted || pgBlocked()) return;
  unlockAudio();
}
document.addEventListener('visibilitychange', function(){
  if(document.visibilityState === 'visible') resumeAudio();
});
window.addEventListener('pageshow', resumeAudio);
document.addEventListener('touchstart', resumeAudio, { passive: true });
document.addEventListener('pointerdown', resumeAudio, { passive: true });

/* ---------------- Тикет автомобиля ---------------- */
const LEGAL_ISSUES = ['Дубликат ПТС','Залог у банка','Ограничение регистрации','Расхождение VIN'];
const TICKET_TYPE = { sedan:'СЕДАН', hatch:'ХЭТЧБЕК', suv:'КРОССОВЕР', sport:'СПОРТКАР', lux:'ЛЮКС' };

function hashString(str){
  let h = 2166136261;
  for(let i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function sparkSeries(seed){
  let h = hashString(String(seed)) || 1;
  const out = [];
  let v = 46 + (h % 9);
  for(let i = 0; i < 12; i++){
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    v = clamp(48 + (v - 48) * 0.55 + ((h % 13) - 6), 20, 80);
    out.push(Math.round(v));
  }
  return out;
}

function chartHTML(series, up, base){
  const color = up ? '#10b981' : '#f59e0b';
  const n = series.length;
  const w = 300, h = 84, x0 = 1, x1 = 299, y0 = 8, y1 = 76;
  const prices = series.map(function(v){ return Math.max(1000, base * (0.9 + (v - 50) / 100 * 0.28)); });
  const min = Math.min.apply(null, prices);
  const max = Math.max.apply(null, prices);
  const avg = prices.reduce(function(a, b){ return a + b; }, 0) / n;
  const span = Math.max(1, max - min);
  const pts = prices.map(function(p, i){
    return [x0 + i * (x1 - x0) / (n - 1), y1 - (p - min) / span * (y1 - y0)];
  });
  const line = pts.map(function(p, i){ return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
  const area = line + ' L ' + x1 + ' ' + y1 + ' L ' + x0 + ' ' + y1 + ' Z';
  const gid = 'chart' + (chartSeq++);

  let marks = [];
  for(let i = 1; i < n - 1; i++){
    if((prices[i] - prices[i - 1]) * (prices[i + 1] - prices[i]) < 0) marks.push(i);
  }
  if(marks.length > 4){
    marks = [prices.indexOf(min), prices.indexOf(max), n - 1];
  }
  if(marks.indexOf(n - 1) === -1) marks.push(n - 1);

  const dots = marks.map(function(i){
    const p = pts[i];
    return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="6" fill="' + color + '" opacity=".13"/>' +
      '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="2.1" fill="' + color + '" stroke="#0b0e14" stroke-width="1"/>';
  }).join('');

  return '<div class="chart" style="--c:' + color + '">' +
    '<div class="chart-scale">' +
      '<span>' + moneyShort(max) + '</span>' +
      '<span>' + moneyShort(avg) + '</span>' +
      '<span>' + moneyShort(min) + '</span>' +
    '</div>' +
    '<div class="chart-main">' +
      '<div class="chart-plot">' +
        '<svg class="chart-svg" viewBox="0 0 300 84" width="100%" height="64" preserveAspectRatio="none" aria-hidden="true">' +
          '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="' + color + '" stop-opacity=".38"/>' +
            '<stop offset="1" stop-color="' + color + '" stop-opacity="0"/>' +
          '</linearGradient></defs>' +
          '<g stroke="rgba(255,255,255,.06)" stroke-width="1">' +
            '<line x1="0" y1="' + y0 + '" x2="300" y2="' + y0 + '"/>' +
            '<line x1="0" y1="' + ((y0 + y1) / 2) + '" x2="300" y2="' + ((y0 + y1) / 2) + '"/>' +
            '<line x1="0" y1="' + y1 + '" x2="300" y2="' + y1 + '"/>' +
          '</g>' +
          '<path d="' + area + '" fill="url(#' + gid + ')"/>' +
          '<path class="chart-line" d="' + line + '" fill="none" stroke="' + color + '" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' +
          dots +
        '</svg>' +
      '</div>' +
      '<div class="chart-x"><span>−6 мес</span><span>−3 мес</span><span>Сегодня</span></div>' +
    '</div>' +
  '</div>';
}

function hexTint(hex, alpha){
  const h = String(hex || '#9aa4b2').replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(function(c){ return c + c; }).join('') : h, 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + alpha + ')';
}

const BRAND_STYLE = {
  'Volgar':      { mono:'VOLGAR',   c1:'#93c5fd', c2:'#12306b' },
  'Koros':       { mono:'KOROS',    c1:'#fca5a5', c2:'#7f1d1d' },
  'Nordland':    { mono:'NORD',     c1:'#bfdbfe', c2:'#123a86' },
  'Nippon':      { mono:'NIPPON',   c1:'#fca5a5', c2:'#7f1d1d' },
  'Eastline':    { mono:'EAST',     c1:'#6ee7b7', c2:'#065f46' },
  'Bavaros':     { mono:'BAVAROS',  c1:'#bfdbfe', c2:'#16327a' },
  'Stuttgard':   { mono:'STG',      c1:'#e5e7eb', c2:'#2c3441' },
  'Aurenia':     { mono:'AURENIA',  c1:'#e2e8f0', c2:'#3b4554' },
  'Bohemia':     { mono:'BOHEMIA',  c1:'#86efac', c2:'#14532d' },
  'Zuffen':      { mono:'ZUFFEN',   c1:'#fde68a', c2:'#7f1d1d' },
  'Albion':      { mono:'ALBION',   c1:'#f8fafc', c2:'#2c3441' },
  'Italica':     { mono:'ITALICA',  c1:'#fde047', c2:'#7f1d1d' }
};

function brandBadge(name){
  const first = name.split(' ')[0];
  const base = BRAND_STYLE[first];
  if(base) return base;
  return { mono: first.slice(0, 3).toUpperCase(), c1:'#cbd5e1', c2:'#334155' };
}

function emblemSVG(model){
  const meta = brandBadge(model.name);
  const id = 'bd' + (emblemSeq++);
  const gid = 'bg' + id;
  const chromeId = 'ch' + id;
  const glowId = 'gw' + id;
  const mono = meta.mono;
  const len = mono.length;
  const fs = len <= 2 ? 17 : len === 3 ? 14 : len === 4 ? 11.4 : len === 5 ? 10 : 8.8;
  const ls = len <= 3 ? 0.4 : 0.15;
  return '<svg class="emblem-svg" viewBox="0 0 52 52" aria-hidden="true">' +
    '<defs>' +
      '<linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="' + meta.c1 + '"/>' +
        '<stop offset=".48" stop-color="' + meta.c2 + '"/>' +
        '<stop offset="1" stop-color="#070a0f"/>' +
      '</linearGradient>' +
      '<linearGradient id="' + chromeId + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="#c3ccda"/>' +
        '<stop offset=".7" stop-color="#5a6577"/><stop offset="1" stop-color="#e2e8f0"/>' +
      '</linearGradient>' +
      '<radialGradient id="' + glowId + '" cx=".3" cy=".18" r=".85">' +
        '<stop offset="0" stop-color="#ffffff" stop-opacity=".30"/>' +
        '<stop offset=".55" stop-color="#ffffff" stop-opacity=".05"/>' +
        '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/>' +
      '</radialGradient>' +
    '</defs>' +
    '<circle cx="26" cy="26" r="24.5" fill="rgba(0,0,0,.45)"/>' +
    '<circle cx="26" cy="26" r="24" fill="url(#' + gid + ')"/>' +
    '<circle cx="26" cy="26" r="24" fill="url(#' + glowId + ')"/>' +
    '<circle cx="26" cy="26" r="23.3" fill="none" stroke="url(#' + chromeId + ')" stroke-width="1.4"/>' +
    '<circle cx="26" cy="26" r="21.4" fill="none" stroke="rgba(255,255,255,.10)" stroke-width=".8"/>' +
    '<path d="M11.2 16.5 A17.6 17.6 0 0 1 25.6 7.6" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.7" stroke-linecap="round"/>' +
    '<text x="26" y="27.6" text-anchor="middle" dominant-baseline="middle" font-family="Inter,Arial,sans-serif" font-size="' + fs + '" font-weight="800" letter-spacing="' + ls + '" fill="rgba(0,0,0,.5)">' + mono + '</text>' +
    '<text x="26" y="27" text-anchor="middle" dominant-baseline="middle" font-family="Inter,Arial,sans-serif" font-size="' + fs + '" font-weight="800" letter-spacing="' + ls + '" fill="#f8fafc">' + mono + '</text>' +
  '</svg>';
}

function ticketHeader(m, opts){
  opts = opts || {};
  const series = sparkSeries(m.id + (opts.year || ''));
  const rawTrend = (series[series.length - 1] - series[0]) / Math.max(1, series[0]) * 100;
  let trend = Math.round(6.8 * Math.tanh(rawTrend / 6.8) * 10) / 10;
  if(Math.abs(trend) < 0.3) trend = rawTrend >= 0 ? 0.4 : -0.4;
  const up = trend >= 0;
  const typeLabel = TICKET_TYPE[m.type] || TYPE_LABEL[m.type].toUpperCase();
  const tags = '<span class="ticket-tag">' + typeLabel + '</span>' +
    '<span class="ticket-tag">ЛИГА ' + m.league + '</span>' +
    (opts.badge ? '<span class="ticket-badge">' + opts.badge + '</span>' : '');
  return '<div class="ticket" style="--wash:' + hexTint(opts.color, .18) + ';--tint:' + (opts.color || '#9aa4b2') + '">' +
    '<div class="ticket-left">' +
      '<div class="ticket-emblem">' + emblemSVG(m) + '</div>' +
      '<div class="ticket-name">' + m.name + '</div>' +
      (opts.stack
        ? '<div class="ticket-meta ticket-meta-1">' + (opts.year || '') + (isEn() ? '' : ' г.') + ' · ' + m.engine + '</div>' +
          '<div class="ticket-meta ticket-meta-2">' + driveText(m.drive) + ' · ' + m.power + (isEn() ? ' HP' : ' л.с.') + '</div>'
        : '<div class="ticket-meta ticket-meta-single">' + (opts.year || '') + (isEn() ? '' : ' г.') + ' • ' + m.engine + ' • ' + driveText(m.drive) + ' • ' + m.power + (isEn() ? ' HP' : ' л.с.') + '</div>') +
      '<div class="ticket-tags">' + tags + '</div>' +
    '</div>' +
    '<div class="ticket-right">' +
      '<div class="chart-head">' +
        '<span class="chart-label">Динамика цены</span>' +
        '<span class="ticket-trend ' + (up ? 'up' : 'down') + '">' + (up ? '+' : '') + trend.toFixed(1) + '%</span>' +
      '</div>' +
      chartHTML(series, up, m.base) +
    '</div>' +
  '</div>';
}

function legalState(item, owned){
  const known = !!owned || !!(item.known && item.known.exact) || (upg('legal') > 0 && !!(item.known && item.known.docs));
  if(!known) return { text:'Требует проверки', cls:'warn' };
  if(item.docs >= 85) return { text:'Чисто', cls:'good' };
  if(item.docs >= 60) return { text:'Требует проверки', cls:'warn' };
  return { text: item.legalIssue || 'Ограничения', cls:'bad' };
}

function gauge(label, val, mode, note){
  const num = mode === 'exact' ? val + '%' : mode === 'range' ? '≈ ' + val : '—';
  const cls = mode === 'exact' ? condClass(val) : '';
  const fill = mode === 'exact' ? val : 0;
  return '<div class="gauge">' +
    '<div class="g-head"><span>' + label + '</span><span class="g-num ' + cls + '">' + num + '</span></div>' +
    '<div class="g-bar"><i class="' + cls + '" style="width:' + fill + '%"></i></div>' +
    '<div class="g-note">' + (note || (mode === 'exact' ? (val >= 75 ? 'норма' : val >= 50 ? 'износ' : 'критично') : 'не проверено')) + '</div>' +
  '</div>';
}

function diagGrid(item, owned){
  const known = !!owned || !!(item.known && item.known.exact);
  const approx = (!known && item.approx) ? item.approx : null;
  const engMode = known ? 'exact' : approx ? 'range' : 'hidden';
  const bodMode = known ? 'exact' : approx ? 'range' : 'hidden';
  const engVal = known ? item.engine : approx ? approx.engine[0] + '–' + approx.engine[1] : 0;
  const bodVal = known ? item.body : approx ? approx.body[0] + '–' + approx.body[1] : 0;
  const legal = legalState(item, owned);
  return '<div class="diag-grid">' +
    gauge('Двигатель', engVal, engMode) +
    gauge('Кузов', bodVal, bodMode) +
    '<div class="gauge">' +
      '<div class="g-head"><span>Юр. чистота</span></div>' +
      '<div class="g-val"><span class="legal-badge ' + legal.cls + '">' + legal.text + '</span></div>' +
      '<div class="g-bar"><i class="' + legal.cls + '" style="width:' + (legal.cls === 'good' ? 100 : legal.cls === 'warn' ? 55 : 22) + '%"></i></div>' +
      '<div class="g-note">' + (legal.cls === 'good' ? 'ПТС и залоги' : legal.cls === 'warn' ? 'нужна проверка' : 'есть ограничения') + '</div>' +
    '</div>' +
  '</div>';
}

/* ---------------- Рынок ---------------- */
function pickModel(){
  const unlocked = LEAGUES.filter(l => leagueUnlocked(l.n)).map(l => l.n);
  let poolLeagues = unlocked.length ? unlocked : [1];
  if(state.filter && poolLeagues.indexOf(state.filter) !== -1) poolLeagues = [state.filter];
  const weighted = [];
  poolLeagues.forEach(n => {
    const w = 4 + n * 2;
    for(let i = 0; i < w; i++) weighted.push(n);
  });
  const league = choice(weighted);
  const pool = MODELS.filter(m => m.league === league);
  return choice(pool);
}

function colorFor(model){ return choice(MODEL_COLORS[model.league] || MODEL_COLORS[1]); }

function genListing(forced){
  const model = forced || pickModel();
  const maxYear = Math.min(model.yMax, 2026);
  const year = rndInt(model.yMin, maxYear);
  const age = Math.max(0, 2026 - year);
  const noHistory = age > 6 && Math.random() < 0.14;
  const rate = (model.type === 'sport' || model.league >= 4) ? 7000 : 10500;
  const mileage = Math.max(3000, Math.round((age * rate + rndInt(-12000, 48000)) / 1000) * 1000);
  const displayMileage = mileage;

  const visual = clamp(Math.round(94 - age * 0.85 + rndInt(-16, 8) + (model.league >= 4 ? 4 : 0)), 34, 99);
  const engine = clamp(Math.round(95 - age * 0.72 + rndInt(-14, 6)), 30, 99);
  const body = clamp(Math.round(95 - age * 0.8 + rndInt(-14, 7)), 34, 99);
  const docs = Math.random() < 0.84 ? rndInt(88, 100) : rndInt(22, 68);
  const owners = clamp(1 + Math.floor(age / 7) + rndInt(0, 1), 1, 4);
  const legalIssue = docs < 60 ? choice(LEGAL_ISSUES) : null;

  const probe = { modelId:model.id, year:year, mileage:mileage, visual:visual, engine:engine, body:body, docs:docs, noHistory:noHistory };
  let ask = Math.round(carValue(probe) * (0.86 + Math.random() * 0.2) / 1000) * 1000;
  if(noHistory) ask = Math.round(ask * 0.98 / 1000) * 1000;
  ask = Math.max(ask, 40000);

  return {
    id: 'l' + (state.uid++),
    modelId: model.id,
    year: year,
    mileage: mileage,
    displayMileage: displayMileage,
    visual: visual,
    engine: engine,
    body: body,
    docs: docs,
    legalIssue: legalIssue,
    noHistory: noHistory,
    owners: owners,
    color: colorFor(model),
    ask: ask,
    known: { basic:false, exact:false, docs:false, historySuspect:false },
    approx: null,
    tries: 0,
    agreed: false,
    chat: [{ who:'seller', text: pickSellerIntro() }]
  };
}

function genMarket(){
  state.listings = [];
  for(let i = 0; i < 6; i++) state.listings.push(genListing());

  if(state.money < 2500000 && !state.listings.some(l => l.ask <= state.money * 0.92)){
    const cheapModels = MODELS.filter(m => m.league === 1 && m.base <= 450000);
    const cheap = genListing(choice(cheapModels));
    cheap.ask = Math.max(40000, Math.round(Math.min(cheap.ask, state.money * 0.8) / 1000) * 1000);
    state.listings[rndInt(0, 5)] = cheap;
  }
}

function refreshMarket(manual){
  const cooldown = state.marketIn > 0;
  const bonus = cooldown && !state.adBonus;
  genMarket();
  state.marketIn = REFRESH_SECONDS;
  if(!manual) state.adBonus = false;
  if(manual){
    if(bonus){
      state.adBonus = true;
      state.money += 5000;
      toast('Лента обновлена · бонус за рекламу +5 000 ₽', 'good');
      syncMoney(true);
      sfxCoin();
    }else{
      state.adBonus = false;
      toast('Лента обновлена', 'good');
      sfxClick();
    }
  }
  renderAll();
  save();
}

/* ---------------- Осмотр ---------------- */
function basicInspect(l){
  if(!l || l.known.basic) return;
  l.known.basic = true;
  l.known.docs = true;
  const tools = upg('tools');
  if(tools >= 8){
    l.known.exact = true;
  }else if(tools >= 1){
    const spread = Math.max(3, 14 - tools);
    l.approx = {
      engine: [clamp(l.engine - rndInt(spread, spread + 4), 0, 100), clamp(l.engine + rndInt(spread, spread + 4), 0, 100)],
      body: [clamp(l.body - rndInt(spread, spread + 4), 0, 100), clamp(l.body + rndInt(spread, spread + 4), 0, 100)]
    };
    l.known.historySuspect = l.noHistory && Math.random() < (0.2 + tools * 0.07);
  }else{
    l.known.historySuspect = l.noHistory && Math.random() < 0.2;
  }
  l.chat.push({ who:'sys', text: tools >= 1
    ? 'Осмотр с толщиномером и эндоскопом завершён.'
    : 'Базовый осмотр завершён. Скрытые узлы не проверялись.' });
  toast('Осмотр завершён', 'good');
  sfxClick();
}

function deepInspect(l){
  if(!l || l.known.exact) return;
  if(!vipActive() && state.money < DIAG_COST){ toast('Нужно ' + money(DIAG_COST) + ' на диагностику', 'bad'); sfxError(); return; }
  if(!vipActive()) state.money -= DIAG_COST;
  l.known.basic = true;
  l.known.exact = true;
  l.known.docs = true;
  l.chat.push({ who:'sys', text:'Глубокая диагностика: мотор, кузов, документы и пробег проверены.' });
  toast('Диагностика выявила всё скрытое', 'good');
  sfxCoin();
}

function knownDefects(l){
  return [l.engine < 62, l.body < 62, l.docs < 70, l.noHistory].filter(Boolean).length;
}

function bargainChance(l, opt){
  const defects = knownDefects(l);
  let c = opt.base + state.rep * 0.002 + upg('brand') * 0.02;
  if(opt.id === 'facts') c += l.known.exact ? defects * 0.11 : -0.15;
  if(opt.id === 'polite') c += 0.03;
  if(opt.id === 'hard') c += (l.known.exact ? defects * 0.04 : 0) - 0.05;
  return clamp(c, 0.07, 0.9);
}

function bargain(l, optId){
  if(!l || l.agreed || l.tries >= 3) return;
  const opt = BARGAIN_OPTS.find(o => o.id === optId);
  if(!opt) return;
  l.tries++;
  l.chat.push({ who:'me', text: opt.text });
  if(Math.random() < bargainChance(l, opt)){
    const disc = rndInt(opt.disc[0], opt.disc[1]) / 100;
    const old = l.ask;
    l.ask = Math.max(40000, Math.round(l.ask * (1 - disc) / 1000) * 1000);
    l.agreed = true;
    l.chat.push({ who:'seller', text:'Договорились. Уступаю ' + num(old - l.ask) + ' ₽ — забирайте.' });
    toast('Торг успешен: −' + num(old - l.ask) + ' ₽', 'good');
    sfxCoin();
  }else{
    l.chat.push({ who:'seller', text: pickRefuse() });
    toast('Продавец не уступил', 'bad');
    sfxError();
  }
}

/* ---------------- Покупка ---------------- */
function buyListing(id){
  const l = findListing(id);
  if(!l) return;
  if(state.cars.length >= capacity()){
    toast('Гараж заполнен — расширьте вместимость', 'warn'); sfxError(); return;
  }
  const pay = buyPrice(l);
  if(state.money < pay){ toast('Недостаточно средств', 'bad'); sfxError(); return; }

  state.money -= pay;
  state.stats.bought++;
  addCarFromDeal(l, pay);
  state.listings = state.listings.filter(x => x.id !== id);
  state.listings.push(genListing());
  closeModal();
  setTab('garage');
  syncMoney(true);
  renderAll();
  save();
  toast(modelOf(l.modelId).name + ' — в гараже', 'good');
  sfxBuy();
}

/* ---------------- Подготовка ---------------- */
function prepCost(kind, car){
  const svc = upg('service');
  const det = upg('detail');
  if(kind === 'wash') return Math.round(3000 * (det > 0 ? 0.5 : 1));
  if(kind === 'body') return Math.round((9000 + (100 - car.body) * 520) * (1 - 0.2 * svc) / 100) * 100;
  if(kind === 'engine') return Math.round((24000 + (100 - car.engine) * 760) * (1 - 0.2 * svc) / 100) * 100;
  return 0;
}

function doPrep(uid, kind){
  const car = findCar(uid);
  if(!car) return;
  const cost = prepCost(kind, car);
  if(state.money < cost){ toast('Не хватает ' + money(cost), 'bad'); sfxError(); return; }
  state.money -= cost;
  car.spent += cost;
  const svc = upg('service');
  const det = upg('detail');
  if(kind === 'wash'){
    car.visual = clamp(car.visual + 10 + det * 3, 0, 100);
    car.prep.wash++;
  }else if(kind === 'body'){
    car.body = clamp(car.body + 15 + svc * 4, 0, 100);
    car.visual = clamp(car.visual + 5, 0, 100);
    car.prep.body++;
  }else if(kind === 'engine'){
    car.engine = clamp(car.engine + 13 + svc * 4, 0, 100);
    car.prep.engine++;
  }
  syncMoney(true);
  renderAll();
  save();
  sfxBuy();
  toast('Готово: ' + PREP_LABEL[kind], 'good');
}

/* ---------------- Продажа ---------------- */
function startSale(uid){
  const car = findCar(uid);
  if(!car) return;
  const input = $('salePriceInput');
  const raw = input ? parseFloat(input.value) : 0;
  const price = isEn() ? Math.round((raw || 0) * 90) : (raw || 0);
  if(!price || price < 10000){ toast('Минимальная цена — 10 000 ₽', 'bad'); sfxError(); return; }
  car.sale = { price: Math.round(price / 1000) * 1000, nextIn: offerDelay(car), offers: [] };
  closeModal();
  renderAll();
  save();
  sfxClick();
  toast('Объявление опубликовано', 'good');
}

function offerDelay(car){
  const liq = modelOf(car.modelId).liq;
  const speed = (1 + upg('marketing') * 0.18) * (vipActive() ? 2 : 1);
  return clamp(Math.round((10 - liq / 14 + rndInt(0, 3)) / speed), 1, 10);
}

function makeOffer(car){
  const v = carValue(car);
  const ask = car.sale.price;
  const brand = upg('brand');
  const detail = upg('detail');
  const dealer = upg('dealer');
  const lounge = upg('lounge');
  const marketing = upg('marketing');
  let factor = 0.86 + Math.random() * 0.14 + brand * 0.012 + detail * 0.015 + lounge * 0.03;
  let amount = Math.round(v * factor / 1000) * 1000;
  const vipChance = (dealer > 0 ? 0.3 : 0) + marketing * 0.02;
  const vip = Math.random() < Math.min(0.75, vipChance);
  if(vip) amount = Math.round(amount * (1.15 + dealer * 0.005 + lounge * 0.005) / 1000) * 1000;
  amount = Math.min(amount, Math.round(Math.max(ask, v * 0.6) * 1.35 / 1000) * 1000);
  amount = Math.max(amount, Math.round(v * 0.5 / 1000) * 1000);
  return { id:'o' + (state.uid++), buyer: pickBuyer(), amount: amount, line: pickOfferLine(), vip: vip };
}

function acceptOffer(uid, oid){
  const car = findCar(uid);
  if(!car || !car.sale) return;
  const offer = car.sale.offers.find(o => o.id === oid);
  if(!offer) return;
  const profit = offer.amount - car.spent;
  state.money += offer.amount;
  state.stats.sold++;
  state.stats.profit += profit;
  state.stats.best = Math.max(state.stats.best, profit);
  state.rep = Math.min(100, state.rep + (profit > 0 ? 3 : 1));
  state.cars = state.cars.filter(c => c.uid !== uid);
  closeModal();
  syncMoney(true);
  renderAll();
  save();
  sfxCoin();
  toast('Продано за ' + money(offer.amount) + ' · прибыль ' + (profit >= 0 ? '+' : '') + money(profit), 'good');
}

function counterOffer(uid, oid){
  const car = findCar(uid);
  if(!car || !car.sale) return;
  const offer = car.sale.offers.find(o => o.id === oid);
  if(!offer) return;
  const chance = clamp(0.28 + state.rep * 0.0025 + upg('brand') * 0.02 + (car.sale.price > offer.amount ? 0.1 : 0), 0.1, 0.86);
  if(Math.random() < chance){
    const bump = Math.round(offer.amount * (0.03 + Math.random() * 0.05) / 1000) * 1000;
    offer.amount = Math.min(Math.round(car.sale.price * 1.15 / 1000) * 1000, offer.amount + bump);
    offer.line = 'Добавлю, но это максимум.';
    toast('Покупатель поднял до ' + money(offer.amount), 'good');
    sfxCoin();
  }else{
    car.sale.offers = car.sale.offers.filter(o => o.id !== oid);
    toast('Покупатель отказался торговаться', 'bad');
    sfxError();
  }
  renderAll();
  save();
}

/* ---------------- Бизнес ---------------- */
function upgradeCost(u){
  const lvl = upg(u.key);
  if(lvl >= u.max) return null;
  return Math.round(u.base * Math.pow(u.growth, lvl) / 1000) * 1000;
}

function buyUpgrade(key){
  const u = UPGRADES.find(x => x.key === key);
  if(!u) return;
  const cost = upgradeCost(u);
  if(cost == null) return;
  if(state.money < cost){ toast('Не хватает ' + money(cost - state.money), 'bad'); sfxError(); return; }
  state.money -= cost;
  state.upgrades[key] = upg(key) + 1;
  syncMoney(true);
  renderAll();
  save();
  sfxBuy();
  toast(u.name + ': уровень ' + upg(key), 'good');
}

/* ---------------- Живой рынок: аукционы, новости, реклама, VIP ---------------- */
const AUCTION_DURATION = 45;
const AUCTION_EVERY = [120, 180];
const NEWS_EVERY = [180, 240];
const BOT_NAMES = ['Артём', 'Денис', 'Марат', 'Сергей', 'Олег'];
const BOT_NAMES_EN = ['Denis', 'Alex', 'Mark', 'Victor', 'Sam'];
function botNames(){ return isEn() ? BOT_NAMES_EN : BOT_NAMES; }
const NEWS_TYPES = [
  { kind:'suv',   one:'внедорожники', many:'кроссоверов' },
  { kind:'sedan', one:'седаны',       many:'бизнес-седанов' },
  { kind:'sport', one:'спорткары',    many:'спорткаров' },
  { kind:'hatch', one:'хэтчбеки',     many:'хэтчбеков' },
  { kind:'lux',   one:'люкс-авто',    many:'премиальных авто' }
];

function generateNews(){
  const t = choice(NEWS_TYPES);
  const up = Math.random() < 0.55;
  const pct = up ? rndInt(10, 18) : rndInt(8, 12);
  state.news = {
    kind: t.kind,
    mult: up ? 1 + pct / 100 : 1 - pct / 100,
    until: 180,
    text: up
      ? 'Дефицит ' + t.many + ': цены на ' + t.one + ' +' + pct + '% на 3 минуты'
      : 'Сезонный спад: ' + t.one + ' дешевле на ' + pct + '%'
  };
  state.newsIn = rndInt(NEWS_EVERY[0], NEWS_EVERY[1]);
  toast('Новости рынка: ' + state.news.text, 'warn');
  sfxClick();
}

function newsFactor(m){
  if(!state.news || state.news.until <= 0) return 1;
  return state.news.kind === m.type ? state.news.mult : 1;
}

function makeAuctionLot(){
  let pool = MODELS.filter(function(m){ return leagueUnlocked(m.league) && m.liq >= 78; });
  if(!pool.length) pool = MODELS.filter(function(m){ return m.league === 1; });
  const model = choice(pool);
  const lot = genListing(model);
  const value = carValue(lot);
  lot.start = Math.max(30000, Math.round(value * 0.7 / 1000) * 1000);
  lot.current = lot.start;
  lot.leader = '';
  lot.ends = AUCTION_DURATION;
  lot.nextBot = rndInt(4, 7);
  lot.bots = botNames().slice().sort(function(){ return Math.random() - 0.5; }).slice(0, rndInt(2, 3));
  lot.botName = lot.bots[0];
  lot.auction = true;
  return lot;
}

function startAuction(){
  state.auction = makeAuctionLot();
  state.auctionIn = rndInt(AUCTION_EVERY[0], AUCTION_EVERY[1]);
  toast('Горячий лот: ' + modelOf(state.auction.modelId).name + ' — аукцион начался', 'warn');
  sfxCoin();
  if(state.tab === 'market') renderMarket();
  save();
}

function playerBid(pct){
  const a = state.auction;
  if(!a || a.ends <= 0) return;
  if(state.cars.length >= capacity()){ toast('Нет свободного места в гараже', 'bad'); sfxError(); return; }
  const amount = Math.round(a.current * (1 + pct / 100) / 1000) * 1000;
  if(state.money < amount){ toast('Недостаточно средств для ставки', 'bad'); sfxError(); return; }
  a.current = amount;
  a.leader = 'player';
  a.nextBot = Math.min(a.nextBot || 4, rndInt(2, 5));
  sfxCoin();
  toast('Ваша ставка: ' + money(amount), 'good');
  renderAll();
  save();
}

function botBid(a){
  const value = carValue(a);
  if(a.current >= value * 0.95){ a.nextBot = rndInt(4, 7); return; }
  a.current = Math.round(a.current * (1 + rndInt(3, 7) / 100) / 1000) * 1000;
  a.leader = 'bot';
  const bots = a.bots && a.bots.length ? a.bots : [a.bot || 'Перекупщик'];
  a.botName = choice(bots);
  a.nextBot = rndInt(3, 6);
  toast(isEn()
    ? 'Dealer ' + a.botName + ' raised the bid: ' + money(a.current)
    : 'Перекупщик ' + a.botName + ' поднял ставку: ' + money(a.current), 'warn');
  sfxClick();
  if(state.tab === 'market') renderMarket();
}

function addCarFromDeal(d, price){
  state.cars.push({
    uid: state.uid++,
    modelId: d.modelId,
    year: d.year,
    mileage: d.mileage,
    visual: d.visual,
    engine: d.engine,
    body: d.body,
    docs: d.docs,
    noHistory: d.noHistory,
    owners: d.owners,
    color: d.color,
    legalIssue: d.legalIssue || null,
    bought: price,
    spent: price,
    prep: { wash:0, body:0, engine:0 },
    sale: null
  });
}

function resolveAuction(){
  const a = state.auction;
  if(!a) return;
  const name = modelOf(a.modelId).name;
  if(a.leader === 'player'){
    if(state.cars.length >= capacity()) toast('Гараж заполнен: лот не выкуплен', 'bad');
    else if(state.money < a.current) toast('Недостаточно средств: лот не выкуплен', 'bad');
    else{
      state.money -= a.current;
      addCarFromDeal(a, a.current);
      toast('Аукцион выигран: ' + name + ' за ' + money(a.current), 'good');
      sfxCoin();
    }
  }else if(a.leader === 'bot'){
    toast('Лот забрал перекупщик ' + (a.botName || a.bot || ''), 'warn');
  }else{
    toast('Аукцион завершён без ставок', 'warn');
  }
  state.auction = null;
  state.auctionIn = rndInt(AUCTION_EVERY[0], AUCTION_EVERY[1]);
  syncMoney(true);
  renderAll();
  save();
}

/* ---------------- Реклама ---------------- */
function showRewardedAd(onRewarded, placement){
  if(vipActive()){
    if(onRewarded) onRewarded();
    return;
  }
  const ad = pgAds();
  if(!bridgeOnline || !ad || !ad.isRewardedSupported){
    toast('Реклама недоступна', 'warn');
    return;
  }
  if(adShowing > 0) return;
  rewardedPending = onRewarded || null;
  rewardedDone = false;
  rewardedOpen = true;
  refreshAdState();
  try{
    const request = ad.showRewarded(placement || 'bonus');
    if(request && request.catch) request.catch(function(){});
  }catch(err){
    rewardedOpen = false;
    rewardedPending = null;
    refreshAdState();
    toast('Реклама недоступна', 'warn');
  }
}

function showInterstitialAd(after, placement){
  if(vipActive()){
    if(after) after();
    return;
  }
  if(modal || achOpen || state.auction){
    if(after) after();
    return;
  }
  if(adShowing > 0){
    if(after) after();
    return;
  }
  const ad = pgAds();
  if(!bridgeOnline || !ad || !ad.isInterstitialSupported){
    if(after) after();
    return;
  }

  let finished = false;
  const finish = function(){
    if(finished) return;
    finished = true;
    if(interstitialFallback){
      clearTimeout(interstitialFallback);
      interstitialFallback = 0;
    }
    interstitialOpen = false;
    interstitialPending = null;
    refreshAdState();
    if(after) after();
  };

  interstitialPending = finish;
  interstitialTouched = false;
  interstitialOpen = true;
  refreshAdState();

  try{
    const request = ad.showInterstitial(placement || 'level_completed');
    if(request && request.catch) request.catch(function(){});
  }catch(err){
    finish();
    return;
  }

  interstitialFallback = setTimeout(function(){
    interstitialFallback = 0;
    if(!interstitialTouched) finish();
  }, 5000);
}

/* ---------------- VIP ---------------- */
function activateVip(){
  if(vipActive()){
    toast('VIP активен: осталось ' + vipLeftText(), 'good');
    return;
  }
  showRewardedAd(function(){
    state.vipAds = Math.min(VIP_ADS_NEEDED, (state.vipAds || 0) + 1);
    if(state.vipAds >= VIP_ADS_NEEDED){
      state.vipExpiresAt = Date.now() + VIP_DURATION_MS;
      state.vipAds = 0;
      save();
      vipModalActive = true;
      renderModal();
      renderAll();
      sfxCoin();
      toast('Закрытый клуб активирован на 24 часа', 'good');
      return;
    }
    save();
    renderModal();
    toast('Просмотр засчитан: ' + state.vipAds + '/' + VIP_ADS_NEEDED + ' · осталось ' + (VIP_ADS_NEEDED - state.vipAds), 'good');
  }, 'bonus');
}

/* ---------------- Playgama Bridge ---------------- */
function pgApplyAudio(){
  if(pgBlocked()){
    if(audioCtx && audioCtx.state === 'running'){
      try{ audioCtx.suspend(); }catch(e){ /* noop */ }
    }
    return;
  }
  if(!isMuted) resumeAudio();
}

function setupBridgeEvents(){
  if(!bridgeApi) return;
  const events = bridgeApi.EVENT_NAME || {};
  const platform = bridgeApi.platform;
  const advertisement = bridgeApi.advertisement;

  if(platform && typeof platform.on === 'function'){
    platform.on(events.AUDIO_STATE_CHANGED || 'audio_state_changed', function(enabled){
      pgAudioEnabled = enabled !== false;
      pgApplyAudio();
    });

    platform.on(events.PAUSE_STATE_CHANGED || 'pause_state_changed', function(paused){
      pgPaused = !!paused;
      pgApplyAudio();
    });

    if(events.VISIBILITY_STATE_CHANGED){
      platform.on(events.VISIBILITY_STATE_CHANGED, function(state){
        if(state === 'hidden') pgPaused = true;
        else pgPaused = false;
        pgApplyAudio();
      });
    }
  }

  if(advertisement && typeof advertisement.on === 'function'){
    advertisement.on(events.REWARDED_STATE_CHANGED || 'rewarded_state_changed', function(state){
      if(state === 'loading' || state === 'opened'){
        rewardedOpen = true;
        refreshAdState();
        return;
      }
      if(state === 'rewarded'){
        rewardedDone = true;
        const pending = rewardedPending;
        rewardedPending = null;
        if(pending) pending();
        return;
      }
      if(state === 'closed' || state === 'failed'){
        if(state === 'failed') toast('Реклама недоступна', 'warn');
        else if(!rewardedDone) toast('Реклама не была просмотрена', 'warn');
        rewardedOpen = false;
        rewardedDone = false;
        rewardedPending = null;
        refreshAdState();
      }
    });

    advertisement.on(events.INTERSTITIAL_STATE_CHANGED || 'interstitial_state_changed', function(state){
      if(state === 'loading' || state === 'opened'){
        interstitialTouched = true;
        interstitialOpen = true;
        refreshAdState();
        return;
      }
      if(state === 'closed' || state === 'failed'){
        interstitialTouched = true;
        interstitialOpen = false;
        refreshAdState();
        const pending = interstitialPending;
        interstitialPending = null;
        if(pending) pending();
      }
    });

    if(events.BANNER_STATE_CHANGED){
      advertisement.on(events.BANNER_STATE_CHANGED, function(state){
        if(state === 'shown') pgApplyAudio();
        else if(state === 'hidden') refreshAdState();
      });
    }
  }
}

function initBridge(){
  if(!bridgeApi || typeof bridgeApi.initialize !== 'function') return Promise.resolve(false);
  let ready;
  if(window.__bridgeReady && typeof window.__bridgeReady.then === 'function'){
    ready = window.__bridgeReady;
  }else{
    try{
      ready = bridgeApi.initialize();
    }catch(err){
      return Promise.resolve(false);
    }
  }
  return Promise.resolve(ready)
    .then(function(ok){
      if(ok === false) return false;
      bridgeOnline = true;
      try{
        platformLanguage = (bridgeApi.platform && bridgeApi.platform.language) || 'ru';
        pgAudioEnabled = !(bridgeApi.platform && bridgeApi.platform.isAudioEnabled === false);
      }catch(err){
        platformLanguage = 'ru';
      }
      if(window.I18N) I18N.auto(platformLanguage);
      setupBridgeEvents();
      if(bridgeApi.advertisement && !bridgeApi.advertisement.isRewardedSupported){
        document.body.classList.add('no-rewarded-ad');
      }
      refreshAdState();
      return true;
    })
    .catch(function(){
      bridgeOnline = false;
      document.body.classList.add('no-rewarded-ad');
      return false;
    });
}

function loadLocalSave(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw) return null;
    return normalizeState(JSON.parse(raw));
  }catch(e){ return null; }
}

function pgLoadSave(){
  const local = loadLocalSave();
  if(!bridgeOnline || !bridgeApi || !bridgeApi.storage) return Promise.resolve(local);
  return Promise.resolve(bridgeApi.storage.get(SAVE_KEY, true)).then(function(remote){
    const cloud = normalizeState(remote);
    if(!cloud) return local;
    if(!local) return cloud;
    return (cloud.savedAt || 0) > (local.savedAt || 0) ? cloud : local;
  }).catch(function(){ return local; });
}

function normalizeState(data){
  if(!data || typeof data !== 'object') return null;
  const base = defaultState();
  const s = Object.assign(base, data);
  s.upgrades = Object.assign(defaultState().upgrades, data.upgrades || {});
  s.stats = Object.assign(defaultState().stats, data.stats || {});
  s.ach = Array.isArray(data.ach) ? data.ach : [];
  if(typeof s.vipExpiresAt !== 'number') s.vipExpiresAt = 0;
  if(typeof s.vipAds !== 'number') s.vipAds = 0;
  if(!s.vipExpiresAt && data.vip === true) s.vipExpiresAt = Date.now() + VIP_DURATION_MS;
  s.cars = Array.isArray(s.cars) ? s.cars.filter(function(c){ return c && MODELS.some(function(m){ return m.id === c.modelId; }); }) : [];
  s.cars.forEach(function(c){ c.prep = c.prep || { wash:0, body:0, engine:0 }; c.sale = c.sale || null; });
  s.listings = [];
  if(['market','garage','business','profile'].indexOf(s.tab) === -1) s.tab = 'market';
  if(typeof s.money !== 'number' || !isFinite(s.money)) s.money = START.money;
  if(typeof s.rep !== 'number') s.rep = START.rep;
  if(typeof s.marketIn !== 'number' || s.marketIn > REFRESH_SECONDS || s.marketIn < 0) s.marketIn = REFRESH_SECONDS;
  if(typeof s.filter !== 'number') s.filter = 0;
  if(typeof s.uid !== 'number') s.uid = 1000;
  return s;
}
/* ---------------- Рендер ---------------- */
function toast(text, kind){
  const box = $('toasts');
  if(!box) return;
  while(box.children.length >= 4) box.removeChild(box.firstChild);
  const el = document.createElement('div');
  el.className = 'toast ' + (kind || '');
  el.innerHTML = '<span class="t-dot"></span><span>' + (window.I18N ? I18N.t(text) : text) + '</span>';
  box.appendChild(el);
  setTimeout(() => el.classList.add('out'), 3400);
  setTimeout(() => { if(el.parentNode) el.parentNode.removeChild(el); }, 3700);
}
window.showGameToast = toast;

function updateHeader(){
  const rep = $('repValue'), gar = $('garageValue'), mute = $('muteBtn'), vip = $('vipBtn');
  if(vip){
    vip.classList.toggle('active', vipActive());
    vip.setAttribute('aria-label', vipActive() ? 'VIP активен: осталось ' + vipLeftText() : 'Закрытый клуб автобаронов');
  }
  if(rep) rep.textContent = state.rep;
  if(gar) gar.textContent = state.cars.length + '/' + capacity();
  if(mute){
    mute.classList.toggle('is-muted', isMuted);
    mute.setAttribute('aria-label', isMuted ? 'Звук выключен' : 'Звук включён');
  }
  document.querySelectorAll('[data-tab]').forEach(b => {
    b.classList.toggle('is-active', b.dataset.tab === state.tab);
  });
}

function syncMoney(animate){
  state.stats.maxMoney = Math.max(state.stats.maxMoney || 0, state.money);
  claimTelegramRefBonus();
  const el = $('moneyValue');
  if(!el) return;
  const to = Math.round(state.money);
  if(shownMoney === null){ shownMoney = to; el.textContent = moneyShort(to); return; }
  const from = shownMoney;
  shownMoney = to;
  if(!animate || from === to){ el.textContent = moneyShort(to); return; }
  const t0 = performance.now(), dur = 560;
  function step(t){
    const k = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = moneyShort(from + (to - from) * e);
    if(k < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function leagueChips(){
  return [0,1,2,3,4,5].map(n => {
    const locked = n > 0 && !leagueUnlocked(n);
    const label = n === 0 ? 'Все лиги' : 'Лига ' + n;
    return '<button class="fchip ' + (state.filter === n ? 'is-active' : '') + '" data-action="filter" data-league="' + n + '"' +
      (locked ? ' disabled' : '') + '>' + label + (locked ? '<span class="f-lock">' + ic('lock') + '</span>' : '') + '</button>';
  }).join('');
}

function nextLockHint(){
  const L = LEAGUES.find(x => !leagueUnlocked(x.n));
  if(!L) return 'Все лиги открыты';
  return 'Лига ' + L.n + ' · ' + L.name + ': капитал ' + moneyShort(L.money) + ', репутация ' + L.rep +
    (L.dealer && upg('dealer') < 1 ? ', статус автосалона' : '');
}

function listingCard(l){
  const m = modelOf(l.modelId);
  const v = carValue(l);
  const pay = buyPrice(l);
  const disc = Math.round((1 - pay / Math.max(1, l.ask)) * 100);
  let hint = '<span class="price-hint">Рынок ≈ ' + money(v) + '</span>';
  if(l.known.exact){
    const diff = l.ask - v;
    if(diff <= -v * 0.05) hint = '<span class="price-hint good">Ниже рынка на ' + money(-diff) + '</span>';
    else if(diff >= v * 0.12) hint = '<span class="price-hint bad">Переплата ' + money(diff) + '</span>';
    else hint = '<span class="price-hint">По рынку</span>';
  }
  const deal = l.known.exact && l.ask <= v * 0.9;
  return '<article class="car-card" data-listing="' + l.id + '">' +
    ticketHeader(m, { year:l.year, color:l.color, badge: deal ? 'Выгодно' : '' }) +
    '<div class="car-body">' +
      '<div class="spec-row"><span>Пробег <b>' + km(l.displayMileage) + '</b></span>' +
        '<span>Владельцев по ПТС <b>' + l.owners + '</b></span>' +
        '<span>Ликвидность <b>' + m.liq + '</b></span></div>' +
      diagGrid(l) +
      '<div class="price-row">' +
        '<div class="price-block"><span class="price-label">' + (disc > 0 ? 'Цена со скидкой выкупа' : 'Цена продавца') + '</span>' +
          '<span class="price amber">' + money(pay) + (disc > 0 ? ' <span class="chip good" style="vertical-align:3px">−' + disc + '%</span>' : '') + '</span></div>' + hint +
      '</div>' +
      '<div class="card-actions">' +
        '<button class="btn ghost" data-action="open-listing" data-id="' + l.id + '">Осмотр</button>' +
        '<button class="btn buy" data-action="buy-listing" data-id="' + l.id + '">Купить</button>' +
      '</div>' +
    '</div>' +
  '</article>';
}

function auctionCardHTML(a){
  const m = modelOf(a.modelId);
  const v = carValue(a);
  const leader = a.leader === 'player' ? 'Вы' : a.leader === 'bot' ? (a.botName || a.bot || 'Перекупщик') : 'Ставок нет';
  const next5 = Math.round(a.current * 1.05 / 1000) * 1000;
  const next10 = Math.round(a.current * 1.10 / 1000) * 1000;
  return '<div class="auction-card">' +
    '<div class="auction-top"><span class="auction-tag">Горячий лот · аукцион</span>' +
      '<span class="auction-timer" data-auction-timer>' + timerText(a.ends) + '</span></div>' +
    ticketHeader(m, { year:a.year, color:a.color, badge:'Аукцион', stack:true }) +
    '<div class="auction-body">' +
      '<div class="auction-bid"><div class="price-label">Текущая ставка</div>' +
        '<div class="auction-price">' + money(a.current) + '</div>' +
        '<div class="tiny muted">Старт ' + money(a.start) + ' · рынок ' + money(v) + '</div></div>' +
      '<div class="auction-leader">Лидер<br><b>' + leader + '</b></div>' +
    '</div>' +
    '<div class="auction-actions">' +
      '<button class="btn amber" data-action="auction-bid" data-step="5">+5% · ' + money(next5) + '</button>' +
      '<button class="btn amber" data-action="auction-bid" data-step="10">+10% · ' + money(next10) + '</button>' +
    '</div>' +
  '</div>';
}

function freeDiagnose(l){
  if(!l || l.known.exact) return;
  l.known.basic = true;
  l.known.exact = true;
  l.known.docs = true;
  l.chat.push({ who:'sys', text:'Экспертная диагностика: мотор, кузов, документы и пробег проверены.' });
  toast('Полная диагностика получена', 'good');
  sfxCoin();
  renderModal();
  renderMarket();
  save();
}

function boostSale(uid){
  const car = findCar(uid);
  if(!car || !car.sale){ toast('Сначала выставьте авто на продажу', 'warn'); return; }
  const o = makeOffer(car);
  o.vip = true;
  o.amount = Math.round(o.amount * 1.2 / 1000) * 1000;
  o.line = 'VIP-клиент: беру в кредит сегодня.';
  car.sale.offers.push(o);
  car.sale.nextIn = offerDelay(car);
  renderAll();
  save();
  toast('VIP-покупатель найден: ' + money(o.amount), 'good');
  sfxCoin();
}

function vipModalHTML(){
  const active = vipActive();
  vipModalActive = active;
  const progress = Math.min(VIP_ADS_NEEDED, state.vipAds || 0);
  const perk = function(num, text){
    return '<div class="club-perk"><span class="club-num">' + num + '</span><span>' + text + '</span></div>';
  };
  return '<div class="modal-grip"></div>' +
    '<button class="modal-close" data-action="close-modal" aria-label="Закрыть">' + ic('close') + '</button>' +
    '<div class="modal-body vip-body">' +
      '<div class="club-card">' +
        '<div class="club-head">' +
          '<div class="club-emblem">A</div>' +
          '<div class="club-headings">' +
            '<div class="club-kicker">Закрытый клуб автобаронов</div>' +
            '<div class="club-sub">VIP на 24 часа</div>' +
          '</div>' +
          '<div class="club-star">' + ic('star') + '</div>' +
        '</div>' +
        '<h2 class="club-title">VIP-статус на 24 часа</h2>' +
        '<p class="club-text">Посмотри 5 коротких рекламных роликов — и получи сутки привилегий без рекламы. Прогресс сохраняется.</p>' +
        '<div class="club-divider"></div>' +
        '<div class="club-perks">' +
          perk('01', 'Никакой рекламы — мгновенный доступ ко всем действиям без ожидания') +
          perk('02', 'Бесплатная полная проверка любого автомобиля перед покупкой') +
          perk('03', 'Двойной поток состоятельных покупателей в вашем гараже') +
          perk('04', 'Приоритетный доступ к закрытым торгам') +
        '</div>' +
        '<div class="club-foot">Автобарон · клубная карта</div>' +
      '</div>' +
      (active
        ? '<div class="club-active">VIP активен · осталось <b data-vip-timer>' + vipLeftText() + '</b></div>' +
          '<div class="club-note">Без рекламы ещё ' + vipLeftText() + '</div>'
        : '<div class="club-progress">Просмотров рекламы: ' + progress + '/' + VIP_ADS_NEEDED + '</div>' +
          '<button class="btn ach-btn" data-action="buy-vip" data-progress="' + progress + '">Активировать VIP на 24ч (' + progress + '/' + VIP_ADS_NEEDED + ' рекламы)</button>' +
          '') +
    '</div>';
}

function renderMarket(){
  const el = $('view-market');
  if(!el) return;
  const refreshLabel = 'Обновить сейчас <span class="ad-tag">Реклама</span>';
  const headButton = '<button class="btn ghost" data-action="ad-refresh">' + refreshLabel + '</button>';

  el.innerHTML =
    '<div class="view-head">' +
      '<div><h1><span class="live-dot"></span>Рынок</h1><p class="sub"><span class="sub-lots">' + state.listings.length + ' предложений</span><span class="sub-sep"> · </span><span class="sub-timer">Новые лоты через <b data-market-timer>' +
        timerText(state.marketIn) + '</b></span></p></div>' +
      '<div class="head-actions">' + headButton + '</div>' +
    '</div>' +
    (state.news && state.news.until > 0
      ? '<div class="news-ticker"><span class="news-dot"></span><span class="news-text">' + state.news.text + '</span><span class="news-time" data-news-timer>' + timerText(state.news.until) + '</span></div>'
      : '') +
    (state.auction
      ? auctionCardHTML(state.auction)
      : '<div class="auction-next">Следующий горячий лот через <b data-auction-next>' + timerText(state.auctionIn) + '</b></div>') +
    '<div class="filter-wrap"><div class="filter-scroll">' + leagueChips() + '</div></div>' +
    (state.listings.length
      ? '<div class="market-grid">' + state.listings.map(listingCard).join('') + '</div>'
      : '<div class="empty"><div class="emoji">' + ic('search') + '</div><h3>Нет предложений</h3>' +
        '<p>В выбранной лиге пока пусто. Смените фильтр или обновите ленту.</p>' +
        '<button class="btn primary" data-action="refresh-market">Обновить ленту</button></div>') +
    '<div class="hint-bar"><span class="h-ico">' + ic('bulb') + '</span><span><b>' + nextLockHint() + '.</b> Базовый осмотр бесплатен, глубокая диагностика — ' +
      money(DIAG_COST) + '. Торг снижает цену на 5–15%.</span></div>';
}

function garageCard(car){
  const m = modelOf(car.modelId);
  const v = carValue(car);
  const profit = v - car.spent;
  let saleZone = '';

  if(car.sale){
    const offers = car.sale.offers.length
      ? car.sale.offers.map(o =>
          '<div class="offer"><div class="who"><b>' + money(o.amount) + (o.vip ? ' · VIP' : '') + '</b><span>' +
            o.buyer + ' · ' + o.line + '</span></div>' +
          '<div class="offer-act"><button class="btn buy sm" data-action="accept-offer" data-uid="' + car.uid + '" data-oid="' + o.id + '">Продать</button>' +
          '<button class="btn ghost sm" data-action="counter-offer" data-uid="' + car.uid + '" data-oid="' + o.id + '">Торг</button></div></div>'
        ).join('')
      : '<div class="tiny muted">Покупатели изучают объявление.</div>';

    saleZone = '<div class="sale-zone">' +
      '<div class="sale-head"><div><div class="price-label">Ваша цена</div><div class="asking">' + money(car.sale.price) + '</div></div>' +
      '<button class="btn ghost sm" data-action="delist" data-uid="' + car.uid + '">Снять</button></div>' +
      '<div class="sale-timer"><span>Следующий покупатель через <b data-sale-timer="' + car.uid + '">' + car.sale.nextIn + ' с</b></span>' + ic('chat') + '</div>' +
      '<button class="btn ghost sm" data-action="ad-speedup" data-uid="' + car.uid + '">Ускорить продажу · VIP-покупатель [Реклама]</button>' +
      '<div class="offers">' + offers + '</div>' +
    '</div>';
  }else{
    saleZone = '<div class="sale-zone"><button class="btn amber block" data-action="open-sell" data-uid="' + car.uid + '">Выставить на продажу</button></div>';
  }

  return '<article class="car-card garage-card">' +
    ticketHeader(m, { year:car.year, color:car.color, badge: car.noHistory ? 'История не подтверждена' : 'В гараже' }) +
    '<div class="car-body">' +
      '<div class="spec-row"><span>Пробег <b>' + km(car.mileage) + '</b></span>' +
        '<span>Куплено за <b>' + money(car.bought) + '</b></span>' +
        '<span>Ликвидность <b>' + m.liq + '</b></span></div>' +
      diagGrid(car, true) +
      '<div class="value-line"><span class="label">Оценка рынка</span><span class="num">' + money(v) + '</span></div>' +
      '<div class="value-line"><span class="label">Вложено · потенциал</span><span class="num ' + (profit >= 0 ? 'up' : 'down') + '">' +
        (profit >= 0 ? '+' : '') + money(profit) + '</span></div>' +
      '<div class="prep-grid">' +
        '<button class="prep-btn" data-action="prep" data-uid="' + car.uid + '" data-kind="wash"><span class="p-name">' + ic('wash') + ' Мойка</span><span class="p-cost">' + money(prepCost('wash', car)) + '</span></button>' +
        '<button class="prep-btn" data-action="prep" data-uid="' + car.uid + '" data-kind="body"><span class="p-name">' + ic('body') + ' Кузов</span><span class="p-cost">' + money(prepCost('body', car)) + '</span></button>' +
        '<button class="prep-btn" data-action="prep" data-uid="' + car.uid + '" data-kind="engine"><span class="p-name">' + ic('engine') + ' Мотор</span><span class="p-cost">' + money(prepCost('engine', car)) + '</span></button>' +
      '</div>' +
      saleZone +
    '</div>' +
  '</article>';
}

function renderGarage(){
  const el = $('view-garage');
  if(!el) return;
  el.innerHTML =
    '<div class="view-head"><div><h1>Гараж</h1>' +
      '<p class="sub">Занято <b>' + state.cars.length + ' из ' + capacity() + '</b> · подготовка повышает цену продажи</p></div>' +
      '<div class="head-actions"><span class="chip ' + (state.cars.length >= capacity() ? 'warn' : 'good') + '">' +
        state.cars.length + '/' + capacity() + ' мест</span></div>' +
    '</div>' +
    (state.cars.length
      ? '<div class="garage-grid">' + state.cars.map(garageCard).join('') + '</div>'
      : '<div class="empty"><div class="emoji">' + ic('car') + '</div><h3>Гараж пуст</h3>' +
        '<p>Найдите автомобиль на рынке, проверьте состояние и перепродайте после подготовки.</p>' +
        '<button class="btn primary" data-action="go-tab" data-target="market">Перейти на рынок</button></div>');
}

function upgradeCard(u){
  const lvl = upg(u.key);
  const cost = upgradeCost(u);
  const can = cost != null && state.money >= cost;
  const pips = Array.from({ length:u.max }, function(_, i){
    return '<span class="pip ' + (i < lvl ? (lvl >= u.max ? 'max' : 'on') : '') + '"></span>';
  }).join('');
  const next = lvl >= u.max ? 'Максимальный уровень достигнут' : u.next(lvl);
  return '<div class="up-card">' +
    '<div class="up-head"><div class="up-ico">' + ic(u.icon) + '</div>' +
      '<div style="min-width:0;flex:1"><div class="up-title">' + u.name + '</div><div class="up-desc">' + u.desc + '</div></div>' +
      '<span class="up-level">Ур. ' + lvl + '/' + u.max + '</span></div>' +
    '<div class="up-effect">' + u.effect(lvl) + '</div>' +
    '<div class="up-next">' + next + '</div>' +
    '<div class="up-foot"><div class="pips">' + pips + '</div>' +
      (cost == null
        ? '<span class="chip good">Максимум</span>'
        : '<button class="btn sm ' + (can ? 'primary' : 'ghost') + '" data-action="upgrade" data-key="' + u.key + '"' +
          (can ? '' : ' disabled') + '>' + moneyShort(cost) + '</button>') +
    '</div>' +
    (cost != null ? '<div class="up-cost">Стоимость уровня: <b>' + moneyShort(cost) + '</b></div>' : '') +
  '</div>';
}

function renderBusiness(){
  const el = $('view-business');
  if(!el) return;
  const next = LEAGUES.find(x => !leagueUnlocked(x.n));
  el.innerHTML =
    '<div class="view-head"><div><h1>Сервис и Бизнес</h1>' +
      '<p class="sub">Десять направлений и 8–10 уровней · эффект применяется сразу</p></div></div>' +
    '<div class="summary-strip">' +
      '<div><div class="k">Капитал</div><div class="v green">' + money(state.money) + '</div></div>' +
      '<div><div class="k">Гараж</div><div class="v">' + state.cars.length + ' / ' + capacity() + '</div></div>' +
      '<div><div class="k">Репутация</div><div class="v amber">' + state.rep + ' / 100</div></div>' +
      '<div><div class="k">Следующая лига</div><div class="v" style="font-size:12.5px">' +
        (next ? 'Лига ' + next.n + ' · ' + moneyShort(next.money) + ' / реп. ' + next.rep : 'Все открыты') + '</div></div>' +
    '</div>' +
    '<div class="biz-grid">' + UPGRADES.map(upgradeCard).join('') + '</div>' +
    '<div class="hint-bar"><span class="h-ico">' + ic('bulb') + '</span><span>Инвестиции в бизнес не сгорают: скидки, диагностика и VIP-клиенты работают на каждой сделке. ' +
      'Новый уровень лиги открывается по пиковому капиталу и репутации.</span></div>';
}

function profileMoney(n){
  const a = Math.abs(n);
  if(isEn()){
    const v = usdValue(n);
    if(v >= 1e6) return '$' + (v / 1e6).toFixed(v >= 1e7 ? 1 : 2).replace(/\.0+$/, '') + 'M';
    return (n < 0 ? '−' : '') + '$' + v.toLocaleString('en-US');
  }
  if(a >= 1e9) return (n / 1e9).toFixed(2).replace('.', isEn() ? '.' : ',') + (isEn() ? 'B ' + cur() : ' млрд ₽');
  if(a >= 1e8) return (n / 1e6).toFixed(1).replace('.', isEn() ? '.' : ',') + (isEn() ? 'M ' + cur() : ' млн ₽');
  return money(n);
}
function renderProfile(){
  const el = $('view-profile');
  if(!el) return;
  const rank = state.rep >= 80 ? 'Магнат авторынка' : state.rep >= 50 ? 'Владелец салона' : state.rep >= 25 ? 'Опытный перекупщик' : 'Новичок';
  el.innerHTML =
    '<div class="profile-head"><div class="avatar">A</div><div>' +
      '<h2>Автобарон</h2><div class="role">Частный автобизнес · этап 2</div>' +
      '<span class="rank">' + ic('star') + ' ' + rank + '</span></div></div>' +
    '<div class="stats-grid">' +
      '<div class="stat-card"><div class="k">Капитал</div><div class="v green">' + profileMoney(state.money) + '</div></div>' +
      '<div class="stat-card"><div class="k">Пиковый капитал</div><div class="v blue">' + profileMoney(state.stats.maxMoney || 0) + '</div></div>' +
      '<div class="stat-card"><div class="k">Репутация</div><div class="v amber">' + state.rep + ' / 100</div></div>' +
      '<div class="stat-card"><div class="k">Сделок закрыто</div><div class="v">' + state.stats.sold + '</div></div>' +
      '<div class="stat-card"><div class="k">Общая прибыль</div><div class="v green">' + (state.stats.profit >= 0 ? '+' : '') + profileMoney(state.stats.profit) + '</div></div>' +
      '<div class="stat-card"><div class="k">Лучшая сделка</div><div class="v blue">' + profileMoney(state.stats.best) + '</div></div>' +
    '</div>' +
    '<div class="panel"><h3>Достижения</h3><div class="desc">Репутация и капитал открывают новые лиги.</div>' +
      '<div class="chip-row">' +
        '<span class="chip ' + (state.stats.bought > 0 ? 'good' : 'unknown') + '">Первая покупка</span>' +
        '<span class="chip ' + (state.stats.sold > 0 ? 'good' : 'unknown') + '">Первая продажа</span>' +
        '<span class="chip ' + (state.stats.profit > 100000 ? 'good' : 'unknown') + '">' + (isEn()
        ? 'Profit $' + (Math.round(usdValue(100000) / 100) * 100).toLocaleString('en-US')
        : 'Прибыль 100 000 ₽') + '</span>' +
        '<span class="chip ' + (state.rep >= 50 ? 'good' : 'unknown') + '">Репутация 50</span>' +
        '<span class="chip ' + (state.stats.sold >= 10 ? 'good' : 'unknown') + '">10 сделок</span>' +
        '<span class="chip ' + (upg('dealer') > 0 ? 'good' : 'unknown') + '">Официальный салон</span>' +
      '</div>' +
    '</div>' +
    '<div class="panel"><h3>' + (isEn() ? 'Friends' : 'Друзья') + '</h3>' +
      '<div class="desc">' + (isEn() ? 'Invite a friend and get +$300.' : 'Пригласите друга и получите +$300.') + '</div>' +
      '<button class="btn primary block" data-action="invite-friend">' + (isEn() ? 'Invite friend (+$300)' : 'Пригласить друга (+$300)') + '</button>' +
    '</div>' +
    '<div class="panel settings-panel"><h3>Настройки</h3><div class="desc">Прогресс сохраняется автоматически в localStorage.</div>' +
      '<div class="settings-list">' +
        '<div class="settings-line"><span class="settings-label">Язык / Language</span>' +
          '<div class="lang-switch settings-control" role="group" aria-label="Language">' +
            '<button class="lang-btn" type="button" data-lang="ru">RU</button>' +
            '<button class="lang-btn" type="button" data-lang="en">EN</button>' +
          '</div>' +
        '</div>' +
        '<div class="settings-line"><span class="settings-label">Звук интерфейса и уведомлений</span>' +
          '<button class="btn ghost settings-control settings-sound" data-action="toggle-mute">' + (isMuted ? ic('muteOff') + ' Звук выкл' : ic('muteOn') + ' Звук вкл') + '</button>' +
        '</div>' +
        '<div class="settings-line"><span class="settings-label">Сброс прогресса игры</span>' +
          '<button class="btn danger settings-control" data-action="reset">Начать заново</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="tiny muted" style="text-align:center;padding:2px 0 6px">АВТОБАРОН · этап 2</div>';
}

/* ---------------- Модальные окна ---------------- */
function syncModalLock(){
  const adRoot = $('adRoot');
  const adOpen = !!(adRoot && adRoot.classList.contains('open'));
  const locked = !!modal || achOpen || adOpen;
  document.body.classList.toggle('modal-open', locked);
  const app = $('app');
  if(app) app.classList.toggle('modal-open', locked);
  document.body.style.overflow = locked ? 'hidden' : '';
}
function openModalRoot(){
  const root = $('modalRoot');
  if(root) root.classList.add('open');
  document.body.style.overflow = 'hidden';
  syncModalLock();
}
function closeModal(){
  modal = null;
  const root = $('modalRoot');
  if(root){ root.classList.remove('open'); root.innerHTML = ''; }
  syncModalLock();
}

function row(label, value, cls){
  return '<div class="inspect-item"><span>' + label + '</span><span class="v ' + (cls || '') + '">' + value + '</span></div>';
}

function listingModalHTML(l){
  if(!l) return null;
  const m = modelOf(l.modelId);
  const v = carValue(l);
  let mileage = km(l.displayMileage), mileageCls = '';
  if(l.known.exact && l.noHistory){ mileage = 'История не подтверждена · ' + km(l.mileage); mileageCls = 'warn'; }
  else if(l.known.historySuspect){ mileage = 'Есть сомнения · ' + km(l.displayMileage); mileageCls = 'warn'; }

  const defects = [];
  if(l.known.exact){
    if(l.engine < 55) defects.push('мотор требует ремонта');
    if(l.body < 55) defects.push('кузов битый');
    if(l.docs < 60) defects.push('проблемы с документами');
    if(l.noHistory) defects.push('нет истории обслуживания');
  }
  const repairCost = Math.round(((100 - l.engine) * 760 + (100 - l.body) * 520) / 1000) * 1000;
  const note = l.known.exact
    ? (defects.length
        ? '<div class="inspect-note warn">Найдено: ' + defects.join(', ') + '. Ориентир на ремонт: ' + money(repairCost) + '.</div>'
        : '<div class="inspect-note">Скрытых проблем не найдено.</div>')
    : '<div class="inspect-note">Часть данных раскрывается после диагностики. Бесплатный осмотр или диагностика за ' + money(DIAG_COST) + '.</div>';

  const priceHint = l.known.exact
    ? '<div class="mk">Рынок: ' + money(v) + '<br>' + (l.ask <= v
        ? '<span class="green">ниже рынка</span>'
        : '<span class="coral">выше на ' + money(l.ask - v) + '</span>') + '</div>'
    : '<div class="mk">Рынок ≈ ' + money(v) + '<br>дефекты не проверены</div>';

  const chat = l.chat.map(c => '<div class="bubble ' + c.who + '">' + c.text + '</div>').join('');
  const replies = (l.agreed || l.tries >= 3)
    ? '<div class="tiny muted" style="text-align:center;padding:6px 0">' +
      (l.agreed ? 'Цена согласована — можно забирать.' : 'Продавец больше не торгуется.') + '</div>'
    : '<div class="replies">' + BARGAIN_OPTS.map(o =>
        '<button class="reply" data-action="bargain" data-id="' + l.id + '" data-opt="' + o.id + '">' +
        '<span>' + o.label + '</span><span class="chance">шанс ' + Math.round(bargainChance(l, o) * 100) + '%</span></button>'
      ).join('') + '</div>';

  return '<div class="modal-grip"></div>' +
    '<button class="modal-close" data-action="close-modal" aria-label="Закрыть">' + ic('close') + '</button>' +
    '<div class="modal-body">' +
      ticketHeader(m, { year:l.year, color:l.color, badge: l.known.exact && l.ask <= v ? 'Ниже рынка' : '' }) +
      '<div class="modal-price"><div><div class="price-label">' + (buyoutPct() > 0 ? 'Цена со скидкой выкупа' : 'Цена продавца') + '</div><div class="price amber">' + money(buyPrice(l)) + '</div></div>' + priceHint + '</div>' +
      '<div class="section-title">Техпаспорт</div>' +
      '<div class="tech-grid">' +
        '<div class="tech-cell"><div class="tk">Двигатель</div><div class="tv">' + m.engine + '</div></div>' +
        '<div class="tech-cell"><div class="tk">Привод</div><div class="tv">' + driveText(m.drive) + '</div></div>' +
        '<div class="tech-cell"><div class="tk">Владельцев по ПТС</div><div class="tv">' + l.owners + '</div></div>' +
        '<div class="tech-cell"><div class="tk">Ликвидность</div><div class="tv">' + m.liq + ' / 100</div></div>' +
      '</div>' +
      '<div class="section-title">Диагностика узлов</div>' +
      diagGrid(l) +
      '<div class="inspect-list" style="margin-top:10px">' +
        row('Пробег', mileage, mileageCls) +
        row('Внешний вид', l.visual + ' / 100', condClass(l.visual)) +
      '</div>' + note +
      '<div class="diag-actions">' +
        '<button class="btn ghost" data-action="inspect-basic" data-id="' + l.id + '"' + (l.known.basic ? ' disabled' : '') + '>' +
          (l.known.basic ? 'Осмотр проведён' : 'Осмотр · бесплатно') + '</button>' +
        '<button class="btn primary" data-action="inspect-deep" data-id="' + l.id + '"' + (l.known.exact ? ' disabled' : '') + '>' +
          (l.known.exact ? 'Диагностика проведена' : (vipActive() ? 'Диагностика · VIP бесплатно' : 'Диагностика · ' + money(DIAG_COST))) + '</button>' +
      '</div>' +
      '<button class="btn ghost block" style="margin-top:7px" data-action="ad-diagnose" data-id="' + l.id + '"' + (l.known.exact ? ' disabled' : '') + '>' +
        (vipActive() ? 'Бесплатная полная диагностика · VIP' : 'Бесплатная полная диагностика [Реклама]') + '</button>' +
      '<div class="section-title">Торг с продавцом</div>' +
      '<div class="chat">' + chat + '</div>' + replies +
      '<div class="modal-foot"><button class="btn buy" data-action="buy-listing" data-id="' + l.id + '">Купить за ' + money(buyPrice(l)) + '</button></div>' +
      '<div class="tiny muted" style="text-align:center;padding:9px 0 2px">Свободно мест: ' + (capacity() - state.cars.length) + ' из ' + capacity() + '</div>' +
    '</div>';
}

function sellModalHTML(car){
  if(!car) return null;
  const m = modelOf(car.modelId);
  const v = carValue(car);
  const suggestedRub = Math.max(10000, Math.round(v * 1.04 / 1000) * 1000);
  const usdInput = isEn();
  const suggested = usdInput ? usdValue(suggestedRub) : suggestedRub;
  const inputMin = usdInput ? Math.ceil(10000 / 90) : 10000;
  const inputStep = usdInput ? 10 : 1000;
  return '<div class="modal-grip"></div>' +
    '<button class="modal-close" data-action="close-modal" aria-label="Закрыть">' + ic('close') + '</button>' +
    '<div class="modal-body">' +
      ticketHeader(m, { year:car.year, color:car.color, badge: 'На продажу' }) +
      '<div class="modal-price"><div><div class="price-label">Оценка рынка</div><div class="price green">' + money(v) + '</div></div>' +
        '<div class="mk">Куплено за ' + money(car.bought) + '</div></div>' +
      '<div class="section-title">Ваша цена' + (usdInput ? ', $' : '') + '</div>' +
      '<input id="salePriceInput" class="price-input" type="number" min="' + inputMin + '" step="' + inputStep + '" value="' + suggested + '" inputmode="numeric">' +
      '<div class="tiny muted" style="margin-top:7px">Покупатели присылают офферы каждые несколько секунд. Слишком высокая цена снижает шансы сделки.</div>' +
      '<div class="modal-foot"><button class="btn ghost" data-action="close-modal">Отмена</button>' +
      '<button class="btn amber" data-action="confirm-sell" data-uid="' + car.uid + '">Выставить</button></div>' +
    '</div>';
}

function welcomeModalHTML(){
  return '<div class="modal-grip"></div>' +
    '<button class="modal-close" data-action="close-welcome" aria-label="Закрыть">' + ic('close') + '</button>' +
    '<div class="modal-body welcome-body">' +
      '<div class="welcome-badge">' + ic('star') + '</div>' +
      '<div class="welcome-kicker">АВТОБАРОН</div>' +
      '<h2 class="welcome-title">Добро пожаловать в АВТОБАРОН!</h2>' +
      '<p class="welcome-text">Покупай авто на рынке, проверяй скрытые дефекты диагностикой, сбивай цену в торге, готовь машины в своём сервисе и продавай с прибылью, чтобы пройти путь от одного гаража до собственной автоимперии.</p>' +
      '<div class="welcome-list">' +
        '<div class="welcome-item"><span class="w-ico">01</span><span>Ищи лоты на рынке и проверяй скрытые дефекты</span></div>' +
        '<div class="welcome-item"><span class="w-ico">02</span><span>Торгуйся, ремонтируй и готовь авто к продаже</span></div>' +
        '<div class="welcome-item"><span class="w-ico">03</span><span>Развивай бизнес и открывай новые лиги</span></div>' +
      '</div>' +
      '<div class="welcome-actions"><button class="btn ach-btn" data-action="close-welcome">' +
        ((state.stats.sold || 0) > 0 || (state.stats.bought || 0) > 0 || state.money !== START.money || upg('garage') > 0
          ? 'Продолжить карьеру'
          : 'Начать карьеру') + '</button></div>' +
    '</div>';
}


function setupModalDrag(){
  const root = $('modalRoot');
  if(!root) return;
  const modalBox = root.querySelector('.modal');
  if(!modalBox) return;
  const handle = modalBox.querySelector('.modal-grip');
  if(!handle) return;
  const backdrop = root.querySelector('.modal-backdrop');
  let startY = null;
  let deltaY = 0;
  handle.addEventListener('touchstart', function(e){
    if(!e.touches || !e.touches.length) return;
    startY = e.touches[0].clientY;
    deltaY = 0;
    modalBox.style.setProperty('animation', 'none', 'important');
    modalBox.style.setProperty('transition', 'none', 'important');
  }, { passive: true });
  handle.addEventListener('touchmove', function(e){
    if(startY === null || !e.touches || !e.touches.length) return;
    deltaY = Math.max(0, e.touches[0].clientY - startY);
    if(e.cancelable) e.preventDefault();
    modalBox.style.setProperty('transform', 'translate3d(0, ' + deltaY + 'px, 0)', 'important');
    if(backdrop) backdrop.style.opacity = String(Math.max(0, 1 - deltaY / 420));
  }, { passive: false });
  function finish(){
    if(startY === null) return;
    startY = null;
    modalBox.style.setProperty('transition', 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)', 'important');
    if(deltaY > 85){
      modalBox.style.setProperty('transform', 'translate3d(0, 100%, 0)', 'important');
      if(backdrop) backdrop.style.opacity = '0';
      setTimeout(function(){
        modalBox.style.removeProperty('transform');
        modalBox.style.removeProperty('transition');
        modalBox.style.removeProperty('animation');
        if(backdrop) backdrop.style.opacity = '';
        closeModal();
      }, 240);
    }else{
      modalBox.style.setProperty('transform', 'translate3d(0, 0, 0)', 'important');
      if(backdrop) backdrop.style.opacity = '';
      setTimeout(function(){
        modalBox.style.removeProperty('transition');
      }, 260);
    }
    deltaY = 0;
  }
  handle.addEventListener('touchend', finish, { passive: true });
  handle.addEventListener('touchcancel', finish, { passive: true });
}

function renderModal(){
  const root = $('modalRoot');
  if(!root) return;
  if(!modal){ closeModal(); return; }
  let html;
  if(modal.type === 'listing') html = listingModalHTML(findListing(modal.id));
  else if(modal.type === 'sell') html = sellModalHTML(findCar(modal.uid));
  else if(modal.type === 'welcome') html = welcomeModalHTML();
  else html = vipModalHTML();
  if(!html){ closeModal(); return; }
  root.innerHTML = '<div class="modal-backdrop" data-action="close-modal"></div><div class="modal' +
    (modal.type === 'welcome' ? ' modal-welcome' : '') + '">' + html + '</div>';
  root.classList.toggle('welcome-open', modal.type === 'welcome');
  openModalRoot();
  setupModalDrag();
  const chat = root.querySelector('.chat');
  if(chat) chat.scrollTop = chat.scrollHeight;
}

function renderAll(){
  renderMarket();
  renderGarage();
  renderBusiness();
  renderProfile();
  renderModal();
  updateHeader();
  checkAchievements();
}

/* ---------------- Навигация / таймеры ---------------- */
function syncMobileHeader(){
  const header = document.querySelector('.topbar');
  const app = $('app');
  const shell = document.querySelector('.shell');
  if(!header || !app || !shell) return;
  const mobile = typeof window.matchMedia === 'function'
    ? window.matchMedia('(max-width: 899px)').matches
    : (window.innerWidth || document.documentElement.clientWidth || 1024) < 900;
  if(mobile){
    if(header.parentElement !== shell) shell.insertBefore(header, shell.firstChild);
  }else{
    if(header.parentElement !== app) app.insertBefore(header, app.firstChild);
  }
}
window.addEventListener('resize', syncMobileHeader);

function setTab(tab){
  if(['market','garage','business','profile'].indexOf(tab) === -1) tab = 'market';
  const prev = state.tab;
  state.tab = tab;
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('is-active', v.id === 'view-' + tab));
  updateHeader();
  if(tab === 'market') renderMarket();
  window.scrollTo({ top:0, behavior:'smooth' });
  save();
  if(prev !== tab) setTimeout(function(){ showInterstitialAd(null, 'tab_change'); }, 900);
}

function updateTimers(){
  const vt = document.querySelector('[data-vip-timer]');
  if(vt) vt.textContent = vipLeftText();
  if(modal && modal.type === 'vip' && vipModalActive !== vipActive()) renderModal();
  const mt = document.querySelector('[data-market-timer]');
  if(mt) mt.textContent = timerText(state.marketIn);
  const nt = document.querySelector('[data-news-timer]');
  if(nt && state.news) nt.textContent = timerText(state.news.until);
  const at = document.querySelector('[data-auction-timer]');
  if(at && state.auction) at.textContent = timerText(state.auction.ends);
  const an = document.querySelector('[data-auction-next]');
  if(an) an.textContent = timerText(state.auctionIn);
  document.querySelectorAll('[data-sale-timer]').forEach(el => {
    const car = findCar(parseInt(el.dataset.saleTimer, 10));
    if(car && car.sale) el.textContent = car.sale.offers.length >= 5 ? 'очередь' : Math.max(0, car.sale.nextIn) + ' с';
  });
}

function tick(){
  if(pgPaused) return;
  if(state.news){
    state.news.until--;
    if(state.news.until <= 0){
      state.news = null;
      toast('Новости рынка: цены вернулись к норме', 'warn');
      if(state.tab === 'market') renderMarket();
    }
  }
  state.newsIn--;
  if(state.newsIn <= 0){
    generateNews();
    if(state.tab === 'market') renderMarket();
  }

  if(state.auction){
    const a = state.auction;
    if(a.ends > 0){
      a.ends--;
      if(a.ends > 0){
        a.nextBot--;
        if(a.nextBot <= 0 && a.leader !== 'bot') botBid(a);
      }else{
        resolveAuction();
      }
    }
  }else{
    state.auctionIn--;
    if(state.auctionIn <= 0) startAuction();
  }

  if(state.marketIn > 0){
    state.marketIn--;
    if(state.marketIn === 0){
      if(modal){
        state.marketIn = 1;
      }else{
        refreshMarket(false);
        toast('На рынок поступили новые авто', 'good');
        sfxCoin();
      }
    }
  }

  let changed = false;
  state.cars.forEach(car => {
    if(!car.sale) return;
    car.sale.nextIn = (car.sale.nextIn || 5) - 1;
    if(car.sale.nextIn <= 0 && car.sale.offers.length < 5){
      const offer = makeOffer(car);
      car.sale.offers.push(offer);
      car.sale.nextIn = offerDelay(car);
      changed = true;
      toast((offer.vip ? 'VIP-покупатель ' : '') + offer.buyer + ' предлагает ' + money(offer.amount), 'warn');
      sfxClick();
    }
  });

  if(changed && state.tab === 'garage' && !modal) renderGarage();
  updateTimers();
  checkAchievements();
  if(changed) save();
}

/* ---------------- Сохранение ---------------- */
function save(){
  if(!persistenceReady){ pendingSave = true; return; }
  state.savedAt = Date.now();
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }catch(e){ /* noop */ }
  if(!bridgeOnline || !bridgeApi || !bridgeApi.storage) return;
  try{
    const request = bridgeApi.storage.set(SAVE_KEY, JSON.stringify(state));
    if(request && request.catch) request.catch(function(){});
  }catch(e){ /* noop */ }
}
function enablePersistence(){
  if(persistenceReady) return;
  persistenceReady = true;
  if(pendingSave){ pendingSave = false; save(); }
}
/* ---------------- Fullscreen ---------------- */
function toggleFullscreen(){
  try{
    if(!document.fullscreenElement){
      const req = document.documentElement.requestFullscreen();
      if(req && req.catch) req.catch(function(){});
    }else{
      const exit = document.exitFullscreen();
      if(exit && exit.catch) exit.catch(function(){});
    }
  }catch(e){ /* noop */ }
}

/* ---------------- Mute ---------------- */
function setMuted(v){
  isMuted = !!v;
  state.muted = isMuted;
  const btn = $('muteBtn');
  if(btn){
    btn.classList.toggle('is-muted', isMuted);
    btn.setAttribute('aria-label', isMuted ? 'Звук выключен' : 'Звук включён');
  }
  if(!isMuted){
    unlockAudio().then(function(){ sfxClick(); });
  }
  renderProfile();
  save();
}

/* ---------------- События ---------------- */
document.addEventListener('click', function(e){
  const backdrop = e.target.classList && e.target.classList.contains('modal-backdrop');
  if(backdrop){ closeModal(); return; }

  const tabBtn = e.target.closest('[data-tab]');
  if(tabBtn){ sfxClick(); setTab(tabBtn.dataset.tab); return; }

  const btn = e.target.closest('[data-action]');
  if(!btn) return;
  const action = btn.dataset.action;
  if(action === 'close-modal'){ closeModal(); return; }
  if(btn.disabled) return;
  sfxClick();

  switch(action){
    case 'toggle-mute':
      setMuted(!isMuted);
      break;
    case 'close-achievement':
      closeAchievement();
      break;
    case 'open-welcome':
      modal = { type:'welcome' };
      renderModal();
      break;
    case 'close-welcome':
      closeModal();
      break;
    case 'toggle-fullscreen':
      toggleFullscreen();
      break;
    case 'filter':
      state.filter = parseInt(btn.dataset.league, 10) || 0;
      genMarket();
      renderAll();
      save();
      break;
    case 'refresh-market':
      refreshMarket(true);
      break;
    case 'ad-refresh':
      showRewardedAd(function(){ refreshMarket(true); }, 'refresh');
      break;
    case 'auction-bid':
      playerBid(parseInt(btn.dataset.step, 10) || 5);
      break;
    case 'ad-diagnose': {
      const l = findListing(btn.dataset.id);
      showRewardedAd(function(){ freeDiagnose(l); }, 'diagnose');
      break;
    }
    case 'ad-speedup':
      showRewardedAd(function(){ boostSale(parseInt(btn.dataset.uid, 10)); }, 'speedup');
      break;
    case 'open-vip':
      modal = { type:'vip' };
      renderModal();
      break;
    case 'buy-vip':
      activateVip();
      break;
    case 'go-tab':
      setTab(btn.dataset.target || 'market');
      break;
    case 'open-listing': {
      const l = findListing(btn.dataset.id);
      if(l && upg('legal') > 0){ l.known.docs = true; renderMarket(); }
      modal = { type:'listing', id: btn.dataset.id };
      renderModal();
      break;
    }
    case 'inspect-basic': {
      basicInspect(findListing(btn.dataset.id));
      renderModal();
      renderMarket();
      save();
      break;
    }
    case 'inspect-deep': {
      deepInspect(findListing(btn.dataset.id));
      syncMoney(true);
      renderModal();
      renderMarket();
      save();
      break;
    }
    case 'bargain': {
      bargain(findListing(btn.dataset.id), btn.dataset.opt);
      renderModal();
      renderMarket();
      save();
      break;
    }
    case 'buy-listing':
      buyListing(btn.dataset.id);
      break;
    case 'prep':
      doPrep(parseInt(btn.dataset.uid, 10), btn.dataset.kind);
      break;
    case 'open-sell':
      modal = { type:'sell', uid: parseInt(btn.dataset.uid, 10) };
      renderModal();
      break;
    case 'confirm-sell':
      startSale(parseInt(btn.dataset.uid, 10));
      break;
    case 'delist': {
      const car = findCar(parseInt(btn.dataset.uid, 10));
      if(car){ car.sale = null; renderAll(); save(); toast('Объявление снято', 'warn'); }
      break;
    }
    case 'accept-offer':
      acceptOffer(parseInt(btn.dataset.uid, 10), btn.dataset.oid);
      break;
    case 'counter-offer':
      counterOffer(parseInt(btn.dataset.uid, 10), btn.dataset.oid);
      break;
    case 'upgrade':
      buyUpgrade(btn.dataset.key);
      break;
    case 'invite-friend':
      inviteFriend();
      break;
    case 'reset':
      if(confirm('Начать заново? Весь прогресс будет удалён.')){
        try{ localStorage.removeItem(SAVE_KEY); }catch(err){ /* noop */ }
        if(bridgeOnline && bridgeApi && bridgeApi.storage){
          try{
            const request = bridgeApi.storage.delete(SAVE_KEY);
            if(request && request.catch) request.catch(function(){});
          }catch(err){ /* noop */ }
        }
        state = defaultState();
        isMuted = false;
        shownMoney = state.money;
        genMarket();
        closeModal();
        renderAll();
        syncMoney(false);
        setTab('market');
        save();
        toast('Новая история началась', 'good');
      }
      break;
  }
});

document.addEventListener('touchmove', function(e){
  if(!document.body.classList.contains('modal-open')) return;
  const target = e.target;
  if(target && target.closest && target.closest('.modal-body, .ach-modal, .ad-box')) return;
  if(e.cancelable) e.preventDefault();
}, { passive: false });

document.addEventListener('keydown', function(e){
  if(e.key === 'Escape' && achOpen){ closeAchievement(); return; }
  if(e.key === 'Escape' && modal) closeModal();
  if(e.key === 'Enter' && modal && modal.type === 'sell'){
    const input = $('salePriceInput');
    if(input && document.activeElement === input) startSale(modal.uid);
  }
});

window.addEventListener('beforeunload', function(){ persistenceReady = true; save(); });

document.addEventListener('i18n:change', function(){
  try{ renderAll(); syncMoney(false); }catch(err){ /* noop */ }
});

/* ---------------- Инициализация ---------------- */
function claimTelegramRefBonus(){
  try{
    const param = (window.TGRef && TGRef.startParam()) || '';
    if(param.indexOf('ref_') !== 0) return;
    if(localStorage.getItem('tgRefClaimed') === '1') return;
    localStorage.setItem('tgRefClaimed', '1');
    state.money += 45000;
    syncMoney(true);
    save();
    toast(isEn() ? 'Friend invite bonus claimed! +$500' : 'Бонус по приглашению друга получен! +$500', 'good');
  }catch(err){ /* noop */ }
}
function inviteFriend(){
  const now = Date.now();
  let last = 0;
  try{ last = parseInt(localStorage.getItem('tgInviteAt') || '0', 10) || 0; }catch(err){ last = 0; }
  if(now - last < 300000){
    toast(isEn() ? 'Invite again in 5 minutes' : 'Повторное приглашение доступно через 5 минут', 'warn');
    return;
  }
  try{ localStorage.setItem('tgInviteAt', String(now)); }catch(err){ /* noop */ }
  if(window.TGRef) TGRef.share();
  else if(window.Telegram && Telegram.WebApp) Telegram.WebApp.openTelegramLink('https://t.me/share/url?url=' + encodeURIComponent('https://t.me/' + TG_BOT_USERNAME + '?startapp=ref_' + Date.now()));
  state.money += 27000;
  syncMoney(true);
  save();
  renderAll();
  toast(isEn() ? 'Invite sent: +$300' : 'Приглашение отправлено: +$300', 'good');
}

function init(loaded){
  state = loaded || defaultState();
  isMuted = !!state.muted;
  shownMoney = state.money;
  state.stats.maxMoney = Math.max(state.stats.maxMoney || 0, state.money);

  if(!state.listings.length) genMarket();
  while(state.listings.length < 6) state.listings.push(genListing());
  renderAll();
  syncMoney(false);
  setTab(state.tab || 'market');
  updateTimers();
  syncMobileHeader();
  setInterval(tick, 1000);
  enablePersistence();
  setTimeout(function(){
    if(modal) return;
    modal = { type:'welcome' };
    renderModal();
  }, 600);
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      try{ $('app').classList.add('is-ready'); }catch(e){ /* noop */ }
      pgSend('game_ready');
    });
  });
}

function boot(){
  initBridge().then(function(){
    return pgLoadSave();
  }).then(function(loaded){
    init(loaded);
  }).catch(function(){
    init(null);
  });
}

boot();
