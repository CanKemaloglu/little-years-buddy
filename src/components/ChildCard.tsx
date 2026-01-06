import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Sparkles, Calendar, Ruler } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { calculateAge } from "@/lib/ageCalculations";
import { EditChildDialog } from "./EditChildDialog";
import { ShareChildDialog } from "./ShareChildDialog";
import { getZodiacSign } from "@/lib/zodiacUtils";
import { getAnimalById } from "@/lib/animalCharacters";
import { supabase } from "@/integrations/supabase/client";

interface ChildCardProps {
  id: string;
  name: string;
  birthdate: string;
  gender: string;
  animal: string;
  userId: string;
  fatherName?: string | null;
  motherName?: string | null;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export const ChildCard = ({ id, name, birthdate, gender, animal, userId, fatherName, motherName, onDelete, onUpdate }: ChildCardProps) => {
  const navigate = useNavigate();
  const age = calculateAge(birthdate);
  const zodiacSign = getZodiacSign(birthdate);
  const animalChar = getAnimalById(animal);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user?.id || null);
    });
  }, []);

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
    <div 
      className="group relative bg-card rounded-3xl p-6 shadow-soft hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-border/50" 
      data-theme={gender}
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-warm rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-500" />
      
      {/* Header */}
      <div className="relative flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-warm flex items-center justify-center shadow-md">
              <span className={`text-3xl ${animalChar.animation}`}>{animalChar.emoji}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-sm">
              <span className="text-xs">{zodiacSign.emoji}</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground tracking-tight">{name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              {new Date(birthdate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ShareChildDialog childId={id} childName={name} isOwner={currentUser === userId} />
          <EditChildDialog
            id={id}
            name={name}
            birthdate={birthdate}
            gender={gender}
            animal={animal}
            fatherName={fatherName}
            motherName={motherName}
            onChildUpdated={onUpdate}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Age Display */}
      <div className="relative mb-6">
        <div className="text-center py-8 px-4 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border border-primary/10">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-black text-primary tracking-tighter">
              {primary.value}
            </span>
            <span className="text-xl font-medium text-primary/70">
              {primary.unit}
            </span>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { value: age.days, label: 'gün' },
          { value: age.weeks, label: 'hafta' },
          { value: age.months, label: 'ay' },
          { value: age.years, label: 'yıl' },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="text-center p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-300"
          >
            <div className="text-lg font-bold text-foreground">{stat.value}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Parents */}
      {(fatherName || motherName) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {fatherName && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 rounded-full text-xs">
              <span>👨</span>
              <span className="text-muted-foreground">{fatherName}</span>
            </div>
          )}
          {motherName && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 rounded-full text-xs">
              <span>👩</span>
              <span className="text-muted-foreground">{motherName}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1 rounded-xl h-12 font-medium border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group/btn"
          onClick={() => navigate(`/milestones/${id}`)}
        >
          <Sparkles className="mr-2 h-4 w-4 group-hover/btn:animate-pulse" />
          Anılar
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 rounded-xl h-12 font-medium border-green-500/20 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 group/btn"
          onClick={() => navigate(`/measurements/${id}`)}
        >
          <Ruler className="mr-2 h-4 w-4" />
          Ölçümler
        </Button>
      </div>
    </div>
  );
};
