-- =========================================================
-- ELVORA - Auth Schema Update
-- =========================================================

-- Add auth_id to link public.customers to auth.users
ALTER TABLE public.customers 
ADD COLUMN auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_customers_auth_id ON public.customers(auth_id);

-- Create a trigger function to sync new signups to the customers table
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Try to find an existing guest customer by email
  UPDATE public.customers 
  SET auth_id = new.id
  WHERE email = new.email;
  
  -- If no customer was found, insert a new one
  IF NOT FOUND THEN
    INSERT INTO public.customers (auth_id, full_name, email)
    VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', ''), new.email);
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =========================================================
-- UPDATED ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

-- Allow users to manage their own customer record
CREATE POLICY "Users can manage their own customer record" 
ON public.customers FOR ALL USING (auth_id = auth.uid());

-- Allow users to view their own orders
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE auth_id = auth.uid())
);
