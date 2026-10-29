// YearCard renderer: draws story cards (1080x1920) and a feed card (1080x1350) on canvas.
(function () {
  const W = 1080, H = 1920;
  const DISP = '"Bricolage Grotesque", system-ui, -apple-system, "Segoe UI", sans-serif';
  const PAL = {
    explorer: { dark: "#0B4F5C", mid: "#0E7C86", acc: "#F2C14E", light: "#FFF4D6" },
    builder:  { dark: "#14213D", mid: "#2B4C7E", acc: "#FF5A5F", light: "#FFE3E3" },
    main:     { dark: "#7A0B3C", mid: "#E62E6B", acc: "#FFC300", light: "#FFE6F0" },
    glow:     { dark: "#12372A", mid: "#2E7D5B", acc: "#C6F432", light: "#EEF9D9" },
    heart:    { dark: "#5C0A24", mid: "#C9184A", acc: "#FFB3C6", light: "#FFE5EC" },
    soft:     { dark: "#2B2370", mid: "#6C63FF", acc: "#FFD6E8", light: "#EFEDFF" },
    phoenix:  { dark: "#240046", mid: "#7B2CBF", acc: "#FF8C42", light: "#FFE8D6" },
    wildcard: { dark: "#0A0A0A", mid: "#2A2A2A", acc: "#00F5D4", light: "#E0FFF9" }
  };
  const SITE = "kitwisestudio.github.io/yearcard";

  function font(w, px) { return `${w} ${px}px ${DISP}`; }
  function fit(ctx, text, maxW, max, min, w) {
    let s = max; ctx.font = font(w, s);
    while (s > min && ctx.measureText(text).width > maxW) { s -= 4; ctx.font = font(w, s); }
    return s;
  }
  function wrap(ctx, text, maxW) {
    const words = String(text).split(" "), lines = []; let line = "";
    words.forEach(wd => {
      const t = line ? line + " " + wd : wd;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = wd; } else line = t;
    });
    if (line) lines.push(line);
    return lines;
  }
  // Draw wrapped text that shrinks until it fits maxLines.
  function block(ctx, text, x, y, maxW, max, min, w, maxLines, lh, align) {
    let s = max, lines;
    for (;;) { ctx.font = font(w, s); lines = wrap(ctx, text, maxW); if (lines.length <= maxLines || s <= min) break; s -= 4; }
    lines = lines.slice(0, maxLines);
    ctx.textAlign = align || "left";
    lines.forEach((l, i) => ctx.fillText(l, x, y + i * s * (lh || 1.12)));
    return y + lines.length * s * (lh || 1.12);
  }
  function grad(ctx, a, b, x0, y0, x1, y1) { const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; }
  function circle(ctx, x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); }
  function pill(ctx, x, y, text, bg, fg, px, align) {
    ctx.font = font(700, px); const tw = ctx.measureText(text).width, ph = px * 1.9, pw = tw + px * 1.6;
    const x0 = align === "center" ? x - pw / 2 : x;
    ctx.beginPath(); ctx.roundRect(x0, y, pw, ph, ph / 2); ctx.fillStyle = bg; ctx.fill();
    ctx.fillStyle = fg; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(text, x0 + px * 0.8, y + ph / 2 + 2); ctx.textBaseline = "alphabetic";
    return pw;
  }
  function footer(ctx, ink, h) {
    h = h || H;
    ctx.globalAlpha = 0.9; ctx.fillStyle = ink; ctx.textAlign = "left";
    ctx.font = font(800, 38); ctx.fillText("YearCard", 80, h - 80);
    ctx.textAlign = "right"; ctx.font = font(500, 30); ctx.fillText(SITE, W - 80, h - 82);
    ctx.globalAlpha = 1;
  }
  function label(ctx, text, x, y, color, align) {
    ctx.fillStyle = color; ctx.textAlign = align || "left"; ctx.font = font(700, 44);
    ctx.fillText(text.toUpperCase(), x, y);
  }

  function slides(a, L, arch) {
    const P = PAL[arch], S = L.s, A = L.a[arch], out = [];
    const name = a.name ? S.cover.replace("{name}", a.name) : S.coverAnon;

    // 1. Cover
    out.push(ctx => {
      ctx.fillStyle = grad(ctx, P.dark, P.mid, 0, 0, W, H); ctx.fillRect(0, 0, W, H);
      circle(ctx, W - 80, 380, 340, P.acc); circle(ctx, 140, H - 420, 220, "rgba(255,255,255,.10)");
      ctx.save(); ctx.translate(W / 2, H - 330); ctx.rotate(-0.08);
      ctx.font = font(800, 500); ctx.textAlign = "center"; ctx.lineWidth = 6; ctx.strokeStyle = "rgba(255,255,255,.6)";
      ctx.strokeText("2026", 0, 0); ctx.restore();
      ctx.fillStyle = "#fff"; const ny = block(ctx, name, 80, 760, W - 160, 160, 80, 800, 2, 1.0);
      pill(ctx, 80, ny - 40, S.recapped, P.acc, P.dark, 52);
      footer(ctx, "#fff");
    });

    // 2. Word of the year
    if (a.word) out.push(ctx => {
      ctx.fillStyle = P.light; ctx.fillRect(0, 0, W, H);
      for (let r = 900; r > 100; r -= 130) { ctx.beginPath(); ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2); ctx.strokeStyle = P.mid; ctx.globalAlpha = .12; ctx.lineWidth = 40; ctx.stroke(); }
      ctx.globalAlpha = 1;
      label(ctx, S.word, W / 2, 640, P.dark, "center");
      const word = a.word.toUpperCase(); fit(ctx, word, W - 140, 260, 90, 800);
      ctx.fillStyle = P.mid; ctx.textAlign = "center"; ctx.fillText(word, W / 2, H / 2 + 80);
      ctx.fillStyle = P.dark; ctx.font = font(500, 46);
      if (a.mood) ctx.fillText(`${S.mood}: ${"★".repeat(a.mood)}${"☆".repeat(5 - a.mood)}  ${S.stars[a.mood - 1]}`, W / 2, H / 2 + 300);
      footer(ctx, P.dark);
    });

    // 3. Numbers
    const nums = [["places", a.places], ["books", a.books], ["people", a.people], ["events", a.events]].filter(x => x[1]);
    if (nums.length) out.push(ctx => {
      ctx.fillStyle = P.dark; ctx.fillRect(0, 0, W, H);
      circle(ctx, W, 0, 420, P.mid);
      label(ctx, S.nums, 80, 300, P.acc);
      const rows = nums.length; const top = 470, avail = 1200, step = avail / rows;
      nums.forEach(([k, v], i) => {
        const y = top + i * step;
        ctx.fillStyle = P.acc; ctx.textAlign = "left"; ctx.font = font(800, Math.min(250, step * 0.75));
        ctx.fillText(String(v), 72, y + Math.min(230, step * 0.68));
        const nw = ctx.measureText(String(v)).width;
        ctx.fillStyle = "#fff"; ctx.font = font(600, 58);
        block(ctx, S[k], 72 + nw + 40, y + Math.min(150, step * 0.45), W - nw - 200, 58, 40, 600, 2, 1.1);
      });
      footer(ctx, "#fff");
    });

    // 4. Song + best moment
    if (a.song || a.moment) out.push(ctx => {
      ctx.fillStyle = grad(ctx, P.mid, P.dark, 0, 0, 0, H); ctx.fillRect(0, 0, W, H);
      let y = 300;
      if (a.song) {
        const cx = W / 2, cy = 560; circle(ctx, cx, cy, 300, "#111");
        for (let r = 280; r > 120; r -= 22) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = "rgba(255,255,255,.07)"; ctx.lineWidth = 3; ctx.stroke(); }
        circle(ctx, cx, cy, 110, P.acc); circle(ctx, cx, cy, 16, "#111");
        label(ctx, S.song, W / 2, 1000, P.acc, "center");
        ctx.fillStyle = "#fff"; y = block(ctx, a.song, W / 2, 1110, W - 160, 96, 56, 800, 2, 1.05, "center");
        y += 80;
      } else y = 500;
      if (a.moment) {
        label(ctx, S.moment, W / 2, y + 40, P.acc, "center");
        ctx.fillStyle = "#fff"; block(ctx, "“" + a.moment + "”", W / 2, y + 140, W - 180, 70, 44, 600, 4, 1.18, "center");
      }
      footer(ctx, "#fff");
    });

    // 5. Lessons: hard / learned / win
    const hardTxt = a.hard && !["none", "private"].includes(a.hard) ? L.q.hard.opts[a.hard] : null;
    const items = [[S.hard, hardTxt], [S.learned, a.learned], [S.win, a.win]].filter(x => x[1]);
    if (items.length) out.push(ctx => {
      ctx.fillStyle = P.light; ctx.fillRect(0, 0, W, H);
      const bh = 1380 / items.length; let y = 260;
      items.forEach(([lab, txt], i) => {
        const colors = [P.dark, P.mid, P.acc];
        ctx.beginPath(); ctx.roundRect(60, y, W - 120, bh - 40, 48); ctx.fillStyle = colors[i % 3]; ctx.fill();
        const ink = i % 3 === 2 ? P.dark : "#fff";
        ctx.fillStyle = ink; ctx.textAlign = "left"; ctx.font = font(700, 40); ctx.fillText(lab.toUpperCase(), 120, y + 100);
        block(ctx, txt, 120, y + 210, W - 240, 96, 46, 800, items.length === 1 ? 6 : 3, 1.1);
        y += bh;
      });
      footer(ctx, P.dark);
    });

    // 6. Archetype
    out.push(ctx => {
      ctx.fillStyle = grad(ctx, P.mid, P.dark, 0, 0, W, H); ctx.fillRect(0, 0, W, H);
      circle(ctx, W / 2, 560, 330, P.acc); circle(ctx, W / 2, 560, 230, P.dark);
      ctx.font = font(800, 150); ctx.fillStyle = P.acc; ctx.textAlign = "center"; ctx.fillText("2026", W / 2, 612);
      label(ctx, S.youwere, W / 2, 1010, "rgba(255,255,255,.85)", "center");
      ctx.fillStyle = "#fff"; let y = block(ctx, A.n, W / 2, 1140, W - 140, 130, 70, 800, 2, 1.0, "center");
      ctx.fillStyle = "rgba(255,255,255,.9)"; y = block(ctx, A.d, W / 2, y + 40, W - 200, 52, 38, 500, 3, 1.25, "center");
      ctx.font = font(700, 40); const ws = A.t.map(t => ctx.measureText(t).width + 64 + 24); const tot = ws.reduce((p, c) => p + c, 0) - 24;
      let x = (W - tot) / 2; A.t.forEach((t, i) => { pill(ctx, x, y + 60, t, P.acc, P.dark, 40); x += ws[i]; });
      footer(ctx, "#fff");
    });

    // 7. Era
    if (a.era) out.push(ctx => {
      ctx.fillStyle = "#0b0b0f"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff"; ctx.textAlign = "left"; ctx.font = font(600, 48); ctx.fillText(S.era, 80, 620);
      ctx.beginPath(); ctx.roundRect(80, 680, W - 160, 44, 22); ctx.fillStyle = "#26262e"; ctx.fill();
      ctx.beginPath(); ctx.roundRect(80, 680, (W - 160) * 0.99, 44, 22); ctx.fillStyle = grad(ctx, P.mid, P.acc, 80, 0, W - 80, 0); ctx.fill();
      ctx.fillStyle = "#888"; ctx.font = font(600, 36); ctx.textAlign = "right"; ctx.fillText("99%", W - 80, 790);
      label(ctx, S.era2, 80, 1040, P.acc);
      ctx.fillStyle = grad(ctx, P.acc, "#ffffff", 0, 1100, 0, 1500);
      block(ctx, L.q.era.opts[a.era] || a.era, 80, 1220, W - 160, 180, 80, 800, 3, 1.0);
      ctx.save(); ctx.translate(W / 2, H - 260); ctx.font = font(800, 360); ctx.textAlign = "center"; ctx.lineWidth = 5; ctx.strokeStyle = P.acc; ctx.globalAlpha = .45; ctx.strokeText("2027", 0, 0); ctx.restore();
      footer(ctx, "#fff");
    });
    return out;
  }

  // 4:5 summary card for feeds.
  function feed(a, L, arch) {
    const P = PAL[arch], S = L.s, A = L.a[arch], FH = 1350;
    return ctx => {
      ctx.fillStyle = P.dark; ctx.fillRect(0, 0, W, FH);
      circle(ctx, W - 60, 120, 260, P.mid);
      ctx.fillStyle = "#fff"; ctx.textAlign = "left";
      block(ctx, a.name ? S.cover.replace("{name}", a.name) : S.coverAnon, 70, 170, W - 300, 96, 60, 800, 1);
      pill(ctx, 70, 210, S.recapped, P.acc, P.dark, 36);
      const cells = [
        [S.word, a.word], [S.youwere, A.n], [S.song, a.song], [S.win, a.win],
        [S.moment, a.moment], [S.era2, a.era ? L.q.era.opts[a.era] : null]
      ].filter(c => c[1]).slice(0, 6);
      const cw = (W - 70 * 2 - 30) / 2, ch = 248; let i = 0;
      cells.forEach(([lab, val]) => {
        const col = i % 2, row = Math.floor(i / 2), x = 70 + col * (cw + 30), y = 330 + row * (ch + 26);
        ctx.beginPath(); ctx.roundRect(x, y, cw, ch, 36); ctx.fillStyle = i === 1 ? P.acc : "rgba(255,255,255,.09)"; ctx.fill();
        const ink = i === 1 ? P.dark : "#fff";
        ctx.fillStyle = i === 1 ? P.dark : P.acc; ctx.font = font(700, 28); ctx.textAlign = "left"; ctx.fillText(lab.toUpperCase(), x + 34, y + 62);
        ctx.fillStyle = ink; block(ctx, val, x + 34, y + 130, cw - 68, 58, 30, 800, 3, 1.08);
        i++;
      });
      footer(ctx, "#fff", FH);
    };
  }

  async function ready() {
    try { await Promise.all([document.fonts.load(font(800, 100)), document.fonts.load(font(500, 40)), document.fonts.load(font(700, 40))]); } catch (e) {}
  }
  function draw(fn, h) {
    const c = document.createElement("canvas"); c.width = W; c.height = h || H;
    const ctx = c.getContext("2d"); ctx.textBaseline = "alphabetic"; fn(ctx); return c;
  }
  window.YCRender = { slides, feed, draw, ready, W, H, PAL };
})();
