/**
 * CADC staff roster.
 *
 * ⚠️ TWO ISSUES TO RESOLVE WITH CADC BEFORE THIS SHIPS:
 *
 * 1. TITLE CONFLICT. The legacy site lists BOTH Leslea Hixson and Robin Harris
 *    as "Director of Head Start & Early Head Start," and repeats Karen Segler's
 *    photo and bio twice. The signed proposal addresses Leslea as Executive
 *    Director and Robin as Director of Head Start & Early Head Start. The
 *    proposal version is encoded below. CONFIRM DIRECTLY — do not publish a
 *    guess about someone's job title.
 *
 * 2. PRIVACY REVIEW. The legacy bios publish staff members' spouses, children's
 *    names, and in at least one case the first names and ages of minor children.
 *    That is a real exposure on a public site, and it is not something to carry
 *    forward by default. The `bio` field below holds PROFESSIONAL background
 *    only. Ask each staff member whether they want personal detail included
 *    before adding any back. Defaulting to less is the right call here.
 */

export interface StaffMember {
  id: string;
  name: string;
  title: string;
  program: "head-start" | "agency";
  /** Professional background only — see privacy note above. */
  bio?: string;
  tenure?: string;
  photo?: string;
  /** True once CADC has confirmed name, title, and bio copy. */
  verified: boolean;
}

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

// ─── Agency leadership ───────────────────────────────────────────────────────
// Per the signed proposal. See title conflict note above.

export const agencyLeadership: StaffMember[] = [
  {
    id: "leslea-hixson",
    name: "Leslea Hixson",
    title: "Executive Director",
    program: "agency",
    bio:
      "Leslea holds a bachelor's degree in elementary education and a master's in education " +
      "administration, with 17 years in public education as a teacher and administrator.",
    verified: false,
  },
];

export const allStaff = [...agencyLeadership, ...headStartStaff];
