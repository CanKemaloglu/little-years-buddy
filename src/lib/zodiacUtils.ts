export interface ZodiacSign {
  name: string;
  symbol: string;
  emoji: string;
}

export function getZodiacSign(birthdate: string): ZodiacSign {
  const date = new Date(birthdate);
  const day = date.getDate();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return { name: "Koç", symbol: "♈", emoji: "🐏" };
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return { name: "Boğa", symbol: "♉", emoji: "🐂" };
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return { name: "İkizler", symbol: "♊", emoji: "👯" };
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return { name: "Yengeç", symbol: "♋", emoji: "🦀" };
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return { name: "Aslan", symbol: "♌", emoji: "🦁" };
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return { name: "Başak", symbol: "♍", emoji: "👧" };
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return { name: "Terazi", symbol: "♎", emoji: "⚖️" };
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return { name: "Akrep", symbol: "♏", emoji: "🦂" };
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return { name: "Yay", symbol: "♐", emoji: "🏹" };
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return { name: "Oğlak", symbol: "♑", emoji: "🐐" };
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return { name: "Kova", symbol: "♒", emoji: "🏺" };
  } else {
    return { name: "Balık", symbol: "♓", emoji: "🐟" };
  }
}
