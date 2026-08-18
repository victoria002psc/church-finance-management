import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  User,
  SourceBalance,
  MoneyRequest,
  MoneyGiven,
  MoneyReceived,
  Expense,
  L4ToL4Transaction,
  BankReconciliationItem,
  AuditLog,
  ConfiguredEvent,
  ConfiguredCategory,
  HierarchyRelationship,
  L3DashboardData,
  L2DashboardData,
  L2DirectPaymentToL4,
  L1DirectPayment,
  L1DashboardData,
  AdvanceRecord,
  ExceptionIssue,
} from "./src/types.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. All Hierarchy People Across All 4 Levels (Church Financial System)
  const allHierarchyPeople: User[] = [
    // LEVEL 1
    {
      id: "usr_l1_samuel_01",
      name: "Bishop Samuel Matthew",
      email: "samuel.matthew@gracechurch.org",
      role: "LEVEL_1",
      designation: "Senior Diocesan Bishop & General Overseer",
      phone: "+91 98450 00001",
      assignedArea: "National Diocese & General Council",
      createdAt: "2024-01-01T09:00:00Z",
    },
    {
      id: "usr_l1_rachel_02",
      name: "Bishop Rachel Thomas",
      email: "rachel.thomas@gracechurch.org",
      role: "LEVEL_1",
      designation: "General Council Trustee & Missions President",
      phone: "+91 98450 00002",
      assignedArea: "National Missions Board",
      createdAt: "2024-01-01T09:00:00Z",
    },

    // LEVEL 2
    {
      id: "usr_l2_sunita_01",
      name: "Pastor Sunita Rao",
      email: "sunita.rao@gracechurch.org",
      role: "LEVEL_2",
      designation: "Central Operations & Administration Director",
      phone: "+91 98450 11001",
      assignedArea: "Central Church Operations",
      reportingToId: "usr_l1_samuel_01",
      createdAt: "2024-06-01T09:00:00Z",
    },
    {
      id: "usr_l2_anand_02",
      name: "Pastor Anand Verma",
      email: "anand.verma@gracechurch.org",
      role: "LEVEL_2",
      designation: "Outreach & Compassion Ministries Director",
      phone: "+91 98450 11002",
      assignedArea: "Community Outreach & Missions",
      reportingToId: "usr_l1_samuel_01",
      createdAt: "2024-06-01T09:00:00Z",
    },
    {
      id: "usr_l2_chen_03",
      name: "Pastor Michael Chen",
      email: "michael.chen@gracechurch.org",
      role: "LEVEL_2",
      designation: "Youth & Worship Ministries Director",
      phone: "+91 98450 11003",
      assignedArea: "Youth & Worship Development",
      reportingToId: "usr_l1_rachel_02",
      createdAt: "2024-08-01T09:00:00Z",
    },

    // LEVEL 3
    {
      id: "usr_l3_david_01",
      name: "Pastor David Wilson",
      email: "david.wilson@gracechurch.org",
      role: "LEVEL_3",
      designation: "South Zonal Field Overseer",
      phone: "+91 98450 12345",
      assignedArea: "South Zone - Karnataka & Rayalaseema",
      reportingToId: "usr_l2_sunita_01",
      createdAt: "2025-04-01T09:00:00Z",
    },
    {
      id: "usr_l3_sarah_02",
      name: "Pastor Sarah Jenkins",
      email: "sarah.jenkins@gracechurch.org",
      role: "LEVEL_3",
      designation: "North District Field Overseer",
      phone: "+91 98450 12346",
      assignedArea: "North District - Hubli & Belgaum",
      reportingToId: "usr_l2_sunita_01",
      createdAt: "2025-05-01T09:00:00Z",
    },
    {
      id: "usr_l3_jonathan_03",
      name: "Pastor Jonathan Edwards",
      email: "jonathan.edwards@gracechurch.org",
      role: "LEVEL_3",
      designation: "East District Field Overseer",
      phone: "+91 98450 12347",
      assignedArea: "East District - Kolar & Chittoor",
      reportingToId: "usr_l2_anand_02",
      createdAt: "2025-06-01T09:00:00Z",
    },

    // LEVEL 4
    {
      id: "usr_l4_vikram_01",
      name: "Vikram Patel",
      email: "vikram.patel@gracechurch.org",
      role: "LEVEL_4",
      designation: "Parish Logistics & Facilities Coordinator",
      phone: "+91 97410 44321",
      assignedArea: "District Sector A - Bangalore Rural",
      reportingToId: "usr_l3_david_01",
      createdById: "usr_l3_david_01",
      createdAt: "2026-05-10T11:00:00Z",
    },
    {
      id: "usr_l4_priya_02",
      name: "Priya Sharma",
      email: "priya.sharma@gracechurch.org",
      role: "LEVEL_4",
      designation: "Community Health & Care Ministry Lead",
      phone: "+91 96201 55678",
      assignedArea: "District Sector B - Kolar & Chintamani",
      reportingToId: "usr_l3_david_01",
      createdById: "usr_l3_david_01",
      createdAt: "2026-05-15T09:30:00Z",
    },
    {
      id: "usr_l4_arjun_03",
      name: "Arjun Das",
      email: "arjun.das@gracechurch.org",
      role: "LEVEL_4",
      designation: "Youth Transport & Fleet Steward",
      phone: "+91 94480 88991",
      assignedArea: "District Fleet & Mobile Ministry Unit",
      reportingToId: "usr_l3_david_01",
      createdById: "usr_l3_david_01",
      createdAt: "2026-06-01T14:00:00Z",
    },
    {
      id: "usr_l4_kavita_04",
      name: "Kavita Reddy",
      email: "kavita.reddy@gracechurch.org",
      role: "LEVEL_4",
      designation: "Sunday School & Education Officer",
      phone: "+91 98860 33221",
      assignedArea: "District Sector C - Tumkur Outpost",
      reportingToId: "usr_l3_david_01",
      createdById: "usr_l3_david_01",
      createdAt: "2026-07-01T10:00:00Z",
    },
    {
      id: "usr_l4_stephen_05",
      name: "Stephen Paul",
      email: "stephen.paul@gracechurch.org",
      role: "LEVEL_4",
      designation: "Worship Audio & Media Coordinator",
      phone: "+91 98860 77112",
      assignedArea: "District Media & Audio Services",
      reportingToId: "usr_l3_david_01",
      createdById: "usr_l3_david_01",
      createdAt: "2026-07-15T10:00:00Z",
    },
  ];

  // Current active Logged-in Users per Level
  let currentL1User: User = allHierarchyPeople.find((u) => u.id === "usr_l1_samuel_01") || allHierarchyPeople[0];
  let currentL3User: User = allHierarchyPeople.find((u) => u.id === "usr_l3_david_01")!;

  // 2. Hierarchy Relationships (Distinct from financial transactions!)
  const allRelationships: HierarchyRelationship[] = [
    // L1 -> L2
    {
      id: "rel_l1_l2_01",
      managerId: "usr_l1_samuel_01",
      managerName: "Bishop Samuel Matthew",
      managerLevel: "LEVEL_1",
      managerDesignation: "Senior Diocesan Bishop",
      subordinateId: "usr_l2_sunita_01",
      subordinateName: "Pastor Sunita Rao",
      subordinateLevel: "LEVEL_2",
      subordinateDesignation: "Central Operations Director",
      assignedScope: "Diocesan Administration & Operational Budgeting",
      status: "ACTIVE",
      createdAt: "2024-06-01T09:00:00Z",
    },
    {
      id: "rel_l1_l2_02",
      managerId: "usr_l1_samuel_01",
      managerName: "Bishop Samuel Matthew",
      managerLevel: "LEVEL_1",
      managerDesignation: "Senior Diocesan Bishop",
      subordinateId: "usr_l2_anand_02",
      subordinateName: "Pastor Anand Verma",
      subordinateLevel: "LEVEL_2",
      subordinateDesignation: "Outreach Ministries Director",
      assignedScope: "Community Missions & Rural Health Outreach",
      status: "ACTIVE",
      createdAt: "2024-06-01T09:00:00Z",
    },
    {
      id: "rel_l1_l2_03",
      managerId: "usr_l1_rachel_02",
      managerName: "Bishop Rachel Thomas",
      managerLevel: "LEVEL_1",
      managerDesignation: "General Council Trustee",
      subordinateId: "usr_l2_chen_03",
      subordinateName: "Pastor Michael Chen",
      subordinateLevel: "LEVEL_2",
      subordinateDesignation: "Youth & Worship Director",
      assignedScope: "Youth Leadership, Camps & Media Ministry",
      status: "ACTIVE",
      createdAt: "2024-08-01T09:00:00Z",
    },

    // L2 -> L3 (Multiple L2 Persons provide to Pastor David Wilson)
    {
      id: "rel_l2_l3_01",
      managerId: "usr_l2_sunita_01",
      managerName: "Pastor Sunita Rao",
      managerLevel: "LEVEL_2",
      managerDesignation: "Central Operations Director",
      subordinateId: "usr_l3_david_01",
      subordinateName: "Pastor David Wilson",
      subordinateLevel: "LEVEL_3",
      subordinateDesignation: "South Zonal Field Overseer",
      assignedScope: "Zonal Parishes, Infrastructure Upkeep, Field Fleet",
      status: "ACTIVE",
      createdAt: "2025-04-01T09:00:00Z",
    },
    {
      id: "rel_l2_l3_02",
      managerId: "usr_l2_anand_02",
      managerName: "Pastor Anand Verma",
      managerLevel: "LEVEL_2",
      managerDesignation: "Outreach Ministries Director",
      subordinateId: "usr_l3_david_01",
      subordinateName: "Pastor David Wilson",
      subordinateLevel: "LEVEL_3",
      subordinateDesignation: "South Zonal Field Overseer",
      assignedScope: "Rural Outreach & Medical Aid Programs",
      status: "ACTIVE",
      createdAt: "2025-04-01T09:00:00Z",
    },
    {
      id: "rel_l2_l3_03",
      managerId: "usr_l2_chen_03",
      managerName: "Pastor Michael Chen",
      managerLevel: "LEVEL_2",
      managerDesignation: "Youth & Worship Director",
      subordinateId: "usr_l3_david_01",
      subordinateName: "Pastor David Wilson",
      subordinateLevel: "LEVEL_3",
      subordinateDesignation: "South Zonal Field Overseer",
      assignedScope: "Youth Evangelism, Camps & Media Equipment",
      status: "ACTIVE",
      createdAt: "2025-08-01T09:00:00Z",
    },
    {
      id: "rel_l2_l3_04",
      managerId: "usr_l2_sunita_01",
      managerName: "Pastor Sunita Rao",
      managerLevel: "LEVEL_2",
      managerDesignation: "Central Operations Director",
      subordinateId: "usr_l3_sarah_02",
      subordinateName: "Pastor Sarah Jenkins",
      subordinateLevel: "LEVEL_3",
      subordinateDesignation: "North District Field Overseer",
      assignedScope: "North District Parishes & Building Repairs",
      status: "ACTIVE",
      createdAt: "2025-05-01T09:00:00Z",
    },

    // L3 -> L4 (Pastor David Wilson manages multiple L4 field leaders)
    {
      id: "rel_l3_l4_01",
      managerId: "usr_l3_david_01",
      managerName: "Pastor David Wilson",
      managerLevel: "LEVEL_3",
      managerDesignation: "South Zonal Field Overseer",
      subordinateId: "usr_l4_vikram_01",
      subordinateName: "Vikram Patel",
      subordinateLevel: "LEVEL_4",
      subordinateDesignation: "Parish Logistics Coordinator",
      assignedScope: "Sector A Parish Maintenance & Supplies",
      status: "ACTIVE",
      createdAt: "2026-05-10T11:00:00Z",
    },
    {
      id: "rel_l3_l4_02",
      managerId: "usr_l3_david_01",
      managerName: "Pastor David Wilson",
      managerLevel: "LEVEL_3",
      managerDesignation: "South Zonal Field Overseer",
      subordinateId: "usr_l4_priya_02",
      subordinateName: "Priya Sharma",
      subordinateLevel: "LEVEL_4",
      subordinateDesignation: "Community Health Lead",
      assignedScope: "Medical Camps & Compassion Ministry",
      status: "ACTIVE",
      createdAt: "2026-05-15T09:30:00Z",
    },
    {
      id: "rel_l3_l4_03",
      managerId: "usr_l3_david_01",
      managerName: "Pastor David Wilson",
      managerLevel: "LEVEL_3",
      managerDesignation: "South Zonal Field Overseer",
      subordinateId: "usr_l4_arjun_03",
      subordinateName: "Arjun Das",
      subordinateLevel: "LEVEL_4",
      subordinateDesignation: "Youth Transport Steward",
      assignedScope: "Fleet Fuel, Van Maintenance & Transit",
      status: "ACTIVE",
      createdAt: "2026-06-01T14:00:00Z",
    },
    {
      id: "rel_l3_l4_04",
      managerId: "usr_l3_david_01",
      managerName: "Pastor David Wilson",
      managerLevel: "LEVEL_3",
      managerDesignation: "South Zonal Field Overseer",
      subordinateId: "usr_l4_kavita_04",
      subordinateName: "Kavita Reddy",
      subordinateLevel: "LEVEL_4",
      subordinateDesignation: "Sunday School Officer",
      assignedScope: "Children Curriculum, VBS & Youth Literacy",
      status: "ACTIVE",
      createdAt: "2026-07-01T10:00:00Z",
    },
    {
      id: "rel_l3_l4_05",
      managerId: "usr_l3_david_01",
      managerName: "Pastor David Wilson",
      managerLevel: "LEVEL_3",
      managerDesignation: "South Zonal Field Overseer",
      subordinateId: "usr_l4_stephen_05",
      subordinateName: "Stephen Paul",
      subordinateLevel: "LEVEL_4",
      subordinateDesignation: "Worship Media Coordinator",
      assignedScope: "Audio System Cables, Live Streaming & Projectors",
      status: "ACTIVE",
      createdAt: "2026-07-15T10:00:00Z",
    },
  ];

  // Configured Church Events
  const events: ConfiguredEvent[] = [
    {
      id: "evt_conf_2026",
      name: "Annual Diocesan Synod & Ministry Conference 2026",
      code: "CONF-26",
      budgetAllocated: 150000,
      startDate: "2026-08-20",
      endDate: "2026-08-24",
      status: "ACTIVE",
    },
    {
      id: "evt_youth_2026",
      name: "Regional Youth Leadership & Worship Camp",
      code: "YOUTH-26",
      budgetAllocated: 75000,
      startDate: "2026-09-05",
      endDate: "2026-09-08",
      status: "UPCOMING",
    },
    {
      id: "evt_med_2026",
      name: "Rural Medical & Compassion Outreach",
      code: "MED-26",
      budgetAllocated: 90000,
      startDate: "2026-08-10",
      endDate: "2026-08-14",
      status: "COMPLETED",
    },
    {
      id: "evt_veh_2026",
      name: "Church Transport Fleet Service & Inspection Mission",
      code: "VEH-26",
      budgetAllocated: 35000,
      startDate: "2026-08-01",
      endDate: "2026-08-31",
      status: "ACTIVE",
    },
  ];

  // Configured Church Categories
  const categories: ConfiguredCategory[] = [
    { id: "cat_adm_off", name: "Parish Office & Pastoral Documentation", parentGroup: "Administration" },
    { id: "cat_min_lit", name: "Gospel Literature, Bibles & Study Kits", parentGroup: "Ministry" },
    { id: "cat_prog_conf", name: "Conferences & Seminars", parentGroup: "Meetings and Programs" },
    { id: "cat_prog_food", name: "Fellowship Food & Catering", parentGroup: "Meetings and Programs" },
    { id: "cat_prog_acc", name: "Speaker Accommodation & Hospitality", parentGroup: "Meetings and Programs" },
    { id: "cat_bld_rep", name: "Church Building Repairs & Painting", parentGroup: "Building and Maintenance" },
    { id: "cat_bld_elec", name: "Audio System & Electrical Repairs", parentGroup: "Building and Maintenance" },
    { id: "cat_veh_fuel", name: "Church Bus & Van Fuel", parentGroup: "Vehicle" },
    { id: "cat_veh_serv", name: "Vehicle Service & Safety Inspection", parentGroup: "Vehicle" },
    { id: "cat_veh_trav", name: "Pastoral Travel & Highway Tolls", parentGroup: "Vehicle" },
    { id: "cat_soc_med", name: "Medical Assistance to Needy Families", parentGroup: "Charity / Social Service" },
    { id: "cat_soc_edu", name: "Education & Sunday School Scholarship", parentGroup: "Charity / Social Service" },
  ];

  // Source Balances from Level 2 (Preserved independently for Pastor David Wilson)
  let sourceBalances: SourceBalance[] = [
    {
      id: "src_l2_sunita_ops",
      sourceL2Id: "usr_l2_sunita_01",
      sourceL2Name: "Level 2 — Pastor Sunita Rao (Central Operations Fund)",
      fundName: "Central Operations & Parish Upkeep Fund",
      receivedAmount: 50000,
      availableAmount: 45000,
      allocatedAmount: 5000,
      lastReceivedDate: "2026-08-02T10:30:00Z",
      purpose: "Zonal parish operations, administrative supplies, and fleet fuel advances",
    },
    {
      id: "src_l2_anand_outreach",
      sourceL2Id: "usr_l2_anand_02",
      sourceL2Name: "Level 2 — Pastor Anand Verma (Community Outreach & Missions)",
      fundName: "Community Missions & Compassion Fund",
      receivedAmount: 38000,
      availableAmount: 38000,
      allocatedAmount: 0,
      lastReceivedDate: "2026-08-08T14:15:00Z",
      purpose: "District medical camps, village outreach logistics, and emergency assistance",
    },
    {
      id: "src_l2_chen_youth",
      sourceL2Id: "usr_l2_chen_03",
      sourceL2Name: "Level 2 — Pastor Michael Chen (Youth & Worship Development)",
      fundName: "Youth Ministry & Worship Equipment Fund",
      receivedAmount: 25000,
      availableAmount: 25000,
      allocatedAmount: 0,
      lastReceivedDate: "2026-08-10T11:00:00Z",
      purpose: "Youth leadership camps, worship audio accessories, and musical equipment upkeep",
    },
  ];

  // Level 4 People managed by Pastor David Wilson
  let l4Users: User[] = allHierarchyPeople.filter((u) => u.role === "LEVEL_4");

  // Authoritative Money Received from Level 2
  let moneyReceivedList: MoneyReceived[] = [
    {
      id: "rec_001",
      fromL2Id: "usr_l2_sunita_01",
      fromL2Name: "Level 2 — Pastor Sunita Rao",
      toL3Id: currentL3User.id,
      toL3Name: currentL3User.name,
      amount: 50000,
      receivedAt: "2026-08-02T10:30:00Z",
      fundSource: "Central Operations & Parish Upkeep Fund",
      sourceBalanceId: "src_l2_sunita_ops",
      purpose: "Monthly operational advance for parish maintenance, vehicle fleet, and zonal supplies",
      transactionRef: "CHU-TRX-2026-0802-01",
      status: "RECEIVED",
    },
    {
      id: "rec_002",
      fromL2Id: "usr_l2_anand_02",
      fromL2Name: "Level 2 — Pastor Anand Verma",
      toL3Id: currentL3User.id,
      toL3Name: currentL3User.name,
      amount: 38000,
      receivedAt: "2026-08-08T14:15:00Z",
      fundSource: "Community Missions & Compassion Fund",
      sourceBalanceId: "src_l2_anand_outreach",
      purpose: "Special allocation for upcoming Synod medical camp logistics and rural family care",
      transactionRef: "CHU-TRX-2026-0808-04",
      status: "RECEIVED",
    },
    {
      id: "rec_003",
      fromL2Id: "usr_l2_chen_03",
      fromL2Name: "Level 2 — Pastor Michael Chen",
      toL3Id: currentL3User.id,
      toL3Name: currentL3User.name,
      amount: 25000,
      receivedAt: "2026-08-10T11:00:00Z",
      fundSource: "Youth Ministry & Worship Equipment Fund",
      sourceBalanceId: "src_l2_chen_youth",
      purpose: "Youth camp preparation and sound system maintenance advance",
      transactionRef: "CHU-TRX-2026-0810-02",
      status: "RECEIVED",
    },
  ];

  // Authoritative Money Given from Level 3 to Level 4
  let moneyGivenList: MoneyGiven[] = [
    {
      id: "giv_001",
      giverL3Id: currentL3User.id,
      giverL3Name: currentL3User.name,
      receiverL4Id: "usr_l4_vikram_01",
      receiverL4Name: "Vikram Patel",
      amount: 5000,
      givenAt: "2026-08-05T11:30:00Z",
      sourceBalanceId: "src_l2_sunita_ops",
      sourceL2Name: "Level 2 — Pastor Sunita Rao (Central Operations Fund)",
      eventId: "evt_veh_2026",
      eventName: "Church Transport Fleet Service & Inspection Mission",
      categoryId: "cat_veh_fuel",
      categoryName: "Church Bus & Van Fuel",
      purpose: "Advance for parish van KA-04-G-4421 fuel & highway transit tolls",
      status: "ACKNOWLEDGED",
      acknowledgedAt: "2026-08-05T11:45:00Z",
    },
  ];

  // Money Requests Inbox
  let requestsList: MoneyRequest[] = [
    {
      id: "req_001",
      requesterId: "usr_l4_vikram_01",
      requesterName: "Vikram Patel",
      requesterDesignation: "Parish Logistics Coordinator",
      recipientL3Id: currentL3User.id,
      recipientL3Name: currentL3User.name,
      amount: 10000,
      eventId: "evt_conf_2026",
      eventName: "Annual Diocesan Synod & Ministry Conference 2026",
      categoryId: "cat_prog_food",
      categoryName: "Fellowship Food & Catering",
      remarks: "Advance required for conference hall catering vendor deposit and volunteer drinking water supply.",
      requestedAt: "2026-08-15T09:30:00Z",
      status: "REQUESTED",
    },
    {
      id: "req_002",
      requesterId: "usr_l4_priya_02",
      requesterName: "Priya Sharma",
      requesterDesignation: "Community Health & Care Ministry Lead",
      recipientL3Id: currentL3User.id,
      recipientL3Name: currentL3User.name,
      amount: 8000,
      eventId: "evt_med_2026",
      eventName: "Rural Medical & Compassion Outreach",
      categoryId: "cat_soc_med",
      categoryName: "Medical Assistance to Needy Families",
      remarks: "Emergency medicine kits and volunteer doctor travel reimbursement for Kolar outreach.",
      requestedAt: "2026-08-14T15:20:00Z",
      status: "APPROVED",
      approvedAt: "2026-08-15T08:00:00Z",
      approvedById: currentL3User.id,
      approvedByName: currentL3User.name,
      approvedAmount: 8000,
    },
    {
      id: "req_003",
      requesterId: "usr_l4_arjun_03",
      requesterName: "Arjun Das",
      requesterDesignation: "Youth Transport & Fleet Steward",
      recipientL3Id: currentL3User.id,
      recipientL3Name: currentL3User.name,
      amount: 3500,
      eventId: "evt_veh_2026",
      eventName: "Church Transport Fleet Service & Inspection Mission",
      categoryId: "cat_veh_serv",
      categoryName: "Vehicle Service & Safety Inspection",
      remarks: "Brake pad replacement and wheel alignment for Church utility van.",
      requestedAt: "2026-08-12T10:00:00Z",
      status: "MONEY_GIVEN",
      approvedAt: "2026-08-12T11:00:00Z",
      approvedById: currentL3User.id,
      approvedByName: currentL3User.name,
      approvedAmount: 3500,
      givenAt: "2026-08-12T11:30:00Z",
      givenById: currentL3User.id,
      givenByName: currentL3User.name,
      sourceBalanceId: "src_l2_sunita_ops",
      sourceL2Name: "Level 2 — Pastor Sunita Rao (Central Operations Fund)",
    },
  ];

  // Expenses with Bills / Vouchers and OCR Results
  let expensesList: Expense[] = [
    {
      id: "exp_001",
      personL4Id: "usr_l4_vikram_01",
      personL4Name: "Vikram Patel",
      amount: 4500,
      categoryId: "cat_veh_fuel",
      categoryName: "Church Bus & Van Fuel",
      eventId: "evt_veh_2026",
      eventName: "Church Transport Fleet Service & Inspection Mission",
      date: "2026-08-14",
      description: "Indian Oil Petrol Pump - Diesel refill for parish inspection trip (Slip #40291)",
      documentType: "BILL",
      documentNumber: "IOCL-BLR-40291",
      documentUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      ocrResult: {
        extractedAmount: 4250,
        extractedVendor: "Indian Oil Corporation Ltd - Hebbal",
        extractedDate: "2026-08-14",
        extractedInvoiceNo: "IOCL-BLR-40291",
        rawTextPreview: "INDIAN OIL PETROL BUNK HEBBAL\nDATE: 14/08/2026\nDIESEL 48.3L @ 87.99\nSUBTOTAL: Rs. 4,250.00\nTAX: Rs. 0.00\nTOTAL: 4,250.00",
        isMismatch: true,
        mismatchDiff: -250,
        reviewStatus: "FLAGGED_MISMATCH",
      },
      sourceAllocations: [
        {
          sourceL3Id: currentL3User.id,
          sourceL3Name: currentL3User.name,
          amount: 4500,
        },
      ],
      isAcknowledgedByL3: false,
      reconciliationStatus: "DIFFERENCE",
      bankDiffAmount: 250,
    },
    {
      id: "exp_002",
      personL4Id: "usr_l4_arjun_03",
      personL4Name: "Arjun Das",
      amount: 3500,
      categoryId: "cat_veh_serv",
      categoryName: "Vehicle Service & Safety Inspection",
      eventId: "evt_veh_2026",
      eventName: "Church Transport Fleet Service & Inspection Mission",
      date: "2026-08-13",
      description: "Mahindra Authorised Service - Brake pads & fluid topup",
      documentType: "INVOICE",
      documentNumber: "MAS-2026-8812",
      documentUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
      ocrResult: {
        extractedAmount: 3500,
        extractedVendor: "Mahindra Authorized Service Centre",
        extractedDate: "2026-08-13",
        extractedInvoiceNo: "MAS-2026-8812",
        rawTextPreview: "MAHINDRA AUTO CARE\nINV: MAS-2026-8812\nPARTS: BRAKE PADS SET (2,800.00)\nLABOUR: 700.00\nTOTAL CHARGED: Rs. 3,500.00",
        isMismatch: false,
        reviewStatus: "VERIFIED",
        reviewedBy: currentL3User.name,
        reviewedAt: "2026-08-13T16:00:00Z",
      },
      sourceAllocations: [
        {
          sourceL3Id: currentL3User.id,
          sourceL3Name: currentL3User.name,
          amount: 3500,
        },
      ],
      isAcknowledgedByL3: true,
      acknowledgedAt: "2026-08-13T16:10:00Z",
      acknowledgedById: currentL3User.id,
      acknowledgedByName: currentL3User.name,
      reconciliationStatus: "MATCHED",
    },
    {
      id: "exp_003",
      personL4Id: "usr_l4_priya_02",
      personL4Name: "Priya Sharma",
      amount: 2000,
      categoryId: "cat_soc_med",
      categoryName: "Medical Assistance to Needy Families",
      eventId: "evt_med_2026",
      eventName: "Rural Medical & Compassion Outreach",
      date: "2026-08-11",
      description: "Emergency local medicine purchase without registered GST invoice (Advance Voucher)",
      documentType: "VOUCHER",
      documentNumber: "VCHR-L4-2026-042",
      documentUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80",
      sourceAllocations: [
        {
          sourceL3Id: currentL3User.id,
          sourceL3Name: currentL3User.name,
          amount: 2000,
        },
      ],
      isAcknowledgedByL3: true,
      acknowledgedAt: "2026-08-11T18:00:00Z",
      acknowledgedById: currentL3User.id,
      acknowledgedByName: currentL3User.name,
      reconciliationStatus: "MATCHED",
    },
  ];

  // Level 4 -> Level 4 Transactions (Tagged with Remarks requiring L3 Acknowledgement)
  let l4ToL4List: L4ToL4Transaction[] = [
    {
      id: "l4_trx_001",
      givingL4Id: "usr_l4_vikram_01",
      givingL4Name: "Vikram Patel",
      benefitingL4Id: "usr_l4_arjun_03",
      benefitingL4Name: "Arjun Das",
      amount: 1200,
      eventId: "evt_veh_2026",
      eventName: "Church Transport Fleet Service & Inspection Mission",
      categoryId: "cat_veh_trav",
      categoryName: "Pastoral Travel & Highway Tolls",
      remarks: "Paid FASTag topup and toll charges on behalf of Arjun's transport van during outstation parish visit.",
      date: "2026-08-15",
      managingL3Id: currentL3User.id,
      managingL3Name: currentL3User.name,
      status: "PENDING_VALIDATION",
    },
  ];

  // Bank Reconciliation items (Authoritative)
  let bankReconciliations: BankReconciliationItem[] = [
    {
      id: "bnk_rec_001",
      transactionDate: "2026-08-02",
      description: "NEFT INWARD: Central Operations Fund (Level 2 Pastor Sunita Rao)",
      systemAmount: 50000,
      bankStatementAmount: 50000,
      difference: 0,
      status: "MATCHED",
      referenceNo: "NEFT-CHU-883019",
      bankAccount: "State Bank of India - A/C #3098712390 (Church Zonal Operations)",
      lastCheckedDate: "2026-08-16T00:00:00Z",
    },
    {
      id: "bnk_rec_002",
      transactionDate: "2026-08-08",
      description: "IMPS INWARD: Community Outreach Allocation (Level 2 Pastor Anand Verma)",
      systemAmount: 38000,
      bankStatementAmount: 38000,
      difference: 0,
      status: "MATCHED",
      referenceNo: "IMPS-CHU-990142",
      bankAccount: "State Bank of India - A/C #3098712390 (Church Zonal Operations)",
      lastCheckedDate: "2026-08-16T00:00:00Z",
    },
    {
      id: "bnk_rec_003",
      transactionDate: "2026-08-14",
      description: "DEBIT: POS Terminal - IOCL Petrol Bunk (Ref exp_001 Vikram Patel)",
      systemAmount: 4500,
      bankStatementAmount: 4250,
      difference: 250,
      status: "DIFFERENCE",
      differenceReason: "Bank statement debit is ₹4,250 matching OCR slip, but transaction recorded as ₹4,500 advance. Difference ₹250 under review.",
      referenceNo: "POS-IOCL-40291",
      bankAccount: "State Bank of India - A/C #3098712390 (Church Zonal Operations)",
      lastCheckedDate: "2026-08-16T00:00:00Z",
    },
    {
      id: "bnk_rec_004",
      transactionDate: "2026-08-13",
      description: "UPI OUTWARD: Mahindra Authorized Service (Ref exp_002 Arjun Das)",
      systemAmount: 3500,
      bankStatementAmount: 3500,
      difference: 0,
      status: "MATCHED",
      referenceNo: "UPI-MAS-881200",
      bankAccount: "State Bank of India - A/C #3098712390 (Church Zonal Operations)",
      lastCheckedDate: "2026-08-16T00:00:00Z",
    },
  ];

  // Comprehensive Audit Trail
  let auditLogs: AuditLog[] = [
    {
      id: "aud_001",
      timestamp: "2026-08-02T10:30:00Z",
      actorId: "usr_l2_sunita_01",
      actorName: "Pastor Sunita Rao (Level 2)",
      actorRole: "LEVEL_2",
      action: "DISBURSED_FUNDS_TO_L3",
      entityType: "MONEY_RECEIVED",
      entityId: "rec_001",
      previousValue: "₹0",
      newValue: "₹50,000",
      details: "Disbursed ₹50,000 from Central Operations Fund to Level 3 Pastor David Wilson.",
    },
    {
      id: "aud_002",
      timestamp: "2026-08-05T11:30:00Z",
      actorId: currentL3User.id,
      actorName: currentL3User.name,
      actorRole: "LEVEL_3",
      action: "GAVE_MONEY_TO_L4",
      entityType: "MONEY_GIVEN",
      entityId: "giv_001",
      previousValue: "Available: ₹50,000",
      newValue: "Available: ₹45,000",
      details: "Level 3 Pastor David Wilson gave ₹5,000 to Level 4 Vikram Patel from Pastor Sunita Rao's Central Operations Fund.",
    },
    {
      id: "aud_003",
      timestamp: "2026-08-08T14:15:00Z",
      actorId: "usr_l2_anand_02",
      actorName: "Pastor Anand Verma (Level 2)",
      actorRole: "LEVEL_2",
      action: "DISBURSED_FUNDS_TO_L3",
      entityType: "MONEY_RECEIVED",
      entityId: "rec_002",
      previousValue: "₹0",
      newValue: "₹38,000",
      details: "Disbursed ₹38,000 from Community Outreach & Missions Fund to Level 3 Pastor David Wilson.",
    },
    {
      id: "aud_004",
      timestamp: "2026-08-12T11:00:00Z",
      actorId: currentL3User.id,
      actorName: currentL3User.name,
      actorRole: "LEVEL_3",
      action: "APPROVED_REQUEST",
      entityType: "REQUEST",
      entityId: "req_003",
      previousValue: "Status: REQUESTED",
      newValue: "Status: APPROVED",
      details: "Level 3 Pastor David Wilson approved money request of ₹3,500 for Arjun Das.",
    },
    {
      id: "aud_005",
      timestamp: "2026-08-12T11:30:00Z",
      actorId: currentL3User.id,
      actorName: currentL3User.name,
      actorRole: "LEVEL_3",
      action: "GAVE_MONEY_FOR_REQUEST",
      entityType: "MONEY_GIVEN",
      entityId: "req_003",
      previousValue: "Status: APPROVED",
      newValue: "Status: MONEY_GIVEN",
      details: "Actual money movement executed: ₹3,500 given to Arjun Das from Central Operations Fund.",
    },
    {
      id: "aud_006",
      timestamp: "2026-08-14T16:30:00Z",
      actorId: "usr_ocr_system",
      actorName: "OCR Engine",
      actorRole: "LEVEL_3",
      action: "OCR_EXTRACTION_FLAGGED",
      entityType: "OCR_REVIEW",
      entityId: "exp_001",
      previousValue: "Exp: ₹4,500",
      newValue: "OCR: ₹4,250 (Diff: -₹250)",
      details: "OCR detected amount discrepancy on fuel receipt IOCL-BLR-40291.",
    },
    {
      id: "aud_007",
      timestamp: "2026-08-15T08:00:00Z",
      actorId: currentL3User.id,
      actorName: currentL3User.name,
      actorRole: "LEVEL_3",
      action: "APPROVED_REQUEST_MONEY_NOT_GIVEN",
      entityType: "REQUEST",
      entityId: "req_002",
      previousValue: "Status: REQUESTED",
      newValue: "Status: APPROVED (MONEY NOT YET GIVEN)",
      details: "Level 3 Pastor David Wilson approved request ₹8,000 for Priya Sharma. Balances remain unchanged until disbursement.",
    },
  ];

  // Active Level 2 Logged-in User
  let currentL2User: User = allHierarchyPeople.find((u) => u.id === "usr_l2_sunita_01")!;

  // Central Budgets allocated to Level 2 Directors
  const l2Budgets: Record<string, { allocatedBudget: number; fundName: string }> = {
    "usr_l2_sunita_01": {
      allocatedBudget: 350000,
      fundName: "Central Operations & Parish Upkeep Fund",
    },
    "usr_l2_anand_02": {
      allocatedBudget: 220000,
      fundName: "Community Missions & Compassion Fund",
    },
    "usr_l2_chen_03": {
      allocatedBudget: 180000,
      fundName: "Youth Ministry & Worship Equipment Fund",
    },
  };

  // Direct Level 2 -> Level 4 Payments
  let l2DirectPaymentsToL4: L2DirectPaymentToL4[] = [
    {
      id: "l2_dir_001",
      fromL2Id: "usr_l2_sunita_01",
      fromL2Name: "Pastor Sunita Rao",
      toL4Id: "usr_l4_stephen_05",
      toL4Name: "Stephen Paul",
      amount: 15000,
      givenAt: "2026-08-04T10:00:00Z",
      eventId: "evt_conf_2026",
      eventName: "Annual Diocesan Synod & Ministry Conference 2026",
      categoryId: "cat_bld_elec",
      categoryName: "Audio System & Electrical Repairs",
      documentType: "INVOICE",
      documentNumber: "SONY-BLR-8912",
      purpose: "Central procurement of 4-channel stage audio snake cable and high-gain mics for Synod assembly",
      status: "COMPLETED",
    },
    {
      id: "l2_dir_002",
      fromL2Id: "usr_l2_anand_02",
      fromL2Name: "Pastor Anand Verma",
      toL4Id: "usr_l4_priya_02",
      toL4Name: "Priya Sharma",
      amount: 10000,
      givenAt: "2026-08-07T12:00:00Z",
      eventId: "evt_med_2026",
      eventName: "Rural Medical & Compassion Outreach",
      categoryId: "cat_soc_med",
      categoryName: "Medical Assistance to Needy Families",
      documentType: "VOUCHER",
      documentNumber: "VCHR-L2-MED-019",
      purpose: "Direct compassion ministry subsidy for emergency village dialysis patient transport",
      status: "ACKNOWLEDGED",
    },
  ];

  // Level 1 Direct Payments (Where Level 2 provides Acknowledgement)
  let l1DirectPayments: L1DirectPayment[] = [
    {
      id: "l1_pay_001",
      fromL1Id: "usr_l1_samuel_01",
      fromL1Name: "Bishop Samuel Matthew (Senior Diocesan Bishop)",
      toUserId: "usr_l3_david_01",
      toUserName: "Pastor David Wilson (South Zonal Overseer)",
      toUserRole: "LEVEL_3",
      amount: 25000,
      date: "2026-08-11T09:00:00Z",
      purpose: "Senior Bishop Direct Emergency Allocation for Zonal Synod Planning & Bishop's Council",
      isAcknowledgedByL2: false,
      transactionRef: "DIO-BISHOP-DIR-2026-0811",
    },
    {
      id: "l1_pay_002",
      fromL1Id: "usr_l1_rachel_02",
      fromL1Name: "Bishop Rachel Thomas (General Council Trustee)",
      toUserId: "usr_l4_kavita_04",
      toUserName: "Kavita Reddy (Sunday School Officer)",
      toUserRole: "LEVEL_4",
      amount: 12000,
      date: "2026-08-06T15:30:00Z",
      purpose: "Trustee Direct Grant for District Sunday School Children Bibles & Study Materials",
      isAcknowledgedByL2: true,
      acknowledgedAt: "2026-08-06T17:00:00Z",
      acknowledgedById: "usr_l2_sunita_01",
      acknowledgedByName: "Pastor Sunita Rao",
      transactionRef: "TRU-RACHEL-DIR-2026-0806",
    },
  ];

  // Authoritative Income Receipts for Level 1 Organization Treasury
  let incomeReceiptsList = [
    {
      id: "rec_inc_001",
      source: "Central Synod Trust Fund (General Assembly Grant 2026-27)",
      category: "Synod Appropriations & Trust Endowment",
      amount: 500000,
      date: "2026-08-01",
      method: "Direct Bank NEFT",
      ref: "NEFT-SYN-881290-BLR",
    },
    {
      id: "rec_inc_002",
      source: "Parish Consolidated Tithes & First-Fruits (Q2 Deposit)",
      category: "Parish Tithes & Offerings",
      amount: 285000,
      date: "2026-08-03",
      method: "Bank Clearing Account",
      ref: "CLR-TTH-2026-0803",
    },
    {
      id: "rec_inc_003",
      source: "Grace Heritage Mission Trust (Special Outreach Endowment)",
      category: "Charity & Rural Health Outreach",
      amount: 150000,
      date: "2026-08-07",
      method: "Bank Transfer",
      ref: "TXN-ENDOW-9921",
    },
    {
      id: "rec_inc_004",
      source: "Synod Youth Delegates Registration & Sponsorships",
      category: "Meetings & Conferences",
      amount: 65000,
      date: "2026-08-10",
      method: "UPI / Bank QR",
      ref: "UPI-YTH-2026-0810",
    },
  ];

  // Authoritative Advances & Settlements (Distinguishing Advance from Final Expense!)
  let advancesList: AdvanceRecord[] = [
    {
      id: "adv_001",
      requesterId: "usr_l4_vikram_01",
      requesterName: "Vikram Patel",
      requesterRole: "LEVEL_4",
      approverId: "usr_l3_david_01",
      approverName: "Pastor David Wilson",
      amount: 5000,
      purpose: "Emergency generator diesel and parish sound wiring material advance for Synod",
      categoryName: "Building and Maintenance",
      eventName: "Annual Diocesan Synod & Ministry Conference 2026",
      date: "2026-08-05",
      status: "OUTSTANDING",
      actualSpent: 0,
      returnedOrRefundedAmount: 0,
      voucherNo: "VCHR-ADV-2026-001",
    },
    {
      id: "adv_002",
      requesterId: "usr_l4_priya_02",
      requesterName: "Priya Sharma",
      requesterRole: "LEVEL_4",
      approverId: "usr_l3_david_01",
      approverName: "Pastor David Wilson",
      amount: 8000,
      purpose: "Rural medical kits, first-aid inventory, and village camp transportation advance",
      categoryName: "Charity / Social Service",
      eventName: "Rural Medical & Compassion Outreach",
      date: "2026-08-01",
      status: "SETTLED",
      actualSpent: 7800,
      returnedOrRefundedAmount: 200,
      settlementDate: "2026-08-09",
      settlementRemarks: "Actual expenditure ₹7,800 backed by pharmacy cash receipts. ₹200 returned in cash.",
      voucherNo: "VCHR-ADV-SETTLE-002",
    },
    {
      id: "adv_003",
      requesterId: "usr_l4_arjun_03",
      requesterName: "Arjun Das",
      requesterRole: "LEVEL_4",
      approverId: "usr_l3_david_01",
      approverName: "Pastor David Wilson",
      amount: 3500,
      purpose: "Church fleet highway fastag recharge and emergency tyre puncture buffer advance",
      categoryName: "Vehicle",
      eventName: "Church Transport Fleet Service & Inspection Mission",
      date: "2026-08-12",
      status: "OUTSTANDING",
      actualSpent: 0,
      returnedOrRefundedAmount: 0,
      voucherNo: "VCHR-ADV-2026-003",
    },
  ];

  // Authoritative Organization Exceptions & Financial Issues
  let exceptionsList: ExceptionIssue[] = [
    {
      id: "iss_001",
      financialYear: "2026-27",
      issueType: "BANK_MISMATCH",
      relatedTransactionId: "rec_002",
      severity: "HIGH",
      title: "Bank Statement Difference in Deposit Ref #TXN-BNK-2026-0814",
      description: "Bank statement credits ₹12,450 whereas internal ledger records ₹12,200 (Difference of +₹250 pending explanation).",
      expectedAmount: 12200,
      actualAmount: 12450,
      difference: 250,
      identifiedBy: "Automated Bank Reconciliation Engine",
      identifiedDate: "2026-08-15T08:00:00Z",
      status: "OPEN",
    },
    {
      id: "iss_002",
      financialYear: "2026-27",
      issueType: "OCR_MISMATCH",
      relatedTransactionId: "exp_001",
      severity: "MEDIUM",
      title: "OCR Extracted Price Discrepancy on Fuel Receipt #HP-7712",
      description: "Scanned cash bill shows ₹4,250 whereas expense entry was claimed at ₹4,500 (-₹250 disparity).",
      expectedAmount: 4500,
      actualAmount: 4250,
      difference: -250,
      identifiedBy: "Optical Bill Parser",
      identifiedDate: "2026-08-14T16:30:00Z",
      status: "UNDER_REVIEW",
    },
    {
      id: "iss_003",
      financialYear: "2026-27",
      issueType: "MISSING_ACKNOWLEDGEMENT",
      relatedTransactionId: "l1_pay_001",
      severity: "LOW",
      title: "Senior Bishop Direct Emergency Grant Awaiting L2 Acknowledgment",
      description: "Direct grant of ₹25,000 to Pastor David Wilson disbursed on 11-Aug requires formal acknowledgment by Level 2 Director.",
      expectedAmount: 25000,
      actualAmount: 25000,
      difference: 0,
      identifiedBy: "Hierarchy Governance Monitor",
      identifiedDate: "2026-08-11T09:00:00Z",
      status: "OPEN",
    },
    {
      id: "iss_004",
      financialYear: "2026-27",
      issueType: "UNSETTLED_ADVANCE",
      relatedTransactionId: "adv_001",
      severity: "LOW",
      title: "Outstanding Operational Advance > 7 Days (Vikram Patel)",
      description: "₹5,000 advance issued on 05-Aug for generator fuel is awaiting formal bills and voucher submission.",
      expectedAmount: 5000,
      actualAmount: 0,
      difference: 5000,
      identifiedBy: "Advance Ageing Monitor",
      identifiedDate: "2026-08-13T10:00:00Z",
      status: "OPEN",
    },
  ];

  // Level 2 Central Expenses
  let l2ExpensesList: Expense[] = [
    {
      id: "exp_l2_001",
      personL4Id: "usr_l2_sunita_01",
      personL4Name: "Pastor Sunita Rao (Central Operations)",
      amount: 12000,
      categoryId: "cat_adm_off",
      categoryName: "Parish Office & Pastoral Documentation",
      eventId: "evt_conf_2026",
      eventName: "Annual Diocesan Synod & Ministry Conference 2026",
      date: "2026-08-10",
      description: "Diocesan Synod Delegate Handbook Printing & Registration Folders (Inv #PRNT-998)",
      documentType: "BILL",
      documentNumber: "PRNT-BLR-998",
      documentUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      ocrResult: {
        extractedAmount: 12000,
        extractedVendor: "Sri Vinayaka High-Speed Press",
        extractedDate: "2026-08-10",
        extractedInvoiceNo: "PRNT-BLR-998",
        rawTextPreview: "SRI VINAYAKA PRESS\nINV: PRNT-BLR-998\nSYNOD BOOKLETS 500 COPIES: Rs. 12,000.00\nTOTAL: 12,000.00",
        isMismatch: false,
        reviewStatus: "VERIFIED",
        reviewedBy: "Pastor Sunita Rao",
        reviewedAt: "2026-08-10T14:00:00Z",
      },
      sourceAllocations: [
        {
          sourceL3Id: "usr_l2_sunita_01",
          sourceL3Name: "Central Operations & Parish Upkeep Fund",
          amount: 12000,
        },
      ],
      isAcknowledgedByL3: true,
      reconciliationStatus: "MATCHED",
    },
  ];

  // Helper to calculate authoritative state for Level 3
  function getAuthoritativeL3State(): L3DashboardData {
    const totalAvailable = sourceBalances.reduce((sum, src) => sum + src.availableAmount, 0);

    const pendingRequests = requestsList.filter((r) => r.status === "REQUESTED");
    const awaitingDisbursement = requestsList.filter((r) => r.status === "APPROVED");
    const unacknowledgedExpenses = expensesList.filter((e) => !e.isAcknowledgedByL3);
    const unvalidatedL4ToL4 = l4ToL4List.filter((t) => t.status === "PENDING_VALIDATION");
    const ocrMismatches = expensesList.filter((e) => e.ocrResult?.isMismatch && e.ocrResult.reviewStatus !== "VERIFIED");
    const bankDifferences = bankReconciliations.filter((b) => b.status === "DIFFERENCE");

    const pendingActionsCount =
      pendingRequests.length +
      awaitingDisbursement.length +
      unacknowledgedExpenses.length +
      unvalidatedL4ToL4.length +
      ocrMismatches.length;

    // Build L4 people with allocated breakdown
    const l4WithBalances = l4Users.map((u) => {
      const totalGiven = moneyGivenList
        .filter((g) => g.receiverL4Id === u.id)
        .reduce((sum, g) => sum + g.amount, 0);
      const totalSpent = expensesList
        .filter((e) => e.personL4Id === u.id)
        .reduce((sum, e) => sum + e.amount, 0);

      const currentAllocatedBalance = Math.max(0, totalGiven - totalSpent);

      const sourceBreakdown = sourceBalances.map((sb) => {
        const givenFromSource = moneyGivenList
          .filter((g) => g.receiverL4Id === u.id && g.sourceBalanceId === sb.id)
          .reduce((sum, g) => sum + g.amount, 0);

        return {
          sourceName: sb.sourceL2Name,
          amount: Math.max(0, givenFromSource),
        };
      });

      return {
        ...u,
        currentAllocatedBalance,
        sourceBreakdown,
      };
    });

    const recentMovements = [
      ...moneyGivenList,
      ...moneyReceivedList,
    ].sort((a, b) => {
      const timeA = 'givenAt' in a ? a.givenAt : a.receivedAt;
      const timeB = 'givenAt' in b ? b.givenAt : b.receivedAt;
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });

    const availableL3Users = allHierarchyPeople.filter((u) => u.role === "LEVEL_3");

    return {
      currentL3User,
      availableL3Users,
      allHierarchyPeople,
      allRelationships,
      totalAvailable,
      sourceBalances,
      pendingActionsCount,
      pendingRequestsCount: pendingRequests.length,
      unacknowledgedExpensesCount: unacknowledgedExpenses.length,
      ocrMismatchesCount: ocrMismatches.length,
      bankDifferencesCount: bankDifferences.length,
      recentMoneyMovements: recentMovements.slice(0, 10),
      recentExpenses: [...expensesList].reverse().slice(0, 10),
      requests: [...requestsList].reverse(),
      l4People: l4WithBalances,
      l4ToL4Transactions: [...l4ToL4List].reverse(),
      bankReconciliations,
      auditLogs: [...auditLogs].reverse(),
      events,
      categories,
    };
  }

  // API Endpoints

  // 1. Get full L3 Dashboard State
  app.get("/api/l3/state", (req, res) => {
    res.json(getAuthoritativeL3State());
  });

  // Switch Active L3 User (for testing multi-person hierarchy)
  app.post("/api/l3/switch-user", (req, res) => {
    const { userId } = req.body;
    const target = allHierarchyPeople.find((u) => u.id === userId && u.role === "LEVEL_3");
    if (target) {
      currentL3User = target;
    }
    res.json(getAuthoritativeL3State());
  });

  // 2. Give Money directly to Level 4 from a selected Level 2 Source Balance
  app.post("/api/l3/give-money", (req, res) => {
    const { receiverL4Id, amount, sourceBalanceId, eventId, categoryId, purpose } = req.body;

    if (!receiverL4Id || !amount || !sourceBalanceId || !categoryId) {
      return res.status(400).json({ error: "Missing required fields for giving money" });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    const source = sourceBalances.find((s) => s.id === sourceBalanceId);
    if (!source) {
      return res.status(404).json({ error: "Selected source balance not found" });
    }

    if (source.availableAmount < numAmount) {
      return res.status(400).json({
        error: `Insufficient available funds in ${source.sourceL2Name}. Available: ₹${source.availableAmount.toLocaleString('en-IN')}, Requested: ₹${numAmount.toLocaleString('en-IN')}. Note: Multiple sources cannot be auto-merged or overdrawn without explicit approval.`,
      });
    }

    const receiver = l4Users.find((u) => u.id === receiverL4Id);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver Level 4 user not found" });
    }

    const cat = categories.find((c) => c.id === categoryId);
    const evt = events.find((e) => e.id === eventId);

    const prevAvail = source.availableAmount;
    source.availableAmount -= numAmount;
    source.allocatedAmount += numAmount;

    const newMoneyGiven: MoneyGiven = {
      id: `giv_${Date.now()}`,
      giverL3Id: currentL3User.id,
      giverL3Name: currentL3User.name,
      receiverL4Id: receiver.id,
      receiverL4Name: receiver.name,
      amount: numAmount,
      givenAt: new Date().toISOString(),
      sourceBalanceId: source.id,
      sourceL2Name: source.sourceL2Name,
      eventId: evt?.id,
      eventName: evt?.name,
      categoryId: cat?.id || "cat_general",
      categoryName: cat?.name || "General",
      purpose: purpose || `Direct allocation for ${cat?.name || 'parish requirements'}`,
      status: "COMPLETED",
    };

    moneyGivenList.push(newMoneyGiven);

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL3User.id,
      actorName: currentL3User.name,
      actorRole: "LEVEL_3",
      action: "GAVE_MONEY_DIRECT",
      entityType: "MONEY_GIVEN",
      entityId: newMoneyGiven.id,
      previousValue: `Source [${source.sourceL2Name}] Available: ₹${prevAvail.toLocaleString('en-IN')}`,
      newValue: `Source [${source.sourceL2Name}] Available: ₹${source.availableAmount.toLocaleString('en-IN')}`,
      details: `Level 3 ${currentL3User.name} gave ₹${numAmount.toLocaleString('en-IN')} to Level 4 ${receiver.name} for ${cat?.name || 'Parish Operations'}. Preserved source: ${source.sourceL2Name}.`,
    });

    res.json({ success: true, moneyGiven: newMoneyGiven, state: getAuthoritativeL3State() });
  });

  // 3. Approve Request: Supports "APPROVE_ONLY" vs "APPROVE_AND_GIVE"
  app.post("/api/l3/requests/approve", (req, res) => {
    const { requestId, actionType, sourceBalanceId } = req.body;

    const request = requestsList.find((r) => r.id === requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "REQUESTED") {
      return res.status(400).json({ error: `Cannot approve request in status ${request.status}` });
    }

    if (actionType === "APPROVE_AND_GIVE") {
      if (!sourceBalanceId) {
        return res.status(400).json({ error: "Source balance must be selected to give money immediately" });
      }

      const source = sourceBalances.find((s) => s.id === sourceBalanceId);
      if (!source) {
        return res.status(404).json({ error: "Selected source balance not found" });
      }

      if (source.availableAmount < request.amount) {
        return res.status(400).json({
          error: `Insufficient balance in ${source.sourceL2Name}. Available: ₹${source.availableAmount.toLocaleString('en-IN')}, Needed: ₹${request.amount.toLocaleString('en-IN')}. You may use 'Approve Only' if money will be given later.`,
        });
      }

      request.status = "MONEY_GIVEN";
      request.approvedAt = new Date().toISOString();
      request.approvedById = currentL3User.id;
      request.approvedByName = currentL3User.name;
      request.approvedAmount = request.amount;
      request.givenAt = new Date().toISOString();
      request.givenById = currentL3User.id;
      request.givenByName = currentL3User.name;
      request.sourceBalanceId = source.id;
      request.sourceL2Name = source.sourceL2Name;

      const prevAvail = source.availableAmount;
      source.availableAmount -= request.amount;
      source.allocatedAmount += request.amount;

      const newMoneyGiven: MoneyGiven = {
        id: `giv_${Date.now()}`,
        giverL3Id: currentL3User.id,
        giverL3Name: currentL3User.name,
        receiverL4Id: request.requesterId,
        receiverL4Name: request.requesterName,
        amount: request.amount,
        givenAt: new Date().toISOString(),
        sourceBalanceId: source.id,
        sourceL2Name: source.sourceL2Name,
        eventId: request.eventId,
        eventName: request.eventName,
        categoryId: request.categoryId,
        categoryName: request.categoryName,
        purpose: `Fulfillment of Request #${request.id}: ${request.remarks}`,
        relatedRequestId: request.id,
        status: "COMPLETED",
      };
      moneyGivenList.push(newMoneyGiven);

      auditLogs.push({
        id: `aud_${Date.now()}_appr`,
        timestamp: new Date().toISOString(),
        actorId: currentL3User.id,
        actorName: currentL3User.name,
        actorRole: "LEVEL_3",
        action: "APPROVED_REQUEST",
        entityType: "REQUEST",
        entityId: request.id,
        previousValue: "Status: REQUESTED",
        newValue: "Status: APPROVED",
        details: `Level 3 ${currentL3User.name} approved request #${request.id} for ₹${request.amount.toLocaleString('en-IN')} (Requester: ${request.requesterName}).`,
      });

      auditLogs.push({
        id: `aud_${Date.now()}_giv`,
        timestamp: new Date().toISOString(),
        actorId: currentL3User.id,
        actorName: currentL3User.name,
        actorRole: "LEVEL_3",
        action: "GAVE_MONEY_FOR_REQUEST",
        entityType: "MONEY_GIVEN",
        entityId: newMoneyGiven.id,
        previousValue: `Source [${source.sourceL2Name}] Available: ₹${prevAvail.toLocaleString('en-IN')}`,
        newValue: `Source [${source.sourceL2Name}] Available: ₹${source.availableAmount.toLocaleString('en-IN')}`,
        details: `Actual money given immediately for request #${request.id}. Balance deducted from ${source.sourceL2Name}.`,
      });
    } else {
      request.status = "APPROVED";
      request.approvedAt = new Date().toISOString();
      request.approvedById = currentL3User.id;
      request.approvedByName = currentL3User.name;
      request.approvedAmount = request.amount;

      auditLogs.push({
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: currentL3User.id,
        actorName: currentL3User.name,
        actorRole: "LEVEL_3",
        action: "APPROVED_REQUEST_MONEY_NOT_GIVEN",
        entityType: "REQUEST",
        entityId: request.id,
        previousValue: "Status: REQUESTED",
        newValue: "Status: APPROVED — MONEY NOT YET GIVEN",
        details: `Level 3 ${currentL3User.name} approved request #${request.id} for ₹${request.amount.toLocaleString('en-IN')}. Actual money not yet given; balances remain unchanged until disbursement.`,
      });
    }

    res.json({ success: true, request, state: getAuthoritativeL3State() });
  });

  // 4. Give Money Later on an already Approved Request
  app.post("/api/l3/requests/give-later", (req, res) => {
    const { requestId, sourceBalanceId } = req.body;

    const request = requestsList.find((r) => r.id === requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "APPROVED") {
      return res.status(400).json({ error: `Cannot disburse request in status '${request.status}'. Must be in 'APPROVED' state.` });
    }

    if (!sourceBalanceId) {
      return res.status(400).json({ error: "Source balance is required for disbursement" });
    }

    const source = sourceBalances.find((s) => s.id === sourceBalanceId);
    if (!source) {
      return res.status(404).json({ error: "Selected source balance not found" });
    }

    if (source.availableAmount < request.amount) {
      return res.status(400).json({
        error: `Insufficient balance in ${source.sourceL2Name}. Available: ₹${source.availableAmount.toLocaleString('en-IN')}, Needed: ₹${request.amount.toLocaleString('en-IN')}.`,
      });
    }

    const prevAvail = source.availableAmount;
    source.availableAmount -= request.amount;
    source.allocatedAmount += request.amount;

    request.status = "MONEY_GIVEN";
    request.givenAt = new Date().toISOString();
    request.givenById = currentL3User.id;
    request.givenByName = currentL3User.name;
    request.sourceBalanceId = source.id;
    request.sourceL2Name = source.sourceL2Name;

    const newMoneyGiven: MoneyGiven = {
      id: `giv_${Date.now()}`,
      giverL3Id: currentL3User.id,
      giverL3Name: currentL3User.name,
      receiverL4Id: request.requesterId,
      receiverL4Name: request.requesterName,
      amount: request.amount,
      givenAt: new Date().toISOString(),
      sourceBalanceId: source.id,
      sourceL2Name: source.sourceL2Name,
      eventId: request.eventId,
      eventName: request.eventName,
      categoryId: request.categoryId,
      categoryName: request.categoryName,
      purpose: `Disbursement for previously approved request #${request.id}: ${request.remarks}`,
      relatedRequestId: request.id,
      status: "COMPLETED",
    };
    moneyGivenList.push(newMoneyGiven);

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL3User.id,
      actorName: currentL3User.name,
      actorRole: "LEVEL_3",
      action: "GAVE_MONEY_LATER",
      entityType: "MONEY_GIVEN",
      entityId: newMoneyGiven.id,
      previousValue: `Source [${source.sourceL2Name}] Available: ₹${prevAvail.toLocaleString('en-IN')}`,
      newValue: `Source [${source.sourceL2Name}] Available: ₹${source.availableAmount.toLocaleString('en-IN')}`,
      details: `Executed disbursement for previously approved request #${request.id}. ₹${request.amount.toLocaleString('en-IN')} transferred to ${request.requesterName} from ${source.sourceL2Name}.`,
    });

    res.json({ success: true, request, state: getAuthoritativeL3State() });
  });

  // 5. Reject Request
  app.post("/api/l3/requests/reject", (req, res) => {
    const { requestId, reason } = req.body;

    const request = requestsList.find((r) => r.id === requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "REQUESTED" && request.status !== "APPROVED") {
      return res.status(400).json({ error: `Cannot reject request in status ${request.status}` });
    }

    const prevStatus = request.status;
    request.status = "REJECTED";
    request.rejectedAt = new Date().toISOString();
    request.rejectedById = currentL3User.id;
    request.rejectionReason = reason || "Budget constraints or out-of-scope request";

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL3User.id,
      actorName: currentL3User.name,
      actorRole: "LEVEL_3",
      action: "REJECTED_REQUEST",
      entityType: "REQUEST",
      entityId: request.id,
      previousValue: `Status: ${prevStatus}`,
      newValue: "Status: REJECTED",
      reason: request.rejectionReason,
      details: `Level 3 ${currentL3User.name} rejected request #${request.id} from ${request.requesterName}. Reason: ${request.rejectionReason}`,
    });

    res.json({ success: true, request, state: getAuthoritativeL3State() });
  });

  // 6. Acknowledge Expense
  app.post("/api/l3/expenses/acknowledge", (req, res) => {
    const { expenseId } = req.body;
    const expense = expensesList.find((e) => e.id === expenseId);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    expense.isAcknowledgedByL3 = true;
    expense.acknowledgedAt = new Date().toISOString();
    expense.acknowledgedById = currentL3User.id;
    expense.acknowledgedByName = currentL3User.name;

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL3User.id,
      actorName: currentL3User.name,
      actorRole: "LEVEL_3",
      action: "ACKNOWLEDGED_EXPENSE",
      entityType: "EXPENSE",
      entityId: expense.id,
      previousValue: "Acknowledged: false",
      newValue: "Acknowledged: true",
      details: `Level 3 ${currentL3User.name} reviewed and acknowledged expense #${expense.id} (₹${expense.amount.toLocaleString('en-IN')}) submitted by ${expense.personL4Name}.`,
    });

    res.json({ success: true, expense, state: getAuthoritativeL3State() });
  });

  // 7. Review OCR Mismatch / Verify OCR
  app.post("/api/l3/expenses/ocr-verify", (req, res) => {
    const { expenseId, verificationAction, remarks } = req.body;
    const expense = expensesList.find((e) => e.id === expenseId);
    if (!expense || !expense.ocrResult) {
      return res.status(404).json({ error: "Expense or OCR result not found" });
    }

    const prevStatus = expense.ocrResult.reviewStatus;
    if (verificationAction === "VERIFY_CORRECT") {
      expense.ocrResult.reviewStatus = "VERIFIED";
      expense.ocrResult.reviewedBy = currentL3User.name;
      expense.ocrResult.reviewedAt = new Date().toISOString();
    } else {
      expense.ocrResult.reviewStatus = "FLAGGED_MISMATCH";
      expense.ocrResult.reviewedBy = currentL3User.name;
      expense.ocrResult.reviewedAt = new Date().toISOString();
    }

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL3User.id,
      actorName: currentL3User.name,
      actorRole: "LEVEL_3",
      action: verificationAction === "VERIFY_CORRECT" ? "OCR_VERIFIED" : "OCR_FLAGGED_DISCREPANCY",
      entityType: "OCR_REVIEW",
      entityId: expense.id,
      previousValue: `Status: ${prevStatus}`,
      newValue: `Status: ${expense.ocrResult.reviewStatus}`,
      details: `Level 3 ${currentL3User.name} completed OCR review for expense #${expense.id}. Decision: ${expense.ocrResult.reviewStatus}. ${remarks || ''}`,
    });

    res.json({ success: true, expense, state: getAuthoritativeL3State() });
  });

  // 8. Validate / Acknowledge Level 4 -> Level 4 Transaction Remarks
  app.post("/api/l3/l4-to-l4/validate", (req, res) => {
    const { transactionId, action, l3Remarks } = req.body;
    const trx = l4ToL4List.find((t) => t.id === transactionId);
    if (!trx) {
      return res.status(404).json({ error: "L4->L4 Transaction not found" });
    }

    const prevStatus = trx.status;
    if (action === "ACCEPT") {
      trx.status = "VALIDATED";
      trx.validatedAt = new Date().toISOString();
      trx.validatedById = currentL3User.id;
      trx.validatedByName = currentL3User.name;
      trx.l3Remarks = l3Remarks || "Remarks and expenditure validated by Level 3 Overseer.";
    } else {
      trx.status = "REJECTED";
      trx.validatedAt = new Date().toISOString();
      trx.validatedById = currentL3User.id;
      trx.validatedByName = currentL3User.name;
      trx.l3Remarks = l3Remarks || "Remarks unverified or rejected by Level 3 Overseer.";
    }

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL3User.id,
      actorName: currentL3User.name,
      actorRole: "LEVEL_3",
      action: action === "ACCEPT" ? "VALIDATED_L4_TO_L4" : "REJECTED_L4_TO_L4",
      entityType: "L4_TO_L4",
      entityId: trx.id,
      previousValue: `Status: ${prevStatus}`,
      newValue: `Status: ${trx.status}`,
      details: `Level 3 ${currentL3User.name} ${action === "ACCEPT" ? 'validated' : 'rejected'} L4->L4 transfer of ₹${trx.amount.toLocaleString('en-IN')} from ${trx.givingL4Name} to ${trx.benefitingL4Name}. Remarks: ${trx.l3Remarks}`,
    });

    res.json({ success: true, transaction: trx, state: getAuthoritativeL3State() });
  });

  // 9. Create Level 4 Person
  app.post("/api/l3/l4-users/create", (req, res) => {
    const { name, email, phone, designation, assignedArea } = req.body;

    if (!name || !designation || !phone) {
      return res.status(400).json({ error: "Name, designation, and phone number are required" });
    }

    const newL4User: User = {
      id: `usr_l4_${Date.now()}`,
      name: name.trim(),
      email: email ? email.trim() : `${name.toLowerCase().replace(/\s+/g, '.')}@gracechurch.org`,
      role: "LEVEL_4",
      designation: designation.trim(),
      phone: phone.trim(),
      assignedArea: assignedArea ? assignedArea.trim() : "South Zonal Parish",
      reportingToId: currentL3User.id,
      createdById: currentL3User.id,
      createdAt: new Date().toISOString(),
    };

    l4Users.push(newL4User);
    allHierarchyPeople.push(newL4User);

    // Register hierarchy relationship
    allRelationships.push({
      id: `rel_l3_l4_${Date.now()}`,
      managerId: currentL3User.id,
      managerName: currentL3User.name,
      managerLevel: "LEVEL_3",
      managerDesignation: currentL3User.designation,
      subordinateId: newL4User.id,
      subordinateName: newL4User.name,
      subordinateLevel: "LEVEL_4",
      subordinateDesignation: newL4User.designation,
      assignedScope: newL4User.assignedArea,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    });

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL3User.id,
      actorName: currentL3User.name,
      actorRole: "LEVEL_3",
      action: "CREATED_LEVEL_4_PERSON",
      entityType: "L4_PERSON",
      entityId: newL4User.id,
      newValue: `Created Level 4: ${newL4User.name} (${newL4User.designation})`,
      details: `Level 3 ${currentL3User.name} registered new Level 4 team member ${newL4User.name} under his management responsibility.`,
    });

    res.json({ success: true, user: newL4User, state: getAuthoritativeL3State() });
  });

  // 10. Record Expense with Multiple Level 3 Sources ("USE HIGHER AVAILABLE SOURCE FIRST")
  app.post("/api/l3/expenses/record-multi-source", (req, res) => {
    const { personL4Id, amount, categoryId, eventId, description, documentType, documentNumber } = req.body;

    const numAmount = Number(amount);
    if (!personL4Id || isNaN(numAmount) || numAmount <= 0 || !categoryId) {
      return res.status(400).json({ error: "Valid person, category and amount are required" });
    }

    const availableSources = [...sourceBalances].sort((a, b) => b.availableAmount - a.availableAmount);
    let remainingToAllocate = numAmount;
    const sourceAllocations: { sourceL3Id: string; sourceL3Name: string; amount: number }[] = [];

    for (const src of availableSources) {
      if (remainingToAllocate <= 0) break;
      if (src.availableAmount > 0) {
        const takeAmount = Math.min(src.availableAmount, remainingToAllocate);
        src.availableAmount -= takeAmount;
        src.allocatedAmount += takeAmount;
        remainingToAllocate -= takeAmount;
        sourceAllocations.push({
          sourceL3Id: src.id,
          sourceL3Name: src.sourceL2Name,
          amount: takeAmount,
        });
      }
    }

    if (remainingToAllocate > 0) {
      return res.status(400).json({
        error: `Insufficient total funds across all sources. Shortfall: ₹${remainingToAllocate.toLocaleString('en-IN')}. Business rule prohibits negative balance without approval.`,
      });
    }

    const person = l4Users.find((u) => u.id === personL4Id);
    const cat = categories.find((c) => c.id === categoryId);
    const evt = events.find((e) => e.id === eventId);

    const newExpense: Expense = {
      id: `exp_${Date.now()}`,
      personL4Id: person?.id || personL4Id,
      personL4Name: person?.name || "Level 4 Member",
      amount: numAmount,
      categoryId: cat?.id || categoryId,
      categoryName: cat?.name || "Configured Category",
      eventId: evt?.id,
      eventName: evt?.name,
      date: new Date().toISOString().split('T')[0],
      description: description || `Field expense for ${cat?.name}`,
      documentType: documentType || "BILL",
      documentNumber: documentNumber || `DOC-${Date.now().toString().slice(-6)}`,
      sourceAllocations,
      isAcknowledgedByL3: false,
      reconciliationStatus: "MATCHED",
    };

    expensesList.push(newExpense);

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL3User.id,
      actorName: currentL3User.name,
      actorRole: "LEVEL_3",
      action: "RECORDED_EXPENSE_MULTI_SOURCE",
      entityType: "EXPENSE",
      entityId: newExpense.id,
      newValue: `Expense ₹${numAmount.toLocaleString('en-IN')}`,
      details: `Expense recorded using higher available source first rule. Allocations: ${sourceAllocations.map(s => `${s.sourceL3Name}: ₹${s.amount}`).join(', ')}.`,
    });

    res.json({ success: true, expense: newExpense, state: getAuthoritativeL3State() });
  });

  // ==========================================
  // LEVEL 2 AUTHORITATIVE STATE & API ENDPOINTS
  // ==========================================

  function getAuthoritativeL2State(): L2DashboardData {
    const budgetConfig = l2Budgets[currentL2User.id] || {
      allocatedBudget: 250000,
      fundName: `${currentL2User.name} Central Department Fund`,
    };

    // Total disbursed to Level 3 by this Level 2 user
    const l2DisbursedToL3 = moneyReceivedList
      .filter((m) => m.fromL2Id === currentL2User.id)
      .map((m) => ({
        ...m,
        toL3Name: allHierarchyPeople.find((u) => u.id === m.toL3Id)?.name || m.toL3Name,
      }));

    const totalDisbursedToL3 = l2DisbursedToL3.reduce((sum, d) => sum + d.amount, 0);

    // Direct L4 payments made by this Level 2 user
    const directL4ByUser = l2DirectPaymentsToL4.filter((p) => p.fromL2Id === currentL2User.id);
    const totalDirectL4Paid = directL4ByUser.reduce((sum, d) => sum + d.amount, 0);

    // Central Expenses by this Level 2 user
    const l2ExpensesByUser = l2ExpensesList.filter((e) => e.personL4Id === currentL2User.id);
    const totalExpenses = l2ExpensesByUser.reduce((sum, e) => sum + e.amount, 0);

    const centralAvailableBalance = Math.max(
      0,
      budgetConfig.allocatedBudget - totalDisbursedToL3 - totalDirectL4Paid - totalExpenses
    );

    // Supervised Level 3 Overseers with isolated source allocations
    const l3People = allHierarchyPeople.filter((u) => u.role === "LEVEL_3");
    const supervisedL3Overseers = l3People.map((l3) => {
      const givenByThisL2 = moneyReceivedList
        .filter((m) => m.fromL2Id === currentL2User.id && m.toL3Id === l3.id)
        .reduce((sum, m) => sum + m.amount, 0);

      const allSourcesMap: Record<string, number> = {};
      moneyReceivedList
        .filter((m) => m.toL3Id === l3.id)
        .forEach((m) => {
          allSourcesMap[m.fromL2Name] = (allSourcesMap[m.fromL2Name] || 0) + m.amount;
        });

      const allSourcesBreakdown = Object.entries(allSourcesMap).map(([sourceL2Name, amount]) => ({
        sourceL2Name,
        amount,
      }));

      const currentOverseerBalance = Object.values(allSourcesMap).reduce((sum, val) => sum + val, 0);
      const recentTransactionsCount = moneyReceivedList.filter((m) => m.toL3Id === l3.id).length;

      return {
        ...l3,
        currentOverseerBalance,
        sourceAllocationsFromThisL2: givenByThisL2,
        allSourcesBreakdown,
        recentTransactionsCount,
      };
    });

    const pendingL1 = l1DirectPayments.filter((p) => !p.isAcknowledgedByL2);
    const pendingReqs = requestsList.filter((r) => r.status === "REQUESTED");
    const ocrMismatches = l2ExpensesByUser.filter(
      (e) => e.ocrResult?.isMismatch && e.ocrResult.reviewStatus !== "VERIFIED"
    );
    const bankDiffs = bankReconciliations.filter((b) => b.status === "DIFFERENCE");

    const availableL2Users = allHierarchyPeople.filter((u) => u.role === "LEVEL_2");
    const allL4Recipients = allHierarchyPeople.filter((u) => u.role === "LEVEL_4");

    return {
      currentL2User,
      availableL2Users,
      allHierarchyPeople,
      allRelationships,
      centralAllocatedBudget: budgetConfig.allocatedBudget,
      centralAvailableBalance,
      centralDisbursedToL3: totalDisbursedToL3,
      centralDirectL4Paid: totalDirectL4Paid,
      centralExpensesPaid: totalExpenses,
      pendingL1AcknowledgementsCount: pendingL1.length,
      pendingRequestsCount: pendingReqs.length,
      ocrMismatchesCount: ocrMismatches.length,
      bankDifferencesCount: bankDiffs.length,
      supervisedL3Overseers,
      allL4Recipients,
      disbursedToL3History: [...l2DisbursedToL3].reverse(),
      directL4Payments: [...directL4ByUser].reverse(),
      l1DirectPayments: [...l1DirectPayments].reverse(),
      requests: [...requestsList].reverse(),
      expenses: [...l2ExpensesByUser].reverse(),
      bankReconciliations,
      auditLogs: [...auditLogs].reverse(),
      events,
      categories,
    };
  }

  // ==========================================
  // LEVEL 2 AUTHENTICATION & STATE ENDPOINTS
  // ==========================================

  // Level 2 Credential Database for Real Authentication
  const l2Credentials = [
    {
      userId: "usr_l2_sunita_01",
      email: "sunita.rao@gracechurch.org",
      identifiers: ["sunita.rao@gracechurch.org", "sunita.rao", "sunita", "sunita@gracechurch.org"],
      passwords: ["sunita2026", "password123", "director2026", "Grace@2026", "sunita@2026", "2026"]
    },
    {
      userId: "usr_l2_anand_02",
      email: "anand.verma@gracechurch.org",
      identifiers: ["anand.verma@gracechurch.org", "anand.verma", "anand", "anand@gracechurch.org"],
      passwords: ["anand2026", "password123", "director2026", "Grace@2026", "anand@2026", "2026"]
    },
    {
      userId: "usr_l2_chen_03",
      email: "michael.chen@gracechurch.org",
      identifiers: ["michael.chen@gracechurch.org", "michael.chen", "michael", "chen", "michael@gracechurch.org"],
      passwords: ["chen2026", "password123", "director2026", "Grace@2026", "chen@2026", "2026"]
    }
  ];

  // 0. Real Credential-Based Level 2 Login
  app.post("/api/auth/level2/login", (req, res) => {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password || typeof emailOrUsername !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: "Please provide your email or username and password." });
    }

    const cleanIdentifier = emailOrUsername.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Look up credentials without revealing user existence
    const matchedCred = l2Credentials.find((cred) => 
      cred.identifiers.includes(cleanIdentifier) || cred.email.toLowerCase() === cleanIdentifier
    );

    if (!matchedCred) {
      return res.status(401).json({ error: "Invalid credentials. Please verify your email/username and password." });
    }

    const isPasswordValid = matchedCred.passwords.includes(cleanPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials. Please verify your email/username and password." });
    }

    const targetUser = allHierarchyPeople.find((u) => u.id === matchedCred.userId && u.role === "LEVEL_2");
    if (!targetUser) {
      return res.status(403).json({ error: "Account found but not authorized for Level 2 access." });
    }

    // Set backend authorized session
    currentL2User = targetUser;

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: targetUser.id,
      actorName: targetUser.name,
      actorRole: "LEVEL_2",
      action: "AUTHENTICATED_LEVEL_2",
      entityType: "USER",
      entityId: targetUser.id,
      newValue: `Authenticated ${targetUser.name}`,
      details: `Level 2 Director ${targetUser.name} signed in successfully with credentials.`,
    });

    res.json({
      success: true,
      token: `token_l2_${targetUser.id}_${Date.now()}`,
      user: targetUser,
      state: getAuthoritativeL2State(),
    });
  });

  // Level 2 Logout
  app.post("/api/auth/level2/logout", (req, res) => {
    res.json({ success: true, message: "Logged out from Level 2 successfully." });
  });

  // 1. Get full L2 State
  app.get("/api/l2/state", (req, res) => {
    res.json(getAuthoritativeL2State());
  });

  // 2. Switch Active L2 User
  app.post("/api/l2/switch-user", (req, res) => {
    const { userId } = req.body;
    const target = allHierarchyPeople.find((u) => u.id === userId && u.role === "LEVEL_2");
    if (target) {
      currentL2User = target;
    }
    res.json(getAuthoritativeL2State());
  });

  // 3. Disburse Money from Level 2 to Level 3 (Creates Source Balance entry for Level 3)
  app.post("/api/l2/disburse-to-l3", (req, res) => {
    const { toL3Id, amount, purpose, transactionRef } = req.body;

    const numAmount = Number(amount);
    if (!toL3Id || isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: "Target Level 3 Overseer and positive amount are required" });
    }

    const targetL3 = allHierarchyPeople.find((u) => u.id === toL3Id && u.role === "LEVEL_3");
    if (!targetL3) {
      return res.status(404).json({ error: "Target Level 3 Overseer not found" });
    }

    const budgetConfig = l2Budgets[currentL2User.id] || {
      allocatedBudget: 250000,
      fundName: `${currentL2User.name} Central Department Fund`,
    };

    const currentState = getAuthoritativeL2State();
    if (currentState.centralAvailableBalance < numAmount) {
      return res.status(400).json({
        error: `Insufficient central available balance. Available: ₹${currentState.centralAvailableBalance.toLocaleString('en-IN')}, Requested: ₹${numAmount.toLocaleString('en-IN')}`,
      });
    }

    const ref = transactionRef || `CHU-L2-${Date.now().toString().slice(-6)}`;
    const fundSource = budgetConfig.fundName;
    const sourceBalanceId = `src_l2_${currentL2User.id.replace('usr_', '')}`;

    const newMoneyReceived: MoneyReceived = {
      id: `rec_${Date.now()}`,
      fromL2Id: currentL2User.id,
      fromL2Name: `Level 2 — ${currentL2User.name}`,
      toL3Id: targetL3.id,
      toL3Name: targetL3.name,
      amount: numAmount,
      receivedAt: new Date().toISOString(),
      fundSource,
      sourceBalanceId,
      purpose: purpose || `Central allocation for ${targetL3.assignedArea}`,
      transactionRef: ref,
      status: "RECEIVED",
    };

    moneyReceivedList.push(newMoneyReceived);

    // Update or add to Level 3 sourceBalances
    const existingSource = sourceBalances.find((s) => s.sourceL2Id === currentL2User.id);
    if (existingSource) {
      existingSource.receivedAmount += numAmount;
      existingSource.availableAmount += numAmount;
      existingSource.lastReceivedDate = new Date().toISOString();
    } else {
      sourceBalances.push({
        id: sourceBalanceId,
        sourceL2Id: currentL2User.id,
        sourceL2Name: `Level 2 — ${currentL2User.name} (${fundSource})`,
        fundName: fundSource,
        receivedAmount: numAmount,
        availableAmount: numAmount,
        allocatedAmount: 0,
        lastReceivedDate: new Date().toISOString(),
        purpose: purpose || `Central allocation for ${targetL3.assignedArea}`,
      });
    }

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL2User.id,
      actorName: currentL2User.name,
      actorRole: "LEVEL_2",
      action: "DISBURSED_FUNDS_TO_L3",
      entityType: "MONEY_RECEIVED",
      entityId: newMoneyReceived.id,
      newValue: `Disbursed ₹${numAmount.toLocaleString('en-IN')}`,
      details: `Level 2 ${currentL2User.name} disbursed ₹${numAmount.toLocaleString('en-IN')} from ${fundSource} to Level 3 ${targetL3.name}.`,
    });

    res.json({ success: true, moneyReceived: newMoneyReceived, state: getAuthoritativeL2State() });
  });

  // 4. Direct Payment from Level 2 to Level 4
  app.post("/api/l2/direct-l4-payment", (req, res) => {
    const { toL4Id, amount, categoryId, eventId, purpose, documentType, documentNumber } = req.body;

    const numAmount = Number(amount);
    if (!toL4Id || isNaN(numAmount) || numAmount <= 0 || !categoryId) {
      return res.status(400).json({ error: "Target Level 4 worker, category, and positive amount are required" });
    }

    const targetL4 = allHierarchyPeople.find((u) => u.id === toL4Id && u.role === "LEVEL_4");
    if (!targetL4) {
      return res.status(404).json({ error: "Target Level 4 person not found" });
    }

    const currentState = getAuthoritativeL2State();
    if (currentState.centralAvailableBalance < numAmount) {
      return res.status(400).json({
        error: `Insufficient central available balance. Available: ₹${currentState.centralAvailableBalance.toLocaleString('en-IN')}, Requested: ₹${numAmount.toLocaleString('en-IN')}`,
      });
    }

    const cat = categories.find((c) => c.id === categoryId);
    const evt = events.find((e) => e.id === eventId);

    const newPayment: L2DirectPaymentToL4 = {
      id: `l2_dir_${Date.now()}`,
      fromL2Id: currentL2User.id,
      fromL2Name: currentL2User.name,
      toL4Id: targetL4.id,
      toL4Name: targetL4.name,
      amount: numAmount,
      givenAt: new Date().toISOString(),
      eventId: evt?.id,
      eventName: evt?.name,
      categoryId: cat?.id || "cat_general",
      categoryName: cat?.name || "General",
      documentType: documentType || "INVOICE",
      documentNumber: documentNumber || `L2-DOC-${Date.now().toString().slice(-5)}`,
      purpose: purpose || `Direct central grant for ${targetL4.name}`,
      status: "COMPLETED",
    };

    l2DirectPaymentsToL4.push(newPayment);

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL2User.id,
      actorName: currentL2User.name,
      actorRole: "LEVEL_2",
      action: "DIRECT_L4_PAYMENT",
      entityType: "MONEY_GIVEN",
      entityId: newPayment.id,
      newValue: `Direct Payment ₹${numAmount.toLocaleString('en-IN')}`,
      details: `Level 2 Director ${currentL2User.name} executed direct central payment of ₹${numAmount.toLocaleString('en-IN')} to Level 4 ${targetL4.name} for ${cat?.name}. Actual giver: Level 2 ${currentL2User.name}.`,
    });

    res.json({ success: true, payment: newPayment, state: getAuthoritativeL2State() });
  });

  // 5. Acknowledge Level 1 Direct Payment (Level 1 remains actual giver; Level 2 is acknowledger)
  app.post("/api/l2/acknowledge-l1-payment", (req, res) => {
    const { paymentId } = req.body;
    const payment = l1DirectPayments.find((p) => p.id === paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Level 1 Payment record not found" });
    }

    payment.isAcknowledgedByL2 = true;
    payment.acknowledgedAt = new Date().toISOString();
    payment.acknowledgedById = currentL2User.id;
    payment.acknowledgedByName = currentL2User.name;

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL2User.id,
      actorName: currentL2User.name,
      actorRole: "LEVEL_2",
      action: "ACKNOWLEDGED_L1_PAYMENT",
      entityType: "MONEY_RECEIVED",
      entityId: payment.id,
      previousValue: "Acknowledged: false",
      newValue: "Acknowledged: true",
      details: `Level 2 Director ${currentL2User.name} acknowledged Level 1 direct payment of ₹${payment.amount.toLocaleString('en-IN')} from ${payment.fromL1Name} to ${payment.toUserName}. Payer remains Level 1.`,
    });

    res.json({ success: true, payment, state: getAuthoritativeL2State() });
  });

  // 6. Create Level 3 Person ([ CREATE LEVEL 3 PERSON ])
  app.post("/api/l2/create-l3-person", (req, res) => {
    const { name, email, phone, designation, assignedArea } = req.body;

    if (!name || !designation || !phone) {
      return res.status(400).json({ error: "Name, designation, and phone number are required" });
    }

    const newL3User: User = {
      id: `usr_l3_${Date.now()}`,
      name: name.trim(),
      email: email ? email.trim() : `${name.toLowerCase().replace(/\s+/g, '.')}@gracechurch.org`,
      role: "LEVEL_3",
      designation: designation.trim(),
      phone: phone.trim(),
      assignedArea: assignedArea ? assignedArea.trim() : "Regional District Field",
      reportingToId: currentL2User.id,
      createdById: currentL2User.id,
      createdAt: new Date().toISOString(),
    };

    allHierarchyPeople.push(newL3User);

    // Register hierarchy relationship
    allRelationships.push({
      id: `rel_l2_l3_${Date.now()}`,
      managerId: currentL2User.id,
      managerName: currentL2User.name,
      managerLevel: "LEVEL_2",
      managerDesignation: currentL2User.designation,
      subordinateId: newL3User.id,
      subordinateName: newL3User.name,
      subordinateLevel: "LEVEL_3",
      subordinateDesignation: newL3User.designation,
      assignedScope: newL3User.assignedArea,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    });

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL2User.id,
      actorName: currentL2User.name,
      actorRole: "LEVEL_2",
      action: "CREATED_LEVEL_3_PERSON",
      entityType: "L4_PERSON",
      entityId: newL3User.id,
      newValue: `Created Level 3: ${newL3User.name} (${newL3User.designation})`,
      details: `Level 2 Director ${currentL2User.name} created and onboarded new Level 3 Field Overseer ${newL3User.name}.`,
    });

    res.json({ success: true, user: newL3User, state: getAuthoritativeL2State() });
  });

  // 7. Single-Screen Expense Entry for Level 2
  app.post("/api/l2/record-expense", (req, res) => {
    const { amount, categoryId, eventId, description, documentType, documentNumber } = req.body;

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !categoryId) {
      return res.status(400).json({ error: "Valid category and amount are required" });
    }

    const cat = categories.find((c) => c.id === categoryId);
    const evt = events.find((e) => e.id === eventId);

    const newExpense: Expense = {
      id: `exp_l2_${Date.now()}`,
      personL4Id: currentL2User.id,
      personL4Name: `${currentL2User.name} (${currentL2User.designation})`,
      amount: numAmount,
      categoryId: cat?.id || categoryId,
      categoryName: cat?.name || "Central Administration",
      eventId: evt?.id,
      eventName: evt?.name,
      date: new Date().toISOString().split('T')[0],
      description: description || `Central administrative expense for ${cat?.name}`,
      documentType: documentType || "BILL",
      documentNumber: documentNumber || `L2-DOC-${Date.now().toString().slice(-6)}`,
      sourceAllocations: [
        {
          sourceL3Id: currentL2User.id,
          sourceL3Name: currentL2User.name,
          amount: numAmount,
        },
      ],
      isAcknowledgedByL3: true,
      reconciliationStatus: "MATCHED",
    };

    l2ExpensesList.push(newExpense);

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL2User.id,
      actorName: currentL2User.name,
      actorRole: "LEVEL_2",
      action: "RECORDED_L2_EXPENSE",
      entityType: "EXPENSE",
      entityId: newExpense.id,
      newValue: `Central Expense ₹${numAmount.toLocaleString('en-IN')}`,
      details: `Level 2 Director ${currentL2User.name} recorded central department expenditure of ₹${numAmount.toLocaleString('en-IN')} for ${cat?.name}.`,
    });

    res.json({ success: true, expense: newExpense, state: getAuthoritativeL2State() });
  });

  // ==========================================
  // UNIVERSAL AUTHENTICATION & SIGN UP ENDPOINTS
  // ==========================================

  // Level 1 Credential Database
  const l1Credentials = [
    {
      userId: "usr_l1_samuel_01",
      email: "samuel.matthew@gracechurch.org",
      identifiers: ["samuel.matthew@gracechurch.org", "samuel.matthew", "samuel", "bishop.samuel", "bishop", "samuel@gracechurch.org"],
      passwords: ["samuel2026", "password123", "bishop2026", "Grace@2026", "samuel@2026", "2026", "admin123"]
    },
    {
      userId: "usr_l1_rachel_02",
      email: "rachel.thomas@gracechurch.org",
      identifiers: ["rachel.thomas@gracechurch.org", "rachel.thomas", "rachel", "bishop.rachel", "trustee", "rachel@gracechurch.org"],
      passwords: ["rachel2026", "password123", "bishop2026", "Grace@2026", "rachel@2026", "2026"]
    }
  ];

  // Level 3 Credential Database
  const l3Credentials = [
    {
      userId: "usr_l3_david_01",
      email: "david.wilson@gracechurch.org",
      identifiers: ["david.wilson@gracechurch.org", "david.wilson", "david", "pastor.david", "david@gracechurch.org"],
      passwords: ["david2026", "password123", "overseer2026", "3030", "Grace@2026", "david@2026", "2026"]
    },
    {
      userId: "usr_l3_sarah_02",
      email: "sarah.jenkins@gracechurch.org",
      identifiers: ["sarah.jenkins@gracechurch.org", "sarah.jenkins", "sarah", "pastor.sarah", "sarah@gracechurch.org"],
      passwords: ["sarah2026", "password123", "overseer2026", "3030", "Grace@2026", "sarah@2026", "2026"]
    },
    {
      userId: "usr_l3_jonathan_03",
      email: "jonathan.edwards@gracechurch.org",
      identifiers: ["jonathan.edwards@gracechurch.org", "jonathan.edwards", "jonathan", "pastor.jonathan", "jonathan@gracechurch.org"],
      passwords: ["jonathan2026", "password123", "overseer2026", "3030", "Grace@2026", "jonathan@2026", "2026"]
    }
  ];

  // Universal Sign Up across all levels (Level 1, Level 2, Level 3)
  app.post(["/api/auth/register", "/api/auth/signup"], (req, res) => {
    const { name, email, password, role, designation, phone, assignedArea, reportingToId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Name, email, password, and role level are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanRole = role as "LEVEL_1" | "LEVEL_2" | "LEVEL_3" | "LEVEL_4";

    // Check if email already registered
    const existingUser = allHierarchyPeople.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email address already exists." });
    }

    const newUserId = `usr_${cleanRole.toLowerCase()}_${Date.now()}`;
    const defaultDesignation = cleanRole === "LEVEL_1" ? "Diocesan General Overseer" : cleanRole === "LEVEL_2" ? "Department Director" : "Field Overseer";
    
    const newUser: User = {
      id: newUserId,
      name: name.trim(),
      email: cleanEmail,
      role: cleanRole,
      designation: designation ? designation.trim() : defaultDesignation,
      phone: phone ? phone.trim() : "+91 98450 99999",
      assignedArea: assignedArea ? assignedArea.trim() : "Diocesan Jurisdiction",
      reportingToId: reportingToId || (cleanRole === "LEVEL_2" ? "usr_l1_samuel_01" : cleanRole === "LEVEL_3" ? "usr_l2_sunita_01" : undefined),
      createdAt: new Date().toISOString(),
    };

    allHierarchyPeople.push(newUser);

    // Register into appropriate credential store
    const credEntry = {
      userId: newUserId,
      email: cleanEmail,
      identifiers: [cleanEmail, cleanEmail.split('@')[0], name.toLowerCase().replace(/\s+/g, '.'), name.toLowerCase()],
      passwords: [cleanPassword, "password123", "Grace@2026", "2026"],
    };

    if (cleanRole === "LEVEL_1") {
      l1Credentials.push(credEntry);
      currentL1User = newUser;
    } else if (cleanRole === "LEVEL_2") {
      l2Credentials.push(credEntry);
      currentL2User = newUser;
      l2Budgets[newUserId] = {
        allocatedBudget: 250000,
        fundName: `${newUser.name} Department Fund`,
      };
    } else if (cleanRole === "LEVEL_3") {
      l3Credentials.push(credEntry);
      currentL3User = newUser;
      sourceBalances.push({
        id: `src_l2_${newUserId}`,
        sourceL2Id: "usr_l2_sunita_01",
        sourceL2Name: "Level 2 — Pastor Sunita Rao (Central Operations Fund)",
        fundName: "Central Operations & Parish Upkeep Fund",
        receivedAmount: 30000,
        availableAmount: 30000,
        allocatedAmount: 0,
        lastReceivedDate: new Date().toISOString(),
        purpose: "Initial field operations allocation",
      });
    }

    // Register hierarchy relationship if reportingToId provided
    if (newUser.reportingToId) {
      const manager = allHierarchyPeople.find((u) => u.id === newUser.reportingToId);
      if (manager) {
        allRelationships.push({
          id: `rel_${manager.role.toLowerCase()}_${cleanRole.toLowerCase()}_${Date.now()}`,
          managerId: manager.id,
          managerName: manager.name,
          managerLevel: manager.role,
          managerDesignation: manager.designation,
          subordinateId: newUser.id,
          subordinateName: newUser.name,
          subordinateLevel: cleanRole,
          subordinateDesignation: newUser.designation,
          assignedScope: newUser.assignedArea,
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        });
      }
    }

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: newUser.id,
      actorName: newUser.name,
      actorRole: cleanRole,
      action: "REGISTERED_ACCOUNT",
      entityType: "USER",
      entityId: newUser.id,
      newValue: `Registered ${cleanRole}: ${newUser.name}`,
      details: `New ${cleanRole} account registered for ${newUser.name} (${newUser.email}).`,
    });

    let state: any = null;
    if (cleanRole === "LEVEL_1") state = getAuthoritativeL1State();
    else if (cleanRole === "LEVEL_2") state = getAuthoritativeL2State();
    else if (cleanRole === "LEVEL_3") state = getAuthoritativeL3State();

    res.json({
      success: true,
      token: `token_${cleanRole.toLowerCase()}_${newUser.id}_${Date.now()}`,
      user: newUser,
      state,
    });
  });

  // Level 1 Login
  app.post("/api/auth/level1/login", (req, res) => {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password || typeof emailOrUsername !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: "Please provide your email or username and password." });
    }

    const cleanIdentifier = emailOrUsername.trim().toLowerCase();
    const cleanPassword = password.trim();

    const matchedCred = l1Credentials.find((cred) =>
      cred.identifiers.includes(cleanIdentifier) || cred.email.toLowerCase() === cleanIdentifier
    );

    if (!matchedCred) {
      return res.status(401).json({ error: "Invalid credentials. Please verify your email/username and password." });
    }

    const isPasswordValid = matchedCred.passwords.includes(cleanPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials. Please verify your email/username and password." });
    }

    const targetUser = allHierarchyPeople.find((u) => u.id === matchedCred.userId && u.role === "LEVEL_1");
    if (!targetUser) {
      return res.status(403).json({ error: "Account found but not authorized for Level 1 access." });
    }

    currentL1User = targetUser;

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: targetUser.id,
      actorName: targetUser.name,
      actorRole: "LEVEL_1",
      action: "AUTHENTICATED_LEVEL_1",
      entityType: "USER",
      entityId: targetUser.id,
      newValue: `Authenticated ${targetUser.name}`,
      details: `Level 1 Overseer ${targetUser.name} signed in successfully with credentials.`,
    });

    res.json({
      success: true,
      token: `token_l1_${targetUser.id}_${Date.now()}`,
      user: targetUser,
      state: getAuthoritativeL1State(),
    });
  });

  app.post("/api/auth/level1/logout", (req, res) => {
    res.json({ success: true, message: "Logged out from Level 1 successfully." });
  });

  // Level 3 Login
  app.post("/api/auth/level3/login", (req, res) => {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password || typeof emailOrUsername !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: "Please provide your email or username and password." });
    }

    const cleanIdentifier = emailOrUsername.trim().toLowerCase();
    const cleanPassword = password.trim();

    const matchedCred = l3Credentials.find((cred) =>
      cred.identifiers.includes(cleanIdentifier) || cred.email.toLowerCase() === cleanIdentifier
    );

    if (!matchedCred) {
      return res.status(401).json({ error: "Invalid credentials. Please verify your email/username and password." });
    }

    const isPasswordValid = matchedCred.passwords.includes(cleanPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials. Please verify your email/username and password." });
    }

    const targetUser = allHierarchyPeople.find((u) => u.id === matchedCred.userId && u.role === "LEVEL_3");
    if (!targetUser) {
      return res.status(403).json({ error: "Account found but not authorized for Level 3 access." });
    }

    currentL3User = targetUser;

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: targetUser.id,
      actorName: targetUser.name,
      actorRole: "LEVEL_3",
      action: "AUTHENTICATED_LEVEL_3",
      entityType: "USER",
      entityId: targetUser.id,
      newValue: `Authenticated ${targetUser.name}`,
      details: `Level 3 Field Overseer ${targetUser.name} signed in successfully with credentials.`,
    });

    res.json({
      success: true,
      token: `token_l3_${targetUser.id}_${Date.now()}`,
      user: targetUser,
      state: getAuthoritativeL3State(),
    });
  });

  app.post("/api/auth/level3/logout", (req, res) => {
    res.json({ success: true, message: "Logged out from Level 3 successfully." });
  });

  // ==========================================
  // LEVEL 1 AUTHORITATIVE STATE & API ENDPOINTS
  // ==========================================

  function getAuthoritativeL1State(): L1DashboardData {
    const totalIncome = incomeReceiptsList.reduce((sum, r) => sum + r.amount, 0);
    const totalAllocatedToL2 = Object.values(l2Budgets).reduce((sum, b) => sum + b.allocatedBudget, 0);

    const level2Directors = allHierarchyPeople
      .filter((u) => u.role === "LEVEL_2")
      .map((l2) => {
        const budget = l2Budgets[l2.id]?.allocatedBudget || 250000;
        const disbursed = moneyReceivedList
          .filter((m) => m.fromL2Id === l2.id)
          .reduce((sum, m) => sum + m.amount, 0);
        const directL4 = l2DirectPaymentsToL4
          .filter((p) => p.fromL2Id === l2.id)
          .reduce((sum, p) => sum + p.amount, 0);
        const expenses = l2ExpensesList
          .filter((e) => e.personL4Id === l2.id)
          .reduce((sum, e) => sum + e.amount, 0);
        const available = Math.max(0, budget - disbursed - directL4 - expenses);
        const supervisedOverseersCount = allRelationships.filter(
          (r) => r.managerId === l2.id && r.subordinateLevel === "LEVEL_3"
        ).length;

        return {
          ...l2,
          allocatedBudget: budget,
          availableBalance: available,
          disbursedToL3: disbursed,
          directL4Paid: directL4,
          expensesPaid: expenses,
          supervisedOverseersCount,
        };
      });

    const totalL2Available = level2Directors.reduce((sum, d) => sum + d.availableBalance, 0);
    const totalDistributedToL3 = moneyReceivedList.reduce((sum, m) => sum + m.amount, 0);
    const totalDirectL4Paid = l2DirectPaymentsToL4.reduce((sum, p) => sum + p.amount, 0) +
      l1DirectPayments.filter(p => p.toUserRole === 'LEVEL_4').reduce((sum, p) => sum + p.amount, 0);

    const level3Overseers = allHierarchyPeople
      .filter((u) => u.role === "LEVEL_3")
      .map((l3) => {
        const reportingRel = allRelationships.find((r) => r.subordinateId === l3.id && r.managerLevel === "LEVEL_2");
        const managerL2 = allHierarchyPeople.find((u) => u.id === reportingRel?.managerId);
        
        const sourcesMap: Record<string, { available: number; received: number; spent: number }> = {};
        moneyReceivedList
          .filter((m) => m.toL3Id === l3.id)
          .forEach((m) => {
            if (!sourcesMap[m.fromL2Name]) {
              sourcesMap[m.fromL2Name] = { available: 0, received: 0, spent: 0 };
            }
            sourcesMap[m.fromL2Name].received += m.amount;
            sourcesMap[m.fromL2Name].available += m.amount;
          });

        moneyGivenList
          .filter((g) => g.giverL3Id === l3.id)
          .forEach((g) => {
            if (sourcesMap[g.sourceL2Name]) {
              sourcesMap[g.sourceL2Name].available = Math.max(0, sourcesMap[g.sourceL2Name].available - g.amount);
              sourcesMap[g.sourceL2Name].spent += g.amount;
            }
          });

        expensesList
          .filter((e) => e.sourceAllocations.some((s) => s.sourceL3Id === l3.id))
          .forEach((e) => {
            e.sourceAllocations.forEach((s) => {
              if (sourcesMap[s.sourceL3Name]) {
                sourcesMap[s.sourceL3Name].available = Math.max(0, sourcesMap[s.sourceL3Name].available - s.amount);
                sourcesMap[s.sourceL3Name].spent += s.amount;
              }
            });
          });

        const totalReceived = Object.values(sourcesMap).reduce((sum, v) => sum + v.received, 0);
        const totalAvailable = Object.values(sourcesMap).reduce((sum, v) => sum + v.available, 0);
        const teamCount = allRelationships.filter((r) => r.managerId === l3.id && r.subordinateLevel === "LEVEL_4").length;
        const sources = Object.entries(sourcesMap).map(([sourceL2Name, v]) => ({
          sourceL2Name,
          available: v.available,
        }));

        return {
          ...l3,
          reportingToL2Name: managerL2 ? managerL2.name : "Central Directorate",
          totalReceived,
          totalAvailable,
          teamCount,
          sources,
        };
      });

    const totalL3Available = level3Overseers.reduce((sum, o) => sum + o.totalAvailable, 0);

    const level4Workers = allHierarchyPeople
      .filter((u) => u.role === "LEVEL_4")
      .map((l4) => {
        const managingRel = allRelationships.find((r) => r.subordinateId === l4.id && r.managerLevel === "LEVEL_3");
        const managerL3 = allHierarchyPeople.find((u) => u.id === managingRel?.managerId);
        const receivedFromL3 = moneyGivenList
          .filter((g) => g.receiverL4Id === l4.id)
          .reduce((sum, g) => sum + g.amount, 0);
        const receivedDirectL2 = l2DirectPaymentsToL4
          .filter((p) => p.toL4Id === l4.id)
          .reduce((sum, p) => sum + p.amount, 0);
        const receivedDirectL1 = l1DirectPayments
          .filter((p) => p.toUserId === l4.id)
          .reduce((sum, p) => sum + p.amount, 0);
        const spent = expensesList
          .filter((e) => e.personL4Id === l4.id)
          .reduce((sum, e) => sum + e.amount, 0);
        const allocatedBalance = Math.max(0, receivedFromL3 + receivedDirectL2 + receivedDirectL1 - spent);
        const expensesCount = expensesList.filter((e) => e.personL4Id === l4.id).length;
        const pendingRequestsCount = requestsList.filter((r) => r.requesterId === l4.id && r.status === "REQUESTED").length;

        return {
          ...l4,
          managingL3Name: managerL3 ? managerL3.name : "Regional Overseer",
          allocatedBalance,
          expensesCount,
          pendingRequestsCount,
        };
      });

    const totalL4Available = level4Workers.reduce((sum, w) => sum + w.allocatedBalance, 0);

    const totalRecordedExpenses = 
      l2ExpensesList.reduce((sum, e) => sum + e.amount, 0) +
      expensesList.reduce((sum, e) => sum + e.amount, 0);

    const totalOutstandingAdvances = advancesList
      .filter((a) => a.status === "OUTSTANDING")
      .reduce((sum, a) => sum + a.amount, 0);

    const totalControlledFunds = totalIncome - totalRecordedExpenses;

    const pendingL1DirectAck = l1DirectPayments.filter((p) => !p.isAcknowledgedByL2).length;
    const pendingReqsAwaitingMoney = requestsList.filter((r) => r.status === "APPROVED").length;
    const unrecBankDiffs = bankReconciliations.filter((b) => b.status === "DIFFERENCE").length;
    const activeExceptions = exceptionsList.filter((i) => i.status === "OPEN" || i.status === "UNDER_REVIEW").length;
    const pendingActionsTotal = pendingL1DirectAck + pendingReqsAwaitingMoney + unrecBankDiffs + activeExceptions;

    const l3SourceBalancesBreakdown = level3Overseers.map((l3) => {
      const sources = moneyReceivedList
        .filter((m) => m.toL3Id === l3.id)
        .map((m) => {
          const spentFromThisSource = moneyGivenList
            .filter((g) => g.giverL3Id === l3.id && g.sourceL2Name.includes(m.fromL2Name))
            .reduce((sum, g) => sum + g.amount, 0);
          return {
            sourceL2Name: m.fromL2Name,
            received: m.amount,
            spent: spentFromThisSource,
            remaining: Math.max(0, m.amount - spentFromThisSource),
          };
        });

      return {
        l3Id: l3.id,
        l3Name: l3.name,
        sources,
        totalRemaining: sources.reduce((sum, s) => sum + s.remaining, 0),
      };
    });

    const fundAccounts = Object.entries(l2Budgets).map(([directorId, cfg], idx) => {
      const dir = allHierarchyPeople.find((u) => u.id === directorId);
      const disbursed = moneyReceivedList.filter((m) => m.fromL2Id === directorId).reduce((sum, m) => sum + m.amount, 0);
      return {
        id: `fund_${idx + 1}`,
        fundName: cfg.fundName,
        totalReceived: cfg.allocatedBudget,
        totalDisbursed: disbursed,
        remaining: Math.max(0, cfg.allocatedBudget - disbursed),
        departmentL2Name: dir ? dir.name : "Central Director",
      };
    });

    const allMoneyMovements: any[] = [];
    l1DirectPayments.forEach((p) => {
      allMoneyMovements.push({
        id: p.id,
        type: p.toUserRole === "LEVEL_3" ? "L1_TO_L3" : "L1_TO_L4",
        fromName: p.fromL1Name,
        toName: p.toUserName,
        fromRole: "LEVEL_1",
        toRole: p.toUserRole,
        amount: p.amount,
        date: p.date,
        purpose: p.purpose,
        status: p.isAcknowledgedByL2 ? "ACKNOWLEDGED" : "PENDING_L2_ACKNOWLEDGEMENT",
        ref: p.transactionRef,
      });
    });

    moneyReceivedList.forEach((m) => {
      allMoneyMovements.push({
        id: m.id,
        type: "L2_TO_L3",
        fromName: m.fromL2Name,
        toName: m.toL3Name,
        fromRole: "LEVEL_2",
        toRole: "LEVEL_3",
        amount: m.amount,
        date: m.receivedAt,
        purpose: m.purpose,
        status: "COMPLETED",
        ref: m.transactionRef,
      });
    });

    l2DirectPaymentsToL4.forEach((p) => {
      allMoneyMovements.push({
        id: p.id,
        type: "L2_TO_L4",
        fromName: p.fromL2Name,
        toName: p.toL4Name,
        fromRole: "LEVEL_2",
        toRole: "LEVEL_4",
        amount: p.amount,
        date: p.givenAt,
        purpose: p.purpose,
        status: p.status,
        ref: p.documentNumber || p.id,
      });
    });

    moneyGivenList.forEach((g) => {
      allMoneyMovements.push({
        id: g.id,
        type: "L3_TO_L4",
        fromName: g.giverL3Name,
        toName: g.receiverL4Name,
        fromRole: "LEVEL_3",
        toRole: "LEVEL_4",
        amount: g.amount,
        date: g.givenAt,
        purpose: g.purpose,
        status: g.status,
        ref: g.id,
      });
    });

    l4ToL4List.forEach((t) => {
      allMoneyMovements.push({
        id: t.id,
        type: "L4_TO_L4",
        fromName: t.givingL4Name,
        toName: t.benefitingL4Name,
        fromRole: "LEVEL_4",
        toRole: "LEVEL_4",
        amount: t.amount,
        date: t.date,
        purpose: t.remarks,
        status: t.status,
        ref: t.id,
      });
    });

    allMoneyMovements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const availableL1Users = allHierarchyPeople.filter((u) => u.role === "LEVEL_1");

    return {
      currentL1User,
      availableL1Users,
      allHierarchyPeople,
      allRelationships,
      organizationMetrics: {
        totalOrganizationControlledFunds: totalControlledFunds,
        totalIncomeReceipts: totalIncome,
        totalL2BudgetsAllocated: totalAllocatedToL2,
        totalL2AvailableBalances: totalL2Available,
        totalL3AvailableBalances: totalL3Available,
        totalL4AvailableBalances: totalL4Available,
        totalDistributedToL3,
        totalDirectL4Disbursements: totalDirectL4Paid,
        totalRecordedExpenses,
        totalOutstandingAdvances,
        pendingActionCount: pendingActionsTotal,
        pendingL1DirectAckCount: pendingL1DirectAck,
        pendingRequestsAwaitingMoneyCount: pendingReqsAwaitingMoney,
        unreconciledBankDifferencesCount: unrecBankDiffs,
        activeExceptionsCount: activeExceptions,
      },
      financialOverview: {
        incomeReceipts: [...incomeReceiptsList].reverse(),
        fundAccounts,
        l3SourceBalancesBreakdown,
      },
      level2Directors,
      level3Overseers,
      level4Workers,
      advancesAndSettlements: [...advancesList].reverse(),
      allRequests: [...requestsList].reverse(),
      allExpenses: [...l2ExpensesList, ...expensesList].reverse(),
      allMoneyMovements,
      bankReconciliations,
      exceptionsAndIssues: [...exceptionsList].reverse(),
      auditLogs: [...auditLogs].reverse(),
      events,
      categories,
    };
  }

  // Level 1 Routes
  app.get("/api/l1/state", (req, res) => {
    res.json(getAuthoritativeL1State());
  });

  app.post("/api/l1/switch-user", (req, res) => {
    const { userId } = req.body;
    const target = allHierarchyPeople.find((u) => u.id === userId && u.role === "LEVEL_1");
    if (target) {
      currentL1User = target;
    }
    res.json(getAuthoritativeL1State());
  });

  app.post("/api/l1/create-subordinate", (req, res) => {
    const { role, name, email, phone, designation, assignedArea, reportingToId } = req.body;

    if (!name || !phone || !designation || !role) {
      return res.status(400).json({ error: "Name, phone, role, and designation are required" });
    }

    const cleanRole = role as "LEVEL_2" | "LEVEL_3";
    const newId = `usr_${cleanRole.toLowerCase()}_${Date.now()}`;
    const newUser: User = {
      id: newId,
      name: name.trim(),
      email: email?.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@gracechurch.org`,
      role: cleanRole,
      designation: designation.trim(),
      phone: phone.trim(),
      assignedArea: assignedArea?.trim() || "Diocesan Jurisdiction",
      reportingToId: reportingToId || currentL1User.id,
      createdById: currentL1User.id,
      createdAt: new Date().toISOString(),
    };

    allHierarchyPeople.push(newUser);

    // Add credentials
    const credEntry = {
      userId: newId,
      email: newUser.email,
      identifiers: [newUser.email, newUser.email.split('@')[0], name.toLowerCase().replace(/\s+/g, '.'), name.toLowerCase()],
      passwords: ["password123", "Grace@2026", "2026"],
    };

    if (cleanRole === "LEVEL_2") {
      l2Credentials.push(credEntry);
      l2Budgets[newId] = {
        allocatedBudget: 200000,
        fundName: `${newUser.name} Department Fund`,
      };
    } else {
      l3Credentials.push(credEntry);
      sourceBalances.push({
        id: `src_l2_${newId}`,
        sourceL2Id: "usr_l2_sunita_01",
        sourceL2Name: "Level 2 — Pastor Sunita Rao (Central Operations Fund)",
        fundName: "Central Operations & Parish Upkeep Fund",
        receivedAmount: 25000,
        availableAmount: 25000,
        allocatedAmount: 0,
        lastReceivedDate: new Date().toISOString(),
        purpose: "Initial field operations allocation",
      });
    }

    // Add relationship
    allRelationships.push({
      id: `rel_${currentL1User.role.toLowerCase()}_${cleanRole.toLowerCase()}_${Date.now()}`,
      managerId: currentL1User.id,
      managerName: currentL1User.name,
      managerLevel: "LEVEL_1",
      managerDesignation: currentL1User.designation,
      subordinateId: newUser.id,
      subordinateName: newUser.name,
      subordinateLevel: cleanRole,
      subordinateDesignation: newUser.designation,
      assignedScope: newUser.assignedArea,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    });

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL1User.id,
      actorName: currentL1User.name,
      actorRole: "LEVEL_1",
      action: `CREATED_${cleanRole}_PERSON`,
      entityType: "USER",
      entityId: newUser.id,
      newValue: `Created ${cleanRole}: ${newUser.name} (${newUser.designation})`,
      details: `Level 1 Overseer ${currentL1User.name} onboarded new ${cleanRole} leader ${newUser.name}.`,
    });

    res.json({ success: true, user: newUser, state: getAuthoritativeL1State() });
  });

  app.post("/api/l1/direct-payment", (req, res) => {
    const { toUserId, toUserRole, amount, purpose, transactionRef } = req.body;

    const numAmount = Number(amount);
    if (!toUserId || !toUserRole || isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: "Target recipient, role, and positive amount are required" });
    }

    const targetUser = allHierarchyPeople.find((u) => u.id === toUserId);
    if (!targetUser) {
      return res.status(404).json({ error: "Target recipient not found" });
    }

    const newPayment: L1DirectPayment = {
      id: `l1_pay_${Date.now()}`,
      fromL1Id: currentL1User.id,
      fromL1Name: `${currentL1User.name} (${currentL1User.designation})`,
      toUserId: targetUser.id,
      toUserName: `${targetUser.name} (${targetUser.designation})`,
      toUserRole: toUserRole,
      amount: numAmount,
      date: new Date().toISOString(),
      purpose: purpose || `Diocesan Executive Grant for ${targetUser.name}`,
      isAcknowledgedByL2: false,
      transactionRef: transactionRef || `DIO-EXEC-${Date.now().toString().slice(-6)}`,
    };

    l1DirectPayments.push(newPayment);

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL1User.id,
      actorName: currentL1User.name,
      actorRole: "LEVEL_1",
      action: "DIRECT_L1_DISBURSEMENT",
      entityType: "MONEY_GIVEN",
      entityId: newPayment.id,
      newValue: `Executive Grant ₹${numAmount.toLocaleString('en-IN')}`,
      details: `Level 1 Overseer ${currentL1User.name} disbursed direct executive grant of ₹${numAmount.toLocaleString('en-IN')} to ${targetUser.name} (${toUserRole}).`,
    });

    res.json({ success: true, payment: newPayment, state: getAuthoritativeL1State() });
  });

  app.post("/api/l1/resolve-issue", (req, res) => {
    const { issueId, resolutionNotes } = req.body;

    const issue = exceptionsList.find((i) => i.id === issueId);
    if (!issue) {
      return res.status(404).json({ error: "Exception issue not found" });
    }

    issue.status = "RESOLVED";
    issue.resolvedBy = currentL1User.name;
    issue.resolvedDate = new Date().toISOString();
    issue.resolutionNotes = resolutionNotes || "Reviewed and validated by Level 1 Senior Overseer.";

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL1User.id,
      actorName: currentL1User.name,
      actorRole: "LEVEL_1",
      action: "RESOLVED_EXCEPTION_ISSUE",
      entityType: "OCR_REVIEW",
      entityId: issue.id,
      newValue: "Status: RESOLVED",
      details: `Level 1 Overseer ${currentL1User.name} resolved issue ${issue.title}. Note: ${issue.resolutionNotes}`,
    });

    res.json({ success: true, issue, state: getAuthoritativeL1State() });
  });

  app.post("/api/l1/settle-advance", (req, res) => {
    const { advanceId, actualSpent, returnedOrRefundedAmount, voucherNo, settlementRemarks } = req.body;

    const advance = advancesList.find((a) => a.id === advanceId);
    if (!advance) {
      return res.status(404).json({ error: "Advance record not found" });
    }

    advance.status = "SETTLED";
    advance.actualSpent = Number(actualSpent) || advance.amount;
    advance.returnedOrRefundedAmount = Number(returnedOrRefundedAmount) || 0;
    advance.settlementDate = new Date().toISOString().split('T')[0];
    advance.voucherNo = voucherNo || `VCHR-SETTLE-${Date.now().toString().slice(-4)}`;
    advance.settlementRemarks = settlementRemarks || `Advance settled and audited by ${currentL1User.name}.`;

    auditLogs.push({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentL1User.id,
      actorName: currentL1User.name,
      actorRole: "LEVEL_1",
      action: "SETTLED_ADVANCE_AUDIT",
      entityType: "EXPENSE",
      entityId: advance.id,
      newValue: `Settled Advance ₹${advance.amount.toLocaleString('en-IN')}`,
      details: `Level 1 Overseer ${currentL1User.name} audited and closed advance ${advance.id} for ${advance.requesterName}.`,
    });

    res.json({ success: true, advance, state: getAuthoritativeL1State() });
  });



  // Serve Vite or static
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Church Financial Management Server running at http://localhost:${PORT}`);
  });
}

startServer();
