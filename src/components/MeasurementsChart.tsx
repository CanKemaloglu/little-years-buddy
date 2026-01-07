import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import { differenceInDays } from "date-fns";
import { generatePercentileCurves, type Gender } from "@/lib/whoGrowthData";

interface Measurement {
  id: string;
  measurement_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  head_circumference_cm: number | null;
}

interface MeasurementsChartProps {
  measurements: Measurement[];
  birthdate?: string;
  gender?: string;
}

export const MeasurementsChart = ({ measurements, birthdate, gender = 'neutral' }: MeasurementsChartProps) => {
  const genderForCalc: Gender = gender === 'male' ? 'male' : gender === 'female' ? 'female' : 'male';
  
  // Calculate max age for percentile curves - start from 0
  const maxAgeMonths = useMemo(() => {
    if (!birthdate || measurements.length === 0) return 24;
    const maxDate = Math.max(...measurements.map(m => new Date(m.measurement_date).getTime()));
    const ageInDays = differenceInDays(new Date(maxDate), new Date(birthdate));
    return Math.min(Math.ceil(ageInDays / 30.44) + 3, 60);
  }, [measurements, birthdate]);

  // Generate percentile curves starting from 0
  const heightCurves = useMemo(() => generatePercentileCurves('height', genderForCalc, maxAgeMonths, 0), [genderForCalc, maxAgeMonths]);
  const weightCurves = useMemo(() => generatePercentileCurves('weight', genderForCalc, maxAgeMonths, 0), [genderForCalc, maxAgeMonths]);
  const headCurves = useMemo(() => generatePercentileCurves('headCircumference', genderForCalc, maxAgeMonths, 0), [genderForCalc, maxAgeMonths]);

  const chartData = useMemo(() => {
    if (!birthdate) return [];
    
    return [...measurements]
      .sort((a, b) => new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime())
      .map((m) => {
        const ageInDays = differenceInDays(new Date(m.measurement_date), new Date(birthdate));
        const ageMonths = Math.round(ageInDays / 30.44 * 10) / 10;
        return {
          ageMonths,
          ageLabel: `${Math.floor(ageMonths)} ay`,
          boy: m.height_cm,
          kilo: m.weight_kg,
          basCevresi: m.head_circumference_cm,
        };
      });
  }, [measurements, birthdate]);

  if (measurements.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Henüz ölçüm verisi yok
      </div>
    );
  }

  if (!birthdate) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Doğum tarihi bilgisi bulunamadı
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload.find((p: any) => p.dataKey !== 'p3' && p.dataKey !== 'p15' && p.dataKey !== 'p50' && p.dataKey !== 'p85' && p.dataKey !== 'p97');
      if (!data) return null;
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary font-bold">{data.value} {data.dataKey === 'kilo' ? 'kg' : 'cm'}</p>
        </div>
      );
    }
    return null;
  };

  // Merge chart data with percentile curves - keeping both curves and measurements in same array
  const mergeWithCurves = (curves: typeof heightCurves, dataKey: 'boy' | 'kilo' | 'basCevresi') => {
    const result: any[] = [];
    
    // Add all curve points first
    curves.forEach(c => {
      result.push({
        ageMonths: c.ageMonths,
        p3: c.p3,
        p15: c.p15,
        p50: c.p50,
        p85: c.p85,
        p97: c.p97,
        [dataKey]: null, // Measurement will be added if exists at this age
      });
    });
    
    // Add measurement points, merging with existing curve points or adding new ones
    chartData.forEach(d => {
      const existingIdx = result.findIndex(r => Math.abs(r.ageMonths - d.ageMonths) < 0.5);
      if (existingIdx >= 0) {
        result[existingIdx][dataKey] = d[dataKey];
      } else {
        // Add new point with only measurement data
        result.push({
          ageMonths: d.ageMonths,
          [dataKey]: d[dataKey],
        });
      }
    });
    
    return result.sort((a, b) => a.ageMonths - b.ageMonths);
  };

  const heightData = mergeWithCurves(heightCurves, 'boy');
  const weightData = mergeWithCurves(weightCurves, 'kilo');
  const headData = mergeWithCurves(headCurves, 'basCevresi');

  const formatXAxisTick = (value: number) => `${value} ay`;

  return (
    <div className="space-y-6">
      {/* Height Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">Boy (cm)</h4>
          <span className="text-xs text-muted-foreground">WHO Persentil Eğrileri</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={heightData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="ageMonths" 
                type="number"
                domain={[0, 'dataMax']}
                tick={{ fontSize: 10 }} 
                tickFormatter={formatXAxisTick}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                domain={['auto', 'auto']} 
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '10px' }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    p3: '%3', p15: '%15', p50: '%50', p85: '%85', p97: '%97', boy: 'Çocuk'
                  };
                  return labels[value] || value;
                }}
              />
              {/* Percentile lines */}
              <Line type="monotone" dataKey="p97" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.4} />
              <Line type="monotone" dataKey="p85" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.5} />
              <Line type="monotone" dataKey="p50" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} dot={false} opacity={0.6} />
              <Line type="monotone" dataKey="p15" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.5} />
              <Line type="monotone" dataKey="p3" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.4} />
              {/* Child's data */}
              <Line
                type="monotone"
                dataKey="boy"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5 }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weight Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">Kilo (kg)</h4>
          <span className="text-xs text-muted-foreground">WHO Persentil Eğrileri</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="ageMonths" 
                type="number"
                domain={[0, 'dataMax']}
                tick={{ fontSize: 10 }} 
                tickFormatter={formatXAxisTick}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                domain={['auto', 'auto']} 
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '10px' }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    p3: '%3', p15: '%15', p50: '%50', p85: '%85', p97: '%97', kilo: 'Çocuk'
                  };
                  return labels[value] || value;
                }}
              />
              <Line type="monotone" dataKey="p97" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.4} />
              <Line type="monotone" dataKey="p85" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.5} />
              <Line type="monotone" dataKey="p50" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} dot={false} opacity={0.6} />
              <Line type="monotone" dataKey="p15" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.5} />
              <Line type="monotone" dataKey="p3" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.4} />
              <Line
                type="monotone"
                dataKey="kilo"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={3}
                dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2, r: 5 }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Head Circumference Chart */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">Baş Çevresi (cm)</h4>
          <span className="text-xs text-muted-foreground">WHO Persentil Eğrileri</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={headData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="ageMonths" 
                type="number"
                domain={[0, 'dataMax']}
                tick={{ fontSize: 10 }} 
                tickFormatter={formatXAxisTick}
                className="text-muted-foreground"
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                domain={['auto', 'auto']} 
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '10px' }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    p3: '%3', p15: '%15', p50: '%50', p85: '%85', p97: '%97', basCevresi: 'Çocuk'
                  };
                  return labels[value] || value;
                }}
              />
              <Line type="monotone" dataKey="p97" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.4} />
              <Line type="monotone" dataKey="p85" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.5} />
              <Line type="monotone" dataKey="p50" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} dot={false} opacity={0.6} />
              <Line type="monotone" dataKey="p15" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.5} />
              <Line type="monotone" dataKey="p3" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="2 2" dot={false} opacity={0.4} />
              <Line
                type="monotone"
                dataKey="basCevresi"
                stroke="hsl(280, 67%, 50%)"
                strokeWidth={3}
                dot={{ fill: "hsl(280, 67%, 50%)", strokeWidth: 2, r: 5 }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
