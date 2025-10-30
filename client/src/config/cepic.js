// Configuration CEPIC - Informations de l'entreprise

export const CEPIC_INFO = {
  // Informations légales
  fullName: "Cabinet d'Études, de Prestations et d'Intermédiation Commerciale",
  shortName: "CEPIC",
  legalForm: "SARL",
  
  // Contact
  address: "Cocody M'Badon village – 18 BP 822 ABIDJAN 18",
  phone: {
    primary: "+225 27 22 28 20 66",
    secondary: "+225 05 46 66 33 63"
  },
  email: "info@cepic.ci",
  website: "www.cepic.ci",
  
  // Informations légales
  rccm: "CI-ABJ-03-2023-B12-04797",
  idu: "CI-2023-0058378 D",
  ncc: "2303862 L/TEE",
  capital: "1.000.000 FCFA",
  
  // Direction
  director: {
    name: "DIGBEU Serge-Fabrice",
    title: "Directeur Général"
  },
  
  // Réseaux sociaux (à compléter)
  social: {
    facebook: "",
    linkedin: "",
    twitter: "",
    instagram: ""
  },
  
  // Horaires d'ouverture
  hours: {
    weekdays: "Lundi - Vendredi: 8h00 - 17h00",
    saturday: "Samedi: Sur rendez-vous",
    sunday: "Dimanche: Fermé"
  }
};

// Catégories de formations CEPIC
export const TRAINING_CATEGORIES = [
  {
    id: 1,
    name: "Management de projet",
    slug: "management-projet",
    icon: "Briefcase",
    color: "#2C2E83",
    description: "Formations en gestion et pilotage de projets"
  },
  {
    id: 2,
    name: "Banque et finance",
    slug: "banque-finance",
    icon: "DollarSign",
    color: "#ECB519",
    description: "Formations en analyse financière et gestion bancaire"
  },
  {
    id: 3,
    name: "Méthodologie & Collecte de données",
    slug: "methodologie-collecte-donnees",
    icon: "Database",
    color: "#2C2E83",
    description: "Formations en enquêtes et traitement de données"
  },
  {
    id: 4,
    name: "Entrepreneuriat",
    slug: "entrepreneuriat",
    icon: "Rocket",
    color: "#ECB519",
    description: "Formations en création et gestion d'entreprise"
  }
];

// Couleurs du thème CEPIC
export const CEPIC_COLORS = {
  primary: "#2C2E83",    // Bleu CEPIC
  secondary: "#ECB519",  // Or CEPIC
  dark: "#1a1b4a",
  light: "#f0f1fb",
  white: "#ffffff",
  gray: "#64748b"
};

// Principales réalisations (exemples du document)
export const ACHIEVEMENTS = [
  {
    title: "Formation en MS Project",
    description: "Formation aux particuliers et aux entreprises",
    client: "Particulier, BERGEC, FDTR",
    period: "Depuis 2022"
  },
  {
    title: "Formation en Gestion des risques des projets de développement",
    description: "Méthodes d'identification, de suivi et de mitigation des risques",
    client: "CI ENERGIE",
    cost: "750 000 FCFA",
    period: "13-24 Novembre 2023"
  },
  {
    title: "Formation - Gestion des projets de développement",
    description: "Gestion du cycle de projet",
    client: "Université WAIIS",
    cost: "Bénévolat",
    period: "11-15 Novembre 2024"
  },
  {
    title: "Evaluation institutionnelle",
    description: "Préparation des dossiers UICI pour autorisation MESRS et homologation CAMES",
    client: "UICI",
    cost: "4 000 000 FCFA",
    period: "Mars-Juin 2023"
  }
];

// Valeurs de l'entreprise
export const VALUES = [
  {
    title: "Excellence",
    description: "Nous visons l'excellence dans toutes nos formations",
    icon: "Award"
  },
  {
    title: "Professionnalisme",
    description: "Des formateurs experts et certifiés",
    icon: "Users"
  },
  {
    title: "Innovation",
    description: "Des méthodes pédagogiques modernes et efficaces",
    icon: "Lightbulb"
  },
  {
    title: "Accompagnement",
    description: "Un suivi personnalisé de chaque participant",
    icon: "Heart"
  }
];

export default CEPIC_INFO;
