import confetti from "canvas-confetti";

export interface CelebrationInfo {
  type: "year" | "month" | "week";
  value: number;
  message: string;
}

export const checkForCelebration = (birthdate: string): CelebrationInfo | null => {
  const birth = new Date(birthdate);
  const now = new Date();
  
  // Calculate exact differences
  const diffMs = now.getTime() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  const diffYears = now.getFullYear() - birth.getFullYear();
  
  // Check if today is exactly a year (priority 1)
  const isExactYear = 
    now.getDate() === birth.getDate() && 
    now.getMonth() === birth.getMonth() && 
    diffYears > 0;
  
  if (isExactYear) {
    return {
      type: "year",
      value: diffYears,
      message: `🎉 ${diffYears} yaşına girdi! Doğum günü kutlu olsun!`
    };
  }
  
  // Check if today is exactly a month (priority 2)
  const isExactMonth = 
    now.getDate() === birth.getDate() && 
    diffMonths > 0;
  
  if (isExactMonth) {
    return {
      type: "month",
      value: diffMonths,
      message: `🎊 ${diffMonths}. ayına girdi!`
    };
  }
  
  // Check if today is exactly a week (priority 3)
  const dayOfWeek = birth.getDay();
  const isExactWeek = 
    now.getDay() === dayOfWeek && 
    diffWeeks > 0 && 
    diffDays % 7 === 0;
  
  if (isExactWeek) {
    return {
      type: "week",
      value: diffWeeks,
      message: `✨ ${diffWeeks}. haftasını tamamladı!`
    };
  }
  
  return null;
};

export const triggerCelebration = (type: "year" | "month" | "week") => {
  const duration = type === "year" ? 5000 : type === "month" ? 3000 : 2000;
  const particleCount = type === "year" ? 200 : type === "month" ? 150 : 100;
  
  // First burst
  confetti({
    particleCount,
    spread: 70,
    origin: { y: 0.6 },
    colors: type === "year" 
      ? ["#FFD700", "#FFA500", "#FF6347", "#FF1493"]
      : type === "month"
      ? ["#FF69B4", "#FFB6C1", "#DDA0DD"]
      : ["#87CEEB", "#98D8C8", "#F7DC6F"]
  });
  
  // Second burst with delay
  setTimeout(() => {
    confetti({
      particleCount: particleCount / 2,
      spread: 100,
      origin: { y: 0.7 },
      startVelocity: 45
    });
  }, 250);
  
  // Continuous celebration for years
  if (type === "year") {
    const end = Date.now() + duration;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FFD700", "#FFA500"]
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FF6347", "#FF1493"]
      });
    }, 200);
  }
};
