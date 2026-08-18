'use client';

import { useEffect, useRef, useState } from 'react';

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
  const [isLoaded, setIsLoaded] = useState(false);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!document.getElementById('turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else if (window.turnstile) {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && containerRef.current && window.turnstile && !widgetIdRef.current) {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: function(token: string) {
          onVerify(token);
        },
        theme: 'light',
      });
    }
    
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [isLoaded, siteKey, onVerify]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
      <div ref={containerRef}>
        {!isLoaded && <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Loading Security Check...</div>}
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
  }
}
