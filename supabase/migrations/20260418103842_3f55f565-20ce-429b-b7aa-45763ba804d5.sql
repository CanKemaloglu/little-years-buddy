
-- Reaction enum
CREATE TYPE public.food_reaction AS ENUM ('loved', 'liked', 'neutral', 'disliked', 'allergic');

-- Categories table
CREATE TABLE public.food_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text NOT NULL DEFAULT '🍽️',
  color text NOT NULL DEFAULT 'hsl(var(--primary))',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.food_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view food categories"
ON public.food_categories FOR SELECT
USING (true);

-- Foods table
CREATE TABLE public.foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid NOT NULL REFERENCES public.food_categories(id) ON DELETE CASCADE,
  user_id uuid,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view default foods and their own"
ON public.foods FOR SELECT
USING (is_default = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own foods"
ON public.foods FOR INSERT
WITH CHECK (auth.uid() = user_id AND is_default = false);

CREATE POLICY "Users can update their own foods"
ON public.foods FOR UPDATE
USING (auth.uid() = user_id AND is_default = false);

CREATE POLICY "Users can delete their own foods"
ON public.foods FOR DELETE
USING (auth.uid() = user_id AND is_default = false);

-- Child foods table
CREATE TABLE public.child_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  food_id uuid NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  first_tried_date date NOT NULL DEFAULT CURRENT_DATE,
  reaction public.food_reaction NOT NULL DEFAULT 'neutral',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(child_id, food_id)
);

ALTER TABLE public.child_foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view child foods for accessible children"
ON public.child_foods FOR SELECT
USING (public.user_has_child_access(child_id, auth.uid()));

CREATE POLICY "Users can create child foods for accessible children"
ON public.child_foods FOR INSERT
WITH CHECK (public.user_has_child_access(child_id, auth.uid()));

CREATE POLICY "Users can update child foods for accessible children"
ON public.child_foods FOR UPDATE
USING (public.user_has_child_access(child_id, auth.uid()));

CREATE POLICY "Users can delete child foods for accessible children"
ON public.child_foods FOR DELETE
USING (public.user_has_child_access(child_id, auth.uid()));

-- Updated_at trigger
CREATE TRIGGER update_child_foods_updated_at
BEFORE UPDATE ON public.child_foods
FOR EACH ROW
EXECUTE FUNCTION public.update_milestone_updated_at();

-- Insert default categories
INSERT INTO public.food_categories (name, icon, sort_order) VALUES
  ('Sebzeler', '🥦', 1),
  ('Meyveler', '🍎', 2),
  ('Tahıllar', '🌾', 3),
  ('Et & Protein', '🍗', 4),
  ('Süt Ürünleri', '🥛', 5),
  ('Baklagiller', '🫘', 6),
  ('Atıştırmalıklar', '🍪', 7);

