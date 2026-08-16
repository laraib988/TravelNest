CREATE TABLE IF NOT EXISTS public.supplier_bank_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_account_holder TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    bank_account_number TEXT NOT NULL,
    bank_routing_number TEXT,
    bank_country TEXT NOT NULL,
    bank_currency TEXT NOT NULL DEFAULT 'USD',
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.supplier_bank_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Suppliers can view their own bank accounts" ON public.supplier_bank_accounts;
CREATE POLICY "Suppliers can view their own bank accounts" ON public.supplier_bank_accounts FOR SELECT USING (supplier_id = auth.uid());

DROP POLICY IF EXISTS "Suppliers can insert their own bank accounts" ON public.supplier_bank_accounts;
CREATE POLICY "Suppliers can insert their own bank accounts" ON public.supplier_bank_accounts FOR INSERT WITH CHECK (supplier_id = auth.uid());

DROP POLICY IF EXISTS "Suppliers can update their own bank accounts" ON public.supplier_bank_accounts;
CREATE POLICY "Suppliers can update their own bank accounts" ON public.supplier_bank_accounts FOR UPDATE USING (supplier_id = auth.uid());

DROP POLICY IF EXISTS "Suppliers can delete their own bank accounts" ON public.supplier_bank_accounts;
CREATE POLICY "Suppliers can delete their own bank accounts" ON public.supplier_bank_accounts FOR DELETE USING (supplier_id = auth.uid());
