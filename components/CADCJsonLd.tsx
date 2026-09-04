// components/CADCJsonLd.tsx
// Schema.org structured data for CADC — improves Google visibility for
// "Head Start Frederick OK", "senior meals Tillman County", etc.

export function CADCJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": ["NonprofitOrganization", "GovernmentOrganization"],
    "@id": "https://cadcok.org/#organization",
    "name": "Community Action Development Corporation",
    "alternateName": "CADC",
    "url": "https://cadcok.org",
    "logo": "https://cadcok.org/images/cadc-logo.png",
    "description": "CADC reduces poverty in Southwest Oklahoma communities by empowering people through Head Start, transit, weatherization, senior nutrition, and community services.",
    "foundingDate": "1966",
    "telephone": "+1-580-335-5588",
    "email": "cadc@cadcok.org",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "105 S. Main Street, P.O. Box 989",
      "addressLocality": "Frederick",
      "addressRegion": "OK",
      "postalCode": "73542",
      "addressCountry": "US"
    },
    "areaServed": [
      "Beckham County, OK", "Canadian County, OK", "Comanche County, OK",
      "Cotton County, OK", "Jefferson County, OK", "Kiowa County, OK",
      "Roger Mills County, OK", "Tillman County, OK", "Washita County, OK"
    ],
    "sameAs": [
      "https://www.facebook.com/share/1Ei1cCmz46/?mibextid=wwXIfr",
      "https://www.instagram.com/wearecadc"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "CADC Programs & Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Head Start & Early Head Start", "url": "https://cadcok.org/?program=head-start" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Red River Transportation", "url": "https://cadcok.org/?program=transit" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Weatherization Assistance Program", "url": "https://cadcok.org/?program=weatherization" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Senior Nutrition Program", "url": "https://cadcok.org/?program=senior-meals" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Advantage Home Delivered Meals", "url": "https://cadcok.org/?program=advantage" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Community Market", "url": "https://cadcok.org/?program=market" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "VITA Free Tax Preparation", "url": "https://cadcok.org/?program=tax-help" } },
      ]
    }
  };

  const headStart = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "CADC Head Start & Early Head Start",
    "url": "https://cadcok.org/?program=head-start",
    "parentOrganization": { "@id": "https://cadcok.org/#organization" },
    "description": "Free early childhood education for income-eligible families in Southwest Oklahoma. 11 centers serving children from birth through age 5.",
    "numberOfStudents": 1200,
    "location": [
      { "@type": "Place", "name": "Frederick Head Start Center", "address": { "@type": "PostalAddress", "addressLocality": "Frederick", "addressRegion": "OK" } },
      { "@type": "Place", "name": "Hobart Head Start Center", "address": { "@type": "PostalAddress", "addressLocality": "Hobart", "addressRegion": "OK" } },
      { "@type": "Place", "name": "Sayre Head Start Center", "address": { "@type": "PostalAddress", "addressLocality": "Sayre", "addressRegion": "OK" } },
      { "@type": "Place", "name": "Elk City Head Start Center", "address": { "@type": "PostalAddress", "addressLocality": "Elk City", "addressRegion": "OK" } },
      { "@type": "Place", "name": "Erick Head Start Center", "address": { "@type": "PostalAddress", "addressLocality": "Erick", "addressRegion": "OK" } },
    ]
  };

  const transit = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": "Red River Transportation — Rural Public Transit",
    "url": "https://cadcok.org/?program=transit",
    "provider": { "@id": "https://cadcok.org/#organization" },
    "description": "Rural public transportation serving 12 counties in Southwest Oklahoma. Medical trips, grocery runs, work transportation, and more.",
    "telephone": "+1-580-335-2691",
    "areaServed": "Southwest Oklahoma",
    "serviceType": "Rural Public Transportation"
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I apply for Head Start in Oklahoma?",
        "acceptedAnswer": { "@type": "Answer", "text": "Apply online through ChildPlus at childplusnet.com, or call CADC Head Start at 580-726-3343. CADC Head Start serves children from birth to age 5 in 9 counties in Southwest Oklahoma." }
      },
      {
        "@type": "Question",
        "name": "Does CADC provide free transportation in Southwest Oklahoma?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. Red River Transportation provides rural public transit across 12 counties. Call 580-335-2691 to schedule a ride. In-town fares start at $1.00 per stop." }
      },
      {
        "@type": "Question",
        "name": "How do I apply for weatherization assistance in Oklahoma?",
        "acceptedAnswer": { "@type": "Answer", "text": "CADC provides weatherization services in 17 counties. Priority is given to households with elderly members, people with disabilities, and children 18 and under. Call 580-335-5588 or submit an interest form at cadcok.org." }
      },
      {
        "@type": "Question",
        "name": "What is the Advantage home-delivered meals program?",
        "acceptedAnswer": { "@type": "Answer", "text": "Advantage provides frozen home-delivered meals to Oklahoma Medicaid members who are elderly or have disabilities. CADC serves 13 counties and delivered 340,830 meals in 2024. Contact your SoonerCare case manager to apply." }
      },
      {
        "@type": "Question",
        "name": "Where can I get free tax help in Southwest Oklahoma?",
        "acceptedAnswer": { "@type": "Answer", "text": "CADC offers VITA (Volunteer Income Tax Assistance) free tax preparation for households earning approximately $67,000 or less. Call 580-335-5588 to schedule an appointment during tax season." }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(headStart) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(transit) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}
