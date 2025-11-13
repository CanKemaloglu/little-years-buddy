import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { ChildCard } from "@/components/ChildCard";
import { AddChildDialog } from "@/components/AddChildDialog";
import { LogOut, Baby } from "lucide-react";
import { toast } from "sonner";
import { checkForCelebration, triggerCelebration } from "@/lib/celebrationUtils";
import { AIChatDialog } from "@/components/AIChatDialog";

interface Child {
  id: string;
  name: string;
  birthdate: string;
  gender: string;
  animal: string;
  user_id: string;
  father_name?: string | null;
  mother_name?: string | null;
}

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setChildren(data || []);
      
      // Check for celebrations
      data?.forEach((child) => {
        const celebration = checkForCelebration(child.birthdate);
        if (celebration) {
          toast.success(celebration.message, {
            duration: celebration.type === "year" ? 8000 : celebration.type === "month" ? 5000 : 3000,
          });
          triggerCelebration(celebration.type);
        }
      });
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error("Failed to load children");
    }
  };

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchChildren();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  const handleDeleteChild = async (id: string) => {
    try {
      const { error } = await supabase
        .from("children")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Child removed");
      fetchChildren();
    } catch (error) {
      console.error("Error deleting child:", error);
      toast.error("Failed to remove child");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <div className="text-center">
          <Baby className="w-12 h-12 animate-pulse mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-warm" data-theme="neutral">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Baby className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Little Tracker</h1>
          </div>
          <div className="flex items-center gap-2">
            <AIChatDialog />
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your Children</h2>
            <p className="text-muted-foreground">
              Track and celebrate every milestone
            </p>
          </div>
          <AddChildDialog onChildAdded={fetchChildren} />
        </div>

        {children.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Baby className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No children yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your first child to start tracking their growth
            </p>
            <AddChildDialog onChildAdded={fetchChildren} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                id={child.id}
                name={child.name}
                birthdate={child.birthdate}
                gender={child.gender}
                animal={child.animal}
                userId={child.user_id}
                fatherName={child.father_name}
                motherName={child.mother_name}
                onDelete={handleDeleteChild}
                onUpdate={fetchChildren}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
