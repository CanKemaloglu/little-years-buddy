import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MilestoneCard } from "@/components/MilestoneCard";
import { AddMilestoneDialog } from "@/components/AddMilestoneDialog";
import { ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Child {
  id: string;
  name: string;
  birthdate: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  milestone_date: string;
  photo_url: string | null;
}

const Milestones = () => {
  const navigate = useNavigate();
  const { childId } = useParams();
  const [child, setChild] = useState<Child | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChildAndMilestones = async () => {
    try {
      // Fetch child details
      const { data: childData, error: childError } = await supabase
        .from("children")
        .select("*")
        .eq("id", childId)
        .single();

      if (childError) throw childError;
      setChild(childData);

      // Fetch milestones
      const { data: milestonesData, error: milestonesError } = await supabase
        .from("milestones")
        .select("*")
        .eq("child_id", childId)
        .order("milestone_date", { ascending: false });

      if (milestonesError) throw milestonesError;
      setMilestones(milestonesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load milestones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!childId) {
      navigate("/");
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        fetchChildAndMilestones();
      }
    });
  }, [childId, navigate]);

  const handleDeleteMilestone = async (id: string) => {
    try {
      const { error } = await supabase
        .from("milestones")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Milestone deleted");
      fetchChildAndMilestones();
    } catch (error) {
      console.error("Error deleting milestone:", error);
      toast.error("Failed to delete milestone");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <div className="text-center">
          <Sparkles className="w-12 h-12 animate-pulse mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Loading milestones...</p>
        </div>
      </div>
    );
  }

  if (!child) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mb-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{child.name}'s Milestones</h1>
              <p className="text-sm text-muted-foreground">
                Precious moments and memories
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <AddMilestoneDialog
            childId={child.id}
            childBirthdate={child.birthdate}
            onMilestoneAdded={fetchChildAndMilestones}
          />
        </div>

        {milestones.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No milestones yet</h3>
            <p className="text-muted-foreground mb-6">
              Start capturing precious moments in {child.name}'s life
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Memory Timeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  id={milestone.id}
                  title={milestone.title}
                  description={milestone.description || undefined}
                  milestoneDate={milestone.milestone_date}
                  photoUrl={milestone.photo_url || undefined}
                  childBirthdate={child.birthdate}
                  onDelete={handleDeleteMilestone}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Milestones;
