'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  siteKey?: string;
}

export default function TurnstileWidget({ 
  onVerify, 
  // Cloudflare's official testing dummy key that always passes
  siteKey = '1x00000000000000000000AA' 
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If it's already available globally
    if (typeof window !== 'undefined' && window.turnstile) {
      setIsReady(true);
    }
    
    // Cloudflare will call this globally when the script is fully parsed and ready
    window.onloadTurnstileCallback = () => {
      setIsReady(true);
    };

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isReady && containerRef.current && window.turnstile && !widgetIdRef.current) {
      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onVerify(token);
          },
          theme: 'light',
        });
      } catch (error) {
        console.error("Turnstile rendering error:", error);
      }
    }
  }, [isReady, siteKey, onVerify]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0', minHeight: '65px' }}>
      <Script 
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit" 
        strategy="afterInteractive"
      />
      <div ref={containerRef}>
        {!isReady && <div style={{ fontSize: '0.85rem', color: '#94a3b8', padding: '10px' }}>Loading Security Check...</div>}
      </div>
    </div>
  );
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: string | HTMLElement, options: any) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}
