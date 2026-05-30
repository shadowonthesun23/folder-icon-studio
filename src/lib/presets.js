export const LS_PRESETS_KEY = 'fis_presets';
export const HISTORY_CAP = 50;

export const loadPresetsFromStorage = () => {
  try {
    const raw = localStorage.getItem(LS_PRESETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const savePresetsToStorage = (presets) => {
  try {
    localStorage.setItem(LS_PRESETS_KEY, JSON.stringify(presets));
  } catch {
    // Ignore storage quota and private browsing failures.
  }
};

export const makeSnapshot = (s) => ({ ...s });

export const captureThumbnail = (canvas) => {
  if (!canvas) return null;
  try {
    const thumb = document.createElement('canvas');
    thumb.width = 48; thumb.height = 48;
    const ctx = thumb.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, 48, 48);
    return thumb.toDataURL('image/png');
  } catch {
    return null;
  }
};
