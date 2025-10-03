import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Calendar, Baby } from "lucide-react";
import { format } from "date-fns";
import { calculateAge } from "@/lib/ageCalculations";

interface MilestoneCardProps {
  id: string;
  title: string;
  description?: string;
  milestoneDate: string;
  photoUrl?: string;
  childBirthdate: string;
  onDelete: (id: string) => void;
}

export const MilestoneCard = ({
  id,
  title,
  description,
  milestoneDate,
  photoUrl,
  childBirthdate,
  onDelete,
}: MilestoneCardProps) => {
  const age = calculateAge(childBirthdate, new Date(milestoneDate));
  const formattedDate = format(new Date(milestoneDate), "MMM dd, yyyy");

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {photoUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={photoUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-primary">
            <Baby className="h-4 w-4" />
            <span className="font-medium">
              Age: {age.years > 0 && `${age.years} year${age.years > 1 ? 's' : ''} `}
              {age.months % 12 > 0 && `${age.months % 12} month${age.months % 12 > 1 ? 's' : ''} `}
              ({age.days} days)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
