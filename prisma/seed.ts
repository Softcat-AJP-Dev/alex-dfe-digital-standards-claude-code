/* eslint-disable no-console */
//
// Seeds the StandardsVersion + Standards + SubCriteria + LevelDescriptors
// for the DfE "Meeting digital and technology standards in schools and
// colleges" guidance.
//
// Source: https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges
// All sub-requirement language is paraphrased close to the source so it
// stays defensible when shown to a head teacher or governor.
//
// Maturity levels (used consistently across every sub-criterion):
//   1 Initial     — not in place / unknown / ad-hoc
//   2 Developing  — partial, inconsistent, undocumented
//   3 Compliant   — meets the DfE baseline ("must" / "should already")
//   4 Established — reviewed on the DfE cadence (termly/annual), evidenced
//   5 Leading     — optimised, automated, integrated across standards
//
// Re-running this script is safe: it upserts the StandardsVersion by its
// `version` string and replaces the standards/sub-criteria/descriptors
// under it. It does NOT touch assessment data.

import { Client } from "pg";
import { DefaultAzureCredential } from "@azure/identity";

const VERSION = "2026.05";
const VERSION_PUBLISHED_AT = "2026-05-01T00:00:00.000Z";

type Descriptor = string;
type SubCriterion = {
  code: string;
  text: string;
  rationale?: string;
  mustHave?: boolean;
  weight?: number;
  // [L1, L2, L3, L4, L5]
  descriptors: [Descriptor, Descriptor, Descriptor, Descriptor, Descriptor];
};
type Standard = {
  slug: string;
  title: string;
  category: "Core" | "Additional";
  summary: string;
  govUkUrl: string;
  weight?: number;
  subCriteria: SubCriterion[];
};

