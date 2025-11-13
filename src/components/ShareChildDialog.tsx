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
  isOwner: boolean;
}

interface SharedUser {
  id: string;
  shared_with_user_id: string;
  email: string;
  role?: 'father' | 'mother' | null;
}

export const ShareChildDialog = ({ childId, childName, isOwner }: ShareChildDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<'father' | 'mother'>('father');
  const [loading, setLoading] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);

  useEffect(() => {
    if (open && isOwner) {
      loadSharedUsers();
    }
  }, [open, childId, isOwner]);

  const loadSharedUsers = async () => {
    try {
      const { data: shares, error } = await supabase
        .from("child_shares")
        .select("id, shared_with_user_id, role")
        .eq("child_id", childId);

      if (error) throw error;

      // For now, just show the user IDs since we can't easily get emails without admin
      setSharedUsers(shares?.map(s => ({
        id: s.id,
        shared_with_user_id: s.shared_with_user_id,
        email: s.shared_with_user_id,
        role: s.role
      })) || []);
    } catch (error) {
      console.error("Error loading shared users:", error);
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Lütfen bir e-posta adresi girin");
      return;
    }

    setLoading(true);

    try {
      // We'll use a Supabase edge function to handle this
      const { data, error } = await supabase.functions.invoke('share-child', {
        body: {
          childId,
          email: email.trim(),
          role: role
        }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      toast.success("Çocuk başarıyla paylaşıldı!");
      setEmail("");
      setRole('father');
      loadSharedUsers();
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
      loadSharedUsers();
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
          <DialogTitle>{childName} - Aile Hesabı Yönetimi</DialogTitle>
        </DialogHeader>
        
        {isOwner ? (
          <div className="space-y-4">
            <form onSubmit={handleShare} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Kullanıcı E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kullanici@ornek.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Rol</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={role === 'father' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setRole('father')}
                  >
                    👨 Baba
                  </Button>
                  <Button
                    type="button"
                    variant={role === 'mother' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setRole('mother')}
                  >
                    👩 Anne
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Paylaşılıyor..." : "Paylaş"}
              </Button>
            </form>

            {sharedUsers.length > 0 && (
              <div className="space-y-2">
                <Label>Paylaşılan Kullanıcılar</Label>
                <div className="space-y-2">
                  {sharedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {user.role === 'father' ? '👨' : user.role === 'mother' ? '👩' : '👤'}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm">{user.email}</span>
                          <span className="text-xs text-muted-foreground">
                            {user.role === 'father' ? 'Baba' : user.role === 'mother' ? 'Anne' : 'Rol seçilmemiş'}
                          </span>
                        </div>
                      </div>
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
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Bu çocuk sizinle paylaşılmış bir çocuktur.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