-- Insert default foods
WITH cats AS (SELECT id, name FROM public.food_categories)
INSERT INTO public.foods (name, category_id, is_default) VALUES
  -- Sebzeler
  ('Havuç', (SELECT id FROM cats WHERE name='Sebzeler'), true),
  ('Brokoli', (SELECT id FROM cats WHERE name='Sebzeler'), true),
  ('Patates', (SELECT id FROM cats WHERE name='Sebzeler'), true),
  ('Tatlı Patates', (SELECT id FROM cats WHERE name='Sebzeler'), true),
  ('Kabak', (SELECT id FROM cats WHERE name='Sebzeler'), true),
  ('Ispanak', (SELECT id FROM cats WHERE name='Sebzeler'), true),
  ('Karnabahar', (SELECT id FROM cats WHERE name='Sebzeler'), true),
  ('Bezelye', (SELECT id FROM cats WHERE name='Sebzeler'), true),
  ('Domates', (SELECT id FROM cats WHERE name='Sebzeler'), true),
  ('Salatalık', (SELECT id FROM cats WHERE name='Sebzeler'), true),
  -- Meyveler
  ('Muz', (SELECT id FROM cats WHERE name='Meyveler'), true),
  ('Elma', (SELECT id FROM cats WHERE name='Meyveler'), true),
  ('Armut', (SELECT id FROM cats WHERE name='Meyveler'), true),
  ('Avokado', (SELECT id FROM cats WHERE name='Meyveler'), true),
  ('Şeftali', (SELECT id FROM cats WHERE name='Meyveler'), true),
  ('Kayısı', (SELECT id FROM cats WHERE name='Meyveler'), true),
  ('Çilek', (SELECT id FROM cats WHERE name='Meyveler'), true),
  ('Karpuz', (SELECT id FROM cats WHERE name='Meyveler'), true),
  ('Üzüm', (SELECT id FROM cats WHERE name='Meyveler'), true),
  ('Portakal', (SELECT id FROM cats WHERE name='Meyveler'), true),
  -- Tahıllar
  ('Pirinç Lapası', (SELECT id FROM cats WHERE name='Tahıllar'), true),
  ('Yulaf Ezmesi', (SELECT id FROM cats WHERE name='Tahıllar'), true),
  ('Bulgur', (SELECT id FROM cats WHERE name='Tahıllar'), true),
  ('Makarna', (SELECT id FROM cats WHERE name='Tahıllar'), true),
  ('Ekmek', (SELECT id FROM cats WHERE name='Tahıllar'), true),
  ('Bebek Bisküvisi', (SELECT id FROM cats WHERE name='Tahıllar'), true),
  -- Et & Protein
  ('Tavuk', (SELECT id FROM cats WHERE name='Et & Protein'), true),
  ('Hindi', (SELECT id FROM cats WHERE name='Et & Protein'), true),
  ('Kırmızı Et', (SELECT id FROM cats WHERE name='Et & Protein'), true),
  ('Köfte', (SELECT id FROM cats WHERE name='Et & Protein'), true),
  ('Balık', (SELECT id FROM cats WHERE name='Et & Protein'), true),
  ('Yumurta Sarısı', (SELECT id FROM cats WHERE name='Et & Protein'), true),
  ('Yumurta', (SELECT id FROM cats WHERE name='Et & Protein'), true),
  -- Süt Ürünleri
  ('Yoğurt', (SELECT id FROM cats WHERE name='Süt Ürünleri'), true),
  ('Beyaz Peynir', (SELECT id FROM cats WHERE name='Süt Ürünleri'), true),
  ('Kaşar Peyniri', (SELECT id FROM cats WHERE name='Süt Ürünleri'), true),
  ('Lor Peyniri', (SELECT id FROM cats WHERE name='Süt Ürünleri'), true),
  ('Süt', (SELECT id FROM cats WHERE name='Süt Ürünleri'), true),
  ('Kefir', (SELECT id FROM cats WHERE name='Süt Ürünleri'), true),
  -- Baklagiller
  ('Mercimek Çorbası', (SELECT id FROM cats WHERE name='Baklagiller'), true),
  ('Nohut', (SELECT id FROM cats WHERE name='Baklagiller'), true),
  ('Kuru Fasulye', (SELECT id FROM cats WHERE name='Baklagiller'), true),
  ('Barbunya', (SELECT id FROM cats WHERE name='Baklagiller'), true),
  -- Atıştırmalıklar
  ('Tahin', (SELECT id FROM cats WHERE name='Atıştırmalıklar'), true),
  ('Pekmez', (SELECT id FROM cats WHERE name='Atıştırmalıklar'), true),
  ('Fındık Ezmesi', (SELECT id FROM cats WHERE name='Atıştırmalıklar'), true),
  ('Zeytin', (SELECT id FROM cats WHERE name='Atıştırmalıklar'), true),
  ('Bal', (SELECT id FROM cats WHERE name='Atıştırmalıklar'), true);
