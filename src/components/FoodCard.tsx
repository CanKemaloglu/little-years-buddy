import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { FOOD_REACTIONS, FoodReaction, REACTION_ORDER } from "@/lib/foodReactions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ChildFood {
  id: string;
  food_id: string;
  reaction: FoodReaction;
  first_tried_date: string;
  notes: string | null;
}

interface FoodCardProps {
  foodId: string;
  foodName: string;
  childId: string;
  existing?: ChildFood;
  onChange: () => void;
}

export const FoodCard = ({ foodId, foodName, childId, existing, onChange }: FoodCardProps) => {
  const [open, setOpen] = useState(false);
  const [reaction, setReaction] = useState<FoodReaction>(existing?.reaction || 'liked');
  const [date, setDate] = useState<Date>(existing ? new Date(existing.first_tried_date) : new Date());
  const [notes, setNotes] = useState(existing?.notes || "");
  const [saving, setSaving] = useState(false);

  const reactionMeta = existing ? FOOD_REACTIONS[existing.reaction] : null;

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const payload = {
      child_id: childId,
      food_id: foodId,
      user_id: user.id,
      reaction,
      first_tried_date: format(date, 'yyyy-MM-dd'),
      notes: notes.trim() || null,
    };

    const { error } = existing
      ? await supabase.from('child_foods').update(payload).eq('id', existing.id)
      : await supabase.from('child_foods').insert(payload);

    setSaving(false);
    if (error) { toast.error("Kaydedilemedi: " + error.message); return; }
    toast.success("Kaydedildi");
    setOpen(false);
    onChange();
  };

  const handleDelete = async () => {
    if (!existing) return;
    const { error } = await supabase.from('child_foods').delete().eq('id', existing.id);
    if (error) { toast.error("Silinemedi"); return; }
    toast.success("Silindi");
    setOpen(false);
    onChange();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => {
      setOpen(o);
      if (o) {
        setReaction(existing?.reaction || 'liked');
        setDate(existing ? new Date(existing.first_tried_date) : new Date());
        setNotes(existing?.notes || "");
      }
    }}>
      <DialogTrigger asChild>
        <button className={cn(
          "relative p-3 rounded-2xl border-2 text-left transition-all hover:scale-105 hover:shadow-md w-full",
          existing ? reactionMeta!.bg : "bg-muted/30 border-border/50 hover:border-primary/30"
        )}>
          <div className="flex items-start justify-between gap-2">
            <span className="font-medium text-sm text-foreground leading-tight">{foodName}</span>
            <span className="text-xl flex-shrink-0">{existing ? reactionMeta!.emoji : '➕'}</span>
          </div>
          {existing && (
            <div className="text-[10px] text-muted-foreground mt-1">
              {format(new Date(existing.first_tried_date), 'd MMM yyyy', { locale: tr })}
            </div>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{foodName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Reaksiyon</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {REACTION_ORDER.map(r => {
                const meta = FOOD_REACTIONS[r];
                const active = reaction === r;
                return (
                  <button
                    key={r}
                    onClick={() => setReaction(r)}
                    className={cn(
                      "p-2 rounded-xl border-2 flex flex-col items-center gap-1 transition-all",
                      active ? meta.bg + " scale-110" : "border-border/50 hover:border-primary/30"
                    )}
                  >
                    <span className="text-2xl">{meta.emoji}</span>
                    <span className="text-[10px] font-medium">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label>İlk Deneme Tarihi</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start mt-1">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'd MMMM yyyy', { locale: tr })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  disabled={(d) => d > new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Notlar (opsiyonel)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="örn. kızarıklık oldu, tekrar denenebilir..." rows={3} />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving} className="flex-1 rounded-xl">
              {saving ? "..." : "Kaydet"}
            </Button>
            {existing && (
              <Button onClick={handleDelete} variant="outline" size="icon" className="rounded-xl text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
