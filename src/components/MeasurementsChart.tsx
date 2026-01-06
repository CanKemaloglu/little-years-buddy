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
} from "recharts";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Measurement {
  id: string;
  measurement_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  head_circumference_cm: number | null;
}

interface MeasurementsChartProps {
  measurements: Measurement[];
}

export const MeasurementsChart = ({ measurements }: MeasurementsChartProps) => {
  const chartData = useMemo(() => {
    return [...measurements]
      .sort((a, b) => new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime())
      .map((m) => ({
        date: format(new Date(m.measurement_date), "dd MMM yy", { locale: tr }),
        fullDate: m.measurement_date,
        boy: m.height_cm,
        kilo: m.weight_kg,
        basCevresi: m.head_circumference_cm,
      }));
  }, [measurements]);

  if (measurements.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Henüz ölçüm verisi yok
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Height Chart */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Boy (cm)</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} domain={['dataMin - 5', 'dataMax + 5']} className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Line
                type="monotone"
                dataKey="boy"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weight Chart */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Kilo (kg)</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} domain={['dataMin - 1', 'dataMax + 1']} className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Line
                type="monotone"
                dataKey="kilo"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={2}
                dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Head Circumference Chart */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Baş Çevresi (cm)</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} domain={['dataMin - 2', 'dataMax + 2']} className="text-muted-foreground" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Line
                type="monotone"
                dataKey="basCevresi"
                stroke="hsl(280, 67%, 50%)"
                strokeWidth={2}
                dot={{ fill: "hsl(280, 67%, 50%)", strokeWidth: 2 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
