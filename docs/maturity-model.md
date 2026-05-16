# DfE Digital and Technology Standards — Schools Maturity Model

> A customer-facing assessment instrument for UK schools and colleges, built on the
> 12 DfE digital and technology standards published at
> <https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges>.
> Source research date: 2026-05-16.

## How to use this model

1. **Identify the customer's profile** — phase (primary / secondary / FE), structure
   (single school / MAT / college), and whether they're an **RPA member** (DfE's Risk
   Protection Arrangement — many `must` items are RPA conditions of cover).
2. **Walk the 12 domains** with the customer. For each domain there are 5–8
   assessment questions; answer each with the tier evidence in front of you.
3. **Score each question** on the 0–4 scale (see *Scoring* below). The question's
   `weight` tells you how much it contributes to that domain's score.
4. **Compute domain tier** by mapping the weighted average score to the tier table.
5. **Check compliance gates** — Tier 1 items are non-negotiable (legal duty or RPA
   condition). Failing any Tier 1 item caps the whole report at "Non-compliant"
   until remediated.
6. **Generate the report** using the template at the end of this document.

### Tiers (uniform across all 12 domains)

| Tier | Name | Meaning |
| ---- | ---- | ------- |
| **1** | **Required** | Statutory duty, KCSiE, UK GDPR, or RPA condition of cover. Compliance floor. |
| **2** | **Expected** | The DfE `should` requirements on the **six core standards**. The de facto inspector / RPA bar for the **2030 target**. |
| **3** | **Established** | Every `should` requirement across all 12 standards, plus termly review cadence in place. |
| **4** | **Optimised** | `could` items, current-generation tech (Wi-Fi 7, Cat 6A, OM4), external certifications (Cyber Essentials Plus, ITIL, WCAG 2.2 AA), measurable governance loop. |

### Scoring

| Score | Label | Meaning |
| ----- | ----- | ------- |
| **0** | Not yet | No activity, no documentation, no evidence. |
| **1** | Aware | Conversation started; gaps identified; nothing operational. |
| **2** | Partial | Implemented for some users / systems / sites; gaps remain. |
| **3** | Implemented | In place across the school for all relevant users/systems. Evidence available. |
| **4** | Embedded | Implemented + measured + reviewed on the required cadence + accountable named owner + governor visibility. |

**Compliance gate:** a question marked **`tier: 1`** must score **≥ 3**. Anything
below caps the customer's overall rating at *"Non-compliant — remediation required"*
regardless of how well they score elsewhere.

### Domain tier mapping (per-domain rollup)

| Weighted average score | Domain tier |
| ---------------------- | ----------- |
| 0.0 – 1.0 | Tier 0 — Pre-foundational |
| 1.1 – 2.0 | Tier 1 — Required (with gaps) |
| 2.1 – 2.7 | Tier 2 — Expected |
| 2.8 – 3.4 | Tier 3 — Established |
| 3.5 – 4.0 | Tier 4 — Optimised |

### Reading list (cross-cutting)

These appear repeatedly across the standards and are worth knowing before sitting
down with a customer:

- **KCSiE** — Keeping Children Safe in Education (statutory; binds filtering / monitoring).
- **RPA** — DfE Risk Protection Arrangement (insurance; binds NCSC training, 3-2-1
  backup, cyber response plan, MFA for staff handling sensitive data).
- **UK GDPR + ICO breach rule** — 72-hour notification for high-risk personal data
  breaches; DPIA required for personal/special category data; ROPA required (Art. 30).
- **NCSC** — 10 Steps to Cyber Security; 3-2-1 backup; Cloud Security Principles;
  free Cyber Awareness training (RPA condition).
- **Cyber Essentials / Cyber Essentials Plus** — mandatory for FE via funding
  agreements; recommended for schools; the cyber standard "helps you work towards
  certification".
- **DfE 2030 target** — six core standards (Broadband, Wireless, Switching, Digital
  Leadership & Governance, Cyber Security, Filtering & Monitoring) to be met by 2030.

---

## Domain 1 — Broadband internet (core)

**Standard:** <https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/broadband-internet-core-standard> — core, 2030.

### Tier descriptions

- **Tier 1 — Required.** A live broadband connection with a content filter and a
  firewall in front of it (gate to KCSiE compliance).
