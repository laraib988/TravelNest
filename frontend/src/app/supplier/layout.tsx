import SupplierHeader from '@/components/SupplierHeader';

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      <SupplierHeader />
      {children}
    </div>
  );
}
