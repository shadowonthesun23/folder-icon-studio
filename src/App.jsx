import { useState, useEffect, useRef } from 'react';
import { Upload, Download, Type, Image as LucideImage, ZoomIn, Palette, Check, Move, RotateCw, Droplet, Coffee } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

const FOLDERS = {
  classic: {
    id: 'classic',
    name: 'Classica',
    tintFolder: true,
    svg: "<svg width='1024' height='1024' version='1.1' viewBox='0 0 16.933 16.933' xmlns='http://www.w3.org/2000/svg'><defs><filter id='filter9' x='-.0065174' y='-.075603' width='1.013' height='1.1512' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='0.041672346'/></filter><filter id='filter11' x='-.0069629' y='-.043386' width='1.0139' height='1.0868' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='0.044522292'/></filter><filter id='filter12' x='-.03226' y='-.045842' width='1.0645' height='1.0917' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='0.13691812'/></filter><linearGradient id='a' x1='8.466' x2='8.466' y1='12.7' y2='2.381' gradientUnits='userSpaceOnUse'><stop offset='0'/><stop stop-opacity='0' offset='1'/></linearGradient><linearGradient id='c' x1='8.467' x2='8.467' y1='4.498' y2='14.552' gradientUnits='userSpaceOnUse'><stop stop-color='#fff' offset='0'/><stop offset='1'/></linearGradient></defs><g id='folder'><path d='m1.945 2.381h2.965c0.75 0 0.904 0.084 1.27 0.63 0.297 0.441 0.84 0.429 1.756 0.429h7.05a1.146 1.146 0 0 1 1.152 1.152v6.956a1.15 1.15 0 0 1-1.152 1.152h-13.042a1.15 1.15 0 0 1-1.15-1.152v-8.015a1.15 1.15 0 0 1 1.15-1.152z' fill='#686868'/><path d='m1.945 2.381h2.965c0.75 0 0.904 0.084 1.27 0.63 0.297 0.441 0.84 0.429 1.756 0.429h7.05a1.146 1.146 0 0 1 1.152 1.152v6.956a1.15 1.15 0 0 1-1.152 1.152h-13.042a1.15 1.15 0 0 1-1.15-1.152v-8.015a1.15 1.15 0 0 1 1.15-1.152z' fill='url(#a)'/><rect x='1.3229' y='3.9687' width='14.287' height='10.054' rx='.52916' ry='.52916' fill='none' filter='url(#filter12)' opacity='.1' stroke='#000000' stroke-width='.26458'/><rect x='1.3229' y='3.9687' width='14.287' height='10.054' rx='.52916' ry='.52916' fill='#ffffff' stroke-width='.9649'/><rect x='.794' y='4.498' width='15.346' height='10.054' rx='1.058' ry='1.058' fill='#686868'/><rect x='.793' y='4.498' width='15.346' height='10.054' rx='1.058' ry='1.058' fill='url(#c)' opacity='.15'/><path d='m1.852 4.4978c-0.5863 0-1.0583 0.47201-1.0583 1.0583v0.26458c0-0.5863 0.47201-1.0583 1.0583-1.0583h13.229c0.5863 0 1.0583 0.47201 1.0583 1.0583v-0.26458c0-0.5863-0.47201-1.0583-1.0583-1.0583z' fill='#ffffff' filter='url(#filter9)' opacity='.15'/><path transform='matrix(1,0,0,-1,0,19.05)' d='m1.852 4.4978c-0.5863 0-1.0583 0.47201-1.0583 1.0583v0.26458c0-0.5863 0.47201-1.0583 1.0583-1.0583h13.229c0.5863 0 1.0583 0.47201 1.0583 1.0583v-0.26458c0-0.5863-0.47201-1.0583-1.0583-1.0583z' fill='#000000' filter='url(#filter9)' opacity='.1'/><path d='m1.944 2.3812c-0.6363-6e-4 -1.1519 0.51554-1.1508 1.1518v0.26044c0.001104-0.63442 0.51587-1.1483 1.1508-1.1477h2.9672c0.75 0 0.90392 0.083623 1.2707 0.62992 0.2962 0.44122 0.83942 0.42839 1.7554 0.42839h7.0501c0.63356-0.00333 1.1486 0.50792 1.1518 1.14v-0.25269c0.0033-0.63761-0.51424-1.1552-1.1518-1.1518h-7.0501c-0.91599 0-1.4592 0.012831-1.7554-0.42839-0.36678-0.5463-0.5207-0.62992-1.2707-0.62992h-2.9672z' fill='#ffffff' filter='url(#filter11)' opacity='.25'/></g></svg>",
    getFolderRect: (cw, ch) => ({ x: 0, y: 0, w: cw, h: ch }),
    clipRect: { x: 0.794, y: 4.498, w: 15.346, h: 10.054, vw: 16.933, vh: 16.933 },
    buildFlapPath: (ctx, rect) => {
      const sX = rect.w / 16.933;
      const sY = rect.h / 16.933;
      const x = rect.x + 0.794 * sX;
      const y = rect.y + 4.498 * sY;
      const width = 15.346 * sX;
      const height = 10.054 * sY;
      const r = 1.058 * Math.min(sX, sY);
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
    tintFolder: false,
    svg: "<svg xmlns='http://www.w3.org/2000/svg' width='241' height='180' viewBox='0 0 241 180' fill='none'><g filter='url(#f0)'><path d='M226.745 23.9374V142.139C226.745 145.877 223.715 148.907 219.977 148.907H20.3055C16.5674 148.907 13.537 145.877 13.537 142.139V6.76851C13.537 3.03036 16.5674 0 20.3055 0H85.1799C89.1801 0 93.0508 1.4171 96.1054 3.99982L109.788 15.569C111.01 16.6021 112.558 17.1689 114.158 17.1689H219.977C223.715 17.1689 226.745 20.1993 226.745 23.9374Z' fill='url(#g0)'/></g><g filter='url(#f1)'><path d='M13.537 40.8587V159.06C13.537 162.798 16.5674 165.828 20.3055 165.828H219.977C223.715 165.828 226.745 162.798 226.745 159.06V30.4583C226.745 26.7201 223.715 23.6898 219.977 23.6898H118.211C113.919 23.6898 109.688 24.7101 105.868 26.6667L97.187 31.1132C93.367 33.0698 89.1366 34.0901 84.8447 34.0901H20.3055C16.5674 34.0901 13.537 37.1205 13.537 40.8587Z' fill='url(#g1)'/></g><defs><filter id='f0' x='13' y='-4' width='215' height='156' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'><feFlood flood-opacity='0' result='bg'/><feBlend in='SourceGraphic' in2='bg' result='shape'/><feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='alpha'/><feOffset dy='1.7'/><feGaussianBlur stdDeviation='1.7'/><feComposite in2='alpha'/><feColorMatrix values='0 0 0 0 0.94 0 0 0 0 0.84 0 0 0 0 0.3 0 0 0 1 0'/><feBlend in2='shape' result='s1'/><feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='alpha2'/><feOffset dy='-3.4'/><feGaussianBlur stdDeviation='1.7'/><feComposite in2='alpha2'/><feColorMatrix values='0 0 0 0 0.81 0 0 0 0 0.52 0 0 0 0 0.2 0 0 0 1 0'/><feBlend in2='s1'/></filter><filter id='f1' x='0' y='10' width='241' height='170' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'><feFlood flood-opacity='0' result='bg'/><feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='alpha'/><feOffset/><feGaussianBlur stdDeviation='6.8'/><feComposite in2='alpha'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'/><feBlend in2='bg' result='shadow'/><feBlend in='SourceGraphic' in2='shadow' result='shape'/><feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='alpha3'/><feOffset dy='1.7'/><feGaussianBlur stdDeviation='3.4'/><feComposite in2='alpha3'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 0.975 0 0 0 0 0.733 0 0 0 1 0'/><feBlend in2='shape' result='s2'/><feColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='alpha4'/><feOffset dy='-3.4'/><feGaussianBlur stdDeviation='1.7'/><feComposite in2='alpha4'/><feColorMatrix values='0 0 0 0 0.81 0 0 0 0 0.52 0 0 0 0 0.2 0 0 0 1 0'/><feBlend in2='s2'/></filter><linearGradient id='g0' x1='82.9' y1='6.8' x2='84.6' y2='37.2' gradientUnits='userSpaceOnUse'><stop offset='0.04' stop-color='#E1AE40'/><stop offset='1' stop-color='#ECAB3F'/></linearGradient><linearGradient id='g1' x1='120' y1='23.7' x2='120' y2='165.8' gradientUnits='userSpaceOnUse'><stop stop-color='#F8D555'/><stop offset='1' stop-color='#E0A53F'/></linearGradient></defs></svg>",
    getFolderRect: (cw, ch) => {
      const fh = Math.round(cw * 180 / 241);
      return { x: 0, y: Math.round((ch - fh) / 2), w: cw, h: fh };
    },
    clipRect: { x: 13.537, y: 23.6898, w: 213.208, h: 142.138, vw: 241, vh: 180 },
    buildFlapPath: (ctx, rect) => {
      const sX = rect.w / 241;
      const sY = rect.h / 180;
      const oX = rect.x;
      const oY = rect.y;
      ctx.beginPath();
      ctx.moveTo(oX + 13.537 * sX, oY + 40.8587 * sY);
      ctx.lineTo(oX + 13.537 * sX, oY + 159.06 * sY);
      ctx.bezierCurveTo(oX + 13.537 * sX, oY + 162.798 * sY, oX + 16.5674 * sX, oY + 165.828 * sY, oX + 20.3055 * sX, oY + 165.828 * sY);
      ctx.lineTo(oX + 219.977 * sX, oY + 165.828 * sY);
      ctx.bezierCurveTo(oX + 223.715 * sX, oY + 165.828 * sY, oX + 226.745 * sX, oY + 162.798 * sY, oX + 226.745 * sX, oY + 159.06 * sY);
      ctx.lineTo(oX + 226.745 * sX, oY + 30.4583 * sY);
      ctx.bezierCurveTo(oX + 226.745 * sX, oY + 26.7201 * sY, oX + 223.715 * sX, oY + 23.6898 * sY, oX + 219.977 * sX, oY + 23.6898 * sY);
      ctx.lineTo(oX + 118.211 * sX, oY + 23.6898 * sY);
      ctx.bezierCurveTo(oX + 113.919 * sX, oY + 23.6898 * sY, oX + 109.688 * sX, oY + 24.7101 * sY, oX + 105.868 * sX, oY + 26.6667 * sY);
      ctx.lineTo(oX + 97.187 * sX, oY + 31.1132 * sY);
      ctx.bezierCurveTo(oX + 93.367 * sX, oY + 33.0698 * sY, oX + 89.1366 * sX, oY + 34.0901 * sY, oX + 84.8447 * sX, oY + 34.0901 * sY);
      ctx.lineTo(oX + 20.3055 * sX, oY + 34.0901 * sY);
      ctx.bezierCurveTo(oX + 16.5674 * sX, oY + 34.0901 * sY, oX + 13.537 * sX, oY + 37.1205 * sY, oX + 13.537 * sX, oY + 40.8587 * sY);
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

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

const loadSvgAsImage = (svgString) => new Promise((resolve, reject) => {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG load failed')); };
  img.src = url;
});

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
  while (ctx.measureText(text).width > tapeW * 0.8 && fontSize > 10) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px "Space Mono", monospace, sans-serif`;
  }
  ctx.fillText(text, x + tapeW / 2, y + tapeH / 2);
  ctx.restore();
};

const IconX = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4l11.733 16h4.267L8.267 4z" />
    <path d="M4 20l6.768-6.768m2.46-2.46L20 4" />
  </svg>
);

const IconInstagram = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
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
  const folderShape = 'classic';
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
    setBaseImgData(null);
    loadSvgAsImage(shape.svg)
      .then(img => setBaseImgData(img))
      .catch(err => console.error('Folder load error:', err));
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
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = 64; c.height = 64;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, 64, 64);
        const data = ctx.getImageData(0, 0, 64, 64).data;
        let r = 0, g = 0, b = 0;
        const n = data.length / 4;
        for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i+1]; b += data[i+2]; }
        setDominantColor(rgbToHex(Math.round(r/n), Math.round(g/n), Math.round(b/n)));
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
    const clientX = e.clientX;
    const clientY = e.clientY;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const tapeW = canvas.width * 0.55;
    const tapeH = canvas.height * 0.12;
    const tX = canvas.width / 2 - tapeW / 2 + tapeOffset.x;
    const tY = canvas.height * 0.55 - tapeH / 2 + tapeOffset.y;
    if (label.trim() !== '' && x >= tX && x <= tX + tapeW && y >= tY && y <= tY + tapeH) {
      setDragging('tape');
    } else if (coverSrc) {
      setDragging('cover');
    }
    setDragStartPos({ x: clientX, y: clientY });
    if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const dx = (e.clientX - dragStartPos.x) * scaleX;
    const dy = (e.clientY - dragStartPos.y) * scaleY;
    if (dragging === 'tape') setTapeOffset(p => ({ x: p.x + dx, y: p.y + dy }));
    else if (dragging === 'cover') setCoverOffset(p => ({ x: p.x + dx, y: p.y + dy }));
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e) => {
    setDragging(null);
    if (e.target.releasePointerCapture) e.target.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !baseImgData) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    const render = async () => {
      ctx.clearRect(0, 0, w, h);
      const shape = FOLDERS[folderShape];
      const folderRect = shape.getFolderRect(w, h);

      ctx.save();
      ctx.drawImage(baseImgData, folderRect.x, folderRect.y, folderRect.w, folderRect.h);

      if (coverSrc && shape.tintFolder) {
        ctx.globalCompositeOperation = 'color';
        ctx.fillStyle = dominantColor;
        ctx.fillRect(folderRect.x, folderRect.y, folderRect.w, folderRect.h);
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(baseImgData, folderRect.x, folderRect.y, folderRect.w, folderRect.h);
      }
      ctx.restore();

      if (coverSrc) {
        const coverImg = await new Promise(res => {
          const img = new Image();
          img.onload = () => res(img);
          img.src = coverSrc;
        });

        ctx.save();
        shape.buildFlapPath(ctx, folderRect);
        ctx.clip();

        const { clipRect } = shape;
        const rectX = folderRect.x + clipRect.x * (folderRect.w / clipRect.vw);
        const rectY = folderRect.y + clipRect.y * (folderRect.h / clipRect.vh);
        const rectW = clipRect.w * (folderRect.w / clipRect.vw);
        const rectH = clipRect.h * (folderRect.h / clipRect.vh);

        const imgRatio = coverImg.width / coverImg.height;
        const canvasRatio = rectW / rectH;
        let drawW, drawH;
        if (imgRatio > canvasRatio) { drawH = rectH * coverScale; drawW = drawH * imgRatio; }
        else { drawW = rectW * coverScale; drawH = drawW / imgRatio; }
        const drawX = rectX + (rectW - drawW) / 2 + coverOffset.x;
        const drawY = rectY + (rectH - drawH) / 2 + coverOffset.y;

        ctx.save();
        ctx.translate(drawX + drawW / 2, drawY + drawH / 2);
        ctx.rotate((coverRotation * Math.PI) / 180);
        ctx.translate(-(drawX + drawW / 2), -(drawY + drawH / 2));
        ctx.drawImage(coverImg, drawX, drawY, drawW, drawH);
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
    const t = setTimeout(render, 300);
    return () => clearTimeout(t);
  }, [baseImgData, coverSrc, label, tapeColor, tapeOpacity, dominantColor, coverOffset, coverScale, coverRotation, tapeOffset, folderShape]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const name = label.trim() === '' ? 'icona' : label;
    const link = document.createElement('a');
    link.download = `folder_${name.replace(/\s+/g, '_').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-[#09090b] text-neutral-100 font-sans overflow-hidden">
      <span style={{ fontFamily: 'Space Mono', position: 'absolute', opacity: 0, pointerEvents: 'none' }}>.</span>

      <aside className="w-full lg:w-[400px] bg-[#121214] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col z-10 shrink-0 h-[45dvh] lg:h-full overflow-y-auto custom-scrollbar">
        <div className="p-6 lg:p-8 pb-4 lg:pb-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Folder Icon Studio" className="w-8 h-8 lg:w-10 lg:h-10 object-contain shrink-0" />
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">Folder Icon Studio</h1>
          </div>
          <p className="text-neutral-400 text-xs lg:text-sm mt-1">Crea icone macOS customizzate.</p>
        </div>

        <div className="p-6 lg:p-8 flex flex-col gap-6 lg:gap-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-neutral-300 uppercase flex items-center gap-2">
                <LucideImage size={16} /> 1. Grafica
              </h2>
              {coverSrc && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-500">Sfondo retro</span>
                  <label className="relative flex items-center justify-center w-6 h-6 rounded-full border border-white/20 shadow-sm cursor-pointer overflow-hidden transition-transform hover:scale-110" title="Colore sfondo retro cartella">
                    <input type="color" value={dominantColor} onChange={e => setDominantColor(e.target.value)} className="absolute opacity-0 w-[200%] h-[200%] cursor-pointer" />
                    <div className="w-full h-full pointer-events-none" style={{ backgroundColor: dominantColor }} />
                  </label>
                </div>
              )}
            </div>

            <label className="flex flex-col items-center justify-center w-full h-36 px-4 transition-all bg-[#09090b] border border-neutral-700/50 border-dashed rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 group">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="p-3 bg-neutral-800 rounded-full group-hover:bg-blue-500/20 transition-colors">
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
                    <span className="flex items-center gap-1"><ZoomIn size={14} /> Zoom</span>
                    <span>{Math.round(coverScale * 100)}%</span>
                  </div>
                  <input type="range" min="0.5" max="2.5" step="0.05" value={coverScale} onChange={e => setCoverScale(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                    <span className="flex items-center gap-1"><RotateCw size={14} /> Rotazione</span>
                    <span>{coverRotation}°</span>
                  </div>
                  <input type="range" min="-180" max="180" step="1" value={coverRotation} onChange={e => setCoverRotation(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
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
              <input type="text" value={label} maxLength={30} onChange={e => setLabel(e.target.value.toUpperCase())}
                className="w-full bg-[#09090b] border border-neutral-700/50 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none font-mono uppercase transition-all"
                placeholder="ES. PROGETTO X" />
            </div>
            {label.trim() !== '' && (
              <>
                <div className="space-y-2 pt-2">
                  <label className="text-xs text-neutral-500 flex items-center gap-1"><Palette size={14} /> Colore Nastro</label>
                  <div className="flex gap-3">
                    {TAPE_COLORS.map(color => (
                      <button key={color.id} onClick={() => setTapeColor(color.hex)}
                        className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                          tapeColor === color.hex ? 'border-blue-500 scale-110' : 'border-transparent hover:scale-105'
                        }`} style={{ backgroundColor: color.hex }} title={color.name}>
                        {tapeColor === color.hex && <Check size={14} className={color.id === 'white' || color.id === 'vintage' ? 'text-black' : 'text-white'} />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-xs text-neutral-400 mb-2">
                    <span className="flex items-center gap-1"><Droplet size={14} /> Opacità Nastro</span>
                    <span>{Math.round(tapeOpacity * 100)}%</span>
                  </div>
                  <input type="range" min="0.1" max="1" step="0.05" value={tapeOpacity} onChange={e => setTapeOpacity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
              </>
            )}
          </section>
        </div>

        <div className="mt-auto p-6 lg:p-8 pt-4 border-t border-white/5 bg-[#121214] shrink-0">
          <button onClick={handleDownload} className="liquid-glass-btn w-full font-medium py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 mb-6">
            <Download size={18} /> Scarica PNG (1024x1024)
          </button>
          <div className="flex flex-col items-center gap-3 pt-6 border-t border-white/5">
            <span className="text-[10px] text-neutral-500 font-mono tracking-widest lowercase">made with love by antonello :)</span>
            <div className="flex items-center gap-5 text-neutral-400">
              <a href="https://x.com/antonello23" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><IconX size={16} /></a>
              <a href="https://www.instagram.com/antonelloan23/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><IconInstagram size={16} /></a>
              <a href="https://buymeacoffee.com/antonello23" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Coffee size={16} /></a>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 relative flex flex-col items-center justify-center min-h-0 overflow-hidden bg-dot-pattern p-4 md:p-8">
        <style dangerouslySetInnerHTML={{__html: `
          .bg-dot-pattern { background-color: #09090b; background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 24px 24px; }
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.1); border-radius: 10px; }

          .liquid-glass-btn {
            position: relative;
            overflow: hidden;
            color: rgba(255,255,255,0.92);
            font-weight: 500;
            background: linear-gradient(145deg,
              rgba(255,255,255,0.13) 0%,
              rgba(255,255,255,0.05) 50%,
              rgba(255,255,255,0.10) 100%
            );
            border: 1px solid rgba(255,255,255,0.18);
            box-shadow:
              0 2px 0 rgba(255,255,255,0.12) inset,
              0 -1px 0 rgba(0,0,0,0.25) inset,
              0 8px 32px rgba(0,0,0,0.35),
              0 1px 8px rgba(255,255,255,0.04);
            backdrop-filter: blur(12px) saturate(160%);
            -webkit-backdrop-filter: blur(12px) saturate(160%);
            transition: all 0.2s ease;
            text-shadow: 0 1px 3px rgba(0,0,0,0.4);
          }
          .liquid-glass-btn::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 50%;
            background: linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%);
            border-radius: inherit;
            pointer-events: none;
          }
          .liquid-glass-btn::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%);
            pointer-events: none;
          }
          .liquid-glass-btn:hover {
            background: linear-gradient(145deg,
              rgba(255,255,255,0.20) 0%,
              rgba(255,255,255,0.09) 50%,
              rgba(255,255,255,0.15) 100%
            );
            border-color: rgba(255,255,255,0.28);
            box-shadow:
              0 2px 0 rgba(255,255,255,0.16) inset,
              0 -1px 0 rgba(0,0,0,0.25) inset,
              0 12px 40px rgba(0,0,0,0.4),
              0 1px 12px rgba(255,255,255,0.06);
          }
          .liquid-glass-btn:active {
            transform: scale(0.98);
            box-shadow:
              0 1px 0 rgba(255,255,255,0.08) inset,
              0 -1px 0 rgba(0,0,0,0.25) inset,
              0 4px 16px rgba(0,0,0,0.3);
          }
        `}} />
        <div className="relative group w-full h-full flex items-center justify-center max-w-4xl" style={{ touchAction: 'none' }}>
          {(coverSrc || label.trim() !== '') && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-neutral-800/80 backdrop-blur text-neutral-300 text-xs px-3 py-1.5 rounded-full pointer-events-none border border-white/10 z-20">
              <Move size={12} /> Clicca e trascina per posizionare
            </div>
          )}
          <canvas ref={canvasRef} width={1024} height={1024}
            onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}
            className={`max-w-full max-h-full aspect-square object-contain drop-shadow-2xl ${
              dragging ? 'cursor-grabbing' : (coverSrc ? 'cursor-grab' : 'cursor-default')
            }`} />
        </div>
      </main>
      <Analytics />
    </div>
  );
}