- **Tier 2 — Expected.** Full-fibre (FTTP) primary connection meeting phase-specific
  speed minimums (primary: 100/30 Mbps; secondary + FE: 1 Gbps symmetrical), plus
  a resilient backup connection.
- **Tier 3 — Established.** Backup tested at least annually with documented
  failover. Filter and firewall rules reviewed termly with SLT digital-lead sign-off.
- **Tier 4 — Optimised.** Edge backup (carrier-diverse), DfE "Plan technology for
  your school" tool used at procurement, redundant ISP relationships.

### Assessment questions

| # | Question | Tier | Weight |
| - | -------- | ---- | ------ |
| 1.1 | Is there a content filtering system on the primary internet connection? | **1** | 3 |
| 1.2 | Is there a firewall in front of the school network? | **1** | 3 |
| 1.3 | Is the primary connection full-fibre (FTTP)? | 2 | 2 |
| 1.4 | Does the sustained download speed meet the phase minimum (primary: 100 Mbps; secondary / FE: 1 Gbps)? | 2 | 3 |
| 1.5 | Does the sustained upload speed meet the phase minimum (primary: 30 Mbps; secondary / FE: 1 Gbps)? | 2 | 2 |
| 1.6 | Is a backup broadband connection live and physically diverse from the primary? | 2 | 3 |
| 1.7 | Has the failover to the backup been tested in the last 12 months? | 3 | 2 |
| 1.8 | Is the backup an edge/carrier-managed service (not an on-prem device)? | 4 | 1 |

---

## Domain 2 — Wireless network (core)

**Standard:** <https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/wireless-network-core-standard> — core, 2030.

### Tier descriptions

