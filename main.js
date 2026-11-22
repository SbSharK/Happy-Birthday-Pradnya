const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// ==========================================
// 1. TYPEWRITER EFFECT
// ==========================================
(function() {
  const el = $('#typewriter');
  if (!el) return;
  const messages = [
    'Happy Birthday Pradnya! ❤️',
    'To My Forever 23 (pan 30 chi) Girl! 😂🎂',
    'You Make Every Day Magical ✨',
    'Happy Birthday to My Whole World 💕',
    'Smile Bright Today, My Love! 🌸'
  ];
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let msgIdx = 0;

  (async function loop() {
    await sleep(1000);
    for (;;) {
      const text = messages[msgIdx % messages.length];
      for (let i = 1; i <= text.length; i++) {
        el.textContent = text.slice(0, i);
        await sleep(90 + Math.random() * 30);
      }
      await sleep(2200);
      for (let i = text.length; i >= 0; i--) {
        el.textContent = text.slice(0, i);
        await sleep(40);
      }
      await sleep(400);
      msgIdx++;
    }
  })();
})();

// ==========================================
// 2. SCROLL REVEAL OBSERVER
// ==========================================
(function() {
  const els = $$('[data-r]');
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(e => io.observe(e));
})();

// ==========================================
// 3. 3D PERSPECTIVE TILT
// ==========================================
(function() {
  const root = document.documentElement;
  const tilts = [...$$('.tilt')];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  addEventListener('pointermove', e => {
    root.style.setProperty('--mx', clamp(e.clientX / innerWidth - 0.5, -0.5, 0.5).toFixed(3));
    root.style.setProperty('--my', clamp(e.clientY / innerHeight - 0.5, -0.5, 0.5).toFixed(3));
    for (const t of tilts) {
      const r = t.getBoundingClientRect();
      if (e.clientY < r.top - 80 || e.clientY > r.bottom + 80 || e.clientX < r.left - 80 || e.clientX > r.right + 80) {
        t.style.transform = '';
        continue;
      }
      const px = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5);
      const py = clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5);
      t.style.transform = `perspective(900px) rotateY(${(px * 14).toFixed(1)}deg) rotateX(${(-py * 14).toFixed(1)}deg)`;
    }
  }, { passive: true });

  addEventListener('pointerleave', () => tilts.forEach(t => t.style.transform = ''));
  document.addEventListener('pointerup', e => {
    if (e.pointerType === 'touch') tilts.forEach(t => t.style.transform = '');
  });
})();

