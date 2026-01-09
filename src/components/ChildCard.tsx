import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Sparkles, Calendar, Ruler, Scale, Circle, Cake } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { differenceInMonths, differenceInDays, addMonths, differenceInCalendarDays } from "date-fns";
import { calculateAge } from "@/lib/ageCalculations";
import { EditChildDialog } from "./EditChildDialog";
import { ShareChildDialog } from "./ShareChildDialog";
import { getZodiacSign } from "@/lib/zodiacUtils";
import { getAnimalById } from "@/lib/animalCharacters";
import { supabase } from "@/integrations/supabase/client";

interface Measurement {
  height_cm: number | null;
  weight_kg: number | null;
  head_circumference_cm: number | null;
  measurement_date: string;
}

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
  const [latestMeasurement, setLatestMeasurement] = useState<Measurement | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user?.id || null);
    });
    
    // Fetch latest measurement
    supabase
      .from('measurements')
      .select('height_cm, weight_kg, head_circumference_cm, measurement_date')
      .eq('child_id', id)
      .order('measurement_date', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setLatestMeasurement(data);
        }
      });
  }, [id]);

  const getDetailedAge = () => {
    const birth = new Date(birthdate);
    const today = new Date();
    const totalMonths = differenceInMonths(today, birth);
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const dateAfterMonths = addMonths(birth, totalMonths);
    const days = differenceInDays(today, dateAfterMonths);

    if (years >= 1) {
      if (months > 0) {
        return `${years} yıl ${months} ay ${days} günlük`;
      }
      return `${years} yıl ${days} günlük`;
    } else if (totalMonths >= 1) {
      return `${totalMonths} ay ${days} günlük`;
    } else if (age.weeks >= 1) {
      const remainingDays = age.days % 7;
      return `${age.weeks} hafta ${remainingDays} günlük`;
    } else {
      return `${age.days} günlük`;
    }
  };

  const getDaysUntilBirthday = () => {
    const today = new Date();
    const birth = new Date(birthdate);
    
    // Next birthday this year
    let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    
    // If birthday has passed this year, get next year's birthday
    if (nextBirthday < today) {
      nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    
    return differenceInCalendarDays(nextBirthday, today);
  };

  const daysUntilBirthday = getDaysUntilBirthday();

  const detailedAge = getDetailedAge();

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
        <div className="text-center py-6 px-4 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border border-primary/10">
          <div className="text-xs text-muted-foreground mb-2">
            {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <span className="text-2xl font-bold text-primary tracking-tight">
            {detailedAge}
          </span>
          
          {/* Birthday Countdown */}
          <div className="mt-4 pt-4 border-t border-primary/10">
            <div className="flex items-center justify-center gap-2">
              <div className="relative">
                <Cake className="w-5 h-5 text-pink-500 animate-bounce" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {daysUntilBirthday === 0 ? (
                  <span className="text-pink-500 font-bold">🎉 Bugün doğum günü! 🎉</span>
                ) : (
                  <>Doğum gününe <span className="text-pink-500 font-bold">{daysUntilBirthday}</span> gün</>
                )}
              </span>
              <div className="relative">
                <Cake className="w-5 h-5 text-pink-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
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
      
      {/* Latest Measurements */}
      {latestMeasurement && (latestMeasurement.height_cm || latestMeasurement.weight_kg || latestMeasurement.head_circumference_cm) && (
        <div className="mb-6">
          <div className="text-xs text-muted-foreground text-center mb-2">
            Son ölçüm: {new Date(latestMeasurement.measurement_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {latestMeasurement.height_cm && (
              <div className="text-center p-2 rounded-xl bg-primary/10 border border-primary/20">
                <Ruler className="w-4 h-4 mx-auto text-primary mb-1" />
                <div className="text-sm font-bold text-foreground">{latestMeasurement.height_cm}</div>
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">cm</div>
              </div>
            )}
            {latestMeasurement.weight_kg && (
              <div className="text-center p-2 rounded-xl bg-green-500/10 border border-green-500/20">
                <Scale className="w-4 h-4 mx-auto text-green-600 mb-1" />
                <div className="text-sm font-bold text-foreground">{latestMeasurement.weight_kg}</div>
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">kg</div>
              </div>
            )}
            {latestMeasurement.head_circumference_cm && (
              <div className="text-center p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Circle className="w-4 h-4 mx-auto text-purple-600 mb-1" />
                <div className="text-sm font-bold text-foreground">{latestMeasurement.head_circumference_cm}</div>
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">cm</div>
              </div>
            )}
          </div>
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
