// Placeholder menu for the concept. Prices are illustrative.
export type Tag = "raw" | "shellfish" | "gf" | "veg";

export const tagLabels: Record<Tag, { short: string; long: string }> = {
  raw: { short: "Raw", long: "Served raw" },
  shellfish: { short: "SF", long: "Contains shellfish" },
  gf: { short: "GF", long: "Gluten-free" },
  veg: { short: "V", long: "Vegetarian" },
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: Tag[];
  soldOut?: boolean;
};

export type MenuSection = {
  id: string;
  title: string;
  blurb: string;
  dish?: "clams" | "porgy" | "tomato" | "cake";
  items: MenuItem[];
};

export const menu: MenuSection[] = [
  {
    id: "raw-cold",
    title: "Raw and cold",
    blurb: "Shucked to order at the raw bar. Ask what came in this morning.",
    dish: "tomato",
    items: [
      { id: "oysters", name: "East Coast oysters, half dozen", description: "Shallot mignonette, lemon, hot sauce on the side", price: 21, tags: ["raw", "shellfish", "gf"] },
      { id: "crudo", name: "Fluke crudo", description: "Grapefruit, Fresno chili, green olive oil", price: 18, tags: ["raw", "gf"] },
      { id: "tomatoes", name: "Heirloom tomatoes", description: "Stracciatella, torn basil, lemon olive oil", price: 16, tags: ["veg", "gf"] },
      { id: "shrimp", name: "Chilled shrimp", description: "Smoked cocktail sauce, celery salt", price: 19, tags: ["shellfish", "gf"] },
    ],
  },
  {
    id: "small",
    title: "Small plates",
    blurb: "Built for the middle of the table.",
    dish: "clams",
    items: [
      { id: "clams", name: "Littleneck clams", description: "Charred tomato broth, parsley, grilled sourdough for dunking", price: 24, tags: ["shellfish"] },
      { id: "squid", name: "Grilled squid", description: "Corona beans, salsa verde, lemon", price: 19, tags: ["gf"] },
      { id: "sourdough", name: "Grilled sourdough", description: "Cultured butter, flaky salt", price: 7, tags: ["veg"] },
      { id: "fries", name: "Old Bay fries", description: "Lemon aioli", price: 9, tags: ["veg", "gf"] },
    ],
  },
  {
    id: "grill",
    title: "From the grill",
    blurb: "Cooked over split oak. Whole fish changes with the catch.",
    dish: "porgy",
    items: [
      { id: "porgy", name: "Whole porgy", description: "Romesco, lemon, parsley. Deboned on request", price: 34, tags: ["gf"] },
      { id: "scallops", name: "Sea scallops", description: "Sweet corn, brown butter, chive", price: 36, tags: ["shellfish", "gf"], soldOut: true },
      { id: "burger", name: "Saltline smash burger", description: "Two patties, American cheese, pickles, fries", price: 21, tags: [] },
      { id: "cauliflower", name: "Charred cauliflower", description: "Tahini, chili crisp, soft herbs", price: 22, tags: ["veg"] },
    ],
  },
  {
    id: "sweets",
    title: "Sweets",
    blurb: "One cake, one cone, both worth saving room for.",
    dish: "cake",
    items: [
      { id: "cake", name: "Olive-oil cake", description: "Roasted rhubarb, whipped cream, mint", price: 12, tags: ["veg"] },
      { id: "soft-serve", name: "Soft serve", description: "Brown butter caramel, sea salt", price: 9, tags: ["veg", "gf"] },
    ],
  },
  {
    id: "drinks",
    title: "Drinks",
    blurb: "Cold, salty, citrusy. Full list at the table.",
    items: [
      { id: "spritz", name: "Saltline spritz", description: "Bitter orange aperitivo, cava, saline", price: 15, tags: [] },
      { id: "muscadet", name: "Muscadet, by the glass", description: "Loire Valley, bone dry, made for oysters", price: 14, tags: [] },
      { id: "lager", name: "House lager", description: "Brewed in Brooklyn, 16 oz", price: 8, tags: [] },
      { id: "lemon-soda", name: "Lemon and salt soda", description: "Zero proof, made in house", price: 6, tags: [] },
    ],
  },
];

export const allItems = menu.flatMap((s) => s.items.map((i) => ({ ...i, section: s.id })));
export const itemById = (id: string) => allItems.find((i) => i.id === id);
export const money = (n: number) => `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