const STANDARDS: Standard[] = [
  // -----------------------------------------------------------------------
  // 1. BROADBAND INTERNET (Core)
  // -----------------------------------------------------------------------
  {
    slug: "broadband-internet",
    title: "Broadband internet",
    category: "Core",
    summary:
      "Get the right connection type and speed for your school or college, and a backup connection to ensure resilience and appropriate safeguarding systems.",
    govUkUrl:
      "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/broadband-internet-core-standard",
    weight: 1.0,
    subCriteria: [
      {
        code: "BB-1",
        text: "Use a full fibre broadband connection. Copper connections (e.g. ADSL/FTTC) do not meet the standard.",
        rationale: "DfE: \"Copper connections do not meet this standard.\"",
        mustHave: true,
        weight: 1.2,
        descriptors: [
          "Primary connection is copper, or the technology type is unknown.",
          "Full fibre is under consideration or live at some sites only; copper remains primary at most sites.",
          "Full fibre is the primary connection at every site.",
          "Full fibre at every site with contracted throughput SLAs and monitoring of actual sync speeds.",
          "Full fibre with diverse-route delivery, proactive capacity headroom and integration with central network monitoring.",
        ],
      },
      {
        code: "BB-2",
        text: "Meet the minimum speed for the school phase: primary ≥100 Mbps down / 30 Mbps up; secondary, all-through and FE able to deliver 1 Gbps down/up.",
        rationale: "DfE phase-specific minimum throughput.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "Throughput is below the DfE phase minimum, or has never been measured against it.",
          "Speed meets minimum at the door but drops below it under classroom load; no documented test cadence.",
          "Phase minimum is met under typical school load.",
          "Phase minimum exceeded with at least 25% headroom; throughput tested at least annually with results recorded.",
          "Throughput continuously monitored, dashboards visible to SLT digital lead, capacity plan tied to digital strategy.",
        ],
      },
      {
        code: "BB-3",
        text: "Have a backup broadband connection so service continues when the primary fails.",
        rationale: "DfE resilience requirement.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "No backup connection in place.",
          "A backup exists informally (e.g. a tethered phone) but isn't contracted or tested.",
          "Documented backup circuit contracted and proven on at least one failover.",
          "Backup circuit with automatic failover; failover tested annually and logged.",
          "Diverse-carrier, diverse-route backup with continuously verified failover and documented RTO.",
        ],
      },
      {
        code: "BB-4",
        text: "Mitigate single points of failure across the internet edge.",
        rationale:
          "DfE: \"Ensure appropriate measures are in place to mitigate against a single point of failure.\"",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "One router, one circuit, one power feed.",
          "Some redundancy (e.g. dual PSU) but at least one component is still a single point of failure.",
          "Documented review of single-points-of-failure with action plan in progress.",
          "Edge devices are redundant or rapidly replaceable; failure modes documented and rehearsed.",
          "End-to-end resilience verified (circuit, router, power, DNS, filtering); failover regularly exercised end-to-end.",
        ],
      },
      {
        code: "BB-5",
        text: "Operate a content filtering system as part of the broadband service.",
        rationale: "Required by the broadband standard and reinforced by filtering and monitoring.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "No content filter, or the filter is not part of the broadband contract.",
          "Filtering exists but is not aligned with the filtering and monitoring core standard.",
          "Filtering active and aligned with filtering and monitoring requirements.",
          "Filtering reviewed at least annually with documented outcomes; provider performance reviewed.",
          "Filtering integrated with identity (per-user policy), continuously tuned, and tied to safeguarding workflows.",
        ],
      },
      {
        code: "BB-6",
        text: "Have a firewall as part of the internet and network system.",
        rationale: "DfE: firewall required as part of the broadband edge.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "No perimeter firewall, or default-permit configuration.",
          "Firewall present but inbound rules unreviewed and admin interface unhardened.",
          "Firewall configured to block inbound by default; admin access restricted.",
          "Rules reviewed termly and signed off by the SLT digital lead; firmware kept current.",
          "Firewall with IDS/IPS, MFA on admin, alerts wired to monitoring, and rules continuously tuned.",
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // 2. WIRELESS NETWORK (Core)
  // -----------------------------------------------------------------------
  {
    slug: "wireless-network",
    title: "Wireless network",
    category: "Core",
    summary:
      "Use the latest wireless network standards for performance, coverage, management and security in your school or college.",
    govUkUrl:
      "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/wireless-network-core-standard",
    weight: 1.0,
    subCriteria: [
      {
        code: "WL-1",
        text: "Deploy wireless using Wi-Fi 7 at minimum when refreshing or installing new equipment.",
        rationale: "DfE minimum: Wi-Fi 7.",
        weight: 1.0,
        descriptors: [
          "Wireless predominantly Wi-Fi 4/5 or unknown standard; no refresh plan.",
          "Mixed estate with some Wi-Fi 6/6E; no plan to reach Wi-Fi 7 by 2030.",
          "Wi-Fi 7 on new installs; legacy APs scheduled for replacement.",
          "Wi-Fi 7 estate-wide on a documented refresh cycle with capacity model.",
          "Wi-Fi 7 with proactive monitoring, automatic firmware management and per-area capacity tuning.",
        ],
      },
      {
        code: "WL-2",
        text: "Ensure AP backhaul/network interface speeds are not the bottleneck.",
        rationale: "Match AP uplink to the radio throughput.",
        weight: 1.0,
        descriptors: [
          "AP uplinks are 1 Gbps or unknown.",
          "Some APs on multi-gig uplinks; the rest still on 1 Gbps.",
          "All APs have uplinks rated above expected aggregate radio throughput.",
          "Uplink speeds verified by measurement; per-AP utilisation visible to IT support.",
          "Multi-gig uplinks everywhere, PoE budget engineered for peak draw, continuous telemetry.",
        ],
      },
      {
        code: "WL-3",
        text: "Provide a fully functional wireless signal across all school/college buildings, and externally where required.",
        rationale: "DfE coverage requirement.",
        weight: 1.0,
        descriptors: [
          "Coverage gaps known to staff; users move around to get signal.",
          "Most teaching spaces covered; halls/sports/outdoor areas patchy.",
          "Coverage validated by site survey across all teaching and admin areas.",
          "Recent (≤12 months) heatmap including external areas; remediation tracked.",
          "Coverage is continuously monitored with alerts on degradation; survey refreshed on building change.",
        ],
      },
      {
        code: "WL-4",
        text: "Wireless provider designs a solution sized for the school's capacity, density and roaming needs.",
        rationale: "DfE: solution fully meets the school's needs.",
        weight: 1.0,
        descriptors: [
          "No documented design; APs added ad-hoc as needed.",
          "Design exists but doesn't reflect current device density or BYOD load.",
          "Design current; concurrent device counts modelled per AP and validated.",
          "Design reviewed against actual usage at least annually; capacity headroom built in.",
          "Design driven by analytics; roaming, band-steering and load-balancing demonstrably tuned.",
        ],
      },
      {
        code: "WL-5",
        text: "Centrally manage the wireless network.",
        rationale: "DfE: central management required.",
        weight: 1.0,
        descriptors: [
          "Each site/AP managed individually or via consumer-grade tools.",
          "Some central management; not all APs visible in a single pane of glass.",
          "All APs managed through a single controller/cloud console.",
          "Central management with config-as-code/golden config and audit trail of changes.",
          "Central management integrated with monitoring, ticketing and identity; changes peer-reviewed.",
        ],
      },
      {
        code: "WL-6",
        text: "Apply security features to stop unauthorised access (segmented SSIDs, modern encryption, RADIUS where appropriate).",
        rationale: "DfE: security features required.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "Open or WPA-PSK SSIDs in everyday use; no VLAN segmentation.",
          "WPA2-PSK on most SSIDs; staff and student traffic on the same VLAN.",
          "WPA2/3-Enterprise with RADIUS for staff; segmented VLANs by user class.",
          "WPA3 where supported, certificate-based auth for managed devices, BYOD segregated, regular access review.",
          "Posture-checked access (NAC) with conditional access tied to MDM compliance and identity.",
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // 3. NETWORK SWITCHING (Core)
  // -----------------------------------------------------------------------
  {
    slug: "network-switching",
    title: "Network switching",
    category: "Core",
    summary:
      "Make sure your school or college has proper network switches and switching infrastructure for reliability, security and resilience.",
    govUkUrl:
      "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/network-switching-core-standard",
    weight: 1.0,
    subCriteria: [
      {
        code: "NS-1",
        text: "Provide a minimum of 1 Gbps per port with multi-gigabit ports available where modern devices need them.",
        rationale: "DfE minimum 1 Gbps; multi-gig for modern devices.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "Some access ports operate at 100 Mbps or unknown speed.",
          "1 Gbps access estate-wide; no multi-gig ports anywhere.",
          "1 Gbps minimum; multi-gig where modern APs/devices demand it.",
          "1 Gbps to all edges; multi-gig backhaul; port utilisation monitored.",
          "Multi-gig common at the edge; data-driven port refresh plan.",
        ],
      },
      {
        code: "NS-2",
        text: "Replace any switch that no longer receives firmware and security updates.",
        rationale: "DfE: end-of-support kit must be replaced.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "End-of-support or unknown-state switches still in production.",
          "Some end-of-support kit retained \"until it breaks\"; no replacement plan.",
          "All in-production switches receive vendor firmware updates.",
          "Asset register tracks firmware version + EOL date; replacements scheduled before EOL.",
          "Lifecycle automated against vendor advisories; replacements completed within agreed lead time.",
        ],
      },
      {
        code: "NS-3",
        text: "Centrally manage the switching infrastructure.",
        rationale: "DfE: central management.",
        weight: 1.0,
        descriptors: [
          "Switches managed via individual CLI / unknown.",
          "Partial central management.",
          "Single management platform for all switches.",
          "Central management with config-as-code, change logs and access control.",
          "Integrated with monitoring, alerting and identity; configuration changes peer-reviewed.",
        ],
      },
      {
        code: "NS-4",
        text: "Apply switch security features (port security, 802.1X, storm control, hardened admin).",
        rationale: "DfE: security features required.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "Default credentials/no admin hardening.",
          "Some hardening (e.g. admin passwords changed) but no port-level controls.",
          "Admin hardened, ports configured to deny unknown MAC/role.",
          "802.1X or equivalent for managed devices; storm control and BPDU guard enforced.",
          "NAC-driven posture with continuous attestation; security baseline as code.",
        ],
      },
      {
        code: "NS-5",
        text: "Configure VLANs to segregate traffic (staff, student, guest, IoT, admin, management).",
        rationale: "DfE: network segregation.",
        weight: 1.1,
        descriptors: [
          "Single flat VLAN.",
          "A few VLANs but staff/student/admin mingled in places.",
          "Documented VLAN plan in force across all switches.",
          "Inter-VLAN policy reviewed termly; segmentation tested.",
          "Segmentation driven from identity (dynamic VLANs/microsegmentation); enforcement monitored.",
        ],
      },
      {
        code: "NS-6",
        text: "Connect core switches to at least one UPS.",
        rationale: "DfE: UPS on core switches.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "No UPS on core switches.",
          "UPS present but its battery has not been tested.",
          "UPS in service on core switches with documented runtime.",
          "UPS tested at least annually; battery replacement scheduled before EOL.",
          "Dual-feed or redundant UPS; monitoring + alerting on UPS health and runtime.",
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // 4. DIGITAL LEADERSHIP AND GOVERNANCE (Core, weight 1.5 - foundational)
  // -----------------------------------------------------------------------
  {
    slug: "digital-leadership-governance",
    title: "Digital leadership and governance",
    category: "Core",
    summary:
      "Have effective digital technology leadership and governance, roles and responsibilities and processes in your school or college.",
    govUkUrl:
      "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/digital-leadership-and-governance-core-standard",
    weight: 1.5,
    subCriteria: [
      {
        code: "DL-1",
        text: "Assign a senior leadership team (SLT) member as the SLT digital lead, accountable for delivery of the digital technology strategy.",
        rationale: "DfE: headteacher/principal is accountable for assigning this person.",
        mustHave: true,
        weight: 1.2,
        descriptors: [
          "No named SLT digital lead.",
          "Someone informally \"does\" IT but it isn't an SLT role with a written remit.",
          "SLT digital lead named with a written remit covering strategy, IT support oversight and training needs.",
          "SLT digital lead remit reviewed annually; performance feeds into appraisal.",
          "SLT digital lead drives a published digital roadmap, reports to governors termly and links to teaching outcomes.",
        ],
      },
      {
        code: "DL-2",
        text: "Assign a digital link role within the governing body / trust board.",
        rationale: "DfE: governors should consider assigning a digital link role.",
        weight: 1.0,
        descriptors: [
          "No digital link governor.",
          "A governor is informally \"interested in IT\" but has no remit.",
          "Named digital link governor with terms of reference.",
          "Digital link governor receives termly reports and challenges the SLT digital lead.",
          "Digital link role embedded in governance cycle, with annual report to the full board.",
        ],
      },
      {
        code: "DL-3",
        text: "Maintain up-to-date registers for hardware and systems — what equipment, asset numbers, serial numbers, and to whom assigned. Keep printed AND online copies.",
        rationale:
          "DfE: \"Registers should be printed out to retain hard copies in case of an emergency\" AND kept in a secure cloud folder.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "No asset register, or last updated more than a year ago.",
          "Asset register exists in one place (e.g. a spreadsheet) but isn't comprehensive or backed up.",
          "Register covers all in-service hardware/systems; kept in a secure shared cloud folder.",
          "Register reconciled at least termly; printed copy refreshed; ownership clear.",
          "Register integrated with procurement and disposal; reconciled automatically against MDM/AD; immutable change history.",
        ],
      },
      {
        code: "DL-4",
        text: "Maintain an Information Asset Register (IAR) owned by the DPO.",
        rationale: "DfE: DPO owns the IAR.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "No IAR, or no DPO.",
          "IAR partially populated; DPO involvement unclear.",
          "IAR maintained and signed off by the DPO.",
          "IAR reviewed at least annually and on every system change; aligned with the ROPA.",
          "IAR drives DPIAs, retention and access reviews automatically.",
        ],
      },
      {
        code: "DL-5",
        text: "Include digital technology within disaster recovery and business continuity plans, and test those plans at least annually.",
        rationale: "DfE: tested annually (at a minimum).",
        mustHave: true,
        weight: 1.2,
        descriptors: [
          "No DR/BCP, or digital tech not included.",
          "Plan exists on paper but has never been tested.",
          "DR/BCP includes digital systems and is tested at least once a year.",
          "Annual test with documented outcomes and remediation actions tracked to completion.",
          "Tabletop + live tests on a rolling cadence; integrates cyber, supplier and premises scenarios.",
        ],
      },
      {
        code: "DL-6",
        text: "Maintain a digital technology strategy and review it every year.",
        rationale: "DfE: strategy reviewed annually.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "No written digital strategy.",
          "Strategy exists but is more than 12 months old or never formally reviewed.",
          "Strategy current, reviewed annually, owned by the SLT digital lead.",
          "Strategy tied to teaching outcomes and the school development plan; KPIs reported termly.",
          "Strategy actively shaping budget, procurement and curriculum decisions; published to governors and revisited on material change.",
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // 5. FILTERING AND MONITORING (Core, weight 1.5 - safeguarding)
  // -----------------------------------------------------------------------
  {
    slug: "filtering-monitoring",
    title: "Filtering and monitoring",
    category: "Core",
    summary:
      "Provide a safe online environment for your school or college with appropriate filtering and monitoring systems.",
    govUkUrl:
      "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/filtering-and-monitoring-core-standard",
    weight: 1.5,
    subCriteria: [
      {
        code: "FM-1",
        text: "Identify and assign roles: an SLT member, a governor and the DSL with defined responsibilities; make all users (and parents/carers) aware of the policy.",
        rationale: "DfE: named SLT, governor and DSL roles.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "Roles not assigned; policy not communicated.",
          "Roles informally understood but not written down; AUP not signed.",
          "Roles documented; AUP signed by staff, students and parents.",
          "Roles reviewed annually; AUP refreshed; communicated through induction and parent comms.",
          "Roles embedded in safeguarding governance with termly reporting; users actively engaged in policy refresh.",
        ],
      },
      {
        code: "FM-2",
        text: "Review filtering and monitoring provision at least once every academic year (SLT, DSL, IT support); record results.",
        rationale: "DfE: annual review.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "No formal review of provision.",
          "Reviewed informally with no written record.",
          "Annual review conducted and recorded.",
          "Annual review uses a structured rubric; outcomes signed off by SLT and link governor; actions tracked.",
          "Continuous improvement loop: KCSIE-aligned, evidenced, benchmarked, reported to governors.",
        ],
      },
      {
        code: "FM-3",
        text: "Conduct additional reviews on triggers: safeguarding risk, change in working practice, new technology, major software update, or technical config change.",
        rationale: "DfE: trigger-driven reviews.",
        weight: 1.0,
        descriptors: [
          "Reviews never re-run on change.",
          "Reviews sometimes happen when something obvious changes.",
          "Documented triggers exist and reviews are run when they fire.",
          "Trigger log maintained; review outcomes recorded; actions tracked.",
          "Trigger automation (config change → review request) integrated with ITSM.",
        ],
      },
      {
        code: "FM-4",
        text: "Block harmful and inappropriate content without unreasonably impacting teaching and learning.",
        rationale: "DfE: filtering should not block legitimate education.",
        weight: 1.0,
        descriptors: [
          "Filtering either too loose or so tight it blocks normal teaching.",
          "Some over-blocking known to staff; no formal exception process.",
          "Balanced filtering with a documented exception/unblock process.",
          "Exception process reviewed termly; data on unblock volumes used to tune categories.",
          "Per-user/role profiles minimise over-blocking; teacher self-service for context-appropriate temporary unblocks.",
        ],
      },
      {
        code: "FM-5",
        text: "Use a filtering provider that is a member of IWF and signed up to CTIRU. Apply IWF and CTIRU blocklists.",
        rationale:
          "DfE: \"make sure that your filtering provider is a member of IWF\" and \"signed up to CTIRU.\"",
        mustHave: true,
        weight: 1.3,
        descriptors: [
          "Filtering provider's IWF/CTIRU status unknown or not in place.",
          "Provider is IWF-member; CTIRU coverage unclear.",
          "Provider confirmed as IWF member and CTIRU-subscribed; lists active.",
          "Provider compliance confirmed annually in writing; coverage verified by test pages.",
          "Continuous attestation; provider performance reviewed against alternatives at contract renewal.",
        ],
      },
      {
        code: "FM-6",
        text: "Blocklists must be configured so they cannot be disabled, overridden, or altered by any user — including system administrators at any level.",
        rationale:
          "DfE: \"cannot be disabled, overridden, or altered by any user…including system administrators.\"",
        mustHave: true,
        weight: 1.3,
        descriptors: [
          "Admins can disable or override blocklists.",
          "Override is technically possible; controls/justifications informal.",
          "Blocklists configured to resist override; admin processes documented.",
          "Override prevention verified by test; admin actions logged and reviewed.",
          "Tamper-resistance enforced by vendor + tested; logs continuously monitored.",
        ],
      },
      {
        code: "FM-7",
        text: "Use differentiated filtering profiles by age/role rather than a single blanket profile.",
        rationale: "DfE: no blanket profile.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "One filtering profile for all users.",
          "Two crude profiles (staff/student) only.",
          "Profiles differentiated by key-stage and staff role.",
          "Profiles aligned to curriculum and SEND need; reviewed termly.",
          "Profiles dynamically applied via identity; auditable and granular.",
        ],
      },
      {
        code: "FM-8",
        text: "Apply filtering, kept active and up to date, on all school/college-managed devices.",
        rationale: "DfE: applied to all managed devices.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "Filtering not enforced on managed devices off the school network.",
          "Filtering on-prem only; gaps off-site and on guest networks.",
          "Filtering enforced on all managed devices on and off site.",
          "Coverage verified termly via MDM/agent reports.",
          "Filtering posture continuously attested; deviations alert IT support.",
        ],
      },
      {
        code: "FM-9",
        text: "Place non-managed (BYOD) devices on a separate virtual network.",
        rationale: "DfE: BYOD on a separate virtual network.",
        weight: 1.0,
        descriptors: [
          "BYOD on the same network as managed devices.",
          "BYOD partially segregated; some shared resources.",
          "BYOD on a separate VLAN with documented policy.",
          "BYOD VLAN policy reviewed termly; inter-VLAN traffic restricted.",
          "BYOD posture-checked; access scoped via identity and continuously reassessed.",
        ],
      },
      {
        code: "FM-10",
        text: "Operate effective monitoring strategies, with weekly monitoring reports as a minimum.",
        rationale: "DfE: weekly reports minimum.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "No technical monitoring beyond browsing logs.",
          "Monitoring tool installed but reports rarely reviewed.",
          "Weekly reports reviewed by IT support and DSL.",
          "Weekly reports triaged with response SLAs; trends reported to SLT termly.",
          "Real-time alerting on safeguarding-critical triggers; cases tracked to closure with audit trail.",
        ],
      },
      {
        code: "FM-11",
        text: "Notify users that monitoring is active; ensure reports are intelligible to staff; ensure users are identifiable.",
        rationale: "DfE: monitoring transparency + identifiability.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "Users are not notified that monitoring is in place.",
          "Notification buried in policy nobody has read.",
          "Notification at sign-in/AUP; reports identify users.",
          "Notification refreshed annually; reports interpretable without IT translation.",
          "Notification + reporting tuned through user research; staff trained to use the reports directly.",
        ],
      },
      {
        code: "FM-12",
        text: "Lock a safe search engine into the chosen browser; prevent download of unauthorised browsers/plugins.",
        rationale: "DfE: safe-search lock + plugin control.",
        weight: 1.0,
        descriptors: [
          "Safe search not enforced.",
          "Safe search enforced on some browsers only; users can install others.",
          "Safe search locked across managed devices; plugin allow-list enforced.",
          "Configuration verified via MDM reports; deviations alert IT support.",
          "Continuous compliance attestation; browser configuration centrally versioned and rolled out.",
        ],
      },
      {
        code: "FM-13",
        text: "Train staff on the reporting mechanism for filtering/monitoring concerns; conduct in-person monitoring in classrooms.",
        rationale: "DfE: staff trained + in-person monitoring.",
        weight: 1.0,
        descriptors: [
          "Staff don't know how to report a concern.",
          "Reporting route exists but staff training is patchy.",
          "All staff trained on the reporting flow; in-person monitoring in classrooms expected.",
          "Refresher training annually; sample of in-person monitoring observed by SLT.",
          "Reporting culture actively encouraged; trends inform curriculum and policy.",
        ],
      },
      {
        code: "FM-14",
        text: "Conduct Data Protection Impact Assessments (DPIAs) on technical monitoring systems.",
        rationale: "DfE: DPIA for monitoring.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "No DPIA for the monitoring system.",
          "DPIA drafted but not signed off, or out of date.",
          "DPIA signed off and current; risks/mitigations documented.",
          "DPIA reviewed on each material change; aligned with IAR/ROPA.",
          "DPIA evidenced and benchmarked; risks tracked through governance.",
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // 6. CYBER SECURITY (Core, weight 2.0 - largest standard)
  // -----------------------------------------------------------------------
  {
    slug: "cyber-security",
    title: "Cyber security",
    category: "Core",
    summary:
      "Keep your school or college cyber secure, and control and secure user accounts.",
    govUkUrl:
      "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/cyber-security-core-standard",
    weight: 2.0,
    subCriteria: [
      {
        code: "CS-1",
        text: "Conduct an annual cyber risk assessment, reviewed every term; maintain a tested cyber incident response plan.",
        rationale: "DfE Standard 1; RPA condition of cover.",
        mustHave: true,
        weight: 1.3,
        descriptors: [
          "No formal cyber risk assessment.",
          "Assessment exists but is not termly reviewed or tested.",
          "Annual assessment + termly review; response plan exists.",
          "Response plan exercised at least once a year with documented outcomes.",
          "Continuous risk view, exercises run on multiple scenarios, governors briefed.",
        ],
      },
      {
        code: "CS-2",
        text: "Maintain a Record of Processing Activities (ROPA), an asset register, a software register and a contracts register.",
        rationale: "DfE Standard 1 documentation set.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "One or more of ROPA/asset/software/contracts register missing.",
          "Registers exist but are out of date or partial.",
          "All four registers maintained and accurate.",
          "Registers reconciled at least termly; ownership clear; changes audited.",
          "Registers automated where possible; integrated with procurement and DPIA workflow.",
        ],
      },
      {
        code: "CS-3",
        text: "Maintain network documentation (diagrams, IP plan, change log) and an agreed logging level; store documentation in 2+ diverse locations.",
        rationale: "DfE Standard 1 documentation + resilience.",
        weight: 1.0,
        descriptors: [
          "No diagrams or IP plan, or documentation in one place only.",
          "Documentation exists but is out of date; not duplicated.",
          "Documentation current; stored in 2+ diverse locations; logging level agreed.",
          "Documentation versioned and reviewed termly; logging reviewed for fitness.",
          "Documentation as code; diagrams generated from source-of-truth; log retention and SIEM tuning continuously reviewed.",
        ],
      },
      {
        code: "CS-4",
        text: "Maintain an Acceptable Use Policy signed by every account holder.",
        rationale: "DfE Standard 2.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "No AUP, or not signed.",
          "AUP exists but coverage is partial.",
          "AUP signed by all account holders.",
          "AUP refreshed annually and re-signed on material change.",
          "AUP attestation tracked centrally; non-signature triggers access review.",
        ],
      },
      {
        code: "CS-5",
        text: "Deliver cyber awareness training annually (or more often where risk warrants) — staff, students, at least one governor/trustee, and anyone with a login. RPA members must evidence NCSC training.",
        rationale: "DfE Standard 2; RPA condition of cover.",
        mustHave: true,
        weight: 1.2,
        descriptors: [
          "No training programme.",
          "Some staff trained ad-hoc; no evidence held.",
          "Annual training delivered to all account holders; evidence held.",
          "Training tailored by role; refresh on policy change; results reported to governors.",
          "Continuous awareness programme (phishing simulations, micro-learning); metrics drive content.",
        ],
      },
      {
        code: "CS-6",
        text: "Operate a correctly configured firewall — admin password changed from default, MFA on admin where available, remote admin restricted, inbound blocked by default, rules minimal and risk-assessed, firmware kept current, traffic monitored.",
        rationale: "DfE Standard 3 firewall controls.",
        mustHave: true,
        weight: 1.3,
        descriptors: [
          "Firewall missing or running default config.",
          "Some hardening but no MFA on admin and no documented rule review.",
          "Hardened firewall, inbound default-deny, documented rules.",
          "Rules reviewed termly and signed off by the SLT digital lead; alerts wired up.",
          "Firewall posture continuously validated; IDS/IPS tuned; admin actions audited.",
        ],
      },
      {
        code: "CS-7",
        text: "Deploy anti-malware on all devices, centrally managed and actively monitored, with web/file/email/USB scanning.",
        rationale: "DfE Standard 3 anti-malware.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "Anti-malware missing on some devices, or not centrally visible.",
          "Anti-malware present on most devices; central visibility partial.",
          "Centrally managed anti-malware on all devices, monitored.",
          "Coverage verified termly; alerts triaged with SLAs; signature freshness validated.",
          "EDR with automated containment; integrated with SIEM and incident response.",
        ],
      },
      {
        code: "CS-8",
        text: "Disable USB removable storage by default; permit only with specific justification.",
        rationale: "DfE Standard 3: USB prohibited by default.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "USB storage allowed by default.",
          "USB controls inconsistent across devices.",
          "USB disabled by default on managed devices; exceptions documented.",
          "Exception list reviewed termly; usage logged.",
          "USB activity continuously monitored; exceptions time-limited and approved.",
        ],
      },
      {
        code: "CS-9",
        text: "Enforce strong password policy at system level (NCSC-aligned); lock devices after 10 unsuccessful attempts or 10 guesses in 5 minutes; provide alternatives for younger/SEND/EAL learners.",
        rationale: "DfE Standard 4 password and lockout controls.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "Weak or unenforced password policy.",
          "Password policy enforced for some user groups only.",
          "Policy enforced for all users; lockout configured; alternatives available.",
          "Policy aligned with NCSC three-random-words or machine-generated passwords; reviewed annually.",
          "Passwordless or phishing-resistant authentication being adopted where possible.",
        ],
      },
      {
        code: "CS-10",
        text: "Enforce MFA for senior leaders, IT support, finance/HR staff, and anyone handling confidential, financial or sensitive personal data. MFA on cloud admin and remote access.",
        rationale: "DfE Standard 4: MFA must be used.",
        mustHave: true,
        weight: 1.4,
        descriptors: [
          "MFA not enforced for sensitive roles.",
          "MFA enforced for some users; gaps on cloud admin or remote access.",
          "MFA enforced for all required roles, including cloud and remote.",
          "MFA enrolment monitored; non-enrolled accounts blocked from sensitive systems.",
          "Phishing-resistant MFA (FIDO2/security keys) for highest-risk roles; conditional access policies tuned.",
        ],
      },
      {
        code: "CS-11",
        text: "Operate a joiners/movers/leavers process linked to HR/finance, with immediate account disable on leaving and termly access reviews.",
        rationale: "DfE Standard 4 JML + termly review.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "No JML process; leaver accounts remain active.",
          "Leavers usually disabled but with delays; no termly review.",
          "JML SOP in place; leavers disabled promptly; termly review evidenced.",
          "JML linked to HR/MIS; automated where possible; audit sample passes.",
          "JML fully automated end-to-end with break-glass procedure and continuous attestation.",
        ],
      },
      {
        code: "CS-12",
        text: "Apply least privilege; use separate privileged accounts that are not used for routine business; SLT/trustee sign-off on access-level changes; dedicated SLT emergency admin account.",
        rationale: "DfE Standard 4 least privilege.",
        mustHave: true,
        weight: 1.2,
        descriptors: [
          "Admin and day-to-day accounts shared; no privileged separation.",
          "Some admin separation but routine email still on admin accounts.",
          "Privileged accounts separate; emergency admin account configured.",
          "Privileged use logged and reviewed termly; just-in-time elevation considered.",
          "PAM with just-in-time access, session recording, and continuous review.",
        ],
      },
      {
        code: "CS-13",
        text: "License all software; remove unlicensed software; capture EOL dates in the asset register.",
        rationale: "DfE Standard 5 licensing.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "Unknown software inventory; unlicensed software present.",
          "Inventory partial; EOL not tracked.",
          "All software licensed; EOL tracked in the asset register.",
          "Renewal/EOL alerts feed procurement; software requests vetted.",
          "Software inventory continuously discovered (MDM/agents); EOL prompts automated replacement.",
        ],
      },
      {
        code: "CS-14",
        text: "Patch critical/high vulnerabilities (vendor-rated, or CVSS v3.1 ≥ 7.0, or unrated) within 14 days; apply DfE-issued security update instructions within 5 working days.",
        rationale: "DfE Standard 5 patching SLAs.",
        mustHave: true,
        weight: 1.3,
        descriptors: [
          "No tracked patching SLA.",
          "Some patching happens but SLAs are not measured.",
          "SLAs measured and broadly met; exceptions documented.",
          "SLAs reported monthly; missed SLAs trigger remediation actions and risk acceptance.",
          "Patching highly automated; exception rate trended; risk acceptances time-boxed.",
        ],
      },
      {
        code: "CS-15",
        text: "Operate the NCSC 3-2-1 backup rule with immutable backups, termly tested restore, annual plan review. Backups must not be taken to anyone's home; physical offsite backups must be encrypted and stored securely.",
        rationale: "DfE Standard 6 backups; RPA condition.",
        mustHave: true,
        weight: 1.4,
        descriptors: [
          "Backup posture unknown or non-3-2-1.",
          "3-2-1 partially in place; backups not immutable, or not tested.",
          "3-2-1 with immutable copies; termly restore tested.",
          "Annual plan review; documented restore RTO/RPO; encryption verified.",
          "Backup posture continuously validated; ransomware tabletop exercises include backup recovery.",
        ],
      },
      {
        code: "CS-16",
        text: "Operate a cyber incident response capability: report internally and externally (Action Fraud, DfE sector cyber team, NCSC, ICO within 72h where applicable, RPA where applicable, Jisc for FE); maintain an incident register.",
        rationale: "DfE Standard 7 reporting.",
        mustHave: true,
        weight: 1.3,
        descriptors: [
          "No reporting flow; staff don't know who to tell.",
          "Internal reporting exists; external reporting routes unclear.",
          "Internal + external reporting routes documented and trained.",
          "Incident register maintained; reports rehearsed; debriefs feed continuous improvement.",
          "Mature incident response: playbooks per scenario, contact tree current, lessons-learned tracked through governance.",
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // 7. CLOUD SOLUTIONS (Additional)
  // -----------------------------------------------------------------------
  {
    slug: "cloud-solutions",
    title: "Cloud solutions",
    category: "Additional",
    summary:
      "Know how to use or move to cloud solutions for your school or college, including managing access, availability, data protection and backup.",
    govUkUrl:
      "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/cloud-solutions",
    weight: 1.0,
    subCriteria: [
      {
        code: "CL-1",
        text: "Use cloud solutions as a credible alternative to locally-hosted systems where appropriate; train users to use them confidently.",
        weight: 1.0,
        descriptors: [
          "Cloud not considered or used inconsistently.",
          "Some cloud services in use; no strategy or user training.",
          "Cloud strategy documented; users trained.",
          "Cloud-first principle informs procurement; user training refreshed regularly.",
          "Workloads continuously evaluated for cloud suitability; user proficiency measured.",
        ],
      },
      {
        code: "CL-2",
        text: "Ensure cloud solutions comply with data protection: providers vetted, DPIAs completed, data stored/processed in the UK or EU.",
        rationale: "DfE: UK/EU data residency; DPIAs required.",
        mustHave: true,
        weight: 1.2,
        descriptors: [
          "Data residency unknown for one or more cloud services.",
          "Residency confirmed for some services; DPIAs missing or out of date.",
          "All cloud services data-residency confirmed UK/EU; DPIAs in place.",
          "Vendor compliance reviewed annually; DPIAs refreshed on change.",
          "Continuous vendor risk monitoring; sub-processor changes tracked and assessed.",
        ],
      },
      {
        code: "CL-3",
        text: "Apply identity and access management (IAM/SSO) consistently across cloud solutions.",
        weight: 1.1,
        descriptors: [
          "Separate identity silo per service.",
          "Some SSO in place; gaps remain.",
          "IAM/SSO covers all cloud services for staff (and students where applicable).",
          "Conditional access policies enforce posture, location and MFA.",
          "Identity-driven zero-trust access; access reviews automated.",
        ],
      },
      {
        code: "CL-4",
        text: "Verify cloud solutions work on a range of devices and are available when needed (uptime, cross-device compatibility).",
        weight: 1.0,
        descriptors: [
          "Compatibility/availability not assessed.",
          "Known issues with some devices or peak-time availability.",
          "Cross-device compatibility verified; uptime SLAs documented.",
          "Service health monitored; outages communicated proactively.",
          "Availability reported to SLT; vendor SLA performance enforced through contract.",
        ],
      },
      {
        code: "CL-5",
        text: "Apply the NCSC 3-2-1 backup rule to cloud data (3 copies, 2 different media, 1 offsite).",
        rationale: "DfE: 3-2-1 across cloud.",
        mustHave: true,
        weight: 1.2,
        descriptors: [
          "Reliance on vendor's availability backup only.",
          "Some independent backup of cloud data; not 3-2-1.",
          "3-2-1 implemented for cloud data (e.g. M365/Google).",
          "Restore tested at least termly; retention aligns with policy.",
          "Independent immutable backups with continuous restore testing and audit trail.",
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // 8. DIGITAL ACCESSIBILITY (Additional)
  // -----------------------------------------------------------------------
  {
    slug: "digital-accessibility",
    title: "Digital accessibility",
    category: "Additional",
    summary:
      "Make your school or college's digital products, content and services accessible and usable for all.",
    govUkUrl:
      "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/digital-accessibility",
    weight: 1.0,
    subCriteria: [
      {
        code: "DA-1",
        text: "Include digital accessibility in relevant strategies and policies.",
        weight: 1.0,
        descriptors: [
          "Accessibility absent from strategies and policies.",
          "Accessibility mentioned but not operationalised.",
          "Accessibility included in digital strategy, SEND policy and procurement standards.",
          "Accessibility reviewed at each policy refresh; owner named.",
          "Accessibility a first-class design principle across the school; published statement maintained.",
        ],
      },
      {
        code: "DA-2",
        text: "Engage students, staff and parents to identify their digital accessibility needs.",
        weight: 1.0,
        descriptors: [
          "No process to identify accessibility needs.",
          "Needs identified ad-hoc through SEND only.",
          "Documented process to capture accessibility needs at induction and on request.",
          "Needs reviewed termly with SENDCo and pastoral leads; provision recorded.",
          "Co-design with students and parents drives ongoing improvement.",
        ],
      },
      {
        code: "DA-3",
        text: "Make sure everyone knows how to use built-in accessibility features.",
        weight: 1.0,
        descriptors: [
          "Users unaware of accessibility features.",
          "Some users know; coverage uneven.",
          "Guidance available to all users on accessibility features.",
          "Training refreshed annually; champions identified.",
          "Accessibility coaching embedded in CPD; usage measured.",
        ],
      },
      {
        code: "DA-4",
        text: "Ensure hardware and software support accessibility features (procurement requires accessibility conformance).",
        weight: 1.0,
        descriptors: [
          "Accessibility not part of procurement.",
          "Procurement asks ad-hoc; specs are not consistent.",
          "Procurement specs require accessibility conformance / VPATs.",
          "Conformance verified before contract sign-off; renewals re-test.",
          "Accessibility a published vendor requirement; outcomes measured.",
        ],
      },
      {
        code: "DA-5",
        text: "Train staff in accessibility when required.",
        weight: 1.0,
        descriptors: [
          "No accessibility training.",
          "Training delivered to a few staff only.",
          "Staff trained on key accessibility tools and authoring practices.",
          "Refresher training; champions in each phase/department.",
          "Accessibility CPD pathway with measurable competency.",
        ],
      },
      {
        code: "DA-6",
        text: "Communications are accessible to all (multiple formats, plain English, screen-reader friendly).",
        weight: 1.0,
        descriptors: [
          "Communications PDF-only or otherwise inaccessible.",
          "Some communications accessible; inconsistent.",
          "Communications consistently produced in accessible formats.",
          "Alternative formats offered on request and provided promptly.",
          "Accessibility validated automatically (e.g. content checkers) before publication.",
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // 9. IT SUPPORT (Additional)
  // -----------------------------------------------------------------------
  {
    slug: "it-support",
    title: "IT support",
    category: "Additional",
    summary:
      "Plan, commission and review your school or college's IT support services to make sure you have suitable support for your digital technology.",
    govUkUrl:
      "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/it-support",
    weight: 1.0,
    subCriteria: [
      {
        code: "IT-1",
        text: "IT support is commissioned to help meet the other DfE digital and technology standards; relevant professional memberships/certifications assessed.",
        weight: 1.0,
        descriptors: [
          "IT support remit unclear; standards alignment not considered.",
          "Some alignment; certifications unknown.",
          "Remit explicitly references DfE standards; certifications assessed at procurement.",
          "Remit and certifications reviewed annually; gap analysis informs procurement.",
          "Continuous alignment between standards, certifications and IT support performance.",
        ],
      },
      {
        code: "IT-2",
        text: "IT support actively maintains and improves digital technology in line with the digital strategy: maintains registers, keeps tech reliable/secure, backs up critical data and confirms restorability.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "Maintenance is reactive only.",
          "Registers maintained patchily; backup restorability unconfirmed.",
          "Active maintenance documented; restorability confirmed.",
          "Restorability tested at least termly; improvement plan tied to strategy.",
          "Maintenance + improvement metrics reported to SLT and governors.",
        ],
      },
      {
        code: "IT-3",
        text: "Service expectations (response/resolution times, prioritisation) are agreed in writing and reviewed regularly.",
        weight: 1.0,
        descriptors: [
          "No documented service expectations.",
          "SLA implied but not measured.",
          "Documented SLA; performance reported to the SLT digital lead.",
          "SLA reviewed regularly; missed targets trigger remediation.",
          "SLA tuned through data; consultative reviews drive continuous improvement.",
        ],
      },
      {
        code: "IT-4",
        text: "Provide a single, recorded help channel; discourage requests via unofficial channels. Track requests with description, priority and actions.",
        rationale: "DfE: avoid unofficial channels.",
        weight: 1.0,
        descriptors: [
          "No ticketing system; requests through any channel.",
          "Ticketing exists but bypassed for \"quick\" requests.",
          "Ticketing used as the single source of truth; unofficial channels discouraged.",
          "Ticket data analysed for trends; staff trained to use it.",
          "Self-service portal with knowledge base; trend data feeds improvement.",
        ],
      },
      {
        code: "IT-5",
        text: "Review IT support formally at least once a year — fit, value for money, alignment with strategy.",
        rationale: "DfE: annual review.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "IT support never formally reviewed.",
          "Reviewed informally; no written outcomes.",
          "Annual review conducted and documented.",
          "Annual review aligned to digital strategy; benchmark data used.",
          "Review evidences value for money against peer schools/MATs; continuous improvement actions tracked.",
        ],
      },
      {
        code: "IT-6",
        text: "Provide clear technology guidance and induction/refresher training; IT support staff also receive regular training.",
        weight: 1.0,
        descriptors: [
          "No induction or guidance materials.",
          "Some guidance exists but is out of date or hard to find.",
          "Induction + ongoing training delivered; guidance maintained in plain English in an accessible location.",
          "Guidance refreshed on change; uptake measured.",
          "Training pathway with competency tracking; IT support staff have annual CPD plan.",
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // 10. LAPTOPS, DESKTOPS AND TABLETS (Additional)
  // -----------------------------------------------------------------------
  {
    slug: "laptops-desktops-tablets",
    title: "Laptops, desktops and tablets",
    category: "Additional",
    summary:
      "Get the right digital devices for teaching and learning by meeting standards for laptops, desktops and tablets for schools and colleges.",
    govUkUrl:
      "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/laptops-desktops-and-tablets",
    weight: 1.0,
    subCriteria: [
      {
        code: "LD-1",
        text: "Device decisions are aligned with the digital technology strategy and assessed needs of students and staff.",
        weight: 1.0,
        descriptors: [
          "Device decisions made ad-hoc; no strategy link.",
          "Strategy referenced but needs assessment is light.",
          "Procurement aligns with strategy; documented needs assessment.",
          "Annual review of fleet against needs; refresh schedule documented.",
          "Continuous needs assessment; trial / pilot programme informs procurement.",
        ],
      },
      {
        code: "LD-2",
        text: "All devices compatible with filtering, monitoring and security systems; centrally managed via MDM; protective firewall, anti-malware, DPIA where required.",
        rationale: "DfE: must be compatible with existing safeguarding systems.",
        mustHave: true,
        weight: 1.2,
        descriptors: [
          "Devices not centrally managed; consumer-grade kit.",
          "Some devices managed; gaps with filtering/monitoring coverage.",
          "All devices enrolled in MDM and compatible with filtering/monitoring/security.",
          "Coverage verified termly via MDM compliance reports.",
          "Device posture continuously attested; conditional access tied to compliance.",
        ],
      },
      {
        code: "LD-3",
        text: "Devices meet minimum specs: enterprise/education OS; laptop/desktop 5-year support / 3-year warranty; tablet 3-year support / 2-year warranty / ≥9.7\" screen; Wi-Fi 6 recommended (802.11ac Wave 2 minimum).",
        rationale: "DfE minimum specs.",
        weight: 1.0,
        descriptors: [
          "Specs unknown or below DfE minimum.",
          "Some devices meet spec; legacy stock falls short.",
          "Procurement enforces DfE minimum specs.",
          "Specs verified at PO stage; non-compliant orders blocked.",
          "Spec strategy ahead of DfE minimum; rolling refresh cycle aligned to vendor support windows.",
        ],
      },
      {
        code: "LD-4",
        text: "Devices procured/disposed sustainably and securely: WEEE-compliant disposal; certified data sanitisation before disposal; energy efficiency considered.",
        rationale: "DfE: WEEE + data destruction + energy efficiency.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "Disposal unmanaged or undocumented.",
          "WEEE compliant but data destruction unverified.",
          "WEEE + certified data destruction recorded for every disposal.",
          "Disposal contract reviewed annually; energy efficiency considered in procurement.",
          "Lifecycle metrics (carbon, e-waste) published; circular use (refurb, reuse) prioritised.",
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // 11. NETWORK CABLING (Additional)
  // -----------------------------------------------------------------------
  {
    slug: "network-cabling",
    title: "Network cabling",
    category: "Additional",
    summary:
      "Make sure you have the right copper cabling, optical fibre cabling and installation in your school or college.",
    govUkUrl:
      "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/network-cabling",
    weight: 1.0,
    subCriteria: [
      {
        code: "NC-1",
        text: "Copper cabling: Cat 6A, BS 6701 / 50173 / 50174 compliant, installed channel ≤90 m, U/FTP recommended, fire rating Euroclass Cca s1b,d2,a2.",
        rationale: "DfE copper spec.",
        weight: 1.0,
        descriptors: [
          "Cabling is Cat 5e or lower, or specification unknown.",
          "Mixed estate; new runs are Cat 6A but legacy is below spec.",
          "All new and refreshed cabling meets DfE spec.",
          "Cable schedule with test certificates per outlet kept up to date.",
          "Spec proactively exceeds DfE minimum where future-proofing is needed; ongoing test programme.",
        ],
      },
      {
        code: "NC-2",
        text: "Optical fibre: minimum 16-core multi-mode OM4 between buildings; underground ducts where possible.",
        rationale: "DfE fibre spec.",
        weight: 1.0,
        descriptors: [
          "Fibre is OM1/OM2/OM3 or unknown.",
          "OM4 in some runs; legacy OM3 elsewhere.",
          "OM4 (≥16-core) across all building interconnects.",
          "Documented fibre schedule with test results; spare capacity available.",
          "Fibre topology designed with redundancy and growth headroom; condition monitored.",
        ],
      },
      {
        code: "NC-3",
        text: "No intermediate splices/patch panels in cable runs; minimum bend radius respected.",
        weight: 1.0,
        descriptors: [
          "Splices/patch panels present in horizontal runs.",
          "Some runs comply; legacy runs do not.",
          "All new/refreshed runs comply; legacy non-compliant runs remediated on refresh.",
          "Installation reviewed at handover; bend radius checked.",
          "Continuous quality audit; remediation scheduled before failure.",
        ],
      },
      {
        code: "NC-4",
        text: "Cabling installed by a manufacturer-approved partner with at least a 20-year manufacturer's performance warranty.",
        rationale: "DfE: ≥20-year warranty by approved installer.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "Installation by uncertified contractor or DIY.",
          "Some certificated installation; warranty <20 years or partial.",
          "Approved-installer + 20-year warranty for new/refresh runs.",
          "Warranty registered, certificates filed; renewals tracked.",
          "Installer performance benchmarked; warranty drawn on when needed; lessons captured.",
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // 12. SERVERS AND STORAGE (Additional)
  // -----------------------------------------------------------------------
  {
    slug: "servers-and-storage",
    title: "Servers and storage",
    category: "Additional",
    summary:
      "Make sure you choose the right servers and storage for your school or college, including security, energy efficiency and suitable environments.",
    govUkUrl:
      "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/servers-and-storage",
    weight: 1.0,
    subCriteria: [
      {
        code: "SS-1",
        text: "Servers and storage tolerate single-component failure: monitoring + alerting, rapid component replacement, firmware/patches up to date, EOL replacement scheduled.",
        mustHave: true,
        weight: 1.0,
        descriptors: [
          "Single points of failure unmanaged; no monitoring.",
          "Some redundancy; monitoring patchy.",
          "Redundant components on critical systems; monitoring + alerting in place.",
          "Replacement SLAs agreed; firmware/patch cadence enforced; EOL tracked.",
          "Continuous health monitoring with automated remediation; capacity headroom planned.",
        ],
      },
      {
        code: "SS-2",
        text: "Servers and storage are secure, licensed, updated and well-managed; reviewed at least termly or on any change.",
        rationale: "DfE: termly review minimum.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "Configuration unknown; reviews not occurring.",
          "Some review; changes not always documented.",
          "Termly configuration review; changes documented.",
          "Reviews evidenced with remediation tracked; baseline configuration enforced.",
          "Configuration-as-code; drift continuously detected and corrected.",
        ],
      },
      {
        code: "SS-3",
        text: "Servers and storage are energy efficient (power-saving when inactive, unused features disabled).",
        weight: 0.9,
        descriptors: [
          "Energy efficiency not considered.",
          "Some power-saving in place; not measured.",
          "Power-saving enabled where it doesn't impact performance.",
          "Energy use measured; consolidation considered to reduce footprint.",
          "Energy footprint tracked and reported; sustainability factored into refresh decisions.",
        ],
      },
      {
        code: "SS-4",
        text: "Servers and storage are kept in a dedicated, secure, locked room — no liquids, no windows, no battery-powered end-user devices stored, not directly accessible from a classroom.",
        rationale: "DfE physical environment rules.",
        mustHave: true,
        weight: 1.1,
        descriptors: [
          "Servers in a classroom cupboard or unsuitable location.",
          "Dedicated space exists but one or more DfE rules breached (e.g. liquids stored nearby).",
          "Dedicated, locked, suitable environment meeting all DfE conditions.",
          "Environmental monitoring (temperature, humidity, smoke) with alerts.",
          "Physical and environmental controls audited annually with remediation actions tracked.",
        ],
      },
    ],
  },
];

// --------------------------------------------------------------------
// DB connection (mirrors api/db.ts but is single-use for the seed run)
// --------------------------------------------------------------------

async function getDbClient(): Promise<Client> {
  const credential = new DefaultAzureCredential();
  const tok = await credential.getToken(
    "https://ossrdbms-aad.database.windows.net/.default",
  );
  if (!tok) throw new Error("Failed to acquire AAD token for Postgres");
  const client = new Client({
    host: process.env.AIP_PG_HOST,
    database: process.env.AIP_PG_DATABASE,
    user: process.env.AIP_PG_USER,
    password: tok.token,
    port: 5432,
    ssl: { rejectUnauthorized: false },
    options: "-c search_path=app,public",
  });
  await client.connect();
  return client;
}

async function seed() {
  const client = await getDbClient();
  try {
    await client.query("BEGIN");

    // Upsert the version row, then wipe its standards so we re-create cleanly.
    const v = await client.query<{ id: string }>(
      `INSERT INTO standards_version (version, published_at, source_notes)
       VALUES ($1, $2, $3)
       ON CONFLICT (version) DO UPDATE
         SET published_at = EXCLUDED.published_at,
             source_notes = EXCLUDED.source_notes
       RETURNING id`,
      [
        VERSION,
        VERSION_PUBLISHED_AT,
        "Seeded from gov.uk DfE digital and technology standards for schools and colleges.",
      ],
    );
    const versionId = v.rows[0].id;

    // Cascades to sub_criterion and level_descriptor via FK ON DELETE CASCADE.
    await client.query(`DELETE FROM standard WHERE version_id = $1`, [versionId]);

    for (const [stdIdx, std] of STANDARDS.entries()) {
      const stdRes = await client.query<{ id: string }>(
        `INSERT INTO standard
           (version_id, slug, title, category, summary, gov_uk_url, weight, order_index)
         VALUES ($1, $2, $3, $4::"standard_category", $5, $6, $7, $8)
         RETURNING id`,
        [
          versionId,
          std.slug,
          std.title,
          std.category,
          std.summary,
          std.govUkUrl,
          std.weight ?? 1.0,
          stdIdx,
        ],
      );
      const standardId = stdRes.rows[0].id;

      for (const [scIdx, sc] of std.subCriteria.entries()) {
        const scRes = await client.query<{ id: string }>(
          `INSERT INTO sub_criterion
             (standard_id, code, text, rationale, must_have, weight, order_index)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id`,
          [
            standardId,
            sc.code,
            sc.text,
            sc.rationale ?? null,
            sc.mustHave ?? false,
            sc.weight ?? 1.0,
            scIdx,
          ],
        );
        const subCriterionId = scRes.rows[0].id;

        for (let level = 1; level <= 5; level++) {
          await client.query(
            `INSERT INTO level_descriptor (sub_criterion_id, level, descriptor)
             VALUES ($1, $2, $3)`,
            [subCriterionId, level, sc.descriptors[level - 1]],
          );
        }
      }
      console.log(
        `  ✓ ${std.slug} (${std.subCriteria.length} sub-criteria, ${std.subCriteria.length * 5} descriptors)`,
      );
    }

    await client.query("COMMIT");

    const totalSub = STANDARDS.reduce((n, s) => n + s.subCriteria.length, 0);
    console.log(
      `\nSeeded ${STANDARDS.length} standards / ${totalSub} sub-criteria / ${
        totalSub * 5
      } descriptors as version ${VERSION}.`,
    );
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    await client.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
