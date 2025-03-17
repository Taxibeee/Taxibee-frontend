import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage';

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
  },
  adminSidebar: {
    dashboard: "Dashboard",
    orders: "Orders",
    drivers: "Drivers",
    liveStatus: "Live Status",
    transactions: "Transactions",
    exactFile: "EXACT FILE",
    contacts: "Contacts"
  },
  adminDashboard: {
    pageNotFound: "Page not found",
    summaryCards: {
      weeklySummary: "Weekly Summary",
      totalRevenue: "Total Revenue",
      totalOrders: "Total Orders",
      totalDistance: "Total Distance",
      failedToLoadData: "Failed to load data",
      averageRevenuePerOrder: "Average Revenue Per Order",
    }
  },
  adminContactsPage: {
    contacts: "Contacts"
  },
  adminTransactionsPage: {
    transactions: "Transactions"
  },
  adminOrdersPage: {
    orders: "Orders",
    date: "Date",
    pickup: "Pickup",
    price: "Price",
    netEarnings: "Net Earnings",
    payment: "Payment",
    status: "Status"
  },
  adminLiveStatusPage: {
    liveStatus: "Live Status"
  },
  adminDriversPage: {
    drivers: "Drivers",
    active: "Active",
    inActive: "InActive",
    status: "Status",
    driver: "Driver",
    phone: "Phone",
    email: "Email",
    chauffeurskaartnr: "Chauffeurs Kaartnr",
    taxibeeId: "Taxibee ID",
    fullName: "Full Name",
    reason: "Reason",
    inactivityReason: "Inactivity Reason",
    todayTerminalName: "Today Terminal Name",
    exactDebnr: "Exact Debnr",
    myposOperatorCode: "MyPOS Operator Code",
    driverDetails: "Driver Details",
    personalInformation: "Personal Information",
    systemInformation: "System Information",
    noDriversFound: "No drivers found",
    loading: "Loading...",
    failedToLoadData: "Failed to load data",
    search: "Search",
    searchPlaceholder: "Search by name or phone number",
    searchNoResults: "No results found",
    searchNoDrivers: "No drivers found",
    searchNoOrders: "No orders found",
    searchNoResultsDesc: "Try adjusting your search criteria or check for typos.",
    searchNoResultsDesc2: "Please try a different search term or contact support for assistance.",
    selectADriver: "Select a driver to view details",
    selectADriverText: "Click on any driver from the list on the left to view their profile information and order history."
  },
  adminExactFilePage: {
    exactFile: "EXACT FILE"
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
  },
  adminSidebar: {
    dashboard: "Dashboard",
    orders: "Ritten",
    drivers: "Chauffeurs",
    liveStatus: "Live Status",
    transactions: "Transacties",
    exactFile: "EXACT BESTAND",
    contacts: "Contacten"
  },
  adminDashboard: {
    pageNotFound: "Pagina niet gevonden",
    summaryCards: {
      weeklySummary: "Wekelijks Samenvatting",
      totalRevenue: "Totale Omzet",
      totalOrders: "Totaal aantal bestellingen",
      totalDistance: "Totale afstand",
      failedToLoadData: "Data niet geladen",
      averageRevenuePerOrder: "Gemiddelde omzet per bestelling",
    }
  },
  adminContactsPage: {
    contacts: "Contacten"
  },
  adminTransactionsPage: {
    transactions: "Transacties"
  },
  adminOrdersPage: {
    orders: "Ritten",
    date: "Datum",
    pickup: "Pick-up",
    price: "Prijs",
    netEarnings: "Netto Omzet",
    payment: "Betaling",
    status: "Status"
  },
  adminLiveStatusPage: {
    liveStatus: "Live Status"
  },
  adminDriversPage: {
    drivers: "Chauffeurs",
    active: "Actief",
    inActive: "Inactief",
    status: "Status",
    driver: "Chauffeur",
    phone: "Telefoon",
    email: "E-mail",
    reason: "Reden",
    inactivityReason: "Inactiviteitsreden",
    todayTerminalName: "Vandaag Terminal Naam",
    exactDebnr: "Exact Debnr",
    myposOperatorCode: "MyPOS Operator Code",
    driverDetails: "Chauffeur Details",
    chauffeurskaartnr: "Chauffeurskaartnr",
    taxibeeId: "Taxibee ID",
    fullName: "Volledige naam",
    personalInformation: "Persoonlijke informatie",
    systemInformation: "Systeem informatie",
    noDriversFound: "Geen chauffeurs gevonden",
    loading: "Laden...",
    failedToLoadData: "Data niet geladen",
    search: "Zoeken",
    searchPlaceholder: "Zoek op naam of telefoonnummer",
    searchNoResults: "Geen resultaten gevonden",
    searchNoDrivers: "Geen chauffeurs gevonden",
    searchNoResultsDesc: "Probeer uw zoekopdracht te verbeteren of controleer uw zoekopdracht.",
    searchNoResultsDesc2: "Probeer een andere zoekopdracht of neem contact op met ons voor hulp.",
    selectADriver: "Selecteer een chauffeur om details te bekijken",
    selectADriverText: "Klik op een chauffeur in de lijst links om zijn persoonlijke informatie en bestelhistorie te bekijken."
  },
  adminExactFilePage: {
    exactFile: "EXACT BESTAND"
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