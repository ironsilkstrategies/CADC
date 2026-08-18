/**
 * CADC staff roster.
 *
 * ⚠️ PRIVACY NOTE: Professional background only — no personal detail
 * (family, hobbies, personal life) unless a staff member specifically
 * requests it. The legacy site published spouses' names and children's
 * ages on a public page. We don't carry that forward by default.
 *
 * ⚠️ TITLE CONFLICT RESOLVED: The About page confirms Leslea Hixson as
 * Executive Director (since January 2024). Robin Harris is Director of
 * Head Start & Early Head Start. Verify once more before launch.
 *
 * All entries marked verified: false until CADC signs off.
 */

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  program: "head-start" | "agency" | "transit" | "weatherization" | "nutrition" | "community-market";
  bio?: string;
  tenure?: string;
  photo?: string;
  verified: boolean;
}

// ─── Agency leadership & administration ──────────────────────────────────────

export const agencyLeadership: StaffMember[] = [
  {
    id: "leslea-hixson",
    name: "Leslea Hixson",
    title: "Executive Director",
    program: "agency",
    tenure: "Since January 2024",
    bio:
      "Leslea holds a bachelor's degree in elementary education and a master's in education " +
      "administration, with 17 years in public education as a teacher and administrator. " +
      "She joined CADC as Head Start / Early Head Start Director before becoming Executive Director.",
    verified: false,
  },
  {
    id: "terry-collom",
    name: "Terry Collom",
    title: "Chief Financial Officer",
    program: "agency",
    tenure: "16 years with CADC",
    bio:
      "Terry holds a bachelor's degree in accounting from Cameron University and brings " +
      "27 years of accounting experience, including 10 years in private manufacturing.",
    verified: false,
  },
  {
    id: "marty-martin",
    name: "Marty Martin",
    title: "Purchasing Officer",
    program: "agency",
    tenure: "3 years with CADC",
    bio:
      "Marty holds a bachelor's degree in Christian Counseling from Calvary Theological " +
      "Seminary and an Associate in Computer Science from Cameron University, with 30 years " +
      "of accounting experience in the banking industry.",
    verified: false,
  },
  {
    id: "tiffany-camero",
    name: "Tiffany Camero",
    title: "Executive Secretary",
    program: "agency",
    tenure: "6 years with CADC",
    bio:
      "Tiffany is a U.S. Navy veteran who served 4 years on active duty and continues " +
      "to serve in the Navy Reserves. She attended Converse University and WOSC.",
    verified: false,
  },
  {
    id: "suzi-fletcher",
    name: "Suzi Fletcher",
    title: "Human Resources Director / Payroll Manager",
    program: "agency",
    tenure: "Since August 2023",
    bio:
      "Suzi holds a bachelor's and master's degree in accounting from Oklahoma State " +
      "University, with 28 years of experience across payroll, audit, cost, and financial " +
      "accounting in public and private sectors.",
    verified: false,
  },
  {
    id: "sarah-perez",
    name: "Sarah Perez",
    title: "Bookkeeper",
    program: "agency",
    tenure: "Since January 2023",
    bio:
      "Sarah holds an Associate's Degree in Business Administration and is working toward " +
      "a Bachelor's Degree in Accounting at NWOSU.",
    verified: false,
  },
];

// ─── Program directors ────────────────────────────────────────────────────────

export const programDirectors: StaffMember[] = [
  {
    id: "gilbert-nuncio",
    name: "Gilbert Nuncio",
    title: "Transit Director",
    program: "transit",
    tenure: "13 years with CADC",
    bio:
      "Gilbert joined Red River Transportation as a driver in 2014, was promoted to " +
      "Maintenance Supervisor in 2016, Route Supervisor in 2018, and has served as " +
      "Transit Director since 2021. He brings 8 years of public transportation experience.",
    verified: false,
  },
  {
    id: "robert-meador",
    name: "Robert Meador",
    title: "Weatherization & Housing Director",
    program: "weatherization",
    tenure: "Since September 1991",
    bio:
      "Robert began with CADC in 1991, became Housing Director in 1993, and was named " +
      "Weatherization Director in 1996. Over 35 years he has overseen the weatherization " +
      "of more than a thousand homes. He holds a bachelor's degree in Business Administration " +
      "plus associate degrees in Accounting and Economics, along with multiple state and " +
      "national licenses in Community and Economic Development, Environmental Compliance, " +
      "and Home Energy Performance.",
    verified: false,
  },
  {
    id: "kristie-jackson",
    name: "Kristie Jackson",
    title: "CSBG & Advantage Director",
    program: "agency",
    tenure: "Since January 2023",
    bio:
      "Kristie joined CADC as a Head Start teacher in September 2022 before moving into " +
      "her current role. She holds a bachelor's degree in business administration with a " +
      "specialty in Human Resource Management and previously served on the CADC Board of Directors.",
    verified: false,
  },
  {
    id: "laura-vardell",
    name: "Laura Vardell",
    title: "Senior Nutrition Director",
    program: "nutrition",
    tenure: "4 years with CADC",
    bio: "Laura oversees the Senior Congregate Meals and nutrition programs across the region.",
    verified: false,
  },
  {
    id: "scott-fraley",
    name: "Scott Fraley",
    title: "Community Market Director",
    program: "community-market",
    tenure: "Current",
    bio:
      "Scott brings more than 30 years of leadership across retail, merchandising, " +
      "materials management, and business ownership. Born and raised in Frederick, he " +
      "is deeply rooted in the community CADC serves.",
    verified: false,
  },
];

