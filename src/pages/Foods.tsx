import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { FoodCard, ChildFood } from "@/components/FoodCard";
import { AddFoodDialog } from "@/components/AddFoodDialog";
import { FOOD_REACTIONS } from "@/lib/foodReactions";
import { toast } from "sonner";

interface Category { id: string; name: string; icon: string; sort_order: number; }
interface Food { id: string; name: string; category_id: string; }

type Filter = 'all' | 'tried' | 'loved' | 'allergic';

const Foods = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [childName, setChildName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [childFoods, setChildFoods] = useState<ChildFood[]>([]);
  const [activeCat, setActiveCat] = useState<string>("");
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    if (!childId) return;
    const [{ data: child }, { data: cats }, { data: fds }, { data: cfds }] = await Promise.all([
      supabase.from('children').select('name').eq('id', childId).maybeSingle(),
      supabase.from('food_categories').select('*').order('sort_order'),
      supabase.from('foods').select('id, name, category_id').order('name'),
      supabase.from('child_foods').select('id, food_id, reaction, first_tried_date, notes, try_count').eq('child_id', childId),
    ]);
    if (child) setChildName(child.name);
    if (cats) {
      setCategories(cats);
      if (!activeCat && cats[0]) setActiveCat(cats[0].id);
    }
    if (fds) setFoods(fds);
    if (cfds) setChildFoods(cfds as ChildFood[]);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, [childId]);

  const childFoodMap = useMemo(() => {
    const m = new Map<string, ChildFood>();
    childFoods.forEach(cf => m.set(cf.food_id, cf));
    return m;
  }, [childFoods]);

  const stats = useMemo(() => ({
    tried: childFoods.length,
    loved: childFoods.filter(cf => cf.reaction === 'loved').length,
    allergic: childFoods.filter(cf => cf.reaction === 'allergic').length,
  }), [childFoods]);

  const filterFood = (foodId: string): boolean => {
    const cf = childFoodMap.get(foodId);
    if (filter === 'all') return true;
    if (filter === 'tried') return !!cf;
    if (filter === 'loved') return cf?.reaction === 'loved';
    if (filter === 'allergic') return cf?.reaction === 'allergic';
    return true;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-muted-foreground">Yükleniyor...</div></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-primary" />
              Beslenme Günlüğü
            </h1>
            <p className="text-sm text-muted-foreground">{childName}</p>
          </div>
          <AddFoodDialog categories={categories} defaultCategoryId={activeCat} onAdded={loadAll} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
            <div className="text-2xl font-bold text-primary">{stats.tried}</div>
            <div className="text-xs text-muted-foreground">Denendi</div>
          </div>
          <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-center">
            <div className="text-2xl font-bold text-pink-600">{stats.loved} 😍</div>
            <div className="text-xs text-muted-foreground">Bayıldı</div>
          </div>
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.allergic} ⚠️</div>
            <div className="text-xs text-muted-foreground">Alerji</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {([
            { v: 'all', l: 'Tümü' },
            { v: 'tried', l: 'Denenenler' },
            { v: 'loved', l: 'Bayıldıkları 😍' },
            { v: 'allergic', l: 'Alerjiler ⚠️' },
          ] as { v: Filter; l: string }[]).map(f => (
            <Button
              key={f.v}
              size="sm"
              variant={filter === f.v ? 'default' : 'outline'}
              onClick={() => setFilter(f.v)}
              className="rounded-full flex-shrink-0"
            >
              {f.l}
            </Button>
          ))}
        </div>

        {/* Categories */}
        <Tabs value={activeCat} onValueChange={setActiveCat}>
          <TabsList className="w-full overflow-x-auto justify-start h-auto flex-wrap p-1">
            {categories.map(c => (
              <TabsTrigger key={c.id} value={c.id} className="flex-shrink-0">
                {c.icon} {c.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(c => {
            const catFoods = foods.filter(f => f.category_id === c.id && filterFood(f.id));
            return (
              <TabsContent key={c.id} value={c.id} className="mt-4">
                {catFoods.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    Bu kategoride gıda yok
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {catFoods.map(f => (
                      <FoodCard
                        key={f.id}
                        foodId={f.id}
                        foodName={f.name}
                        childId={childId!}
                        existing={childFoodMap.get(f.id)}
                        onChange={loadAll}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default Foods;
