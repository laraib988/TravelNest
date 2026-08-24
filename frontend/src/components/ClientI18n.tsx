'use client';
import { useCurrency } from '@/context/CurrencyContext';

export function ClientText({ tKey }: { tKey: string }) {
  const { t } = useCurrency();
  return <>{t(tKey)}</>;
}

export function ClientPrice({ price }: { price: number }) {
  const { formatPrice } = useCurrency();
  return <>{formatPrice(price)}</>;
}
