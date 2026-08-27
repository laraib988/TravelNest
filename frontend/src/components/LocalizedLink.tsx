'use client';
import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

export default function LocalizedLink({ href, ...props }: any) {
  const pathname = usePathname() || '';
  
  let targetUrl = typeof href === 'string' ? href : href.pathname || '';
  
  if (targetUrl && targetUrl.startsWith('/') && !targetUrl.startsWith('//')) {
    const localeMatch = pathname.match(/^\/(en|ja|ur|fr|ar)(\/|$)/);
    const localePrefix = localeMatch ? '/' + localeMatch[1] : '';
    
    const hasLocale = /^\/(en|ja|ur|fr|ar)(\/|$)/.test(targetUrl);
    
    if (!hasLocale) {
      if (targetUrl === '/') {
        targetUrl = localePrefix || '/';
      } else {
        targetUrl = `${localePrefix}${targetUrl}`;
      }
    }
  }

  const finalHref = typeof href === 'object' ? { ...href, pathname: targetUrl } : targetUrl;
  return <NextLink href={finalHref} {...props} />;
}
