import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const enTranslations = {
  app: {
    title: "Taxibee",
    slogan: "Taxi fleet management with ease",
    videoNoSupport: "Your browser does not support the video tag."
  },
  homepage: {
    heroTitle: "Taxi fleet management with ease",
    heroTitle2: "Get your fleet registered with us",
    heroDesc: 'Streamlined operations, real-time data, and powerful analytics for taxi companies and drivers',
    features: {
      title: 'Powerful Fleet Management',
      feature1: {
        title: 'Real-Time Driver Tracking',
        content: 'Monitor your entire fleet in real-time. Track driver status, availability, and current orders from anywhere.'
      },
      feature2: {
        title: 'Comprehensive Analytics',
        content: 'Gain valuable insights with detailed analytics on revenue, driver performance, and customer trends.'
      },
      feature3: {
        title: 'Driver Portal',
        content: 'Give your drivers access to their personal dashboard with earnings, performance metrics, and order history.'
      }
    },
    footer: {
      desc: "Taxibee is a taxi fleet management system that provides a comprehensive solution for taxi companies and drivers. It offers a range of features including real-time tracking, analytics, and a user-friendly interface for efficient management.",
      copyright: "Taxibee. All rights reserved."
    }
  },
  loginPage: {
    title: "Sign In to Taxibee",
    heroText: "Welcome Onboard!",
    backToHome: "Back to Home",
    noCredError: "Invalid Credentials. Please try again.",
    missingInputError: "Please enter both username and password",
    error: "An error occurred. Please try again later.",
    loading: "Loading..."
  },
  nav: {
    dashboard: "Dashboard",
    orders: "Orders",
    drivers: "Drivers",
    liveStatus: "Live Status",
    transactions: "Transactions",
    exactFile: "EXACT FILE",
    contacts: "Contacts"
  },
  auth: {
    login: "Sign In",
    logout: "Logout",
    username: "Username",
    password: "Password",
    role: "Role",
    admin: "Admin",
    driver: "Driver"
  },
  common: {
    loading: "Loading...",
    language: "Language",
    english: "English",
    dutch: "Dutch"
  },
  actions: {
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
  },
  contactForm: {
    instruction: "Please fill out the form below and we'll get back to you as soon as possible.",
    contactUs: "Contact Us",
    name: "Name",
    email: "Email",
    message: "Message",
    submit: "Submit",
    sendMessage: "Send Message",
  }
};

// Dutch translations
const nlTranslations = {
  app: {
    title: "Taxibee",
    slogan: "Taxi vlootbeheer met gemak",
    videoNoSupport: "Uw browser ondersteunt geen video tag."
  },
  homepage: {
    heroTitle: "Eenvoudig beheer van taxivloot",
    heroTitle2: "Registreer je vloot met ons",
    heroDesc: 'Geïnspireerde operaties, live gegevens en krachtige analytics voor taxibedrijven en chauffeurs',
    features: {
      title: 'Krachtige Vlootbeheer',
      feature1: {
        title: 'Live chauffeurtracker',
        content: 'Bewaar je vloot in real-time. Volg de status van de chauffeurs, beschikbaarheid en huidige bestellingen vanaf elk punt.'
      },
      feature2: {
        title: 'Uitgebreide analyse',
        content: 'Krijg waardevolle inzichten met gedetailleerde analyses over omzet, chauffeursprestaties en klanttrends.'
      },
      feature3: {
        title: 'Chauffeur Portal',
        content: 'Geef je chauffeurs toegang tot hun persoonlijke dashboard met winsten, prestaties en bestelhistorie.'
      }
    },
    footer: {
      desc: "Taxibee is een taxi vlootbeheersysteem dat een compleet beheersysteem biedt voor taxibedrijven en chauffeurs. Het biedt een reeks functies, van real-time tracking, analytics en een gebruikersvriendelijke interface voor efficiënte beheer.",
      copyright: "Taxibee. Alle rechten voorbehouden."
    }
  },
  loginPage: {
    title: "Log in op Taxibee",
    heroText: "Welkom op board!",
    backToHome: "Terug naar thuis",
    noCredError: "Ongeldige gegevens. Probeer opnieuw.",
    loading: "Laden...",
    missingInputError: "Voer gebruikersnaam en wachtwoord in",
    error: "Er is een fout opgetreden. Probeer het later opnieuw."
  },
  nav: {
    dashboard: "Dashboard",
    orders: "Ritten",
    drivers: "Chauffeurs",
    liveStatus: "Live Status",
    transactions: "Transacties",
    exactFile: "EXACT BESTAND",
    contacts: "Contacten"
  },
  auth: {
    login: "Inloggen",
    logout: "Uitloggen",
    username: "Gebruikersnaam",
    password: "Wachtwoord",
    role: "Rol",
    admin: "Beheerder",
    driver: "Chauffeur"
  },
  common: {
    loading: "Laden...",
    language: "Taal",
    english: "Engels",
    dutch: "Nederlands"
  },
  actions: {
    cancel: "Annuleren",
    save: "Opslaan",
    delete: "Verwijderen",
  },
  contactForm: {
    instruction: "Vul het onderstaande formulier in en we nemen zo spoedig mogelijk contact met u op.",
    contactUs: "Neem contact op",
    name: "Naam",
    email: "E-mail",
    message: "Bericht",
    submit: "Versturen",
    sendMessage: "Bericht verzenden",
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      nl: {
        translation: nlTranslations
      }
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;