- **Tier 1 — Required.** Wireless access requires authentication. Admin accounts
  on the wireless console are secured and documented (the standard's `must` items).
- **Tier 2 — Expected.** Coverage matches occupation levels (typically one AP per
  classroom + higher-spec in halls). Central management. Auto-firmware updates.
  WPA3 in use. Segregated SSIDs for staff / student / guest / BYOD.
- **Tier 3 — Established.** Heat-map survey on file from most recent refit.
  Termly admin-account review. Captive portal + per-user auth for guests.
- **Tier 4 — Optimised.** Wi-Fi 7 (802.11be) deployed or scheduled, WIPs / rogue-AP
  detection active, MFA on the wireless admin console, QoS profiles defined.

### Assessment questions

| # | Question | Tier | Weight |
| - | -------- | ---- | ------ |
| 2.1 | Do users have to authenticate before reaching the network? | **1** | 3 |
| 2.2 | Are wireless admin accounts named, secured, and documented (not shared)? | **1** | 3 |
| 2.3 | Is there a central management tool for the wireless network? | 2 | 2 |
| 2.4 | Are firmware updates applied automatically and verified? | 2 | 2 |
| 2.5 | Are staff, student, guest and BYOD traffic on segregated SSIDs/VLANs? | 2 | 2 |
| 2.6 | Was a heat-map / coverage survey done on the most recent refit? | 3 | 1 |
| 2.7 | Is the deployed Wi-Fi standard Wi-Fi 7 (802.11be), or is there a refresh roadmap to it? | 4 | 1 |
| 2.8 | Is wireless intrusion detection (WIPs / rogue-AP) running? | 4 | 1 |

---

## Domain 3 — Network switching (core)

**Standard:** <https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/network-switching-core-standard> — core, 2030.

### Tier descriptions

- **Tier 1 — Required.** Switches are configured, named admins, no default
  passwords. Switching supports the filtering/monitoring boundary (gate via cyber + KCSiE).
- **Tier 2 — Expected.** ≥ 1 Gbps to desktops, multi-gig to APs, ≥ 2×10 Gbps to
  core, manufacturer support ≥ 5 years, spanning-tree configured.
- **Tier 3 — Established.** NACs (e.g. 802.1X) enforced. Core switches dual PSU /
  dual supervisor on UPS. Termly review of switch config signed off by SLT.
- **Tier 4 — Optimised.** 40 Gbps stack interconnects, end-of-support dates in the
  asset register and budgeted in the refresh cycle, password-vaulted admin accounts.

### Assessment questions

| # | Question | Tier | Weight |
| - | -------- | ---- | ------ |
| 3.1 | Are admin accounts on switches unique, named, and password-vaulted? | **1** | 3 |
| 3.2 | Are all in-service switches under a current manufacturer support contract? | 2 | 3 |
| 3.3 | Do user-facing ports deliver ≥ 1 Gbps with multi-gig uplinks to core? | 2 | 2 |
| 3.4 | Are there ≥ 2×10 Gbps links from edge to core/server room? | 2 | 2 |
| 3.5 | Are core switches dual-PSU, dual-supervisor, and on UPS? | 3 | 2 |
| 3.6 | Is Network Access Control (e.g. 802.1X) enforced? | 3 | 2 |
| 3.7 | Are switch rules reviewed termly with SLT digital-lead sign-off? | 3 | 1 |
| 3.8 | Are 40 Gbps stack interconnects in use across the switching fabric? | 4 | 1 |

---

## Domain 4 — Network cabling

**Standard:** <https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/network-cabling> — all-times (triggered on replacement).

### Tier descriptions

- **Tier 1 — Required.** Cabling does not present a fire/safety risk; in-service
  cabling supports the operational network.
- **Tier 2 — Expected.** Cat 6A U/FTP for new copper runs, OM4 ≥ 16-core multi-mode
  for inter-building backbones. Installations comply with BS 6701, BS EN 50173/4.
- **Tier 3 — Established.** Test reports on file for new runs, fire rating
  Euroclass Cca s1b.d2.a2 met, manufacturer warranty ≥ 20 years.
- **Tier 4 — Optimised.** Structured cabling labelled and documented in the asset
  register, cabling refresh tied to the multi-year digital strategy.

### Assessment questions

| # | Question | Tier | Weight |
| - | -------- | ---- | ------ |
| 4.1 | Does the in-service copper cabling category meet the throughput the network needs (≥ Cat 6 for current Gigabit, Cat 6A for 10 GbE)? | 2 | 2 |
| 4.2 | Is inter-building backbone OM4 multi-mode fibre with ≥ 16 cores? | 2 | 2 |
| 4.3 | Is new cabling installed to BS 6701 / BS EN 50173 / 50174? | 2 | 1 |
| 4.4 | Are BS-EN-50173 test reports on file for new runs? | 3 | 2 |
| 4.5 | Do new installations meet Euroclass Cca s1b.d2.a2 fire rating? | 3 | 2 |
| 4.6 | Is there a manufacturer warranty (typically ≥ 20 years) on structured cabling? | 3 | 1 |
| 4.7 | Is structured cabling labelled, mapped and recorded in the asset register? | 4 | 1 |

---

## Domain 5 — Digital leadership and governance (core)

**Standard:** <https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/digital-leadership-and-governance-core-standard> — core, 2030.

### Tier descriptions

- **Tier 1 — Required.** Servers/storage and cloud follow UK GDPR (the page's two
  explicit `must` items). Some form of asset / contract tracking exists.
- **Tier 2 — Expected.** Named SLT digital lead. Three live registers (contracts,
  assets, IAR). Multi-year digital strategy (≥ 2 years). Disaster Recovery Plan
  exists.
- **Tier 3 — Established.** Registers reviewed each financial-planning cycle. DR
  plan tested at least annually. Strategy reviewed annually. Top-level summary
  shared with stakeholders.
- **Tier 4 — Optimised.** Governing body sees a digital risk update each term.
  DR testing includes simulated data-loss / hardware failure (not just table-top).
  Strategy informed by stakeholder consultation (parents, students, MAT peers).

### Assessment questions

| # | Question | Tier | Weight |
| - | -------- | ---- | ------ |
| 5.1 | Are server / storage / cloud platforms holding personal data compliant with UK GDPR (DPIA on file, DPA with vendor)? | **1** | 3 |
| 5.2 | Is there a named SLT digital lead with the role in writing? | 2 | 3 |
| 5.3 | Are the three registers (contracts, assets, information assets) live and current? | 2 | 3 |
| 5.4 | Is there a written digital technology strategy covering ≥ 2 years? | 2 | 2 |
| 5.5 | Is there a Disaster Recovery Plan with named owners and tested escalation? | 2 | 3 |
| 5.6 | Has the DR plan been tested in the last 12 months? | 3 | 2 |
| 5.7 | Is the digital strategy reviewed annually with stakeholder summary published? | 3 | 1 |
| 5.8 | Does the governing body get a digital risk update each term? | 4 | 1 |

---

## Domain 6 — Cyber security (core)

**Standard:** <https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/cyber-security-core-standard> — core, 2030.

The heaviest standard (7 sub-standards). This is ~30 % of the maturity model's
surface area on its own. The questions below sample across all seven sub-standards;
treat low scores here as the highest-priority finding in the customer report.

### Tier descriptions

- **Tier 1 — Required.** All Cyber Essentials-aligned basics: MFA for staff
  handling sensitive data, NCSC training annually (RPA condition), 3-2-1 backup
  with immutability (RPA condition), cyber response plan (RPA condition), patching
  within 14 days for CVSS ≥ 7.0, accounts disabled on day-of-leave.
- **Tier 2 — Expected.** Cyber risk assessment annual, reviewed termly. AUP signed
  by all users including supply staff and contractors. MFA for all staff accounts.
  Firewall admin MFA-protected; rules reviewed termly with SLT sign-off.
- **Tier 3 — Established.** Centrally managed AV, USB blocked by default, separate
  privileged admin accounts (no global account routine use), break-glass admin
  available to SLT, termly account review, immutable backups + termly restore test.
- **Tier 4 — Optimised.** Cyber Essentials Plus certified. MIS-integrated identity
  with auto-provisioning. Quarterly tabletop incident-response exercises (Exercise
  in a Box). Conditional access policies in place. Privileged Access Workstations.

### Assessment questions

| # | Question | Tier | Weight |
| - | -------- | ---- | ------ |
| 6.1 | Is MFA enforced for **all staff handling confidential, financial, or personal data** (`must`)? | **1** | 3 |
| 6.2 | If an RPA member: have all relevant users completed NCSC training in the current year (`must`)? | **1** | 3 |
| 6.3 | Are 3-2-1 backups in place with **immutable** copies and a termly restore test? | **1** | 3 |
| 6.4 | Is there a documented **cyber incident response plan** (RPA condition)? | **1** | 3 |
| 6.5 | Are CVSS ≥ 7.0 vulnerabilities patched within **14 days** (`must`)? | **1** | 2 |
| 6.6 | Are user accounts disabled the same day someone leaves? | **1** | 2 |
| 6.7 | Is there an annual cyber risk assessment, reviewed each term? | 2 | 2 |
| 6.8 | Has every user (incl. supply, contractors, guests) signed the current AUP? | 2 | 2 |
| 6.9 | Is the firewall admin interface MFA-protected with the default password changed? | 2 | 3 |
| 6.10 | Is anti-malware centrally managed, alerting to IT support, with USB blocked by default? | 2 | 2 |
| 6.11 | Are admin accounts separate from routine accounts, and is a break-glass admin available to SLT? | 3 | 2 |
| 6.12 | Are firewall rules reviewed each term and signed off by the SLT digital lead? | 3 | 1 |
| 6.13 | Have all incidents in the last 12 months been logged (incl. near-misses) with an ICO 72-hour playbook? | 3 | 2 |
| 6.14 | Is the school certified to **Cyber Essentials** (and ideally Cyber Essentials Plus)? | 4 | 2 |
| 6.15 | Is identity automated (joiners/leavers wired to MIS) with conditional access policies? | 4 | 1 |

---

## Domain 7 — Filtering and monitoring (core)

**Standard:** <https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/filtering-and-monitoring-core-standard> — **statutory now via KCSiE** (not phased to 2030).

### Tier descriptions

- **Tier 1 — Required.** IWF + CTIRU blocklists implemented and **locked** so no
  user can disable / override / alter them (`must`). Filtering + monitoring exist
  on the primary internet connection.
- **Tier 2 — Expected.** Named SLT lead + named governor for F&M. Annual review by
  SLT + DSL + IT + governor. Safe-search enforced. Staff and student profiles
  separated. Weekly monitoring reports minimum.
- **Tier 3 — Established.** Logs capture device, IP, user, time, search term /
  blocked URL. Different profiles by age phase. VPN / proxy / E2EE categories
  blocked. Immediate alerting for high-risk hits (CSAM, self-harm, terrorism).
- **Tier 4 — Optimised.** BYOD / mobile coverage filters on personal devices on
  site. Filter telemetry feeds the DSL pastoral workflow. Mobile / app-layer
  filtering verified with provider. Real-time triage of high-risk events.

### Assessment questions

| # | Question | Tier | Weight |
| - | -------- | ---- | ------ |
| 7.1 | Are IWF + CTIRU blocklists implemented and **locked** so users cannot disable / override them (`must`)? | **1** | 3 |
| 7.2 | Is a filtering system live on the primary internet connection? | **1** | 3 |
| 7.3 | Is a monitoring strategy in place reaching the DSL? | **1** | 3 |
| 7.4 | Is there a named SLT lead and a named governor for F&M? | 2 | 2 |
| 7.5 | Was the F&M provision reviewed in the last academic year by SLT + DSL + IT + governor (with record)? | 2 | 3 |
| 7.6 | Is safe-search enforced (Google, Bing, YouTube restricted mode)? | 2 | 2 |
| 7.7 | Are there separate filtering profiles for students vs. staff (ideally per age phase)? | 2 | 2 |
| 7.8 | Are VPN / proxy / E2EE categories blocked at the perimeter? | 3 | 2 |
| 7.9 | Do logs identify device, IP, user (where possible), time, and search term / blocked URL? | 3 | 2 |
| 7.10 | Are high-risk hits surfaced immediately (not only in weekly reports) and routed to the DSL? | 3 | 2 |
| 7.11 | Are BYOD / mobile devices filtered when on site? | 4 | 1 |

---

## Domain 8 — Cloud solutions

**Standard:** <https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/cloud-solutions> — all-times.

### Tier descriptions

- **Tier 1 — Required.** Every cloud service holding personal data has: a DPIA, a
  DPA / data-sharing agreement, a UK-GDPR-compliant international transfer
  mechanism where data leaves the UK, and a documented joiner/leaver flow.
- **Tier 2 — Expected.** SSO + role-based access from one identity provider.
  Encrypted data in transit + at rest. Available across staff and student devices.
- **Tier 3 — Established.** IT support has a **separate** break-glass admin
  independent of the main identity store. Vendor uptime SLA reviewed annually.
  Cloud data export tested for portability (open / commonly used formats).
- **Tier 4 — Optimised.** 3-2-1 backup applied to cloud-only data (e.g. third-party
  backup of M365 / Google Workspace). DPIA refreshed on every material vendor
  change. Cloud Security Principles (NCSC) explicitly mapped per service.

### Assessment questions

| # | Question | Tier | Weight |
| - | -------- | ---- | ------ |
| 8.1 | Is there a current DPIA on file for every cloud service holding personal data (`must` via UK GDPR)? | **1** | 3 |
| 8.2 | Is there a Data Processing / Data Sharing Agreement with each cloud vendor? | **1** | 3 |
| 8.3 | For data outside the UK/EU, is the international transfer compliant with UK GDPR? | **1** | 2 |
| 8.4 | Is there a documented user creation / removal flow tied to joiner-leaver? | **1** | 2 |
| 8.5 | Is SSO with role-based access in use across cloud services? | 2 | 2 |
| 8.6 | Are vendor uptime SLAs documented and reviewed annually? | 3 | 1 |
| 8.7 | Does IT support have a separate, break-glass admin independent of the main identity store? | 3 | 2 |
| 8.8 | Has data export been tested from each major SaaS in a portable / open format? | 3 | 1 |
| 8.9 | Is third-party backup applied to cloud-only critical data (e.g. M365 / Google) following 3-2-1? | 4 | 2 |

---

## Domain 9 — Servers and storage

**Standard:** <https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/servers-and-storage> — all-times. Less relevant if the school is cloud-only.

### Tier descriptions

- **Tier 1 — Required.** Servers in a dedicated, locked room (`must`). No
  windows, no liquids, not directly off a classroom (`must`). Personal data
  storage compliant with UK GDPR.
- **Tier 2 — Expected.** UPS with ≥ 30 min runtime + automatic shutdown. Disk
  redundancy (mirroring / RAID). Manufacturer firmware up to date. Termly
  security review.
- **Tier 3 — Established.** Dual PSU + redundant components for critical
  workloads. ENERGY STAR-certified equipment. Spare parts on hand for items not
  under manufacturer support.
- **Tier 4 — Optimised.** Migration plan to cloud-first for the next refresh
  cycle. Energy efficiency stated at procurement; existing servers configured to
  highest-efficiency settings.

### Assessment questions

Applicable only if the school **has on-premise servers**. Score N/A for cloud-only schools.

| # | Question | Tier | Weight |
| - | -------- | ---- | ------ |
| 9.1 | Is the server room locked, windowless, not used for other purposes, and free of liquids (`must`)? | **1** | 3 |
| 9.2 | Are server platforms holding personal data UK-GDPR compliant (DPIA + DPO sign-off)? | **1** | 3 |
| 9.3 | Is there a UPS with ≥ 30 minutes runtime and tested automatic shutdown? | 2 | 2 |
| 9.4 | Is there RAID / disk redundancy on every server holding critical data? | 2 | 2 |
| 9.5 | Are firmware / patches applied per manufacturer guidance and reviewed termly? | 2 | 2 |
| 9.6 | Are end-of-support dates flagged on the asset register and budgeted for refresh? | 3 | 2 |
| 9.7 | Is there a plan to migrate remaining on-prem workloads to cloud where appropriate? | 4 | 1 |

---

## Domain 10 — Laptops, desktops and tablets

**Standard:** <https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/laptops-desktops-and-tablets> — all-times.

### Tier descriptions

- **Tier 1 — Required.** All in-service devices are compatible with the school's
  filtering, monitoring and security systems. Sensitive data on devices is
  encrypted.
- **Tier 2 — Expected.** Centrally managed via MDM (Intune / JAMF / Mosyle /
  Google Admin). Annual review against minimum spec. Wi-Fi 802.11ac Wave 2 or
  above. Encryption (BitLocker / FileVault) enforced.
- **Tier 3 — Established.** 3 (tablets) / 5 (laptops + desktops) year
  manufacturer-supported lifecycle. NCSC sanitisation followed on disposal.
  WEEE-compliant chain of custody.
- **Tier 4 — Optimised.** All new procurement is Wi-Fi 6 / 7 capable, Energy
  Star-certified, and tracked through to documented disposal. Loan / take-home
  devices on the same MDM + filtering as on-site.

### Assessment questions

| # | Question | Tier | Weight |
| - | -------- | ---- | ------ |
| 10.1 | Are all in-service devices compatible with the school's filtering / monitoring / security? | **1** | 3 |
| 10.2 | Is full-disk encryption enforced on devices that store sensitive data? | **1** | 3 |
| 10.3 | Are devices centrally managed via MDM with policy enforcement? | 2 | 3 |
| 10.4 | Are devices reviewed annually against the minimum spec? | 2 | 1 |
| 10.5 | Do laptops / desktops have a 5-year manufacturer support window (3 years for tablets)? | 3 | 2 |
| 10.6 | Are devices disposed of using NCSC sanitisation + WEEE-compliant chain of custody? | 3 | 2 |
| 10.7 | Are new devices Wi-Fi 6 / 7-capable and Energy Star-certified? | 4 | 1 |
| 10.8 | Are loan / take-home devices subject to the same MDM + filtering as on-site devices? | 4 | 2 |

---

## Domain 11 — Digital accessibility

**Standard:** <https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/digital-accessibility> — all-times.

The gov.uk page is light on technical standards. The legal duties (Equality Act
2010; Public Sector Bodies (Websites and Mobile Applications) Accessibility
Regulations 2018; WCAG 2.2 AA) sit alongside it. Include them in the assessment.

### Tier descriptions

- **Tier 1 — Required.** Published accessibility statement on the school website
  (statutory under the 2018 Accessibility Regulations). Reasonable adjustments
  process exists (Equality Act 2010).
- **Tier 2 — Expected.** Accessibility named as a consideration in the digital
  strategy, SEND policy, and curriculum policy. Accessibility features (text-to-
  speech, dictation, captions, zoom) enabled on the standard image build.
- **Tier 3 — Established.** Staff training on accessible content authoring (alt
  text, heading structure, captions). Procurement checklist includes WCAG 2.2 AA
  + exam-mode compatibility. Website + key parent portals tested against WCAG 2.2 AA.
- **Tier 4 — Optimised.** Assistive technologies (screen readers, switch access,
  eye gaze) verified compatible. Alternative communication formats offered as
  standard (large print, plain text, translated). Annual external accessibility
  audit.

### Assessment questions

| # | Question | Tier | Weight |
| - | -------- | ---- | ------ |
| 11.1 | Is there a published accessibility statement on the school website (statutory)? | **1** | 3 |
| 11.2 | Is there a documented reasonable-adjustments process under the Equality Act 2010? | **1** | 2 |
| 11.3 | Is accessibility named in the digital strategy, SEND policy and curriculum policy? | 2 | 2 |
| 11.4 | Are accessibility features (TTS, dictation, captions, zoom) enabled on the standard device image? | 2 | 2 |
| 11.5 | Has the website + parent portal been tested against WCAG 2.2 AA in the last 12 months? | 3 | 2 |
| 11.6 | Are staff trained to author accessible content (alt text, headings, captions)? | 3 | 2 |
| 11.7 | Are alternative communication formats offered (large print / plain text / translated)? | 4 | 1 |
| 11.8 | Has an external accessibility audit been conducted in the current year? | 4 | 1 |

---

## Domain 12 — IT support

**Standard:** <https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/it-support> — all-times. Applies to in-house, outsourced, hybrid.

### Tier descriptions

- **Tier 1 — Required.** A defined IT support arrangement exists (internal /
  outsourced / hybrid). Staff have at least one reliable way to ask for help.
- **Tier 2 — Expected.** Multiple channels (phone / email / in-person). Tickets
  recorded and tracked. Documented operating hours including emergency cover.
- **Tier 3 — Established.** Helpdesk / ticketing system with status visibility for
  requesters. Agreed response and resolution SLAs in writing. Annual review of IT
  support shared with governors / trust board.
- **Tier 4 — Optimised.** Hybrid model (in-house + specialist providers). Recorded
  IT-support certifications (ITIL, vendor-specific). Demand metrics used to
  identify recurring problems, outdated tech and training needs.

### Assessment questions

| # | Question | Tier | Weight |
| - | -------- | ---- | ------ |
| 12.1 | Is there a defined IT support arrangement in writing? | **1** | 2 |
| 12.2 | Do staff have a reliable channel to ask for help and report incidents? | **1** | 2 |
| 12.3 | Are all support requests recorded and tracked (not shadowed in inboxes)? | 2 | 2 |
| 12.4 | Are operating hours and emergency cover documented? | 2 | 2 |
| 12.5 | Are response / resolution SLAs agreed and in writing? | 3 | 2 |
| 12.6 | Is there a helpdesk / ticketing system staff can use to see status? | 3 | 2 |
| 12.7 | Has IT support been formally reviewed in the last 12 months with findings shared to governors? | 3 | 3 |
| 12.8 | Does IT support hold relevant certifications (ITIL, Microsoft, Cyber Essentials supplier)? | 4 | 1 |
| 12.9 | Are demand metrics used to identify recurring problems and plan training / refresh? | 4 | 1 |

---

## Scoring methodology

For each domain:

```
domain_score = sum(question_score × question_weight) / sum(question_weight)
```

For overall maturity:

```
overall_score = sum(domain_score × domain_weight) / sum(domain_weight)
```

Recommended **domain weights** when computing the overall score:

| Domain | Weight |
| ------ | ------ |
| 6. Cyber security | 4 |
| 7. Filtering and monitoring | 4 |
| 5. Digital leadership and governance | 3 |
| 1. Broadband | 2 |
| 2. Wireless | 2 |
| 3. Network switching | 2 |
| 8. Cloud solutions | 2 |
| 10. Laptops, desktops, tablets | 2 |
| 12. IT support | 2 |
| 4. Network cabling | 1 |
| 9. Servers and storage | 1 |
| 11. Digital accessibility | 1 |

> Cyber and F&M are weighted highest because they're the only two domains
> covered by **immediate statutory or insurance obligations** (KCSiE for F&M,
> RPA + UK GDPR for cyber). Cabling, on-prem servers and accessibility are
> weighted lowest because they're either triggered on replacement or rarely
> material to operational risk for a typical school. Adjust to taste.

### Compliance gate

```
overall_compliance =
    "Non-compliant — remediation required"   if any Tier 1 question scored < 3
    "Compliant (Tier 2)"                     if compliance gate clear AND overall_score ≥ 2.1
    "Compliant (Tier 3)"                     if compliance gate clear AND overall_score ≥ 2.8
    "Compliant (Tier 4)"                     if compliance gate clear AND overall_score ≥ 3.5
```

Non-compliant findings are the highest-priority output in the report.

---

## Report template

The customer-facing report should reuse the structure below verbatim. The
maturity-model app should populate every `{{placeholder}}` from the assessment
data.

```markdown
# Digital and Technology Standards Assessment
## {{school_name}}

**Prepared by:** {{consultant_name}}, Softcat
**Date:** {{assessment_date}}
**Profile:** {{phase}} — {{structure}} — RPA member: {{rpa_yes_no}}
**Standards framework:** DfE Digital and Technology Standards for Schools and
Colleges (gov.uk hub, as fetched {{research_date}}).

---

### 1. Executive summary

- **Overall maturity tier:** {{overall_tier}} (score {{overall_score}}/4.0)
- **Compliance status:** {{overall_compliance}}
- **Top-3 strengths:** {{top_strengths}}
- **Top-3 risks:** {{top_risks}}
- **2030 readiness:** {{percentage_of_six_core_at_tier_2_or_above}}% of the six
  DfE core standards at Tier 2 (Expected) or above.

### 2. Compliance gates

{{table_of_tier_1_questions_with_status_and_owner}}

> Items below score 3 are **non-compliant**. Each carries a regulatory anchor
> (KCSiE / RPA / UK GDPR / Equality Act / Accessibility Regulations). Treat as
> P1 in the remediation plan.

### 3. Domain ratings

| Domain | Score | Tier | Trend (vs. previous review) |
| ------ | ----- | ---- | --------------------------- |
| {{loop_over_12_domains}} | | | |

### 4. Findings by domain

For each domain:
- **Score:** {{domain_score}} ({{domain_tier}})
- **Strengths:** {{positive_evidence}}
- **Gaps:** {{negative_evidence}}, anchored to the DfE standard at
  {{standard_url}}.
- **Recommended next moves (next 90 days):** {{next_actions}}
- **Recommended next moves (next 12 months):** {{strategic_actions}}

### 5. Two-year remediation roadmap

Sequenced action plan, prioritised by:
1. Compliance gates (Tier 1 fails).
2. Six core standards on the 2030 trajectory.
3. Established / Optimised tier gaps.

| Quarter | Action | Domain | Tier raised from → to | Owner | Effort | Notes |
| ------- | ------ | ------ | --------------------- | ----- | ------ | ----- |

### 6. Governance recommendations

- SLT digital lead: {{named_or_to_appoint}}
- Governor responsible for F&M: {{named_or_to_appoint}}
- Recommended cadence:
  - Termly: cyber risk review, F&M review, account review, firewall rule review.
  - Annually: DR test, accessibility test, IT support review, AUP refresh.

### 7. Appendix — full question-by-question scoring

{{full_table_of_all_questions_with_scores_and_evidence_notes}}
```

---

## Notes for the scaffolded assessment app

When dropping this spec into the project's Claude Code session, the model is
*data, not code*. A clean implementation:

1. **Persist the spec as JSON / TS** in `prisma/seed.ts` (or equivalent). One
   schema per question: `id`, `domainId`, `text`, `tier`, `weight`. One schema
   per domain: `id`, `name`, `url`, `weight`, `tierDescriptions[]`.
2. **Persist assessments** as a separate table: `assessment.id`,
   `assessment.schoolId`, `assessment.consultantId`, `assessment.startedAt`,
   `assessment.completedAt`. Each answer is its own row: `(assessmentId,
   questionId, score, evidenceText, photoUrl?)`.
3. **Compute domain scores on read** (don't denormalise) — it's a single GROUP BY.
4. **Compute the compliance gate at the API layer**, not the UI. The "Are any
   Tier 1 questions below 3?" check should never depend on client logic.
5. **Render the report as Markdown** server-side and offer both HTML preview and
   PDF download (the platform's host runtime supports both).
6. **Version the spec.** This document changes when DfE updates the standards or
   when Softcat adjusts the weights. Stamp each assessment with the spec version
   (e.g. `dfe-schools-maturity-2026.05.16`) so reports remain reproducible.

The repo's `docs/PLATFORM.md` lists what the platform provides — the
maturity-model app fits the standard pattern (Postgres + API + sub-path-routed
static + collaboration via `app.members` if multiple consultants need shared
access to assessments).

---

## Maintenance

- **Re-fetch the gov.uk hub annually** (April / September school cycles).
  Compare against this document; flag any new `must` items as immediate
  compliance gates.
- **RPA conditions are reissued each year** — confirm with NCSC / DfE that the
  Tier 1 items still align.
- **Cyber Essentials scheme version** changes; update Tier 4 reference if the
  scheme materially shifts.
- **WCAG version**: currently 2.2 AA; track WCAG 3 maturity for the next major
  refresh.
