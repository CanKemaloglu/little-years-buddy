import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { animals } from "@/lib/animalCharacters";

interface EditChildDialogProps {
  id: string;
  name: string;
  birthdate: string;
  gender: string;
  animal: string;
  onChildUpdated: () => void;
}

export const EditChildDialog = ({ id, name, birthdate, gender, animal, onChildUpdated }: EditChildDialogProps) => {
  const [open, setOpen] = useState(false);
  const [childName, setChildName] = useState(name);
  const [childBirthdate, setChildBirthdate] = useState(birthdate);
  const [childGender, setChildGender] = useState(gender);
  const [childAnimal, setChildAnimal] = useState(animal);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!childName.trim()) {
      toast.error("Lütfen çocuğun ismini girin");
      return;
    }

    if (!childBirthdate) {
      toast.error("Lütfen doğum tarihini seçin");
      return;
    }

    const birthdateObj = new Date(childBirthdate);
    const today = new Date();
    if (birthdateObj > today) {
      toast.error("Doğum tarihi gelecekte olamaz");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("children")
        .update({
          name: childName.trim(),
          birthdate: childBirthdate,
          gender: childGender,
          animal: childAnimal,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Çocuk bilgileri güncellendi!");
      setOpen(false);
      onChildUpdated();
    } catch (error) {
      console.error("Error updating child:", error);
      toast.error("Bilgiler güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Çocuk Bilgilerini Düzenle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">İsim</Label>
            <Input
              id="edit-name"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Çocuğun ismi"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-birthdate">Doğum Tarihi</Label>
            <Input
              id="edit-birthdate"
              type="date"
              value={childBirthdate}
              onChange={(e) => setChildBirthdate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Cinsiyet</Label>
            <RadioGroup value={childGender} onValueChange={setChildGender}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="girl" id="edit-girl" />
                <Label htmlFor="edit-girl" className="font-normal cursor-pointer">
                  Kız
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="boy" id="edit-boy" />
                <Label htmlFor="edit-boy" className="font-normal cursor-pointer">
                  Erkek
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="edit-neutral" />
                <Label htmlFor="edit-neutral" className="font-normal cursor-pointer">
                  Cinsiyetçi davranmak istemiyorum
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Karakter</Label>
            <div className="grid grid-cols-5 gap-2">
              {animals.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setChildAnimal(a.id)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                    childAnimal === a.id
                      ? "border-primary bg-primary/10 scale-110"
                      : "border-muted hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl">{a.emoji}</div>
                  <div className="text-xs mt-1">{a.name}</div>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Güncelleniyor..." : "Güncelle"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
