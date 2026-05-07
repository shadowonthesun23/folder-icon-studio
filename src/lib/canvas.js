export const getTapeTextColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#111827' : '#ffffff';
};

export const drawTape = (ctx, w, h, text, tapeHex, opacity, tapeOffsetX, tapeOffsetY, tapeRotationDeg, fontSizeMultiplier, fontFamily, tapeScale = 1) => {
  const tapeW = w * 0.55 * tapeScale;
  const tapeH = h * 0.12 * tapeScale;
  const tapeBaseX = w / 2 - tapeW / 2, tapeBaseY = h * 0.55 - tapeH / 2;
  const x = tapeBaseX + tapeOffsetX, y = tapeBaseY + tapeOffsetY;
  ctx.save();
  ctx.translate(x + tapeW / 2, y + tapeH / 2);
  ctx.rotate((tapeRotationDeg * Math.PI) / 180);
  ctx.translate(-(x + tapeW / 2), -(y + tapeH / 2));
  ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 15; ctx.shadowOffsetY = 5;
  ctx.fillStyle = tapeHex;
  ctx.beginPath();
  const zigs = 14, zigH = tapeH / zigs;
  const zigAmp = Math.max(4, 8 * tapeScale);
  ctx.moveTo(x, y);
  for (let i = 1; i <= zigs; i++) ctx.lineTo(x + (i % 2 === 0 ? 0 : zigAmp), y + i * zigH);
  ctx.lineTo(x + tapeW, y + tapeH);
  for (let i = zigs - 1; i >= 0; i--) ctx.lineTo(x + tapeW - (i % 2 === 0 ? 0 : zigAmp), y + i * zigH);
  ctx.lineTo(x, y); ctx.closePath();
  ctx.globalAlpha = opacity; ctx.fill(); ctx.globalAlpha = 1;
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = getTapeTextColor(tapeHex);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let fontSize = tapeH * 0.55 * fontSizeMultiplier;
  ctx.font = `bold ${fontSize}px "${fontFamily}", sans-serif`;
  while (ctx.measureText(text).width > tapeW * 0.85 && fontSize > 10) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px "${fontFamily}", sans-serif`;
  }
  ctx.fillText(text, x + tapeW / 2, y + tapeH / 2);
  ctx.restore();
};

export const drawBanner = (ctx, shape, folderRect, text, tapeHex, opacity, fontSizeMultiplier, fontFamily) => {
  const { clipRect } = shape;
  const scaleX = folderRect.w / clipRect.vw, scaleY = folderRect.h / clipRect.vh;
  const rectX = folderRect.x + clipRect.x * scaleX, rectY = folderRect.y + clipRect.y * scaleY;
  const rectW = clipRect.w * scaleX, rectH = clipRect.h * scaleY;
  const bannerH = rectH * 0.30, bannerY = rectY + rectH - bannerH;
  ctx.save();
  ctx.globalAlpha = opacity; ctx.fillStyle = tapeHex;
  ctx.fillRect(rectX, bannerY, rectW, bannerH);
  ctx.globalAlpha = 1;
  ctx.fillStyle = getTapeTextColor(tapeHex);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const words = text.split(' ');
  let lines = [text];
  let baseFontSize = bannerH * 0.28 * fontSizeMultiplier;
  ctx.font = `bold ${baseFontSize}px "${fontFamily}", sans-serif`;
  if (words.length > 1 && ctx.measureText(text).width > rectW * 0.88) {
    const mid = Math.ceil(words.length / 2);
    lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }
  lines.forEach((line, i) => {
    let fs = baseFontSize;
    ctx.font = `bold ${fs}px "${fontFamily}", sans-serif`;
    while (ctx.measureText(line).width > rectW * 0.88 && fs > 10) {
      fs -= 2;
      ctx.font = `bold ${fs}px "${fontFamily}", sans-serif`;
    }
    ctx.fillText(line, rectX + rectW / 2, bannerY + bannerH * ((i + 1) / (lines.length + 1)));
  });
  ctx.restore();
};

export const drawBadge = (ctx, w, h, text, badgeHex, opacity, badgeOffsetX, badgeOffsetY, radius, fontSizeMultiplier, fontFamily) => {
  const cx = w / 2 + badgeOffsetX, cy = h * 0.72 + badgeOffsetY;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 18; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 6;
  ctx.globalAlpha = opacity; ctx.fillStyle = badgeHex;
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.closePath(); ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; ctx.globalAlpha = 1;
  const highlight = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
  highlight.addColorStop(0, 'rgba(255,255,255,0.18)');
  highlight.addColorStop(0.5, 'rgba(255,255,255,0.04)');
  highlight.addColorStop(1, 'rgba(0,0,0,0.0)');
  ctx.globalAlpha = opacity; ctx.fillStyle = highlight;
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  ctx.fillStyle = getTapeTextColor(badgeHex);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const words = text.trim().split(' ');
  let lines = [text];
  let baseFontSize = radius * 0.38 * fontSizeMultiplier;
  const maxWidth = radius * 1.5;
  ctx.font = `bold ${baseFontSize}px "${fontFamily}", sans-serif`;
  if (words.length > 1 && ctx.measureText(text).width > maxWidth) {
    const mid = Math.ceil(words.length / 2);
    lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }
  lines.forEach((line, i) => {
    let fs = baseFontSize;
    ctx.font = `bold ${fs}px "${fontFamily}", sans-serif`;
    while (ctx.measureText(line).width > maxWidth && fs > 8) {
      fs -= 2;
      ctx.font = `bold ${fs}px "${fontFamily}", sans-serif`;
    }
    const lineH = fs * 1.2, totalH = lineH * lines.length;
    ctx.fillText(line, cx, cy - totalH / 2 + lineH * i + lineH / 2);
  });
  ctx.restore();
};
