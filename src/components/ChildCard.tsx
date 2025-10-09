import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { calculateAge } from "@/lib/ageCalculations";
import { EditChildDialog } from "./EditChildDialog";
import { getZodiacSign } from "@/lib/zodiacUtils";

interface ChildCardProps {
  id: string;
  name: string;
  birthdate: string;
  gender: string;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export const ChildCard = ({ id, name, birthdate, gender, onDelete, onUpdate }: ChildCardProps) => {
  const navigate = useNavigate();
  const age = calculateAge(birthdate);
  const zodiacSign = getZodiacSign(birthdate);

  const getPrimaryDisplay = () => {
    if (age.years >= 1) {
      return { value: age.years, unit: age.years === 1 ? "year" : "years" };
    } else if (age.months >= 1) {
      return { value: age.months, unit: age.months === 1 ? "month" : "months" };
    } else if (age.weeks >= 1) {
      return { value: age.weeks, unit: age.weeks === 1 ? "week" : "weeks" };
    } else {
      return { value: age.days, unit: age.days === 1 ? "day" : "days" };
    }
  };

  const primary = getPrimaryDisplay();

  return (
    <Card className="shadow-soft hover:shadow-lg transition-shadow" data-theme={gender}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold">{name}</CardTitle>
          <div className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-full text-xs">
            <span className="text-base">{zodiacSign.emoji}</span>
            <span className="text-muted-foreground">{zodiacSign.name}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <EditChildDialog
            id={id}
            name={name}
            birthdate={birthdate}
            gender={gender}
            onChildUpdated={onUpdate}
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
        <div className="space-y-4">
          <div className="text-center p-6 bg-gradient-warm rounded-lg">
            <div className="text-5xl font-bold text-primary-foreground">
              {primary.value}
            </div>
            <div className="text-xl text-primary-foreground mt-2">
              {primary.unit} old
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className="font-semibold text-lg text-foreground">{age.days}</div>
              <div className="text-muted-foreground">{age.days === 1 ? "day" : "days"}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className="font-semibold text-lg text-foreground">{age.weeks}</div>
              <div className="text-muted-foreground">{age.weeks === 1 ? "week" : "weeks"}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className="font-semibold text-lg text-foreground">{age.months}</div>
              <div className="text-muted-foreground">{age.months === 1 ? "month" : "months"}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className="font-semibold text-lg text-foreground">{age.years}</div>
              <div className="text-muted-foreground">{age.years === 1 ? "year" : "years"}</div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => navigate(`/milestones/${id}`)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            View Milestones
          </Button>
          
          <div className="text-xs text-muted-foreground text-center pt-2">
            Born on {new Date(birthdate).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