// ─── Head Start staff ─────────────────────────────────────────────────────────

export const headStartStaff: StaffMember[] = [
  {
    id: "robin-harris",
    name: "Robin Harris",
    title: "Director of Head Start & Early Head Start",
    program: "head-start",
    tenure: "Since October 2023",
    bio:
      "Robin holds a bachelor's degree in psychology with a minor in social work from " +
      "SWOSU. She brings 14 years with Great Plains Youth and Family Services and 8 years " +
      "with the OKDHS child welfare program.",
    verified: false,
  },
  {
    id: "karen-segler",
    name: "Karen Segler",
    title: "ERSEA / Volunteer / T&TA Coordinator",
    program: "head-start",
    tenure: "Since 1999",
    bio:
      "Karen is an ERSEA Credentialed Administrator, ChildPlus Administrator, and Red Cross " +
      "Instructor. She began at the center level and has served as On-Site Manager, Family " +
      "Service Worker, and Health, Safety and Nutrition Coordinator.",
    verified: false,
  },
  {
    id: "christy-glisson",
    name: "Christy Glisson",
    title: "Head Start Administrative Assistant",
    program: "head-start",
    tenure: "19 years with CADC",
    bio:
      "Christy studied business administration and has worked in the field for 30 years. " +
      "She first came to the program as an Early Head Start parent and served on the Policy Council.",
    verified: false,
  },
  {
    id: "dori-lientz",
    name: "Dori Lientz",
    title: "Health / Mental Health / Disabilities Coordinator",
    program: "head-start",
    bio: "Dori holds a bachelor's degree in English and has focused her career on work with children.",
    verified: false,
  },
  {
    id: "johnna-mann",
    name: "Johnna Mann",
    title: "Education Coordinator",
    program: "head-start",
    tenure: "Since 2016",
    bio:
      "Johnna is a Practice-Based Coach, CLASS observer, and Professional Development " +
      "Specialist. She holds a bachelor's degree in science, taught Pre-K at Grandfield for " +
      "five years, and has served as Education Coordinator since 2021.",
    verified: false,
  },
  {
    id: "tarra-harrison",
    name: "Tarra Harrison",
    title: "Parent, Family & Community Engagement Coordinator",
    program: "head-start",
    tenure: "10 years with CADC",
    bio:
      "Based in the Hobart office. Tarra previously served as On-Site Manager and Lead Teacher " +
      "at Burns Flat – Dill City, and has worked as a teacher's aide, lead teacher, nutrition " +
      "technician, and transit driver.",
    verified: false,
  },
  {
    id: "samantha-packard",
    name: "Samantha Packard",
    title: "Quality Assurance Coordinator",
    program: "head-start",
    tenure: "Since 2014",
    bio:
      "Sam began as a parent volunteer and Policy Council representative, spent her first year " +
      "in the classroom, then served as a Family Service Worker across Hammon, Erick, Sayre, " +
      "and Burns Flat / Dill City. She was promoted to Quality Assurance Coordinator in 2024.",
    verified: false,
  },
  {
    id: "frances-baker",
    name: "Frances Baker",
    title: "Nutrition & Supply Supervisor",
    program: "head-start",
    tenure: "Since 2022",
    bio: "Frances joined CADC as a Nutrition Technician and now supervises nutrition and supplies.",
    verified: false,
  },
];

// ─── Aggregates ───────────────────────────────────────────────────────────────

export const allStaff = [
  ...agencyLeadership,
  ...programDirectors,
  ...headStartStaff,
];

export const staffByProgram = (program: StaffMember["program"]) =>
  allStaff.filter((s) => s.program === program);
