/* LifeFit MM portal — full responsive design (reference: new-lifefit.vercel.app) with the LF-235 bug fixes.
   Vanilla JS, hash routing. Data marked "CMS:" comes from the CMS fields designed in cms.lifefit.mm. */
(function () {
  'use strict';

  var IMG = 'https://new-lifefit.vercel.app/img/'; // reference assets; gradient placeholder shows if an image can't load

  // ---------- storage (simulates server persistence) ----------
  var mem = {};
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('lfmm:' + k); if (v !== null) return JSON.parse(v); } catch (e) {} return mem[k] !== undefined ? mem[k] : d; },
    set: function (k, v) { mem[k] = v; try { localStorage.setItem('lfmm:' + k, JSON.stringify(v)); } catch (e) {} },
    reset: function () { mem = {}; try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf('lfmm:') === 0) localStorage.removeItem(k); }); } catch (e) {} }
  };

  // ---------- icons ----------
  var I = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    back: '<path d="M15 5l-7 7 7 7"/>', chev: '<path d="M9 5l7 7-7 7"/>',
    bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flame: '<path d="M12 3c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3-1-5 1-8z"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>', share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
    play: '<path d="M7 4l13 8-13 8z"/>', dumbbell: '<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19 14 10"/>', moon: '<path d="M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10z"/>',
    lotus: '<path d="M12 20c-4 0-8-2-9-6 3 0 6 1 9 4 3-3 6-4 9-4-1 4-5 6-9 6z"/><path d="M12 18c-2-3-2-8 0-12 2 4 2 9 0 12z"/>',
    bowl: '<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4"/>', target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>', cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>', doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>', help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 2-2.5 2-2.5 4M12 17h.01"/>',
    out: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"/>', phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>', laptop: '<rect x="4" y="5" width="16" height="11" rx="1"/><path d="M2 19h20"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', check: '<path d="M5 12l5 5 9-10"/>', send: '<path d="M4 12l16-8-6 16-3-7z"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    puzzle: '<path d="M10 4a2 2 0 0 1 4 0v2h4v4h-2a2 2 0 0 0 0 4h2v4h-4v-2a2 2 0 0 0-4 0v2H6v-4h2a2 2 0 0 0 0-4H6V6h4z"/>', trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M10 17h4v4h-4z"/>',
    scale: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 10a3 3 0 0 1 6 0M12 10l1.5-2"/>', book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>', restart: '<path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>', ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>', filter: '<path d="M4 6h16M7 12h10M10 18h4"/>', camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'
  };
  function ic(n, extra) { return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (extra || '') + '>' + (I[n] || '') + '</svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ph(file, tone, icon, extraCls, inner) {
    return '<div class="ph ' + (tone ? 't-' + tone : '') + ' ' + (extraCls || '') + '">' + ic(icon || 'leaf') + (file ? '<img src="' + IMG + file + '" alt="" loading="lazy" onerror="this.remove()">' : '') + (inner || '') + '</div>';
  }

  // ---------- i18n (LF-293: strings from CMS › Translations, fallback EN) ----------
  var STR = {
    en: { home: 'Home', explore: 'Explore', fitness: 'Fitness', mind: 'Mind', profile: 'Profile', daily: 'Daily Progress', today: 'Today', of_goal: 'of daily goal', move: 'Move', eat: 'Eat Healthy', mindp: 'Mind', min: 'min', meals: 'meals', cancel: 'Cancel', morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening', sub: "Let's make today amazing." },
    my: { home: 'ပင်မ', explore: 'ရှာဖွေရန်', fitness: 'ကြံ့ခိုင်ရေး', mind: 'စိတ်', profile: 'ပရိုဖိုင်', daily: 'နေ့စဉ် တိုးတက်မှု', today: 'ယနေ့', of_goal: 'နေ့စဉ်ပန်းတိုင်၏', move: 'လှုပ်ရှားမှု', eat: 'ကျန်းမာစွာစားသောက်', mindp: 'စိတ်', min: 'မိနစ်', meals: 'နပ်', cancel: 'မလုပ်တော့ပါ', morning: 'မင်္ဂလာနံနက်ခင်းပါ', afternoon: 'မင်္ဂလာနေ့လယ်ခင်းပါ', evening: 'မင်္ဂလာညနေခင်းပါ', sub: 'ယနေ့ကို အကောင်းဆုံးဖြစ်အောင်လုပ်ကြစို့' },
    id: { home: 'Beranda', explore: 'Jelajah', fitness: 'Kebugaran', mind: 'Pikiran', profile: 'Profil', daily: 'Progres Harian', today: 'Hari ini', of_goal: 'dari target harian', move: 'Gerak', eat: 'Makan Sehat', mindp: 'Pikiran', min: 'mnt', meals: 'porsi', cancel: 'Batal', morning: 'Selamat pagi', afternoon: 'Selamat siang', evening: 'Selamat malam', sub: 'Ayo jadikan hari ini luar biasa.' }
  };
  function lang() { return store.get('lang', 'en'); }
  function t(k) { var l = STR[lang()] || STR.en; return l[k] || STR.en[k] || k; }

  // ---------- data ----------
  var LEVEL_TAG = { Beginner: 'tag-beg', Intermediate: 'tag-int', Advanced: 'tag-adv', 'All Levels': '' };
  var DATA = {
    recipes: [ // CMS: meal_categories[], cook_time_min, calories_kcal (LF-285/342), typos fixed (LF-343)
      { id: 24, name: 'Protein Parfait', cat: ['Breakfast', 'Snacks'], time: 10, kcal: 320, p: 45, c: 26, f: 2.5, ing: ['1/2 cup rolled oats', '1 cup greek yogurt', '1 scoop vanilla whey', '1/2 cup mixed berries', '1 tsp honey'], desc: 'A high-protein layered breakfast that is ready in minutes.' },
      { id: 25, name: 'Green Protein Smoothie', cat: ['Breakfast', 'Snacks'], time: 5, kcal: 240, p: 28, c: 22, f: 5, ing: ['1 cup spinach', '1 banana', '1 scoop whey', '1 cup almond milk'], desc: 'Spinach, banana and whey blended into a light post-workout drink.' },
      { id: 26, name: 'Lemon Blueberry Pancakes', cat: ['Breakfast'], time: 20, kcal: 410, p: 24, c: 52, f: 11, ing: ['1 cup oat flour', '2 eggs', '1/2 cup blueberries', 'Zest of 1 lemon'], desc: 'Fluffy oat pancakes with fresh blueberries and lemon zest.' },
      { id: 27, name: 'Green Omelette', cat: ['Breakfast', 'Lunch'], time: 12, kcal: 290, p: 22, c: 6, f: 19, ing: ['3 eggs', '1 cup spinach', '1/4 avocado'], desc: 'Eggs with spinach and avocado for a quick, filling plate.' },
      { id: 28, name: 'Zucchini Onion Omelette', cat: ['Lunch'], time: 15, kcal: 260, p: 20, c: 9, f: 16, ing: ['3 eggs', '1 zucchini', '1/2 onion'], desc: 'A savoury omelette packed with sautéed zucchini and onion.' },
      { id: 29, name: 'Chicken Quinoa Bowl', cat: ['Lunch', 'Dinner'], time: 25, kcal: 520, p: 42, c: 48, f: 14, ing: ['150 g chicken breast', '1 cup cooked quinoa', 'Cherry tomatoes', 'Cucumber'], desc: 'Grilled chicken over quinoa with fresh vegetables.' },
      { id: 30, name: 'Baked Salmon & Greens', cat: ['Dinner'], time: 30, kcal: 480, p: 38, c: 12, f: 28, ing: ['160 g salmon', 'Broccoli', 'Green beans', 'Olive oil'], desc: 'Oven-baked salmon with broccoli and green beans.' },
      { id: 31, name: 'Hummus Veggie Cups', cat: ['Snacks'], time: 5, kcal: 180, p: 7, c: 18, f: 9, ing: ['3 tbsp hummus', 'Carrot sticks', 'Cucumber sticks'], desc: 'Crunchy vegetables with hummus for an afternoon snack.' }
    ],
    yoga: [ // CMS: level, style, is_featured (LF-286/317)
      { name: 'Morning Flow', style: 'Vinyasa', level: 'Beginner', min: 20, kcal: 110, featured: true, img: 'yoga-featured.jpg?v=2', sub: 'Energize Your Core' },
      { name: 'Vinyasa Flow', style: 'Vinyasa', level: 'Intermediate', min: 30, kcal: 190, img: 'yoga-s1.jpg' },
      { name: 'Hatha Basics', style: 'Hatha', level: 'Beginner', min: 25, kcal: 120, img: 'yoga-s2.jpg' },
      { name: 'Restorative Yoga', style: 'Restorative', level: 'Beginner', min: 40, kcal: 90, img: 'yoga-s3.jpg' },
      { name: 'Power Yoga', style: 'Power', level: 'Advanced', min: 35, kcal: 320, img: 'yoga-s4.jpg' },
      { name: 'Hatha Balance', style: 'Hatha', level: 'Intermediate', min: 30, kcal: 150 },
      { name: 'Power Core', style: 'Power', level: 'Intermediate', min: 25, kcal: 210 }
    ],
    mind: [ // CMS: categories[] (LF-287)
      { name: 'Calm Before Sleep', cat: ['Sleep'], min: 10 }, { name: 'Deep Sleep Body Scan', cat: ['Sleep'], min: 20 },
      { name: 'Release the Day', cat: ['Stress Relief'], min: 8 }, { name: 'Box Breathing', cat: ['Stress Relief', 'Anxiety'], min: 5 },
      { name: 'Focus Reset', cat: ['Focus'], min: 6 }, { name: 'Grounding 5-4-3-2-1', cat: ['Anxiety'], min: 7 }
    ],
    plans: [ // CMS: level, goals[], gender (LF-339/309)
      { name: 'Full Body Starter', level: 'Beginner', goals: ['Lose weight'], g: ['male', 'female'], min: 20, kcal: 160 },
      { name: 'Upper Body Strength', level: 'Intermediate', goals: ['Build muscle'], g: ['male'], min: 35, kcal: 260 },
      { name: 'Glutes & Legs', level: 'Intermediate', goals: ['Build muscle'], g: ['female'], min: 30, kcal: 240 },
      { name: 'Core Crusher', level: 'Intermediate', goals: ['Core strength'], g: ['male', 'female'], min: 15, kcal: 120 },
      { name: 'HIIT Fat Burn', level: 'Advanced', goals: ['Lose weight'], g: ['male', 'female'], min: 25, kcal: 330 },
      { name: 'Mobility Flow', level: 'Beginner', goals: ['Flexibility'], g: ['male', 'female'], min: 15, kcal: 70 }
    ],
    goals: ['Lose weight', 'Build muscle', 'Core strength', 'Flexibility'],
    exercise: { name: 'Dumbbell Bench Press', level: 'Intermediate', muscles: ['Chest', 'Triceps', 'Front delts'], sets: 4, reps: 10, rest: 60, equipment: ['Dumbbells', 'Flat bench'], min: 4, kcal: 45, desc: 'Lie on a flat bench, press the dumbbells up over your chest, then lower them slowly until your elbows are just below the bench.' },
    articles: [
      { id: 10, cat: 'Lifestyle', title: 'Stress Is Not Your Friend: 5 Ways to Reset', min: 6, img: 'ex-meditation.jpg' },
      { id: 11, cat: 'Workout', title: 'Why Rest Days Make You Stronger', min: 4, img: 'ex-fitness.jpg' },
      { id: 12, cat: 'Diet', title: 'Protein Basics for Busy People', min: 5, img: 'ex-cooking.jpg' },
      { id: 13, cat: 'Lifestyle', title: 'Sleep Better in 7 Days', min: 7, img: 'ex-healthy.jpg' },
      { id: 14, cat: 'Recipes', title: 'Meal Prep Sunday: A Simple Plan', min: 5, img: 'ex-cooking.jpg' },
      { id: 15, cat: 'Workout', title: 'Walking: The Most Underrated Workout', min: 3, img: 'ex-motivation.jpg?v=2' }
    ],
    magazines: [['Issue 12', 'Strong From Within', 'Oct 2026'], ['Issue 11', 'Fuel Your Mornings', 'Sep 2026'], ['Issue 10', 'The Calm Edition', 'Aug 2026'], ['Issue 09', 'Move More, Sit Less', 'Jul 2026'], ['Issue 08', 'Eat the Rainbow', 'Jun 2026'], ['Issue 07', 'Sleep Science', 'May 2026']],
    games: [ // Mind Games
      { id: 1, name: 'Bubbles Pirate Mania', skill: 'Coordination', desc: 'Pop matching bubbles before the ship sinks.' },
      { id: 2, name: 'Memory Match', skill: 'Memory', desc: 'Flip cards and find every pair in as few moves as possible.' },
      { id: 3, name: 'Number Rush', skill: 'Speed', desc: 'Tap numbers in order as fast as you can.' },
      { id: 4, name: 'Color Switch', skill: 'Focus', desc: 'Pass through the gates that match your colour.' },
      { id: 5, name: 'Logic Grid', skill: 'Logic', desc: 'Fill the grid so every row and column follows the rule.' },
      { id: 6, name: 'Word Hunt', skill: 'Memory', desc: 'Find hidden words before the timer runs out.' }
    ],
    challenges: [{ id: 'walk', name: 'Mindful Walking', sub: '15 min walk without your phone' }, { id: 'water', name: 'Hydration Hero', sub: 'Drink 8 glasses of water' }, { id: 'stretch', name: 'Stretch Break', sub: '5 min stretch every 2 hours' }],
    stories: [{ id: 11, title: 'From Couch to 5K at 42', who: 'Thida, Yangon', min: 4 }, { id: 12, title: 'How I Learned to Love Mornings', who: 'Ko Min, Mandalay', min: 3 }, { id: 13, title: 'Losing 12 kg Without Giving Up Rice', who: 'Hnin, Bago', min: 5 }]
  };

  // ---------- helpers ----------
  var $screen = document.getElementById('screen'), $sheet = document.getElementById('sheetRoot'), $toast = document.getElementById('toast');
  var tt; function toast(m) { $toast.textContent = m; $toast.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(function () { $toast.classList.remove('is-on'); }, 2400); }
  function go(h) { location.hash = h; }
  function persona() { return store.get('persona', 'active'); }
  function profile() { return Object.assign({ name: 'Su Myat', bio: '', email: '', dob: '', gender: 'Female', h: 160, w: 62 }, store.get('profile', {})); }
  function initials(n) { return (n || 'U').split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase(); }
  function greet() { var h = new Date().getHours(); return h < 12 ? t('morning') : h < 18 ? t('afternoon') : t('evening'); }
  function filters(k) { return store.get('f:' + k, {}); }
  function setFilter(k, n, v) { var f = filters(k); f[n] = v; store.set('f:' + k, f); }

  function head(title, sub, opts) {
    opts = opts || {};
    return '<header class="page-head">' + (opts.back ? '<button class="icon-btn" data-action="back" aria-label="Back">' + ic('back') + '</button>' : '') +
      '<div class="ph-text"><h1>' + title + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (opts.right || '') + '</header>';
  }
  function fixbar(ids, extra) { return '<div class="fixbar"><span>Bug fixes on this page:</span>' + ids.map(function (id) { return '<button data-bug="' + id + '">' + id + '</button>'; }).join('') + (extra || '') + '</div>'; }
  function personaSwitch() { var p = persona(); return '<span style="margin-left:auto;display:inline-flex;gap:6px;align-items:center">Demo: <button data-persona="new" style="' + (p === 'new' ? 'background:var(--ink);color:var(--bg)' : '') + '">New account</button><button data-persona="active" style="' + (p === 'active' ? 'background:var(--ink);color:var(--bg)' : '') + '">Has activity</button></span>'; }
  function empty(icon, title, text, cta) { return '<div class="empty"><div class="empty-ico">' + ic(icon) + '</div><h3>' + title + '</h3><p>' + text + '</p>' + (cta || '') + '</div>'; }
  function chips(name, values, active, counts) {
    return '<div class="chips" role="group" aria-label="' + name + '">' + values.map(function (v) {
      return '<button class="chip ' + (v === active ? 'is-active' : '') + '" data-filter="' + name + '" data-value="' + esc(v) + '" aria-pressed="' + (v === active) + '">' + esc(v) + (counts && counts[v] !== undefined ? '<span class="count">' + counts[v] + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function secHead(title, right) { return '<div class="sec-head"><h2>' + title + '</h2>' + (right || '') + '</div>'; }
  function lvl(l) { return '<span class="tag ' + (LEVEL_TAG[l] || '') + '">' + l + '</span>'; }
  function menuRow(href, icon, title, sub, isNew, right) {
    return '<a class="menu-row ' + (isNew ? 'is-new' : '') + '" href="' + href + '"><span class="mi">' + ic(icon) + '</span><span class="mt"><strong>' + title + (isNew ? ' <span class="tag tag-new">New</span>' : '') + '</strong>' + (sub ? '<span>' + sub + '</span>' : '') + '</span>' + (right || '<span class="chev">' + ic('chev') + '</span>') + '</a>';
  }
  function bell() { var unread = persona() === 'active' && !store.get('allRead', false); return '<a class="icon-btn" href="#/notifications" aria-label="Notifications' + (unread ? ', 3 new' : '') + '">' + ic('bell') + (unread ? '<span class="dot"></span>' : '') + '</a>'; }

  // ---------- screens ----------
  var S = {};

  /* ===== Home ===== */
  S.home = function () {
    var active = persona() === 'active', p = profile();
    var comp = active ? [[42, 60], [2, 3], [12, 20]] : [[0, 60], [0, 3], [0, 20]];
    var pct = Math.round(comp.reduce(function (a, c) { return a + Math.min(1, c[0] / c[1]); }, 0) / 3 * 100);
    var L = [['move', 'min', 'b-move'], ['eat', 'meals', 'b-eat'], ['mindp', 'min', 'b-mind']];
    var progress = '<div class="card">' + secHead(t('daily') + ' <span class="tiny" style="font-weight:600">· ' + t('today') + '</span>') +
      (active ? '<div class="progress-card"><div class="ring" style="--p:' + pct + '"><div><div><strong>' + pct + '%</strong><span>' + t('of_goal') + '</span></div></div></div><div class="pc-bars">' +
        comp.map(function (c, n) { return '<div class="pc-row"><div class="pc-l"><strong>' + t(L[n][0]) + '</strong><span class="muted">' + c[0] + ' / ' + c[1] + ' ' + t(L[n][1]) + '</span></div><div class="bar ' + L[n][2] + '"><i style="width:' + Math.round(c[0] / c[1] * 100) + '%"></i></div></div>'; }).join('') + '</div></div>' +
        '<div class="ann-note">LF-280: ' + pct + '% = average of Move 70%, Eat 67%, Mind 60% (was a fixed 78%). Targets are set in CMS › Daily goals.</div>'
        : '<div class="progress-card"><div class="ring"><div><div><strong>0%</strong><span>' + t('of_goal') + '</span></div></div></div><div><p class="muted" style="margin:0 0 12px">No activity yet today. Finish a workout, log a meal or try a meditation to start filling your ring.</p><a class="btn btn-primary btn-sm" href="#/fitness">Start a workout</a></div></div>') + '</div>';
    var qa = '<div class="sec">' + secHead('Quick Actions') + '<div class="qa-grid">' + [['#/fitness', 'Workout', 'qa1.png', 'move', 'dumbbell'], ['#/mind', 'Meditate', 'qa2.png', 'mind', 'lotus'], ['#/cooking', 'Recipes', 'qa3.png', 'eat', 'bowl'], ['#/mind-games', 'Games', 'qa4.png', '', 'puzzle']].map(function (q) {
      return '<a class="qa" href="' + q[0] + '">' + ph(q[2], q[3], q[4]) + '<span>' + q[1] + '</span></a>'; }).join('') + '</div></div>';
    var forYou = '<div class="sec">' + secHead('For You Today', '<a class="link-btn" href="#/yoga">See all</a>') +
      '<a class="tile" href="#/yoga">' + ph('home-stretch.jpg', 'mind', 'lotus') + '<div class="tb"><h3>10 Min Morning Stretch</h3><p>Wake up your body and mind.</p><div class="meta" style="margin-top:6px"><span>' + ic('clock') + '10 ' + t('min') + '</span>' + lvl('Beginner') + '</div></div></a></div>';
    var journey = '<div class="sec">' + secHead('Continue Your Journey', active ? '<a class="link-btn" href="#/fitness">See all</a>' : '') +
      (active ? '<a class="row-card" href="#/fitness">' + ph('home-core.jpg', 'move', 'dumbbell') + '<div><h3>7 Day Core Challenge</h3><div class="meta"><span>Day 3 of 7</span><span>60%</span></div><div class="bar" style="margin-top:8px"><i style="width:60%"></i></div></div><span class="chev">' + ic('chev') + '</span></a>'
        : empty('target', 'No program yet', 'Pick a program in Fitness and your progress will show up here.', '<a class="btn btn-ghost btn-sm" href="#/fitness">Browse programs</a>')) + '</div>';
    return head(greet() + ', ' + esc(p.name.split(' ')[0]) + '! 👋', t('sub'), { right: bell() }) +
      fixbar(['LF-280', 'LF-293', 'LF-304'], personaSwitch()) +
      '<div class="cols-2"><div>' + progress + qa + '</div><div>' + forYou.replace('class="sec"', 'class="sec" style="margin-top:0"') + journey + '</div></div>' +
      '<div class="ann-note">Live Session section is not shown: removed from the MM release (LF-265, LF-306).</div>';
  };

  /* ===== Explore ===== */
  var EXPLORE = [['#/fitness', 'Fitness', 'Build strength & stay active', 'ex-fitness.jpg', 'move', 'dumbbell'], ['#/healthy', 'Healthy Living', 'Tips for a better everyday', 'ex-healthy.jpg', 'eat', 'leaf'], ['#/yoga', 'Yoga', 'Balance body & mind', 'ex-yoga.jpg', 'mind', 'lotus'], ['#/mind', 'Meditation', 'Calm your mind, find peace', 'ex-meditation.jpg', 'mind', 'moon'], ['#/motivation', 'Motivation', 'Inspire your best self', 'ex-motivation.jpg?v=2', 'move', 'trophy'], ['#/bmi', 'BMI Calculator', 'Know your numbers', 'ex-bmi.jpg', '', 'scale'], ['#/cooking', 'Health Cooking', 'Delicious & healthy recipes', 'ex-cooking.jpg', 'eat', 'bowl'], ['#/mind-games', 'Mind Games', 'Train your brain daily', 'ex-mindgames.jpg', 'mind', 'puzzle'], ['#/coach', 'Coach Session', 'Your daily coach and plan', 'ex-videocall.jpg', '', 'video']];
  S.explore = function () {
    var q = store.get('exq', '').toLowerCase();
    var list = EXPLORE.filter(function (e) { return !q || (e[1] + ' ' + e[2]).toLowerCase().indexOf(q) > -1; });
    return head('Explore', 'Find what fuels your best life.', { right: bell() }) +
      '<div class="field" style="max-width:520px"><input class="input" type="search" placeholder="Search fitness, yoga, recipes…" aria-label="Search" data-search="exq" value="' + esc(store.get('exq', '')) + '"></div>' +
      (list.length ? '<div class="grid-tiles">' + list.map(function (e) { return '<a class="tile" href="' + e[0] + '">' + ph(e[3], e[4], e[5]) + '<div class="tb"><h3>' + e[1] + '</h3><p>' + e[2] + '</p></div></a>'; }).join('') + '</div>'
        : empty('search', 'No results found', 'Try another word, like “yoga” or “recipes”.'));
  };

  /* ===== Fitness ===== */
  S.fitness = function () {
    var f = Object.assign({ gender: 'All', goal: 'All Goals' }, filters('fit'));
    var list = DATA.plans.filter(function (p) { return (f.gender === 'All' || p.g.indexOf(f.gender.toLowerCase()) > -1) && (f.goal === 'All Goals' || p.goals.indexOf(f.goal) > -1); });
    return head('Fitness', 'Stronger body, stronger you.', { right: bell() }) + fixbar(['LF-307', 'LF-309', 'LF-339']) +
      '<div class="hero">' + ph('fit-banner.jpg?v=2', 'move', 'dumbbell') + '<div class="hb"><div class="eyebrow">Featured program · 8 weeks</div><h2>LEAN &amp; STRONG</h2><p>Build muscle, burn fat, feel unstoppable. 4 workouts a week · Intermediate.</p>' +
      '<div class="hero-weeks" aria-label="Week 1 of 8">' + [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) { return '<i class="' + (n === 1 ? 'on' : '') + '"></i>'; }).join('') + '</div><a class="btn btn-sm" href="#/exercise">Start Program</a></div></div>' +
      '<div class="sec"><div class="filter-row"><span>Gender</span>' + chips('gender', ['All', 'Male', 'Female'], f.gender) + '</div><div class="filter-row"><span>Goal</span>' + chips('goal', ['All Goals'].concat(DATA.goals), f.goal) + '</div></div>' +
      '<div class="sec">' + secHead('Workout Plans', '<span class="tiny">' + list.length + ' plans</span>') +
      (list.length ? '<div class="grid-rows">' + list.map(function (p) {
        return '<a class="row-card" href="#/exercise">' + ph('', 'move', 'dumbbell') + '<div><h3>' + p.name + '</h3><div class="meta"><span>' + ic('clock') + p.min + ' ' + t('min') + '</span><span>' + ic('flame') + p.kcal + ' kcal</span></div><div class="tags">' + lvl(p.level) + '<span class="tag">' + p.goals[0] + '</span></div></div><span class="chev">' + ic('chev') + '</span></a>';
      }).join('') + '</div>' : empty('filter', 'No plans for this filter', 'Try another goal or gender.', '<button class="btn btn-ghost btn-sm" data-action="clear" data-k="fit">Clear filters</button>')) + '</div>';
  };

  S.exercise = function () {
    var e = DATA.exercise, saved = store.get('savedEx', false);
    return head('', '', { back: true, right: '<button class="icon-btn ' + (saved ? 'is-on' : '') + '" data-action="save-ex" aria-pressed="' + saved + '" aria-label="Save exercise">' + ic('bookmark') + '</button>' }) + fixbar(['LF-268', 'LF-310']) +
      '<div class="cols-2e"><div>' + ph('ex-fitness.jpg', 'move', 'dumbbell', 'article-hero', '<button class="play" aria-label="Play video">' + ic('play') + '</button>') + '</div><div>' +
      '<h1 style="font-size:28px;margin:0 0 8px">' + e.name + '</h1><div class="meta"><span>' + ic('clock') + e.min + ' ' + t('min') + '</span><span>' + ic('flame') + e.kcal + ' kcal</span>' + lvl(e.level) + '</div>' +
      '<div class="stats3" style="margin-top:18px"><div class="stat"><strong>' + e.sets + '</strong><span>Sets</span></div><div class="stat"><strong>' + e.reps + '</strong><span>Reps</span></div><div class="stat"><strong>' + e.rest + 's</strong><span>Rest</span></div></div>' +
      '<div class="sec" style="margin-top:20px"><h2 style="font-size:16px;margin:0 0 8px">Target muscles</h2><div class="tags">' + e.muscles.map(function (m, n) { return '<span class="tag ' + (n === 0 ? 'tag-new' : '') + '">' + m + (n === 0 ? ' · primary' : '') + '</span>'; }).join('') + '</div></div>' +
      '<div class="sec" style="margin-top:20px"><h2 style="font-size:16px;margin:0 0 6px">Equipment</h2><p class="muted" style="margin:0">' + e.equipment.join(' · ') + '</p></div>' +
      '<div class="sec" style="margin-top:20px"><h2 style="font-size:16px;margin:0 0 6px">About this exercise</h2><p class="muted" style="margin:0">' + e.desc + '</p></div>' +
      '<div style="display:grid;grid-template-columns:1fr 2fr;gap:10px;margin-top:24px"><button class="btn btn-ghost">' + ic('play') + 'Play Video</button><a class="btn btn-primary" href="#/session">Start Workout</a></div></div></div>';
  };

  var sessionTimer = null;
  S.session = function () {
    var e = DATA.exercise, s = store.get('session', { set: 1, rest: false }), done = s.set > e.sets;
    return head(e.name, done ? '' : (s.rest ? 'Rest' : 'Set ' + s.set + ' of ' + e.sets), { back: true }) + fixbar(['LF-268']) + '<div class="session card">' +
      (done ? '<div class="empty-ico" style="width:76px;height:76px;margin:16px auto 8px;background:var(--primary-soft);color:var(--primary-soft-ink)">' + ic('check') + '</div><h2 style="margin:0">Nice work!</h2><p class="muted">' + e.sets + ' sets × ' + e.reps + ' reps done · ' + e.kcal + ' kcal. Added to today\'s Move progress.</p><a class="btn btn-primary btn-block" href="#/home" data-action="end-session">Back to Home</a>'
        : '<div class="timer" id="timer">' + (s.rest ? '00:' + String(e.rest).padStart(2, '0') : e.reps + ' reps') + '</div><div class="sets">' + Array.from({ length: e.sets }, function (_, n) { return '<i class="' + (n + 1 < s.set ? 'done' : n + 1 === s.set ? 'cur' : '') + '"></i>'; }).join('') + '</div>' +
          (s.rest ? '<button class="btn btn-ghost btn-block" data-action="skip-rest">Skip rest</button>' : '<button class="btn btn-primary btn-block" data-action="complete-set">Complete set ' + s.set + '</button>') +
          '<p class="tiny" style="margin-top:12px">Leaving mid-session asks first and keeps your progress.</p>') + '</div>';
  };

  /* ===== Health Cooking ===== */
  S.cooking = function () {
    var f = Object.assign({ meal: 'All' }, filters('cook')), cats = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];
    var counts = {}; cats.forEach(function (c) { counts[c] = c === 'All' ? DATA.recipes.length : DATA.recipes.filter(function (r) { return r.cat.indexOf(c) > -1; }).length; });
    var list = DATA.recipes.filter(function (r) { return f.meal === 'All' || r.cat.indexOf(f.meal) > -1; });
    var saved = store.get('savedRecipes', []), feat = DATA.recipes[0];
    return head('Health Cooking', 'Delicious & healthy recipes', { back: true, right: bell() }) + fixbar(['LF-285', 'LF-342', 'LF-343']) +
      chips('meal', cats, f.meal, counts) +
      '<div class="sec">' + secHead('Featured Recipe') + '<a class="hero" href="#/recipe/' + feat.id + '" style="text-decoration:none;min-height:220px">' + ph('ex-cooking.jpg', 'eat', 'bowl') + '<div class="hb"><div class="eyebrow">Breakfast · ' + feat.time + ' ' + t('min') + ' · ' + feat.kcal + ' kcal</div><h2>' + feat.name + '</h2><p>' + feat.desc + '</p></div></a></div>' +
      '<div class="sec">' + secHead(f.meal === 'All' ? 'Popular Meal Prep' : f.meal, '<span class="tiny">' + list.length + ' recipes</span>') +
      (list.length ? '<div class="grid-rows">' + list.map(function (r) {
        return '<a class="row-card" href="#/recipe/' + r.id + '">' + ph('', 'eat', 'bowl') + '<div><h3>' + r.name + '</h3><div class="meta"><span>' + ic('clock') + r.time + ' ' + t('min') + '</span><span>' + ic('flame') + r.kcal + ' kcal</span><span>' + r.p + 'g protein</span></div><div class="tags">' + r.cat.map(function (c) { return '<span class="tag">' + c + '</span>'; }).join('') + '</div></div>' + (saved.indexOf(r.id) > -1 ? '<span style="color:var(--primary)">' + ic('bookmark', ' style="fill:currentColor"') + '</span>' : '<span class="chev">' + ic('chev') + '</span>') + '</a>';
      }).join('') + '</div>' : empty('bowl', 'No ' + f.meal.toLowerCase() + ' recipes yet', 'New recipes are added every week.', '<button class="btn btn-ghost btn-sm" data-filter="meal" data-value="All">Show all recipes</button>')) + '</div>';
  };

  S.recipe = function (id) {
    var r = DATA.recipes.filter(function (x) { return String(x.id) === String(id); })[0] || DATA.recipes[0];
    var saved = store.get('savedRecipes', []).indexOf(r.id) > -1;
    return head('', '', { back: true, right: '<button class="icon-btn" data-action="share" aria-label="Share">' + ic('share') + '</button><button class="icon-btn ' + (saved ? 'is-on' : '') + '" data-action="save-recipe" data-id="' + r.id + '" aria-pressed="' + saved + '" aria-label="' + (saved ? 'Saved' : 'Save recipe') + '">' + ic('bookmark') + '</button>' }) + fixbar(['LF-315', 'LF-343', 'LF-342']) +
      '<div class="cols-2e"><div>' + ph(r.id === 24 ? 'ex-cooking.jpg' : '', 'eat', 'bowl', 'article-hero', '<button class="play" aria-label="Play video">' + ic('play') + '</button>') + '</div><div>' +
      '<h1 style="font-size:28px;margin:0 0 8px">' + r.name + '</h1><div class="meta"><span>' + ic('clock') + r.time + ' ' + t('min') + '</span><span>' + ic('flame') + r.kcal + ' kcal</span>' + r.cat.map(function (c) { return '<span class="tag">' + c + '</span>'; }).join('') + '</div>' +
      '<p class="muted">' + r.desc + '</p><div class="macro" style="margin-top:16px"><div><strong>' + r.kcal + '</strong><span>kcal</span></div><div><strong>' + r.c + 'g</strong><span>Carbohydrate</span></div><div><strong>' + r.p + 'g</strong><span>Proteins</span></div><div><strong>' + r.f + 'g</strong><span>Fat</span></div></div>' +
      '<div class="sec" style="margin-top:20px"><h2 style="font-size:16px;margin:0 0 8px">Food Material</h2><ul class="muted" style="margin:0;padding-left:20px;line-height:1.9">' + r.ing.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul></div>' +
      (saved ? '<p class="saved-hint" style="margin-top:14px">' + ic('check', ' style="width:14px;height:14px;vertical-align:-2px"') + ' Saved to your profile. Still saved after reload.</p>' : '') + '</div></div>';
  };

  /* ===== Healthy Living ===== */
  S.healthy = function () {
    var f = Object.assign({ hl: 'All' }, filters('hl'));
    var list = DATA.articles.filter(function (a) { return f.hl === 'All' || a.cat === f.hl; });
    return head('Healthy Living', 'Eat well, live well.', { back: true, right: bell() }) + chips('hl', ['All', 'Lifestyle', 'Workout', 'Diet', 'Recipes'], f.hl) +
      '<div class="sec">' + secHead('Top Stories') + (list.length ? '<div class="grid-cards">' + list.map(function (a) { return '<a class="tile" href="#/article/' + a.id + '">' + ph(a.img, 'eat', 'book') + '<div class="tb"><span class="tag">' + a.cat + '</span><h3 style="margin-top:6px">' + a.title + '</h3><p>' + a.min + ' min read</p></div></a>'; }).join('') + '</div>' : empty('book', 'No stories yet', 'Check back soon.')) + '</div>' +
      '<div class="sec">' + secHead('Health Cooking', '<a class="link-btn" href="#/cooking">See all</a>') + '<div class="grid-cards">' + DATA.recipes.slice(0, 4).map(function (r) { return '<a class="tile" href="#/recipe/' + r.id + '">' + ph('', 'eat', 'bowl') + '<div class="tb"><h3>' + r.name + '</h3><p>' + r.time + ' ' + t('min') + ' · ' + r.kcal + ' kcal</p></div></a>'; }).join('') + '</div></div>' +
      '<div class="sec">' + secHead('Magazines', '<span class="tiny">12 issues</span>') + '<div class="grid-tiles">' + DATA.magazines.map(function (m, n) { return '<a class="tile" href="#/magazine/' + n + '"><div class="ph ' + ['t-eat', 't-mind', 't-move', '', 't-eat', 't-mind'][n] + '" style="aspect-ratio:3/4">' + ic('book') + '<div style="position:absolute;left:12px;right:12px;bottom:12px;color:var(--ink);text-align:left"><div class="tiny" style="font-weight:800;letter-spacing:.08em">' + m[0].toUpperCase() + '</div><strong style="font-size:17px;line-height:1.2;display:block">' + m[1] + '</strong></div></div><div class="tb"><p>' + m[2] + '</p></div></a>'; }).join('') + '</div></div>';
  };
  S.article = function (id) {
    var a = DATA.articles.filter(function (x) { return String(x.id) === String(id); })[0] || DATA.articles[0];
    var saved = store.get('savedArticles', []).indexOf(a.id) > -1;
    return head('', '', { back: true, right: '<button class="icon-btn" data-action="share" aria-label="Share">' + ic('share') + '</button><button class="icon-btn ' + (saved ? 'is-on' : '') + '" data-action="save-article" data-id="' + a.id + '" aria-label="Save article">' + ic('bookmark') + '</button>' }) +
      '<article class="prose" style="margin:0 auto">' + ph(a.img, 'eat', 'book', 'article-hero') + '<p class="tiny" style="margin-top:16px"><span class="tag">' + a.cat + '</span> · ' + a.min + ' min read</p><h1 style="font-size:30px;margin:6px 0 12px">' + a.title + '</h1>' +
      '<p>Short, practical habits make the biggest difference. Start with one change this week and build from there.</p><h2>1. Breathe first</h2><p>Two minutes of slow breathing lowers your heart rate and helps you reset between tasks.</p><h2>2. Move a little, often</h2><p>A 10-minute walk after meals is enough to lift your mood and energy.</p><h2>3. Protect your sleep</h2><p>Keep the same bedtime, even on weekends, and put your phone away 30 minutes before.</p>' +
      '<div class="sec">' + secHead('Read Next') + '<div class="grid-rows">' + DATA.articles.filter(function (x) { return x.id !== a.id; }).slice(0, 2).map(function (x) { return '<a class="row-card" href="#/article/' + x.id + '">' + ph(x.img, 'eat', 'book') + '<div><h3>' + x.title + '</h3><div class="meta">' + x.min + ' min read</div></div><span class="chev">' + ic('chev') + '</span></a>'; }).join('') + '</div></div></article>';
  };
  S.magazine = function (n) {
    var m = DATA.magazines[+n || 0];
    return head(m[1], m[0] + ' · ' + m[2], { back: true }) + '<div class="cols-2e"><div class="ph t-mind" style="aspect-ratio:3/4;border-radius:var(--radius-xl);max-width:420px">' + ic('book') + '</div><div><h2 style="font-size:18px;margin:0 0 6px">Description</h2><p class="muted">This month: simple strength routines you can do at home, a 7-day meal plan, and how to keep going when motivation drops.</p><button class="btn btn-primary" data-action="toast" data-msg="Opening magazine…">' + ic('book') + 'View</button>' +
      '<div class="sec">' + secHead('Related Magazines') + '<div class="grid-tiles">' + DATA.magazines.filter(function (_, i) { return i !== (+n || 0); }).slice(0, 3).map(function (x) { return '<a class="tile" href="#/magazine/' + DATA.magazines.indexOf(x) + '"><div class="ph t-eat" style="aspect-ratio:3/4">' + ic('book') + '</div><div class="tb"><h3>' + x[1] + '</h3><p>' + x[0] + '</p></div></a>'; }).join('') + '</div></div></div></div>';
  };

  /* ===== Yoga ===== */
  S.yoga = function () {
    var f = Object.assign({ level: 'All', style: 'All' }, filters('yoga'));
    var list = DATA.yoga.filter(function (y) { return !y.featured && (f.level === 'All' || y.level === f.level) && (f.style === 'All' || y.style === f.style); });
    var feat = DATA.yoga[0];
    return head('Yoga', 'Balance body & mind.', { back: true, right: bell() }) + fixbar(['LF-286', 'LF-317']) +
      '<div class="hero">' + ph(feat.img, 'mind', 'lotus') + '<div class="hb"><div class="eyebrow">Featured · ' + feat.style + '</div><h2>' + feat.name + '</h2><p>' + feat.min + ' ' + t('min') + ' · ' + feat.sub + '</p><button class="btn btn-sm" data-action="toast" data-msg="Starting Morning Flow">' + ic('play') + 'Start</button></div></div>' +
      '<div class="sec"><div class="filter-row"><span>Level</span>' + chips('level', ['All', 'Beginner', 'Intermediate', 'Advanced'], f.level) + '</div><div class="filter-row"><span>Style</span>' + chips('style', ['All', 'Vinyasa', 'Hatha', 'Restorative', 'Power'], f.style) + '</div></div>' +
      '<div class="sec">' + secHead('Yoga Sessions', '<span class="tiny">' + list.length + ' sessions</span>') +
      (list.length ? '<div class="grid-rows">' + list.map(function (y) { return '<button class="row-card" data-action="toast" data-msg="Opening ' + y.name + '">' + ph(y.img, 'mind', 'lotus') + '<div><h3>' + y.name + '</h3><div class="meta"><span>' + ic('clock') + y.min + ' ' + t('min') + '</span><span>' + ic('flame') + y.kcal + ' kcal</span></div><div class="tags">' + lvl(y.level) + '<span class="tag">' + y.style + '</span></div></div><span class="chev">' + ic('chev') + '</span></button>'; }).join('') + '</div>'
        : empty('lotus', 'No sessions match', f.level + ' · ' + f.style + ' has no sessions yet. Try another level or style.', '<button class="btn btn-ghost btn-sm" data-action="clear" data-k="yoga">Clear filters</button>')) + '</div>';
  };

  /* ===== Mind ===== */
  S.mind = function () {
    var f = Object.assign({ cat: 'All' }, filters('mind')), cats = ['All', 'Sleep', 'Stress Relief', 'Focus', 'Anxiety'];
    var list = DATA.mind.filter(function (m) { return f.cat === 'All' || m.cat.indexOf(f.cat) > -1; });
    return head('Mind', 'Peace begins within.', { right: bell() }) + fixbar(['LF-287']) +
      '<div class="hero" style="min-height:200px">' + ph('mind-banner.jpg?v=2', 'mind', 'moon') + '<div class="hb"><h2>Breathe. Relax. Be Present.</h2><p>Find calm in every moment.</p></div></div>' +
      '<div class="sec">' + secHead('Guided Sessions', '<span class="tiny">' + list.length + ' sessions</span>') + chips('cat', cats, f.cat) +
      '<div class="grid-rows" style="margin-top:12px">' + list.map(function (m) { return '<a class="row-card" href="#/player/' + encodeURIComponent(m.name) + '">' + ph('', 'mind', m.cat[0] === 'Sleep' ? 'moon' : 'lotus') + '<div><h3>' + m.name + '</h3><div class="meta"><span>' + ic('clock') + m.min + ' ' + t('min') + '</span></div><div class="tags">' + m.cat.map(function (c) { return '<span class="tag">' + c + '</span>'; }).join('') + '</div></div><span class="chev">' + ic('play') + '</span></a>'; }).join('') + '</div></div>';
  };
  S.player = function (name) {
    name = decodeURIComponent(name || 'Calm Before Sleep');
    return head('Guided Session', '', { back: true }) + '<div class="cols-2e"><div class="ph t-mind" style="aspect-ratio:1;border-radius:var(--radius-xl);max-width:460px">' + ic('moon') + '</div><div><h1 style="font-size:28px;margin:0 0 6px">' + esc(name) + '</h1><p class="muted">Close your eyes and follow the voice.</p>' +
      '<div class="bar" style="margin:24px 0 6px"><i style="width:0%"></i></div><div class="tiny" style="display:flex;justify-content:space-between"><span>00:00</span><span>10:00</span></div>' +
      '<div style="display:flex;gap:14px;justify-content:center;align-items:center;margin-top:20px"><button class="icon-btn" aria-label="Back 15 seconds">-15</button><button class="btn btn-primary" style="width:68px;height:68px;padding:0;border-radius:50%" data-action="toast" data-msg="Playing">' + ic('play', ' style="fill:currentColor"') + '</button><button class="icon-btn" aria-label="Forward 15 seconds">+15</button></div>' +
      '<div class="sec">' + secHead('More Sessions') + '<div class="list">' + DATA.mind.slice(0, 3).map(function (m) { return '<a class="row-card" href="#/player/' + encodeURIComponent(m.name) + '">' + ph('', 'mind', 'lotus') + '<div><h3>' + m.name + '</h3><div class="meta">' + m.min + ' ' + t('min') + '</div></div><span class="chev">' + ic('play') + '</span></a>'; }).join('') + '</div></div></div></div>';
  };

  /* ===== Mind Games ===== */
  S['mind-games'] = function () {
    var f = Object.assign({ skill: 'All' }, filters('games')), list = DATA.games.filter(function (g) { return f.skill === 'All' || g.skill === f.skill; });
    return head('Mind Games', 'Play. Train. Get Smarter.', { back: true, right: bell() }) +
      '<div class="hero">' + ph('ex-mindgames.jpg', 'mind', 'puzzle') + '<div class="hb"><div class="eyebrow">Featured Game · Coordination</div><h2>Bubbles Pirate Mania</h2><p>5–10 min per round · Free · No download</p><a class="btn btn-sm" href="#/game/1">' + ic('play') + 'Play Now</a></div></div>' +
      '<div class="sec">' + secHead('Pick a Skill to Train') + chips('skill', ['All', 'Memory', 'Focus', 'Logic', 'Coordination', 'Speed'], f.skill) + '</div>' +
      '<div class="sec">' + secHead('All Games', '<span class="tiny">' + list.length + ' games</span>') + '<div class="grid-cards">' + list.map(function (g) { return '<a class="tile" href="#/game/' + g.id + '">' + ph(g.id === 1 ? 'ex-mindgames.jpg' : '', 'mind', 'puzzle') + '<div class="tb"><span class="tag">' + g.skill + '</span><h3 style="margin-top:6px">' + g.name + '</h3><p>5–10 min · Free</p></div></a>'; }).join('') + '</div></div>';
  };
  S.game = function (id) {
    var g = DATA.games.filter(function (x) { return String(x.id) === String(id); })[0] || DATA.games[0];
    return head('', '', { back: true }) + '<div class="cols-2e"><div>' + ph(g.id === 1 ? 'ex-mindgames.jpg' : '', 'mind', 'puzzle', 'article-hero') + '</div><div><span class="tag">' + g.skill + '</span><h1 style="font-size:28px;margin:8px 0">' + g.name + '</h1>' +
      '<div class="stats3"><div class="stat"><strong>5–10</strong><span>Min / play</span></div><div class="stat"><strong>Free</strong><span>To play</span></div><div class="stat"><strong>0 MB</strong><span>No download</span></div></div>' +
      '<div class="sec" style="margin-top:20px"><h2 style="font-size:16px;margin:0 0 6px">Why play this?</h2><p class="muted" style="margin:0">' + g.desc + ' Trains ' + g.skill.toLowerCase() + ' in short daily rounds.</p></div>' +
      '<a class="btn btn-primary btn-block" style="margin-top:24px" href="#/game-play/' + g.id + '">' + ic('play') + 'Play Now</a></div></div>' +
      '<div class="sec">' + secHead('More Games') + '<div class="grid-cards">' + DATA.games.filter(function (x) { return x.id !== g.id; }).slice(0, 4).map(function (x) { return '<a class="tile" href="#/game/' + x.id + '">' + ph('', 'mind', 'puzzle') + '<div class="tb"><h3>' + x.name + '</h3><p>' + x.skill + '</p></div></a>'; }).join('') + '</div></div>';
  };
  S['game-play'] = function (id) {
    var g = DATA.games.filter(function (x) { return String(x.id) === String(id); })[0] || DATA.games[0];
    return head(g.name, g.skill, { back: true }) + '<div class="game-frame"><div style="text-align:center"><div class="tiny" style="color:#9cb">Loading game…</div><p style="margin:6px 0 0;font-size:13px;color:#cde">Taking long? <a href="#/game-play/' + g.id + '" style="color:#8fe2bf">Open in new tab</a></p></div></div>' +
      '<div class="game-bar"><a class="btn btn-ghost btn-sm" href="#/game/' + g.id + '">' + ic('x') + 'Close</a><div style="display:flex;gap:8px"><button class="btn btn-ghost btn-sm" data-action="toast" data-msg="Restarted">' + ic('restart') + 'Restart</button><button class="btn btn-ghost btn-sm" data-action="toast" data-msg="Fullscreen">' + ic('expand') + 'Fullscreen</button></div></div>';
  };

  /* ===== Motivation ===== */
  S.motivation = function () {
    var done = store.get('challenges', {});
    return head('Motivation', 'Inspire your best self.', { back: true, right: bell() }) + fixbar(['LF-319']) +
      '<div class="quote"><p>“The only limit to our realization of tomorrow will be our doubts of today.”</p><span style="opacity:.75">Franklin D. Roosevelt</span></div>' +
      '<div class="cols-2e sec"><div>' + secHead('Daily Challenges', '<span class="tiny">Resets 00:00 MMT</span>') + '<div class="menu">' +
      DATA.challenges.map(function (c) { var d = !!done[c.id]; return '<button class="menu-row" data-action="challenge" data-id="' + c.id + '" aria-pressed="' + d + '"><span class="mi" style="' + (d ? 'background:var(--primary);color:var(--primary-ink)' : '') + '">' + ic(d ? 'check' : 'trophy') + '</span><span class="mt"><strong>' + c.name + '</strong><span>' + c.sub + '</span></span><span class="tag ' + (d ? 'tag-beg' : 'tag-int') + '">' + (d ? 'Completed' : 'In Progress') + '</span></button>'; }).join('') +
      '</div><div class="ann-note">LF-319: status is saved per user per day and stays after reload.</div></div>' +
      '<div>' + secHead('Motivational Stories') + '<div class="list">' + DATA.stories.map(function (s) { return '<a class="row-card" href="#/story/' + s.id + '">' + ph('', 'move', 'trophy') + '<div><h3>' + s.title + '</h3><div class="meta">' + s.who + ' · ' + s.min + ' min read</div></div><span class="chev">' + ic('chev') + '</span></a>'; }).join('') + '</div></div></div>';
  };
  S.story = function (id) {
    var i = Math.max(0, DATA.stories.map(function (s) { return String(s.id); }).indexOf(String(id))), s = DATA.stories[i], prev = DATA.stories[i - 1], next = DATA.stories[i + 1];
    return head('', '', { back: true, right: '<button class="icon-btn" data-action="share" aria-label="Share">' + ic('share') + '</button>' }) + '<article class="prose" style="margin:0 auto">' + ph('ex-motivation.jpg?v=2', 'move', 'trophy', 'article-hero') + '<h1 style="font-size:28px;margin:16px 0 4px">' + s.title + '</h1><p class="tiny">' + s.who + '</p><p>It started with ten minutes a day. No big plan, just showing up. After a month the ten minutes became thirty, and the habit stuck.</p><p>The secret was not motivation. It was making the first step so small that skipping it felt silly.</p>' +
      '<div style="display:flex;justify-content:space-between;margin-top:24px">' + (prev ? '<a class="btn btn-ghost btn-sm" href="#/story/' + prev.id + '">' + ic('back') + 'Previous</a>' : '<span></span>') + (next ? '<a class="btn btn-ghost btn-sm" href="#/story/' + next.id + '">Next' + ic('chev') + '</a>' : '') + '</div></article>';
  };

  /* ===== BMI ===== */
  S.bmi = function () {
    var b = store.get('bmi', { g: 'Male', h: 170, w: 68, a: 28 });
    var v = b.w / Math.pow(b.h / 100, 2), cat = v < 18.5 ? 'Underweight' : v < 25 ? 'Normal Weight' : v < 30 ? 'Overweight' : 'Obese';
    var pos = Math.max(0, Math.min(100, (v / 40) * 100));
    return head('BMI Calculator', 'Know your numbers.', { back: true }) + '<div class="cols-2e"><form class="card" id="bmiForm" novalidate>' +
      '<div class="seg" style="margin-bottom:16px">' + ['Male', 'Female'].map(function (g) { return '<button type="button" class="' + (b.g === g ? 'is-active' : '') + '" data-action="bmi-g" data-g="' + g + '">' + g + '</button>'; }).join('') + '</div>' +
      '<div class="grid-2f"><div class="field"><label for="bh">Height (cm)</label><input class="input" id="bh" name="h" type="number" min="100" max="250" step="0.1" value="' + b.h + '" required></div><div class="field"><label for="bw">Weight (kg)</label><input class="input" id="bw" name="w" type="number" min="20" max="300" step="0.1" value="' + b.w + '" required></div></div>' +
      '<div class="field"><label for="ba">Age</label><input class="input" id="ba" name="a" type="number" min="10" max="100" value="' + b.a + '"></div><span class="err" id="bmiErr" hidden>Enter a height between 100 and 250 cm and a weight between 20 and 300 kg.</span>' +
      '<button class="btn btn-primary btn-block" type="submit">Calculate</button></form>' +
      '<div class="card"><div class="tiny" style="font-weight:800;letter-spacing:.08em">YOUR BMI</div><div style="display:flex;align-items:baseline;gap:10px"><strong style="font-size:44px">' + v.toFixed(1) + '</strong><span class="tag ' + (cat === 'Normal Weight' ? 'tag-beg' : cat === 'Underweight' ? '' : 'tag-adv') + '">' + cat + '</span></div>' +
      '<div class="bmi-scale"><i></i><i></i><i></i><i></i></div><div class="bmi-pin"><b style="left:' + pos + '%"></b></div><div class="tiny" style="display:flex;justify-content:space-between;padding:0 0 0 40%"><span>18.5</span><span>25.0</span><span>30.0</span></div>' +
      '<h2 style="font-size:16px;margin:20px 0 8px">BMI Categories</h2><div class="bmi-cats">' + [['Underweight', '< 18.5'], ['Normal Weight', '18.5 – 24.9'], ['Overweight', '25.0 – 29.9'], ['Obese', '≥ 30.0']].map(function (c) { return '<div class="' + (c[0] === cat ? 'on' : '') + '"><span>' + c[0] + '</span><span>' + c[1] + '</span></div>'; }).join('') + '</div></div></div>';
  };

  /* ===== Coach ===== */
  S.coach = function () {
    return head('Coach Session', '', { back: true }) + fixbar(['LF-349', 'LF-323', 'LF-324']) + '<div class="cols-2"><div>' +
      '<div class="card"><span class="tag tag-new">DAILY COACH</span><p style="margin:8px 0 14px;font-weight:700">Marcus is online and ready for you</p><div class="coach-head">' + ph('marcus-avatar.jpg', '', 'user') + '<div style="flex:1"><h2 style="margin:0;font-size:20px">Coach Marcus Vance</h2><div class="muted small">NASM Performance Specialist</div><div class="tags"><span class="tag">HIIT</span><span class="tag">STRENGTH</span></div></div></div>' +
      '<div class="stats3" style="margin-top:16px"><div class="stat"><strong>4.9 ★</strong><span>Rating</span></div><div class="stat"><strong>1.2k+</strong><span>Sessions</span></div><div class="stat"><strong>8 Yrs</strong><span>Exp.</span></div></div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;margin-top:16px"><button class="btn btn-primary btn-sm" data-action="toast" data-msg="Video sessions are coming soon">' + ic('video') + 'Join</button><a class="btn btn-ghost btn-sm" href="#/coach-chat">' + ic('chat') + 'Message</a><button class="btn btn-ghost btn-sm" data-action="reschedule">' + ic('cal') + 'Reschedule</button></div></div>' +
      '<div class="card sec"><h2 style="font-size:18px;margin:0 0 4px">Today\'s Program &amp; Prep</h2><div class="tiny">Today · 16:00 MMT · 45 min</div><p style="margin:12px 0 4px"><strong>Session target</strong></p><p class="muted" style="margin:0">Core Stability &amp; Functional Movement</p><p style="margin:12px 0 6px"><strong>Required equipment</strong></p><div class="tags"><span class="tag">Yoga Mat</span><span class="tag">Light Weights</span><span class="tag">Loop Band</span></div><div class="card-flat" style="margin-top:14px"><strong>Preparation tip</strong><p class="muted" style="margin:4px 0 0">Hydrate 15 mins before we go live. Keep your loop band nearby; we will open with active glute drills!</p></div></div></div>' +
      '<div><div class="card">' + secHead('Today\'s Nutrition Target', '<span class="tiny">set by coach</span>') + '<div class="macro"><div><strong>1,750</strong><span>kcal</span></div><div><strong>180g</strong><span>Carbohydrate</span></div><div><strong>140g</strong><span>Proteins</span></div><div><strong>55g</strong><span>Fat</span></div></div>' +
      '<div class="bar" style="margin-top:14px;height:12px"><i style="width:41%;background:var(--warn);border-radius:0"></i><i style="width:32%;background:var(--eat);border-radius:0"></i><i style="width:27%;background:var(--move);border-radius:0"></i></div><p class="tiny" style="margin-top:8px">Carbs 41% · Protein 32% · Fat 27% of calories</p></div>' +
      '<div class="ann-note">AI Coach (Coach Aria) is out of scope for MM (LF-264); video sessions show “coming soon”.</div></div></div>';
  };

  function chatScreen(title, sub, msgs, bugs, key) {
    var extra = store.get('chat:' + key, []);
    return '<div class="chat-wrap">' + head(title, sub, { back: true }) + fixbar(bugs) + '<div class="chat" id="chat"><span class="chat-day">Today</span>' + msgs.concat(extra).map(function (m) { return '<div class="bubble ' + m[0] + '">' + esc(m[1]) + '<time>' + m[2] + '</time></div>'; }).join('') + '</div>' +
      '<form class="composer" data-chat="' + key + '"><input class="input" placeholder="Write a message" aria-label="Message" required><button class="btn btn-primary" aria-label="Send">' + ic('send') + '</button></form></div>';
  }
  S['coach-chat'] = function () { return chatScreen('Marcus Vance', '<span class="dot-live"></span>Online · replies within 1 hour', [['them', 'Hi! Ready for today\'s core session at 16:00?', '14:02']], ['LF-323'], 'coach'); };
  S['support-chat'] = function () { return chatScreen('LifeFit Support', '<span class="dot-live"></span>Usually replies in a few minutes', [['them', 'Hi, this is LifeFit Support. How can we help you today?', '16:40']], ['LF-332'], 'support'); };

  /* ===== Profile & settings ===== */
  S.profile = function () {
    var active = persona() === 'active', p = profile();
    var mins = active ? [30, 0, 45, 20, 0, 0, 0] : [0, 0, 0, 0, 0, 0, 0], avg = Math.round(mins.reduce(function (a, b) { return a + b; }, 0) / 7);
    var langName = { en: 'English', my: 'မြန်မာ (Burmese)', id: 'Bahasa Indonesia' }[lang()];
    return head('Profile', '', { right: bell() }) + fixbar(['LF-291', 'LF-351', 'LF-293', 'LF-350'], personaSwitch()) + '<div class="cols-2"><div>' +
      '<div class="card"><div class="profile-top"><div class="avatar">' + initials(p.name) + '</div><div><h2 style="margin:0;font-size:22px">' + esc(p.name) + '</h2><p class="muted" style="margin:2px 0 8px">' + (p.bio ? esc(p.bio) : 'Add a short bio') + '</p><a class="btn btn-ghost btn-sm" href="#/edit-profile">Edit profile</a></div></div></div>' +
      '<div class="stats3 sec">' + (active ? [[6, 'Workouts'], [3, 'Streak Days'], [2, 'Goals Met']] : [[0, 'Workouts'], [0, 'Streak Days'], [0, 'Goals Met']]).map(function (s) { return '<div class="stat"><strong>' + s[0] + '</strong><span>' + s[1] + '</span></div>'; }).join('') + '</div>' +
      '<div class="card sec">' + secHead('Weekly Activity', active ? '<span class="tiny">Avg: ' + avg + 'm/day</span>' : '') +
      (active ? '<div class="bars">' + mins.map(function (m, n) { return '<div><i class="' + (m ? 'on' : '') + '" style="height:' + Math.max(4, m / 60 * 100) + 'px"></i>' + 'MTWTFSS'[n] + '</div>'; }).join('') + '</div>' : '<p class="muted" style="margin:0">Your week is empty so far. Workouts, yoga and meditation show up here.</p>') + '</div></div>' +
      '<div><div class="menu">' + menuRow('#/notifications', 'bell', 'Notifications', '') + menuRow('#/privacy', 'shield', 'Privacy & Security', '') + menuRow('#/legal', 'doc', 'Legal & Data', 'Terms, privacy, your data', true) +
      '<button class="menu-row" data-action="lang"><span class="mi">' + ic('globe') + '</span><span class="mt"><strong>Language</strong><span>' + langName + '</span></span><span class="chev">' + ic('chev') + '</span></button>' +
      '<div class="menu-row"><span class="mi">' + ic('moon') + '</span><span class="mt"><strong>Dark Mode</strong></span><button class="switch" role="switch" aria-label="Dark mode" aria-checked="' + (document.documentElement.getAttribute('data-theme') === 'dark') + '" data-action="theme"></button></div>' +
      menuRow('#/support', 'help', 'Help & Support', '') + '<button class="menu-row" data-action="logout"><span class="mi" style="color:var(--danger)">' + ic('out') + '</span><span class="mt"><strong style="color:var(--danger)">Log Out</strong></span></button></div></div></div>';
  };

  var editSnapshot = null;
  S['edit-profile'] = function () {
    var p = profile(); editSnapshot = JSON.stringify(p);
    return head('Setting Profile', '', { back: true }) + fixbar(['LF-352', 'LF-279']) + '<form class="card" id="editForm" style="max-width:760px">' +
      '<div style="display:flex;gap:16px;align-items:center;margin-bottom:20px"><div class="avatar" style="width:76px;height:76px;font-size:26px">' + initials(p.name) + '</div><button type="button" class="btn btn-ghost btn-sm" data-action="toast" data-msg="Choose a photo">' + ic('camera') + 'CHANGE PHOTO</button></div>' +
      '<div class="grid-2f"><div class="field"><label for="ep-name">Full name</label><input class="input" id="ep-name" name="name" value="' + esc(p.name) + '"></div><div class="field"><label for="ep-email">Email Address</label><input class="input" id="ep-email" name="email" type="email" value="' + esc(p.email) + '" placeholder="you@example.com"></div></div>' +
      '<div class="field"><label for="ep-bio">Bio</label><textarea class="input" id="ep-bio" name="bio" rows="2" placeholder="A few words about you">' + esc(p.bio) + '</textarea></div>' +
      '<div class="grid-2f"><div class="field"><label for="ep-dob">Date of Birth</label><input class="input" id="ep-dob" name="dob" type="date" value="' + esc(p.dob) + '"></div><div class="field"><label for="ep-g">Gender</label><select class="input" id="ep-g" name="gender">' + ['Female', 'Male'].map(function (g) { return '<option ' + (p.gender === g ? 'selected' : '') + '>' + g + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="ep-h">Height (cm)</label><input class="input" id="ep-h" name="h" type="number" min="50" max="250" value="' + p.h + '"></div><div class="field"><label for="ep-w">Weight (kg)</label><input class="input" id="ep-w" name="w" type="number" step="0.1" min="20" max="300" value="' + p.w + '"></div></div>' +
      '<button class="btn btn-primary btn-block" type="submit">UPDATE PROFILE</button><p class="tiny" style="text-align:center;margin-bottom:0">Height, weight and gender come from onboarding. Change something and press Back to see the confirmation.</p></form>';
  };

  S.notifications = function () {
    var active = persona() === 'active', allRead = store.get('allRead', false), prefs = Object.assign({ workout: true, live: false, motiv: true, recipes: true, games: false, push: true, email: true, sms: false }, store.get('notifPrefs', {}));
    var items = [['flame', 'You finished Core Crusher', '15 min · 120 kcal added to Move', '2 h ago'], ['bowl', 'New recipe: Baked Salmon & Greens', 'Dinner · 30 min · 480 kcal', 'Today, 07:30'], ['trophy', 'Challenge completed', 'Mindful Walking', 'Yesterday']];
    function pr(k, title, sub) { return '<div class="menu-row"><span class="mt"><strong>' + title + '</strong>' + (sub ? '<span>' + sub + '</span>' : '') + '</span><button class="switch" role="switch" aria-label="' + title + '" aria-checked="' + !!prefs[k] + '" data-pref="' + k + '"></button></div>'; }
    return head('Notifications', '', { back: true, right: active && !allRead ? '<button class="btn btn-ghost btn-sm" data-action="mark-all">Mark all as read</button>' : '' }) + fixbar(['LF-327', 'LF-328'], personaSwitch()) + '<div class="cols-2e"><div>' +
      secHead('Recent', active && !allRead ? '<span class="tag tag-new">3 new</span>' : '') +
      (active ? '<div class="menu">' + items.map(function (n) { return '<div class="notif ' + (allRead ? '' : 'unread') + '"><span class="mi" style="background:var(--surface)">' + ic(n[0]) + '</span><div class="mt"><strong>' + n[1] + '</strong><p>' + n[2] + '</p><span class="tiny">' + n[3] + '</span></div></div>'; }).join('') + '</div>' + (allRead ? '<p class="saved-hint">All caught up. Read state is saved.</p>' : '')
        : empty('bell', 'No notifications yet', 'We\'ll let you know about your workouts, new recipes and challenges here.')) + '</div>' +
      '<div><div class="menu-title" style="margin-top:0">Notify me about</div><div class="menu">' + pr('workout', 'Workout reminders', 'Every day at ' + store.get('remTime', '07:00')) +
      '<div class="menu-row"><span class="mt"><strong>Reminder time</strong></span><input class="input" type="time" value="' + store.get('remTime', '07:00') + '" data-action-input="rem" style="width:auto" aria-label="Reminder time"></div>' +
      pr('live', 'Live sessions', '') + pr('motiv', 'Daily motivation', '') + pr('recipes', 'New recipes', '') + pr('games', 'Mind games', '') + '</div>' +
      '<div class="menu-title">Channels</div><div class="menu">' + pr('push', 'Push notifications', 'On this device') + pr('email', 'Email', 'Weekly progress summary') + pr('sms', 'SMS', 'Important account updates only') + '</div></div></div>';
  };

  S.privacy = function () {
    var s = Object.assign({ otp: true, priv: false, coach: true, reco: true }, store.get('privacy', {}));
    function sw(k, title, sub) { return '<div class="menu-row"><span class="mt"><strong>' + title + '</strong><span>' + sub + '</span> <span class="saved-hint" data-saved="' + k + '" hidden>Saved</span></span><button class="switch" role="switch" aria-label="' + title + '" aria-checked="' + !!s[k] + '" data-toggle="' + k + '"></button></div>'; }
    var c = store.get('country', { code: '+95' });
    return head('Privacy & Security', '', { back: true }) + fixbar(['LF-329', 'LF-330']) + '<div class="cols-2e"><div>' +
      '<div class="card" style="display:flex;gap:14px;align-items:center"><span class="mi" style="background:var(--primary-soft);color:var(--primary-soft-ink)">' + ic('shield') + '</span><div><strong>Your account is protected</strong><div class="muted small">You sign in with your phone number.</div></div></div>' +
      '<div class="menu-title">Account</div><div class="menu"><div class="menu-row"><span class="mi">' + ic('phone') + '</span><span class="mt"><strong>Phone number</strong><span>' + c.code + ' 9 ••• ••• 789</span></span><span class="tag tag-beg">Verified</span></div>' + menuRow('#/devices', 'laptop', 'Logged-in devices', '2 active devices') + '</div>' +
      '<div class="menu-title">Security</div><div class="menu">' + sw('otp', 'Ask OTP on new devices', 'Extra check when you sign in elsewhere') + '</div></div>' +
      '<div><div class="menu-title" style="margin-top:0">Privacy</div><div class="menu">' + sw('priv', 'Private profile', 'Only you can see your activity') + sw('coach', 'Share progress with coaches', 'Coaches see your workout history') + sw('reco', 'Personalized recommendations', 'Use my activity to suggest content') + '</div>' +
      '<div class="menu-title">Legal &amp; data</div><div class="menu">' + menuRow('#/legal', 'doc', 'Legal & Data', 'Terms, Privacy Policy, download or delete your data') + '</div></div></div>';
  };

  S.devices = function () {
    var revoked = store.get('revoked', []);
    var list = [['phone', 'Chrome on Android', 'Yangon · This device', true, 'd0'], ['laptop', 'Safari on macOS', 'Mandalay · Last active 2 days ago', false, 'd1']].filter(function (d) { return revoked.indexOf(d[4]) < 0; });
    return head('Logged-in devices', 'Sign out of devices you don\'t recognise.', { back: true }) + fixbar(['LF-330']) + '<div style="max-width:720px"><div class="menu">' + list.map(function (d) {
      return '<div class="menu-row"><span class="mi">' + ic(d[0]) + '</span><span class="mt"><strong>' + d[1] + '</strong><span>' + (d[3] ? '<span class="dot-live"></span>' : '') + d[2] + '</span></span>' + (d[3] ? '<span class="tag tag-new">Current</span>' : '<button class="btn btn-ghost btn-sm" data-action="revoke" data-id="' + d[4] + '">Sign out</button>') + '</div>';
    }).join('') + '</div>' + (list.length > 1 ? '<button class="btn btn-ghost sec" data-action="revoke-all" style="color:var(--danger)">Sign out of all other devices</button>' : '<p class="tiny sec">Only this device is signed in.</p>') + '</div>';
  };

  S.legal = function () {
    var req = store.get('dataReq', 'none');
    var right = req === 'none' ? '<span class="chev">' + ic('chev') + '</span>' : req === 'processing' ? '<span class="tag tag-int">Processing</span>' : '<span class="tag tag-beg">Ready</span>';
    return head('Legal & Data', '', { back: true }) + fixbar(['LF-351', 'LF-333', 'LF-294']) + '<div style="max-width:720px"><div class="menu">' + menuRow('#/legal-doc/terms', 'doc', 'Terms and Conditions', 'Version 1.2 · effective 20 Oct 2026') + menuRow('#/legal-doc/privacy', 'shield', 'Privacy Policy', 'Version 1.1 · effective 20 Oct 2026') + '</div>' +
      '<div class="menu-title">Your data</div><div class="menu"><button class="menu-row" data-action="data-req"><span class="mi">' + ic('download') + '</span><span class="mt"><strong>Download my data</strong><span>' + (req === 'none' ? 'Get a copy of your LifeFit data' : req === 'processing' ? 'Requested today · we\'ll SMS a download link within 48 h' : 'Your file is ready · link valid for 7 days') + '</span></span>' + right + '</button>' +
      '<button class="menu-row" data-action="delete-acc"><span class="mi" style="color:var(--danger)">' + ic('trash') + '</span><span class="mt"><strong style="color:var(--danger)">Delete account</strong><span>Permanently remove your account</span></span></button></div></div>';
  };

  S['legal-doc'] = function (which) {
    var priv = which === 'privacy';
    return head(priv ? 'Privacy Policy' : 'Terms and Conditions', '', { back: true }) + fixbar(['LF-294']) + '<article class="prose card">' +
      '<div class="version">' + ic('check', ' style="width:14px;height:14px;color:var(--primary)"') + 'Version ' + (priv ? '1.1' : '1.2') + ' · Effective 20 Oct 2026</div><div class="ann-note">Sample text for the design. Replace with LifeFit\'s official legal copy from CMS › Legal pages.</div>' +
      (priv ? '<h2>1. What we collect</h2><p>Your phone number, the profile details you enter (name, height, weight, goals) and your activity inside LifeFit.</p><h2>2. How we use it</h2><p>To personalise workouts, calculate your progress and send the notifications you choose.</p><h2>3. Your choices</h2><p>You can make your profile private, download your data or delete your account from Legal &amp; Data.</p><h2>4. Contact</h2><p>Questions about privacy can be sent through Help &amp; Support.</p>'
        : '<h2>1. Using LifeFit</h2><p>LifeFit offers fitness, nutrition and mindfulness content for personal, non-commercial use.</p><h2>2. Your account</h2><p>You sign in with your phone number and are responsible for activity on your account.</p><h2>3. Health notice</h2><p>Content is general guidance and not medical advice. Check with a doctor before starting a new program.</p><h2>4. Subscription</h2><p>Access may depend on an active subscription with your mobile operator.</p><h2>5. Changes</h2><p>We will notify you in the app when these terms change.</p>') + '</article>';
  };

  S.support = function () {
    var tab = store.get('faqTab', 'Account'), p = profile(), q = store.get('faqq', '').toLowerCase();
    var FAQ = { Account: [['How do I sign in?', 'Enter your phone number on the Sign in screen and tap Continue.'], ['How do I change my name or photo?', 'Go to Profile › Edit profile, make your changes and tap Update Profile.']], Premium: [['How do I cancel my subscription?', 'Send STOP to your operator short code or contact support.']], Workouts: [['Can I do workouts without equipment?', 'Yes. Use the Equipment filter or pick plans marked “No equipment”.']], Games: [['Do games need a download?', 'No. All Mind Games play in your browser.']] };
    var list = (q ? [].concat.apply([], Object.keys(FAQ).map(function (k) { return FAQ[k]; })) : FAQ[tab]).filter(function (f) { return !q || (f[0] + f[1]).toLowerCase().indexOf(q) > -1; });
    return head('Help & Support', 'Hi ' + esc(p.name.split(' ')[0]) + ', how can we help?', { back: true }) + fixbar(['LF-332']) + '<div class="cols-2e"><div>' +
      '<div class="field"><input class="input" type="search" placeholder="Search help" aria-label="Search help" data-search="faqq" value="' + esc(store.get('faqq', '')) + '"></div>' +
      (q ? '' : '<div class="chips" style="margin-bottom:12px">' + Object.keys(FAQ).map(function (k) { return '<button class="chip ' + (k === tab ? 'is-active' : '') + '" data-action="faq-tab" data-t="' + k + '">' + k + '</button>'; }).join('') + '</div>') +
      (list.length ? '<div class="menu">' + list.map(function (f) { return '<details class="menu-row" style="display:block"><summary style="font-weight:600;cursor:pointer">' + f[0] + '</summary><p class="muted small" style="margin:8px 0 0">' + f[1] + '</p></details>'; }).join('') + '</div>' : empty('search', 'No results found', 'Try different words or chat with us.')) + '</div>' +
      '<div><div class="menu"><a class="menu-row" href="#/support-chat"><span class="mi" style="background:var(--primary-soft);color:var(--primary-soft-ink)">' + ic('chat') + '</span><span class="mt"><strong>Chat with support</strong><span><span class="dot-live"></span>Usually replies in a few minutes</span></span><span class="chev">' + ic('chev') + '</span></a>' + menuRow('#/contact', 'send', 'Send us a message', 'We reply by email within 24 hours') + '</div></div></div>';
  };
  S.contact = function () {
    return head('Contact Support', '', { back: true }) + '<form class="card" style="max-width:640px" data-form="contact"><div class="field"><label for="ct">Topic</label><select class="input" id="ct">' + ['Account & login', 'Premium & payment', 'Workouts & videos', 'Mind games', 'Something else'].map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select></div><div class="field"><label for="cm">Message</label><textarea class="input" id="cm" rows="5" required placeholder="Tell us what happened"></textarea></div><button class="btn btn-primary btn-block">Send Message</button></form>';
  };

  /* ===== Auth & onboarding (full-width split layout) ===== */
  var COUNTRIES = [{ flag: '🇲🇲', code: '+95', name: 'Myanmar' }, { flag: '🇹🇭', code: '+66', name: 'Thailand' }, { flag: '🇸🇬', code: '+65', name: 'Singapore' }, { flag: '🇲🇾', code: '+60', name: 'Malaysia' }, { flag: '🇮🇩', code: '+62', name: 'Indonesia' }, { flag: '🇮🇳', code: '+91', name: 'India' }];
  function auth(art, tone, icon, body) { return '<div class="auth"><div class="auth-art">' + ph(art, tone, icon) + '</div><div class="auth-body">' + body + '</div></div>'; }

  S.login = function () {
    var c = store.get('country', COUNTRIES[0]);
    return auth('ex-meditation.jpg', 'mind', 'lotus', '<a class="logo" href="#/home" style="padding:0"><span class="brand-mark"></span><span>LifeFit</span></a>' +
      '<h1>Sign in or Sign up</h1><p class="muted" style="margin:0 0 24px">Welcome back! Please enter your phone number. New here? We\'ll set up your account in a minute.</p>' +
      '<div class="field"><label for="phone">Phone Number</label><div class="phone-field"><button type="button" data-action="pick-country" aria-label="Country code ' + c.name + '"><span class="flag">' + c.flag + '</span>' + c.code + '</button><input id="phone" inputmode="numeric" autocomplete="tel" placeholder="9 123 456 789" data-digits></div><span class="err" id="phoneErr" hidden>Enter a valid phone number (7–11 digits).</span></div>' +
      '<button class="btn btn-primary btn-block" data-action="login" id="loginBtn" disabled>CONTINUE</button><div class="divider">or</div><a class="btn btn-ghost btn-block" href="#/onboarding">Create New Account</a>' +
      '<p class="small muted" style="text-align:center;margin-top:24px">Having trouble logging in? <a href="#/support" class="link-btn">Get Help</a></p>' +
      fixbar(['LF-296', 'LF-271']) + '<div class="ann-note"><strong>After Continue (LF-271):</strong> number not registered or <code>onboarding_completed = false</code> → Onboarding. Otherwise → Home.</div>');
  };
  S.otp = function () {
    return auth('ex-meditation.jpg', 'mind', 'lotus', '<button class="icon-btn" data-action="back" aria-label="Back">' + ic('back') + '</button><h1>Verify Your Account</h1><p class="muted">We have sent an OTP to your phone. Enter the 6-digit code below.</p><div class="otp" style="margin:20px 0">' + [1, 2, 3, 4, 5, 6].map(function () { return '<input class="input" inputmode="numeric" maxlength="1" aria-label="Digit">'; }).join('') + '</div><a class="btn btn-primary btn-block" href="#/home">Verify</a><p class="small muted" style="text-align:center">Didn\'t get the OTP? <button class="link-btn" data-action="toast" data-msg="OTP sent again">Resend OTP</button></p><div class="ann-note">OTP is planned for a later release (LF-297). Today sign-in uses the phone number only.</div>');
  };

  var SLIDES = [['Breathe, Move, Thrive', 'Wellness, meditation, and fitness, all in one place to help you live your best life.', 'ob/onboard1.jpg', 'lotus'], ['Stronger Body, Sharper Mind', 'Unlock your full potential with guided workouts, mindfulness practices, and wellness routines.', 'ob/onboard2.jpg', 'dumbbell'], ['Find Your Balance', 'Take small steps every day toward a healthier, happier you.', 'ob/onboard3.jpg', 'leaf']];
  S.onboarding = function () {
    var i = Math.min(store.get('slide', 0), 2), s = SLIDES[i];
    return auth(s[2], ['', 'move', 'eat'][i], s[3], '<div style="display:flex;justify-content:space-between;align-items:center"><span class="logo" style="padding:0"><span class="brand-mark"></span><span>LifeFit</span></span>' + (i < 2 ? '<button class="link-btn" data-action="slide-skip">Skip</button>' : '') + '</div>' +
      '<h1>' + s[0] + '</h1><p class="muted" style="margin:0">' + s[1] + '</p><div class="dots" aria-label="Slide ' + (i + 1) + ' of 3">' + [0, 1, 2].map(function (n) { return '<i class="' + (n === i ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<div style="display:grid;gap:10px">' + (i < 2 ? '<button class="btn btn-primary btn-block" data-action="slide-next">Next</button>' : '<a class="btn btn-primary btn-block" href="#/onb-country">Start Your Journey</a>') + '<a class="btn btn-ghost btn-block" href="#/login">I already have an account</a></div>' + fixbar(['LF-298']));
  };
  S['onb-country'] = function () {
    var c = store.get('country', COUNTRIES[0]), name = store.get('onb', {}).name || '';
    return auth('ob/onboard1.jpg', '', 'user', '<div class="stepper"><button class="icon-btn" data-action="back" aria-label="Back">' + ic('back') + '</button><div class="bar"><i style="width:8.3%"></i></div><span class="tiny">Step 1 of 12</span></div>' +
      '<h1>Let\'s get to know you</h1><p class="muted" style="margin:0 0 20px">Your country sets the language, units and timezone (MMT, UTC+6:30 for Myanmar).</p>' +
      '<div class="field"><label for="fn">First name</label><input class="input" id="fn" placeholder="Your first name" value="' + esc(name) + '"><span class="err" id="fnErr" hidden>Please enter your first name</span></div>' +
      '<div class="field"><label>Country</label><button class="input" style="display:flex;align-items:center;gap:10px;text-align:left" data-action="pick-country"><span class="flag">' + c.flag + '</span><span style="flex:1">' + c.name + '</span>' + ic('chev') + '</button></div>' +
      '<button class="btn btn-primary btn-block" data-action="onb-next">Continue</button><p class="tiny">Steps 2–10 (goal, focus, body type, gender, age, height, weight, goal weight, activity) stay as in production.</p>' + fixbar(['LF-302']));
  };
  S['onb-summary'] = function () {
    var o = Object.assign({ h: 160, w: 100, goal: 90, act: 'Very active', focus: 'Core' }, store.get('onb', {}));
    var v = o.w / Math.pow(o.h / 100, 2), cat = v < 18.5 ? 'Underweight' : v < 25 ? 'Healthy' : v < 30 ? 'Overweight' : 'Obese', diff = Math.round((o.w - o.goal) * 10) / 10;
    var pr = [diff > 0 ? 'Steady fat loss: ' + diff + ' kg to lose at ~0.5 kg/week' : diff < 0 ? 'Lean muscle gain: ' + Math.abs(diff) + ' kg to gain' : 'Maintain your current weight', o.act === 'Very active' ? 'Keep your high activity level with 5 sessions a week' : 'Build a habit: 3 short sessions a week', 'Focus area: ' + o.focus + ' strength and stability'];
    return auth('ob/onboard2.jpg', 'move', 'target', '<div class="stepper"><button class="icon-btn" data-action="back" aria-label="Back">' + ic('back') + '</button><div class="bar"><i style="width:91.6%"></i></div><span class="tiny">Step 11 of 12</span></div>' +
      '<h1>Your fitness profile</h1><p class="muted" style="margin:0 0 14px">Based on your answers. Change a value to see it update.</p>' +
      '<div class="grid-2f">' + ['h:Height (cm):120:220', 'w:Weight (kg):30:200', 'goal:Goal weight (kg):30:200'].map(function (f) { var p = f.split(':'); return '<div class="field"><label>' + p[1] + '</label><input class="input" type="number" step="0.1" min="' + p[2] + '" max="' + p[3] + '" data-onb="' + p[0] + '" value="' + o[p[0]] + '"></div>'; }).join('') +
      '<div class="field"><label>Activity</label><select class="input" data-onb="act">' + ['Sedentary', 'Lightly active', 'Active', 'Very active'].map(function (a) { return '<option ' + (a === o.act ? 'selected' : '') + '>' + a + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="card"><div class="tiny">Calculated BMI</div><div style="display:flex;align-items:baseline;gap:8px"><strong style="font-size:34px">' + v.toFixed(1) + '</strong><span class="tag ' + (cat === 'Healthy' ? 'tag-beg' : 'tag-adv') + '">' + cat + '</span></div><div class="bmi-scale"><i></i><i></i><i></i><i></i></div><div class="bmi-pin"><b style="left:' + Math.min(100, v / 40 * 100) + '%"></b></div></div>' +
      '<h2 style="font-size:17px;margin:18px 0 8px">Your Priorities</h2><div class="menu">' + pr.map(function (p, n) { return '<div class="menu-row"><span class="mi">' + ic(['target', 'flame', 'dumbbell'][n]) + '</span><span class="mt"><strong>' + esc(p) + '</strong></span></div>'; }).join('') + '</div>' +
      '<button class="btn btn-primary btn-block" data-action="onb-save" style="margin-top:18px">Save &amp; continue</button>' + fixbar(['LF-277', 'LF-279']));
  };

  // ---------- nav ----------
  var NAV = [['', [['home', 'home', 'Home'], ['explore', 'compass', 'Explore']]], ['Programs', [['fitness', 'dumbbell', 'Fitness'], ['yoga', 'lotus', 'Yoga'], ['mind', 'moon', 'Meditation'], ['cooking', 'bowl', 'Health Cooking'], ['healthy', 'leaf', 'Healthy Living'], ['mind-games', 'puzzle', 'Mind Games'], ['motivation', 'trophy', 'Motivation'], ['bmi', 'scale', 'BMI Calculator'], ['coach', 'video', 'Coach Session']]], ['Account', [['notifications', 'bell', 'Notifications'], ['profile', 'user', 'Profile']]]];
  var TABS = [['home', 'home', 'home'], ['explore', 'compass', 'explore'], ['fitness', 'dumbbell', 'fitness'], ['mind', 'moon', 'mind'], ['profile', 'user', 'profile']];
  var PARENT = { exercise: 'fitness', session: 'fitness', recipe: 'cooking', article: 'healthy', magazine: 'healthy', player: 'mind', game: 'mind-games', 'game-play': 'mind-games', story: 'motivation', 'coach-chat': 'coach', 'edit-profile': 'profile', privacy: 'profile', devices: 'profile', legal: 'profile', 'legal-doc': 'profile', support: 'profile', 'support-chat': 'profile', contact: 'profile' };
  var TAB_PARENT = { yoga: 'explore', cooking: 'explore', healthy: 'explore', 'mind-games': 'explore', motivation: 'explore', bmi: 'explore', coach: 'explore', notifications: 'home' };
  var FULL = ['login', 'otp', 'onboarding', 'onb-country', 'onb-summary'];
  var NO_TAB = FULL.concat(['session', 'coach-chat', 'support-chat', 'game-play']);
  function renderNav(name) {
    var top = PARENT[name] || name;
    document.getElementById('sideNav').innerHTML = NAV.map(function (g) { return (g[0] ? '<div class="grp">' + g[0] + '</div>' : '') + g[1].map(function (n) { return '<a href="#/' + n[0] + '" class="' + (n[0] === top ? 'is-active' : '') + '" title="' + n[2] + '">' + ic(n[1]) + '<span>' + (n[0] === 'home' ? t('home') : n[0] === 'explore' ? t('explore') : n[0] === 'fitness' ? t('fitness') : n[0] === 'profile' ? t('profile') : n[2]) + '</span></a>'; }).join(''); }).join('');
    var tab = TAB_PARENT[top] || top;
    document.getElementById('tabbar').innerHTML = TABS.map(function (n) { return '<a href="#/' + n[0] + '" class="' + (n[0] === tab ? 'is-active' : '') + '">' + ic(n[1]) + '<span>' + t(n[2]) + '</span></a>'; }).join('');
  }

  // ---------- router ----------
  var hist = [];
  function render() {
    var h = location.hash.replace(/^#\/?/, '') || 'home', parts = h.split('/'), name = parts[0], arg = parts.slice(1).join('/');
    if (!S[name]) name = 'home';
    if (name !== 'session' && sessionTimer) { clearInterval(sessionTimer); sessionTimer = null; }
    $screen.className = 'screen' + (FULL.indexOf(name) > -1 ? ' full' : '');
    $screen.innerHTML = S[name](arg);
    document.body.classList.toggle('no-tab', NO_TAB.indexOf(name) > -1);
    document.getElementById('shell').classList.toggle('is-auth', FULL.indexOf(name) > -1);
    document.querySelector('.sidebar').style.display = FULL.indexOf(name) > -1 ? 'none' : '';
    document.getElementById('shell').style.gridTemplateColumns = FULL.indexOf(name) > -1 ? '1fr' : '';
    renderNav(name); markIndex(name); closeSheet();
    document.documentElement.lang = lang();
    window.scrollTo(0, 0);
    if (hist[hist.length - 1] !== h) hist.push(h);
    var chat = document.getElementById('chat'); if (chat) chat.scrollTop = chat.scrollHeight;
  }
  function back() {
    var cur = location.hash.replace(/^#\/?/, '');
    if (cur === 'edit-profile' && dirty()) return discardDialog('#/profile');
    if (cur === 'session' && store.get('session', { set: 1 }).set <= DATA.exercise.sets) return sheet('<h3>Leave workout?</h3><p>Your progress (set ' + store.get('session', { set: 1 }).set + ' of ' + DATA.exercise.sets + ') is kept. You can continue later.</p><button class="btn btn-primary btn-block" data-action="close-sheet">Keep going</button><button class="btn btn-ghost btn-block" data-go="#/exercise">Leave</button>', 'dialog');
    hist.pop(); var prev = hist.pop(); go(prev ? '#/' + prev : '#/' + (PARENT[cur.split('/')[0]] || 'home'));
  }
  function dirty() { var f = document.getElementById('editForm'); if (!f || !editSnapshot) return false; var s = JSON.parse(editSnapshot); return ['name', 'bio', 'email', 'dob', 'gender', 'h', 'w'].some(function (k) { return String(f[k].value) !== String(s[k] == null ? '' : s[k]); }); }
  function discardDialog(to) { sheet('<h3>Discard changes?</h3><p>You have unsaved changes to your profile.</p><button class="btn btn-primary btn-block" data-action="save-profile">Save changes</button><button class="btn btn-ghost btn-block" data-action="discard" data-to="' + to + '" style="color:var(--danger)">Discard</button><button class="btn btn-block" style="background:none" data-action="close-sheet">' + t('cancel') + '</button>', 'dialog'); }

  function sheet(html, cls) { $sheet.innerHTML = '<div class="scrim" data-action="close-sheet"></div><div class="sheet ' + (cls || '') + '" role="dialog" aria-modal="true">' + html + '</div>'; var f = $sheet.querySelector('.sheet button, .sheet a, .sheet input'); if (f) f.focus(); }
  function closeSheet() { $sheet.innerHTML = ''; }
  function bugSheet(id) {
    var b = window.LF_BUGS.filter(function (x) { return x.id === id; })[0];
    if (!b) { if (id === 'LF-304') b = { id: id, owner: 'Portal', area: 'Home', sev: 'Minor', title: 'Guest greeting showed dummy “Alex” (already fixed)', fix: 'Greeting uses the user\'s name; guests see “Friend”.' }; else if (id === 'LF-350') b = { id: id, owner: 'Portal', area: 'Profile', sev: 'Trivial', title: 'Stock avatar for every user (already fixed)', fix: 'Initials avatar on primary-soft.' }; else return; }
    sheet('<div class="bugsheet"><strong style="color:var(--primary)">' + b.id + '</strong> <span class="owner owner-' + b.owner + '">' + ({ CMS: 'CMS', Portal: 'Portal', Both: 'CMS + Portal' })[b.owner] + '</span><h3 style="margin-top:6px">' + esc(b.title) + '</h3><dl><dt>Area</dt><dd>' + b.area + '</dd><dt>Severity</dt><dd>' + b.sev + '</dd><dt>Design fix</dt><dd>' + esc(b.fix) + '</dd>' + (b.cms ? '<dt>CMS</dt><dd>CMS design › ' + b.cms + '</dd>' : '') + '</dl><button class="btn btn-ghost btn-block" style="margin-top:16px" data-action="close-sheet">Close</button></div>');
  }

  // ---------- bug index ----------
  var $list = document.getElementById('bugList'), ownerFilter = 'all';
  function renderIndex() {
    $list.innerHTML = window.LF_BUGS.filter(function (b) { return ownerFilter === 'all' || b.owner === ownerFilter; }).map(function (b) { return '<li><a class="bug-item" href="#/' + b.portal + '" data-portal="' + b.portal + '"><span class="bid">' + b.id + '</span><span class="btitle">' + esc(b.title) + '</span><span><span class="owner owner-' + b.owner + '">' + (b.owner === 'Both' ? 'CMS+Portal' : b.owner) + '</span></span></a></li>'; }).join('');
    document.getElementById('bugCount').textContent = window.LF_BUGS.length;
  }
  function markIndex(name) { Array.prototype.forEach.call($list.querySelectorAll('.bug-item'), function (a) { a.classList.toggle('is-current', a.getAttribute('data-portal').split('/')[0] === name); }); }
  function setNotes(on) { document.body.classList.toggle('notes-on', on); document.getElementById('notesSwitch').setAttribute('aria-checked', on); store.set('notes', on); }

  // ---------- events ----------
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action],[data-go],[data-filter],[data-bug],[data-persona],[data-owner],[data-toggle],[data-pref],.bug-item');
    if (!el) return;
    if (el.classList.contains('bug-item')) { document.getElementById('bugIndex').classList.remove('is-open'); return; }
    if (el.hasAttribute('data-owner')) { ownerFilter = el.getAttribute('data-owner'); Array.prototype.forEach.call(document.querySelectorAll('[data-owner]'), function (c) { c.classList.toggle('is-active', c === el); }); renderIndex(); return; }
    if (el.hasAttribute('data-go')) { e.preventDefault(); go(el.getAttribute('data-go')); return; }
    if (el.hasAttribute('data-bug')) { bugSheet(el.getAttribute('data-bug')); return; }
    if (el.hasAttribute('data-persona')) { store.set('persona', el.getAttribute('data-persona')); rerender(); return; }
    if (el.hasAttribute('data-filter')) { var map = { meal: 'cook', level: 'yoga', style: 'yoga', cat: 'mind', gender: 'fit', goal: 'fit', hl: 'hl', skill: 'games' }, fn = el.getAttribute('data-filter'); setFilter(map[fn], fn, el.getAttribute('data-value')); rerender(); return; }
    if (el.hasAttribute('data-toggle')) { var k = el.getAttribute('data-toggle'), s = Object.assign({ otp: true, priv: false, coach: true, reco: true }, store.get('privacy', {})); s[k] = el.getAttribute('aria-checked') !== 'true'; store.set('privacy', s); el.setAttribute('aria-checked', s[k]); var hint = $screen.querySelector('[data-saved="' + k + '"]'); if (hint) { hint.hidden = false; setTimeout(function () { hint.hidden = true; }, 1600); } return; }
    if (el.hasAttribute('data-pref')) { var pk = el.getAttribute('data-pref'), pr = store.get('notifPrefs', {}); pr[pk] = el.getAttribute('aria-checked') !== 'true'; store.set('notifPrefs', pr); el.setAttribute('aria-checked', pr[pk]); return; }
    var a = el.getAttribute('data-action');
    switch (a) {
      case 'back': back(); break;
      case 'open-index': document.getElementById('bugIndex').classList.add('is-open'); break;
      case 'close-index': document.getElementById('bugIndex').classList.remove('is-open'); break;
      case 'toggle-notes': setNotes(!document.body.classList.contains('notes-on')); break;
      case 'close-sheet': closeSheet(); break;
      case 'toast': toast(el.getAttribute('data-msg')); break;
      case 'share': toast('Link copied'); break;
      case 'clear': store.set('f:' + el.getAttribute('data-k'), {}); rerender(); break;
      case 'pick-country': var cur = store.get('country', COUNTRIES[0]); sheet('<h3>Select your country</h3><p class="small muted" style="margin:0 0 12px">Countries come from CMS › Onboarding.</p><div class="countries">' + COUNTRIES.map(function (c, n) { return '<button class="country ' + (c.name === cur.name ? 'is-active' : '') + '" data-action="set-country" data-i="' + n + '"><span class="flag">' + c.flag + '</span><span style="flex:1;font-weight:600">' + c.name + '</span><span class="muted">' + c.code + '</span></button>'; }).join('') + '</div><button class="btn btn-ghost btn-block" style="margin-top:12px" data-action="close-sheet">' + t('cancel') + '</button>'); break;
      case 'set-country': store.set('country', COUNTRIES[+el.getAttribute('data-i')]); render(); break;
      case 'login': go('#/onboarding'); toast('New number → Onboarding'); break;
      case 'slide-next': store.set('slide', store.get('slide', 0) + 1); render(); break;
      case 'slide-skip': store.set('slide', 2); render(); break;
      case 'onb-next': var fnI = document.getElementById('fn'); if (!fnI.value.trim()) { document.getElementById('fnErr').hidden = false; fnI.focus(); break; } var o = store.get('onb', {}); o.name = fnI.value.trim(); store.set('onb', o); go('#/onb-summary'); break;
      case 'onb-save': var ob = Object.assign({ h: 160, w: 100 }, store.get('onb', {})), pf = store.get('profile', {}); if (ob.name && !pf.name) pf.name = ob.name; pf.h = ob.h; pf.w = ob.w; store.set('profile', pf); store.set('slide', 0); go('#/home'); setTimeout(function () { toast('Profile saved · ' + ob.h + ' cm, ' + ob.w + ' kg'); }, 60); break;
      case 'save-recipe': var id = +el.getAttribute('data-id'), sv = store.get('savedRecipes', []), i = sv.indexOf(id); if (i > -1) sv.splice(i, 1); else sv.push(id); store.set('savedRecipes', sv); rerender(); toast(i > -1 ? 'Removed from saved' : 'Recipe saved'); break;
      case 'save-article': var aid = +el.getAttribute('data-id'), sa = store.get('savedArticles', []), ai = sa.indexOf(aid); if (ai > -1) sa.splice(ai, 1); else sa.push(aid); store.set('savedArticles', sa); rerender(); toast(ai > -1 ? 'Removed from saved' : 'Article saved'); break;
      case 'save-ex': store.set('savedEx', !store.get('savedEx', false)); rerender(); break;
      case 'challenge': var ch = store.get('challenges', {}), cid = el.getAttribute('data-id'); ch[cid] = !ch[cid]; store.set('challenges', ch); rerender(); if (ch[cid]) toast('Challenge completed!'); break;
      case 'complete-set': var ss = store.get('session', { set: 1, rest: false }); ss.rest = true; store.set('session', ss); render(); startRest(); break;
      case 'skip-rest': var s2 = store.get('session', { set: 1, rest: true }); s2.rest = false; s2.set++; store.set('session', s2); render(); break;
      case 'end-session': store.set('session', { set: 1, rest: false }); break;
      case 'reschedule': sheet('<h3>Reschedule session</h3><p class="small muted" style="margin:0">Pick a new time with Marcus. Slots come from the coach\'s schedule in CMS.</p><div class="days">' + [['Wed', 28], ['Thu', 29], ['Fri', 30], ['Sat', 31], ['Mon', 2]].map(function (d, n) { return '<button class="day ' + (n === 0 ? 'is-active' : '') + '" data-action="pick">' + d[0] + '<strong>' + d[1] + '</strong></button>'; }).join('') + '</div><div class="slots">' + ['07:00', '09:30', '11:00', '14:00', '16:00', '18:30'].map(function (s, n) { return '<button class="slot ' + (n === 4 ? 'is-active' : '') + '" ' + (n === 1 ? 'disabled' : '') + ' data-action="pick">' + s + '</button>'; }).join('') + '</div><p class="tiny">Times in MMT (UTC+6:30). Free reschedule up to 2 hours before.</p><button class="btn btn-primary btn-block" data-action="confirm-resched">Confirm</button>'); break;
      case 'pick': Array.prototype.forEach.call(el.parentNode.children, function (c) { c.classList.remove('is-active'); }); el.classList.add('is-active'); break;
      case 'confirm-resched': var d = $sheet.querySelector('.day.is-active'), sl = $sheet.querySelector('.slot.is-active'); closeSheet(); toast('Moved to ' + d.textContent.replace(/(\D+)(\d+)/, '$1 $2') + ', ' + (sl ? sl.textContent : '') + '. Marcus has been notified.'); break;
      case 'mark-all': store.set('allRead', true); rerender(); toast('All notifications marked as read'); break;
      case 'revoke': var rv = store.get('revoked', []); rv.push(el.getAttribute('data-id')); store.set('revoked', rv); render(); toast('Signed out of that device'); break;
      case 'revoke-all': store.set('revoked', ['d1']); render(); toast('Signed out of all other devices'); break;
      case 'data-req': var st = store.get('dataReq', 'none'); if (st === 'none') sheet('<h3>Download my data</h3><p class="small muted">We\'ll prepare a file with your profile, activity and saved items. A download link is sent by SMS within 48 hours and stays valid for 7 days.</p><button class="btn btn-primary btn-block" data-action="data-confirm">Request my data</button><button class="btn btn-ghost btn-block" data-action="close-sheet">' + t('cancel') + '</button>'); else if (st === 'processing') { store.set('dataReq', 'ready'); render(); toast('Demo: marked ready in CMS'); } else toast('Downloading lifefit-data.zip'); break;
      case 'data-confirm': store.set('dataReq', 'processing'); render(); toast('Request sent. We\'ll SMS you a link.'); break;
      case 'delete-acc': sheet('<h3>Delete account?</h3><p>This removes your profile, activity and saved items. This can\'t be undone.</p><button class="btn btn-danger btn-block" data-action="close-sheet">Delete my account</button><button class="btn btn-ghost btn-block" data-action="close-sheet">' + t('cancel') + '</button>', 'dialog'); break;
      case 'lang': sheet('<h3>Choose your language</h3><div class="countries" style="margin-top:12px">' + [['en', 'English'], ['my', 'မြန်မာ (Burmese)'], ['id', 'Bahasa Indonesia']].map(function (l) { return '<button class="country ' + (l[0] === lang() ? 'is-active' : '') + '" data-action="set-lang" data-l="' + l[0] + '"><span style="flex:1;font-weight:600">' + l[1] + '</span></button>'; }).join('') + '</div><p class="tiny">Labels come from CMS › Translations. Content without a translation falls back to English.</p>'); break;
      case 'set-lang': store.set('lang', el.getAttribute('data-l')); render(); break;
      case 'theme': var dark = el.getAttribute('aria-checked') !== 'true'; document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); store.set('theme', dark ? 'dark' : 'light'); el.setAttribute('aria-checked', dark); break;
      case 'logout': go('#/login'); break;
      case 'save-profile': var f = document.getElementById('editForm'); if (f) saveProfile(f); closeSheet(); go('#/profile'); break;
      case 'discard': editSnapshot = null; closeSheet(); go(el.getAttribute('data-to')); break;
      case 'faq-tab': store.set('faqTab', el.getAttribute('data-t')); rerender(); break;
      case 'bmi-g': var bb = store.get('bmi', { g: 'Male', h: 170, w: 68, a: 28 }); bb.g = el.getAttribute('data-g'); store.set('bmi', bb); rerender(); break;
      case 'reset': store.reset(); setNotes(true); render(); toast('Demo data reset'); break;
    }
  });
  function rerender() { var y = window.scrollY; render(); window.scrollTo(0, y); }
  function saveProfile(f) { var p = store.get('profile', {}); ['name', 'bio', 'email', 'dob', 'gender'].forEach(function (k) { p[k] = f[k].value; }); p.h = +f.h.value; p.w = +f.w.value; store.set('profile', p); editSnapshot = JSON.stringify(profile()); }

  document.addEventListener('submit', function (e) {
    var f = e.target; e.preventDefault();
    if (f.id === 'editForm') { saveProfile(f); toast('Profile updated.'); return; }
    if (f.id === 'bmiForm') { var h = parseFloat(f.h.value), w = parseFloat(f.w.value); if (!(h >= 100 && h <= 250 && w >= 20 && w <= 300)) { document.getElementById('bmiErr').hidden = false; return; } var b = store.get('bmi', { g: 'Male' }); b.h = h; b.w = w; b.a = +f.a.value; store.set('bmi', b); rerender(); return; }
    if (f.getAttribute('data-form') === 'contact') { toast('Message sent. We reply within 24 hours.'); go('#/support'); return; }
    if (f.hasAttribute('data-chat')) {
      var k = f.getAttribute('data-chat'), inp = f.querySelector('input'), v = inp.value.trim(); if (!v) return;
      var now = new Date(), tm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'), arr = store.get('chat:' + k, []); arr.push(['me', v, tm]); store.set('chat:' + k, arr); render();
      setTimeout(function () { var a2 = store.get('chat:' + k, []); a2.push(['them', k === 'coach' ? 'Got it! See you at 16:00.' : 'Thanks! An agent is looking into this now.', tm]); store.set('chat:' + k, a2); if (location.hash.indexOf(k + '-chat') > -1) render(); }, 900);
    }
  });
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (el.hasAttribute('data-digits')) { el.value = el.value.replace(/\D/g, '').slice(0, 11); var ok = el.value.length >= 7; document.getElementById('loginBtn').disabled = !ok; document.getElementById('phoneErr').hidden = ok || !el.value.length; }
    if (el.id === 'fn' && el.value.trim()) document.getElementById('fnErr').hidden = true;
    if (el.hasAttribute('data-search')) { store.set(el.getAttribute('data-search'), el.value); var pos = el.selectionStart; render(); var n = $screen.querySelector('[data-search]'); n.focus(); n.setSelectionRange(pos, pos); }
  });
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.getAttribute('data-action-input') === 'rem') { store.set('remTime', el.value); rerender(); toast('Reminder set for ' + el.value); }
    if (el.hasAttribute('data-onb')) { var k = el.getAttribute('data-onb'), o = store.get('onb', {}), v = el.value; if (k !== 'act') { v = parseFloat(v); if (isNaN(v) || v < +el.min || v > +el.max) { toast('Enter a value between ' + el.min + ' and ' + el.max); return; } } o[k] = v; store.set('onb', o); rerender(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeSheet(); document.getElementById('bugIndex').classList.remove('is-open'); } });

  function startRest() {
    var left = DATA.exercise.rest; if (sessionTimer) clearInterval(sessionTimer);
    sessionTimer = setInterval(function () { left--; var el = document.getElementById('timer'); if (!el) { clearInterval(sessionTimer); sessionTimer = null; return; } el.textContent = '00:' + String(Math.max(0, left)).padStart(2, '0'); if (left <= 0) { clearInterval(sessionTimer); sessionTimer = null; var s = store.get('session', { set: 1 }); s.rest = false; s.set++; store.set('session', s); render(); } }, 1000);
  }

  // ---------- boot ----------
  var th = store.get('theme', null); if (th) document.documentElement.setAttribute('data-theme', th);
  setNotes(store.get('notes', true));
  renderIndex();
  window.addEventListener('hashchange', render);
  if (!location.hash) location.hash = '#/home'; else render();
})();
