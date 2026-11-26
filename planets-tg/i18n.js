(function () {
  'use strict';

  var DICT = {
    'Счёт': 'Score',
    'Рекорд': 'Best',
    'Далее': 'Next',
    'Выключить звук': 'Mute',
    'Включить звук': 'Unmute',
    'Пауза': 'Pause',
    'Продолжить': 'Resume',
    'На весь экран': 'Fullscreen',
    'Выйти из полноэкранного режима': 'Exit fullscreen',
    'Космическая головоломка': 'Space puzzle',
    'Соединяй астероиды, планеты и звёзды — доберись до чёрной дыры.':
      'Merge asteroids, planets and stars — reach the black hole.',
    'Играть': 'Play',
    'Двигай прицел мышью или пальцем': 'Move the aim with mouse or finger',
    'и отпусти, чтобы сбросить объект': 'and release to drop the object',
    'Вселенная подождёт': 'The universe can wait',
    'Продолжи, когда будешь готов.': 'Resume when you are ready.',
    'Заново': 'Restart',
    'Стакан переполнен': 'Container overflow',
    'Игра окончена': 'Game over',
    'Итоговый счёт': 'Final score',
    'Новый рекорд': 'New best score',
    'Рекорд: 0': 'Best: 0',
    'Второй шанс · Реклама': 'Second chance · Ad',
    'В меню': 'Menu',
    'Поделиться рекордом': 'Share score',
    'Закрытый клуб': 'Private club',
    'VIP на 24 часа': 'VIP for 24 hours',
    'Смотри 5 коротких роликов — и получи VIP на 24 часа: без рекламы и с безлимитными бустерами.':
      'Watch 5 short videos and get VIP for 24 hours: no ads and unlimited boosters.',
    'Активировать VIP на 24ч (0/5 рекламы)': 'Activate VIP for 24h (0/5 ads)',
    'Закрыть': 'Close',
    'Эволюция': 'Evolution',
    'Встряхнуть стакан': 'Shake the jar',
    'Убрать мелкие': 'Clear small planets',
    'Убрать мелкие планеты': 'Clear small planets',
    '+1 Бустер за рекламу': '+1 Booster for ad',
    '+1 Бустер за друга': '+1 Booster for friend',
    'ОПАСНО •': 'DANGER •',
    'ОПАСНО': 'DANGER',
    'Настройки': 'Settings',
    'Язык': 'Language',
    'Звуковые эффекты': 'Sound effects',
    'Вибрация': 'Vibration',
    'Вкл': 'On',
    'Выкл': 'Off',
    'Не удалось загрузить физический движок.': 'Failed to load the physics engine.',
    'Проверьте подключение к интернету и обновите страницу.':
      'Check your internet connection and reload the page.',
    'Астероид': 'Asteroid',
    'Луна': 'Moon',
    'Меркурий': 'Mercury',
    'Венера': 'Venus',
    'Марс': 'Mars',
    'Земля': 'Earth',
    'Нептун': 'Neptune',
    'Уран': 'Uranus',
    'Сатурн': 'Saturn',
    'Юпитер': 'Jupiter',
    'Солнце': 'Sun',
    'Чёрная дыра': 'Black hole',
    'Рекорд:': 'Best:',
    'КОМБО ×': 'COMBO ×',
    'Стакан встряхнут!': 'Jar shaken!',
    'Мелких объектов нет': 'No small objects left',
    'Убрано объектов:': 'Objects removed:',
    '+1 заряд к каждому бустеру!': '+1 charge for every booster!',
    'VIP активирован на 24 часа': 'VIP activated for 24 hours',
    'VIP уже активен': 'VIP is already active',
    'VIP активен': 'VIP active',
    'Просмотр': 'View',
    'Активно: осталось': 'Active: left',
    'Прогресс:': 'Progress:',
    'Реклама недоступна': 'Ad unavailable',
    'Реклама не была просмотрена': 'Ad was not watched',
    'Второй шанс! Игра продолжается': 'Second chance! The game continues',
    'Поделиться недоступно': 'Sharing unavailable',
    'Спасибо, что поделились!': 'Thanks for sharing!',
    'Не удалось поделиться': 'Sharing failed',
    'Следующий объект:': 'Next object:',
    '+1 «Встряхнуть стакан»': '+1 “Shake the jar”',
    '+1 «Убрать мелкие»': '+1 “Clear small”',
    'Темы': 'Themes',
    'Космические темы': 'Cosmic Themes',
    'Классический космос': 'Classic Cosmos',
    'Неоновые сферы': 'Neon Spheres',
    'Драгоценные кристаллы': 'Precious Crystals',
    'Стандартный дизайн планет и фона': 'Default planet and background design',
    'Глубокий кибер-индиго и светящиеся сферы': 'Deep cyber indigo with glowing spheres',
    'Королевский пурпур, золото и гранёные самоцветы':
      'Royal purple, gold and faceted gemstones',
    'Активна': 'Active',
    'Выбрать': 'Select',
    'Награды': 'Daily',
    'Бонусы орбиты': 'Orbit Bonuses',
    'Приходите завтра за новым подарком': 'Come back tomorrow for a new gift',
    'Ежедневные награды': 'Daily Rewards',
    'Забрать': 'Claim',
    'Забрать ×2 за рекламу': 'Claim ×2 (Ad)',
    'Выбор темы сохраняется автоматически': 'Your theme is saved automatically',
    'Заходи каждый день — на 7-й день суперприз':
      'Come back every day — the grand prize is on day 7',
    'Награда получена': 'Reward claimed',
    'Награда получена!': 'Reward claimed!',
    'Награда удвоена!': 'Reward doubled!',
    'Сегодня уже получено': 'Already claimed today',
    'Тема выбрана': 'Theme applied',
    'Суперприз': 'Grand prize',
    '+1 бустер «Встряхнуть»': '+1 Shake booster',
    '+1 бустер «Убрать мелкие»': '+1 Clear Small booster',
    '+2 бустера «Встряхнуть»': '+2 Shake boosters',
    '+2 бустера «Убрать мелкие»': '+2 Clear Small boosters',
    '+1 бустер каждого вида': '+1 booster of each kind',
    '+3 бустера «Встряхнуть»': '+3 Shake boosters',
    'VIP на 12 часов': '12h VIP Status',
    'Меню': 'Menu',
    'Космический рейтинг': 'Space Leaderboard',
    'Ваша лига': 'Your league',
    'Место': 'Rank',
    'Бронзовая орбита': 'Bronze Orbit',
    'Серебряный пояс': 'Silver Belt',
    'Золотая туманность': 'Gold Nebula',
    'Платиновый квазар': 'Platinum Quasar',
    'Повелитель Галактики': 'Galaxy Overlord',
    'Первые шаги среди звёзд': 'First steps among the stars',
    'Уверенный покоритель орбит': 'A confident conqueror of orbits',
    'Мастер гравитации и комбо': 'Master of gravity and combos',
    'Элита звёздных систем': 'Elite of star systems',
    'Абсолютный чемпион Вселенной': 'Absolute champion of the Universe',
    'Все лиги': 'All leagues',
    'Сейчас': 'Current',
    'ВЫ': 'YOU',
    'Бросить вызов друзьям': 'Challenge Friends',
    'Максимальная лига': 'Top league',
    'До следующей лиги': 'To next league',
    'Гость': 'Guest',
    'Игрок': 'Player'
  };

  var PATTERNS = [
    [/^Рекорд: (.+)$/, 'Best: $1'],
    [/^КОМБО ×(\d+)$/, 'COMBO ×$1'],
    [/^ОПАСНО • ([\d.]+)с$/, 'DANGER • $1s'],
    [/^Убрано объектов: (\d+)$/, 'Objects removed: $1'],
    [/^\+1 заряд к каждому бустеру!$/, '+1 charge for every booster!'],
    [/^Активно: осталось (.+)$/, function (core, m) { return 'Active: left ' + vipLeft(m[1]); }],
    [/^Прогресс: (\d+) из 5 · VIP на 24 часа$/, 'Progress: $1 of 5 · VIP for 24 hours'],
    [/^Активировать VIP на 24ч \((.+)\)$/, 'Activate VIP for 24h ($1)'],
    [/^Просмотр (\d+)\/5 · осталось (\d+)$/, 'View $1/5 · left $2'],
    [/^(\d+)\s*ч\s*(\d+)\s*м$/, function (core, m) { return m[1] + 'h ' + m[2] + 'm'; }],
    [/^(\d+)\s*м$/, '$1m'],
    [/^(\d+\.\d+)\s*с$/, '$1 s'],
    [/^(\d+)\s*с$/, '$1 s'],
    [/^Следующий объект: (.+)$/, function (core, m) {
      return 'Next object: ' + (DICT[normalize(m[1])] || m[1]);
    }],
    [/^(\d+)\s*из\s*(\d+)$/, '$1 of $2'],
    [/^Открыть за рекламу \((\d+)\/(\d+)\)$/, 'Unlock via Ad ($1/$2)'],
    [/^Просмотр (\d+)\/(\d+)$/, 'Viewed $1/$2'],
    [/^День (\d+)$/, 'Day $1'],
    [/^До следующей лиги: (.+)$/, 'To next league: $1']
  ];

  function normalize(value) {
    return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
  }

  function vipLeft(text) {
    var m = String(text).match(/^(\d+)\s*ч\s*(\d+)\s*м$/);
    if (m) return m[1] + 'h ' + m[2] + 'm';
    m = String(text).match(/^(\d+)\s*м$/);
    if (m) return m[1] + 'm';
    return text;
  }

  function translate(value) {
    var core = normalize(value);
    if (!core) return null;
    if (Object.prototype.hasOwnProperty.call(DICT, core)) return DICT[core];
    for (var i = 0; i < PATTERNS.length; i++) {
      var rule = PATTERNS[i];
      var match = core.match(rule[0]);
      if (!match) continue;
      if (typeof rule[1] === 'function') return rule[1](core, match);
      return core.replace(rule[0], rule[1]);
    }
    return null;
  }

  var lang = 'ru';
  var manualKey = 'planets_lang';
  var originals = new WeakMap();
  var observer = null;
  var applying = false;
  var pending = false;

  function applyTextNode(node) {
    var raw = node.nodeValue;
    if (!raw || !/\S/.test(raw)) return;
    if (lang === 'en') {
      var mapped = translate(raw);
      if (!mapped || mapped === raw.trim()) return;
      if (!originals.has(node)) originals.set(node, raw);
      node.nodeValue = raw.match(/^\s*/)[0] + mapped + raw.match(/\s*$/)[0];
    } else if (originals.has(node)) {
      node.nodeValue = originals.get(node);
      originals.delete(node);
    }
  }

  function applyAttributes(el) {
    var attrs = ['aria-label', 'placeholder', 'title'];
    for (var i = 0; i < attrs.length; i++) {
      var name = attrs[i];
      if (!el.hasAttribute(name)) continue;
      var raw = el.getAttribute(name);
      if (lang === 'en') {
        var mapped = translate(raw);
        if (!mapped || mapped === raw) continue;
        var store = originals.get(el) || {};
        if (!store['@' + name]) store['@' + name] = raw;
        originals.set(el, store);
        el.setAttribute(name, mapped);
      } else {
        var saved = originals.get(el);
        if (saved && saved['@' + name]) el.setAttribute(name, saved['@' + name]);
      }
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { applyTextNode(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1 && (root.tagName === 'SCRIPT' || root.tagName === 'STYLE' || root.tagName === 'SVG')) return;
    if (root.nodeType === 1) applyAttributes(root);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
    var node = walker.nextNode();
    while (node) {
      if (node.nodeType === 3) applyTextNode(node);
      else if (node.nodeType === 1) {
        if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'SVG') {
          node = walker.nextSibling();
          continue;
        }
        applyAttributes(node);
      }
      node = walker.nextNode();
    }
  }

  function run(root) {
    if (applying) { pending = true; return; }
    applying = true;
    try { walk(root || document.body); } finally { applying = false; }
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      run(document.body);
    });
  }

  function watch() {
    if (observer || typeof MutationObserver !== 'function' || !document.body) return;
    observer = new MutationObserver(function () {
      if (applying || pending) return;
      schedule();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function syncSwitches() {
    var buttons = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < buttons.length; i++) {
      var active = buttons[i].getAttribute('data-lang') === lang;
      buttons[i].classList.toggle('is-active', active);
      buttons[i].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  function setLang(next, persist) {
    next = next === 'en' ? 'en' : 'ru';
    lang = next;
    if (!setLang.baseTitle) setLang.baseTitle = document.title;
    document.title = next === 'en'
      ? 'Merge Cosmos — space merge puzzle'
      : (setLang.baseTitle || document.title);
    document.documentElement.lang = next;
    document.body.classList.toggle('lang-en', next === 'en');
    if (persist) {
      try { localStorage.setItem(manualKey, next); } catch (err) { /* noop */ }
    }
    run(document.body);
    syncSwitches();
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: next } }));
  }

  function storedLang() {
    try { return localStorage.getItem(manualKey); } catch (err) { return null; }
  }

  function auto(platformLanguage) {
    var saved = storedLang();
    var next = saved === 'ru' || saved === 'en'
      ? saved
      : (String(platformLanguage || 'ru').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en');
    setLang(next, false);
  }

  function t(value) {
    if (lang !== 'en') return value;
    var mapped = translate(value);
    return mapped == null ? value : mapped;
  }

  window.I18N = {
    get lang() { return lang; },
    setLang: setLang,
    auto: auto,
    t: t,
    run: function () { run(document.body); },
    refresh: syncSwitches
  };

  function ready() {
    watch();
    document.addEventListener('click', function (event) {
      var btn = event.target && event.target.closest ? event.target.closest('[data-lang]') : null;
      if (!btn) return;
      event.preventDefault();
      setLang(btn.getAttribute('data-lang'), true);
    }, true);
    var saved = storedLang();
    if (saved === 'ru' || saved === 'en') setLang(saved, false);
    else syncSwitches();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
