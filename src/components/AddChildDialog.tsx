import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { animals } from "@/lib/animalCharacters";

interface AddChildDialogProps {
  onChildAdded: () => void;
}

export const AddChildDialog = ({ onChildAdded }: AddChildDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("neutral");
  const [animal, setAnimal] = useState("bunny");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    if (!birthdate) {
      toast.error("Please select a birthdate");
      return;
    }

    const selectedDate = new Date(birthdate);
    const today = new Date();
    
    if (selectedDate > today) {
      toast.error("Birthdate cannot be in the future");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      const { error } = await supabase
        .from("children")
        .insert([
          {
            user_id: user.id,
            name: name.trim(),
            birthdate,
            gender,
            animal,
          },
        ]);

      if (error) throw error;

      toast.success(`${name} has been added!`);
      setName("");
      setBirthdate("");
      setGender("neutral");
      setAnimal("bunny");
      setOpen(false);
      onChildAdded();
    } catch (error) {
      console.error("Error adding child:", error);
      toast.error("Failed to add child");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto shadow-soft">
          <Plus className="mr-2 h-4 w-4" /> Add Child
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Child</DialogTitle>
          <DialogDescription>
            Enter your child's name and birthdate to start tracking their growth.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Child's Name</Label>
            <Input
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthdate">Birthdate</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup value={gender} onValueChange={setGender}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="girl" id="girl" />
                <Label htmlFor="girl" className="font-normal cursor-pointer">
                  Kız
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="boy" id="boy" />
                <Label htmlFor="boy" className="font-normal cursor-pointer">
                  Erkek
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="neutral" />
                <Label htmlFor="neutral" className="font-normal cursor-pointer">
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
                  onClick={() => setAnimal(a.id)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                    animal === a.id
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
            {loading ? "Adding..." : "Add Child"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
