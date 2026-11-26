(function () {
  'use strict';

  var listeners = {};
  var tg = null;
  try { tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null; } catch (err) { tg = null; }

  function on(evt, cb) {
    if (!listeners[evt]) listeners[evt] = [];
    listeners[evt].push(cb);
  }

  function emit(evt, payload) {
    var list = listeners[evt];
    if (!list) return;
    for (var i = 0; i < list.length; i++) {
      try { list[i](payload); } catch (err) {}
    }
  }

  var lang = 'ru';
  try {
    if (tg) {
      tg.ready();
      tg.expand();
      if (typeof tg.requestFullscreen === 'function') { try { tg.requestFullscreen(); } catch (_) {} }
      if (typeof tg.disableVerticalSwipes === 'function') tg.disableVerticalSwipes();
      var code = tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.language_code;
      if (code) lang = String(code).toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
    }
  } catch (err) {}

  function applyTopInset() {
    var top = 0;
    try {
      top = ((tg && tg.safeAreaInset && tg.safeAreaInset.top) || 0) +
        ((tg && tg.contentSafeAreaInset && tg.contentSafeAreaInset.top) || 0);
    } catch (err) { top = 0; }
    document.documentElement.style.setProperty('--tg-top-inset', top + 'px');
  }
  applyTopInset();
  try {
    if (tg && typeof tg.onEvent === 'function') {
      tg.onEvent('fullscreenChanged', applyTopInset);
      tg.onEvent('safeAreaChanged', applyTopInset);
      tg.onEvent('contentSafeAreaChanged', applyTopInset);
    }
  } catch (err) {}

  function lsGet(key) {
    try { return localStorage.getItem(key); } catch (err) { return null; }
  }

  function lsSet(key, value) {
    try { localStorage.setItem(key, String(value)); } catch (err) {}
  }

  function startParam() {
    try { return (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || ''; } catch (err) { return ''; }
  }

  function userId() {
    var id = 0;
    try { id = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) || 0; } catch (err) { id = 0; }
    if (!id) {
      id = parseInt(lsGet('tgUid') || '0', 10) || 0;
      if (!id) {
        id = Math.floor(100000000 + Math.random() * 899999999);
        lsSet('tgUid', id);
      }
    }
    return id;
  }

  function inviteUrl() {
    var bot = (window.TG_BOT_USERNAME || 'planet_merge_game_bot').replace(/^@/, '');
    return 'https://t.me/' + bot + '/game?startapp=ref_' + userId();
  }

  function share() {
    var url = inviteUrl();
    var text = 'Join me in the game!';
    if (window.I18N && I18N.lang === 'ru') text = 'Присоединяйся к игре!';
    try {
      if (tg && typeof tg.openTelegramLink === 'function') {
        tg.openTelegramLink('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text));
        return true;
      }
    } catch (err) {}
    try { window.open('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text), '_blank'); } catch (err) {}
    return true;
  }

  window.TGRef = {
    startParam: startParam,
    userId: userId,
    inviteUrl: inviteUrl,
    share: share
  };

  function adErrorMessage() {
    return (window.I18N && I18N.lang === 'en')
      ? 'Ad is temporarily unavailable, please try again later'
      : 'Реклама временно недоступна, попробуйте позже';
  }

  function notifyAdError() {
    var msg = adErrorMessage();
    try {
      if (typeof window.showGameToast === 'function') { window.showGameToast(msg); return; }
      if (typeof window.toast === 'function') { window.toast(msg, 'warn'); }
    } catch (err) {}
  }

  window.AdController = {
    show: function () {
      var block = window.ADSGRAM_BLOCK_ID || '61632';
      if (!window.Adsgram) {
        return Promise.reject(new Error('Adsgram SDK not loaded'));
      }
      var ad = null;
      try {
        ad = window.Adsgram.init({ blockId: block, debug: false });
      } catch (err) {
        return Promise.reject(err);
      }
      return Promise.resolve(ad.show()).then(function (result) {
        var done = !!(result && (result.done === true || result.reward === true));
        return { done: done };
      });
    }
  };

  function runAd(kind, placement) {
    emit('pause_state_changed', true);
    emit(kind + '_state_changed', 'loading');
    emit(kind + '_state_changed', 'opened');
    return window.AdController.show().then(function (result) {
      if (result && result.done) emit(kind + '_state_changed', 'rewarded');
      else emit(kind + '_state_changed', 'closed');
      if (result && result.done) emit(kind + '_state_changed', 'closed');
      emit('pause_state_changed', false);
      return { done: !!(result && result.done) };
    }).catch(function (err) {
      emit(kind + '_state_changed', 'failed');
      emit('pause_state_changed', false);
      emit('audio_state_changed', true);
      notifyAdError();
      return { done: false, error: String(err) };
    });
  }

  window.bridge = {
    initialize: function () {
      if (window.I18N) {
        try { I18N.auto(lang); } catch (err) {}
      }
      return Promise.resolve(true);
    },
    platform: {
      get language() { return lang; },
      isAudioEnabled: true,
      sendMessage: function () { return Promise.resolve(); },
      on: on
    },
    advertisement: {
      isRewardedSupported: true,
      isInterstitialSupported: false,
      showRewarded: function (placement) { return runAd('rewarded', placement); },
      showInterstitial: function (placement) { return Promise.resolve(); },
      on: on
    },
    storage: {
      get: function (key) { return Promise.resolve(lsGet(key)); },
      set: function (key, value) { lsSet(key, value); return Promise.resolve(); },
      delete: function (key) { try { localStorage.removeItem(key); } catch (err) {} return Promise.resolve(); }
    },
    social: {
      share: function () { share(); return Promise.resolve({ success: true }); }
    }
  };
})();
