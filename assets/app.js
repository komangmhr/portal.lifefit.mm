/* LifeFit MM portal — bug-fix design prototype. Vanilla JS, hash routing.
   Data that would come from the CMS is in DATA below, with the CMS field it maps to. */
(function () {
  'use strict';

  // ---------- storage (simulates server persistence for LF-315/319/327/329/279) ----------
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('lfmm:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return mem[k] !== undefined ? mem[k] : d; } },
    set: function (k, v) { mem[k] = v; try { localStorage.setItem('lfmm:' + k, JSON.stringify(v)); } catch (e) {} },
    reset: function () { mem = {}; try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf('lfmm:') === 0) localStorage.removeItem(k); }); } catch (e) {} }
  };
  var mem = {};

  // ---------- icons ----------
  var I = {
    back: '<path d="M15 5l-7 7 7 7"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flame: '<path d="M12 3c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3-1-5 1-8z"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    dumbbell: '<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19 14 10"/>',
    moon: '<path d="M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10z"/>',
    lotus: '<path d="M12 20c-4 0-8-2-9-6 3 0 6 1 9 4 3-3 6-4 9-4-1 4-5 6-9 6z"/><path d="M12 18c-2-3-2-8 0-12 2 4 2 9 0 12z"/>',
    bowl: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 2-2.5 2-2.5 4M12 17h.01"/>',
    out: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    laptop: '<rect x="4" y="5" width="16" height="11" rx="1"/><path d="M2 19h20"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    send: '<path d="M4 12l16-8-6 16-3-7z"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M10 17h4v4h-4z"/>',
    scale: '<path d="M5 4h14v16H5z"/><path d="M9 9a3 3 0 0 1 6 0M12 9l1-2"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>'
  };
  function ic(n, extra) { return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (extra || '') + '>' + (I[n] || '') + '</svg>'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ---------- i18n (LF-293) — strings managed in CMS > Translations ----------
  var STR = {
    en: { nav_home: 'Home', nav_explore: 'Explore', nav_fitness: 'Fitness', nav_profile: 'Profile', daily: 'Daily Progress', of_goal: 'of daily goal', move: 'Move', eat: 'Eat Healthy', mind: 'Mind', min: 'min', meals: 'meals', feed: 'Feed', cancel: 'Cancel', hello: 'Good afternoon' },
    my: { nav_home: 'ပင်မ', nav_explore: 'ရှာဖွေရန်', nav_fitness: 'ကြံ့ခိုင်ရေး', nav_profile: 'ပရိုဖိုင်', daily: 'နေ့စဉ် တိုးတက်မှု', of_goal: 'နေ့စဉ်ပန်းတိုင်၏', move: 'လှုပ်ရှားမှု', eat: 'ကျန်းမာစွာစားသောက်', mind: 'စိတ်', min: 'မိနစ်', meals: 'နပ်', feed: 'သတင်း', cancel: 'မလုပ်တော့ပါ', hello: 'မင်္ဂလာ နေ့လယ်ခင်းပါ' },
    id: { nav_home: 'Beranda', nav_explore: 'Jelajah', nav_fitness: 'Kebugaran', nav_profile: 'Profil', daily: 'Progres Harian', of_goal: 'dari target harian', move: 'Gerak', eat: 'Makan Sehat', mind: 'Pikiran', min: 'mnt', meals: 'porsi', feed: 'Beranda Info', cancel: 'Batal', hello: 'Selamat siang' }
  };
  function lang() { return store.get('lang', 'en'); }
  function t(k) { var l = STR[lang()] || STR.en; return l[k] || STR.en[k] || k; }

  // ---------- data (fields that come from CMS) ----------
  var DATA = {
    recipes: [ // CMS Recipes: meal_category[] (LF-285), cook_time_min + calories (LF-342), typo fixed (LF-343)
      { id: 24, name: 'Protein Parfait', cat: ['Breakfast', 'Snacks'], time: 10, kcal: 320, p: 45, c: 26, f: 2.5, ing: ['1/2 cup rolled oats', '1 cup greek yogurt', '1 scoop vanilla whey', '1/2 cup mixed berries', '1 tsp honey'] },
      { id: 25, name: 'Green Protein Smoothie', cat: ['Breakfast', 'Snacks'], time: 5, kcal: 240, p: 28, c: 22, f: 5, ing: ['1 cup spinach', '1 banana', '1 scoop whey', '1 cup almond milk'] },
      { id: 26, name: 'Lemon Blueberry Pancakes', cat: ['Breakfast'], time: 20, kcal: 410, p: 24, c: 52, f: 11, ing: ['1 cup oat flour', '2 eggs', '1/2 cup blueberries', 'Zest of 1 lemon'] },
      { id: 27, name: 'Green Omelette', cat: ['Breakfast', 'Lunch'], time: 12, kcal: 290, p: 22, c: 6, f: 19, ing: ['3 eggs', '1 cup spinach', '1/4 avocado'] },
      { id: 28, name: 'Zucchini Onion Omelette', cat: ['Lunch'], time: 15, kcal: 260, p: 20, c: 9, f: 16, ing: ['3 eggs', '1 zucchini', '1/2 onion'] },
      { id: 29, name: 'Chicken Quinoa Bowl', cat: ['Lunch', 'Dinner'], time: 25, kcal: 520, p: 42, c: 48, f: 14, ing: ['150 g chicken breast', '1 cup cooked quinoa', 'Cherry tomatoes', 'Cucumber'] },
      { id: 30, name: 'Baked Salmon & Greens', cat: ['Dinner'], time: 30, kcal: 480, p: 38, c: 12, f: 28, ing: ['160 g salmon', 'Broccoli', 'Green beans', 'Olive oil'] },
      { id: 31, name: 'Hummus Veggie Cups', cat: ['Snacks'], time: 5, kcal: 180, p: 7, c: 18, f: 9, ing: ['3 tbsp hummus', 'Carrot sticks', 'Cucumber sticks'] }
    ],
    yoga: [ // CMS Yoga: level (LF-286), style (LF-317), featured flag
      { name: 'Morning Flow', style: 'Vinyasa', level: 'Beginner', min: 20, kcal: 110, featured: true },
      { name: 'Vinyasa Flow', style: 'Vinyasa', level: 'Intermediate', min: 30, kcal: 190 },
      { name: 'Hatha Basics', style: 'Hatha', level: 'Beginner', min: 25, kcal: 120 },
      { name: 'Hatha Balance', style: 'Hatha', level: 'Intermediate', min: 30, kcal: 150 },
      { name: 'Restorative Yoga', style: 'Restorative', level: 'Beginner', min: 35, kcal: 90 },
      { name: 'Power Core', style: 'Power', level: 'Intermediate', min: 25, kcal: 210 },
      { name: 'Power Yoga', style: 'Power', level: 'Advanced', min: 40, kcal: 320 }
    ],
    mind: [ // CMS Mind: category (LF-287)
      { name: 'Calm Before Sleep', cat: ['Sleep'], min: 10 },
      { name: 'Deep Sleep Body Scan', cat: ['Sleep'], min: 20 },
      { name: 'Release the Day', cat: ['Stress Relief'], min: 8 },
      { name: 'Box Breathing', cat: ['Stress Relief', 'Anxiety'], min: 5 },
      { name: 'Focus Reset', cat: ['Focus'], min: 6 },
      { name: 'Grounding 5-4-3-2-1', cat: ['Anxiety'], min: 7 }
    ],
    plans: [ // CMS Workout Plans: level (LF-339), goals[] (LF-309), gender
      { id: 30, name: 'Full Body Starter', level: 'Beginner', goals: ['Lose weight'], g: ['male', 'female'], min: 20, kcal: 160 },
      { id: 31, name: 'Upper Body Strength', level: 'Intermediate', goals: ['Build muscle'], g: ['male'], min: 35, kcal: 260 },
      { id: 32, name: 'Glutes & Legs', level: 'Intermediate', goals: ['Build muscle'], g: ['female'], min: 30, kcal: 240 },
      { id: 33, name: 'Core Crusher', level: 'Intermediate', goals: ['Core strength'], g: ['male', 'female'], min: 15, kcal: 120 },
      { id: 34, name: 'HIIT Fat Burn', level: 'Advanced', goals: ['Lose weight'], g: ['male', 'female'], min: 25, kcal: 330 },
      { id: 35, name: 'Mobility Flow', level: 'Beginner', goals: ['Flexibility'], g: ['male', 'female'], min: 15, kcal: 70 }
    ],
    goals: ['Lose weight', 'Build muscle', 'Core strength', 'Flexibility'],
    exercise: { id: 30, name: 'Dumbbell Bench Press', level: 'Intermediate', muscles: ['Chest', 'Triceps', 'Front delts'], sets: 4, reps: 10, rest: 60, equipment: ['Dumbbells', 'Flat bench'], min: 4, kcal: 45,
      desc: 'Lie on a flat bench, press the dumbbells up over your chest, then lower them slowly until your elbows are just below the bench.' },
    challenges: [
      { id: 'walk', name: 'Mindful Walking', sub: '15 min walk without your phone' },
      { id: 'water', name: 'Hydration Hero', sub: 'Drink 8 glasses of water' },
      { id: 'stretch', name: 'Stretch Break', sub: '5 min stretch every 2 hours' }
    ]
  };
  var LEVEL_TAG = { Beginner: 'tag-beg', Intermediate: 'tag-int', Advanced: 'tag-adv' };

  // ---------- helpers ----------
  var $screen = document.getElementById('screen');
  var $tabbar = document.getElementById('tabbar');
  var $sheetRoot = document.getElementById('sheetRoot');
  var $toast = document.getElementById('toast');
  var toastTimer;
  function toast(msg) { $toast.textContent = msg; $toast.classList.add('is-on'); clearTimeout(toastTimer); toastTimer = setTimeout(function () { $toast.classList.remove('is-on'); }, 2200); }
  function go(h) { location.hash = h; }
  function persona() { return store.get('persona', 'new'); }

  function topbar(title, opts) {
    opts = opts || {};
    return '<header class="topbar">' + (opts.noBack ? '' : '<button class="icon-btn" data-action="back" aria-label="Back">' + ic('back') + '</button>') +
      '<h1>' + title + '</h1>' + (opts.right || '') + '</header>';
  }
  function fixbar(ids) {
    return '<div class="fixbar"><span>Fixes</span>' + ids.map(function (id) { return '<button data-bug="' + id + '">' + id + '</button>'; }).join('') + '</div>';
  }
  function personaSwitch() {
    var p = persona();
    return '<div class="chips" style="padding-top:8px" role="group" aria-label="Demo account"><span class="tiny" style="align-self:center">Demo data:</span>' +
      '<button class="chip ' + (p === 'new' ? 'is-active' : '') + '" data-persona="new">New account</button>' +
      '<button class="chip ' + (p === 'active' ? 'is-active' : '') + '" data-persona="active">Has activity</button></div>';
  }
  function emptyState(icon, title, text, cta) {
    return '<div class="empty"><div class="empty-ico">' + ic(icon) + '</div><h3>' + title + '</h3><p>' + text + '</p>' + (cta || '') + '</div>';
  }
  function chips(name, values, active, counts) {
    return '<div class="chips" role="group" aria-label="' + name + '">' + values.map(function (v) {
      return '<button class="chip ' + (v === active ? 'is-active' : '') + '" data-filter="' + name + '" data-value="' + esc(v) + '" aria-pressed="' + (v === active) + '">' + esc(v) + (counts && v !== 'All' ? '<span class="count">' + counts[v] + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function filters(k) { return store.get('f:' + k, {}); }
  function setFilter(k, name, v) { var f = filters(k); f[name] = v; store.set('f:' + k, f); }

  // ---------- screens ----------
  var S = {};

  S.login = function () {
    var c = store.get('country', { flag: '🇲🇲', code: '+95', name: 'Myanmar' });
    return '<div class="pad" style="padding-top:40px">' +
      '<div class="brand-mark" style="width:48px;height:48px;border-radius:14px" aria-hidden="true"></div>' +
      '<h1 style="font-size:26px;margin:20px 0 6px">Sign in or Sign up</h1>' +
      '<p class="muted" style="margin:0 0 24px">Enter your phone number. New here? We\'ll set up your account in a minute.</p>' +
      '<div class="field"><label for="phone">Phone number</label>' +
      '<div class="phone-field"><button type="button" data-action="pick-country" aria-label="Country code ' + c.name + '"><span class="flag">' + c.flag + '</span>' + c.code + ic('chev', ' style="width:14px;height:14px;transform:rotate(90deg)"') + '</button>' +
      '<input id="phone" inputmode="numeric" autocomplete="tel" placeholder="9 123 456 789" data-digits></div>' +
      '<span class="err" id="phoneErr" hidden>Enter a valid phone number (7–11 digits).</span></div>' +
      '<button class="btn btn-primary btn-block" data-action="login" id="loginBtn" disabled>Continue</button>' +
      '<div style="display:flex;align-items:center;gap:10px;margin:20px 0;color:var(--ink-3);font-size:12px"><span style="flex:1;height:1px;background:var(--line)"></span>or<span style="flex:1;height:1px;background:var(--line)"></span></div>' +
      '<button class="btn btn-ghost btn-block" data-go="#/onboarding">Create New Account</button>' +
      '<p class="small muted" style="text-align:center;margin-top:24px">Trouble signing in? <a href="#/support" style="color:var(--primary);font-weight:700">Get Help</a></p>' +
      '</div>' + fixbar(['LF-296', 'LF-271']) +
      '<div class="ann-note" style="margin-top:8px"><strong>Routing after Continue (LF-271):</strong> number not registered or <code>onboarding_completed = false</code> → <a href="#/onboarding">Onboarding</a>. Otherwise → Home or the redirect target.</div>';
  };

  S.onboarding = function () {
    var slides = [ // CMS Onboarding > Intro slides (LF-298)
      { t: 'Breathe, Move, Thrive', d: 'Workouts, yoga and meditation made for your day, in your language.', m: 'm-prim', i: 'lotus' },
      { t: 'Stronger Body, Sharper Mind', d: 'Follow guided programs and brain games that grow with you.', m: 'm-move', i: 'dumbbell' },
      { t: 'Find Your Balance', d: 'Healthy recipes and daily motivation to keep you on track.', m: 'm-eat', i: 'leaf' }
    ];
    var i = Math.min(store.get('slide', 0), 2), s = slides[i];
    return '<div class="slides">' +
      '<div style="display:flex;justify-content:flex-end;padding:14px 16px 0">' + (i < 2 ? '<button class="link-btn" data-action="slide-skip">Skip</button>' : '<span style="height:20px"></span>') + '</div>' +
      '<div class="slide-art media ' + s.m + '">' + ic(s.i) + '</div>' +
      '<div class="pad" style="text-align:center"><h1 style="font-size:24px;margin:4px 0 8px">' + s.t + '</h1><p class="muted" style="margin:0">' + s.d + '</p></div>' +
      '<div class="dots" aria-label="Slide ' + (i + 1) + ' of 3">' + [0, 1, 2].map(function (n) { return '<i class="' + (n === i ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<div class="pad" style="display:grid;gap:10px;padding-bottom:16px">' +
      (i < 2 ? '<button class="btn btn-primary btn-block" data-action="slide-next">Next</button>' : '<button class="btn btn-primary btn-block" data-go="#/onb-country">Start Your Journey</button>') +
      '<button class="btn btn-ghost btn-block" data-go="#/login">I already have an account</button></div>' +
      fixbar(['LF-298']) + '</div>';
  };

  var COUNTRIES = [ // CMS Onboarding > Countries (active list, default MM)
    { flag: '🇲🇲', code: '+95', name: 'Myanmar' }, { flag: '🇹🇭', code: '+66', name: 'Thailand' }, { flag: '🇸🇬', code: '+65', name: 'Singapore' },
    { flag: '🇲🇾', code: '+60', name: 'Malaysia' }, { flag: '🇮🇩', code: '+62', name: 'Indonesia' }, { flag: '🇮🇳', code: '+91', name: 'India' }
  ];
  S['onb-country'] = function () {
    var c = store.get('country', COUNTRIES[0]);
    var name = store.get('onb', {}).name || '';
    return '<div class="stepper"><button class="icon-btn" data-action="back" aria-label="Back">' + ic('back') + '</button><div class="bar"><i style="width:8.3%"></i></div><span class="tiny">Step 1 of 12</span></div>' +
      '<div class="pad"><h1 style="font-size:22px;margin:18px 0 6px">Let\'s get to know you</h1><p class="muted small" style="margin:0 0 18px">Your country sets the language, units and timezone (MMT, UTC+6:30 for Myanmar).</p>' +
      '<div class="field"><label for="fn">First name</label><input class="input" id="fn" placeholder="Your first name" value="' + esc(name) + '"></div>' +
      '<div class="field"><label>Country</label><button class="input" style="display:flex;align-items:center;gap:10px;text-align:left" data-action="pick-country"><span class="flag">' + c.flag + '</span><span style="flex:1">' + c.name + '</span>' + ic('chev') + '</button></div>' +
      '<span class="err" id="fnErr" hidden>Please enter your first name</span>' +
      '<button class="btn btn-primary btn-block" data-action="onb-next" style="margin-top:12px">Continue</button>' +
      '<p class="tiny" style="margin-top:10px">Steps 2–10 (goal, focus, body type, gender, age, height, weight, goal weight, activity) stay as they are in production.</p></div>' +
      fixbar(['LF-302']);
  };

  function bmiInfo(h, w) {
    var b = w / Math.pow(h / 100, 2);
    var cat = b < 18.5 ? 'Underweight' : b < 25 ? 'Normal weight' : b < 30 ? 'Overweight' : 'Obese';
    return { v: b, cat: cat };
  }
  S['onb-summary'] = function () {
    var o = Object.assign({ name: 'Su', h: 160, w: 100, goal: 90, act: 'Very active', focus: 'Core' }, store.get('onb', {}));
    var b = bmiInfo(o.h, o.w);
    var diff = Math.round((o.w - o.goal) * 10) / 10;
    var pos = Math.max(0, Math.min(100, ((b.v - 10) / 30) * 100)); // scale 10–40
    // Priorities from CMS rules (Onboarding > Summary rules): goal direction, activity level, focus area
    var pr = [];
    pr.push(diff > 0 ? 'Steady fat loss: ' + diff + ' kg to lose at ~0.5 kg/week' : diff < 0 ? 'Lean muscle gain: ' + Math.abs(diff) + ' kg to gain' : 'Maintain your current weight');
    pr.push(o.act === 'Very active' ? 'Keep your high activity level with 5 sessions a week' : 'Build a habit: 3 short sessions a week');
    pr.push('Focus area: ' + o.focus + ' strength and stability');
    return '<div class="stepper"><button class="icon-btn" data-action="back" aria-label="Back">' + ic('back') + '</button><div class="bar"><i style="width:91.6%"></i></div><span class="tiny">Step 11 of 12</span></div>' +
      '<div class="pad"><h1 style="font-size:22px;margin:18px 0 4px">Your fitness profile</h1><p class="muted small" style="margin:0 0 14px">Based on your answers. Tap a value to change it.</p>' +
      '<div class="grid2" style="margin-bottom:12px">' +
      ['h:Height (cm):120:220', 'w:Weight (kg):30:200', 'goal:Goal weight (kg):30:200'].map(function (f) { var p = f.split(':'); return '<label class="field" style="margin:0"><span class="tiny">' + p[1] + '</span><input class="input" type="number" step="0.1" min="' + p[2] + '" max="' + p[3] + '" data-onb="' + p[0] + '" value="' + o[p[0]] + '"></label>'; }).join('') +
      '<label class="field" style="margin:0"><span class="tiny">Activity</span><select class="input" data-onb="act">' + ['Sedentary', 'Lightly active', 'Active', 'Very active'].map(function (a) { return '<option ' + (a === o.act ? 'selected' : '') + '>' + a + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="card"><div class="tiny">Calculated BMI</div><div style="display:flex;align-items:baseline;gap:8px"><strong style="font-size:32px">' + b.v.toFixed(1) + '</strong><span class="tag ' + (b.cat === 'Normal weight' ? 'tag-beg' : b.cat === 'Underweight' ? '' : 'tag-adv') + '">' + b.cat + '</span></div>' +
      '<div class="bmi-scale"><i></i><i></i><i></i><i></i></div><div class="bmi-pin"><b style="left:' + pos + '%"></b></div>' +
      '<div class="tiny" style="display:flex;justify-content:space-between"><span>Under</span><span>Normal</span><span>Over</span><span>Obese</span></div></div>' +
      '<div class="sec"><div class="sec-head"><h2>Your priorities</h2></div><div class="menu">' + pr.map(function (p, n) { return '<div class="menu-row"><span class="mi">' + ic(['target', 'flame', 'dumbbell'][n]) + '</span><span class="mt"><strong style="font-weight:600">' + esc(p) + '</strong></span></div>'; }).join('') + '</div></div>' +
      '<button class="btn btn-primary btn-block" data-action="onb-save" style="margin-top:18px">Save &amp; continue</button>' +
      '<p class="tiny" style="text-align:center">Saves height, weight, goal, gender and activity to your profile.</p></div>' +
      fixbar(['LF-277', 'LF-279']);
  };

  S.home = function () {
    var active = persona() === 'active';
    var comp = active ? [[42, 60], [2, 3], [12, 20]] : [[0, 60], [0, 3], [0, 20]];
    var pct = Math.round(comp.reduce(function (a, c) { return a + Math.min(1, c[0] / c[1]); }, 0) / 3 * 100);
    var labels = [['move', 'min', 'b-move'], ['eat', 'meals', 'b-eat'], ['mind', 'min', 'b-mind']];
    var name = store.get('profile', {}).name || 'Su';
    var unread = active && !store.get('allRead', false) ? 3 : 0;
    var html = '<header class="topbar"><div style="flex:1"><div class="tiny">Tue, 27 Oct</div><h1>' + t('hello') + ', ' + esc(name) + '!</h1></div>' +
      '<a class="icon-btn" href="#/notifications" aria-label="Notifications' + (unread ? ', ' + unread + ' new' : '') + '" style="position:relative">' + ic('bell') + (unread ? '<span style="position:absolute;top:6px;right:8px;width:9px;height:9px;border-radius:50%;background:var(--move);border:2px solid var(--surface)"></span>' : '') + '</a></header>' +
      personaSwitch() + fixbar(['LF-280', 'LF-293']) +
      '<section class="pad sec"><div class="card">';
    if (!active) {
      html += '<div style="display:flex;gap:14px;align-items:center"><div class="ring" style="--p:0"><div><strong>0%</strong><span class="tiny">' + t('of_goal') + '</span></div></div>' +
        '<div><h2 style="font-size:16px;margin:0 0 4px">' + t('daily') + '</h2><p class="small muted" style="margin:0 0 10px">No activity yet today. Finish a workout, log a meal or try a meditation to start filling your ring.</p><a class="btn btn-primary btn-sm" href="#/fitness">Start a workout</a></div></div>';
    } else {
      html += '<div style="display:flex;gap:16px;align-items:center"><div class="ring" style="--p:' + pct + '"><div><strong>' + pct + '%</strong><span class="tiny">' + t('of_goal') + '</span></div></div><div style="flex:1;display:grid;gap:10px">' +
        comp.map(function (c, n) { return '<div><div style="display:flex;justify-content:space-between;font-size:13px"><strong>' + t(labels[n][0]) + '</strong><span class="muted">' + c[0] + '/' + c[1] + ' ' + t(labels[n][1]) + '</span></div><div class="bar ' + labels[n][2] + '"><i style="width:' + Math.round(c[0] / c[1] * 100) + '%"></i></div></div>'; }).join('') + '</div></div>' +
        '<p class="tiny" style="margin:10px 0 0">' + pct + '% = average of Move 70%, Eat 67%, Mind 60%. Daily targets are set in CMS › Settings.</p>';
    }
    html += '</div></section>' +
      '<section class="pad sec"><div class="sec-head"><h2>Quick actions</h2></div><div class="grid2">' +
      [['#/fitness', 'Workout', 'dumbbell', 'm-move'], ['#/mind', 'Meditate', 'lotus', 'm-mind'], ['#/cooking', 'Recipes', 'bowl', 'm-eat'], ['#/motivation', 'Challenges', 'trophy', 'm-prim']].map(function (q) {
        return '<a class="tile" href="' + q[0] + '"><div class="media ' + q[3] + '" style="height:70px">' + ic(q[2]) + '</div><div class="tile-body"><h3>' + q[1] + '</h3></div></a>'; }).join('') + '</div></section>';
    return html;
  };

  S.explore = function () {
    var items = [['#/fitness', 'Fitness', 'dumbbell', 'm-move'], ['#/yoga', 'Yoga', 'lotus', 'm-prim'], ['#/mind', 'Meditation', 'moon', 'm-mind'], ['#/cooking', 'Health Cooking', 'bowl', 'm-eat'], ['#/motivation', 'Motivation', 'trophy', 'm-move'], ['#/coach', 'Coach Session', 'video', 'm-prim']];
    return topbar('Explore', { noBack: true }) + '<div class="pad"><div class="grid2">' + items.map(function (q) {
      return '<a class="tile" href="' + q[0] + '"><div class="media ' + q[3] + '" style="height:90px">' + ic(q[2]) + '</div><div class="tile-body"><h3>' + q[1] + '</h3></div></a>'; }).join('') + '</div></div>';
  };

  S.fitness = function () {
    var f = Object.assign({ gender: 'All', goal: 'All goals' }, filters('fit'));
    var list = DATA.plans.filter(function (p) {
      return (f.gender === 'All' || p.g.indexOf(f.gender.toLowerCase()) > -1) && (f.goal === 'All goals' || p.goals.indexOf(f.goal) > -1);
    });
    return topbar('Fitness', { noBack: true }) + fixbar(['LF-307', 'LF-309', 'LF-339']) +
      '<div class="hero" style="margin-top:12px"><div class="eyebrow">Featured program · 8 weeks</div><h2>Lean &amp; Strong</h2><p>4 workouts a week · 35–45 min · Intermediate. Build strength first, then burn fat.</p>' +
      '<div class="hero-weeks" aria-label="Week 1 of 8">' + [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return '<i class="' + (n === 1 ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<a class="btn btn-sm" href="#/exercise">Start Program</a></div>' +
      '<div class="chip-row-label">Gender</div>' + chips('gender', ['All', 'Male', 'Female'], f.gender) +
      '<div class="chip-row-label">Goal</div>' + chips('goal', ['All goals'].concat(DATA.goals), f.goal) +
      '<section class="pad sec"><div class="sec-head"><h2>Workout plans</h2><span class="tiny">' + list.length + ' plans</span></div><div class="list">' +
      (list.length ? list.map(function (p) {
        return '<a class="row-card" href="#/exercise"><div class="media m-move">' + ic('dumbbell') + '</div><div><h3>' + p.name + '</h3><div class="meta"><span>' + ic('clock') + p.min + ' ' + t('min') + '</span><span>' + ic('flame') + p.kcal + ' kcal</span></div><div style="margin-top:6px;display:flex;gap:6px"><span class="tag ' + LEVEL_TAG[p.level] + '">' + p.level + '</span><span class="tag">' + p.goals[0] + '</span></div></div><span class="chev">' + ic('chev') + '</span></a>';
      }).join('') : emptyState('filter', 'No plans for this filter', 'Try another goal or gender.', '<button class="btn btn-ghost btn-sm" data-action="clear-fit">Clear filters</button>')) + '</div></section>';
  };

  S.exercise = function () {
    var e = DATA.exercise;
    return topbar('Exercise', { right: '<button class="icon-btn" aria-label="Save">' + ic('bookmark') + '</button>' }) +
      '<div class="pad"><div class="media m-move" style="height:200px;border-radius:var(--radius-lg)"><button class="icon-btn" style="width:56px;height:56px" aria-label="Play video">' + ic('play') + '</button></div>' +
      '<h1 style="font-size:22px;margin:14px 0 6px">' + e.name + '</h1>' +
      '<div class="meta"><span>' + ic('clock') + e.min + ' ' + t('min') + '</span><span>' + ic('flame') + e.kcal + ' kcal</span><span class="tag ' + LEVEL_TAG[e.level] + '">' + e.level + '</span></div>' +
      '<div class="stats3" style="margin-top:14px"><div class="stat"><strong>' + e.sets + '</strong><span>Sets</span></div><div class="stat"><strong>' + e.reps + '</strong><span>Reps</span></div><div class="stat"><strong>' + e.rest + 's</strong><span>Rest</span></div></div>' +
      '<div class="sec"><h2 style="font-size:15px;margin:0 0 8px">Target muscles</h2><div style="display:flex;gap:6px;flex-wrap:wrap">' + e.muscles.map(function (m, n) { return '<span class="tag ' + (n === 0 ? 'tag-new' : '') + '">' + m + (n === 0 ? ' · primary' : '') + '</span>'; }).join('') + '</div></div>' +
      '<div class="sec"><h2 style="font-size:15px;margin:0 0 8px">Equipment</h2><p class="small muted" style="margin:0">' + e.equipment.join(' · ') + '</p></div>' +
      '<div class="sec"><h2 style="font-size:15px;margin:0 0 8px">How to</h2><p class="small muted" style="margin:0">' + e.desc + '</p></div>' +
      '<div style="display:grid;grid-template-columns:1fr 2fr;gap:10px;margin-top:20px"><button class="btn btn-ghost">' + ic('play') + 'Video</button><a class="btn btn-primary" href="#/session">Start Workout</a></div></div>' +
      fixbar(['LF-268', 'LF-310']);
  };

  var sessionTimer = null;
  S.session = function () {
    var e = DATA.exercise, s = store.get('session', { set: 1, rest: false });
    var done = s.set > e.sets;
    return topbar(e.name, {}) + '<div class="session">' +
      (done ? '<div class="empty-ico" style="width:72px;height:72px;margin:24px auto 8px;background:var(--primary-soft);color:var(--primary-soft-ink)">' + ic('check') + '</div><h2 style="margin:0">Nice work!</h2><p class="muted">' + e.sets + ' sets × ' + e.reps + ' reps done · ' + e.kcal + ' kcal. Logged to today\'s Move progress.</p><a class="btn btn-primary btn-block" href="#/home" data-action="end-session">Back to Home</a>' :
        '<div class="tiny">' + (s.rest ? 'Rest' : 'Set ' + s.set + ' of ' + e.sets) + '</div>' +
        '<div class="timer" id="timer">' + (s.rest ? '00:' + String(e.rest).padStart(2, '0') : e.reps + ' reps') + '</div>' +
        '<div class="sets">' + Array.from({ length: e.sets }, function (_, n) { return '<i class="' + (n + 1 < s.set ? 'done' : n + 1 === s.set ? 'cur' : '') + '"></i>'; }).join('') + '</div>' +
        (s.rest ? '<button class="btn btn-ghost btn-block" data-action="skip-rest">Skip rest</button>' : '<button class="btn btn-primary btn-block" data-action="complete-set">Complete set ' + s.set + '</button>') +
        '<p class="tiny" style="margin-top:12px">Back during a session asks before leaving, progress is kept.</p>') +
      '</div>' + fixbar(['LF-268']);
  };

  S.cooking = function () {
    var f = Object.assign({ meal: 'All' }, filters('cook'));
    var cats = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    var counts = {}; cats.forEach(function (c) { counts[c] = DATA.recipes.filter(function (r) { return r.cat.indexOf(c) > -1; }).length; });
    var list = DATA.recipes.filter(function (r) { return f.meal === 'All' || r.cat.indexOf(f.meal) > -1; });
    var saved = store.get('savedRecipes', []);
    return topbar('Health Cooking', {}) + fixbar(['LF-285', 'LF-342', 'LF-343']) + '<div style="height:10px"></div>' + chips('meal', cats, f.meal, counts) +
      '<section class="pad sec"><div class="sec-head"><h2>' + (f.meal === 'All' ? 'All recipes' : f.meal) + '</h2><span class="tiny">' + list.length + ' recipes</span></div><div class="list">' +
      (list.length ? list.map(function (r) {
        return '<a class="row-card" href="#/recipe/' + r.id + '"><div class="media m-eat">' + ic('bowl') + '</div><div><h3>' + r.name + '</h3><div class="meta"><span>' + ic('clock') + r.time + ' ' + t('min') + '</span><span>' + ic('flame') + r.kcal + ' kcal</span><span>' + r.p + 'g protein</span></div><div style="margin-top:6px;display:flex;gap:4px">' + r.cat.map(function (c) { return '<span class="tag">' + c + '</span>'; }).join('') + '</div></div>' + (saved.indexOf(r.id) > -1 ? '<span style="color:var(--primary)">' + ic('bookmark', ' style="fill:currentColor"') + '</span>' : '<span class="chev">' + ic('chev') + '</span>') + '</a>';
      }).join('') : emptyState('bowl', 'No ' + f.meal.toLowerCase() + ' recipes yet', 'New recipes are added every week.', '<button class="btn btn-ghost btn-sm" data-filter="meal" data-value="All">Show all recipes</button>')) + '</div></section>';
  };

  S.recipe = function (id) {
    var r = DATA.recipes.filter(function (x) { return String(x.id) === String(id); })[0] || DATA.recipes[0];
    var saved = store.get('savedRecipes', []).indexOf(r.id) > -1;
    return topbar('', { right: '<button class="icon-btn ' + (saved ? 'is-on' : '') + '" data-action="save-recipe" data-id="' + r.id + '" aria-pressed="' + saved + '" aria-label="' + (saved ? 'Saved' : 'Save recipe') + '">' + ic('bookmark') + '</button>' }) +
      '<div class="pad"><div class="media m-eat" style="height:190px;border-radius:var(--radius-lg)"><button class="icon-btn" style="width:56px;height:56px" aria-label="Play video">' + ic('play') + '</button></div>' +
      '<h1 style="font-size:22px;margin:14px 0 6px">' + r.name + '</h1><div class="meta"><span>' + ic('clock') + r.time + ' ' + t('min') + '</span><span>' + ic('flame') + r.kcal + ' kcal</span>' + r.cat.map(function (c) { return '<span class="tag">' + c + '</span>'; }).join('') + '</div>' +
      '<div class="macro" style="margin-top:14px"><div><strong>' + r.kcal + '</strong><span>kcal</span></div><div><strong>' + r.c + 'g</strong><span>Carbs</span></div><div><strong>' + r.p + 'g</strong><span>Protein</span></div><div><strong>' + r.f + 'g</strong><span>Fat</span></div></div>' +
      '<div class="sec"><h2 style="font-size:15px;margin:0 0 8px">Ingredients</h2><ul class="small" style="margin:0;padding-left:18px;color:var(--ink-2)">' + r.ing.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul></div>' +
      (saved ? '<p class="saved-hint" style="margin-top:14px">' + ic('check', ' style="width:14px;height:14px;vertical-align:-2px"') + ' Saved to your profile — stays saved after reload.</p>' : '') + '</div>' +
      fixbar(['LF-315', 'LF-343']);
  };

  S.yoga = function () {
    var f = Object.assign({ level: 'All', style: 'All' }, filters('yoga'));
    var list = DATA.yoga.filter(function (y) { return !y.featured && (f.level === 'All' || y.level === f.level) && (f.style === 'All' || y.style === f.style); });
    var feat = DATA.yoga.filter(function (y) { return y.featured; })[0];
    return topbar('Yoga', {}) + fixbar(['LF-286', 'LF-317']) +
      '<div class="hero" style="margin-top:12px;background:linear-gradient(160deg,#6d3fc0,#3f2273)"><div class="eyebrow">Featured · ' + feat.style + '</div><h2>' + feat.name + '</h2><p>' + feat.min + ' ' + t('min') + ' · ' + feat.level + ' · Wake up your spine and hips.</p><a class="btn btn-sm" href="#/yoga" style="color:#3f2273">' + ic('play') + 'Start</a></div>' +
      '<div class="chip-row-label">Level</div>' + chips('level', ['All', 'Beginner', 'Intermediate', 'Advanced'], f.level) +
      '<div class="chip-row-label">Style</div>' + chips('style', ['All', 'Vinyasa', 'Hatha', 'Restorative', 'Power'], f.style) +
      '<section class="pad sec"><div class="sec-head"><h2>Yoga sessions</h2><span class="tiny">' + list.length + ' sessions</span></div><div class="list">' +
      (list.length ? list.map(function (y) {
        return '<div class="row-card"><div class="media m-mind">' + ic('lotus') + '</div><div><h3>' + y.name + '</h3><div class="meta"><span>' + ic('clock') + y.min + ' ' + t('min') + '</span><span>' + ic('flame') + y.kcal + ' kcal</span></div><div style="margin-top:6px;display:flex;gap:6px"><span class="tag ' + LEVEL_TAG[y.level] + '">' + y.level + '</span><span class="tag">' + y.style + '</span></div></div><span class="chev">' + ic('chev') + '</span></div>';
      }).join('') : emptyState('lotus', 'No sessions match', f.level + ' · ' + f.style + ' has no sessions yet. Try another level or style.', '<button class="btn btn-ghost btn-sm" data-action="clear-yoga">Clear filters</button>')) + '</div></section>';
  };

  S.mind = function () {
    var f = Object.assign({ cat: 'All' }, filters('mind'));
    var cats = ['All', 'Sleep', 'Stress Relief', 'Focus', 'Anxiety'];
    var list = DATA.mind.filter(function (m) { return f.cat === 'All' || m.cat.indexOf(f.cat) > -1; });
    return topbar('Mind', {}) + fixbar(['LF-287']) +
      '<div class="hero" style="margin-top:12px;background:linear-gradient(160deg,#3f2273,#1f3a5f)"><div class="eyebrow">Daily calm</div><h2>Breathe. Relax. Be present.</h2><p>Short guided sessions for sleep, stress and focus.</p></div>' +
      '<div style="height:12px"></div>' + chips('cat', cats, f.cat) +
      '<section class="pad sec"><div class="sec-head"><h2>Guided sessions</h2><span class="tiny">' + list.length + ' sessions</span></div><div class="list">' +
      list.map(function (m) { return '<div class="row-card"><div class="media m-mind">' + ic(m.cat[0] === 'Sleep' ? 'moon' : 'lotus') + '</div><div><h3>' + m.name + '</h3><div class="meta"><span>' + ic('clock') + m.min + ' ' + t('min') + '</span></div><div style="margin-top:6px;display:flex;gap:4px">' + m.cat.map(function (c) { return '<span class="tag">' + c + '</span>'; }).join('') + '</div></div><span class="chev">' + ic('play') + '</span></div>'; }).join('') +
      '</div></section>';
  };

  S.motivation = function () {
    var today = store.get('challenges', {});
    return topbar('Motivation', {}) + fixbar(['LF-319']) +
      '<div class="pad sec"><div class="card" style="background:var(--surface-2);box-shadow:none"><div class="tiny">Daily inspiration</div><p style="font-size:17px;font-weight:600;margin:6px 0">“Small steps every day add up to big results.”</p></div>' +
      '<div class="sec"><div class="sec-head"><h2>Daily challenges</h2><span class="tiny">Resets at 00:00 MMT</span></div><div class="menu">' +
      DATA.challenges.map(function (c) {
        var done = !!today[c.id];
        return '<button class="menu-row" data-action="challenge" data-id="' + c.id + '" aria-pressed="' + done + '"><span class="mi" style="' + (done ? 'background:var(--primary);color:var(--primary-ink)' : '') + '">' + ic(done ? 'check' : 'trophy') + '</span><span class="mt"><strong>' + c.name + '</strong><span>' + c.sub + '</span></span><span class="tag ' + (done ? 'tag-beg' : 'tag-int') + '">' + (done ? 'Completed' : 'In progress') + '</span></button>';
      }).join('') + '</div><p class="tiny" style="margin-top:8px">Status is saved per user per day and stays after reload.</p></div></div>';
  };

  S.coach = function () {
    return topbar('Coach Session', {}) + fixbar(['LF-349', 'LF-323', 'LF-324']) +
      '<div class="pad sec"><div class="card" style="display:flex;gap:12px;align-items:center"><div class="media m-prim" style="width:60px;height:60px;border-radius:50%">' + ic('user') + '</div><div style="flex:1"><strong>Coach Marcus Vance</strong><div class="tiny">NASM Performance Specialist · ' + ic('star', ' style="width:12px;height:12px;vertical-align:-1px"') + ' 4.9</div></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px"><a class="btn btn-ghost" href="#/coach-chat">' + ic('chat') + 'Message</a><button class="btn btn-ghost" data-action="reschedule">' + ic('cal') + 'Reschedule</button></div>' +
      '<div class="card sec"><div class="tiny">Today · 16:00 MMT · 45 min</div><h2 style="font-size:17px;margin:4px 0 8px">Core Stability &amp; Functional Movement</h2><p class="small muted" style="margin:0">Equipment: yoga mat, light dumbbells, resistance band.</p></div>' +
      '<div class="sec"><div class="sec-head"><h2>Today\'s nutrition target</h2><span class="tiny">set by coach</span></div><div class="macro"><div><strong>1,750</strong><span>kcal</span></div><div><strong>180g</strong><span>Carbs</span></div><div><strong>140g</strong><span>Protein</span></div><div><strong>55g</strong><span>Fat</span></div></div>' +
      '<div class="bar" style="display:flex;margin-top:10px;height:10px"><i style="width:41%;background:var(--warn)"></i><i style="width:32%;background:var(--eat);border-radius:0"></i><i style="width:27%;background:var(--move);border-radius:0"></i></div><p class="tiny" style="margin-top:6px">Carbs 41% · Protein 32% · Fat 27% of calories</p></div>' +
      '<button class="btn btn-primary btn-block sec" data-action="soon">Join Video Session</button><p class="tiny" style="text-align:center">Video sessions: out of scope for this release (shows “coming soon”).</p></div>';
  };

  function chatScreen(title, sub, msgs, bugs, key) {
    var extra = store.get('chat:' + key, []);
    return topbar(title, {}) + '<div class="tiny" style="padding:0 16px 0 64px;margin-top:-6px">' + sub + '</div>' + fixbar(bugs) +
      '<div class="chat" id="chat"><span class="chat-day">Today</span>' + msgs.concat(extra).map(function (m) { return '<div class="bubble ' + m[0] + '">' + esc(m[1]) + '<time>' + m[2] + '</time></div>'; }).join('') + '</div>' +
      '<form class="composer" data-chat="' + key + '"><input class="input" placeholder="Write a message" aria-label="Message" required><button class="icon-btn is-on" aria-label="Send">' + ic('send') + '</button></form>';
  }
  S['coach-chat'] = function () { return chatScreen('Marcus Vance', '● Online · replies within 1 hour', [['them', 'Hi! Ready for today\'s core session at 16:00?', '14:02']], ['LF-323'], 'coach'); };
  S['support-chat'] = function () { return chatScreen('LifeFit Support', '● Usually replies in a few minutes', [['them', 'Hi, this is LifeFit Support. How can we help you today?', '16:40']], ['LF-332'], 'support'); };

  S.profile = function () {
    var active = persona() === 'active';
    var p = store.get('profile', { name: 'Su Myat' });
    var initials = (p.name || 'U').split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
    var mins = active ? [30, 0, 45, 20, 0, 0, 0] : [0, 0, 0, 0, 0, 0, 0];
    var max = 60;
    var langName = { en: 'English', my: 'မြန်မာ (Burmese)', id: 'Bahasa Indonesia' }[lang()];
    return topbar('Profile', { noBack: true }) + personaSwitch() + fixbar(['LF-291', 'LF-351', 'LF-293']) +
      '<div class="pad sec" style="text-align:center"><div style="width:84px;height:84px;border-radius:50%;background:var(--primary-soft);color:var(--primary-soft-ink);display:grid;place-items:center;margin:0 auto;font-size:28px;font-weight:800">' + initials + '</div><h2 style="margin:10px 0 2px">' + esc(p.name) + '</h2><a href="#/edit-profile" class="link-btn">Edit profile</a></div>' +
      '<div class="pad sec"><div class="stats3">' + (active ? [[6, 'Workouts'], [3, 'Day streak'], [2, 'Goals met']] : [[0, 'Workouts'], [0, 'Day streak'], [0, 'Goals met']]).map(function (s) { return '<div class="stat"><strong>' + s[0] + '</strong><span>' + s[1] + '</span></div>'; }).join('') + '</div></div>' +
      '<div class="pad sec"><div class="card"><div class="sec-head" style="margin:0"><h2>Weekly activity</h2><span class="tiny">' + (active ? 'Avg ' + Math.round(mins.reduce(function (a, b) { return a + b; }, 0) / 7) + ' ' + t('min') + '/day' : '') + '</span></div>' +
      (active ? '<div class="bars">' + mins.map(function (m, n) { return '<div><i class="' + (m ? 'on' : '') + '" style="height:' + Math.max(4, m / max * 80) + 'px"></i>' + 'MTWTFSS'[n] + '</div>'; }).join('') + '</div>' :
        '<p class="small muted" style="margin:12px 0 0">Your week is empty so far. Activity from workouts, yoga and meditation shows up here.</p>') + '</div></div>' +
      '<div class="pad sec"><div class="menu">' +
      menuRow('#/notifications', 'bell', 'Notifications', '') + menuRow('#/privacy', 'shield', 'Privacy & Security', '') +
      menuRow('#/legal', 'doc', 'Legal & Data', 'Terms, privacy, your data', true) +
      '<button class="menu-row" data-action="lang"><span class="mi">' + ic('globe') + '</span><span class="mt"><strong>Language</strong><span>' + langName + '</span></span><span class="chev">' + ic('chev') + '</span></button>' +
      '<div class="menu-row"><span class="mi">' + ic('moon') + '</span><span class="mt"><strong>Dark mode</strong></span><button class="switch" role="switch" aria-label="Dark mode" aria-checked="' + (document.documentElement.getAttribute('data-theme') === 'dark') + '" data-action="theme"></button></div>' +
      menuRow('#/support', 'help', 'Help & Support', '') +
      '<button class="menu-row" data-action="logout"><span class="mi" style="color:var(--danger)">' + ic('out') + '</span><span class="mt"><strong style="color:var(--danger)">Log out</strong></span></button></div></div>';
  };
  function menuRow(href, icon, title, sub, isNew) {
    return '<a class="menu-row ' + (isNew ? 'is-new' : '') + '" href="' + href + '"><span class="mi">' + ic(icon) + '</span><span class="mt"><strong>' + title + (isNew ? ' <span class="tag tag-new">New</span>' : '') + '</strong>' + (sub ? '<span>' + sub + '</span>' : '') + '</span><span class="chev">' + ic('chev') + '</span></a>';
  }

  var editSnapshot = null;
  S['edit-profile'] = function () {
    var p = Object.assign({ name: 'Su Myat', bio: '', h: 160, w: 100 }, store.get('profile', {}));
    editSnapshot = JSON.stringify(p);
    return topbar('Edit profile', { right: '' }) + fixbar(['LF-352']) + '<form class="pad sec" id="editForm">' +
      '<div class="field"><label for="ep-name">Full name</label><input class="input" id="ep-name" name="name" value="' + esc(p.name) + '"></div>' +
      '<div class="field"><label for="ep-bio">Bio</label><textarea class="input" id="ep-bio" name="bio" rows="3" placeholder="A few words about you">' + esc(p.bio) + '</textarea></div>' +
      '<div class="grid2"><div class="field"><label for="ep-h">Height (cm)</label><input class="input" id="ep-h" name="h" type="number" min="50" max="250" value="' + p.h + '"></div><div class="field"><label for="ep-w">Weight (kg)</label><input class="input" id="ep-w" name="w" type="number" step="0.1" min="20" max="300" value="' + p.w + '"></div></div>' +
      '<p class="tiny">Height & weight come from onboarding (LF-279). Change something, then tap Back.</p>' +
      '<button class="btn btn-primary btn-block" type="submit">Update Profile</button></form>';
  };

  S.notifications = function () {
    var active = persona() === 'active';
    var allRead = store.get('allRead', false);
    var items = [['flame', 'You finished Core Crusher', '15 min · 120 kcal added to Move', '2h'], ['bowl', 'New recipe: Baked Salmon & Greens', 'Dinner · 30 min', '5h'], ['trophy', 'Challenge completed', 'Mindful Walking', 'Yesterday']];
    return topbar('Notifications', { right: active && !allRead ? '<button class="link-btn" data-action="mark-all">Mark all as read</button>' : '' }) + personaSwitch() + fixbar(['LF-327', 'LF-328']) +
      '<div class="pad sec">' + (active ? '<div class="menu">' + items.map(function (n) { return '<div class="notif ' + (allRead ? '' : 'unread') + '"><span class="mi" style="width:36px;height:36px;border-radius:10px;background:var(--surface);display:grid;place-items:center;flex:none">' + ic(n[0]) + '</span><div class="mt"><strong>' + n[1] + '</strong><p>' + n[2] + '</p><span class="tiny">' + n[3] + '</span></div></div>'; }).join('') + '</div>' +
        (allRead ? '<p class="saved-hint" style="margin-top:8px">All caught up — read state is saved.</p>' : '') :
        emptyState('bell', 'No notifications yet', 'We\'ll let you know about your workouts, new recipes and challenges here.', '<a class="btn btn-ghost btn-sm" href="#/notif-settings">Notification settings</a>')) + '</div>';
  };

  S.privacy = function () {
    var s = Object.assign({ priv: false, coach: true, reco: true }, store.get('privacy', {}));
    function sw(k, title, sub) { return '<div class="menu-row"><span class="mt"><strong>' + title + '</strong><span>' + sub + '</span><span class="saved-hint" data-saved="' + k + '" hidden> · Saved</span></span><button class="switch" role="switch" aria-label="' + title + '" aria-checked="' + !!s[k] + '" data-toggle="' + k + '"></button></div>'; }
    return topbar('Privacy & Security', {}) + fixbar(['LF-329', 'LF-330']) +
      '<div class="pad sec"><div class="menu">' + sw('priv', 'Private profile', 'Only you can see your stats') + sw('coach', 'Share progress with coach', 'Your coach sees workouts and macros') + sw('reco', 'Personalized recommendations', 'Use activity to suggest content') + '</div>' +
      '<div class="menu sec">' + menuRow('#/devices', 'phone', 'Logged-in devices', '2 active devices') + menuRow('#/legal', 'doc', 'Legal & Data', '') + '</div></div>';
  };

  S.devices = function () {
    var revoked = store.get('revoked', []);
    var list = [['phone', 'Chrome on Android', 'Yangon · This device', true, 'd0'], ['laptop', 'Safari on macOS', 'Mandalay · Last active 2 days ago', false, 'd1']].filter(function (d) { return revoked.indexOf(d[4]) < 0; });
    return topbar('Logged-in devices', {}) + fixbar(['LF-330']) + '<div class="pad sec"><div class="menu">' + list.map(function (d) {
      return '<div class="device-row"><span class="mi" style="width:36px;height:36px;border-radius:10px;background:var(--surface-2);display:grid;place-items:center">' + ic(d[0]) + '</span><div class="mt"><strong style="font-size:14.5px">' + d[1] + '</strong><div class="tiny">' + (d[3] ? '<span class="dot-live"></span>' : '') + d[2] + '</div></div>' + (d[3] ? '<span class="tag tag-new">Current</span>' : '<button class="btn btn-ghost btn-sm" data-action="revoke" data-id="' + d[4] + '">Sign out</button>') + '</div>';
    }).join('') + '</div>' + (list.length > 1 ? '<button class="btn btn-ghost btn-block sec" data-action="revoke-all" style="color:var(--danger)">Sign out of all other devices</button>' : '<p class="tiny sec">Only this device is signed in.</p>') + '</div>';
  };

  S.legal = function () {
    var req = store.get('dataReq', 'none');
    var reqUi = req === 'none' ? '<span class="chev">' + ic('chev') + '</span>' : req === 'processing' ? '<span class="tag tag-int">Processing</span>' : '<span class="tag tag-beg">Ready</span>';
    return topbar('Legal & Data', {}) + fixbar(['LF-351', 'LF-333', 'LF-294']) + '<div class="pad sec"><div class="menu">' +
      menuRow('#/legal-doc/terms', 'doc', 'Terms and Conditions', 'Version 1.2 · 20 Oct 2026') + menuRow('#/legal-doc/privacy', 'shield', 'Privacy Policy', 'Version 1.1 · 20 Oct 2026') + '</div>' +
      '<div class="menu sec"><button class="menu-row" data-action="data-req"><span class="mi">' + ic('download') + '</span><span class="mt"><strong>Download my data</strong><span>' + (req === 'none' ? 'Get a copy of your LifeFit data' : req === 'processing' ? 'Requested today · we\'ll SMS a download link within 48 h' : 'Your file is ready · link valid for 7 days') + '</span></span>' + reqUi + '</button>' +
      '<button class="menu-row" data-action="delete-acc"><span class="mi" style="color:var(--danger)">' + ic('trash') + '</span><span class="mt"><strong style="color:var(--danger)">Delete account</strong><span>Permanently remove your data</span></span></button></div></div>';
  };

  S['legal-doc'] = function (which) {
    var priv = which === 'privacy';
    return topbar(priv ? 'Privacy Policy' : 'Terms and Conditions', {}) + fixbar(['LF-294']) +
      '<article class="pad prose"><div class="version">' + ic('check', ' style="width:14px;height:14px;color:var(--primary)"') + 'Version ' + (priv ? '1.1' : '1.2') + ' · Effective 20 Oct 2026 · Published from CMS by Legal</div>' +
      '<div class="ann-note" style="margin:10px 0 0">Layout only — final text comes from LifeFit Legal via CMS › Legal Pages.</div>' +
      (priv ? '<h2>1. What we collect</h2><p>Phone number, profile details you enter (name, height, weight, goals) and activity inside LifeFit.</p><h2>2. How we use it</h2><p>To personalise workouts, calculate progress and send the notifications you choose.</p><h2>3. Your choices</h2><p>You can make your profile private, download your data or delete your account from Legal &amp; Data.</p><h2>4. Contact</h2><p>Questions about privacy can be sent through Help &amp; Support.</p>' :
        '<h2>1. Using LifeFit</h2><p>LifeFit offers fitness, nutrition and mindfulness content for personal, non-commercial use.</p><h2>2. Your account</h2><p>You sign in with your phone number and are responsible for activity on your account.</p><h2>3. Health notice</h2><p>Content is general guidance and not medical advice. Check with a doctor before starting a new program.</p><h2>4. Subscription</h2><p>Access may depend on an active subscription with your mobile operator.</p><h2>5. Changes</h2><p>We will notify you in the app when these terms change.</p>') + '</article>';
  };

  S.support = function () {
    return topbar('Help & Support', {}) + fixbar(['LF-332']) + '<div class="pad sec"><input class="input" placeholder="Search help articles" aria-label="Search help">' +
      '<div class="menu sec"><a class="menu-row" href="#/support-chat"><span class="mi" style="background:var(--primary-soft);color:var(--primary-soft-ink)">' + ic('chat') + '</span><span class="mt"><strong>Chat with support</strong><span><span class="dot-live"></span>Online · usually replies in a few minutes</span></span><span class="chev">' + ic('chev') + '</span></a>' +
      menuRow('#/support', 'doc', 'Send us a message', 'We reply by email within 1 business day') + '</div>' +
      '<div class="sec"><h2 style="font-size:15px">Popular questions</h2><div class="menu">' + ['How do I sign in?', 'How do I change my name or photo?', 'How do I cancel my subscription?'].map(function (q) { return '<div class="menu-row"><span class="mt"><strong style="font-weight:600">' + q + '</strong></span><span class="chev">' + ic('chev') + '</span></div>'; }).join('') + '</div></div></div>';
  };

  S['notif-settings'] = function () { return topbar('Notification settings', {}) + '<div class="pad sec"><p class="muted">Unchanged from production (LF-353 already fixed).</p></div>'; };

  // ---------- sheets ----------
  function openSheet(html, cls) {
    $sheetRoot.innerHTML = '<div class="scrim" data-action="close-sheet"></div>' + (cls === 'dialog' ? '<div class="dialog" role="dialog" aria-modal="true">' + html + '</div>' : '<div class="sheet ' + (cls || '') + '" role="dialog" aria-modal="true">' + html + '</div>');
    var f = $sheetRoot.querySelector('button, a, input'); if (f) f.focus();
  }
  function closeSheet() { $sheetRoot.innerHTML = ''; }

  function bugSheet(id) {
    var b = window.LF_BUGS.filter(function (x) { return x.id === id; })[0]; if (!b) return;
    var ownerTxt = { CMS: 'CMS (data/filter belum ada)', Portal: 'Portal', Both: 'CMS + Portal' }[b.owner];
    openSheet('<div class="bugsheet"><span class="bs-id">' + b.id + '</span> <span class="owner owner-' + b.owner + '">' + ownerTxt + '</span><h3 style="margin-top:6px">' + esc(b.title) + '</h3>' +
      '<dl><dt>Area</dt><dd>' + b.area + '</dd><dt>Severity</dt><dd>' + b.sev + '</dd><dt>Design fix</dt><dd>' + esc(b.fix) + '</dd>' + (b.cms ? '<dt>CMS</dt><dd>Screen: <strong>' + b.cms + '</strong> in the CMS design</dd>' : '') + '</dl>' +
      '<button class="btn btn-ghost btn-block" style="margin-top:16px" data-action="close-sheet">Close</button></div>');
  }

  // ---------- router ----------
  var NO_TAB = ['login', 'onboarding', 'onb-country', 'onb-summary', 'session', 'coach-chat', 'support-chat', 'edit-profile'];
  var TAB_OF = { home: 'home', explore: 'explore', fitness: 'fitness', exercise: 'fitness', profile: 'profile', notifications: 'profile', privacy: 'profile', devices: 'profile', legal: 'profile', 'legal-doc': 'profile', support: 'profile', cooking: 'explore', recipe: 'explore', yoga: 'explore', mind: 'explore', motivation: 'explore', coach: 'explore' };
  var history_ = [];
  function render() {
    var h = location.hash.replace(/^#\/?/, '') || 'home';
    var parts = h.split('/'), name = parts[0], arg = parts[1];
    if (!S[name]) name = 'home';
    if (name !== 'session' && sessionTimer) { clearInterval(sessionTimer); sessionTimer = null; }
    $screen.innerHTML = S[name](arg);
    $screen.scrollTop = 0;
    $tabbar.classList.toggle('is-hidden', NO_TAB.indexOf(name) > -1);
    Array.prototype.forEach.call($tabbar.querySelectorAll('a'), function (a) { a.classList.toggle('is-active', a.getAttribute('data-tab') === TAB_OF[name]); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    document.documentElement.lang = lang();
    closeSheet();
    markIndex(name);
    if (history_[history_.length - 1] !== h) history_.push(h);
  }
  function back() {
    var cur = location.hash.replace(/^#\/?/, '');
    if (cur === 'edit-profile' && dirty()) { return discardDialog('#/profile'); }
    if (cur === 'session' && store.get('session', { set: 1 }).set <= DATA.exercise.sets) {
      return openSheet('<h3>Leave workout?</h3><p>Your progress (set ' + store.get('session', { set: 1 }).set + ' of ' + DATA.exercise.sets + ') is kept. You can continue later.</p><button class="btn btn-primary btn-block" data-action="close-sheet">Keep going</button><button class="btn btn-ghost btn-block" data-go="#/exercise">Leave</button>', 'dialog');
    }
    history_.pop();
    var prev = history_.pop();
    go(prev ? '#/' + prev : '#/home');
  }
  function dirty() {
    var f = document.getElementById('editForm'); if (!f || !editSnapshot) return false;
    var s = JSON.parse(editSnapshot);
    return f.name.value !== s.name || f.bio.value !== (s.bio || '') || String(f.h.value) !== String(s.h) || String(f.w.value) !== String(s.w);
  }
  function discardDialog(to) {
    openSheet('<h3>Discard changes?</h3><p>You have unsaved changes to your profile.</p><button class="btn btn-primary btn-block" data-action="save-profile">Save changes</button><button class="btn btn-ghost btn-block" data-action="discard" data-to="' + to + '" style="color:var(--danger)">Discard</button><button class="btn btn-block" style="background:none" data-action="close-sheet">' + t('cancel') + '</button>', 'dialog');
  }

  // ---------- index panel ----------
  var $list = document.getElementById('bugList');
  var ownerFilter = 'all';
  function renderIndex() {
    $list.innerHTML = window.LF_BUGS.filter(function (b) { return ownerFilter === 'all' || b.owner === ownerFilter; }).map(function (b) {
      return '<li><a class="bug-item" href="#/' + b.portal + '" data-portal="' + b.portal + '"><span class="bid">' + b.id + '</span><span class="btitle">' + esc(b.title) + '</span><span class="bmeta"><span class="owner owner-' + b.owner + '">' + (b.owner === 'Both' ? 'CMS+Portal' : b.owner) + '</span></span></a></li>';
    }).join('');
    document.getElementById('fabCount').textContent = window.LF_BUGS.length;
  }
  function markIndex(name) {
    Array.prototype.forEach.call($list.querySelectorAll('.bug-item'), function (a) { var p = a.getAttribute('data-portal').split('/')[0]; a.classList.toggle('is-current', p === name); });
  }

  // ---------- events ----------
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action],[data-go],[data-filter],[data-bug],[data-persona],[data-owner],[data-toggle],.bug-item');
    if (!el) return;
    if (el.classList.contains('bug-item')) { document.getElementById('bugIndex').classList.remove('is-open'); return; }
    if (el.hasAttribute('data-owner')) { ownerFilter = el.getAttribute('data-owner'); Array.prototype.forEach.call(document.querySelectorAll('[data-owner]'), function (c) { c.classList.toggle('is-active', c === el); }); renderIndex(); markIndex((location.hash.replace(/^#\/?/, '') || 'home').split('/')[0]); return; }
    if (el.hasAttribute('data-go')) { e.preventDefault(); go(el.getAttribute('data-go')); return; }
    if (el.hasAttribute('data-bug')) { bugSheet(el.getAttribute('data-bug')); return; }
    if (el.hasAttribute('data-persona')) { store.set('persona', el.getAttribute('data-persona')); render(); return; }
    if (el.hasAttribute('data-filter')) {
      var map = { meal: 'cook', level: 'yoga', style: 'yoga', cat: 'mind', gender: 'fit', goal: 'fit' };
      var fname = el.getAttribute('data-filter');
      setFilter(map[fname], fname, el.getAttribute('data-value')); var top = $screen.scrollTop; render(); $screen.scrollTop = top; return;
    }
    if (el.hasAttribute('data-toggle')) {
      var k = el.getAttribute('data-toggle'), s = store.get('privacy', { priv: false, coach: true, reco: true });
      s[k] = el.getAttribute('aria-checked') !== 'true'; store.set('privacy', s);
      el.setAttribute('aria-checked', s[k]); var hint = $screen.querySelector('[data-saved="' + k + '"]'); if (hint) { hint.hidden = false; setTimeout(function () { hint.hidden = true; }, 1600); }
      return;
    }
    var a = el.getAttribute('data-action');
    switch (a) {
      case 'back': back(); break;
      case 'open-index': document.getElementById('bugIndex').classList.add('is-open'); break;
      case 'close-index': document.getElementById('bugIndex').classList.remove('is-open'); break;
      case 'close-sheet': if (e.target === el) closeSheet(); else closeSheet(); break;
      case 'pick-country':
        var cur = store.get('country', COUNTRIES[0]);
        openSheet('<h3>Choose your country</h3><p class="small muted" style="margin:0 0 12px">Countries are managed in CMS › Onboarding.</p><div class="countries">' + COUNTRIES.map(function (c, n) { return '<button class="country ' + (c.name === cur.name ? 'is-active' : '') + '" data-action="set-country" data-i="' + n + '"><span class="flag">' + c.flag + '</span><span style="flex:1;font-weight:600">' + c.name + '</span><span class="muted">' + c.code + '</span></button>'; }).join('') + '</div>');
        break;
      case 'set-country': store.set('country', COUNTRIES[+el.getAttribute('data-i')]); render(); break;
      case 'login': go('#/onboarding'); toast('New number → Onboarding'); break;
      case 'slide-next': store.set('slide', store.get('slide', 0) + 1); render(); break;
      case 'slide-skip': store.set('slide', 2); render(); break;
      case 'onb-next':
        var fn = document.getElementById('fn');
        if (!fn.value.trim()) { document.getElementById('fnErr').hidden = false; fn.focus(); break; }
        var o = store.get('onb', {}); o.name = fn.value.trim(); store.set('onb', o); go('#/onb-summary'); break;
      case 'onb-save':
        var ob = Object.assign({ name: 'Su', h: 160, w: 100, goal: 90, act: 'Very active' }, store.get('onb', {}));
        var pr = store.get('profile', {}); pr.name = pr.name || ob.name; pr.h = ob.h; pr.w = ob.w; store.set('profile', pr); store.set('slide', 0);
        go('#/home'); setTimeout(function () { toast('Profile saved · ' + ob.h + ' cm, ' + ob.w + ' kg'); }, 50); break;
      case 'clear-fit': store.set('f:fit', {}); render(); break;
      case 'clear-yoga': store.set('f:yoga', {}); render(); break;
      case 'save-recipe':
        var id = +el.getAttribute('data-id'), sv = store.get('savedRecipes', []), i = sv.indexOf(id);
        if (i > -1) sv.splice(i, 1); else sv.push(id); store.set('savedRecipes', sv); render(); toast(i > -1 ? 'Removed from saved' : 'Recipe saved'); break;
      case 'challenge':
        var ch = store.get('challenges', {}), cid = el.getAttribute('data-id'); ch[cid] = !ch[cid]; store.set('challenges', ch); render(); if (ch[cid]) toast('Challenge completed!'); break;
      case 'complete-set':
        var ss = store.get('session', { set: 1, rest: false }); ss.rest = true; store.set('session', ss); render(); startRest(); break;
      case 'skip-rest':
        var s2 = store.get('session', { set: 1, rest: true }); s2.rest = false; s2.set++; store.set('session', s2); render(); break;
      case 'end-session': store.set('session', { set: 1, rest: false }); break;
      case 'reschedule':
        openSheet('<h3>Reschedule session</h3><p class="small muted" style="margin:0">Pick a new time with Marcus. Slots come from the coach\'s schedule in CMS.</p><div class="days">' + [['Wed', 28], ['Thu', 29], ['Fri', 30], ['Sat', 31], ['Mon', 2]].map(function (d, n) { return '<button class="day ' + (n === 0 ? 'is-active' : '') + '" data-action="pick-day">' + d[0] + '<strong>' + d[1] + '</strong></button>'; }).join('') + '</div>' +
          '<div class="slots">' + ['07:00', '09:30', '11:00', '14:00', '16:00', '18:30'].map(function (s, n) { return '<button class="slot ' + (n === 4 ? 'is-active' : '') + '" ' + (n === 1 ? 'disabled' : '') + ' data-action="pick-slot">' + s + '</button>'; }).join('') + '</div>' +
          '<p class="tiny">Times in MMT (UTC+6:30). Free reschedule up to 2 hours before.</p><button class="btn btn-primary btn-block" data-action="confirm-resched">Confirm Wed 28 · 16:00</button>');
        break;
      case 'pick-day': case 'pick-slot':
        Array.prototype.forEach.call(el.parentNode.children, function (c) { c.classList.remove('is-active'); }); el.classList.add('is-active');
        var d = $sheetRoot.querySelector('.day.is-active'), sl = $sheetRoot.querySelector('.slot.is-active');
        $sheetRoot.querySelector('[data-action="confirm-resched"]').textContent = 'Confirm ' + d.textContent.replace(/(\D+)(\d+)/, '$1 $2') + ' · ' + (sl ? sl.textContent : '');
        break;
      case 'confirm-resched': closeSheet(); toast('Session moved. Marcus has been notified.'); break;
      case 'soon': toast('Video sessions are coming soon'); break;
      case 'mark-all': store.set('allRead', true); render(); toast('All notifications marked as read'); break;
      case 'revoke': var rv = store.get('revoked', []); rv.push(el.getAttribute('data-id')); store.set('revoked', rv); render(); toast('Signed out of that device'); break;
      case 'revoke-all': store.set('revoked', ['d1']); render(); toast('Signed out of all other devices'); break;
      case 'data-req':
        var st = store.get('dataReq', 'none');
        if (st === 'none') openSheet('<h3>Download my data</h3><p class="small muted">We\'ll prepare a file with your profile, activity and saved items. A download link is sent by SMS to your phone number within 48 hours and stays valid for 7 days.</p><button class="btn btn-primary btn-block" data-action="data-confirm">Request my data</button><button class="btn btn-ghost btn-block" style="margin-top:8px" data-action="close-sheet">' + t('cancel') + '</button>');
        else if (st === 'processing') { store.set('dataReq', 'ready'); render(); toast('Demo: request marked ready in CMS'); }
        else toast('Downloading lifefit-data.zip');
        break;
      case 'data-confirm': store.set('dataReq', 'processing'); render(); toast('Request sent. We\'ll SMS you a link.'); break;
      case 'delete-acc': openSheet('<h3>Delete account?</h3><p>This removes your profile, activity and saved items. This can\'t be undone.</p><button class="btn btn-danger btn-block" data-action="close-sheet">Delete my account</button><button class="btn btn-ghost btn-block" data-action="close-sheet">' + t('cancel') + '</button>', 'dialog'); break;
      case 'lang':
        openSheet('<h3>Language</h3><div class="countries" style="margin-top:12px">' + [['en', 'English'], ['my', 'မြန်မာ (Burmese)'], ['id', 'Bahasa Indonesia']].map(function (l) { return '<button class="country ' + (l[0] === lang() ? 'is-active' : '') + '" data-action="set-lang" data-l="' + l[0] + '"><span style="flex:1;font-weight:600">' + l[1] + '</span></button>'; }).join('') + '</div><p class="tiny">Labels come from CMS › Translations. Content without a translation falls back to English.</p>');
        break;
      case 'set-lang': store.set('lang', el.getAttribute('data-l')); render(); break;
      case 'theme':
        var dark = el.getAttribute('aria-checked') !== 'true';
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); store.set('theme', dark ? 'dark' : 'light'); el.setAttribute('aria-checked', dark); break;
      case 'logout': go('#/login'); break;
      case 'save-profile': var f = document.getElementById('editForm'); if (f) saveProfile(f); closeSheet(); go('#/profile'); break;
      case 'discard': editSnapshot = null; closeSheet(); go(el.getAttribute('data-to')); break;
      case 'reset': store.reset(); render(); toast('Demo reset'); break;
    }
  });

  function saveProfile(f) { var p = store.get('profile', {}); p.name = f.name.value; p.bio = f.bio.value; p.h = +f.h.value; p.w = +f.w.value; store.set('profile', p); editSnapshot = JSON.stringify(p); }

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.id === 'editForm') { e.preventDefault(); saveProfile(f); toast('Profile updated.'); return; }
    if (f.hasAttribute('data-chat')) {
      e.preventDefault(); var k = f.getAttribute('data-chat'), inp = f.querySelector('input'), v = inp.value.trim(); if (!v) return;
      var arr = store.get('chat:' + k, []); var now = new Date(); var tm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      arr.push(['me', v, tm]); store.set('chat:' + k, arr); render();
      setTimeout(function () { var a2 = store.get('chat:' + k, []); a2.push(['them', k === 'coach' ? 'Got it! See you at 16:00.' : 'Thanks! An agent is looking into this now.', tm]); store.set('chat:' + k, a2); if (location.hash.indexOf(k === 'coach' ? 'coach-chat' : 'support-chat') > -1) { render(); $screen.scrollTop = $screen.scrollHeight; } }, 900);
    }
  });

  document.addEventListener('input', function (e) {
    var el = e.target;
    if (el.hasAttribute('data-digits')) {
      el.value = el.value.replace(/\D/g, '').slice(0, 11);
      var ok = el.value.length >= 7; document.getElementById('loginBtn').disabled = !ok;
      document.getElementById('phoneErr').hidden = ok || el.value.length === 0;
    }
    if (el.id === 'fn' && el.value.trim()) document.getElementById('fnErr').hidden = true;
  });
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.hasAttribute('data-onb')) {
      var k = el.getAttribute('data-onb'), o = store.get('onb', {}), v = el.value;
      if (k !== 'act') { v = parseFloat(v); var mn = +el.min, mx = +el.max; if (isNaN(v) || v < mn || v > mx) { toast('Enter a value between ' + mn + ' and ' + mx); return; } }
      o[k] = v; store.set('onb', o); var top = $screen.scrollTop; render(); $screen.scrollTop = top;
    }
  });

  function startRest() {
    var left = DATA.exercise.rest; if (sessionTimer) clearInterval(sessionTimer);
    sessionTimer = setInterval(function () {
      left--; var el = document.getElementById('timer');
      if (!el) { clearInterval(sessionTimer); sessionTimer = null; return; }
      el.textContent = '00:' + String(Math.max(0, left)).padStart(2, '0');
      if (left <= 0) { clearInterval(sessionTimer); sessionTimer = null; var s = store.get('session', { set: 1 }); s.rest = false; s.set++; store.set('session', s); render(); }
    }, 1000);
  }

  // ---------- boot ----------
  var savedTheme = store.get('theme', null); if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  renderIndex();
  var resetBtn = document.createElement('button'); resetBtn.className = 'link-btn'; resetBtn.style.marginTop = '8px'; resetBtn.style.fontSize = '13px'; resetBtn.setAttribute('data-action', 'reset'); resetBtn.textContent = 'Reset demo data';
  document.querySelector('.index').appendChild(resetBtn);
  window.addEventListener('hashchange', render);
  if (!location.hash) location.hash = '#/home'; else render();
})();
