// Placeholder details for a fictional restaurant group. Phone numbers use the
// 555-01xx range reserved for fiction.
export type LocationId = "red-hook" | "greenpoint" | "carroll-gardens";

export type Location = {
  id: LocationId;
  neighborhood: string;
  room: string;
  kind: string;
  address: string;
  cityLine: string;
  phone: string;
  intro: string;
  hours: { days: string; time: string }[];
  closedDays: number[]; // 0 = Sunday
  notes: string[];
  seats: number;
  tables: number;
  dish: "clams" | "porgy" | "tomato" | "cake";
};

export const locations: Location[] = [
  {
    id: "red-hook",
    neighborhood: "Red Hook",
    room: "The Dock",
    kind: "Raw bar and wood grill",
    address: "188 Van Brunt St",
    cityLine: "Brooklyn, NY 11231",
    phone: "(718) 555-0142",
    intro:
      "The original room, two blocks from the water. A long marble raw bar, an oak-fired grill you can watch from every seat, and a patio that opens when the harbor warms up.",
    hours: [
      { days: "Tue to Thu", time: "5 to 10 pm" },
      { days: "Fri and Sat", time: "5 to 11 pm" },
      { days: "Sun", time: "11 am to 3 pm, 5 to 9 pm" },
      { days: "Mon", time: "Closed" },
    ],
    closedDays: [1],
    notes: ["Patio seating May to October", "Raw bar seats held for walk-ins", "Step-free entrance on Van Brunt"],
    seats: 70,
    tables: 18,
    dish: "clams",
  },
  {
    id: "greenpoint",
    neighborhood: "Greenpoint",
    room: "The Counter",
    kind: "Counter seats around the grill",
    address: "97 Franklin St",
    cityLine: "Brooklyn, NY 11222",
    phone: "(718) 555-0167",
    intro:
      "A narrow room built around one horseshoe counter, so every seat faces the fire. Lunch every day, a shorter menu after 9, and the place to bring one other person.",
    hours: [
      { days: "Mon to Thu", time: "12 to 10 pm" },
      { days: "Fri and Sat", time: "12 to 11 pm" },
      { days: "Sun", time: "12 to 9 pm" },
    ],
    closedDays: [],
    notes: ["Counter seating only, parties up to 4", "Walk-ins only after 9 pm", "Late menu Friday and Saturday"],
    seats: 32,
    tables: 12,
    dish: "porgy",
  },
  {
    id: "carroll-gardens",
    neighborhood: "Carroll Gardens",
    room: "The Garden",
    kind: "Long tables and a back garden",
    address: "331 Court St",
    cityLine: "Brooklyn, NY 11231",
    phone: "(718) 555-0119",
    intro:
      "A brownstone parlor floor with a garden out back. Big shared plates, long tables for birthdays, and weekend brunch with the grill already going.",
    hours: [
      { days: "Wed to Fri", time: "5 to 10 pm" },
      { days: "Sat and Sun", time: "10 am to 3 pm, 5 to 10 pm" },
      { days: "Mon and Tue", time: "Closed" },
    ],
    closedDays: [1, 2],
    notes: ["Garden open spring to fall", "Large-party tables for up to 12", "High chairs and a kids' plate"],
    seats: 84,
    tables: 24,
    dish: "tomato",
  },
];

export const locationById = (id: string | null | undefined) => locations.find((l) => l.id === id);

/** Largest party each room takes online. The guest stepper, its hint and form validation all read from here. */
export const partyLimits: Record<LocationId, number> = {
  "red-hook": 8,
  greenpoint: 4,
  "carroll-gardens": 12,
};
/** Before a room is chosen, the stepper uses the strictest limit */
export const lowestPartyLimit = Math.min(...Object.values(partyLimits));
export const partyLimitFor = (id: LocationId | "" | null | undefined) => (id ? partyLimits[id] : lowestPartyLimit);

/** Hours are invented for the concept; every place that shows hours carries this label. */
export const HOURS_NOTE = "Placeholder hours (concept)";
export const weekendHours = (l: Location) => l.hours.filter((h) => /Sat|Sun/.test(h.days));
export const weekdayHours = (l: Location) => l.hours.find((h) => !/Sat|Sun/.test(h.days) && h.time !== "Closed") ?? l.hours[0];
