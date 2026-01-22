import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Ruler, Plus } from "lucide-react";

interface AddMeasurementDialogProps {
  childId: string;
  onMeasurementAdded: () => void;
}

export const AddMeasurementDialog = ({ childId, onMeasurementAdded }: AddMeasurementDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [measurementDate, setMeasurementDate] = useState(new Date().toISOString().split('T')[0]);
  const [heightCm, setHeightCm] = useState("");
  const [weightValue, setWeightValue] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "g">("kg");
  const [headCircumferenceCm, setHeadCircumferenceCm] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!heightCm && !weightValue && !headCircumferenceCm) {
      toast.error("En az bir ölçüm girin");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Kullanıcı bulunamadı");

      // Convert weight to kg if entered in grams
      let weightKg: number | null = null;
      if (weightValue) {
        const numValue = parseFloat(weightValue);
        weightKg = weightUnit === "g" ? numValue / 1000 : numValue;
      }

      const { error } = await supabase.from("measurements").insert({
        child_id: childId,
        user_id: user.id,
        measurement_date: measurementDate,
        height_cm: heightCm ? parseFloat(heightCm) : null,
        weight_kg: weightKg,
        head_circumference_cm: headCircumferenceCm ? parseFloat(headCircumferenceCm) : null,
        notes: notes || null,
      });

      if (error) throw error;

      toast.success("Ölçüm eklendi!");
      setOpen(false);
      resetForm();
      onMeasurementAdded();
    } catch (error) {
      console.error("Error adding measurement:", error);
      toast.error("Ölçüm eklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMeasurementDate(new Date().toISOString().split('T')[0]);
    setHeightCm("");
    setWeightValue("");
    setWeightUnit("kg");
    setHeadCircumferenceCm("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          <Ruler className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Ölçüm Ekle
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="measurementDate">Tarih</Label>
            <Input
              id="measurementDate"
              type="date"
              value={measurementDate}
              onChange={(e) => setMeasurementDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Boy (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  min="0"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="75.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="head">Baş Çevresi (cm)</Label>
                <Input
                  id="head"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={headCircumferenceCm}
                  onChange={(e) => setHeadCircumferenceCm(e.target.value)}
                  placeholder="42.0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Kilo</Label>
              <div className="flex gap-3">
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  max={weightUnit === "kg" ? "200" : "200000"}
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  placeholder={weightUnit === "kg" ? "9.2" : "9200"}
                  className="flex-1"
                />
                <Select value={weightUnit} onValueChange={(v: "kg" | "g") => setWeightUnit(v)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">gram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {weightValue && (
                <p className="text-xs text-muted-foreground">
                  {weightUnit === "kg" 
                    ? `= ${Math.round(parseFloat(weightValue) * 1000)} gram`
                    : `= ${(parseFloat(weightValue) / 1000).toFixed(2)} kg`
                  }
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notlar (opsiyonel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ek notlar..."
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Ekleniyor..." : "Ölçüm Ekle"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
