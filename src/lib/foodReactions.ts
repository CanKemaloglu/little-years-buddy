export type FoodReaction = 'loved' | 'liked' | 'neutral' | 'disliked' | 'allergic';

export const FOOD_REACTIONS: Record<FoodReaction, { emoji: string; label: string; color: string; bg: string }> = {
  loved:     { emoji: '😍', label: 'Bayıldı',  color: 'text-pink-600',   bg: 'bg-pink-500/10 border-pink-500/30' },
  liked:     { emoji: '🙂', label: 'Beğendi',  color: 'text-green-600',  bg: 'bg-green-500/10 border-green-500/30' },
  neutral:   { emoji: '😐', label: 'Kararsız', color: 'text-yellow-600', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  disliked:  { emoji: '😕', label: 'Sevmedi',  color: 'text-orange-600', bg: 'bg-orange-500/10 border-orange-500/30' },
  allergic:  { emoji: '⚠️', label: 'Alerji',   color: 'text-red-600',    bg: 'bg-red-500/10 border-red-500/30' },
};

export const REACTION_ORDER: FoodReaction[] = ['loved', 'liked', 'neutral', 'disliked', 'allergic'];
