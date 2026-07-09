export type NorthbridgeVenture = {
  id: string;
  name: string;
  description: string;
  focus: string;
  status: "active" | "incubation";
};

export const northbridgeVentures: NorthbridgeVenture[] = [
  {
    id: "northbridge-digital",
    name: "Northbridge Digital",
    description:
      "Builds AI assistants and digital workforce systems for business operators. Nordi is the flagship product from this venture.",
    focus: "Business operating intelligence · Nordi",
    status: "active",
  },
  {
    id: "aviator-network",
    name: "Aviator Network",
    description:
      "Aviation platform for pilots, instructors, logbook workflows, and operational tools designed around how flight businesses actually run.",
    focus: "Aviation operations · training · logbook",
    status: "active",
  },
  {
    id: "airtax-financial",
    name: "AirTax Financial",
    description:
      "Tax and financial services for aviation professionals, built around the specialized compliance and planning needs of people who work in flight.",
    focus: "Aviation tax · financial services",
    status: "active",
  },
  {
    id: "future-ventures",
    name: "Future Ventures",
    description:
      "Northbridge selectively incubates new platform ventures. Not every idea becomes a product — ventures are built with operational discipline.",
    focus: "Incubation · selective platform development",
    status: "incubation",
  },
];
