/* ============================================================
   庄方宜 · 个人档案  |  interaction layer
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- BOOT SEQUENCE ---------------- */
  (function boot() {
    var el = $('#boot'), bar = $('#bootBar'), pct = $('#bootPct'), log = $('#bootLog');
    if (!el) { return; }
    var skip = /[?&]noboot/.test(window.location.search);
    if (reduce || skip) {
      el.classList.add('is-done');
      document.body.classList.remove('is-locked');
      document.dispatchEvent(new CustomEvent('zfy:booted'));
      return;
    }

    var lines = [
      'END FIELD / WULING TERMINAL v3.11',
      'LINKING PERSONNEL DATABASE ... <em>OK</em>',
      'ID 0708 // 庄方宜 ZHUANG FANGYI',
      'MEDICAL CHECK ... <em>NON-INFECTED</em>',
      'COMPREHENSIVE TEST ... <em>LOADED</em>',
      'DECRYPTING FILE ... <em>DONE</em>'
    ];
    var i = 0, p = 0;

    var tick = setInterval(function () {
      p = Math.min(100, p + Math.random() * 9 + 3);
      if (bar) { bar.style.width = p + '%'; }
      if (pct) { pct.textContent = Math.round(p); }
      var want = Math.floor(p / 100 * lines.length);
      while (i < want && i < lines.length) {
        var d = document.createElement('i');
        d.innerHTML = '> ' + lines[i];
        log.appendChild(d);
        i++;
      }
      if (p >= 100) {
        clearInterval(tick);
        if (i < lines.length) {
          var d2 = document.createElement('i');
          d2.innerHTML = '> ' + lines[lines.length - 1];
          log.appendChild(d2);
        }
        setTimeout(function () {
          el.classList.add('is-done');
          document.body.classList.remove('is-locked');
          document.dispatchEvent(new CustomEvent('zfy:booted'));
        }, 420);
      }
    }, 190);

    document.body.classList.add('is-locked');
    setTimeout(function () {
      if (!el.classList.contains('is-done')) {
        el.classList.add('is-done');
        document.body.classList.remove('is-locked');
        document.dispatchEvent(new CustomEvent('zfy:booted'));
      }
    }, 4200);
  })();

  /* ---------------- TYPEWRITER ---------------- */
  (function typewriter() {
    var host = $('#typed');
    if (!host) { return; }
    var words = ['武陵科学发展区 · 管代', '息壤新材项目 · 负责人天师', '终末地工业 · 裂隙研究合作'];
    if (reduce) { host.textContent = words[0]; return; }
    var w = 0, c = 0, del = false;

    (function step() {
      var word = words[w];
      host.textContent = word.slice(0, c);
      var wait = del ? 34 : 92;
      if (!del && c === word.length) { del = true; wait = 1900; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; wait = 320; }
      else { c += del ? -1 : 1; }
      setTimeout(step, wait);
    })();
  })();

  /* ---------------- CLOCK ---------------- */
  (function clock() {
    var el = $('#clock');
    if (!el) { return; }
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    var run = function () {
      var d = new Date();
      el.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    };
    run();
    setInterval(run, 1000);
  })();

  (function year() {
    var y = $('#year');
    if (y) { y.textContent = new Date().getFullYear(); }
  })();

  /* ---------------- REVEAL ON SCROLL ---------------- */
  (function reveal() {
    var items = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduce) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      $$('.timeline__rail').forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          var d = el.getAttribute('data-delay');
          if (d) { el.style.transitionDelay = (0.12 * parseInt(d, 10)) + 's'; }
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });

    var rails = $$('.timeline__rail');
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io2.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    rails.forEach(function (el) { io2.observe(el); });
  })();

  /* ---------------- HUD: progress, active link, sticky ---------------- */
  (function hud() {
    var hud = $('#hud'), prog = $('#progress'), totop = $('#totop');
    var links = $$('.hud__link');
    var sections = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);

    var onScroll = function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (prog) { prog.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%'; }
      if (hud) { hud.classList.toggle('is-stuck', y > 30); }
      if (totop) { totop.classList.toggle('is-on', y > 700); }

      var active = null;
      var probe = y + window.innerHeight * 0.32;
      sections.forEach(function (s) {
        var top = s.offsetTop;
        if (probe >= top && probe < top + s.offsetHeight) { active = s.id; }
      });
      if (!active) {
        for (var i = sections.length - 1; i >= 0; i--) {
          if (probe >= sections[i].offsetTop) { active = sections[i].id; break; }
        }
      }
      links.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + active);
      });
    };

    var raf = false;
    window.addEventListener('scroll', function () {
      if (raf) { return; }
      raf = true;
      window.requestAnimationFrame(function () { onScroll(); raf = false; });
    }, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    if (totop) {
      totop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      });
    }
  })();

  /* ---------------- MOBILE NAV ---------------- */
  (function nav() {
    var btn = $('#burger'), nav = $('#nav');
    if (!btn || !nav) { return; }
    var close = function () { nav.classList.remove('is-open'); };
    btn.addEventListener('click', function () { nav.classList.toggle('is-open'); });
    $$('.hud__link', nav).forEach(function (a) { a.addEventListener('click', close); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); } });
  })();

  /* ---------------- RETICLE CURSOR ---------------- */
  (function reticle() {
    var r = $('#reticle');
    if (!r || reduce || window.matchMedia('(hover: none)').matches) { return; }
    var on = false;
    window.addEventListener('mousemove', function (e) {
      if (!on) { r.classList.add('is-on'); on = true; }
      r.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
    }, { passive: true });
    document.addEventListener('mouseover', function (e) {
      var hot = e.target.closest && e.target.closest('a,button,.card,.flow,.gift,.chibi,.portrait__frame');
      r.classList.toggle('is-hot', !!hot);
    });
    document.addEventListener('mouseleave', function () { r.classList.remove('is-on'); on = false; });
  })();

  /* ---------------- PORTRAIT PARALLAX ---------------- */
  (function parallax() {
    var p = $('#portrait'), img = $('.portrait__img');
    if (!p || !img || reduce || window.matchMedia('(hover: none)').matches) { return; }
    p.addEventListener('mousemove', function (e) {
      var b = p.getBoundingClientRect();
      var dx = (e.clientX - (b.left + b.width / 2)) / b.width;
      var dy = (e.clientY - (b.top + b.height / 2)) / b.height;
      img.style.transform = 'scale(1.06) translate3d(' + (dx * -12) + 'px,' + (dy * -12) + 'px,0)';
    });
    p.addEventListener('mouseleave', function () { img.style.transform = ''; });
  })();

  /* ---------------- RADAR CHART ---------------- */
  (function radar() {
    var cv = $('#radar');
    if (!cv || !cv.getContext) { return; }
    var ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height;
    var cx = W / 2, cy = H / 2 + 8, R = Math.min(W, H) * 0.33;
    var labels = ['生理强度', '作战技巧', '源石技艺适应性', '战术规划'];
    var values = [0.56, 0.56, 0.97, 0.82];
    var colors = ['#c6d93c', '#c6d93c', '#7fe3c0', '#a8d84a'];

    var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

    function draw(prog) {
      ctx.clearRect(0, 0, W, H);
      var rings = 4;

      // grid rings
      for (var r = 1; r <= rings; r++) {
        var rr = R * (r / rings);
        ctx.beginPath();
        for (var i = 0; i <= 4; i++) {
          var a = -Math.PI / 2 + i * (Math.PI * 2 / 4);
          var x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
          if (i === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
        }
        ctx.closePath();
        ctx.strokeStyle = r === rings ? 'rgba(198,217,60,.42)' : 'rgba(198,217,60,.16)';
        ctx.lineWidth = r === rings ? 1.4 : 1;
        ctx.stroke();
      }

      // spokes
      for (var s = 0; s < 4; s++) {
        var ang = -Math.PI / 2 + s * (Math.PI * 2 / 4);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R);
        ctx.strokeStyle = 'rgba(198,217,60,.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // value polygon
      ctx.beginPath();
      for (var v = 0; v < 4; v++) {
        var a2 = -Math.PI / 2 + v * (Math.PI * 2 / 4);
        var val = R * values[v] * prog;
        var x2 = cx + Math.cos(a2) * val, y2 = cy + Math.sin(a2) * val;
        if (v === 0) { ctx.moveTo(x2, y2); } else { ctx.lineTo(x2, y2); }
      }
      ctx.closePath();
      var grad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      grad.addColorStop(0, 'rgba(198,217,60,.30)');
      grad.addColorStop(1, 'rgba(127,227,192,.18)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = '#c6d93c';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(198,217,60,.7)';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // vertices
      for (var k = 0; k < 4; k++) {
        var a3 = -Math.PI / 2 + k * (Math.PI * 2 / 4);
        var val3 = R * values[k] * prog;
        var x3 = cx + Math.cos(a3) * val3, y3 = cy + Math.sin(a3) * val3;
        ctx.beginPath();
        ctx.arc(x3, y3, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0c09';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = colors[k];
        ctx.stroke();
      }

      // labels
      ctx.font = '600 22px "Noto Sans SC", "Chakra Petch", sans-serif';
      ctx.textBaseline = 'middle';
      for (var L = 0; L < 4; L++) {
        var al = -Math.PI / 2 + L * (Math.PI * 2 / 4);
        var lx = cx + Math.cos(al) * (R + 66);
        var ly = cy + Math.sin(al) * (R + 44);
        ctx.fillStyle = colors[L];
        ctx.textAlign = Math.abs(Math.cos(al)) < 0.2 ? 'center' : (Math.cos(al) > 0 ? 'left' : 'right');
        ctx.fillText(labels[L], lx, ly);
      }
    }

    var played = false;
    function play() {
      if (played) { return; }
      played = true;
      if (reduce) { draw(1); return; }
      var start = null, dur = 1500;
      var frame = function (ts) {
        if (start === null) { start = ts; }
        var t = Math.min(1, (ts - start) / dur);
        draw(easeOut(t));
        if (t < 1) { window.requestAnimationFrame(frame); }
      };
      window.requestAnimationFrame(frame);
    }

    draw(reduce ? 1 : 0.001);

    var host = cv.closest('.card--radar');
    if ('IntersectionObserver' in window && host) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { play(); io.disconnect(); } });
      }, { threshold: 0.25 });
      io.observe(host);
    } else {
      play();
    }
    window.addEventListener('resize', function () { if (played) { draw(1); } });
  })();

  /* ---------------- SMOOTH ANCHORS ---------------- */
  (function anchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id === '#' || id.length < 2) { return; }
        var t = $(id);
        if (!t) { return; }
        e.preventDefault();
        var off = t.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: off, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  })();

  /* ---------------- HERO DECOR: random id ticks ---------------- */
  (function ticks() {
    if (reduce) { return; }
    var host = $('.portrait__plate');
    if (!host) { return; }
    var base = host.querySelector('span');
    if (!base) { return; }
    var raw = base.textContent;
    setInterval(function () {
      base.textContent = raw + ' · ' + Math.random().toString(16).slice(2, 6).toUpperCase();
    }, 2600);
  })();

})();