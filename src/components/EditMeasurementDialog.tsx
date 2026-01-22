import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Ruler } from "lucide-react";

interface Measurement {
  id: string;
  measurement_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  head_circumference_cm: number | null;
  notes: string | null;
}

interface EditMeasurementDialogProps {
  measurement: Measurement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMeasurementUpdated: () => void;
}

export const EditMeasurementDialog = ({
  measurement,
  open,
  onOpenChange,
  onMeasurementUpdated,
}: EditMeasurementDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [measurementDate, setMeasurementDate] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightValue, setWeightValue] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "g">("kg");
  const [headCircumferenceCm, setHeadCircumferenceCm] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (measurement) {
      setMeasurementDate(measurement.measurement_date);
      setHeightCm(measurement.height_cm?.toString() || "");
      // Default to kg when loading existing data
      setWeightValue(measurement.weight_kg?.toString() || "");
      setWeightUnit("kg");
      setHeadCircumferenceCm(measurement.head_circumference_cm?.toString() || "");
      setNotes(measurement.notes || "");
    }
  }, [measurement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!measurement) return;

    if (!heightCm && !weightValue && !headCircumferenceCm) {
      toast.error("En az bir ölçüm girin");
      return;
    }

    setLoading(true);

    try {
      // Convert weight to kg if entered in grams
      let weightKg: number | null = null;
      if (weightValue) {
        const numValue = parseFloat(weightValue);
        weightKg = weightUnit === "g" ? numValue / 1000 : numValue;
      }

      const { error } = await supabase
        .from("measurements")
        .update({
          measurement_date: measurementDate,
          height_cm: heightCm ? parseFloat(heightCm) : null,
          weight_kg: weightKg,
          head_circumference_cm: headCircumferenceCm ? parseFloat(headCircumferenceCm) : null,
          notes: notes || null,
        })
        .eq("id", measurement.id);

      if (error) throw error;

      toast.success("Ölçüm güncellendi!");
      onOpenChange(false);
      onMeasurementUpdated();
    } catch (error) {
      console.error("Error updating measurement:", error);
      toast.error("Ölçüm güncellenemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Ölçümü Düzenle
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editMeasurementDate">Tarih</Label>
            <Input
              id="editMeasurementDate"
              type="date"
              value={measurementDate}
              onChange={(e) => setMeasurementDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="editHeight">Boy (cm)</Label>
              <Input
                id="editHeight"
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
              <Label htmlFor="editWeight">Kilo</Label>
              <div className="flex gap-2">
                <Input
                  id="editWeight"
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
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editHead">Baş Çevresi (cm)</Label>
              <Input
                id="editHead"
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
            <Label htmlFor="editNotes">Notlar (opsiyonel)</Label>
            <Textarea
              id="editNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ek notlar..."
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Güncelleniyor..." : "Kaydet"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
