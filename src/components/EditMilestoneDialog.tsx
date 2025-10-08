import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditMilestoneDialogProps {
  id: string;
  title: string;
  description?: string;
  milestoneDate: string;
  photoUrl?: string;
  onMilestoneUpdated: () => void;
}

export const EditMilestoneDialog = ({
  id,
  title: initialTitle,
  description: initialDescription,
  milestoneDate: initialDate,
  photoUrl: initialPhotoUrl,
  onMilestoneUpdated,
}: EditMilestoneDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription || "");
  const [milestoneDate, setMilestoneDate] = useState(initialDate);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(initialPhotoUrl);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Lütfen bir başlık girin");
      return;
    }

    if (!milestoneDate) {
      toast.error("Lütfen bir tarih seçin");
      return;
    }

    setLoading(true);

    try {
      let photoUrl = initialPhotoUrl;

      if (photo) {
        const fileExt = photo.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("milestone-photos")
          .upload(filePath, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("milestone-photos")
          .getPublicUrl(filePath);

        photoUrl = publicUrl;
      } else if (!photoPreview) {
        photoUrl = null;
      }

      const { error } = await supabase
        .from("milestones")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          milestone_date: milestoneDate,
          photo_url: photoUrl,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Milestone güncellendi!");
      setOpen(false);
      onMilestoneUpdated();
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast.error("Milestone güncellenirken bir hata oluştu");
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Milestone Düzenle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Başlık</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: İlk adımlar"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Açıklama (Opsiyonel)</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bu özel anı anlat..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-date">Tarih</Label>
            <Input
              id="edit-date"
              type="date"
              value={milestoneDate}
              onChange={(e) => setMilestoneDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Fotoğraf</Label>
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemovePhoto}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Input
                  id="edit-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Label
                  htmlFor="edit-photo"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Fotoğraf yüklemek için tıklayın
                  </span>
                </Label>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Güncelleniyor..." : "Güncelle"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
