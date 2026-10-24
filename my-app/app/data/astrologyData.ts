export interface ZodiacSign {
  id: string;
  name: string;
  dates: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  rulingPlanet: string;
  icon: string;
  summary: string;
  todayPrediction: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  longDescription: string;
}

export interface Astrologer {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  pricePerMin: number;
  image: string;
  languages: string[];
  bio: string;
  isOnline: boolean;
}

export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  image: string;
  description: string;
  inStock: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  location: string;
  rating: number;
  comment: string;
  serviceUsed: string;
  avatar: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 'aries',
    name: 'Aries',
    dates: 'Mar 21 - Apr 19',
    element: 'Fire',
    rulingPlanet: 'Mars',
    icon: '♈',
    summary: 'Bold, energetic, and ambitious pioneer of the zodiac.',
    todayPrediction: 'Today brings fresh energy for career endeavors. Take initiative in new ventures.'
  },
  {
    id: 'taurus',
    name: 'Taurus',
    dates: 'Apr 20 - May 20',
    element: 'Earth',
    rulingPlanet: 'Venus',
    icon: '♉',
    summary: 'Grounded, patient, and appreciative of peace and luxury.',
    todayPrediction: 'Financial stability is highlighted today. Focus on long-term investments.'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    dates: 'May 21 - Jun 20',
    element: 'Air',
    rulingPlanet: 'Mercury',
    icon: '♊',
    summary: 'Adaptable, curious, and expressive communicator.',
    todayPrediction: 'Great day for networking and expressive communication with colleagues.'
  },
  {
    id: 'cancer',
    name: 'Cancer',
    dates: 'Jun 21 - Jul 22',
    element: 'Water',
    rulingPlanet: 'Moon',
    icon: '♋',
    summary: 'Intuitive, nurturing, and emotionally profound.',
    todayPrediction: 'Focus on family matters and personal well-being today. Inner harmony yields success.'
  },
  {
    id: 'leo',
    name: 'Leo',
    dates: 'Jul 23 - Aug 22',
    element: 'Fire',
    rulingPlanet: 'Sun',
    icon: '♌',
    summary: 'Charismatic, generous, and natural born leader.',
    todayPrediction: 'Your creative confidence is shining. Lead projects with passion and warmth.'
  },
  {
    id: 'virgo',
    name: 'Virgo',
    dates: 'Aug 23 - Sep 22',
    element: 'Earth',
    rulingPlanet: 'Mercury',
    icon: '♍',
    summary: 'Analytical, meticulous, and dedicated helper.',
    todayPrediction: 'Attention to detail will resolve a crucial problem today. Trust your intellect.'
  },
  {
    id: 'libra',
    name: 'Libra',
    dates: 'Sep 23 - Oct 22',
    element: 'Air',
    rulingPlanet: 'Venus',
    icon: '♎',
    summary: 'Harmonious, diplomatic, and lover of beauty.',
    todayPrediction: 'Partnerships and collaborations will bring beneficial opportunities today.'
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    dates: 'Oct 23 - Nov 21',
    element: 'Water',
    rulingPlanet: 'Pluto',
    icon: '♏',
    summary: 'Passionate, resourceful, and deeply intuitive.',
    todayPrediction: 'Transformative cosmic insights emerge today. Deep research pays off.'
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    dates: 'Nov 22 - Dec 21',
    element: 'Fire',
    rulingPlanet: 'Jupiter',
    icon: '♐',
    summary: 'Optimistic, adventurous, and philosophical seeker.',
    todayPrediction: 'New learning or travel plans receive planetary blessings today.'
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    dates: 'Dec 22 - Jan 19',
    element: 'Earth',
    rulingPlanet: 'Saturn',
    icon: '♑',
    summary: 'Disciplined, strategic, and goal-oriented achiever.',
    todayPrediction: 'Hard work brings recognition. Stay steady toward your major milestones.'
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    dates: 'Jan 20 - Feb 18',
    element: 'Air',
    rulingPlanet: 'Uranus',
    icon: '♒',
    summary: 'Innovative, humanitarian, and visionary thinker.',
    todayPrediction: 'Out-of-the-box ideas will solve old bottlenecks. Share your vision.'
  },
  {
    id: 'pisces',
    name: 'Pisces',
    dates: 'Feb 19 - Mar 20',
    element: 'Water',
    rulingPlanet: 'Neptune',
    icon: '♓',
    summary: 'Compassionate, imaginative, and spiritually connected.',
    todayPrediction: 'Trust your dreams and intuition. Meditation brings profound clarity.'
  }
];

