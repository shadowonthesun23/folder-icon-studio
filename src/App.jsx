import React, { useState, useEffect, useRef } from 'react';
import { Upload, Download, Type, Image as LucideImage, ZoomIn, Palette, Check, Move, RotateCw, Droplet, Coffee, LayoutTemplate } from 'lucide-react';

const FOLDERS = {
  classic: {
    id: 'classic',
    name: 'Classica',
    svg: "<svg width='1024' height='1024' version='1.1' viewBox='0 0 16.933 16.933' xmlns='http://www.w3.org/2000/svg'><defs><filter id='filter9' x='-.0065174' y='-.075603' width='1.013' height='1.1512' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='0.041672346'/></filter><filter id='filter11' x='-.0069629' y='-.043386' width='1.0139' height='1.0868' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='0.044522292'/></filter><filter id='filter12' x='-.03226' y='-.045842' width='1.0645' height='1.0917' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='0.13691812'/></filter><linearGradient id='a' x1='8.466' x2='8.466' y1='12.7' y2='2.381' gradientUnits='userSpaceOnUse'><stop offset='0'/><stop stop-opacity='0' offset='1'/></linearGradient><linearGradient id='c' x1='8.467' x2='8.467' y1='4.498' y2='14.552' gradientUnits='userSpaceOnUse'><stop stop-color='#fff' offset='0'/><stop offset='1'/></linearGradient></defs><g id='folder'><path d='m1.945 2.381h2.965c0.75 0 0.904 0.084 1.27 0.63 0.297 0.441 0.84 0.429 1.756 0.429h7.05a1.146 1.146 0 0 1 1.152 1.152v6.956a1.15 1.15 0 0 1-1.152 1.152h-13.042a1.15 1.15 0 0 1-1.15-1.152v-8.015a1.15 1.15 0 0 1 1.15-1.152z' fill='#686868'/><path d='m1.945 2.381h2.965c0.75 0 0.904 0.084 1.27 0.63 0.297 0.441 0.84 0.429 1.756 0.429h7.05a1.146 1.146 0 0 1 1.152 1.152v6.956a1.15 1.15 0 0 1-1.152 1.152h-13.042a1.15 1.15 0 0 1-1.15-1.152v-8.015a1.15 1.15 0 0 1 1.15-1.152z' fill='url(#a)'/><rect x='1.3229' y='3.9687' width='14.287' height='10.054' rx='.52916' ry='.52916' fill='none' filter='url(#filter12)' opacity='.1' stroke='#000000' stroke-width='.26458'/><rect x='1.3229' y='3.9687' width='14.287' height='10.054' rx='.52916' ry='.52916' fill='#ffffff' stroke-width='.9649'/><rect x='.794' y='4.498' width='15.346' height='10.054' rx='1.058' ry='1.058' fill='#686868'/><rect x='.793' y='4.498' width='15.346' height='10.054' rx='1.058' ry='1.058' fill='url(#c)' opacity='.15'/><path d='m1.852 4.4978c-0.5863 0-1.0583 0.47201-1.0583 1.0583v0.26458c0-0.5863 0.47201-1.0583 1.0583-1.0583h13.229c0.5863 0 1.0583 0.47201 1.0583 1.0583v-0.26458c0-0.5863-0.47201-1.0583-1.0583-1.0583z' fill='#ffffff' filter='url(#filter9)' opacity='.15'/><path transform='matrix(1,0,0,-1,0,19.05)' d='m1.852 4.4978c-0.5863 0-1.0583 0.47201-1.0583 1.0583v0.26458c0-0.5863 0.47201-1.0583 1.0583-1.0583h13.229c0.5863 0 1.0583 0.47201 1.0583 1.0583v-0.26458c0-0.5863-0.47201-1.0583-1.0583-1.0583z' fill='#000000' filter='url(#filter9)' opacity='.1'/><path d='m1.944 2.3812c-0.6363-6e-4 -1.1519 0.51554-1.1508 1.1518v0.26044c0.001104-0.63442 0.51587-1.1483 1.1508-1.1477h2.9672c0.75 0 0.90392 0.083623 1.2707 0.62992 0.2962 0.44122 0.83942 0.42839 1.7554 0.42839h7.0501c0.63356-0.00333 1.1486 0.50792 1.1518 1.14v-0.25269c0.0033-0.63761-0.51424-1.1552-1.1518-1.1518h-7.0501c-0.91599 0-1.4592 0.012831-1.7554-0.42839-0.36678-0.5463-0.5207-0.62992-1.2707-0.62992h-2.9672z' fill='#ffffff' filter='url(#filter11)' opacity='.25'/></g></svg>",
    buildFlapPath: (ctx, w, h) => {
      const scaleX = w / 16.933;
      const scaleY = h / 16.933;
      const x = 0.794 * scaleX;
      const y = 4.498 * scaleY;
      const width = 15.346 * scaleX;
      const height = 10.054 * scaleY;
      const r = 1.058 * Math.min(scaleX, scaleY);

      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.arcTo(x + width, y, x + width, y + height, r);
      ctx.lineTo(x + width, y + height - r);
      ctx.arcTo(x + width, y + height, x, y + height, r);
      ctx.lineTo(x + r, y + height);
      ctx.arcTo(x, y + height, x, y, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + width, y, r);
      ctx.closePath();
    }
  },
  macos: {
    id: 'macos',
    name: 'macOS Custom',
    url: '/macos-folder-gray.svg',
    buildFlapPath: (ctx, w, h) => {
      const scaleX = w / 1024;
      const scaleY = h / 1024;
      const x = 42 * scaleX;
      const y = 258 * scaleY;
      const width = 940 * scaleX;
      const height = 656 * scaleY;
      const r = 72 * Math.min(scaleX, scaleY);

      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.arcTo(x + width, y, x + width, y + height, r);
      ctx.lineTo(x + width, y + height - r);
      ctx.arcTo(x + width, y + height, x, y + height, r);
      ctx.lineTo(x + r, y + height);
      ctx.arcTo(x, y + height, x, y, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + width, y, r);
      ctx.closePath();
    }
  }
};

