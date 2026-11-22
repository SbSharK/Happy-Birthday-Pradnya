(function(){
  const c = document.getElementById('bg');
  if(!c) return;
  const x = c.getContext('2d');
  let w, h, stars = [], petals = [], shots = [], hearts = [];
  const R = Math.random;

  function size(){
    const d = Math.min(window.devicePixelRatio || 1, 2);
    w = innerWidth;
    h = innerHeight;
    c.width = w * d;
    c.height = h * d;
    x.setTransform(d, 0, 0, d, 0, 0);

    stars = Array.from({ length: Math.floor(w * h / 5200) }, () => ({
      x: R() * w,
      y: R() * h * 0.8,
      r: 0.4 + R() * 1.5,
      s: R() * 6,
      f: 0.5 + R() * 2
    }));

    petals = Array.from({ length: Math.min(28, Math.floor(w / 20)) }, () => newPetal(true));
    hearts = Array.from({ length: 10 }, () => newHeart(true));
  }

  function newPetal(any){
    return {
      x: R() * w,
      y: any ? R() * h : -25,
      s: 7 + R() * 9,
      vy: 0.6 + R() * 0.9,
      vx: 0.3 + R() * 0.8,
      a: R() * 6,
      va: (R() - 0.5) * 0.03,
      f: R() * 6,
      ff: 0.02 + R() * 0.03,
      h: 330 + R() * 25
    };
  }

  function newHeart(any){
    return {
      x: R() * w,
      y: any ? R() * h : h + 20,
      size: 8 + R() * 10,
      vy: 0.4 + R() * 0.6,
      vx: (R() - 0.5) * 0.4,
      opacity: 0.2 + R() * 0.45,
      pulse: R() * 6
    };
  }

  function drawPetal(p){
    x.save();
    x.translate(p.x, p.y);
    x.rotate(p.a);
    x.scale(Math.cos(p.f), 1);
    const g = x.createLinearGradient(0, -p.s, 0, p.s);
    g.addColorStop(0, `hsl(${p.h}, 100%, 92%)`);
    g.addColorStop(1, `hsl(${p.h}, 85%, 72%)`);
    x.fillStyle = g;
    x.shadowColor = 'rgba(255, 150, 200, 0.7)';
    x.shadowBlur = 8;
    x.beginPath();
    x.moveTo(0, -p.s);
    x.bezierCurveTo(p.s, -p.s * 0.6, p.s * 0.9, p.s * 0.6, 0, p.s);
    x.bezierCurveTo(-p.s * 0.9, p.s * 0.6, -p.s, -p.s * 0.6, 0, -p.s);
    x.fill();
    x.restore();
  }

  function drawHeart(ht){
    x.save();
    x.translate(ht.x, ht.y);
    const scale = 1 + Math.sin(ht.pulse) * 0.15;
    x.scale(scale, scale);
    x.fillStyle = `rgba(255, 126, 182, ${ht.opacity})`;
    x.shadowColor = 'rgba(255, 180, 210, 0.6)';
    x.shadowBlur = 10;
    x.beginPath();
    const d = ht.size;
    x.moveTo(0, -d * 0.25);
    x.bezierCurveTo(-d * 0.5, -d * 0.8, -d, -d * 0.2, 0, d * 0.6);
    x.bezierCurveTo(d, -d * 0.2, d * 0.5, -d * 0.8, 0, -d * 0.25);
    x.fill();
    x.restore();
  }

  let last = 0;
  function draw(t){
    x.clearRect(0, 0, w, h);

    // Twinkling stars
    for(const s of stars){
      const a = 0.35 + 0.65 * Math.abs(Math.sin(t / 1000 * s.f + s.s));
      x.fillStyle = `rgba(255, 250, 235, ${a})`;
      x.beginPath();
      x.arc(s.x, s.y, s.r, 0, 7);
      x.fill();
    }

    // Shooting stars
    if(t - last > 3500 + R() * 3200){
      last = t;
      shots.push({ x: R() * w * 0.8 + w * 0.2, y: R() * h * 0.3, l: 0 });
    }
    shots = shots.filter(s => s.l < 1);
    for(const s of shots){
      s.l += 0.018;
      const px = s.x - s.l * 260, py = s.y + s.l * 140;
      const g = x.createLinearGradient(px, py, px + 90, py - 49);
      g.addColorStop(0, 'rgba(255, 255, 255, ' + (1 - s.l) + ')');
      g.addColorStop(1, 'rgba(255, 255, 255, 0)');
      x.strokeStyle = g;
      x.lineWidth = 2.4;
      x.lineCap = 'round';
      x.beginPath();
      x.moveTo(px, py);
      x.lineTo(px + 90, py - 49);
      x.stroke();
    }

    // Floating subtle hearts rising
    for(const ht of hearts){
      ht.y -= ht.vy;
      ht.x += ht.vx + Math.sin(t / 1200 + ht.pulse) * 0.3;
      ht.pulse += 0.03;
      if(ht.y < -30){
        Object.assign(ht, newHeart(false), { x: R() * w });
      }
      drawHeart(ht);
    }

    // Falling petals
    for(const p of petals){
      p.y += p.vy;
      p.x += p.vx + Math.sin(t / 900 + p.f) * 0.6;
      p.a += p.va;
      p.f += p.ff;
      if(p.y > h + 25 || p.x > w + 35){
        Object.assign(p, newPetal(false), { x: R() * w - w * 0.2 });
      }
      drawPetal(p);
    }

    requestAnimationFrame(draw);
  }

  addEventListener('resize', size);
  size();
  requestAnimationFrame(draw);
})();
