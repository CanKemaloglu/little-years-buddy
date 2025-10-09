export interface AnimalCharacter {
  id: string;
  name: string;
  emoji: string;
  animation: string;
}

export const animals: AnimalCharacter[] = [
  {
    id: 'bunny',
    name: 'Tavşan',
    emoji: '🐰',
    animation: 'animate-bounce'
  },
  {
    id: 'bear',
    name: 'Ayı',
    emoji: '🐻',
    animation: 'animate-wiggle'
  },
  {
    id: 'fox',
    name: 'Tilki',
    emoji: '🦊',
    animation: 'animate-sway'
  },
  {
    id: 'panda',
    name: 'Panda',
    emoji: '🐼',
    animation: 'animate-float'
  },
  {
    id: 'koala',
    name: 'Koala',
    emoji: '🐨',
    animation: 'animate-wave'
  }
];

export function getAnimalById(id: string): AnimalCharacter {
  return animals.find(a => a.id === id) || animals[0];
}
