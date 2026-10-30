export type Lang = "en" | "bn";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "declined";
export type ApplicationStatus = "under_review" | "approved" | "declined";

export type Photo = {
  src: string;
  alt: string;
  altBn: string;
};

export type Villa = {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  category: string;
  categoryBn: string;
  guests: number;
  bedrooms: number;
  sizeM2: number;
  bed: string;
  bedBn: string;
  blurb: string;
  blurbBn: string;
  details: string;
  detailsBn: string;
  amenities: { en: string; bn: string }[];
  /** Sample nightly rate in BDT for this demo. Not a published tariff. */
  pricePerNight: number;
  units: number;
  image: string;
  images: Photo[];
};

export type VillaAvailability = Villa & {
  nights: number;
  total: number;
  unitsLeft: number;
};

export type ProjectStatus = "open" | "closing" | "funded";

export type Milestone = {
  label: string;
  labelBn: string;
  state: string;
  stateBn: string;
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  eyebrow: string;
  eyebrowBn: string;
  location: string;
  locationBn: string;
  summary: string;
  summaryBn: string;
  story: string;
  storyBn: string;
  /** Sample price per share in BDT. Placeholder, not an offer. */
  pricePerShare: number;
  /** Illustrative label only. Not a forecast or a historical return. */
  illustrativeYield: string;
  totalShares: number;
  soldShares: number;
  reservedShares: number;
  completion: string;
  completionBn: string;
  image: string;
  status: ProjectStatus;
  milestones: Milestone[];
};

export type Booking = {
  id: string;
  reference: string;
  token: string;
  villaId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  guestName: string;
  mobile: string;
  email: string;
  whatsappUpdates: boolean;
  status: BookingStatus;
  total: number;
  nights: number;
  createdAt: string;
  cancelReason?: string;
};

export type Application = {
  id: string;
  projectId: string;
  name: string;
  email: string;
  mobile: string;
  shares: number;
  status: ApplicationStatus;
  note: string;
  createdAt: string;
};

export type Investor = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  mobile: string;
  tier: string;
  code: string;
};

export type AdminUser = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
};

export type Holding = {
  id: string;
  investorId: string;
  projectId: string;
  shares: number;
  /** Sample amount in BDT. Placeholder. */
  amount: number;
};

export type Payout = {
  id: string;
  investorId: string;
  projectId: string;
  date: string;
  description: string;
  descriptionBn: string;
  /** Sample amount in BDT. Placeholder. */
  amount: number;
  status: "paid" | "scheduled";
};

export type VaultDocument = {
  id: string;
  investorId: string;
  title: string;
  titleBn: string;
  kind: string;
  date: string;
  note: string;
};

export type Session = {
  id: string;
  userId: string;
  role: "investor" | "admin";
  createdAt: string;
};

export type Store = {
  villas: Villa[];
  projects: Project[];
  bookings: Booking[];
  applications: Application[];
  investors: Investor[];
  admins: AdminUser[];
  holdings: Holding[];
  payouts: Payout[];
  documents: VaultDocument[];
  sessions: Session[];
};

export type SearchQuery = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
};

export type BookingInput = {
  villaSlug: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  guestName: string;
  mobile: string;
  email: string;
  whatsappUpdates: boolean;
};

export type ApplicationInput = {
  projectSlug: string;
  name: string;
  email: string;
  mobile: string;
  shares: number;
  note?: string;
};

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export type InvestorPortal = {
  investor: Omit<Investor, "passwordHash">;
  holdings: (Holding & { project: Project })[];
  payouts: (Payout & { projectName: string })[];
  documents: VaultDocument[];
  applications: (Application & { projectName: string })[];
  manager: { name: string; phone: string };
};

export const COOKIES = {
  investor: "sundrop_investor",
  admin: "sundrop_admin",
} as const;

export function remainingShares(project: Project) {
  return Math.max(0, project.totalShares - project.soldShares - project.reservedShares);
}