// ==========================================
// 4. AUDIO SYSTEM & INTRO HOOK
// ==========================================
const AudioController = (function() {
  const audio = $('#bgMusic');
  const hook = $('#introHook');
  const startBtn = $('#startSurpriseBtn');
  const bar = $('#musicBar');
  const disc = $('#musicDisc');
  const toggleBtn = $('#musicToggleBtn');

  let isPlaying = false;
  let synthActive = false;
  let synthAudioCtx = null;
  let synthTimer = null;

  // Web Audio API romantic music box synth fallback if mp3 is missing
  function startMusicBoxSynth() {
    if (synthActive) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      synthAudioCtx = new AudioCtx();
      synthActive = true;

      // Notes of a dreamy romantic Happy Birthday melody (in frequencies Hz)
      const melody = [
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 1.4 },
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 349.23, d: 1.4 },
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 523.25, d: 0.8 }, { f: 440.00, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 0.8 }, { f: 293.66, d: 1.2 },
        { f: 466.16, d: 0.4 }, { f: 466.16, d: 0.4 }, { f: 440.00, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 349.23, d: 1.6 }
      ];

      let noteIdx = 0;
      function playNextNote() {
        if (!synthActive || !synthAudioCtx) return;
        const note = melody[noteIdx % melody.length];
        const osc = synthAudioCtx.createOscillator();
        const gain = synthAudioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, synthAudioCtx.currentTime);

        // Music box bell chime envelope
        gain.gain.setValueAtTime(0.001, synthAudioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.18, synthAudioCtx.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, synthAudioCtx.currentTime + note.d);

        osc.connect(gain);
        gain.connect(synthAudioCtx.destination);

        osc.start();
        osc.stop(synthAudioCtx.currentTime + note.d + 0.1);

        noteIdx++;
        synthTimer = setTimeout(playNextNote, (note.d + 0.15) * 1000);
      }
      playNextNote();
    } catch (err) {
      console.warn('Web Audio Synth unavailable:', err);
    }
  }

  function stopMusicBoxSynth() {
    synthActive = false;
    if (synthTimer) clearTimeout(synthTimer);
    if (synthAudioCtx) {
      synthAudioCtx.close().catch(() => {});
      synthAudioCtx = null;
    }
  }

  function play() {
    if (!audio) return;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          updateUI(true);
        })
        .catch(() => {
          // If mp3 file is not found or blocked, fall back to music box synth
          console.log('Audio file not found or blocked, activating music box synth...');
          startMusicBoxSynth();
          isPlaying = true;
          updateUI(true);
        });
    }
  }

  function pause() {
    if (audio) audio.pause();
    stopMusicBoxSynth();
    isPlaying = false;
    updateUI(false);
  }

  function toggle() {
    if (isPlaying) pause();
    else play();
  }

  function updateUI(playing) {
    if (disc) {
      if (playing) disc.classList.add('spinning');
      else disc.classList.remove('spinning');
    }
    if (toggleBtn) {
      toggleBtn.textContent = playing ? '⏸' : '▶';
    }
  }

  // Hook button click
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      play();
      if (hook) hook.classList.add('hidden');
      if (typeof confetti === 'function') {
        const cols = ['#ffd27a', '#ff7eb6', '#7fe7ff', '#ffffff', '#e83e8c'];
        confetti({ particleCount: 160, spread: 100, origin: { y: 0.3 }, colors: cols });
        setTimeout(() => {
          confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: cols });
          confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: cols });
        }, 300);
      }
    });
  }

  if (bar) {
    bar.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });
  }

  return { play, pause, toggle, isPlaying: () => isPlaying };
})();

// ==========================================
// 5. HERO IMAGE FALLBACK
// ==========================================
(function() {
  const heroImg = $('#heroImg');
  if (!heroImg) return;
  heroImg.addEventListener('error', function() {
    // If assets/hero.jpg is missing, pick the first photo from PHOTOS_DATA
    if (window.PHOTOS_DATA && window.PHOTOS_DATA.photos && window.PHOTOS_DATA.photos.length > 0) {
      // Find a good photo from the list
      const candidate = window.PHOTOS_DATA.photos.find(p => p.includes('PORTRAIT') || p.includes('IMG')) || window.PHOTOS_DATA.photos[0];
      if (candidate && heroImg.src !== candidate) {
        heroImg.src = candidate;
        return;
      }
    }
    heroImg.src = 'assets/hero-placeholder.svg';
  });
})();

// ==========================================
// 6. MEME AGE REALITY CHECKER (MARATHI)
// ==========================================
(function() {
  const btns = $$('.calc-btn');
  const output = $('#calcOutput');
  if (!btns.length || !output) return;

  const responses = {
    '23': `🚨 <strong>Error 404: 23 Not Found!</strong><br>Madam, 1998 te 2026 madhe 23 varsha kase hotat? Koni shikovla he maths? 😂 Still, your wish is granted... In your dreams you are forever 23! 🦄💅`,
    '30': `👵 <strong>Reality Check Passed! ✅</strong><br>Born 1998 = Officially 30 chya club madhe entry! Senior citizen discount unlocked! Aaji, sandhi-vaat cha ras aana lagel ata! Happy 30th Birthday! 😜🎂`,
    'love': `❤️ <strong>Chetan's Secret Truth:</strong><br>Varsha kitihi vadhu de — 23 aso ki 30 — mazya sathi tu kayam ti ch saglyat cute, sundar ani mazi favourite pagal Pradnya rahnar ahes! I love you so much! 🥰🌹`
  };

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      output.innerHTML = responses[mode] || '';
      output.classList.remove('highlight');
      void output.offsetWidth;
      output.classList.add('highlight');

      if (mode === 'love' && typeof confetti === 'function') {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.65 }, colors: ['#ff7eb6', '#ffd27a', '#ff4d88'] });
      }
    });
  });
})();

