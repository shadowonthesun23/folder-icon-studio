import { useState, useEffect, useRef, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';

import { TRANSLATIONS } from './constants/translations';
import { FOLDER_COLORS, CASSETTE_COLORS, TAPE_COLORS } from './constants/colors';
import { FOLDERS } from './constants/folders';
import { loadSvgAsImage, loadPngAsImage, getDominantColor } from './lib/image';
import { buildIcns, buildIco } from './lib/export';
import { drawTape, drawBanner, drawBadge } from './lib/canvas';
import { loadPresetsFromStorage, savePresetsToStorage, makeSnapshot, captureThumbnail } from './lib/presets';
import { useHistory } from './hooks/useHistory';
import { useDrag } from './hooks/useDrag';

import SidebarHeader from './components/SidebarHeader';
import SectionArtwork from './components/SectionArtwork';
import SectionLabel from './components/SectionLabel';
import SectionPresets from './components/SectionPresets';
import SidebarFooter from './components/SidebarFooter';
import CanvasPreview from './components/CanvasPreview';

export default function App() {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const downloadMenuRef = useRef(null);
  const folderColorInputRef = useRef(null);
  const tapeColorInputRef = useRef(null);
  const sliderDebounceRef = useRef({});

  // ── Asset state ──────────────────────────────────────────────────────────────
  const [baseImgData, setBaseImgData] = useState(null);
  const [cassetteBaseImg, setCassetteBaseImg] = useState(null);
  const [cassetteOverlayImg, setCassetteOverlayImg] = useState(null);
  const [cassetteMaskImg, setCassetteMaskImg] = useState(null);
  const [coverSrc, setCoverSrc] = useState(null);
  const [coverImg, setCoverImg] = useState(null);

  // ── Editor state ─────────────────────────────────────────────────────────────
  const [label, setLabel] = useState('Archivio 01');
  const [labelStyle, setLabelStyle] = useState('dymo');
  const [tapeColor, setTapeColor] = useState('#f4ebd0');
  const [tapeOpacity, setTapeOpacity] = useState(1);
  const [tapeRotation, setTapeRotation] = useState(-2.3);
  const [tapeScale, setTapeScale] = useState(1);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [fontFamily, setFontFamily] = useState('Space Mono');
  const [dominantColor, setDominantColor] = useState(null);
  const [folderColorOverride, setFolderColorOverride] = useState(null);
  const [customFolderColor, setCustomFolderColor] = useState('#4B8EF0');
  const [folderShape, setFolderShape] = useState('classic');
  const [coverOffset, setCoverOffset] = useState({ x: 0, y: 0 });
  const [coverScale, setCoverScale] = useState(1);
  const [coverRotation, setCoverRotation] = useState(0);
  const [tapeOffset, setTapeOffset] = useState({ x: 0, y: 0 });
  const [badgeOffset, setBadgeOffset] = useState({ x: 0, y: 0 });
  const [badgeSize, setBadgeSize] = useState(160);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [presets, setPresets] = useState(() => loadPresetsFromStorage());
  const [presetName, setPresetName] = useState('');
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [section3HintVisible, setSection3HintVisible] = useState(false);
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('fis_lang') || 'it'; } catch { return 'it'; } });

  const t = TRANSLATIONS[lang];
  const activeColorPalette = folderShape === 'cassette' ? CASSETTE_COLORS : FOLDER_COLORS;
  const effectiveTintColor = folderShape === 'cassette' ? folderColorOverride : (folderColorOverride ?? dominantColor ?? null);
  const isPresetColor = TAPE_COLORS.some(c => c.hex === tapeColor);
  const isCustomFolderColor = folderColorOverride !== null && !activeColorPalette.slice(1).some(c => c.hex === folderColorOverride);

  // ── stateRef ─────────────────────────────────────────────────────────────────
  const stateRef = useRef({});
  useEffect(() => {
    stateRef.current = { label, labelStyle, tapeColor, tapeOpacity, tapeRotation, tapeScale, fontSizeMultiplier, fontFamily, tapeOffset, badgeOffset, badgeSize, coverOffset, coverScale, coverRotation, folderColorOverride };
  });

  // ── History ──────────────────────────────────────────────────────────────────
  const applySnapshot = useCallback((snap) => {
    setLabel(snap.label); setLabelStyle(snap.labelStyle); setTapeColor(snap.tapeColor);
    setTapeOpacity(snap.tapeOpacity); setTapeRotation(snap.tapeRotation); setTapeScale(snap.tapeScale ?? 1);
    setFontSizeMultiplier(snap.fontSizeMultiplier); setFontFamily(snap.fontFamily);
    setTapeOffset(snap.tapeOffset); setBadgeOffset(snap.badgeOffset); setBadgeSize(snap.badgeSize);
    setCoverOffset(snap.coverOffset); setCoverScale(snap.coverScale); setCoverRotation(snap.coverRotation);
    setFolderColorOverride(snap.folderColorOverride);
  }, []);

  const { pushHistory, undo, redo, canUndo, canRedo } = useHistory(stateRef, applySnapshot);

  const pushDebounced = useCallback((key, snap) => {
    if (sliderDebounceRef.current[key]) clearTimeout(sliderDebounceRef.current[key]);
    sliderDebounceRef.current[key] = setTimeout(() => pushHistory(snap), 600);
  }, [pushHistory]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.key === 'z' && e.shiftKey) || e.key === 'y') { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  // ── Drag ─────────────────────────────────────────────────────────────────────
  const { handlePointerDown, handlePointerMove, handlePointerUp, updateCursor } = useDrag({
    canvasRef, coverSrc, label, labelStyle, tapeScale, tapeOffset, badgeOffset, badgeSize,
    setTapeOffset, setBadgeOffset, setCoverOffset,
    onDragEnd: () => pushHistory(makeSnapshot(stateRef.current)),
  });
  useEffect(() => { updateCursor(false); }, [coverSrc, updateCursor]);

  // ── Cassette shape reset ──────────────────────────────────────────────────────
  useEffect(() => {
    if (folderShape === 'cassette') {
      setLabel('');
      setLabelStyle(prev => (prev === 'banner' || prev === 'badge') ? 'dymo' : prev);
      setFolderColorOverride(null);
    }
  }, [folderShape]);

  // ── Asset loading ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Permanent+Marker&family=Playfair+Display:wght@700&display=swap';
    link.rel = 'stylesheet'; document.head.appendChild(link);
  }, []);

  useEffect(() => {
    setBaseImgData(null);
    if (folderShape === 'cassette') return;
    loadSvgAsImage(FOLDERS[folderShape].svg).then(setBaseImgData).catch(console.error);
  }, [folderShape]);

  useEffect(() => {
    if (folderShape !== 'cassette') return;
    setCassetteBaseImg(null); setCassetteOverlayImg(null); setCassetteMaskImg(null);
    Promise.all([
      loadPngAsImage('/cassette-base.png'),
      loadPngAsImage('/cassette-overlay.png'),
      new Promise((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = rej; img.src = '/maschera.svg'; }),
    ]).then(([base, overlay, mask]) => { setCassetteBaseImg(base); setCassetteOverlayImg(overlay); setCassetteMaskImg(mask); })
      .catch(console.error);
  }, [folderShape]);

  useEffect(() => {
    if (!coverSrc) { setCoverImg(null); return; }
    const img = new Image(); img.onload = () => setCoverImg(img); img.src = coverSrc;
  }, [coverSrc]);

  useEffect(() => {
    if (!downloadMenuOpen) return;
    const handler = (e) => { if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target)) setDownloadMenuOpen(false); };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [downloadMenuOpen]);

  // ── File upload ───────────────────────────────────────────────────────────────
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (coverSrc?.startsWith('blob:')) URL.revokeObjectURL(coverSrc);
    const url = URL.createObjectURL(file);
    setCoverSrc(url); setCoverOffset({ x: 0, y: 0 }); setCoverScale(1); setCoverRotation(0);
    const img = new Image(); img.onload = () => setDominantColor(getDominantColor(img)); img.src = url;
    e.target.value = '';
  };

  const handleClearImage = () => {
    if (coverSrc?.startsWith('blob:')) URL.revokeObjectURL(coverSrc);
    setCoverSrc(null); setCoverImg(null); setCoverOffset({ x: 0, y: 0 });
    setCoverScale(1); setCoverRotation(0); setDominantColor(null);
  };

  // ── Canvas render ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    if (folderShape === 'cassette') { if (!cassetteBaseImg || !cassetteMaskImg) return; }
    else { if (!baseImgData) return; }
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const shape = FOLDERS[folderShape];
    const folderRect = shape.getFolderRect(w, h);
    ctx.clearRect(0, 0, w, h);

    if (folderShape === 'cassette') {
      if (effectiveTintColor) {
        const off = document.createElement('canvas'); off.width = w; off.height = h;
        const offCtx = off.getContext('2d');
        offCtx.drawImage(cassetteBaseImg, folderRect.x, folderRect.y, folderRect.w, folderRect.h);
        offCtx.globalCompositeOperation = 'multiply'; offCtx.fillStyle = effectiveTintColor;
        offCtx.fillRect(folderRect.x, folderRect.y, folderRect.w, folderRect.h);
        offCtx.globalCompositeOperation = 'destination-in';
        offCtx.drawImage(cassetteBaseImg, folderRect.x, folderRect.y, folderRect.w, folderRect.h);
        ctx.drawImage(off, 0, 0);
      } else { ctx.drawImage(cassetteBaseImg, folderRect.x, folderRect.y, folderRect.w, folderRect.h); }

      if (coverImg) {
        const { x: lx, y: ly, w: lw, h: lh, vw, vh } = shape.clipRect;
        const sX = folderRect.w / vw, sY = folderRect.h / vh;
        const rectX = folderRect.x + lx * sX, rectY = folderRect.y + ly * sY;
        const rectW = lw * sX, rectH = lh * sY;
        const imgRatio = coverImg.width / coverImg.height, areaRatio = rectW / rectH;
        let drawW, drawH;
        if (imgRatio > areaRatio) { drawH = rectH * coverScale; drawW = drawH * imgRatio; }
        else { drawW = rectW * coverScale; drawH = drawW / imgRatio; }
        const drawX = (rectW - drawW) / 2 + coverOffset.x, drawY = (rectH - drawH) / 2 + coverOffset.y;
        const off = document.createElement('canvas'); off.width = Math.round(rectW); off.height = Math.round(rectH);
        const offCtx = off.getContext('2d');
        offCtx.imageSmoothingEnabled = true; offCtx.imageSmoothingQuality = 'high';
        offCtx.save(); offCtx.translate(drawX + drawW / 2, drawY + drawH / 2);
        offCtx.rotate((coverRotation * Math.PI) / 180);
        offCtx.translate(-(drawX + drawW / 2), -(drawY + drawH / 2));
        offCtx.drawImage(coverImg, drawX, drawY, drawW, drawH); offCtx.restore();
        offCtx.globalCompositeOperation = 'destination-in';
        offCtx.drawImage(cassetteMaskImg, 0, 0, off.width, off.height);
        ctx.drawImage(off, rectX, rectY);
      }
      if (cassetteOverlayImg) ctx.drawImage(cassetteOverlayImg, folderRect.x, folderRect.y, folderRect.w, folderRect.h);

    } else {
      if (shape.tintFolder && effectiveTintColor) {
        const off = document.createElement('canvas'); off.width = w; off.height = h;
        const offCtx = off.getContext('2d');
        offCtx.drawImage(baseImgData, folderRect.x, folderRect.y, folderRect.w, folderRect.h);
        offCtx.globalCompositeOperation = 'color'; offCtx.fillStyle = effectiveTintColor;
        offCtx.fillRect(folderRect.x, folderRect.y, folderRect.w, folderRect.h);
        offCtx.globalCompositeOperation = 'destination-in';
        offCtx.drawImage(baseImgData, folderRect.x, folderRect.y, folderRect.w, folderRect.h);
        ctx.drawImage(off, 0, 0);
      } else { ctx.drawImage(baseImgData, folderRect.x, folderRect.y, folderRect.w, folderRect.h); }

      if (coverImg) {
        ctx.save(); shape.buildFlapPath(ctx, folderRect); ctx.clip();
        const { clipRect } = shape;
        const rectX = folderRect.x + clipRect.x * (folderRect.w / clipRect.vw);
        const rectY = folderRect.y + clipRect.y * (folderRect.h / clipRect.vh);
        const rectW = clipRect.w * (folderRect.w / clipRect.vw);
        const rectH = clipRect.h * (folderRect.h / clipRect.vh);
        const imgRatio = coverImg.width / coverImg.height, canvasRatio = rectW / rectH;
        let drawW, drawH;
        if (imgRatio > canvasRatio) { drawH = rectH * coverScale; drawW = drawH * imgRatio; }
        else { drawW = rectW * coverScale; drawH = drawW / imgRatio; }
        const drawX = rectX + (rectW - drawW) / 2 + coverOffset.x;
        const drawY = rectY + (rectH - drawH) / 2 + coverOffset.y;
        ctx.save(); ctx.translate(drawX + drawW / 2, drawY + drawH / 2);
        ctx.rotate((coverRotation * Math.PI) / 180);
        ctx.translate(-(drawX + drawW / 2), -(drawY + drawH / 2));
        ctx.drawImage(coverImg, drawX, drawY, drawW, drawH); ctx.restore();
        const shadow = ctx.createLinearGradient(0, rectY, 0, rectY + rectH);
        shadow.addColorStop(0, 'rgba(255,255,255,0.15)'); shadow.addColorStop(0.1, 'rgba(0,0,0,0)');
        shadow.addColorStop(0.9, 'rgba(0,0,0,0)'); shadow.addColorStop(1, 'rgba(0,0,0,0.35)');
        ctx.fillStyle = shadow; ctx.fillRect(rectX, rectY, rectW, rectH); ctx.restore();
      }
    }

    if (label.trim() !== '') {
      if (labelStyle === 'dymo') drawTape(ctx, w, h, label, tapeColor, tapeOpacity, tapeOffset.x, tapeOffset.y, tapeRotation, fontSizeMultiplier, fontFamily, tapeScale);
      else if (labelStyle === 'banner') drawBanner(ctx, shape, folderRect, label, tapeColor, tapeOpacity, fontSizeMultiplier, fontFamily);
      else if (labelStyle === 'badge') drawBadge(ctx, w, h, label, tapeColor, tapeOpacity, badgeOffset.x, badgeOffset.y, badgeSize, fontSizeMultiplier, fontFamily);
    }
  }, [baseImgData, cassetteBaseImg, cassetteOverlayImg, cassetteMaskImg, coverImg, label, labelStyle, tapeColor, tapeOpacity, effectiveTintColor, coverOffset, coverScale, coverRotation, tapeOffset, badgeOffset, badgeSize, folderShape, tapeRotation, tapeScale, fontSizeMultiplier, fontFamily]);

  // ── Downloads ─────────────────────────────────────────────────────────────────
  const getFileName = () => (label.trim() === '' ? 'icon' : label).replace(/\s+/g, '_').toLowerCase();
  const handleDownloadPng = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const link = document.createElement('a'); link.download = `folder_${getFileName()}.png`; link.href = canvas.toDataURL('image/png'); link.click();
    setDownloadMenuOpen(false);
  };
  const handleDownloadIcns = async () => {
    const canvas = canvasRef.current; if (!canvas) return;
    setIsExporting(true); setDownloadMenuOpen(false);
    try { const blob = await buildIcns(canvas); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.download = `folder_${getFileName()}.icns`; link.href = url; link.click(); setTimeout(() => URL.revokeObjectURL(url), 5000); }
    finally { setIsExporting(false); }
  };
  const handleDownloadIco = async () => {
    const canvas = canvasRef.current; if (!canvas) return;
    setIsExporting(true); setDownloadMenuOpen(false);
    try { const blob = await buildIco(canvas); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.download = `folder_${getFileName()}.ico`; link.href = url; link.click(); setTimeout(() => URL.revokeObjectURL(url), 5000); }
    finally { setIsExporting(false); }
  };

  // ── Presets ───────────────────────────────────────────────────────────────────
  const handleSavePreset = () => {
    const name = presetName.trim() || `Stile ${presets.length + 1}`;
    const updated = [...presets, { id: Date.now(), name, thumbnail: captureThumbnail(canvasRef.current), ...makeSnapshot(stateRef.current) }];
    setPresets(updated); savePresetsToStorage(updated); setPresetName('');
  };
  const handleApplyPreset = (preset) => { const { id, name, thumbnail, ...snap } = preset; applySnapshot(snap); pushHistory(makeSnapshot(snap)); };
  const handleDeletePreset = (id) => { const updated = presets.filter(p => p.id !== id); setPresets(updated); savePresetsToStorage(updated); };

  // ── Setters with history ──────────────────────────────────────────────────────
  const setLabelWithHistory = (v) => { setLabel(v); pushDebounced('label', makeSnapshot({ ...stateRef.current, label: v })); };
  const setLabelStyleWithHistory = (v) => { setLabelStyle(v); pushHistory(makeSnapshot({ ...stateRef.current, labelStyle: v })); };
  const setTapeColorWithHistory = (v) => { setTapeColor(v); pushHistory(makeSnapshot({ ...stateRef.current, tapeColor: v })); };
  const setTapeOpacityWithHistory = (v) => { setTapeOpacity(v); pushDebounced('opacity', makeSnapshot({ ...stateRef.current, tapeOpacity: v })); };
  const setTapeRotationWithHistory = (v) => { setTapeRotation(v); pushDebounced('tapeRotation', makeSnapshot({ ...stateRef.current, tapeRotation: v })); };
  const setTapeScaleWithHistory = (v) => { setTapeScale(v); pushDebounced('tapeScale', makeSnapshot({ ...stateRef.current, tapeScale: v })); };
  const setFontSizeMultiplierWithHistory = (v) => { setFontSizeMultiplier(v); pushDebounced('fontSize', makeSnapshot({ ...stateRef.current, fontSizeMultiplier: v })); };
  const setFontFamilyWithHistory = (v) => { setFontFamily(v); pushHistory(makeSnapshot({ ...stateRef.current, fontFamily: v })); };
  const setBadgeSizeWithHistory = (v) => { setBadgeSize(v); pushDebounced('badgeSize', makeSnapshot({ ...stateRef.current, badgeSize: v })); };
  const setFolderColorOverrideWithHistory = (v) => { setFolderColorOverride(v); pushHistory(makeSnapshot({ ...stateRef.current, folderColorOverride: v })); };
  const setCoverScaleWithHistory = (v) => { setCoverScale(v); pushDebounced('coverScale', makeSnapshot({ ...stateRef.current, coverScale: v })); };
  const setCoverRotationWithHistory = (v) => { setCoverRotation(v); pushDebounced('coverRotation', makeSnapshot({ ...stateRef.current, coverRotation: v })); };
  const switchLang = (l) => { setLang(l); try { localStorage.setItem('fis_lang', l); } catch {} };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row min-h-[100dvh] lg:h-[100dvh] bg-[#09090b] text-neutral-100 font-sans overflow-y-auto lg:overflow-hidden">
      <span style={{ fontFamily: 'Space Mono', position: 'absolute', opacity: 0, pointerEvents: 'none' }}>.</span>
      <style dangerouslySetInnerHTML={{__html: `
        .bg-dot-pattern { background-color: #09090b; background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 24px 24px; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.1); border-radius: 10px; }
        .sidebar-footer { position: relative; backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); background: rgba(18, 18, 20, 0.82); border-top: 1px solid rgba(255,255,255,0.06); }
        .sidebar-footer::before { content: ''; position: absolute; top: -48px; left: 0; right: 0; height: 48px; pointer-events: none; background: linear-gradient(to bottom, transparent, rgba(18,18,20,0.82)); }
        .liquid-glass-btn { position: relative; overflow: hidden; color: rgba(255,255,255,0.92); font-weight: 500; background: linear-gradient(145deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.10) 100%); border: 1px solid rgba(255,255,255,0.18); box-shadow: 0 2px 0 rgba(255,255,255,0.12) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 8px 32px rgba(0,0,0,0.35), 0 1px 8px rgba(255,255,255,0.04); backdrop-filter: blur(12px) saturate(160%); -webkit-backdrop-filter: blur(12px) saturate(160%); transition: all 0.2s ease; text-shadow: 0 1px 3px rgba(0,0,0,0.4); }
        .liquid-glass-btn::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 50%; background: linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%); border-radius: inherit; pointer-events: none; }
        .liquid-glass-btn::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%); pointer-events: none; }
        .liquid-glass-btn:hover { background: linear-gradient(145deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.15) 100%); border-color: rgba(255,255,255,0.28); box-shadow: 0 2px 0 rgba(255,255,255,0.16) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 12px 40px rgba(0,0,0,0.4), 0 1px 12px rgba(255,255,255,0.06); }
        .liquid-glass-btn:active { transform: scale(0.98); box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 4px 16px rgba(0,0,0,0.3); }
        .liquid-glass-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        @keyframes bounce-x { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-6px); } }
        .animate-bounce-x { animation: bounce-x 1.8s ease-in-out infinite; }
      `}} />

      <aside className="w-full lg:w-[400px] bg-[#121214] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col z-10 shrink-0 h-auto max-h-[45dvh] lg:max-h-none lg:h-full overflow-y-auto lg:overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
          <SidebarHeader lang={lang} switchLang={switchLang} t={t} />
          <div className="p-6 lg:p-8 flex flex-col gap-6 lg:gap-8">
            <SectionArtwork
              t={t} folderShape={folderShape} setFolderShape={setFolderShape}
              coverSrc={coverSrc} onFileUpload={handleFileUpload} onClearImage={handleClearImage} fileInputRef={fileInputRef}
              coverScale={coverScale} setCoverScaleWithHistory={setCoverScaleWithHistory}
              coverRotation={coverRotation} setCoverRotationWithHistory={setCoverRotationWithHistory}
              folderColorOverride={folderColorOverride} setFolderColorOverrideWithHistory={setFolderColorOverrideWithHistory}
              customFolderColor={customFolderColor} setCustomFolderColor={setCustomFolderColor}
              activeColorPalette={activeColorPalette} isCustomFolderColor={isCustomFolderColor}
              folderColorInputRef={folderColorInputRef}
            />
            <hr className="border-white/5" />
            <SectionLabel
              t={t} folderShape={folderShape}
              label={label} setLabelWithHistory={setLabelWithHistory}
              labelStyle={labelStyle} setLabelStyleWithHistory={setLabelStyleWithHistory}
              fontFamily={fontFamily} setFontFamilyWithHistory={setFontFamilyWithHistory}
              fontSizeMultiplier={fontSizeMultiplier} setFontSizeMultiplierWithHistory={setFontSizeMultiplierWithHistory}
              tapeScale={tapeScale} setTapeScaleWithHistory={setTapeScaleWithHistory}
              tapeRotation={tapeRotation} setTapeRotationWithHistory={setTapeRotationWithHistory}
              badgeSize={badgeSize} setBadgeSizeWithHistory={setBadgeSizeWithHistory}
              tapeOffset={tapeOffset} setTapeOffset={setTapeOffset}
              badgeOffset={badgeOffset} setBadgeOffset={setBadgeOffset}
              tapeColor={tapeColor} setTapeColorWithHistory={setTapeColorWithHistory}
              tapeOpacity={tapeOpacity} setTapeOpacityWithHistory={setTapeOpacityWithHistory}
              tapeColorInputRef={tapeColorInputRef} isPresetColor={isPresetColor}
              pushHistory={pushHistory} stateRef={stateRef}
            />
            <hr className="border-white/5" />
            <SectionPresets
              t={t} presets={presets} presetName={presetName} setPresetName={setPresetName}
              presetsOpen={presetsOpen} setPresetsOpen={setPresetsOpen}
              section3HintVisible={section3HintVisible} setSection3HintVisible={setSection3HintVisible}
              onSave={handleSavePreset} onApply={handleApplyPreset} onDelete={handleDeletePreset}
            />
          </div>
        </div>
        <SidebarFooter
          t={t} canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo}
          isExporting={isExporting}
          downloadMenuOpen={downloadMenuOpen} setDownloadMenuOpen={setDownloadMenuOpen} downloadMenuRef={downloadMenuRef}
          onDownloadPng={handleDownloadPng} onDownloadIcns={handleDownloadIcns} onDownloadIco={handleDownloadIco}
        />
      </aside>

      <CanvasPreview
        t={t} coverSrc={coverSrc} label={label} canvasRef={canvasRef}
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
      />
      <Analytics />
    </div>
  );
}
