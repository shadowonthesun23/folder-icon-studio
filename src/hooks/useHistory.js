import { useState, useRef, useCallback, useEffect } from 'react';
import { HISTORY_CAP, makeSnapshot } from '../lib/presets';

export const useHistory = (stateRef, applySnapshot) => {
  const [historyIndex, setHistoryIndex] = useState(0);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(0);
  const isRestoringRef = useRef(false);

  useEffect(() => {
    if (historyRef.current.length === 0) {
      historyRef.current = [makeSnapshot(stateRef.current)];
      historyIndexRef.current = 0;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushHistory = useCallback((snap) => {
    if (isRestoringRef.current) return;
    const stack = historyRef.current;
    const idx = historyIndexRef.current;
    const newStack = stack.slice(0, idx + 1);
    newStack.push(snap);
    if (newStack.length > HISTORY_CAP) newStack.shift();
    historyRef.current = newStack;
    historyIndexRef.current = newStack.length - 1;
    setHistoryIndex(newStack.length - 1);
  }, []);

  const undo = useCallback(() => {
    const idx = historyIndexRef.current;
    if (idx <= 0) return;
    const newIdx = idx - 1;
    historyIndexRef.current = newIdx;
    setHistoryIndex(newIdx);
    isRestoringRef.current = true;
    applySnapshot(historyRef.current[newIdx]);
    setTimeout(() => { isRestoringRef.current = false; }, 0);
  }, [applySnapshot]);

  const redo = useCallback(() => {
    const idx = historyIndexRef.current;
    const stack = historyRef.current;
    if (idx >= stack.length - 1) return;
    const newIdx = idx + 1;
    historyIndexRef.current = newIdx;
    setHistoryIndex(newIdx);
    isRestoringRef.current = true;
    applySnapshot(stack[newIdx]);
    setTimeout(() => { isRestoringRef.current = false; }, 0);
  }, [applySnapshot]);

  const getIsRestoring = () => isRestoringRef.current;

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyRef.current.length - 1;

  return { pushHistory, undo, redo, canUndo, canRedo, getIsRestoring };
};