// ==========================================
// 7. CAKE CUTTING & WISHES
// ==========================================
(function() {
  const cols = ['#ffd27a', '#ff7eb6', '#7fe7ff', '#ffffff', '#e83e8c'];
  const boom = () => {
    if (typeof confetti === 'function') confetti({ particleCount: 120, spread: 100, origin: { y: 0.2 }, colors: cols });
  };
  if (document.readyState === 'complete') setTimeout(boom, 800);
  else addEventListener('load', () => setTimeout(boom, 800));

  const msg = $('#wishMsg');
  const lines = [
    '✨ Wish locked in the stars! Chetan will make sure it comes true ❤️',
    '🎂 Candles blown! May our love grow stronger with every passing year 💕',
    '🌟 Close your eyes, think of the sweetest dream, and smile bright!',
    '😜 Wish granted! (Condition: Madam has to accept she is not 23!)',
    '💖 May this year shower you with 1000x happiness, success, and love!'
  ];
  let k = 0;

  const wishBtn = $('#wishBtn');
  if (wishBtn) {
    wishBtn.addEventListener('click', () => {
      if (msg) {
        msg.textContent = lines[k++ % lines.length];
        msg.classList.remove('pop');
        void msg.offsetWidth;
        msg.classList.add('pop');
      }
      if (typeof confetti === 'function') {
        [0, 1].forEach(s => confetti({ particleCount: 90, angle: s ? 120 : 60, spread: 65, origin: { x: s, y: 0.75 }, colors: cols }));
      }
      const box = $('#lanterns');
      if (box) {
        for (let i = 0; i < 9; i++) {
          const l = document.createElement('span');
          l.className = 'lantern';
          l.style.left = (6 + Math.random() * 88) + '%';
          l.style.setProperty('--t', (5 + Math.random() * 4) + 's');
          l.style.setProperty('--x', ((Math.random() - 0.5) * 120) + 'px');
          l.style.animationDelay = (Math.random() * 1.2) + 's';
          box.appendChild(l);
          l.addEventListener('animationend', () => l.remove());
        }
      }
    });
  }
})();

