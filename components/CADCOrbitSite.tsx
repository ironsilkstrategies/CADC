/**
 * CADC Orbit Site — Full orbit-native shell
 * v2.00 — complete architectural rebuild
 *
 * Mobile:  white surface, centered orbit, bottom-sheet content panels
 * Desktop: deep-space dark viewport, particle field, split-panel layout
 *          left 40% orbit | right 60% content materialization
 *
 * Interaction model:
 *   Stage 0 → logo assembly animation (1.2s)
 *   Stage 1 → Main orbit  (8 program nodes)
 *   Stage 2 → Program orbit (sub-area nodes)
 *   Stage 3 → Content panel
 *   Back navigation collapses through stages
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  blue:        "#0101FF",
  blueDark:    "#0000B8",
  blueLight:   "#E4E4FF",
  maroon:      "#7E0001",
  maroonDark:  "#5C0001",
  void:        "#000014",
  ghost:       "#F8F8FF",
  surface:     "#ffffff",
  border:      "#e5e7eb",
  textPrimary: "#111827",
  textMuted:   "#6b7280",
};

// ─── All program content ──────────────────────────────────────────────────────

interface SubArea {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  content: React.ReactNode;
}

interface ProgramData {
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  tagline: string;
  subAreas: SubArea[];
}

const PROGRAMS: ProgramData[] = [
  // ── 1. HEAD START ──────────────────────────────────────────────────────────
  {
    slug: "head-start",
    name: "Head Start & Early Head Start",
    shortName: "Head Start",
    icon: "🏫",
    color: T.blue,
    tagline: "Free early childhood education across 11 centers",
    subAreas: [
      {
        id: "ehs", label: "Early Head Start", shortLabel: "EHS", icon: "🤱",
        content: (
          <div className="cadc-content">
            <p>Early Head Start serves pregnant women, expectant families, and children from birth to age 3. Home visits, center-based care, and family support starting before birth.</p>
            <div className="cadc-card">
              <p className="cadc-label">Provided at no cost while children are in care</p>
              <ul className="cadc-list">
                {["Formula for infants","Diapers","Wipes","Nutritious meals and snacks","Developmental support and screenings"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "hs", label: "Head Start Preschool", shortLabel: "Preschool", icon: "📖",
        content: (
          <div className="cadc-content">
            <p>Head Start serves children ages 3–5 with full-day, full-year preschool at no cost to income-eligible families. Every child receives education, health, nutrition, and family support.</p>
            <div className="cadc-grid-2">
              {["Full-day preschool at no cost","Health & dental screenings","Nutritious meals daily","Family engagement","School readiness curriculum","Individualized learning goals"].map(i=><div key={i} className="cadc-chip">{i}</div>)}
            </div>
          </div>
        ),
      },
      {
        id: "apply", label: "How to Apply", shortLabel: "Apply", icon: "📝",
        content: (
          <div className="cadc-content">
            <p>Enrollment is open year-round. Applications are reviewed on a rolling basis — spaces fill quickly. Apply as early as possible.</p>
            <div className="cadc-card">
              <p className="cadc-label">What you'll need</p>
              <ul className="cadc-list">
                {["Birth certificate or other proof of birth","Proof of residency (utility bill or address document)","Proof of SNAP, SSI, or TANF benefits (if applicable)","SoonerCare or private insurance information","Proof of income if you do not receive SNAP benefits","Immunization record","Proof of disability or special services (Speech, PT, OT)","Foster care document (if applicable)"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <p className="cadc-note">This program is provided at no cost to the parent or guardian.</p>
            <a href="https://childplus.com" target="_blank" rel="noopener noreferrer" className="cadc-btn">Start Application (ChildPlus) →</a>
          </div>
        ),
      },
      {
        id: "enrollment", label: "Who Qualifies", shortLabel: "Qualifies", icon: "✅",
        content: (
          <div className="cadc-content">
            <p>Head Start and Early Head Start serve pregnant mothers and children from birth to 5 years old. Priority is given to families with the greatest need.</p>
            <div className="cadc-card">
              <p className="cadc-label">Qualifying circumstances include</p>
              <ul className="cadc-list">
                {["Children in foster care","Families receiving SNAP, SSI, or TANF","Families with income below the federal poverty guidelines","Families who are unhoused or sharing housing","Children on a safety plan","Children with disabilities (IEP or IFSP)","Families where housing and utility bills exceed 30% of income","Families receiving Public Assistance"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: "education", label: "Education", shortLabel: "Education", icon: "📚",
        content: (
          <div className="cadc-content">
            <p>Our education program uses <strong>Frog Street</strong>, a credential-based curriculum designed specifically for early childhood. Every classroom follows structured lesson plans aligned to each child's individual developmental goals.</p>
            <div className="cadc-stack">
              {[
                {t:"45-Day Developmental Screenings",d:"Every child is screened within the first 45 days — identifying strengths and areas for support early."},
                {t:"Individualized Goals",d:"Lesson plans are set for each child based on where they are developmentally."},
                {t:"Frog Street Curriculum",d:"Nationally recognized, credential-based curriculum focused on language, literacy, math, and social-emotional development."},
                {t:"Classroom Facebook Pages",d:"Each classroom has a private Facebook page where families can see photos, events, and updates."},
              ].map(i=><div key={i.t} className="cadc-card-sm"><p className="cadc-card-title">{i.t}</p><p>{i.d}</p></div>)}
            </div>
          </div>
        ),
      },
      {
        id: "health", label: "Health & Wellness", shortLabel: "Health", icon: "🏥",
        content: (
          <div className="cadc-content">
            <p>Every enrolled child receives comprehensive health services. Our Health, Mental Health, and Disabilities Coordinator ensures every child's needs are documented and met.</p>
            <div className="cadc-stack">
              {[
                {t:"Medical Protocols",d:"Children with conditions such as asthma must have an inhaler on-site. All medical needs are documented and staff trained."},
                {t:"Allergy Management",d:"Food allergies require a doctor's note specifying the allergy and approved substitutes."},
                {t:"Vision, Dental & Hearing",d:"Screenings completed within program timelines. Referrals made when follow-up care is needed."},
                {t:"Mental Health Support",d:"Integrated into the classroom and available to families. We partner with mental health professionals."},
                {t:"Disabilities Services",d:"Up to 10% of enrollment reserved for children with disabilities. We coordinate with school districts and specialists."},
              ].map(i=><div key={i.t} className="cadc-card-sm"><p className="cadc-card-title">{i.t}</p><p>{i.d}</p></div>)}
            </div>
          </div>
        ),
      },
      {
        id: "nutrition", label: "Nutrition", shortLabel: "Nutrition", icon: "🥗",
        content: (
          <div className="cadc-content">
            <p>All meals meet <strong>CACFP (Child and Adult Care Food Program)</strong> requirements — a federal nutrition standard ensuring balanced, age-appropriate meals every day.</p>
            <ul className="cadc-list">
              {["Breakfast, lunch, and snacks served daily at no cost","Menus planned by nutrition staff to meet CACFP standards","Age-appropriate portions and food groups","Formula, diapers, and wipes provided for Early Head Start infants","Allergy accommodations with doctor's documentation","Family nutrition education and resources"].map(i=><li key={i}>{i}</li>)}
            </ul>
          </div>
        ),
      },
      {
        id: "getinvolved", label: "Get Involved", shortLabel: "Volunteer", icon: "🤝",
        content: (
          <div className="cadc-content">
            <p>Head Start strongly believes that parents and the whole community must be involved for children's experiences to have a lasting impact. Studies show children are most successful when parents are involved.</p>
            <div className="cadc-card">
              <p className="cadc-label">What is In-Kind?</p>
              <p>Each year, Head Start must match a portion of the federal grant through donations of time, services, and goods. This is how we operate at no cost to families. Your time has real monetary value to our program.</p>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Ways to help</p>
              <ul className="cadc-list">
                {["Assist with handwashing and daily routines","Sit and eat with the children","Help with cleaning tables and play areas","Participate during large and small group time","Join outdoor activities and field trips","Cut out and prepare classroom materials","Help decorate bulletin boards","Share a hobby, talent, or cultural tradition","Be a mystery reader — surprise your child's class","Complete monthly Learning at Home activities","Assist staff with repairs, painting, or yard work"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <p className="cadc-note">Contact your nearest center to learn how to schedule a visit or volunteer.</p>
            <div className="cadc-card">
              <p className="cadc-label">Donations — Coming Soon</p>
              <p>CADC is setting up online donation options including Amazon Smile, Walmart Community, and Shop Raise. Check back soon or call us to express interest in supporting a classroom directly.</p>
            </div>
          </div>
        ),
      },
      {
        id: "safety", label: "Safety & Training", shortLabel: "Safety", icon: "🛡️",
        content: (
          <div className="cadc-content">
            <p>Safety is embedded in every aspect of our program. Centers meet all Oklahoma Child Care Licensing (OKDHS) requirements and follow federal Head Start Program Performance Standards (45 CFR §1302.47).</p>
            <div className="cadc-stack">
              {[
                {t:"Staff Training",d:"All staff complete training in child safety, emergency procedures, mandated reporting, Emergency Preparedness, Active Supervision, and program protocols. Teachers must obtain a Child Development Associate (CDA) credential within 6–12 months of hire."},
                {t:"Safe Environments",d:"Centers undergo Environmental Health and Safety checks every other month. Daily safety checks are conducted in classrooms, playgrounds, and pick-up/drop-off areas. Indoor and outdoor environments meet CPSC/ASTM standards."},
                {t:"Emergency Procedures",d:"Each center maintains a current all-hazards emergency preparedness plan covering fire, severe weather, lockdowns, medical emergencies, and utility outages. Monthly drills are conducted with staff and children."},
              ].map(i=><div key={i.t} className="cadc-card-sm"><p className="cadc-card-title">{i.t}</p><p>{i.d}</p></div>)}
            </div>
          </div>
        ),
      },
      {
        id: "faq", label: "FAQs", shortLabel: "FAQ", icon: "❓",
        content: (
          <div className="cadc-content">
            <p>Answers to the questions families ask us every day.</p>
            <div className="cadc-stack">
              {[
                {q:"Who qualifies for Early Head Start and Head Start?",a:"EHS serves pregnant mothers and children birth to 3. Head Start serves children ages 3–5. Priority is given to families receiving SNAP, SSI, TANF, or Public Assistance; children in foster care; children on safety plans; children with disabilities; unhoused families; and families whose housing costs exceed 30% of income."},
                {q:"What do I need to bring to apply?",a:"Birth certificate or proof of birth, proof of residency, proof of SNAP/SSI/TANF if applicable, SoonerCare or insurance info, proof of income if no SNAP, immunization record, proof of disability or special services if applicable, and foster care documents if applicable."},
                {q:"Are children with disabilities or special needs accepted?",a:"Yes. Up to 10% of enrollment is reserved for children with disabilities regardless of income. We coordinate with school districts and specialists to provide appropriate services through an IEP or IFSP."},
                {q:"Can parents apply to work at CADC Head Start?",a:"Yes. CADC actively hires from the communities we serve. View open positions on the CADC Facebook page or call 580-335-5588."},
                {q:"How can parents volunteer in the classroom?",a:"Contact your child's center to schedule a visit. Parents can help with handwashing, meals, group time, outdoor activities, bulletin boards, reading, sharing talents, cultural celebrations, and more. Every hour you volunteer counts as an in-kind contribution to the program."},
                {q:"What should I expect during a home visit?",a:"Home visits are regular for Early Head Start families and available as needed for Head Start families. Your Family Service Worker will work with you on goals, connect you to resources, and discuss your child's development."},
                {q:"How does Head Start support my child's health?",a:"Every child receives vision, hearing, and dental screenings. Health needs are documented and monitored by our Health Coordinator. Mental health support is available to children and families. Children with conditions such as asthma must have an inhaler on-site."},
                {q:"What if my child has allergies or special dietary needs?",a:"A doctor's note is required specifying the allergy and approved food substitutes. Centers maintain allergy records for every enrolled child and accommodate needs through our CACFP-compliant meal program."},
                {q:"I need a new parent handbook or school calendar. What do I do?",a:"Contact your child's center directly. Each center can provide current handbooks and calendars. You can also find updates through your classroom's private Facebook page."},
              ].map(item => (
                <div key={item.q} className="cadc-card-sm">
                  <p className="cadc-card-title">{item.q}</p>
                  <p>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 2. TRANSIT ─────────────────────────────────────────────────────────────
  {
    slug: "transit",
    name: "Red River Transportation",
    shortName: "Transit",
    icon: "🚌",
    color: T.blue,
    tagline: "110 vehicles · ADA equipped · 12 counties",
    subAreas: [
      {
        id: "rides", label: "Schedule a Ride", shortLabel: "Schedule", icon: "📅",
        content: (
          <div className="cadc-content">
            <p>Red River Transportation provides rural public transit across Southwest Oklahoma. Call to schedule rides to medical appointments, dialysis, work, shopping, and more.</p>
            <div className="cadc-card">
              <p className="cadc-label">Toll-free scheduling</p>
              <a href="tel:+18005245552" className="cadc-btn">📞 1-800-524-5552</a>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Counties served</p>
              <p>Beckham · Caddo · Canadian · Comanche · Cotton · Custer · Jefferson · Kiowa · Roger Mills · Stephens · Tillman · Washita</p>
              <p className="cadc-note">Canadian County: no in-town service for Mustang or Yukon. Comanche County: no in-town service for Lawton.</p>
            </div>
          </div>
        ),
      },
      {
        id: "fares", label: "Fare Schedule", shortLabel: "Fares", icon: "💲",
        content: (
          <div className="cadc-content">
            <p>Fares are calculated on round-trip mileage. Reduced fares apply to riders age 55+ and persons with disabilities. Effective October 1, 2022.</p>
            <div className="cadc-fare-table">
              <div className="cadc-fare-header"><span>Distance</span><span>Standard</span><span>Reduced</span></div>
              {[
                ["1–10 miles","$8.00","$8.00"],
                ["11–30 miles","$15.00","$15.00"],
                ["31–50 miles","$30.00","$20.00"],
                ["51–100 miles","$45.00","$30.00"],
                ["101–150 miles","$60.00","$40.00"],
                ["151–249 miles","$80.00","$60.00"],
                ["250+ miles","$0.40/mi","$0.40/mi"],
                ["Wait time","$10.00/hr","$10.00/hr"],
              ].map(r=><div key={r[0]} className="cadc-fare-row"><span>{r[0]}</span><span>{r[1]}</span><span>{r[2]}</span></div>)}
            </div>
            <p className="cadc-note">Wait time charged after the first hour. All vehicles are ADA lift or ramp equipped.</p>
          </div>
        ),
      },
      {
        id: "offices", label: "Office Locations", shortLabel: "Offices", icon: "📍",
        content: (
          <div className="cadc-content">
            <div className="cadc-stack">
              {[
                {name:"Frederick Office",addr:"105 S. Main, Frederick, OK 73542",phone:"580-335-5588",href:"tel:+15803355588"},
                {name:"Sayre Office",addr:"304 W. Main, Sayre, OK 73662",phone:"580-928-2199",href:"tel:+15809282199"},
                {name:"Ryan Office",addr:"400 Taylor & Main, Ryan, OK 73565",phone:"580-757-2235",href:"tel:+15807572235"},
              ].map(o=>(
                <div key={o.name} className="cadc-card-sm">
                  <p className="cadc-card-title">{o.name}</p>
                  <p>{o.addr}</p>
                  <a href={o.href} className="cadc-link">{o.phone}</a>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "ada", label: "ADA & Accessibility", shortLabel: "ADA", icon: "♿",
        content: (
          <div className="cadc-content">
            <p>All 110 Red River Transportation vehicles are equipped with lifts or ramps. No rider is turned away due to a mobility device or disability.</p>
            <div className="cadc-card">
              <p className="cadc-label">Title VI Non-Discrimination</p>
              <p>Red River Transportation does not discriminate on the basis of race, color, or national origin. For Title VI information or to file a complaint, contact the Frederick office.</p>
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 3. WEATHERIZATION ──────────────────────────────────────────────────────
  {
    slug: "weatherization",
    name: "Weatherization & Housing",
    shortName: "Weatherization",
    icon: "🏠",
    color: T.blue,
    tagline: "Free home energy improvements for qualifying households",
    subAreas: [
      {
        id: "what", label: "What We Do", shortLabel: "Overview", icon: "🔧",
        content: (
          <div className="cadc-content">
            <p>The Weatherization Assistance Program (WAP) provides free home energy improvements to income-eligible households. Funded through the Department of Energy and Oklahoma DHS.</p>
            <div className="cadc-grid-2">
              {["Insulation installation","Air sealing","Heating & cooling system upgrades","Energy audits","Window and door improvements","Health and safety measures"].map(i=><div key={i} className="cadc-chip">{i}</div>)}
            </div>
          </div>
        ),
      },
      {
        id: "apply-weath", label: "Apply", shortLabel: "Apply", icon: "📝",
        content: (
          <div className="cadc-content">
            <p>Applications are submitted online through the Oklahoma Weatherization portal. The process typically includes an energy audit of your home before work begins.</p>
            <div className="cadc-card">
              <p className="cadc-label">Apply online</p>
              <a href="https://ok.mywaplink.org" target="_blank" rel="noopener noreferrer" className="cadc-btn">Oklahoma WAP Portal →</a>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Questions?</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
      {
        id: "eligibility-weath", label: "Eligibility", shortLabel: "Eligible?", icon: "✅",
        content: (
          <div className="cadc-content">
            <p>Eligibility is based on household income. Priority is given to elderly residents, people with disabilities, and families with young children.</p>
            <div className="cadc-card">
              <p className="cadc-label">General eligibility</p>
              <ul className="cadc-list">
                {["Income at or below 200% of federal poverty guidelines","Own or rent your primary residence","Priority for households with elderly members 60+","Priority for households with children under 6","Priority for persons with disabilities"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 4. SENIOR MEALS ────────────────────────────────────────────────────────
  {
    slug: "senior-meals",
    name: "Senior Nutrition",
    shortName: "Senior Meals",
    icon: "🍽️",
    color: T.blue,
    tagline: "Hot meals, community connection, and home delivery",
    subAreas: [
      {
        id: "congregate", label: "Congregate Meals", shortLabel: "Congregate", icon: "🍽️",
        content: (
          <div className="cadc-content">
            <p>Hot, nutritious meals served at community sites across Southwest Oklahoma. More than just food — a daily gathering point for seniors.</p>
            <div className="cadc-stack">
              {[
                {name:"Frederick",addr:"Frederick, OK"},
                {name:"Ryan",addr:"Ryan, OK"},
                {name:"Ringling",addr:"Ringling, OK"},
                {name:"Temple",addr:"Temple, OK"},
                {name:"Cache",addr:"Cache, OK"},
              ].map(s=><div key={s.name} className="cadc-card-sm"><p className="cadc-card-title">{s.name}</p><p>{s.addr}</p></div>)}
            </div>
            <div className="cadc-card">
              <p className="cadc-label">More information</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
      {
        id: "advantage", label: "Home Delivered Meals", shortLabel: "Home Delivery", icon: "🚗",
        content: (
          <div className="cadc-content">
            <p>CADC Advantage provides home-delivered meals to older adults and individuals with disabilities through the Advantage, Living Choice, and Medically Fragile waiver programs.</p>
            <div className="cadc-card">
              <p className="cadc-label">Eligibility</p>
              <ul className="cadc-list">
                {["SoonerCare (Medicaid) qualified","Meet medical Level of Care (LOC) criteria","Age 65+ or age 19–64 with intellectual, physical, or developmental disabilities, or cognitive impairment"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">How it works</p>
              <ul className="cadc-list">
                {["Meals delivered every two weeks","14 meals or 28 meals per delivery depending on your plan","Each shelf-stable box contains 7 meals","Fresh milk and/or juice included with each delivery","Frozen and shelf-stable options available"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Apply or get help</p>
              <a href="tel:+18009877767" className="cadc-btn">📞 1-800-987-7767</a>
              <p className="cadc-note">Or call 405-522-5050</p>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Office locations</p>
              <div className="cadc-stack">
                {[
                  {n:"Sentinel — Emily Correll",p:"580-393-2216",addr:"122 S. 3rd Butler Building, Sentinel, OK 73664"},
                  {n:"Temple — Danya Brinson",p:"580-342-6967",addr:"102 West Texas, Temple, OK 73568"},
                  {n:"Lawton — Kristie Jackson",p:"580-699-8880",addr:"802 SW A Ave, Suite B, Lawton, OK 73501"},
                ].map(o=><div key={o.n} className="cadc-card-sm"><p className="cadc-card-title">{o.n}</p><p>{o.addr}</p><a href={`tel:+1${o.p.replace(/\D/g,"")}`} className="cadc-link">{o.p}</a></div>)}
              </div>
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 5. TAX HELP ────────────────────────────────────────────────────────────
  {
    slug: "tax-help",
    name: "VITA Free Tax Help",
    shortName: "Tax Help",
    icon: "📋",
    color: T.blue,
    tagline: "Free IRS-certified tax prep — no cost, no fees",
    subAreas: [
      {
        id: "vita-what", label: "About VITA", shortLabel: "About", icon: "ℹ️",
        content: (
          <div className="cadc-content">
            <p>The Volunteer Income Tax Assistance (VITA) program offers free tax preparation by IRS-certified volunteers to individuals and families who generally make $67,000 or less.</p>
            <div className="cadc-grid-2">
              {["$0 filing cost","IRS-certified volunteers","Federal and state returns","EITC maximization","No hidden fees","Secure and confidential"].map(i=><div key={i} className="cadc-chip">{i}</div>)}
            </div>
          </div>
        ),
      },
      {
        id: "vita-bring", label: "What to Bring", shortLabel: "Bring", icon: "📎",
        content: (
          <div className="cadc-content">
            <div className="cadc-card">
              <p className="cadc-label">Required documents</p>
              <ul className="cadc-list">
                {["Photo ID for all adults","Social Security cards for everyone on the return","All W-2, 1099, and income forms","Last year's tax return (if available)","Bank account and routing number for direct deposit","Health insurance information (1095-A if you had Marketplace coverage)","Childcare provider name, address, and tax ID (if applicable)"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Find a site</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 6. COMMUNITY MARKET ────────────────────────────────────────────────────
  {
    slug: "community-market",
    name: "Community Market",
    shortName: "Market",
    icon: "🛒",
    color: T.blue,
    tagline: "Building food access across Southwest Oklahoma",
    subAreas: [
      {
        id: "market-about", label: "About the Market", shortLabel: "About", icon: "ℹ️",
        content: (
          <div className="cadc-content">
            <p>CADC's Community Market is an emerging program expanding food access across the region. We're building this program based directly on what our communities tell us they need.</p>
            <div className="cadc-card">
              <p className="cadc-label">Focus areas</p>
              <div className="cadc-grid-2">
                {["Fresh produce access","Food pantry networks","Nutrition education","Community garden support"].map(i=><div key={i} className="cadc-chip">{i}</div>)}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "market-survey", label: "Community Survey", shortLabel: "Survey", icon: "📊",
        content: (
          <div className="cadc-content">
            <p>This program is built around your input. Take the Community Needs Survey and tell us what your community is missing.</p>
            <a href="https://www.surveymonkey.com/r/26cadcneeds" target="_blank" rel="noopener noreferrer" className="cadc-btn">Take the Survey →</a>
          </div>
        ),
      },
    ],
  },

  // ── 7. EMPLOYMENT ──────────────────────────────────────────────────────────
  {
    slug: "employment",
    name: "Employment & Workforce",
    shortName: "Employment",
    icon: "💼",
    color: T.blue,
    tagline: "Join the CADC team across Southwest Oklahoma",
    subAreas: [
      {
        id: "jobs", label: "Open Positions", shortLabel: "Jobs", icon: "📋",
        content: (
          <div className="cadc-content">
            <p>CADC has positions across multiple programs — Head Start, transit, weatherization, administration, and more. We serve 9 counties and our team reflects the communities we're in.</p>
            <div className="cadc-card">
              <p className="cadc-label">View current openings</p>
              <a href="https://www.facebook.com/cadcok" target="_blank" rel="noopener noreferrer" className="cadc-btn">CADC on Facebook →</a>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Or call us directly</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
      {
        id: "why", label: "Why CADC", shortLabel: "Why CADC", icon: "⭐",
        content: (
          <div className="cadc-content">
            <p>Working at CADC means showing up every day for the people in your community who need it most — children, seniors, families navigating hard times.</p>
            <div className="cadc-grid-2">
              {["Mission-driven work","Benefits package","Community impact","Professional development","Stable employment","Regional reach"].map(i=><div key={i} className="cadc-chip">{i}</div>)}
            </div>
          </div>
        ),
      },
    ],
  },

  // ── 8. BOARD & LEADERSHIP ─────────────────────────────────────────────────
  {
    slug: "board",
    name: "Board & Leadership",
    shortName: "Leadership",
    icon: "⚖️",
    color: T.blue,
    tagline: "Governance, Policy Council, and agency leadership",
    subAreas: [
      {
        id: "leadership", label: "Agency Leadership", shortLabel: "Leadership", icon: "👤",
        content: (
          <div className="cadc-content">
            <div className="cadc-stack">
              {[
                {n:"Leslea Hixson",t:"Executive Director"},
                {n:"Robin Harris",t:"Director, Head Start & Early Head Start"},
                {n:"Kristie Jackson",t:"Advantage Director"},
              ].map(p=><div key={p.n} className="cadc-card-sm"><p className="cadc-card-title">{p.n}</p><p>{p.t}</p></div>)}
            </div>
          </div>
        ),
      },
      {
        id: "board-members", label: "Board of Directors", shortLabel: "Board", icon: "🏛️",
        content: (
          <div className="cadc-content">
            <p>CADC is governed by a Board of Directors representing the communities we serve across Southwest Oklahoma.</p>
            <div className="cadc-card">
              <p className="cadc-label">Board information coming soon</p>
              <p>Contact us for board meeting schedules and governance documents.</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
      {
        id: "policy-council", label: "Policy Council", shortLabel: "Policy Council", icon: "📋",
        content: (
          <div className="cadc-content">
            <p>The Head Start Policy Council is a governing body that includes parents of currently enrolled children and community representatives. Policy Council members have a real voice in how the program operates.</p>
            <div className="cadc-card">
              <p className="cadc-label">Parent involvement in governance</p>
              <ul className="cadc-list">
                {["Approve the Head Start budget","Review and approve program policies","Participate in hiring decisions","Advocate for families and children","Serve on Sub Committees"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Get involved</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
      {
        id: "about-cadc", label: "About CADC", shortLabel: "About", icon: "🏢",
        content: (
          <div className="cadc-content">
            <p>Community Action Development Corporation (CADC) has been serving Southwest Oklahoma families since 1966. We are a private, non-profit Community Action Agency and Community Action Partnership member.</p>
            <div className="cadc-card">
              <p className="cadc-label">Main office</p>
              <p>105 S. Main Street · P.O. Box 989<br/>Frederick, OK 73542</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
    ],
  },
// ── 9. ADVANTAGE HOME DELIVERED MEALS ─────────────────────────────────────
  {
    slug: "advantage",
    name: "Advantage Home Delivered Meals",
    shortName: "Advantage",
    icon: "🚗",
    color: T.blue,
    tagline: "Home-delivered meals for seniors & adults with disabilities",
    subAreas: [
      {
        id: "adv-about", label: "About the Program", shortLabel: "About", icon: "ℹ️",
        content: (
          <div className="cadc-content">
            <p>CADC Advantage provides home-delivered meals to older adults and individuals with disabilities through Oklahoma Medicaid waiver programs — Advantage, Living Choice, and Medically Fragile.</p>
            <p>Meals are delivered every two weeks. Members may receive 14 or 28 meals per delivery, plus fresh milk and juice. Both frozen and shelf-stable meal options are available.</p>
            <div className="cadc-card">
              <p className="cadc-label">17 counties served</p>
              <p>Beckham · Caddo · Canadian · Comanche · Cotton · Custer · Grady · Greer · Harmon · Jackson · Jefferson · Kiowa · McClain · Roger Mills · Stephens · Tillman · Washita</p>
            </div>
          </div>
        ),
      },
      {
        id: "adv-eligibility", label: "Eligibility", shortLabel: "Eligible?", icon: "✅",
        content: (
          <div className="cadc-content">
            <p>To receive Advantage Home Delivered Meals, applicants must meet all of the following criteria:</p>
            <div className="cadc-card">
              <ul className="cadc-list">
                {["Be financially qualified for SoonerCare (Medicaid)","Meet medical Level of Care (LOC) criteria","Be at least age 65, OR be age 19–64 with an intellectual or developmental disability, physical or other disability, or cognitive impairment related to a developmental disability"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">To apply or get help</p>
              <a href="tel:+18009877767" className="cadc-btn">📞 1-800-987-7767</a>
              <p className="cadc-note">Or call 405-522-5050</p>
            </div>
          </div>
        ),
      },
      {
        id: "adv-meals", label: "Meal Options", shortLabel: "Meals", icon: "🍱",
        content: (
          <div className="cadc-content">
            <p>Members choose from a rotating selection of frozen and shelf-stable meals designed to meet nutritional needs. Fresh milk and juice are included with every delivery.</p>
            <div className="cadc-card">
              <p className="cadc-label">Delivery schedule</p>
              <ul className="cadc-list">
                {["Meals delivered every two weeks","14-meal plan: 2 half-gallons of milk or juice per delivery","28-meal plan: 4 half-gallons of milk or juice per delivery","Shelf-stable boxes contain 7 meals each","Members can mix frozen and shelf-stable meals"].map(i=><li key={i}>{i}</li>)}
              </ul>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Milk & juice options</p>
              <p>Whole milk, 2% milk, chocolate milk, buttermilk, almond milk (sweet, unsweetened, vanilla), orange juice, apple juice. Purchased through Braum's where available; local grocery partners used in other areas.</p>
            </div>
          </div>
        ),
      },
      {
        id: "adv-offices", label: "Office Locations", shortLabel: "Offices", icon: "📍",
        content: (
          <div className="cadc-content">
            <div className="cadc-stack">
              {[
                {n:"Sentinel — Emily Correll",addr:"122 S. 3rd Butler Building, Sentinel, OK 73664",p:"580-393-2216",href:"tel:+15803932216"},
                {n:"Temple — Danya Brinson",addr:"102 West Texas, Temple, OK 73568",p:"580-342-6967",href:"tel:+15803426967"},
                {n:"Lawton — Kristie Jackson",addr:"802 SW A Ave, Suite B, Lawton, OK 73501",p:"580-699-8880",href:"tel:+15806998880"},
              ].map(o=>(
                <div key={o.n} className="cadc-card-sm">
                  <p className="cadc-card-title">{o.n}</p>
                  <p>{o.addr}</p>
                  <a href={o.href} className="cadc-link">{o.p}</a>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "adv-donate", label: "Support & Donate", shortLabel: "Donate", icon: "❤️",
        content: (
          <div className="cadc-content">
            <p>CADC is exploring ways for community members and businesses to support our nutrition programs directly. Details coming soon — check back or contact us to express interest.</p>
            <div className="cadc-card">
              <p className="cadc-label">Coming soon</p>
              <p>Online donation options, Amazon Smile, Walmart Community, and Shop Raise are being set up. We'll update this page once logistics are confirmed.</p>
            </div>
            <div className="cadc-card">
              <p className="cadc-label">Questions? Contact us</p>
              <a href="tel:+15803355588" className="cadc-link">580-335-5588</a>
            </div>
          </div>
        ),
      },
    ],
  },

];

// ─── Geometry helpers ─────────────────────────────────────────────────────────

function orbitPos(i: number, total: number, radiusPct: number) {
  const angle = -90 + (i / total) * 360;
  const rad = (angle * Math.PI) / 180;
  return { x: 50 + radiusPct * Math.cos(rad), y: 50 + radiusPct * Math.sin(rad) };
}

// ─── Particle field (desktop) ─────────────────────────────────────────────────

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const PARTICLE_COUNT = 120;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let raf: number;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(1,1,255,${p.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ─── Main Orbit component ─────────────────────────────────────────────────────

type Stage = "main" | "program" | "content";

export default function CADCOrbitSite() {
  const [stage, setStage] = useState<Stage>("main");
  const [activeProgram, setActiveProgram] = useState<ProgramData | null>(null);
  const [activeSubArea, setActiveSubArea] = useState<SubArea | null>(null);
  const [glowNode, setGlowNode] = useState<string | null>(null);
  const [assembled, setAssembled] = useState(false);
  const isDesktop = useIsDesktop();

  // Logo assembly animation
  useEffect(() => {
    const t = setTimeout(() => setAssembled(true), 300);
    return () => clearTimeout(t);
  }, []);

  function tapProgram(prog: ProgramData) {
    setGlowNode(prog.slug);
    setTimeout(() => setGlowNode(null), 600);
    setTimeout(() => {
      setActiveProgram(prog);
      setActiveSubArea(null);
      setStage("program");
    }, 200);
  }

  function tapSubArea(area: SubArea) {
    setGlowNode(area.id);
    setTimeout(() => setGlowNode(null), 600);
    setTimeout(() => {
      setActiveSubArea(area);
      setStage("content");
    }, 200);
  }

  function goBack() {
    if (stage === "content") {
      setActiveSubArea(null);
      setStage("program");
    } else if (stage === "program") {
      setActiveProgram(null);
      setStage("main");
    }
  }

  if (isDesktop) {
    return <DesktopLayout
      stage={stage} activeProgram={activeProgram} activeSubArea={activeSubArea}
      glowNode={glowNode} assembled={assembled}
      tapProgram={tapProgram} tapSubArea={tapSubArea} goBack={goBack}
    />;
  }

  return <MobileLayout
    stage={stage} activeProgram={activeProgram} activeSubArea={activeSubArea}
    glowNode={glowNode} assembled={assembled}
    tapProgram={tapProgram} tapSubArea={tapSubArea} goBack={goBack}
  />;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

// ─── Shared props ─────────────────────────────────────────────────────────────

interface LayoutProps {
  stage: Stage;
  activeProgram: ProgramData | null;
  activeSubArea: SubArea | null;
  glowNode: string | null;
  assembled: boolean;
  tapProgram: (p: ProgramData) => void;
  tapSubArea: (a: SubArea) => void;
  goBack: () => void;
}

// ─── DESKTOP LAYOUT ───────────────────────────────────────────────────────────

function DesktopLayout({ stage, activeProgram, activeSubArea, glowNode, assembled, tapProgram, tapSubArea, goBack }: LayoutProps) {
  return (
    <div style={{ background: T.void, minHeight: "100vh", fontFamily: "'Space Grotesk', 'Inter', sans-serif", position: "relative", overflow: "hidden" }}>
      <ParticleField />

      {/* Utility nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 48px", borderBottom: "1px solid rgba(1,1,255,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏛️</div>
          <div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 14, letterSpacing: "0.05em" }}>CADC</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Community Action</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["About", "Contact", "580-335-5588"].map((item, i) => (
            <a key={item} href={i === 2 ? "tel:+15803355588" : `/${item.toLowerCase()}`}
              style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            >{item}</a>
          ))}
        </div>
      </nav>

      {/* Main split layout */}
      <div style={{ display: "flex", height: "100vh", paddingTop: 64 }}>

        {/* LEFT — Orbit panel */}
        <div style={{ width: "42%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>

          {/* Back button */}
          {stage !== "main" && (
            <button onClick={goBack} style={{
              position: "absolute", top: 24, left: 48, zIndex: 10,
              background: "rgba(1,1,255,0.15)", border: "1px solid rgba(1,1,255,0.3)",
              color: "rgba(255,255,255,0.8)", padding: "8px 18px", borderRadius: 8,
              fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer",
              textTransform: "uppercase", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(1,1,255,0.3)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(1,1,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
            >← Back</button>
          )}

          <DesktopOrbit
            stage={stage} activeProgram={activeProgram}
            glowNode={glowNode} assembled={assembled}
            tapProgram={tapProgram} tapSubArea={tapSubArea}
          />
        </div>

        {/* RIGHT — Content panel */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", borderLeft: "1px solid rgba(1,1,255,0.1)" }}>
          <DesktopContentPanel stage={stage} activeProgram={activeProgram} activeSubArea={activeSubArea} />
        </div>
      </div>

      <DesktopStyles />
    </div>
  );
}

function DesktopOrbit({ stage, activeProgram, glowNode, assembled, tapProgram, tapSubArea }: {
  stage: Stage; activeProgram: ProgramData | null; glowNode: string | null;
  assembled: boolean; tapProgram: (p: ProgramData) => void; tapSubArea: (a: SubArea) => void;
}) {
  const programs = PROGRAMS;
  const subAreas = activeProgram?.subAreas ?? [];
  const items = stage === "main" ? programs : subAreas;
  const RADIUS = 38;
  const SIZE = "min(80vw,420px)";

  return (
    <div style={{ width: SIZE, aspectRatio: "1/1", position: "relative" }}>
      {/* Outer glow ring */}
      <div style={{
        position: "absolute", inset: "8%", borderRadius: "50%",
        border: "1px solid rgba(1,1,255,0.2)",
        boxShadow: "0 0 60px rgba(1,1,255,0.08), inset 0 0 60px rgba(1,1,255,0.04)",
      }} />

      {/* SVG connectors */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 100 100" aria-hidden="true">
        {items.map((item, i) => {
          const { x, y } = orbitPos(i, items.length, RADIUS);
          const isActive = stage === "main"
            ? (item as ProgramData).slug === glowNode
            : (item as SubArea).id === glowNode;
          return (
            <line key={i} x1={50} y1={50} x2={x} y2={y}
              stroke={isActive ? "rgba(1,1,255,0.8)" : "rgba(1,1,255,0.15)"}
              strokeWidth={isActive ? 1.5 : 0.6}
              strokeDasharray="2 3"
              style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
            />
          );
        })}
      </svg>

      {/* Center hub */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        width: "clamp(72px,16%,88px)", aspectRatio: "1/1",
        borderRadius: "50%", background: T.void,
        border: `2px solid ${T.blue}`,
        boxShadow: `0 0 0 8px rgba(1,1,255,0.06), 0 0 40px rgba(1,1,255,0.3)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 2,
      }}>
        {stage === "main" ? (
          <>
            <span style={{ fontSize: "clamp(1rem,2.5vw,1.4rem)" }}>🏛️</span>
            <span style={{ color: T.blue, fontSize: "clamp(0.35rem,0.8vw,0.5rem)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>CADC</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: "clamp(1rem,2.5vw,1.4rem)" }}>{activeProgram?.icon}</span>
            <span style={{ color: T.blue, fontSize: "clamp(0.32rem,0.7vw,0.42rem)", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center", padding: "0 4px", lineHeight: 1.2 }}>{activeProgram?.shortName}</span>
          </>
        )}
      </div>

      {/* Nodes */}
      {items.map((item, i) => {
        const { x, y } = orbitPos(i, items.length, RADIUS);
        const prog = item as ProgramData;
        const sub = item as SubArea;
        const id = stage === "main" ? prog.slug : sub.id;
        const label = stage === "main" ? prog.shortName : sub.shortLabel;
        const icon = stage === "main" ? prog.icon : sub.icon;
        const isGlowing = id === glowNode;
        const delay = assembled ? 0 : i * 80;

        return (
          <button
            key={id}
            onClick={() => stage === "main" ? tapProgram(prog) : tapSubArea(sub)}
            aria-label={stage === "main" ? prog.name : sub.label}
            style={{
              position: "absolute",
              left: `${x}%`, top: `${y}%`,
              width: "clamp(52px,11%,68px)",
              transform: "translate(-50%,-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
              background: "none", border: "none", cursor: "pointer", padding: 0,
              opacity: assembled ? 1 : 0,
              transition: `opacity 0.5s ease ${delay}ms, transform 0.3s ease`,
            }}
            onMouseEnter={e => { (e.currentTarget.querySelector(".node-disc") as HTMLElement).style.transform = "scale(1.15)"; }}
            onMouseLeave={e => { (e.currentTarget.querySelector(".node-disc") as HTMLElement).style.transform = "scale(1)"; }}
          >
            {isGlowing && (
              <div style={{
                position: "absolute", inset: -12, borderRadius: "50%",
                background: `radial-gradient(circle, rgba(1,1,255,0.4) 0%, transparent 70%)`,
                animation: "desktopPing 0.6s ease-out forwards",
                pointerEvents: "none",
              }} />
            )}
            <div className="node-disc" style={{
              width: "clamp(40px,8.5%,54px)", aspectRatio: "1/1",
              borderRadius: "50%", background: T.void,
              border: `2px solid ${T.blue}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "clamp(0.9rem,2vw,1.2rem)",
              boxShadow: `0 0 16px rgba(1,1,255,0.25), inset 0 0 12px rgba(1,1,255,0.08)`,
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}>
              {icon}
            </div>
            <span style={{
              color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.38rem,0.85vw,0.52rem)",
              fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
              textAlign: "center", lineHeight: 1.2, whiteSpace: "nowrap",
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DesktopContentPanel({ stage, activeProgram, activeSubArea }: { stage: Stage; activeProgram: ProgramData | null; activeSubArea: SubArea | null }) {
  if (stage === "main") {
    return (
      <div style={{ maxWidth: 520, color: "white" }}>
        <p style={{ color: T.blue, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Helping People. Changing Lives.</p>
        <h1 style={{ fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif" }}>
          Community Action<br />
          <span style={{ color: T.blue }}>Development</span><br />
          Corporation
        </h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
          Southwest Oklahoma's community action agency — serving 9 counties with early childhood education, transportation, weatherization, nutrition, and more. Select any program from the orbit to explore.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="tel:+15803355588" style={{ background: T.blue, color: "white", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none", letterSpacing: "0.05em" }}>
            📞 580-335-5588
          </a>
          <a href="/about" style={{ border: `1px solid rgba(1,1,255,0.4)`, color: "rgba(255,255,255,0.75)", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            About CADC
          </a>
        </div>
      </div>
    );
  }

  if (stage === "program" && activeProgram) {
    return (
      <div style={{ maxWidth: 520, color: "white", animation: "fadeSlideIn 0.4s ease" }}>
        <p style={{ color: T.blue, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>{activeProgram.tagline}</p>
        <h2 style={{ fontSize: "clamp(1.6rem,2.8vw,2.4rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif" }}>
          {activeProgram.icon} {activeProgram.name}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
          Select an area from the orbit to explore this program in detail.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {activeProgram.subAreas.map(a => (
            <div key={a.id} style={{ background: "rgba(1,1,255,0.12)", border: "1px solid rgba(1,1,255,0.25)", borderRadius: 6, padding: "6px 12px", fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
              {a.icon} {a.shortLabel}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "content" && activeSubArea) {
    return (
      <div style={{ maxWidth: 540, color: "white", maxHeight: "calc(100vh - 160px)", overflowY: "auto", animation: "fadeSlideIn 0.4s ease" }}>
        <h3 style={{ fontSize: "clamp(1.2rem,2vw,1.8rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 20, fontFamily: "'Space Grotesk', sans-serif", color: "white" }}>
          {activeSubArea.icon} {activeSubArea.label}
        </h3>
        <div className="cadc-dark-content">
          {activeSubArea.content}
        </div>
      </div>
    );
  }

  return null;
}

// ─── MOBILE LAYOUT ────────────────────────────────────────────────────────────

function MobileLayout({ stage, activeProgram, activeSubArea, glowNode, assembled, tapProgram, tapSubArea, goBack }: LayoutProps) {
  return (
    <div style={{ background: T.ghost, minHeight: "100svh", fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>

      {/* Mobile header */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "white", borderBottom: `1px solid ${T.border}`, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {stage !== "main" && (
            <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", color: T.blue, fontSize: 18, marginRight: 4, padding: 0 }} aria-label="Back">←</button>
          )}
          <span style={{ fontWeight: 800, fontSize: 15, color: T.blue, letterSpacing: "0.05em" }}>CADC</span>
          {stage === "program" && activeProgram && (
            <span style={{ color: T.textMuted, fontSize: 12 }}>/ {activeProgram.shortName}</span>
          )}
          {stage === "content" && activeSubArea && (
            <span style={{ color: T.textMuted, fontSize: 12 }}>/ {activeSubArea.shortLabel}</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href="/about" style={{ color: T.blue, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>About</a>
          <a href="/contact" style={{ color: T.blue, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Contact</a>
          <a href="tel:+15803355588" style={{ background: T.maroon, color: "white", padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, textDecoration: "none" }}>📞 Call</a>
        </div>
      </div>

      {/* Orbit */}
      <div style={{ padding: "20px 0 0" }}>
        <MobileOrbit
          stage={stage} activeProgram={activeProgram}
          glowNode={glowNode} assembled={assembled}
          tapProgram={tapProgram} tapSubArea={tapSubArea}
        />
      </div>

      {/* Content below orbit */}
      {stage === "content" && activeSubArea && (
        <div style={{ padding: "0 20px 80px", animation: "fadeSlideUp 0.35s ease" }}>
          <div style={{ background: "white", borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}` }}>
            <div style={{ background: T.blue, padding: "14px 20px" }}>
              <h3 style={{ color: "white", fontWeight: 800, fontSize: 16, margin: 0 }}>
                {activeSubArea.icon} {activeSubArea.label}
              </h3>
            </div>
            <div style={{ padding: 20 }} className="cadc-light-content">
              {activeSubArea.content}
            </div>
          </div>
        </div>
      )}

      {stage === "main" && (
        <div style={{ padding: "16px 20px 80px" }}>
          <div style={{ background: T.blue, borderRadius: 16, padding: 24 }}>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, margin: 0 }}>Southwest Oklahoma</p>
            <h1 style={{ color: "white", fontWeight: 800, fontSize: 22, lineHeight: 1.2, margin: "8px 0 12px", fontFamily: "'Space Grotesk', sans-serif" }}>
              Community Action Development Corporation
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6, margin: "0 0 16px" }}>
              Serving 9 counties — early childhood education, transportation, weatherization, nutrition programs, and more.
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, margin: 0 }}>Tap any program node above to explore</p>
          </div>
        </div>
      )}

      {stage === "program" && activeProgram && !activeSubArea && (
        <div style={{ padding: "16px 20px 80px" }}>
          <div style={{ background: "white", borderRadius: 16, border: `1px solid ${T.border}`, padding: 20 }}>
            <p style={{ color: T.textMuted, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>{activeProgram.tagline}</p>
            <h2 style={{ color: T.blue, fontWeight: 800, fontSize: 20, margin: "0 0 8px", fontFamily: "'Space Grotesk', sans-serif" }}>{activeProgram.icon} {activeProgram.name}</h2>
            <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>Tap any node in the orbit above to explore this program.</p>
          </div>
        </div>
      )}

      <MobileStyles />
    </div>
  );
}

function MobileOrbit({ stage, activeProgram, glowNode, assembled, tapProgram, tapSubArea }: {
  stage: Stage; activeProgram: ProgramData | null; glowNode: string | null;
  assembled: boolean; tapProgram: (p: ProgramData) => void; tapSubArea: (a: SubArea) => void;
}) {
  const programs = PROGRAMS;
  const subAreas = activeProgram?.subAreas ?? [];
  const items = stage === "main" ? programs : subAreas;
  const RADIUS = stage === "main" ? 38 : 36;

  return (
    <div style={{ position: "relative", margin: "0 auto", width: "min(92vw, 400px)", aspectRatio: "1/1" }}>
      {/* Ring */}
      <div style={{
        position: "absolute", inset: "10%", borderRadius: "50%",
        border: `1.5px dashed rgba(1,1,255,0.2)`,
        boxShadow: "0 0 24px rgba(1,1,255,0.06)",
      }} />

      {/* SVG connectors */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 100 100" aria-hidden="true">
        {items.map((item, i) => {
          const { x, y } = orbitPos(i, items.length, RADIUS);
          return (
            <line key={i} x1={50} y1={50} x2={x} y2={y}
              stroke="rgba(1,1,255,0.12)" strokeWidth={0.7} strokeDasharray="2 3"
            />
          );
        })}
      </svg>

      {/* Center hub */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        width: "clamp(60px,18vw,80px)", aspectRatio: "1/1",
        borderRadius: "50%", background: "white",
        border: `2.5px solid ${T.blue}`,
        boxShadow: `0 0 0 5px rgba(1,1,255,0.08), 0 4px 20px rgba(1,1,255,0.18)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
      }}>
        <span style={{ fontSize: "clamp(1rem,5vw,1.4rem)" }}>{stage === "main" ? "🏛️" : activeProgram?.icon}</span>
        <span style={{ color: T.blue, fontSize: "clamp(0.35rem,1.8vw,0.5rem)", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", lineHeight: 1.2, padding: "0 4px" }}>
          {stage === "main" ? "CADC" : activeProgram?.shortName}
        </span>
      </div>

      {/* Nodes */}
      {items.map((item, i) => {
        const { x, y } = orbitPos(i, items.length, RADIUS);
        const prog = item as ProgramData;
        const sub = item as SubArea;
        const id = stage === "main" ? prog.slug : sub.id;
        const label = stage === "main" ? prog.shortName : sub.shortLabel;
        const icon = stage === "main" ? prog.icon : sub.icon;
        const isGlowing = id === glowNode;
        const delay = assembled ? 0 : i * 60;

        return (
          <button
            key={id}
            onClick={() => stage === "main" ? tapProgram(prog) : tapSubArea(sub)}
            aria-label={label}
            style={{
              position: "absolute",
              left: `${x}%`, top: `${y}%`,
              width: "clamp(48px,13vw,64px)",
              transform: "translate(-50%,-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: "none", border: "none", cursor: "pointer", padding: 0,
              opacity: assembled ? 1 : 0,
              transition: `opacity 0.45s ease ${delay}ms`,
            }}
          >
            {isGlowing && (
              <div style={{
                position: "absolute", inset: -8, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(1,1,255,0.35) 0%, transparent 70%)",
                animation: "mobilePing 0.6s ease-out forwards", pointerEvents: "none",
              }} />
            )}
            <div style={{
              width: "clamp(34px,10vw,48px)", aspectRatio: "1/1",
              borderRadius: "50%", background: "white",
              border: `2px solid ${T.blue}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "clamp(0.85rem,4vw,1.1rem)",
              boxShadow: "0 2px 10px rgba(1,1,255,0.14)",
            }}>
              {icon}
            </div>
            <span style={{
              color: T.blue, fontSize: "clamp(0.36rem,1.6vw,0.48rem)",
              fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
              textAlign: "center", lineHeight: 1.2,
              width: "clamp(48px,13vw,64px)", overflowWrap: "break-word",
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function DesktopStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap');

      @keyframes desktopPing {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(2.8); opacity: 0; }
      }
      @keyframes fadeSlideIn {
        from { opacity: 0; transform: translateX(24px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      .cadc-dark-content p { color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.7; margin: 0 0 14px; }
      .cadc-dark-content strong { color: white; }
      .cadc-dark-content .cadc-card { background: rgba(1,1,255,0.12); border: 1px solid rgba(1,1,255,0.25); border-radius: 12px; padding: 16px; margin: 14px 0; }
      .cadc-dark-content .cadc-card-sm { background: rgba(1,1,255,0.1); border: 1px solid rgba(1,1,255,0.2); border-radius: 10px; padding: 14px; margin: 8px 0; }
      .cadc-dark-content .cadc-card-title { color: rgba(1,1,255,0.9); font-weight: 700; font-size: 12px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.06em; }
      .cadc-dark-content .cadc-label { color: rgba(126,0,1,0.9); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px; }
      .cadc-dark-content .cadc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
      .cadc-dark-content .cadc-list li { color: rgba(255,255,255,0.65); font-size: 13px; padding-left: 14px; position: relative; }
      .cadc-dark-content .cadc-list li::before { content: "·"; position: absolute; left: 0; color: ${T.blue}; font-weight: 700; }
      .cadc-dark-content .cadc-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 0; }
      .cadc-dark-content .cadc-chip { background: rgba(1,1,255,0.15); border: 1px solid rgba(1,1,255,0.25); border-radius: 6px; padding: 6px 10px; font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 600; }
      .cadc-dark-content .cadc-stack { display: flex; flex-direction: column; gap: 8px; }
      .cadc-dark-content .cadc-btn { display: inline-flex; align-items: center; justify-content: center; background: ${T.maroon}; color: white; padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; margin-top: 8px; }
      .cadc-dark-content .cadc-link { color: ${T.blue}; font-weight: 700; font-size: 14px; text-decoration: none; }
      .cadc-dark-content .cadc-note { color: rgba(255,255,255,0.4); font-size: 11px; font-style: italic; margin: 8px 0 0; }
      .cadc-dark-content .cadc-fare-table { border: 1px solid rgba(1,1,255,0.25); border-radius: 10px; overflow: hidden; margin: 14px 0; }
      .cadc-dark-content .cadc-fare-header { display: grid; grid-template-columns: 2fr 1fr 1fr; background: rgba(1,1,255,0.25); padding: 8px 14px; }
      .cadc-dark-content .cadc-fare-header span { color: rgba(255,255,255,0.9); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
      .cadc-dark-content .cadc-fare-row { display: grid; grid-template-columns: 2fr 1fr 1fr; padding: 8px 14px; border-top: 1px solid rgba(1,1,255,0.1); }
      .cadc-dark-content .cadc-fare-row span { color: rgba(255,255,255,0.65); font-size: 12px; font-family: 'JetBrains Mono', monospace; }
      .cadc-dark-content .cadc-content { display: flex; flex-direction: column; }
    `}</style>
  );
}

function MobileStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

      @keyframes mobilePing {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(2.5); opacity: 0; }
      }
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .cadc-light-content p { color: #374151; font-size: 14px; line-height: 1.7; margin: 0 0 12px; }
      .cadc-light-content strong { color: #111827; }
      .cadc-light-content .cadc-card { background: #E4E4FF; border-radius: 10px; padding: 14px; margin: 12px 0; }
      .cadc-light-content .cadc-card-sm { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; margin: 6px 0; }
      .cadc-light-content .cadc-card-title { color: ${T.blue}; font-weight: 700; font-size: 11px; margin: 0 0 5px; text-transform: uppercase; letter-spacing: 0.06em; }
      .cadc-light-content .cadc-label { color: ${T.maroon}; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px; }
      .cadc-light-content .cadc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
      .cadc-light-content .cadc-list li { color: #374151; font-size: 13px; padding-left: 14px; position: relative; }
      .cadc-light-content .cadc-list li::before { content: "·"; position: absolute; left: 0; color: ${T.blue}; font-weight: 700; }
      .cadc-light-content .cadc-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 10px 0; }
      .cadc-light-content .cadc-chip { background: #E4E4FF; border-radius: 6px; padding: 6px 10px; font-size: 11px; color: ${T.blue}; font-weight: 600; text-align: center; }
      .cadc-light-content .cadc-stack { display: flex; flex-direction: column; gap: 6px; }
      .cadc-light-content .cadc-btn { display: inline-flex; align-items: center; justify-content: center; background: ${T.maroon}; color: white; padding: 12px 18px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; margin-top: 8px; }
      .cadc-light-content .cadc-link { color: ${T.blue}; font-weight: 700; font-size: 13px; text-decoration: none; }
      .cadc-light-content .cadc-note { color: #9ca3af; font-size: 11px; font-style: italic; margin: 6px 0 0; }
      .cadc-light-content .cadc-fare-table { border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin: 12px 0; }
      .cadc-light-content .cadc-fare-header { display: grid; grid-template-columns: 2fr 1fr 1fr; background: ${T.blue}; padding: 8px 12px; }
      .cadc-light-content .cadc-fare-header span { color: white; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
      .cadc-light-content .cadc-fare-row { display: grid; grid-template-columns: 2fr 1fr 1fr; padding: 7px 12px; border-top: 1px solid #e5e7eb; }
      .cadc-light-content .cadc-fare-row span { color: #374151; font-size: 12px; }
      .cadc-light-content .cadc-content { display: flex; flex-direction: column; }
    `}</style>
  );
}
