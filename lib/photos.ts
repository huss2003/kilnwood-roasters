// Photography from Unsplash (free to use under the Unsplash License).
const u = (id: string, q: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75&${q}`;

export const HERO = u("1610632380989-680fe40816c6", "w=1600");

export const DECK = [
  { src: u("1447933601403-0c6688de566e", "w=700&h=875"), label: "Roasted" },
  { src: u("1442512595331-e89e73853f31", "w=700&h=875"), label: "Brewed" },
  { src: u("1521302080334-4bebac2763a6", "w=700&h=875"), label: "Poured" },
  { src: u("1514432324607-a09d9b4aefdd", "w=700&h=875"), label: "Tasted" },
  { src: HERO, label: "Yours" },
];
