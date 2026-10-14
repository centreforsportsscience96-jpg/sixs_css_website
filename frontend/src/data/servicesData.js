import servicePhysio from '../assets/service_physio.jpg';
import serviceStrength from '../assets/service_strength.jpeg';
import servicePsychology from '../assets/service_psychology.jpg';
import serviceBiomechanics from '../assets/service_biomechanics.jpeg';
import serviceNutrition from '../assets/service_nutrition.jpg';

// One entry per service category, keyed by the slug used in /services/:category.
// Each category's pricing rows and package cards are the subset of the original
// all-in-one Services page that actually belongs to that discipline.
const servicesData = {
  physiotherapy: {
    title: 'Sports Physiotherapy',
    tagline: 'Evidence-based injury treatment and rehabilitation.',
    image: servicePhysio,
    description:
      'Comprehensive rehabilitation and manual therapy to treat injuries and restore optimal mobility and function, delivered by our sports physiotherapy team at Sree Kanteerava Stadium, Bangalore.',
    pricingRows: [
      { package: 'Physio Consultation', duration: 'Single session', focus: 'Assessment & treatment', price: '1xxx + GST' },
      { package: 'Follow-up Physio', duration: 'Per session', focus: 'Continued care', price: '8xx' },
      { package: 'Rehab Package', duration: '1 Week', focus: 'Pain & activation', price: '5xxx' },
      { package: 'Rehab Package', duration: '15 Days', focus: 'Strength & movement control', price: '1xxxx' },
      { package: 'Rehab Package', duration: '1 Month', focus: 'Full rehab & prevention', price: '2xxxx' },
    ],
    packages: [
      {
        title: 'Package 1: Consultation & Treatment',
        price: '1xxx',
        priceSuffix: '+ GST',
        subPrice: 'Follow-up sessions: 8xx per session',
        features: [
          'Detailed injury & movement assessment',
          'Sports-specific orthopedic testing',
          'Pain relief & manual therapy',
          'Corrective and rehab exercises',
          'Injury education & recovery roadmap',
        ],
        ideal: 'Perfect for pain relief, injury diagnosis, and early rehab.',
      },
      {
        title: 'Package 2: 1-Week Rehabilitation',
        price: '5xxx',
        features: [
          'Initial assessment & rehab planning',
          'Multiple supervised physiotherapy sessions',
          'Pain reduction, mobility & activation drills',
          'Early strengthening protocols',
          'Continuous progress monitoring',
        ],
        ideal: 'Best for short-term injuries and quick recovery needs.',
      },
      {
        title: 'Package 3: 15-Day Rehabilitation',
        price: '1xxxx',
        features: [
          'Comprehensive biomechanical assessment',
          'Structured rehabilitation progression',
          'Strength, mobility & movement retraining',
          'Sports-specific functional exercises',
          'Return-to-activity guidance',
        ],
        ideal: 'Ideal for sub-acute injuries and performance-focused rehab.',
      },
      {
        title: 'Package 4: 1-Month Rehabilitation',
        price: '2xxxx',
        premium: true,
        features: [
          'Detailed assessment & goal setting',
          'Long-term rehab & performance plan',
          'Progressive strength & neuromuscular training',
          'Sports-specific conditioning',
          'Injury prevention strategies',
          'Regular reassessment & progression tracking',
        ],
        ideal: 'Best for chronic injuries, post-surgery rehab, and competitive athletes.',
      },
    ],
  },

  'strength-conditioning': {
    title: 'Strength & Conditioning',
    tagline: 'Physical development and athletic performance.',
    image: serviceStrength,
    description:
      'Elite physical preparation programs tailored to your specific sport to maximize power, speed, and endurance.',
    pricingRows: [
      { package: 'S&C Session', duration: '1 Day', focus: 'Strength & power', price: '1xxx' },
      { package: 'S&C Package', duration: '1 Month', focus: 'Speed, strength & conditioning', price: '1xxxx' },
      { package: 'S&C Package', duration: '3 Month', focus: 'Speed, strength & conditioning', price: '4xxxx (10% OFF)' },
      { package: 'S&C Package', duration: '6 Month', focus: 'Speed, strength & conditioning', price: '9xxxx (20% OFF)' },
    ],
    packages: [
      {
        title: 'S&C – 1 Day Session',
        price: '1xxx',
        features: [
          'Performance assessment',
          'Strength / Power / Conditioning workout',
          'Technique correction & coaching',
          'Sport-specific training focus',
        ],
        ideal: 'Try before committing. Train with intent.',
      },
      {
        title: 'S&C – 1 Month Package',
        price: '1xxxx',
        features: [
          'Full physical performance assessment',
          'Customized strength & conditioning program',
          'Speed, agility, power & endurance training',
          'Mobility & recovery integration',
          'Weekly monitoring & load management',
        ],
        ideal: 'Build strength, speed, and durability.',
      },
      {
        title: 'S&C – 3 Month Package',
        price: '4xxxx',
        discountBadge: '10% OFF',
        note: 'All features of the 1-month package with extended programming and greater long-term adaptation.',
      },
      {
        title: 'S&C – 6 Month Package',
        price: '9xxxx',
        discountBadge: '20% OFF',
        note: 'Comprehensive long-term athletic development with maximum discount applied.',
      },
    ],
  },

  nutrition: {
    title: 'Sports Nutrition',
    tagline: 'Personalized diet plans to fuel performance and recovery.',
    image: serviceNutrition,
    description:
      'Personalized sports nutrition and diet planning to fuel performance, speed up recovery, and support long-term athlete health.',
    pricingRows: [
      { package: 'Nutrition Consultation', duration: 'Single session', focus: 'Diet assessment & planning', price: '1xxx' },
      { package: 'Nutrition Plan', duration: '1 Month', focus: 'Personalized diet & follow-ups', price: '8xxx' },
    ],
    packages: [
      {
        title: 'Nutrition Consultation',
        price: '1xxx',
        features: [
          'Detailed dietary & lifestyle assessment',
          'Body composition & nutrient analysis',
          'Sport-specific fueling strategy',
          'Hydration & recovery nutrition guidance',
        ],
        ideal: 'Perfect for athletes wanting a personalized diet baseline.',
      },
      {
        title: 'Nutrition Plan – 1 Month',
        price: '8xxx',
        features: [
          'Fully customized meal & macro plan',
          'Performance & recovery focused nutrition',
          'Weekly progress check-ins',
          'Supplement guidance where needed',
        ],
        ideal: 'Best for athletes training toward a specific competition or goal.',
      },
    ],
  },

  biomechanics: {
    title: 'Biomechanics',
    tagline: 'Movement analysis and performance optimization.',
    image: serviceBiomechanics,
    description:
      'Advanced motion analysis and force plate testing to optimize technique and identify injury risks.',
    pricingRows: [
      { package: 'Biomechanics Assessment', duration: 'Sport-specific testing', focus: 'Movement & injury risk', price: '5xxx' },
    ],
    packages: [
      {
        title: 'Biomechanics Assessment',
        price: '5xxx',
        premium: true,
        subtitle: 'Fix the Movement. Protect the Body. Unlock Performance.',
        features: [
          'Sport-specific biomechanical testing',
          'Technique & movement efficiency analysis',
          'Injury risk identification',
          'Performance optimization recommendations',
          'Actionable report integrated with rehab or S&C',
        ],
      },
    ],
  },

  psychology: {
    title: 'Sports Psychology',
    tagline: 'Mental training and competitive readiness.',
    image: servicePsychology,
    description:
      'Mental conditioning, performance anxiety management, and cognitive strategies for peak competitive focus.',
    pricingRows: [
      { package: 'Sports Psychology Testing', duration: 'Psychological profiling', focus: 'Mental performance', price: '2xxx' },
    ],
    packages: [
      {
        title: 'Sports Psychology Testing',
        price: '2xxx',
        subtitle: 'Train the Mind That Wins Matches.',
        featureGroups: [
          {
            heading: 'Parameters Analysed:',
            features: [
              'Focus and attention control',
              'Competitive anxiety & stress response',
              'Confidence and self-belief',
              'Motivation and goal orientation',
              'Emotional regulation under pressure',
              'Mental fatigue & recovery readiness',
            ],
          },
          {
            heading: 'Includes:',
            features: [
              'Standardized sports psychology testing tools',
              'Athlete profiling report (Strengths & improvement areas)',
              'Practical mental training recommendations',
            ],
          },
        ],
        ideal: 'Because physical talent fails without mental readiness.',
      },
    ],
  },
};

export default servicesData;
