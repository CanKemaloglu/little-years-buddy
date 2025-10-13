import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ShareChildDialogProps {
  childId: string;
  childName: string;
}

interface SharedUser {
  id: string;
  shared_with_user_id: string;
  email?: string;
}

export const ShareChildDialog = ({ childId, childName }: ShareChildDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);

  const fetchSharedUsers = async () => {
    const { data, error } = await supabase
      .from("child_shares")
      .select("id, shared_with_user_id")
      .eq("child_id", childId);

    if (error) {
      console.error("Error fetching shared users:", error);
      return;
    }

    setSharedUsers(data || []);
  };

  useEffect(() => {
    if (open) {
      fetchSharedUsers();
    }
  }, [open, childId]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Lütfen email adresi girin");
      return;
    }

    setLoading(true);

    try {
      // First, check if user exists (we can't query auth.users directly, so we'll try to insert and handle errors)
      const { data: currentUser } = await supabase.auth.getUser();
      
      if (!currentUser.user) {
        toast.error("Oturum açmanız gerekiyor");
        return;
      }

      // Try to share - if user doesn't exist or other error, it will fail
      const { error } = await supabase
        .from("child_shares")
        .insert({
          child_id: childId,
          shared_with_user_id: email.trim(), // Note: In production, you'd need to look up user ID by email
          created_by: currentUser.user.id,
        });

      if (error) {
        if (error.code === "23505") {
          toast.error("Bu kullanıcı zaten paylaşıldı");
        } else {
          throw error;
        }
      } else {
        toast.success(`${childName} ${email} ile paylaşıldı!`);
        setEmail("");
        fetchSharedUsers();
      }
    } catch (error) {
      console.error("Error sharing child:", error);
      toast.error("Paylaşım sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveShare = async (shareId: string) => {
    try {
      const { error } = await supabase
        .from("child_shares")
        .delete()
        .eq("id", shareId);

      if (error) throw error;

      toast.success("Paylaşım kaldırıldı");
      fetchSharedUsers();
    } catch (error) {
      console.error("Error removing share:", error);
      toast.error("Paylaşım kaldırılırken bir hata oluştu");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{childName} - Aile Paylaşımı</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleShare} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Adresi</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
            />
            <p className="text-sm text-muted-foreground">
              Bu email adresine sahip kullanıcı çocuğunuzu görebilecek ve düzenleyebilecek
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Paylaşılıyor..." : "Paylaş"}
          </Button>
        </form>

        {sharedUsers.length > 0 && (
          <div className="mt-6 space-y-2">
            <Label>Paylaşılan Kullanıcılar</Label>
            <div className="space-y-2">
              {sharedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted"
                >
                  <span className="text-sm">{user.shared_with_user_id}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveShare(user.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
