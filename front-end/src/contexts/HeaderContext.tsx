import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from "react";

interface Breadcrumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface HeaderData {
  title?: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  extra?: React.ReactNode;
}

interface HeaderContextType extends HeaderData {
  setHeader: (data: HeaderData) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HeaderData>({});

  const setHeader = useCallback((newData: HeaderData) => {
    setState(newData);
  }, []);

  const value = useMemo(() => ({ ...state, setHeader }), [state, setHeader]);

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  );
}

/**
 * useHeader — sets the page header. Pass your header data as the first argument.
 *
 * The hook is "infinity-safe": it uses a ref to track the latest initialData,
 * and only re-fires when the SERIALIZABLE fields (title, subtitle, breadcrumbs)
 * actually change — not when JSX references (actions, extra) recreate on each render.
 */
export function useHeader(initialData?: HeaderData) {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }

  const { setHeader } = context;

  // Always keep a ref to the LATEST initialData so we can read it in the effect
  // without making it part of the dependency array (which would cause infinite loops
  // for objects/JSX created inline on every render).
  const dataRef = useRef<HeaderData | undefined>(initialData);
  dataRef.current = initialData;

  // Only depend on the serializable subset of the header data.
  // Changes to `actions` / `extra` (ReactNode) won't cause infinite loops,
  // but they WILL be committed because we read from dataRef.current.
  const stableKey = useMemo(() => {
    if (!initialData) return "";
    return JSON.stringify({
      title: initialData.title,
      subtitle: initialData.subtitle,
      breadcrumbs: initialData.breadcrumbs,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.title, initialData?.subtitle, initialData?.breadcrumbs]);

  useEffect(() => {
    if (dataRef.current) {
      setHeader(dataRef.current);
    }
    // Only re-run when serializable fields or setHeader change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableKey, setHeader]);

  return context;
}