export const ASTROLOGY_SERVICES: ServiceItem[] = [
  {
    id: '1',
    slug: 'kundli-analysis',
    title: 'Kundli Analysis & Birth Chart',
    description: 'Detailed Vedic birth chart breakdown decoding planetary positions, dasha phases, and life roadmap.',
    icon: '📜',
    longDescription: 'Get a full 30+ page computerized Vedic Janam Kundli analysis with expert commentary covering Career, Health, Marriage, and Financial prospects.'
  },
  {
    id: '2',
    slug: 'horoscope-reading',
    title: 'Horoscope Reading',
    description: 'Accurate daily, weekly, monthly and annual planetary transit forecasts for all zodiac signs.',
    icon: '🌟',
    longDescription: 'Detailed horoscope predictions personalized according to your Lagna, Moon sign, and planetary transits.'
  },
  {
    id: '3',
    slug: 'vastu-shastra',
    title: 'Vastu Shastra Consultation',
    description: 'Harmonize your residential or commercial spaces to invite peace, wealth, and positive cosmic vibrations.',
    icon: '🏛️',
    longDescription: 'Vastu directional mapping and practical energy remedies without structural demolition.'
  },
  {
    id: '4',
    slug: 'numerology',
    title: 'Numerology & Name Correction',
    description: 'Discover your destiny number, soul urge, and optimize your personal or business name for success.',
    icon: '🔢',
    longDescription: 'Calculation of Life Path numbers, destiny grid alignment, and harmonious name spellings for enhanced luck.'
  },
  {
    id: '5',
    slug: 'palmistry',
    title: 'Palmistry & Hand Reading',
    description: 'Decode life line, heart line, and planetary mounts on your palm for personalized guidance.',
    icon: '✋',
    longDescription: 'Comprehensive hand reading analysis revealing hidden talents, health indicators, and life timing events.'
  },
  {
    id: '6',
    slug: 'tarot-reading',
    title: 'Tarot Card Guidance',
    description: 'Intuitive card spreads providing immediate clarity on love, relationship, and career decisions.',
    icon: '🃏',
    longDescription: '78-card Rider Waite & Celestial Tarot readings for quick answers and energetic alignment.'
  }
];

