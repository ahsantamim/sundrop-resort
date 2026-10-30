import { randomBytes, timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createSeed, hashPassword } from "./seed";
import type {
  Application,
  ApplicationInput,
  Booking,
  BookingInput,
  BookingStatus,
  InvestorPortal,
  Project,
  Result,
  SearchQuery,
  Session,
  Store,
  Villa,
  VillaAvailability,
} from "./types";
import { remainingShares } from "./types";

const BLOCKING: BookingStatus[] = ["pending", "confirmed"];

function resolveStorePath() {
  if (process.env.SUNDROP_DATA_FILE) return process.env.SUNDROP_DATA_FILE;
  // Serverless hosts (Vercel) only allow writes under the temp dir.
  if (process.env.VERCEL) return path.join(tmpdir(), "sundrop/store.json");
  let dir = process.cwd();
  for (let i = 0; i < 8; i += 1) {
    if (existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
      return path.join(dir, "packages/data/.data/store.json");
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.join(process.cwd(), "packages/data/.data/store.json");
}

function isoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseIso(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const start = parseIso(checkIn);
  const end = parseIso(checkOut);
  if (!start || !end) return [];
  const dates: string[] = [];
  for (let cursor = new Date(start); cursor < end; cursor.setDate(cursor.getDate() + 1)) {
    dates.push(isoDate(cursor));
  }
  return dates;
}

export function nightCount(checkIn: string, checkOut: string) {
  return nightsBetween(checkIn, checkOut).length;
}

function overlaps(aIn: string, aOut: string, bIn: string, bOut: string) {
  return aIn < bOut && bIn < aOut;
}

function addDays(iso: string, days: number) {
  const date = parseIso(iso);
  if (!date) return iso;
  date.setDate(date.getDate() + days);
  return isoDate(date);
}

export function normalizeMobile(input: string) {
  const digits = input.replace(/[^\d]/g, "");
  let local = digits;
  if (local.startsWith("880")) local = local.slice(3);
  if (local.startsWith("0")) local = local.slice(1);
  if (!/^1[3-9]\d{8}$/.test(local)) return null;
  return `+880 ${local.slice(0, 4)}-${local.slice(4)}`;
}

export function normalizeEmail(input: string) {
  const email = input.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function token(size = 32) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(size);
  let out = "";
  for (let i = 0; i < size; i += 1) out += alphabet[bytes[i]! % alphabet.length];
  return out;
}

function reference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(4);
  let code = "";
  for (let i = 0; i < 4; i += 1) code += alphabet[bytes[i]! % alphabet.length];
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `SDR-${code}-${yy}${mm}`;
}

function passwordsMatch(password: string, hash: string) {
  const next = Buffer.from(hashPassword(password));
  const prev = Buffer.from(hash);
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

function unitsLeft(store: Store, villa: Villa, checkIn: string, checkOut: string, ignoreId?: string) {
  const used = store.bookings.filter(
    (booking) =>
      booking.villaId === villa.id &&
      booking.id !== ignoreId &&
      BLOCKING.includes(booking.status) &&
      overlaps(booking.checkIn, booking.checkOut, checkIn, checkOut),
  ).length;
  return villa.units - used;
}

export class JsonResortRepository {
  constructor(private readonly file = resolveStorePath()) {}

  private async withLock<T>(fn: (store: Store) => Promise<T> | T): Promise<T> {
    const lock = `${this.file}.lock`;
    await mkdir(path.dirname(this.file), { recursive: true });
    for (let attempt = 0; attempt < 80; attempt += 1) {
      try {
        await mkdir(lock);
        break;
      } catch {
        try {
          const info = await stat(lock);
          if (Date.now() - info.mtimeMs > 8000) await rm(lock, { recursive: true, force: true });
        } catch { /* another writer removed it */ }
        if (attempt === 79) throw new Error("Could not lock the demo data file.");
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
    }
    try {
      const store = await this.read();
      const result = await fn(store);
      await this.write(store);
      return result;
    } finally {
      await rm(lock, { recursive: true, force: true });
    }
  }

  private async read(): Promise<Store> {
    await mkdir(path.dirname(this.file), { recursive: true });
    try {
      const raw = await readFile(this.file, "utf8");
      return JSON.parse(raw) as Store;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code && code !== "ENOENT") throw error;
      const seed = createSeed();
      const initLock = `${this.file}.init.lock`;
      try {
        await mkdir(initLock);
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 40));
        const raw = await readFile(this.file, "utf8");
        return JSON.parse(raw) as Store;
      }
      try {
        await this.write(seed);
        return seed;
      } finally {
        await rm(initLock, { recursive: true, force: true });
      }
    }
  }

  private async write(store: Store) {
    const tmp = `${this.file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(store, null, 2));
    await rename(tmp, this.file);
  }

  async listVillas() {
    const store = await this.read();
    return store.villas;
  }

  async getVilla(slug: string) {
    const store = await this.read();
    return store.villas.find((villa) => villa.slug === slug) ?? null;
  }

  async search(query: SearchQuery): Promise<Result<VillaAvailability[]>> {
    const nights = nightCount(query.checkIn, query.checkOut);
    if (nights < 1) return { ok: false, error: "Choose at least one night." };
    if (nights > 14) return { ok: false, error: "Stays in this demo are limited to 14 nights." };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = parseIso(query.checkIn);
    if (!start || start < today) return { ok: false, error: "Check-in must be today or later." };
    if (query.adults < 1 || query.adults > 6) return { ok: false, error: "Adults must be between 1 and 6." };
    if (query.children < 0 || query.children > 4) return { ok: false, error: "Children must be between 0 and 4." };

    const store = await this.read();
    const party = query.adults + query.children;
    const rows = store.villas
      .filter((villa) => party <= villa.guests && (villa.slug !== "honeymoon-sunset" || query.children === 0))
      .map((villa) => {
        const units = unitsLeft(store, villa, query.checkIn, query.checkOut);
        return {
          ...villa,
          nights,
          total: villa.pricePerNight * nights,
          unitsLeft: units,
        };
      });
    return { ok: true, data: rows };
  }

  async blockedDates(slug: string, from: string, to: string) {
    const store = await this.read();
    const villa = store.villas.find((item) => item.slug === slug);
    if (!villa) return [];
    const start = parseIso(from);
    const end = parseIso(to);
    if (!start || !end) return [];
    const blocked: string[] = [];
    for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
      const day = isoDate(cursor);
      const next = addDays(day, 1);
      if (unitsLeft(store, villa, day, next) <= 0) blocked.push(day);
    }
    return blocked;
  }

  async createBooking(input: BookingInput): Promise<Result<Booking>> {
    const email = normalizeEmail(input.email);
    const mobile = normalizeMobile(input.mobile);
    const name = input.guestName.trim().replace(/\s+/g, " ");
    if (name.length < 2) return { ok: false, error: "Enter the guest’s name." };
    if (!mobile) return { ok: false, error: "Enter an 11-digit Bangladeshi mobile number, for example 01712-345678." };
    if (!email) return { ok: false, error: "Enter a valid email address." };

    return this.withLock((store) => {
      const villa = store.villas.find((item) => item.slug === input.villaSlug);
      if (!villa) return { ok: false, error: "That villa is not in the demo inventory." };
      const nights = nightCount(input.checkIn, input.checkOut);
      if (nights < 1 || nights > 14) return { ok: false, error: "Stay length must be 1 to 14 nights." };
      const party = input.adults + input.children;
      if (input.adults < 1 || input.adults > 6 || input.children < 0 || input.children > 4) {
        return { ok: false, error: "Guest counts are outside the demo limits." };
      }
      if (party > villa.guests) return { ok: false, error: "This villa cannot hold that many guests." };
      if (villa.slug === "honeymoon-sunset" && input.children > 0) {
        return { ok: false, error: "The honeymoon villa is marked adults only in this demo." };
      }
      if (unitsLeft(store, villa, input.checkIn, input.checkOut) <= 0) {
        return { ok: false, error: "Those dates were just taken. Choose another range." };
      }
      const booking: Booking = {
        id: `bkg-${token(8)}`,
        reference: reference(),
        token: token(32),
        villaId: villa.id,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        adults: input.adults,
        children: input.children,
        guestName: name,
        mobile,
        email,
        whatsappUpdates: input.whatsappUpdates,
        status: "pending",
        total: villa.pricePerNight * nights,
        nights,
        createdAt: new Date().toISOString(),
      };
      store.bookings.unshift(booking);
      return { ok: true, data: booking };
    });
  }

  async getBookingByToken(value: string) {
    const store = await this.read();
    return store.bookings.find((booking) => booking.token === value) ?? null;
  }

  async getBookingByReference(referenceCode: string) {
    const store = await this.read();
    return store.bookings.find((booking) => booking.reference.toLowerCase() === referenceCode.trim().toLowerCase()) ?? null;
  }

  async cancelBooking(value: string, reason?: string): Promise<Result<Booking>> {
    return this.withLock((store) => {
      const booking = store.bookings.find((item) => item.token === value);
      if (!booking) return { ok: false, error: "Booking not found." };
      if (booking.status === "cancelled" || booking.status === "declined") {
        return { ok: false, error: "This booking is already closed." };
      }
      const freeUntil = new Date(`${booking.checkIn}T00:00:00`);
      freeUntil.setHours(freeUntil.getHours() - 72);
      if (new Date() > freeUntil) {
        return { ok: false, error: "The free-cancellation window (72 hours before check-in) has passed in this demo." };
      }
      booking.status = "cancelled";
      booking.cancelReason = reason?.trim() || "Change of travel plans";
      return { ok: true, data: booking };
    });
  }

  async listBookings() {
    const store = await this.read();
    return [...store.bookings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async setBookingStatus(id: string, status: "confirmed" | "declined"): Promise<Result<Booking>> {
    return this.withLock((store) => {
      const booking = store.bookings.find((item) => item.id === id);
      if (!booking) return { ok: false, error: "Booking not found." };
      if (booking.status === "cancelled") return { ok: false, error: "A guest-cancelled booking cannot be confirmed." };
      if (status === "confirmed") {
        const villa = store.villas.find((item) => item.id === booking.villaId);
        if (!villa) return { ok: false, error: "Villa missing from the demo inventory." };
        if (unitsLeft(store, villa, booking.checkIn, booking.checkOut, booking.id) < 1) {
          return { ok: false, error: "No unit is free for those dates." };
        }
      }
      booking.status = status;
      return { ok: true, data: booking };
    });
  }

  async listProjects() {
    const store = await this.read();
    return store.projects;
  }

  async getProject(slug: string) {
    const store = await this.read();
    return store.projects.find((project) => project.slug === slug) ?? null;
  }

  async createApplication(input: ApplicationInput): Promise<Result<Application>> {
    const email = normalizeEmail(input.email);
    const mobile = normalizeMobile(input.mobile);
    const name = input.name.trim().replace(/\s+/g, " ");
    if (name.length < 2) return { ok: false, error: "Enter the applicant’s name." };
    if (!email) return { ok: false, error: "Enter a valid email address." };
    if (!mobile) return { ok: false, error: "Enter an 11-digit Bangladeshi mobile number." };
    if (!Number.isInteger(input.shares) || input.shares < 1 || input.shares > 40) {
      return { ok: false, error: "Request between 1 and 40 sample shares." };
    }
    return this.withLock((store) => {
      const project = store.projects.find((item) => item.slug === input.projectSlug);
      if (!project) return { ok: false, error: "Project not found." };
      if (project.status === "funded") return { ok: false, error: "This sample project is marked funded." };
      if (input.shares > remainingShares(project)) {
        return { ok: false, error: "Not enough sample shares remain on this project." };
      }
      const application: Application = {
        id: `APP-${new Date().getFullYear()}-${token(4).toUpperCase()}`,
        projectId: project.id,
        name,
        email,
        mobile,
        shares: input.shares,
        status: "under_review",
        note: input.note?.trim() ?? "",
        createdAt: new Date().toISOString(),
      };
      project.reservedShares += input.shares;
      store.applications.unshift(application);
      return { ok: true, data: application };
    });
  }

  async listApplications() {
    const store = await this.read();
    return store.applications.map((application) => ({
      ...application,
      projectName: store.projects.find((project) => project.id === application.projectId)?.name ?? "Project",
    }));
  }

  async decideApplication(id: string, decision: "approved" | "declined", note?: string): Promise<Result<Application>> {
    return this.withLock((store) => {
      const application = store.applications.find((item) => item.id === id);
      if (!application) return { ok: false, error: "Application not found." };
      if (application.status !== "under_review") return { ok: false, error: "This request has already been decided." };
      const project = store.projects.find((item) => item.id === application.projectId);
      if (!project) return { ok: false, error: "Project not found." };
      if (decision === "approved") {
        if (project.reservedShares < application.shares) {
          return { ok: false, error: "Reserved sample shares are out of sync." };
        }
        project.reservedShares -= application.shares;
        project.soldShares += application.shares;
      } else if (project.reservedShares >= application.shares) {
        project.reservedShares -= application.shares;
      }
      application.status = decision;
      if (note?.trim()) application.note = note.trim();
      return { ok: true, data: application };
    });
  }

  async login(role: "investor" | "admin", email: string, password: string): Promise<Result<Session>> {
    const normalized = normalizeEmail(email);
    if (!normalized || !password) return { ok: false, error: "Enter the demo email and password." };
    return this.withLock((store) => {
      const user =
        role === "investor"
          ? store.investors.find((item) => item.email === normalized)
          : store.admins.find((item) => item.email === normalized);
      if (!user || !passwordsMatch(password, user.passwordHash)) {
        return { ok: false, error: "Those demo credentials do not match." };
      }
      const session: Session = {
        id: token(32),
        userId: user.id,
        role,
        createdAt: new Date().toISOString(),
      };
      store.sessions.push(session);
      return { ok: true, data: session };
    });
  }

  async logout(id: string) {
    await this.withLock((store) => {
      store.sessions = store.sessions.filter((session) => session.id !== id);
    });
  }

  async getSession(id: string | undefined, role: "investor" | "admin") {
    if (!id) return null;
    const store = await this.read();
    const session = store.sessions.find((item) => item.id === id && item.role === role);
    return session ?? null;
  }

  async getAdmin(sessionId: string | undefined) {
    const session = await this.getSession(sessionId, "admin");
    if (!session) return null;
    const store = await this.read();
    const admin = store.admins.find((item) => item.id === session.userId);
    return admin ? { session, admin } : null;
  }

  async getInvestorPortal(sessionId: string | undefined): Promise<InvestorPortal | null> {
    const session = await this.getSession(sessionId, "investor");
    if (!session) return null;
    const store = await this.read();
    const investor = store.investors.find((item) => item.id === session.userId);
    if (!investor) return null;
    const { passwordHash: _password, ...safe } = investor;
    void _password;
    const holdings = store.holdings
      .filter((holding) => holding.investorId === investor.id)
      .map((holding) => ({
        ...holding,
        project: store.projects.find((project) => project.id === holding.projectId) as Project,
      }))
      .filter((holding) => holding.project);
    return {
      investor: safe,
      holdings,
      payouts: store.payouts
        .filter((payout) => payout.investorId === investor.id)
        .map((payout) => ({
          ...payout,
          projectName: store.projects.find((project) => project.id === payout.projectId)?.name ?? "Project",
        })),
      documents: store.documents.filter((document) => document.investorId === investor.id),
      applications: store.applications
        .filter((application) => application.email === investor.email)
        .map((application) => ({
          ...application,
          projectName: store.projects.find((project) => project.id === application.projectId)?.name ?? "Project",
        })),
      manager: { name: "Sajjad Karim", phone: "+880 1711-000222" },
    };
  }

  async getDocument(sessionId: string | undefined, id: string) {
    const portal = await this.getInvestorPortal(sessionId);
    if (!portal) return null;
    return portal.documents.find((document) => document.id === id) ?? null;
  }

  villaName(storeVillas: Villa[], id: string) {
    return storeVillas.find((villa) => villa.id === id)?.name ?? "Villa";
  }

  async hydrateBookings() {
    const store = await this.read();
    return store.bookings
      .map((booking) => ({
        ...booking,
        villaName: store.villas.find((villa) => villa.id === booking.villaId)?.name ?? "Villa",
        villaSlug: store.villas.find((villa) => villa.id === booking.villaId)?.slug ?? "",
      }))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
}

let singleton: JsonResortRepository | null = null;

export function getRepo() {
  if (!singleton) singleton = new JsonResortRepository();
  return singleton;
}

export type HydratedBooking = Awaited<ReturnType<JsonResortRepository["hydrateBookings"]>>[number];
