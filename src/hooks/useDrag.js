import { useRef, useCallback } from 'react';

export const useDrag = ({ canvasRef, coverSrc, label, labelStyle, tapeScale, tapeOffset, badgeOffset, badgeSize, setTapeOffset, setBadgeOffset, setCoverOffset, onDragEnd }) => {
  const draggingRef = useRef(null);
  const dragStartPosRef = useRef({ x: 0, y: 0 });

  const updateCursor = useCallback((isDragging) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.cursor = isDragging ? 'grabbing' : coverSrc ? 'grab' : 'default';
  }, [canvasRef, coverSrc]);

  const handlePointerDown = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (labelStyle === 'dymo') {
      const tapeW = canvas.width * 0.55 * tapeScale;
      const tapeH = canvas.height * 0.12 * tapeScale;
      const tX = canvas.width / 2 - tapeW / 2 + tapeOffset.x;
      const tY = canvas.height * 0.55 - tapeH / 2 + tapeOffset.y;
      if (label.trim() !== '' && x >= tX && x <= tX + tapeW && y >= tY && y <= tY + tapeH) {
        draggingRef.current = 'tape';
      } else if (coverSrc) {
        draggingRef.current = 'cover';
      }
    } else if (labelStyle === 'badge') {
      const bcx = canvas.width / 2 + badgeOffset.x;
      const bcy = canvas.height * 0.72 + badgeOffset.y;
      const dist = Math.sqrt((x - bcx) ** 2 + (y - bcy) ** 2);
      if (label.trim() !== '' && dist <= badgeSize) {
        draggingRef.current = 'badge';
      } else if (coverSrc) {
        draggingRef.current = 'cover';
      }
    } else if (coverSrc) {
      draggingRef.current = 'cover';
    }

    if (draggingRef.current) updateCursor(true);
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId);
  }, [canvasRef, coverSrc, label, labelStyle, tapeScale, tapeOffset, badgeOffset, badgeSize, updateCursor]);

  const handlePointerMove = useCallback((e) => {
    if (!draggingRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const dx = (e.clientX - dragStartPosRef.current.x) * scaleX;
    const dy = (e.clientY - dragStartPosRef.current.y) * scaleY;

    if (draggingRef.current === 'tape') setTapeOffset(p => ({ x: p.x + dx, y: p.y + dy }));
    else if (draggingRef.current === 'badge') setBadgeOffset(p => ({ x: p.x + dx, y: p.y + dy }));
    else if (draggingRef.current === 'cover') setCoverOffset(p => ({ x: p.x + dx, y: p.y + dy }));

    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
  }, [canvasRef, setTapeOffset, setBadgeOffset, setCoverOffset]);

  const handlePointerUp = useCallback((e) => {
    const wasTarget = draggingRef.current;
    draggingRef.current = null;
    updateCursor(false);
    if (e.target.releasePointerCapture) e.target.releasePointerCapture(e.pointerId);
    if (wasTarget) requestAnimationFrame(() => onDragEnd());
  }, [updateCursor, onDragEnd]);

  return { handlePointerDown, handlePointerMove, handlePointerUp, updateCursor };
};
