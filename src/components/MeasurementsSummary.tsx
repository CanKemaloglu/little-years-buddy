import { useMemo } from "react";
import { format, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";
import { TrendingUp, TrendingDown, Minus, Ruler, Scale, Circle, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  calculateWeightPercentile,
  calculateHeightPercentile,
  calculateHeadCircumferencePercentile,
  type PercentileResult,
  type Gender,
} from "@/lib/whoGrowthData";

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
  gender?: string;
}

const PercentileIndicator = ({ result, label }: { result: PercentileResult | null; label: string }) => {
  if (!result) return null;

  const getColorClass = (interpretation: PercentileResult['interpretation']) => {
    switch (interpretation) {
      case 'very-low':
        return 'bg-red-500';
      case 'low':
        return 'bg-orange-400';
      case 'normal':
        return 'bg-green-500';
      case 'high':
        return 'bg-blue-400';
      case 'very-high':
        return 'bg-purple-500';
    }
  };

  const getTextColorClass = (interpretation: PercentileResult['interpretation']) => {
    switch (interpretation) {
      case 'very-low':
        return 'text-red-600';
      case 'low':
        return 'text-orange-500';
      case 'normal':
        return 'text-green-600';
      case 'high':
        return 'text-blue-500';
      case 'very-high':
        return 'text-purple-600';
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-semibold ${getTextColorClass(result.interpretation)}`}>
          %{result.percentile}
        </span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        {/* Background gradient showing percentile zones */}
        <div className="absolute inset-0 flex">
          <div className="w-[3%] bg-red-200" />
          <div className="w-[12%] bg-orange-100" />
          <div className="w-[70%] bg-green-100" />
          <div className="w-[12%] bg-blue-100" />
          <div className="w-[3%] bg-purple-200" />
        </div>
        {/* Percentile marker */}
        <div
          className={`absolute top-0 h-full w-1.5 rounded-full ${getColorClass(result.interpretation)} shadow-sm transition-all`}
          style={{ left: `calc(${Math.min(Math.max(result.percentile, 1), 99)}% - 3px)` }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center">{result.interpretationText}</p>
    </div>
  );
};

export const MeasurementsSummary = ({ measurements, birthdate, gender = 'neutral' }: MeasurementsSummaryProps) => {
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
    const ageMonths = Math.floor(ageInDays / 30.44); // More accurate month calculation
    const ageYears = Math.floor(ageMonths / 12);
    const remainingMonths = ageMonths % 12;

    // Calculate percentiles
    const genderForCalc: Gender = gender === 'male' ? 'male' : gender === 'female' ? 'female' : 'male';
    
    const weightPercentile = latest.weight_kg
      ? calculateWeightPercentile(latest.weight_kg, ageMonths, genderForCalc)
      : null;
    const heightPercentile = latest.height_cm
      ? calculateHeightPercentile(latest.height_cm, ageMonths, genderForCalc)
      : null;
    const headPercentile = latest.head_circumference_cm
      ? calculateHeadCircumferencePercentile(latest.head_circumference_cm, ageMonths, genderForCalc)
      : null;

    return {
      latest,
      previous,
      heightChange,
      weightChange,
      headChange,
      ageMonths,
      ageText: ageYears > 0 
        ? `${ageYears} yıl ${remainingMonths} ay`
        : `${ageMonths} ay`,
      measurementCount: measurements.length,
      weightPercentile,
      heightPercentile,
      headPercentile,
    };
  }, [measurements, birthdate, gender]);

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

  const isWithinWHORange = summary.ageMonths <= 60;

  return (
    <div className="space-y-6">
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

      {/* WHO Percentile Section */}
      {isWithinWHORange && (summary.heightPercentile || summary.weightPercentile || summary.headPercentile) && (
        <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <Activity className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold">WHO Persentil Karşılaştırması</h4>
          </div>
          
          <div className="space-y-4">
            {summary.heightPercentile && (
              <PercentileIndicator result={summary.heightPercentile} label="Boy" />
            )}
            {summary.weightPercentile && (
              <PercentileIndicator result={summary.weightPercentile} label="Kilo" />
            )}
            {summary.headPercentile && (
              <PercentileIndicator result={summary.headPercentile} label="Baş Çevresi" />
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-2">
            WHO Çocuk Gelişim Standartları (0-5 yaş)
          </p>
        </div>
      )}

      {!isWithinWHORange && (
        <div className="text-center text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
          WHO persentil karşılaştırması 0-5 yaş arası için geçerlidir
        </div>
      )}

      {/* Total measurements count */}
      <div className="text-center text-sm text-muted-foreground">
        Toplam {summary.measurementCount} ölçüm kaydı
      </div>
    </div>
  );
};
