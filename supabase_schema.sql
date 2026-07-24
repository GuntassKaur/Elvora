-- =========================================================
-- ELVORA Luxury Fashion - Supabase Database Schema
-- =========================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    stock INTEGER DEFAULT 50,
    rating NUMERIC DEFAULT 4.8,
    review_count INTEGER DEFAULT 12,
    colors JSONB DEFAULT '[]'::jsonb,
    sizes JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    featured BOOLEAN DEFAULT false,
    new_arrival BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    subtotal NUMERIC NOT NULL,
    shipping NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'Secure Demo Payment',
    payment_status TEXT DEFAULT 'paid',
    shipping_address JSONB NOT NULL,
    order_items JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access to products" 
ON public.products FOR SELECT USING (true);

-- Allow public (guest checkout) to create customers
CREATE POLICY "Allow public insert customers" 
ON public.customers FOR INSERT WITH CHECK (true);

-- Allow public (guest checkout) to read customer data by ID/email
CREATE POLICY "Allow public select customers" 
ON public.customers FOR SELECT USING (true);

-- Allow public (guest checkout) to create orders
CREATE POLICY "Allow public insert orders" 
ON public.orders FOR INSERT WITH CHECK (true);

-- Allow public to view orders by order_id
CREATE POLICY "Allow public select orders" 
ON public.orders FOR SELECT USING (true);

-- Allow authenticated users to manage their own customer record
CREATE POLICY "Users can manage their own customer record" 
ON public.customers FOR ALL USING (auth_id = auth.uid());

-- Allow authenticated users to view their own orders
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT USING (
  customer_id IN (SELECT id FROM public.customers WHERE auth_id = auth.uid())
);

-- =========================================================
-- INDEXES FOR PERFORMANCE
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON public.products(new_arrival);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_auth_id ON public.customers(auth_id);

-- =========================================================
-- AUTH TRIGGERS
-- =========================================================

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