// ==========================================
// 8. DYNAMIC 62 PHOTOS GALLERY & AUTO-SHUFFLE
// ==========================================
(function() {
  const stack = $('#stack');
  const count = $('#count');
  const prevBtn = $('#prevImg');
  const nextBtn = $('#nextImg');
  const shuffleBtn = $('#shuffleBtn');
  const autoPlayBtn = $('#autoPlayBtn');
  const autoPlayText = $('#autoPlayText');
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  const lightboxCap = $('#lightboxCap');
  const lightboxClose = $('#lightboxClose');

  if (!stack) return;

  const captions = [
    'My favourite smile in the universe ✨',
    'That unforgettable laugh ❤️',
    'Looking 23 (with bonus experience 😜)',
    'Every second with you is magic 💖',
    'Cutest person on planet earth 🥰',
    'Our crazy little moments together 📸',
    'You make my heart beat faster 💓',
    'The girl who makes my world colorful 🌸',
    'My partner in crime & life 💫',
    'Forever grateful for this moment 🌹',
    'Sweetest soul, biggest drama queen 👑',
    'Pure joy in a single frame 🌟',
    'Look at that sparkle in your eyes ✨',
    'Chetan\'s favourite view in the world ❤️',
    'Forever & always with you 💕',
    'Madam in her natural cute habitat 💅',
    'A memory I will cherish forever 🤍',
    'Happy Birthday to my dream girl 🎂'
  ];

  let photoList = [];
  let isAutoPlay = true;
  let timer = null;
  let currentIdx = 0;

  // Retrieve photo list from window.PHOTOS_DATA or fallback
  if (window.PHOTOS_DATA && Array.isArray(window.PHOTOS_DATA.photos) && window.PHOTOS_DATA.photos.length > 0) {
    photoList = [...window.PHOTOS_DATA.photos];
  } else {
    // Default 62 items
    photoList = Array.from({ length: 62 }, (_, i) => `assets/${i + 1}.jpg`);
  }

  let n = photoList.length;

  function renderStack() {
    if (!stack || n === 0) return;
    stack.innerHTML = '';

    // Render a window of polaroids: current, -1, +1, -2, +2
    const offsets = [-2, -1, 0, 1, 2];
    offsets.forEach(offset => {
      const photoIdx = ((currentIdx + offset) % n + n) % n;
      const photoSrc = photoList[photoIdx];
      const cap = captions[photoIdx % captions.length];
      const a = Math.abs(offset);

      const fig = document.createElement('figure');
      fig.className = 'polaroid';
      fig.dataset.offset = offset;
      fig.dataset.index = photoIdx;

      fig.style.zIndex = 10 - a;
      fig.style.opacity = a > 1 ? 0 : 1;
      fig.style.pointerEvents = a > 1 ? 'none' : 'auto';
      fig.style.filter = a ? 'brightness(.65)' : 'none';
      fig.style.transform = `translateX(${offset * 64}%) translateZ(${-a * 160}px) rotateY(${-offset * 40}deg) rotateZ(${offset * 2.5}deg)`;

      fig.innerHTML = `
        <span class="polaroid-clip"></span>
        <div class="polaroid-img-wrap">
          <img src="${photoSrc}" alt="Memory ${photoIdx + 1}" draggable="false" loading="lazy">
        </div>
        <figcaption>${cap}</figcaption>
      `;

      // Fallback for image load error
      const img = fig.querySelector('img');
      img.addEventListener('error', function() {
        this.src = 'assets/hero-placeholder.svg';
      });

      // Click on center card opens Lightbox
      fig.addEventListener('click', () => {
        if (offset === 0) {
          openLightbox(photoSrc, cap);
        } else {
          userGo(offset);
        }
      });

      stack.appendChild(fig);
    });

    if (count) count.textContent = `${currentIdx + 1} / ${n}`;
  }

  function go(dir) {
    currentIdx = ((currentIdx + dir) % n + n) % n;
    renderStack();
  }

  function userGo(dir) {
    go(dir);
    resetAutoTimer();
  }

  function resetAutoTimer() {
    clearInterval(timer);
    if (isAutoPlay) {
      timer = setInterval(() => go(1), 3800);
    }
  }

  function shufflePhotos() {
    for (let i = photoList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [photoList[i], photoList[j]] = [photoList[j], photoList[i]];
    }
    currentIdx = 0;
    renderStack();
    resetAutoTimer();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  }

  // Controls
  if (nextBtn) nextBtn.onclick = () => userGo(1);
  if (prevBtn) prevBtn.onclick = () => userGo(-1);
  if (shuffleBtn) shuffleBtn.onclick = shufflePhotos;

  if (autoPlayBtn) {
    autoPlayBtn.onclick = () => {
      isAutoPlay = !isAutoPlay;
      if (isAutoPlay) {
        autoPlayBtn.classList.add('active');
        if (autoPlayText) autoPlayText.textContent = '⏸ Pause Auto-Slide';
        resetAutoTimer();
      } else {
        autoPlayBtn.classList.remove('active');
        if (autoPlayText) autoPlayText.textContent = '▶ Start Auto-Slide';
        clearInterval(timer);
      }
    };
  }

  // Keyboard navigation
  addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') userGo(1);
    if (e.key === 'ArrowLeft') userGo(-1);
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) closeLightbox();
  });

  // Touch Swipe Gesture
  let sx = null;
  stack.addEventListener('pointerdown', e => { sx = e.clientX; });
  stack.addEventListener('pointerup', e => {
    if (sx === null) return;
    const diff = e.clientX - sx;
    sx = null;
    if (Math.abs(diff) > 40) {
      userGo(diff < 0 ? 1 : -1);
    }
  });
  stack.addEventListener('pointercancel', () => { sx = null; });

  // Lightbox functions
  function openLightbox(src, cap) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCap) lightboxCap.textContent = cap;
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
  }

  if (lightboxClose) lightboxClose.onclick = closeLightbox;
  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Initialize
  renderStack();
  resetAutoTimer();
})();

// ==========================================
// 9. FINAL FLIP CARD (CHETAN'S LETTER)
// ==========================================
(function() {
  const card = $('#card');
  const flip = () => {
    if (card) {
      card.classList.toggle('flipped');
      if (card.classList.contains('flipped') && typeof confetti === 'function') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    }
  };
  const toggleBtn = $('#toggleButton');
  const cardContainer = $('#cardContainer');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', e => {
      e.stopPropagation();
      flip();
    });
  }
  if (cardContainer) {
    cardContainer.addEventListener('click', flip);
  }
})();
