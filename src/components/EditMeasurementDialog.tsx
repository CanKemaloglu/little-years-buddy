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
  const [weightKg, setWeightKg] = useState("");
  const [headCircumferenceCm, setHeadCircumferenceCm] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (measurement) {
      setMeasurementDate(measurement.measurement_date);
      setHeightCm(measurement.height_cm?.toString() || "");
      setWeightKg(measurement.weight_kg?.toString() || "");
      setHeadCircumferenceCm(measurement.head_circumference_cm?.toString() || "");
      setNotes(measurement.notes || "");
    }
  }, [measurement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!measurement) return;

    if (!heightCm && !weightKg && !headCircumferenceCm) {
      toast.error("En az bir ölçüm girin");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("measurements")
        .update({
          measurement_date: measurementDate,
          height_cm: heightCm ? parseFloat(heightCm) : null,
          weight_kg: weightKg ? parseFloat(weightKg) : null,
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
              <Label htmlFor="editWeight">Kilo (kg)</Label>
              <Input
                id="editWeight"
                type="number"
                step="0.1"
                min="0"
                max="200"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="9.2"
              />
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
