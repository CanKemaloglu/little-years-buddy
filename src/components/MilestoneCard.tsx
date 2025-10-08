import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import { calculateAge } from "@/lib/ageCalculations";
import { EditMilestoneDialog } from "./EditMilestoneDialog";

interface MilestoneCardProps {
  id: string;
  title: string;
  description?: string;
  milestoneDate: string;
  photoUrl?: string;
  childBirthdate: string;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export const MilestoneCard = ({
  id,
  title,
  description,
  milestoneDate,
  photoUrl,
  childBirthdate,
  onDelete,
  onUpdate,
}: MilestoneCardProps) => {
  const age = calculateAge(childBirthdate, new Date(milestoneDate));
  const formattedDate = new Date(milestoneDate).toLocaleDateString();

  return (
    <Card className="overflow-hidden shadow-soft hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="flex gap-1">
          <EditMilestoneDialog
            id={id}
            title={title}
            description={description}
            milestoneDate={milestoneDate}
            photoUrl={photoUrl}
            onMilestoneUpdated={onUpdate}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {photoUrl && (
          <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
            <img
              src={photoUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {description && (
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>

          <div className="bg-primary/10 p-3 rounded-lg">
            <div className="font-semibold text-primary">
              Yaş: {age.years > 0 && `${age.years} yıl `}
              {age.months % 12 > 0 && `${age.months % 12} ay `}
              ({age.days} gün)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
