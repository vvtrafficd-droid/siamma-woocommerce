"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type ConsentState = {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
  timestamp?: string;
};

const STORAGE_KEY = "cookie_consent";

function readConsent(): ConsentState | null {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) return JSON.parse(raw);
  } catch {}
  try {
    if (typeof document !== "undefined") {
      const match = document.cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${STORAGE_KEY}=`));
      if (match) {
        const val = decodeURIComponent(match.split("=")[1] || "");
        return JSON.parse(val);
      }
    }
  } catch {}
  return null;
}

function writeConsent(state: ConsentState) {
  const payload = { ...state, timestamp: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
  try {
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(JSON.stringify(payload))}; path=/; SameSite=Lax`;
  } catch {}
  try {
    const event = new CustomEvent("cookie-consent-change", { detail: payload });
    document.dispatchEvent(event);
  } catch {}
}

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(() => !readConsent());
  const [expanded, setExpanded] = useState(false);
  const [state, setState] = useState<ConsentState>({
    necessary: true,
    preferences: false,
    statistics: false,
    marketing: false,
  });


  

  useEffect(() => {
    const open = () => setVisible(true);
    document.addEventListener("open-cookie-preferences", open);
    ;(window as any).openCookiePreferences = open;
    return () => {
      document.removeEventListener("open-cookie-preferences", open);
      delete (window as any).openCookiePreferences;
    };
  }, []);

  const acceptAll = () => {
    const next = { ...state, preferences: true, statistics: true, marketing: true };
    setVisible(false);
    setExpanded(false);
    setState(next);
    try { writeConsent(next); } catch {}
  };

  const rejectAll = () => {
    const next = { ...state, preferences: false, statistics: false, marketing: false };
    setVisible(false);
    setExpanded(false);
    setState(next);
    try { writeConsent(next); } catch {}
  };

  const save = () => {
    writeConsent(state);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl">
      <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Consentimento de Cookies</h2>
          <p className="text-sm text-gray-700 mb-3">
            Utilizamos cookies necessários e, mediante seu consentimento, cookies de preferências, estatística e marketing
            para melhorar sua experiência conforme LGPD e GDPR. Você pode gerenciar suas escolhas abaixo.
          </p>
          <div className="text-sm text-gray-600 mb-4">
            Consulte a <Link className="underline hover:text-gray-900" href="/cookies">Política de Cookies</Link> e a
            {" "}
            <Link className="underline hover:text-gray-900" href="/privacy">Política de Privacidade</Link>.
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={acceptAll} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Aceitar todos</button>
            <button type="button" onClick={rejectAll} className="px-4 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300">Recusar</button>
            <button type="button" onClick={() => setExpanded((v) => !v)} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Personalizar</button>
          </div>
        </div>
        {expanded && (
          <div className="border-t border-gray-200 p-4 grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Necessários</div>
                <div className="text-sm text-gray-600">Essenciais para funcionamento do site. Sempre ativos.</div>
              </div>
              <input type="checkbox" checked disabled className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Preferências</div>
                <div className="text-sm text-gray-600">Lembram suas escolhas, como idioma.</div>
              </div>
              <input
                type="checkbox"
                checked={state.preferences}
                onChange={(e) => setState((s) => ({ ...s, preferences: e.target.checked }))}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Estatística</div>
                <div className="text-sm text-gray-600">Ajuda a entender o uso e melhorar o site.</div>
              </div>
              <input
                type="checkbox"
                checked={state.statistics}
                onChange={(e) => setState((s) => ({ ...s, statistics: e.target.checked }))}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Marketing</div>
                <div className="text-sm text-gray-600">Personaliza ofertas e publicidade.</div>
              </div>
              <input
                type="checkbox"
                checked={state.marketing}
                onChange={(e) => setState((s) => ({ ...s, marketing: e.target.checked }))}
                className="h-4 w-4"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={save} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Salvar preferências</button>
              <button type="button" onClick={save} className="px-4 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300">Fechar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
