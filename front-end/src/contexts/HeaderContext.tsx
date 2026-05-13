import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";

interface Breadcrumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface HeaderData {
  title?: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  extra?: React.ReactNode;
}

// ── External Store for Header State ───────────────────────────────────────────
// This store lives outside the React component tree to avoid triggering
// full layout re-renders when only the header needs to update.

type Listener = () => void;
let currentHeaderData: HeaderData = {};
let listeners: Listener[] = [];

const headerStore = {
  subscribe(listener: Listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot() {
    return currentHeaderData;
  },
  setData(newData: HeaderData) {
    currentHeaderData = newData;
    listeners.forEach((l) => l());
  },
};

// ── Contexts ──────────────────────────────────────────────────────────────────
// We still use context to provide the dispatch function, but the state
// is now consumed via the subscription.

const HeaderDispatchContext = createContext<((data: HeaderData) => void) | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const setHeader = (newData: HeaderData) => {
    headerStore.setData(newData);
  };

  return (
    <HeaderDispatchContext.Provider value={setHeader}>
      {children}
    </HeaderDispatchContext.Provider>
  );
}

/**
 * useHeader — gets the current header state. Used in Layouts.
 * 
 * Uses useSyncExternalStore to subscribe to the header store.
 * Only components calling this hook will re-render when the header updates.
 */
export function useHeader() {
  return useSyncExternalStore(
    headerStore.subscribe,
    headerStore.getSnapshot
  );
}

/**
 * useSetHeader — sets the page header. Used in Pages.
 * 
 * This hook ONLY consumes the dispatch context, so it doesn't subscribe
 * to header updates. Calling it will NEVER cause the calling component
 * to re-render, fundamentally preventing infinite loops.
 */
export function useSetHeader(data: HeaderData | undefined) {
  const dispatch = useContext(HeaderDispatchContext);
  if (dispatch === undefined) {
    throw new Error("useSetHeader must be used within a HeaderProvider");
  }

  useEffect(() => {
    if (!data) return;
    dispatch(data);
  }, [data, dispatch]);
}
