import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Category { id: string; name: string; icon: string; }

interface AddFoodDialogProps {
  categories: Category[];
  defaultCategoryId?: string;
  onAdded: () => void;
}

export const AddFoodDialog = ({ categories, defaultCategoryId, onAdded }: AddFoodDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategoryId || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !categoryId) {
      toast.error("Gıda adı ve kategori gerekli");
      return;
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { error } = await supabase.from('foods').insert({
      name: name.trim(),
      category_id: categoryId,
      user_id: user.id,
      is_default: false,
    });
    setSaving(false);
    if (error) { toast.error("Eklenemedi: " + error.message); return; }
    toast.success("Gıda eklendi");
    setName("");
    setOpen(false);
    onAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-xl">
          <Plus className="w-4 h-4 mr-1" /> Yeni Gıda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Gıda Ekle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Gıda Adı</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="örn. Karpuz" />
          </div>
          <div>
            <Label>Kategori</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Kategori seç" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full rounded-xl">
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
