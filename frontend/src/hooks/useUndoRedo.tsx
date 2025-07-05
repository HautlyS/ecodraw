import { useState, useCallback, useRef } from 'react';

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

interface UndoRedoActions {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  set: (newState: any) => void;
  reset: (initialState: any) => void;
  clear: () => void;
}

interface UndoRedoOptions {
  maxHistorySize?: number;
  debounceMs?: number;
  ignoreIdenticalStates?: boolean;
}

export function useUndoRedo<T>(
  initialState: T,
  options: UndoRedoOptions = {}
): [T, UndoRedoActions] {
  const {
    maxHistorySize = 50,
    debounceMs = 500,
    ignoreIdenticalStates = true,
  } = options;

  const [state, setState] = useState<UndoRedoState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingStateRef = useRef<T | null>(null);

  const addToHistory = useCallback((newState: T) => {
    setState(currentState => {
      // Ignore identical states if option is enabled
      if (ignoreIdenticalStates && JSON.stringify(currentState.present) === JSON.stringify(newState)) {
        return currentState;
      }

      const newPast = [...currentState.past, currentState.present];
      
      // Limit history size
      if (newPast.length > maxHistorySize) {
        newPast.shift();
      }

      return {
        past: newPast,
        present: newState,
        future: [], // Clear future when new state is added
      };
    });
  }, [maxHistorySize, ignoreIdenticalStates]);

  const set = useCallback((newState: T) => {
    if (debounceMs > 0) {
      // Store the new state temporarily
      pendingStateRef.current = newState;
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        if (pendingStateRef.current !== null) {
          addToHistory(pendingStateRef.current);
          pendingStateRef.current = null;
        }
      }, debounceMs);
      
      // Update present state immediately for UI responsiveness
      setState(currentState => ({
        ...currentState,
        present: newState,
      }));
    } else {
      addToHistory(newState);
    }
  }, [debounceMs, addToHistory]);

  const undo = useCallback(() => {
    setState(currentState => {
      if (currentState.past.length === 0) {
        return currentState;
      }

      const previous = currentState.past[currentState.past.length - 1];
      const newPast = currentState.past.slice(0, currentState.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [currentState.present, ...currentState.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(currentState => {
      if (currentState.future.length === 0) {
        return currentState;
      }

      const next = currentState.future[0];
      const newFuture = currentState.future.slice(1);

      return {
        past: [...currentState.past, currentState.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((newInitialState: T) => {
    setState({
      past: [],
      present: newInitialState,
      future: [],
    });
  }, []);

  const clear = useCallback(() => {
    setState(currentState => ({
      past: [],
      present: currentState.present,
      future: [],
    }));
  }, []);

  // Cleanup timeout on unmount
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Auto-cleanup effect would go here if this were used in a component
  // For now, we'll rely on the consuming component to call cleanup if needed

  const actions: UndoRedoActions = {
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    undo,
    redo,
    set,
    reset,
    clear,
  };

  return [state.present, actions];
}

// Hook for managing canvas state with undo/redo
export function useCanvasHistory<T>(initialElements: T[], options?: UndoRedoOptions) {
  const [elements, actions] = useUndoRedo(initialElements, options);

  const addElement = useCallback((element: T) => {
    actions.set([...elements, element]);
  }, [elements, actions]);

  const removeElement = useCallback((predicate: (element: T) => boolean) => {
    actions.set(elements.filter(el => !predicate(el)));
  }, [elements, actions]);

  const updateElement = useCallback((predicate: (element: T) => boolean, updater: (element: T) => T) => {
    actions.set(elements.map(el => predicate(el) ? updater(el) : el));
  }, [elements, actions]);

  const replaceElements = useCallback((newElements: T[]) => {
    actions.set(newElements);
  }, [actions]);

  return {
    elements,
    addElement,
    removeElement,
    updateElement,
    replaceElements,
    ...actions,
  };
}