import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ChildCardProps {
  id: string;
  name: string;
  birthdate: string;
  onDelete: (id: string) => void;
}

export const ChildCard = ({ id, name, birthdate, onDelete }: ChildCardProps) => {
  const today = new Date();
  const birth = new Date(birthdate);

  const days = differenceInDays(today, birth);
  const weeks = Math.floor(differenceInWeeks(today, birth));
  const months = differenceInMonths(today, birth);
  const years = differenceInYears(today, birth);

  const getPrimaryDisplay = () => {
    if (years >= 1) {
      return { value: years, unit: years === 1 ? "year" : "years" };
    } else if (months >= 1) {
      return { value: months, unit: months === 1 ? "month" : "months" };
    } else if (weeks >= 1) {
      return { value: weeks, unit: weeks === 1 ? "week" : "weeks" };
    } else {
      return { value: days, unit: days === 1 ? "day" : "days" };
    }
  };

  const primary = getPrimaryDisplay();

  return (
    <Card className="shadow-soft hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
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
              <div className="font-semibold text-lg text-foreground">{days}</div>
              <div className="text-muted-foreground">{days === 1 ? "day" : "days"}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className="font-semibold text-lg text-foreground">{weeks}</div>
              <div className="text-muted-foreground">{weeks === 1 ? "week" : "weeks"}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className="font-semibold text-lg text-foreground">{months}</div>
              <div className="text-muted-foreground">{months === 1 ? "month" : "months"}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <div className="font-semibold text-lg text-foreground">{years}</div>
              <div className="text-muted-foreground">{years === 1 ? "year" : "years"}</div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground text-center pt-2">
            Born on {new Date(birthdate).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