export const ASTROLOGERS: Astrologer[] = [
  {
    id: '1',
    name: 'Pandit Rajesh Sharma',
    title: 'Senior Vedic Astrologer & Kundli Expert',
    specialties: ['Vedic Astrology', 'Kundli Matching', 'Gemology'],
    experienceYears: 20,
    rating: 4.9,
    reviewsCount: 1420,
    pricePerMin: 45,
    image: '/websiteImage/Astrology1.jpg',
    languages: ['Hindi', 'English'],
    bio: '20+ years decoding ancient Vedic astrology charts. Guided over 25,000+ individuals worldwide in career & marriage.',
    isOnline: true
  },
  {
    id: '2',
    name: 'Dr. Priya Verma',
    title: 'Numerologist & Tarot Card Specialist',
    specialties: ['Numerology', 'Tarot Reading', 'Life Coaching'],
    experienceYears: 12,
    rating: 4.8,
    reviewsCount: 980,
    pricePerMin: 35,
    image: '/websiteImage/Astrology2.jpg',
    languages: ['English', 'Hindi', 'Punjabi'],
    bio: 'Gold medalist numerologist specializing in name corrections, relationship tarot spreads, and personal growth.',
    isOnline: true
  },
  {
    id: '3',
    name: 'Acharya Suresh Kumar',
    title: 'Vastu Shastra Consultant & Face Reader',
    specialties: ['Vastu Shastra', 'Face Reading', 'KP Astrology'],
    experienceYears: 15,
    rating: 4.9,
    reviewsCount: 1150,
    pricePerMin: 50,
    image: '/websiteImage/Astrology3.jpg',
    languages: ['Hindi', 'Sanskrit', 'Gujarati'],
    bio: 'Renowned expert in commercial Vastu & KP System predictions. Trusted consultant for top business houses.',
    isOnline: false
  },
  {
    id: '4',
    name: 'Ms. Anita Joshi',
    title: 'Palmistry & Western Astrology Expert',
    specialties: ['Palmistry', 'Western Astrology', 'Love Remedies'],
    experienceYears: 10,
    rating: 4.7,
    reviewsCount: 760,
    pricePerMin: 30,
    image: '/websiteImage/Astrology4.jpg',
    languages: ['English', 'Hindi', 'Marathi'],
    bio: 'Compassionate palmist and Western astrologer helping clients solve relationship & career crossroads.',
    isOnline: true
  }
];

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: '1',
    slug: 'shree-yantra',
    name: 'Energized Copper Shree Yantra',
    category: 'Yantra',
    price: 1499,
    originalPrice: 2499,
    rating: 4.9,
    image: '/websiteImage/image1.jpg',
    description: 'Purified and consecrated copper Shree Yantra for wealth, prosperity, and divine financial blessings.',
    inStock: true
  },
  {
    id: '2',
    slug: 'ganesh-yantra',
    name: 'Brass Siddha Ganesh Yantra',
    category: 'Yantra',
    price: 1199,
    originalPrice: 1999,
    rating: 4.8,
    image: '/websiteImage/image2.png',
    description: 'Energized brass Ganesh Yantra for removing obstacles, gaining wisdom, and attracting success.',
    inStock: true
  },
  {
    id: '3',
    slug: 'mahalakshmi-yantra',
    name: '24K Gold Plated Mahalakshmi Yantra',
    category: 'Yantra',
    price: 1999,
    originalPrice: 2999,
    rating: 4.9,
    image: '/websiteImage/image3.jpg',
    description: 'Handcrafted gold-plated Mahalakshmi Yantra for continuous inflow of wealth and household harmony.',
    inStock: true
  },
  {
    id: '4',
    slug: 'navagraha-yantra',
    name: 'Heavy Navagraha Metal Yantra',
    category: 'Yantra',
    price: 1799,
    originalPrice: 2699,
    rating: 4.7,
    image: '/websiteImage/image4.jpg',
    description: 'Pacifies malefic planetary doshas and balances all nine cosmic planets in your birth chart.',
    inStock: true
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    clientName: 'Rahul Gupta',
    location: 'Delhi, India',
    rating: 5,
    comment: 'The Kundli consultation with Pt. Rajesh Sharma was incredibly spot on! His career predictions and gemstone guidance changed my business trajectory.',
    serviceUsed: 'Kundli Analysis',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '2',
    clientName: 'Priya Singh',
    location: 'Mumbai, India',
    rating: 5,
    comment: 'Dr. Priya Verma’s numerology name correction brought noticeable clarity and progress in my profession within months!',
    serviceUsed: 'Numerology',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '3',
    clientName: 'Amit Sharma',
    location: 'Bengaluru, India',
    rating: 5,
    comment: 'Vastu consultation for our new office apartment transformed the whole energy. Very professional and highly recommended.',
    serviceUsed: 'Vastu Shastra',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  }
];