const TAPE_COLORS = [
  { id: 'vintage', hex: '#f4ebd0', name: 'Vintage' },
  { id: 'white', hex: '#ffffff', name: 'Bianco' },
  { id: 'yellow', hex: '#ffeb3b', name: 'Giallo' },
  { id: 'orange', hex: '#ff9800', name: 'Arancione' },
  { id: 'red', hex: '#f44336', name: 'Rosso' }
];

const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

const drawTape = (ctx, w, h, text, tapeHex, opacity, tapeOffsetX, tapeOffsetY) => {
  const tapeW = w * 0.55;
  const tapeH = h * 0.12;
  const tapeBaseX = w / 2 - tapeW / 2;
  const tapeBaseY = h * 0.55 - tapeH / 2;
  
  const x = tapeBaseX + tapeOffsetX;
  const y = tapeBaseY + tapeOffsetY;

  ctx.save();
  ctx.translate(x + tapeW / 2, y + tapeH / 2);
  ctx.rotate(-0.04);
  ctx.translate(-(x + tapeW / 2), -(y + tapeH / 2));

  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 5;

  ctx.fillStyle = tapeHex;
  ctx.beginPath();
  const zigs = 14;
  const zigH = tapeH / zigs;
  ctx.moveTo(x, y);
  for (let i = 1; i <= zigs; i++) ctx.lineTo(x + (i % 2 === 0 ? 0 : 8), y + i * zigH);
  ctx.lineTo(x + tapeW, y + tapeH);
  for (let i = zigs - 1; i >= 0; i--) ctx.lineTo(x + tapeW - (i % 2 === 0 ? 0 : 8), y + i * zigH);
  ctx.lineTo(x, y);
  ctx.closePath();
  
  ctx.globalAlpha = opacity;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#111827'; 
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  let fontSize = tapeH * 0.55;
  ctx.font = `bold ${fontSize}px "Space Mono", monospace, sans-serif`;
  let textMetrics = ctx.measureText(text);
  
  while (textMetrics.width > tapeW * 0.8 && fontSize > 10) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px "Space Mono", monospace, sans-serif`;
    textMetrics = ctx.measureText(text);
  }

  ctx.fillText(text, x + tapeW / 2, y + tapeH / 2);
  ctx.restore();
};

const IconX = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4l11.733 16h4.267L8.267 4z" />
    <path d="M4 20l6.768-6.768m2.46-2.46L20 4" />
  </svg>
);

const IconInstagram = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function App() {
  const canvasRef = useRef(null);
  const [baseImgData, setBaseImgData] = useState(null);
  const [coverSrc, setCoverSrc] = useState(null);
  const [label, setLabel] = useState('ARCHIVIO 01');
  const [tapeColor, setTapeColor] = useState('#f4ebd0');
  const [tapeOpacity, setTapeOpacity] = useState(1);
  const [dominantColor, setDominantColor] = useState('#4a90e2');
  const [folderShape, setFolderShape] = useState('classic');

  const [coverOffset, setCoverOffset] = useState({ x: 0, y: 0 });
  const [coverScale, setCoverScale] = useState(1);
  const [coverRotation, setCoverRotation] = useState(0);
  const [tapeOffset, setTapeOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const shape = FOLDERS[folderShape];
    const img = document.createElement('img');
    img.onload = () => setBaseImgData(img);
    
    if (shape.url) {
      img.src = shape.url;
    } else {
      const svgBase64 = window.btoa(shape.svg);
      img.src = `data:image/svg+xml;base64,${svgBase64}`;
    }
  }, [folderShape]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target.result;
      setCoverSrc(src);
      setCoverOffset({ x: 0, y: 0 });
      setCoverScale(1);
      setCoverRotation(0);
      
      const img = document.createElement('img');
      img.onload = () => {
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');
        c.width = 64; 
        c.height = 64;
        ctx.drawImage(img, 0, 0, 64, 64);
        const data = ctx.getImageData(0, 0, 64, 64).data;
        let r = 0, g = 0, b = 0;
        const pxCount = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
        setDominantColor(rgbToHex(Math.round(r / pxCount), Math.round(g / pxCount), Math.round(b / pxCount)));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const tapeW = canvas.width * 0.55;
    const tapeH = canvas.height * 0.12;
    const tapeBaseX = canvas.width / 2 - tapeW / 2;
    const tapeBaseY = canvas.height * 0.55 - tapeH / 2;
    const tX = tapeBaseX + tapeOffset.x;
    const tY = tapeBaseY + tapeOffset.y;

    if (label.trim() !== '' && x >= tX && x <= tX + tapeW && y >= tY && y <= tY + tapeH) {
      setDragging('tape');
      setDragStartPos({ x: clientX, y: clientY });
      if(e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
    } else if (coverSrc) {
      setDragging('cover');
      setDragStartPos({ x: clientX, y: clientY });
      if(e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const dx = (clientX - dragStartPos.x) * scaleX;
    const dy = (clientY - dragStartPos.y) * scaleY;

    if (dragging === 'tape') {
      setTapeOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    } else if (dragging === 'cover') {
      setCoverOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    }
    
    setDragStartPos({ x: clientX, y: clientY });
  };

  const handlePointerUp = (e) => {
    setDragging(null);
    if(e.target.releasePointerCapture) e.target.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !baseImgData) return;
    
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    const render = async () => {
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.drawImage(baseImgData, 0, 0, w, h);
      
      if (coverSrc) {
        ctx.globalCompositeOperation = 'color';
        ctx.fillStyle = dominantColor;
        ctx.fillRect(0, 0, w, h);
        
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(baseImgData, 0, 0, w, h);
      }
      ctx.restore();

      if (coverSrc) {
        const coverImg = await new Promise((res) => {
          const img = document.createElement('img');
          img.onload = () => res(img);
          img.src = coverSrc;
        });

        ctx.save();
        FOLDERS[folderShape].buildFlapPath(ctx, w, h);
        ctx.clip();

        // Limiti basati sulla cartella classica come riferimento sicuro per l'ancoraggio base
        const rectW = 15.346 * (w / 16.933);
        const rectH = 10.054 * (h / 16.933);
        const rectX = 0.794 * (w / 16.933);
        const rectY = 4.498 * (h / 16.933);

        const imgRatio = coverImg.width / coverImg.height;
        const canvasRatio = rectW / rectH;
        
        let drawW, drawH, drawX, drawY;

        if (imgRatio > canvasRatio) {
          drawH = rectH * coverScale;
          drawW = drawH * imgRatio;
        } else {
          drawW = rectW * coverScale;
          drawH = drawW / imgRatio;
        }
        
        drawX = rectX + (rectW - drawW) / 2;
        drawY = rectY + (rectH - drawH) / 2;

        const imgFinalX = drawX + coverOffset.x;
        const imgFinalY = drawY + coverOffset.y;
        
        ctx.save();
        const centerX = imgFinalX + drawW / 2;
        const centerY = imgFinalY + drawH / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate((coverRotation * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
        
        ctx.drawImage(coverImg, imgFinalX, imgFinalY, drawW, drawH);
        ctx.restore();

        const shadow = ctx.createLinearGradient(0, rectY, 0, rectY + rectH);
        shadow.addColorStop(0, 'rgba(255,255,255,0.15)');
        shadow.addColorStop(0.1, 'rgba(0,0,0,0)');
        shadow.addColorStop(0.9, 'rgba(0,0,0,0)');
        shadow.addColorStop(1, 'rgba(0,0,0,0.35)');
        ctx.fillStyle = shadow;
        ctx.fillRect(rectX, rectY, rectW, rectH);

        ctx.restore();
      }

      if (label.trim() !== '') {
        drawTape(ctx, w, h, label, tapeColor, tapeOpacity, tapeOffset.x, tapeOffset.y);
      }
    };

    render();
    const fallbackTimer = setTimeout(render, 500);
    return () => clearTimeout(fallbackTimer);
    
  }, [baseImgData, coverSrc, label, tapeColor, tapeOpacity, dominantColor, coverOffset, coverScale, coverRotation, tapeOffset, folderShape]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const filenameLabel = label.trim() === '' ? 'icona' : label;
    const link = document.createElement('a');
    link.download = `folder_${filenameLabel.replace(/\s+/g, '_').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-[#09090b] text-neutral-100 font-sans overflow-hidden">
      
      <span style={{ fontFamily: 'Space Mono', position: 'absolute', opacity: 0, pointerEvents: 'none' }}>.</span>

      <aside className="w-full lg:w-[400px] bg-[#121214] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col z-10 shrink-0 h-[45dvh] lg:h-full overflow-y-auto custom-scrollbar">
        <div className="p-6 lg:p-8 pb-4 lg:pb-6 border-b border-white/5 shrink-0">
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">Folder Icon Studio</h1>
          <p className="text-neutral-400 text-xs lg:text-sm mt-1">Crea icone macOS customizzate.</p>
        </div>

        <div className="p-6 lg:p-8 flex flex-col gap-6 lg:gap-8">
          
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-neutral-300 uppercase flex items-center gap-2">
                <LucideImage size={16} /> 1. Grafica
              </h2>
              {coverSrc && (
                <label 
                  className="relative flex items-center justify-center w-6 h-6 rounded-full border border-white/20 shadow-sm cursor-pointer overflow-hidden transition-transform hover:scale-110" 
                  title="Cambia colore base"
                >
                  <input 
                    type="color" 
                    value={dominantColor} 
                    onChange={(e) => setDominantColor(e.target.value)} 
                    className="absolute opacity-0 w-[200%] h-[200%] cursor-pointer"
                  />
                  <div className="w-full h-full pointer-events-none" style={{backgroundColor: dominantColor}}></div>
                </label>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs text-neutral-500 flex items-center gap-1">
                <LayoutTemplate size={14} /> Stile Cartella
              </label>
              <div className="flex gap-2">
                {Object.values(FOLDERS).map(shape => (
                  <button
                    key={shape.id}
                    onClick={() => setFolderShape(shape.id)}
                    className={`flex-1 py-2 px-1 text-xs font-medium rounded-lg border transition-all truncate ${folderShape === shape.id ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-[#09090b] border-neutral-700/50 text-neutral-400 hover:border-neutral-500'}`}
                  >
                    {shape.name}
                  </button>
                ))}
              </div>
            </div>
            
            <label className="flex flex-col items-center justify-center w-full h-36 px-4 transition-all bg-[#09090b] border border-neutral-700/50 border-dashed rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 group">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="p-3 bg-neutral-800 rounded-full group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                  <Upload size={20} className="text-neutral-400 group-hover:text-blue-400" />
                </div>
                <span className="font-medium text-sm text-neutral-300">Carica Immagine</span>
                <span className="text-xs text-neutral-500">JPG, PNG, WEBP</span>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>

            {coverSrc && (
              <div className="bg-[#09090b] p-4 rounded-xl border border-neutral-800/50 space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                    <span className="flex items-center gap-1"><ZoomIn size={14}/> Zoom</span>
                    <span>{Math.round(coverScale * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2.5" 
                    step="0.05" 
                    value={coverScale} 
                    onChange={(e) => setCoverScale(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                    <span className="flex items-center gap-1"><RotateCw size={14}/> Rotazione</span>
                    <span>{coverRotation}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="-180" 
                    max="180" 
                    step="1" 
                    value={coverRotation} 
                    onChange={(e) => setCoverRotation(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            )}
          </section>

          <hr className="border-white/5" />

          <section className="space-y-4">
            <h2 className="text-sm font-semibold tracking-wide text-neutral-300 uppercase flex items-center gap-2">
              <Type size={16} /> 2. Etichetta
            </h2>
            
            <div className="space-y-2">
              <label className="text-xs text-neutral-500">Testo (lascia vuoto per nascondere)</label>
              <input 
                type="text" 
                value={label}
                maxLength={30}
                onChange={(e) => setLabel(e.target.value.toUpperCase())}
                className="w-full bg-[#09090b] border border-neutral-700/50 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none font-mono uppercase transition-all"
                placeholder="ES. PROGETTO X"
              />
            </div>

            {label.trim() !== '' && (
              <>
                <div className="space-y-2 pt-2">
                  <label className="text-xs text-neutral-500 flex items-center gap-1">
                    <Palette size={14} /> Colore Nastro
                  </label>
                  <div className="flex gap-3">
                    {TAPE_COLORS.map(color => (
                      <button
                        key={color.id}
                        onClick={() => setTapeColor(color.hex)}
                        className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${tapeColor === color.hex ? 'border-blue-500 scale-110' : 'border-transparent hover:scale-105'}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {tapeColor === color.hex && <Check size={14} className={color.id === 'white' || color.id === 'vintage' ? 'text-black' : 'text-white'} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                    <span className="flex items-center gap-1"><Droplet size={14}/> Opacità Nastro</span>
                    <span>{Math.round(tapeOpacity * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1" 
                    step="0.05" 
                    value={tapeOpacity} 
                    onChange={(e) => setTapeOpacity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </>
            )}
          </section>

        </div>

        <div className="mt-auto p-6 lg:p-8 pt-4 border-t border-white/5 bg-[#121214] shrink-0">
          <button 
            onClick={handleDownload}
            className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-medium py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 mb-6"
          >
            <Download size={18} /> Scarica PNG (1024x1024)
          </button>

          <div className="flex flex-col items-center gap-3 pt-6 border-t border-white/5">
            <span className="text-[10px] text-neutral-500 font-semibold tracking-widest uppercase">Creato da Antonello</span>
            <div className="flex items-center gap-5 text-neutral-400">
              <a href="https://x.com/antonello23" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="X / Twitter">
                <IconX size={16} />
              </a>
              <a href="https://www.instagram.com/antonelloan23/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Instagram">
                <IconInstagram size={16} />
              </a>
              <a href="https://buymeacoffee.com/antonello23" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Buy me a coffee">
                <Coffee size={16} />
              </a>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 relative flex flex-col items-center justify-center min-h-0 overflow-hidden bg-dot-pattern p-4 md:p-8">
        
        <style dangerouslySetInnerHTML={{__html: `
          .bg-dot-pattern {
            background-color: #09090b;
            background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
            background-size: 24px 24px;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
        `}} />

        <div className="relative group w-full h-full flex items-center justify-center max-w-4xl" style={{ touchAction: 'none' }}>
          
          {(coverSrc || label.trim() !== '') && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-neutral-800/80 backdrop-blur text-neutral-300 text-xs px-3 py-1.5 rounded-full pointer-events-none border border-white/10 z-20">
              <Move size={12} /> Clicca e trascina per posizionare
            </div>
          )}

          <canvas 
            ref={canvasRef} 
            width={1024} 
            height={1024} 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`max-w-full max-h-full aspect-square object-contain drop-shadow-2xl transition-cursor ${dragging ? 'cursor-grabbing' : (coverSrc ? 'cursor-grab' : 'cursor-default')}`}
          />
        </div>

      </main>
    </div>
  );
}
