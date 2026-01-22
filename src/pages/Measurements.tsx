import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Ruler, BarChart3, List, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { AddMeasurementDialog } from "@/components/AddMeasurementDialog";
import { EditMeasurementDialog } from "@/components/EditMeasurementDialog";
import { MeasurementsChart } from "@/components/MeasurementsChart";
import { MeasurementsSummary } from "@/components/MeasurementsSummary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Child {
  id: string;
  name: string;
  birthdate: string;
  gender: string;
}

interface Measurement {
  id: string;
  measurement_date: string;
  height_cm: number | null;
  weight_kg: number | null;
  head_circumference_cm: number | null;
  notes: string | null;
  created_at: string;
}

const Measurements = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<Child | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchData = async () => {
    if (!childId) return;

    try {
      // Fetch child info
      const { data: childData, error: childError } = await supabase
        .from("children")
        .select("id, name, birthdate, gender")
        .eq("id", childId)
        .maybeSingle();

      if (childError) throw childError;
      if (!childData) {
        toast.error("Çocuk bulunamadı");
        navigate("/");
        return;
      }
      setChild(childData);

      // Fetch measurements
      const { data: measurementsData, error: measurementsError } = await supabase
        .from("measurements")
        .select("*")
        .eq("child_id", childId)
        .order("measurement_date", { ascending: false });

      if (measurementsError) throw measurementsError;
      setMeasurements(measurementsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Veriler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [childId]);

  const handleDeleteMeasurement = async (measurementId: string) => {
    try {
      const { error } = await supabase
        .from("measurements")
        .delete()
        .eq("id", measurementId);

      if (error) throw error;

      toast.success("Ölçüm silindi");
      fetchData();
    } catch (error) {
      console.error("Error deleting measurement:", error);
      toast.error("Ölçüm silinemedi");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <div className="text-center">
          <Ruler className="w-12 h-12 animate-pulse mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!child) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{child.name}</h1>
              <p className="text-sm text-muted-foreground">Büyüme Ölçümleri</p>
            </div>
          </div>
          <AddMeasurementDialog childId={child.id} onMeasurementAdded={fetchData} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary" className="gap-2">
              <Ruler className="h-4 w-4" />
              Özet
            </TabsTrigger>
            <TabsTrigger value="chart" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Grafik
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              Liste
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ölçüm Özeti</CardTitle>
              </CardHeader>
              <CardContent>
                <MeasurementsSummary measurements={measurements} birthdate={child.birthdate} gender={child.gender} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chart">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Büyüme Grafikleri</CardTitle>
              </CardHeader>
              <CardContent>
                <MeasurementsChart measurements={measurements} birthdate={child.birthdate} gender={child.gender} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tüm Ölçümler</CardTitle>
              </CardHeader>
              <CardContent>
                {measurements.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Henüz ölçüm verisi yok
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tarih</TableHead>
                          <TableHead className="text-right">Boy (cm)</TableHead>
                          <TableHead className="text-right">Kilo (kg)</TableHead>
                          <TableHead className="text-right">Baş Ç. (cm)</TableHead>
                          <TableHead className="text-right">İşlem</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {measurements.map((m) => (
                          <TableRow key={m.id}>
                            <TableCell>
                              {format(new Date(m.measurement_date), "d MMM yyyy", { locale: tr })}
                            </TableCell>
                            <TableCell className="text-right">
                              {m.height_cm ?? "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              {m.weight_kg ?? "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              {m.head_circumference_cm ?? "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setEditingMeasurement(m);
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Ölçümü Sil</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Bu ölçümü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>İptal</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteMeasurement(m.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Sil
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <EditMeasurementDialog
          measurement={editingMeasurement}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onMeasurementUpdated={fetchData}
        />
      </main>
    </div>
  );
};

export default Measurements;
