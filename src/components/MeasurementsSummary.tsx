import { useMemo } from "react";
import { format, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";
import { TrendingUp, TrendingDown, Minus, Ruler, Scale, Circle } from "lucide-react";

interface Measurement {
  id: string;
  measurement_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  head_circumference_cm: number | null;
}

interface MeasurementsSummaryProps {
  measurements: Measurement[];
  birthdate: string;
}

export const MeasurementsSummary = ({ measurements, birthdate }: MeasurementsSummaryProps) => {
  const summary = useMemo(() => {
    if (measurements.length === 0) return null;

    const sorted = [...measurements].sort(
      (a, b) => new Date(b.measurement_date).getTime() - new Date(a.measurement_date).getTime()
    );

    const latest = sorted[0];
    const previous = sorted[1];

    const calculateChange = (current: number | null, prev: number | null) => {
      if (!current || !prev) return null;
      return current - prev;
    };

    const heightChange = previous ? calculateChange(latest.height_cm, previous.height_cm) : null;
    const weightChange = previous ? calculateChange(latest.weight_kg, previous.weight_kg) : null;
    const headChange = previous ? calculateChange(latest.head_circumference_cm, previous.head_circumference_cm) : null;

    // Calculate age at measurement
    const ageInDays = differenceInDays(new Date(latest.measurement_date), new Date(birthdate));
    const ageMonths = Math.floor(ageInDays / 30);
    const ageYears = Math.floor(ageMonths / 12);
    const remainingMonths = ageMonths % 12;

    return {
      latest,
      previous,
      heightChange,
      weightChange,
      headChange,
      ageText: ageYears > 0 
        ? `${ageYears} yıl ${remainingMonths} ay`
        : `${ageMonths} ay`,
      measurementCount: measurements.length,
    };
  }, [measurements, birthdate]);

  if (!summary) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Henüz ölçüm verisi yok
      </div>
    );
  }

  const TrendIcon = ({ value }: { value: number | null }) => {
    if (value === null) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const formatChange = (value: number | null, unit: string) => {
    if (value === null) return "-";
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)} ${unit}`;
  };

  return (
    <div className="space-y-4">
      {/* Latest measurement date */}
      <div className="text-center pb-2 border-b border-border">
        <p className="text-sm text-muted-foreground">Son ölçüm</p>
        <p className="font-medium">
          {format(new Date(summary.latest.measurement_date), "d MMMM yyyy", { locale: tr })}
        </p>
        <p className="text-xs text-muted-foreground">({summary.ageText})</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Height */}
        <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
          <Ruler className="h-5 w-5 mx-auto mb-1 text-primary" />
          <p className="text-xs text-muted-foreground mb-1">Boy</p>
          <p className="text-lg font-bold">
            {summary.latest.height_cm ? `${summary.latest.height_cm}` : "-"}
          </p>
          <p className="text-xs text-muted-foreground">cm</p>
          {summary.heightChange !== null && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendIcon value={summary.heightChange} />
              <span className="text-xs">{formatChange(summary.heightChange, "")}</span>
            </div>
          )}
        </div>

        {/* Weight */}
        <div className="text-center p-3 rounded-xl bg-green-500/5 border border-green-500/10">
          <Scale className="h-5 w-5 mx-auto mb-1 text-green-600" />
          <p className="text-xs text-muted-foreground mb-1">Kilo</p>
          <p className="text-lg font-bold">
            {summary.latest.weight_kg ? `${summary.latest.weight_kg}` : "-"}
          </p>
          <p className="text-xs text-muted-foreground">kg</p>
          {summary.weightChange !== null && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendIcon value={summary.weightChange} />
              <span className="text-xs">{formatChange(summary.weightChange, "")}</span>
            </div>
          )}
        </div>

        {/* Head Circumference */}
        <div className="text-center p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
          <Circle className="h-5 w-5 mx-auto mb-1 text-purple-600" />
          <p className="text-xs text-muted-foreground mb-1">Baş Çevresi</p>
          <p className="text-lg font-bold">
            {summary.latest.head_circumference_cm ? `${summary.latest.head_circumference_cm}` : "-"}
          </p>
          <p className="text-xs text-muted-foreground">cm</p>
          {summary.headChange !== null && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendIcon value={summary.headChange} />
              <span className="text-xs">{formatChange(summary.headChange, "")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Total measurements count */}
      <div className="text-center text-sm text-muted-foreground">
        Toplam {summary.measurementCount} ölçüm kaydı
      </div>
    </div>
  );
};
