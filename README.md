# SUNDROP Eco Resort

A working demo of a luxury eco-resort and investor desk on Saint Martin’s Island, Cox’s Bazar. It is a pnpm + Turborepo monorepo of three Next.js apps.

Every price, yield, review, certificate and headcount on the site is **placeholder data for this demo**. Nothing is an offer of securities, a published tariff, or a real guest review. Confirming a booking or an application writes a record in a local JSON file. No email, WhatsApp message or payment is sent.

## Apps

| App | Port | What it does |
| --- | --- | --- |
| `apps/web` | [http://127.0.0.1:4210](http://127.0.0.1:4210) | Public site, booking flow, guest manage link |
| `apps/investor` | [http://127.0.0.1:4211](http://127.0.0.1:4211) | Investor portal |
| `apps/admin` | [http://127.0.0.1:4212](http://127.0.0.1:4212) | Admin console |

## Setup

```bash
pnpm install
pnpm dev
```

`pnpm dev` starts all three apps. You can also build and check from the root:

```bash
pnpm build
pnpm lint
pnpm typecheck
```

## Demo credentials

Investor portal

- Email: `shirin.akter@sundrop.demo`
- Password: `sundrop-demo`

Admin console

- Email: `rafiq.hasan@sundrop.demo`
- Password: `sundrop-admin`

Sample guest booking (already in the store)

- Reference: `SDR-DEMO-2610`
- Private link: [http://127.0.0.1:4210/b/SdDemoGuestLinkToken0000000001ab](http://127.0.0.1:4210/b/SdDemoGuestLinkToken0000000001ab)

The manage page at `/manage` also opens that sample link. A reference alone is not enough; the private token is the key.

## Flows

1. On the public site, search dates, open a villa, and reserve. The wizard asks for dates, guest name, a Bangladeshi mobile number and an email, then shows a reference and a private link.
2. Open that link to view the stay or cancel it until 72 hours before check-in.
3. Sign in to the investor portal to see sample holdings, payout lines and downloadable quarterly notes (plain-text placeholders).
4. Sign in to admin to confirm or decline bookings, and to approve or decline investment requests. Approving a request moves sample shares from “reserved” to “allocated” on the public project page.

## Data

`packages/data` exposes a `ResortRepository`. The implementation is `JsonResortRepository`, which stores records in `packages/data/.data/store.json` (created on first read, gitignored). Delete that file to reset to the seed.

A later Supabase implementation can satisfy the same repository methods without changing the apps’ call sites. Do not put real identity documents or card numbers into the demo.

## Design

The public landing follows the approved page: Fraunces, Manrope and Hind Siliguri, teal / sand / navy / gold, bilingual EN/বাংলা, Lenis, GSAP ScrollTrigger and a small WebGL water pass on the hero. The investor programme section reuses the experiences section’s sticky frame and scrubbed parallax, with three layers (island, coastline, land) and the programme, steps, dashboard and report notes in one section. It stays readable when `prefers-reduced-motion` is set.

Photography is loaded from Unsplash (`images.unsplash.com`).
