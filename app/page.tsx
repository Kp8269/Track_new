"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Home,
  Shield,
  Bell,
  User,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  Info,
  AlertTriangle,
  Globe,
  Camera,
  Settings,
  X,
  Check,
  Smartphone,
  Watch,
} from "lucide-react"

const INDIAN_LANGUAGES = [
  { code: "en", nativeName: "English" },
  { code: "hi", nativeName: "हिंदी" },
  { code: "bn", nativeName: "বাংলা" },
  { code: "te", nativeName: "తెలుగు" },
  { code: "ta", nativeName: "தமிழ்" },
]

type Screen =
  | "welcome"
  | "login"
  | "register"
  | "map"
  | "safety-zones"
  | "alerts"
  | "faq"
  | "contact"
  | "profile"
  | "devices"

interface MapLocation {
  id: string
  name: string
  x: number
  y: number
  type: "safe" | "caution" | "danger" | "poi"
  description?: string
}

interface Device {
  id: string
  name: string
  type: "phone" | "watch" | "tracker" | "emergency-button"
  batteryLevel: number
  isOnline: boolean
  lastSeen: string
  location?: string
  owner: string
}

const translations = {
  en: {
    appName: "TrackMate",
    tagline: "Your safety, our priority.",
    subtitle: "Explore with confidence.",
    selectLanguage: "Select Language",
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    dontHaveAccount: "Don't have an account? Sign Up",
    alreadyHaveAccount: "Already have an account? Login",
    safeTravel: "Safe Travels",
    searchLocation: "Search for a location",
    liveLocationSharing: "Live Location Sharing",
    sharingActive: "Sharing active",
    devices: "Devices",
    alerts: "Alerts",
    profile: "Profile",
    home: "Home",
    safetyZones: "Safety Zones",
    predefinedZones: "Predefined Zones",
    customZones: "Custom Zones",
    today: "Today",
    yesterday: "Yesterday",
    faq: "Frequently Asked Questions",
    contactSupport: "Contact Support",
    helpSupport: "Help & Support",
    myDevices: "My Devices",
    connectedDevices: "Connected Devices",
    batteryLevel: "Battery Level",
    online: "Online",
    offline: "Offline",
    lastSeen: "Last seen",
    locate: "Locate",
    settings: "Settings",
  },
  hi: {
    appName: "ट्रैकमेट",
    tagline: "आपकी सुरक्षा, हमारी प्राथमिकता।",
    subtitle: "विश्वास के साथ अन्वेषण करें।",
    selectLanguage: "भाषा चुनें",
    login: "लॉगिन",
    register: "पंजीकरण",
    email: "ईमेल",
    password: "पासवर्ड",
    fullName: "पूरा नाम",
    phoneNumber: "फोन नंबर",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    forgotPassword: "पासवर्ड भूल गए?",
    dontHaveAccount: "खाता नहीं है? साइन अप करें",
    alreadyHaveAccount: "पहले से खाता है? लॉगिन करें",
    safeTravel: "सुरक्षित यात्रा",
    searchLocation: "स्थान खोजें",
    liveLocationSharing: "लाइव स्थान साझाकरण",
    sharingActive: "साझाकरण सक्रिय",
    devices: "उपकरण",
    alerts: "अलर्ट",
    profile: "प्रोफ़ाइल",
    home: "होम",
    safetyZones: "सुरक्षा क्षेत्र",
    predefinedZones: "पूर्वनिर्धारित क्षेत्र",
    customZones: "कस्टम क्षेत्र",
    today: "आज",
    yesterday: "कल",
    faq: "अक्सर पूछे जाने वाले प्रश्न",
    contactSupport: "सहायता संपर्क",
    helpSupport: "सहायता और समर्थन",
    myDevices: "मेरे उपकरण",
    connectedDevices: "जुड़े उपकरण",
    batteryLevel: "बैटरी स्तर",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन",
    lastSeen: "अंतिम बार देखा गया",
    locate: "खोजें",
    settings: "सेटिंग्स",
  },
  bn: {
    appName: "ট্র্যাকমেট",
    tagline: "আপনার নিরাপত্তা, আমাদের অগ্রাধিকার।",
    subtitle: "আত্মবিশ্বাসের সাথে অন্বেষণ করুন।",
    selectLanguage: "ভাষা নির্বাচন করুন",
    login: "লগইন",
    register: "নিবন্ধন",
    email: "ইমেইল",
    password: "পাসওয়ার্ড",
    fullName: "পূর্ণ নাম",
    phoneNumber: "ফোন নম্বর",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    dontHaveAccount: "অ্যাকাউন্ট নেই? সাইন আপ করুন",
    alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন",
    safeTravel: "নিরাপদ ভ্রমণ",
    searchLocation: "অবস্থান খুঁজুন",
    liveLocationSharing: "লাইভ অবস্থান শেয়ারিং",
    sharingActive: "শেয়ারিং সক্রিয়",
    devices: "ডিভাইস",
    alerts: "সতর্কতা",
    profile: "প্রোফাইল",
    home: "হোম",
    safetyZones: "নিরাপত্তা অঞ্চল",
    predefinedZones: "পূর্বনির্ধারিত অঞ্চল",
    customZones: "কাস্টম অঞ্চল",
    today: "আজ",
    yesterday: "গতকাল",
    faq: "প্রায়শই জিজ্ঞাসিত প্রশ্ন",
    contactSupport: "সহায়তা যোগাযোগ",
    helpSupport: "সহায়তা এবং সমর্থন",
    myDevices: "আমার ডিভাইস",
    connectedDevices: "সংযুক্ত ডিভাইস",
    batteryLevel: "ব্যাটারি স্তর",
    online: "অনলাইন",
    offline: "অফলাইন",
    lastSeen: "শেষ দেখা",
    locate: "খুঁজুন",
    settings: "সেটিংস",
  },
  te: {
    appName: "ట్రాక్‌మేట్",
    tagline: "మీ భద్రత, మా ప్రాధాన్యత.",
    subtitle: "విశ్వాసంతో అన్వేషించండి.",
    selectLanguage: "భాష ఎంచుకోండి",
    login: "లాగిన్",
    register: "నమోదు",
    email: "ఇమెయిల్",
    password: "పాస్‌వర్డ్",
    fullName: "పూర్తి పేరు",
    phoneNumber: "ఫోన్ నంబర్",
    confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి",
    forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
    dontHaveAccount: "ఖాతా లేదా? సైన్ అప్ చేయండి",
    alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా? లాగిన్ చేయండి",
    safeTravel: "సురక్షిత ప్రయాణం",
    searchLocation: "స్థానం వెతకండి",
    liveLocationSharing: "లైవ్ లొకేషన్ షేరింగ్",
    sharingActive: "షేరింగ్ చురుకుగా ఉంది",
    devices: "పరికరాలు",
    alerts: "హెచ్చరికలు",
    profile: "ప్రొఫైల్",
    home: "హోమ్",
    safetyZones: "భద్రతా మండలాలు",
    predefinedZones: "ముందుగా నిర్వచించిన మండలాలు",
    customZones: "కస్టమ్ మండలాలు",
    today: "ఈరోజు",
    yesterday: "నిన్న",
    faq: "తరచుగా అడిగే ప్రశ్నలు",
    contactSupport: "మద్దతు సంప్రదింపులు",
    helpSupport: "సహాయం మరియు మద్దతు",
    myDevices: "నా పరికరాలు",
    connectedDevices: "కనెక్ట్ చేయబడిన పరికరాలు",
    batteryLevel: "బ్యాటరీ స్థాయి",
    online: "ఆన్‌లైన్",
    offline: "ఆఫ్‌లైన్",
    lastSeen: "చివరిసారి చూసినది",
    locate: "గుర్తించండి",
    settings: "సెట్టింగ్‌లు",
  },
  ta: {
    appName: "ட்ராக்மேட்",
    tagline: "உங்கள் பாதுகாப்பு, எங்கள் முன்னுரிமை.",
    subtitle: "நம்பிக்கையுடன் ஆராயுங்கள்.",
    selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    login: "உள்நுழைய",
    register: "பதிவு",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    fullName: "முழு பெயர்",
    phoneNumber: "தொலைபேசி எண்",
    confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    forgotPassword: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
    dontHaveAccount: "கணக்கு இல்லையா? பதிவு செய்யவும்",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்",
    safeTravel: "பாதுகாப்பான பயணம்",
    searchLocation: "இடத்தைத் தேடுங்கள்",
    liveLocationSharing: "நேரடி இடப் பகிர்வு",
    sharingActive: "பகிர்வு செயலில் உள்ளது",
    devices: "சாதனங்கள்",
    alerts: "எச்சரிக்கைகள்",
    profile: "சுயவிவரம்",
    home: "முகப்பு",
    safetyZones: "பாதுகாப்பு மண்டலங்கள்",
    predefinedZones: "முன்னரே வரையறுக்கப்பட்ட மண்டலங்கள்",
    customZones: "தனிப்பயன் மண்டலங்கள்",
    today: "இன்று",
    yesterday: "நேற்று",
    faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    contactSupport: "ஆதரவு தொடர்பு",
    helpSupport: "உதவி மற்றும் ஆதரவு",
    myDevices: "எனது சாதனங்கள்",
    connectedDevices: "இணைக்கப்பட்ட சாதனங்கள்",
    batteryLevel: "பேட்டரி நிலை",
    online: "ஆன்லைன்",
    offline: "ஆஃப்லைன்",
    lastSeen: "கடைசியாக பார்த்தது",
    locate: "கண்டறியவும்",
    settings: "அமைப்புகள்",
  },
}

const LOGO_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Trackmate.jpg-pbKhdKAf9oLHbt7xfI1PdWdY71VGxm.jpeg"

export default function TrackMateApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showAddLocationModal, setShowAddLocationModal] = useState(false)

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const t = (key: string) => {
    return (
      translations[selectedLanguage as keyof typeof translations]?.[key as keyof typeof translations.en] ||
      translations.en[key as keyof typeof translations.en] ||
      key
    )
  }

  const [newLocationName, setNewLocationName] = useState("")
  const [newLocationDescription, setNewLocationDescription] = useState("")
  const [selectedLocationSafety, setSelectedLocationSafety] = useState<"safe" | "caution" | "danger">("safe")

  const [mapLocations, setMapLocations] = useState<MapLocation[]>([
    { id: "1", name: "Central Park", x: 200, y: 200, type: "safe", description: "Well-patrolled public park" },
    { id: "2", name: "Times Square", x: 150, y: 350, type: "caution", description: "Crowded tourist area" },
    { id: "3", name: "Construction Zone", x: 300, y: 280, type: "danger", description: "Active construction site" },
    { id: "4", name: "Police Station", x: 180, y: 120, type: "poi", description: "Local police station" },
    { id: "5", name: "Hospital", x: 320, y: 180, type: "poi", description: "Emergency medical services" },
  ])

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    confirmPassword: "",
    subject: "",
    message: "",
  })

  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    language: "en",
    emergencyContact: "+91 98765 43211",
    address: "123 Main Street, New Delhi, India",
  })

  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "John's iPhone",
      type: "phone",
      batteryLevel: 85,
      isOnline: true,
      lastSeen: "2 minutes ago",
      location: "Central Park",
      owner: "John Doe",
    },
    {
      id: "2",
      name: "Sarah's Apple Watch",
      type: "watch",
      batteryLevel: 42,
      isOnline: true,
      lastSeen: "5 minutes ago",
      location: "Times Square",
      owner: "Sarah Smith",
    },
    {
      id: "3",
      name: "GPS Tracker #1",
      type: "tracker",
      batteryLevel: 15,
      isOnline: false,
      lastSeen: "2 hours ago",
      location: "Brooklyn Bridge",
      owner: "Mike Johnson",
    },
    {
      id: "4",
      name: "Emergency Button",
      type: "emergency-button",
      batteryLevel: 78,
      isOnline: true,
      lastSeen: "1 minute ago",
      location: "Home",
      owner: "Emma Wilson",
    },
  ])

  const addNewLocation = () => {
    if (newLocationName.trim()) {
      const newLocation: MapLocation = {
        id: Date.now().toString(),
        name: newLocationName,
        x: 200 + Math.random() * 100 - 50,
        y: 250 + Math.random() * 100 - 50,
        type: selectedLocationSafety,
        description: newLocationDescription || undefined,
      }
      setMapLocations([...mapLocations, newLocation])
      setNewLocationName("")
      setNewLocationDescription("")
      setSelectedLocationSafety("safe")
      setShowAddLocationModal(false)
    }
  }

  const getSafetyColor = (type: string) => {
    switch (type) {
      case "safe":
        return "#10B981"
      case "caution":
        return "#F59E0B"
      case "danger":
        return "#EF4444"
      case "poi":
        return "#6366F1"
      default:
        return "#6B7280"
    }
  }

  const getSafetyLabel = (type: string) => {
    switch (type) {
      case "safe":
        return "Safe Zone"
      case "caution":
        return "Caution Zone"
      case "danger":
        return "Danger Zone"
      case "poi":
        return "Point of Interest"
      default:
        return "Unknown"
    }
  }

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 safe-area-inset-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button
          onClick={() => setCurrentScreen("map")}
          className={`flex flex-col items-center p-3 rounded-lg transition-colors min-w-[60px] ${
            currentScreen === "map" ? "text-teal-600 bg-teal-50" : "text-gray-500"
          }`}
        >
          <Home size={22} />
          <span className="text-xs mt-1 font-medium">{t("home")}</span>
        </button>
        <button
          onClick={() => setCurrentScreen("devices")}
          className={`flex flex-col items-center p-3 rounded-lg transition-colors min-w-[60px] ${
            currentScreen === "devices" ? "text-teal-600 bg-teal-50" : "text-gray-500"
          }`}
        >
          <Smartphone size={22} />
          <span className="text-xs mt-1 font-medium">{t("devices")}</span>
        </button>
        <button
          onClick={() => setCurrentScreen("safety-zones")}
          className={`flex flex-col items-center p-3 rounded-lg transition-colors min-w-[60px] ${
            currentScreen === "safety-zones" ? "text-teal-600 bg-teal-50" : "text-gray-500"
          }`}
        >
          <Shield size={22} />
          <span className="text-xs mt-1 font-medium">{t("safetyZones")}</span>
        </button>
        <button
          onClick={() => setCurrentScreen("alerts")}
          className={`flex flex-col items-center p-3 rounded-lg transition-colors min-w-[60px] ${
            currentScreen === "alerts" ? "text-teal-600 bg-teal-50" : "text-gray-500"
          }`}
        >
          <Bell size={22} />
          <span className="text-xs mt-1 font-medium">{t("alerts")}</span>
        </button>
        <button
          onClick={() => setCurrentScreen("profile")}
          className={`flex flex-col items-center p-3 rounded-lg transition-colors min-w-[60px] ${
            currentScreen === "profile" ? "text-teal-600 bg-teal-50" : "text-gray-500"
          }`}
        >
          <User size={22} />
          <span className="text-xs mt-1 font-medium">{t("profile")}</span>
        </button>
      </div>
    </div>
  )

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6">
            <img
              src={LOGO_URL || "/placeholder.svg"}
              alt="TrackMate Logo"
              className="w-full h-full object-contain drop-shadow-lg"
              onError={(e) => {
                console.log("[v0] Logo failed to load, using fallback")
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23059669'%3E%3Cpath d='M12 1l9 4v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V5l9-4z'/%3E%3C/svg%3E"
              }}
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t("appName")}</h1>
          <h2 className="text-xl text-gray-600 mb-4">{t("tagline")}</h2>
          <p className="text-gray-500 text-lg">{t("subtitle")}</p>
        </div>

        <div className="mb-4 w-full max-w-sm">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <Globe size={16} />
                    <span>{lang.nativeName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => setCurrentScreen("login")}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            {t("login")}
          </button>
          <button
            onClick={() => setCurrentScreen("register")}
            className="w-full border border-teal-600 text-teal-600 py-3 rounded-lg font-medium hover:bg-teal-50 transition-colors"
          >
            {t("register")}
          </button>
        </div>
      </div>
    </div>
  )

  const LoginScreen = () => (
    <div className="min-h-screen bg-white flex flex-col justify-center p-6">
      <div className="text-center mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4">
              <img
                src={LOGO_URL || "/placeholder.svg"}
                alt="TrackMate Logo"
                className="w-full h-full object-contain drop-shadow-md"
                onError={(e) => {
                  console.log("[v0] Logo failed to load on login screen")
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23059669'%3E%3Cpath d='M12 1l9 4v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V5l9-4z'/%3E%3C/svg%3E"
                }}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("appName")}</h2>
            <p className="text-gray-600">
              {t("tagline")} {t("subtitle")}
            </p>
          </div>

          <div className="mb-4">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <Globe size={16} />
                      <span>{lang.nativeName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <input
                type="email"
                placeholder={t("email")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder={t("password")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen("map")}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors mb-4"
          >
            {t("login")}
          </button>

          <div className="text-center space-y-2">
            <p className="text-teal-600 text-sm">{t("forgotPassword")}</p>
            <p className="text-gray-600 text-sm">
              {t("dontHaveAccount")}{" "}
              <button onClick={() => setCurrentScreen("register")} className="text-teal-600 font-medium">
                {t("register")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const RegisterScreen = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex items-center p-4 border-b bg-white">
        <button onClick={() => setCurrentScreen("login")}>
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div className="flex-1 flex justify-center">
          <img src={LOGO_URL || "/placeholder.svg"} alt="TrackMate Logo" className="w-8 h-8 object-contain" />
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t("appName")}</h2>
          <p className="text-gray-600">
            {t("tagline")} {t("subtitle")}
          </p>
        </div>

        <div className="mb-4">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <Globe size={16} />
                    <span>{lang.nativeName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <Input
              placeholder={t("fullName")}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div>
            <Input
              placeholder={t("phoneNumber")}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <Input placeholder="Aadhaar Number / Passport Number" />
          </div>
          <div>
            <Input
              type="password"
              placeholder={t("password")}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder={t("confirmPassword")}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>
        </div>

        <Button
          onClick={() => setCurrentScreen("map")}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 mb-6"
        >
          {t("register")}
        </Button>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Your Unique ID</h3>
          <p className="text-sm text-gray-600">Your unique ID will be displayed here after successful registration.</p>
        </div>

        <div className="text-center mt-6">
          <button onClick={() => setCurrentScreen("login")} className="text-sm text-gray-500">
            {t("alreadyHaveAccount")}
          </button>
        </div>
      </div>
    </div>
  )

  const MapScreen = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URL || "/placeholder.svg"}
            alt="TrackMate Logo"
            className="w-10 h-10 object-contain"
            onError={(e) => {
              console.log("[v0] Header logo failed to load")
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23059669'%3E%3Cpath d='M12 1l9 4v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V5l9-4z'/%3E%3C/svg%3E"
            }}
          />
          <h1 className="text-xl font-bold text-gray-900">{t("safeTravel")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-sm text-gray-600">{t("online")}</span>
        </div>
      </div>

      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
          <svg className="w-full h-full" viewBox="0 0 400 600">
            <rect width="400" height="600" fill="url(#mapGradient)" />

            <path d="M50 200 Q150 180 250 200 T350 220" stroke="#4A90E2" strokeWidth="8" fill="none" opacity="0.6" />
            <path d="M100 400 Q200 380 300 400" stroke="#4A90E2" strokeWidth="6" fill="none" opacity="0.4" />

            <line x1="0" y1="150" x2="400" y2="150" stroke="#666" strokeWidth="3" opacity="0.3" />
            <line x1="0" y1="300" x2="400" y2="300" stroke="#666" strokeWidth="4" opacity="0.3" />
            <line x1="0" y1="450" x2="400" y2="450" stroke="#666" strokeWidth="3" opacity="0.3" />
            <line x1="150" y1="0" x2="150" y2="600" stroke="#666" strokeWidth="3" opacity="0.3" />
            <line x1="250" y1="0" x2="250" y2="600" stroke="#666" strokeWidth="4" opacity="0.3" />

            {mapLocations.map((location) => (
              <g key={location.id}>
                {(location.type === "safe" || location.type === "caution" || location.type === "danger") && (
                  <circle
                    cx={location.x}
                    cy={location.y}
                    r="50"
                    fill={getSafetyColor(location.type)}
                    fillOpacity="0.2"
                    stroke={getSafetyColor(location.type)}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                )}
                <circle
                  cx={location.x}
                  cy={location.y}
                  r="8"
                  fill={getSafetyColor(location.type)}
                  className="cursor-pointer"
                />
              </g>
            ))}

            <circle cx="200" cy="250" r="12" fill="#FFFFFF" stroke="#10B981" strokeWidth="3" />
            <circle cx="200" cy="250" r="6" fill="#10B981" />

            <circle cx="200" cy="250" r="20" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.5">
              <animate attributeName="r" values="20;35;20" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
            </circle>

            <defs>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0F2FE" />
                <stop offset="50%" stopColor="#F0FDF4" />
                <stop offset="100%" stopColor="#ECFDF5" />
              </linearGradient>
            </defs>
          </svg>

          {mapLocations.map((location) => (
            <div
              key={`label-${location.id}`}
              className="absolute bg-white/90 px-2 py-1 rounded text-xs font-medium shadow-sm"
              style={{
                left: `${(location.x / 400) * 100}%`,
                top: `${(location.y / 600) * 100}%`,
                transform: "translate(-50%, -100%)",
                color: getSafetyColor(location.type),
              }}
            >
              {location.name}
            </div>
          ))}

          <div className="absolute top-48 left-32 bg-white/90 px-2 py-1 rounded text-xs font-medium text-teal-700">
            📍 You are here
          </div>
        </div>

        <div className="absolute bottom-20 right-4">
          <button
            onClick={() => setShowAddLocationModal(true)}
            className="bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="absolute bottom-20 left-4 bg-white rounded-lg p-3 shadow-sm">
          <p className="text-sm font-medium text-gray-900">{t("liveLocationSharing")}</p>
          <p className="text-xs text-gray-500">{t("sharingActive")} • New York</p>
        </div>
      </div>

      {showAddLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Location</h3>
              <button onClick={() => setShowAddLocationModal(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                <Input
                  placeholder="Enter location name"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Safety Level</label>
                <Select
                  value={selectedLocationSafety}
                  onValueChange={(value: "safe" | "caution" | "danger") => setSelectedLocationSafety(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safe">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span>Safe Zone</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="caution">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span>Caution Zone</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="danger">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>Danger Zone</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <Textarea
                  placeholder="Add details about this location"
                  value={newLocationDescription}
                  onChange={(e) => setNewLocationDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={addNewLocation}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={!newLocationName.trim()}
                >
                  <Check size={16} className="mr-2" />
                  Add Location
                </Button>
                <Button onClick={() => setShowAddLocationModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )

  const DevicesScreen = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white p-4 border-b flex items-center">
        <button onClick={() => setCurrentScreen("map")} className="mr-3">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <img src={LOGO_URL || "/placeholder.svg"} alt="TrackMate Logo" className="w-6 h-6 object-contain" />
          <h1 className="text-xl font-bold text-gray-900">{t("devices")}</h1>
        </div>
      </div>

      <div className="flex-1 p-4 pb-20">
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-teal-800 font-medium">{devices.filter((d) => d.isOnline).length} devices online</span>
            <span className="text-teal-600 text-sm">{devices.length} total devices</span>
          </div>
        </div>

        <div className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {device.type === "phone" && <Smartphone size={20} className="text-gray-600" />}
                    {device.type === "watch" && <Watch size={20} className="text-gray-600" />}
                    {device.type === "tracker" && <MapPin size={20} className="text-gray-600" />}
                    {device.type === "emergency-button" && <AlertTriangle size={20} className="text-gray-600" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{device.name}</h3>
                    <p className="text-sm text-gray-500">{device.owner}</p>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    device.isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {device.isOnline ? t("online") : t("offline")}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t("batteryLevel")}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          device.batteryLevel > 50
                            ? "bg-green-500"
                            : device.batteryLevel > 20
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${device.batteryLevel}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        device.batteryLevel > 50
                          ? "text-green-600"
                          : device.batteryLevel > 20
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {device.batteryLevel}%
                    </span>
                  </div>
                </div>

                {device.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="text-sm text-gray-900">{device.location}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t("lastSeen")}</span>
                  <span className="text-sm text-gray-900">{device.lastSeen}</span>
                </div>
              </div>

              <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
                <button className="flex-1 bg-teal-50 text-teal-600 py-2 px-3 rounded-lg text-sm font-medium">
                  {t("locate")}
                </button>
                <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium">
                  {t("settings")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )

  const SafetyZonesScreen = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white p-4 border-b flex items-center">
        <button onClick={() => setCurrentScreen("map")} className="mr-3">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <img src={LOGO_URL || "/placeholder.svg"} alt="TrackMate Logo" className="w-6 h-6 object-contain" />
          <h1 className="text-xl font-bold text-gray-900">{t("safetyZones")}</h1>
        </div>
      </div>

      <div className="flex-1 p-4 pb-20">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t("predefinedZones")}</h2>
          <div className="space-y-3">
            {[
              { name: "India Gate", location: "New Delhi", status: "safe" },
              { name: "Gateway of India", location: "Mumbai", status: "safe" },
              { name: "Connaught Place", location: "New Delhi", status: "caution" },
              { name: "Marine Drive", location: "Mumbai", status: "safe" },
              { name: "Charminar", location: "Hyderabad", status: "safe" },
              { name: "City Palace", location: "Jaipur", status: "safe" },
            ].map((zone, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border flex items-center">
                <MapPin size={20} className="text-teal-600 mr-3" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{zone.name}</h3>
                  <p className="text-sm text-gray-500">{zone.location}</p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    zone.status === "safe" ? "bg-green-500" : zone.status === "caution" ? "bg-yellow-500" : "bg-red-500"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t("customZones")}</h2>
          <div className="space-y-3">
            {mapLocations
              .filter((location) => location.type !== "poi")
              .map((zone) => (
                <div key={zone.id} className="bg-white p-4 rounded-lg border flex items-center">
                  <MapPin size={20} className="text-teal-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{zone.name}</h3>
                    <p className="text-sm text-gray-500">{zone.description || getSafetyLabel(zone.type)}</p>
                  </div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getSafetyColor(zone.type) }} />
                </div>
              ))}
          </div>
        </div>

        <button
          onClick={() => setShowAddLocationModal(true)}
          className="fixed bottom-24 right-4 bg-teal-600 text-white p-3 rounded-full shadow-lg"
        >
          <Plus size={24} />
        </button>
      </div>

      <BottomNav />
    </div>
  )

  const AlertsScreen = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white p-4 border-b flex items-center">
        <button onClick={() => setCurrentScreen("map")} className="mr-3">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <img src={LOGO_URL || "/placeholder.svg"} alt="TrackMate Logo" className="w-6 h-6 object-contain" />
          <h1 className="text-xl font-bold text-gray-900">{t("alerts")}</h1>
        </div>
      </div>

      <div className="flex-1 p-4 pb-20">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t("today")}</h2>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg border-l-4 border-l-blue-500">
              <div className="flex items-start">
                <Info size={20} className="text-blue-500 mr-3 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Informational: Road Closure</h3>
                  <p className="text-sm text-gray-500 mt-1">10:30 AM</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-l-yellow-500">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-yellow-500 mr-3 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Warning: High Traffic</h3>
                  <p className="text-sm text-gray-500 mt-1">09:15 AM</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-l-red-500">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-red-500 mr-3 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Critical: Emergency Situation</h3>
                  <p className="text-sm text-gray-500 mt-1">08:45 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t("yesterday")}</h2>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg border-l-4 border-l-blue-500">
              <div className="flex items-start">
                <Info size={20} className="text-blue-500 mr-3 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Informational: Event Nearby</h3>
                  <p className="text-sm text-gray-500 mt-1">2:15 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-l-yellow-500">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-yellow-500 mr-3 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Warning: Moderate Traffic</h3>
                  <p className="text-sm text-gray-500 mt-1">10:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )

  const FAQScreen = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex items-center p-4 bg-white border-b">
        <button onClick={() => setCurrentScreen("alerts")}>
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold ml-4">{t("helpSupport")}</h1>
      </div>

      <div className="flex-1 p-4 pb-20">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("faq")}</h2>

        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              placeholder="Search FAQs"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white"
            />
          </div>
        </div>

        <div className="space-y-3">
          {[
            "How does the app ensure my safety?",
            "What should I do in case of an emergency?",
            "How do I report an incident?",
            "Can I use the app offline?",
            "How do I update my profile information?",
          ].map((question, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <p className="text-gray-900 font-medium">{question}</p>
                <ChevronDown size={20} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button
            onClick={() => setCurrentScreen("contact")}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            {t("contactSupport")}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )

  const ContactScreen = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex items-center p-4 bg-white border-b">
        <button onClick={() => setCurrentScreen("faq")}>
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold ml-4">{t("helpSupport")}</h1>
      </div>

      <div className="flex-1 p-4 pb-20">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("contactSupport")}</h2>

        <div className="space-y-4 mb-6">
          <div className="bg-white p-4 rounded-lg border flex items-center">
            <Mail size={20} className="text-teal-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-500">support@trackmate.com</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border flex items-center">
            <Phone size={20} className="text-teal-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Phone</p>
              <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border flex items-center">
            <MessageCircle size={20} className="text-teal-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">In-App Messaging</p>
              <p className="text-sm text-gray-500">Chat with a support agent</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Form</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <Input
                placeholder="Enter subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <Textarea
                placeholder="Enter your message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
              />
            </div>

            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Send</Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )

  const ProfileScreen = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white p-4 border-b flex items-center">
        <button onClick={() => setCurrentScreen("map")} className="mr-3">
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <img src={LOGO_URL || "/placeholder.svg"} alt="TrackMate Logo" className="w-6 h-6 object-contain" />
          <h1 className="text-xl font-bold text-gray-900">{t("profile")}</h1>
        </div>
      </div>

      <div className="flex-1 p-4 pb-20">
        <div className="bg-white rounded-lg p-6 mb-4 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-teal-600" />
            </div>
            {isEditingProfile && (
              <button className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-1 rounded-full">
                <Camera size={12} />
              </button>
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{profileData.fullName}</h2>
          <p className="text-gray-500">TrackMate User</p>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditingProfile ? (
                <Input
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                />
              ) : (
                <p className="text-gray-900">{profileData.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditingProfile ? (
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              ) : (
                <p className="text-gray-900">{profileData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              {isEditingProfile ? (
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              ) : (
                <p className="text-gray-900">{profileData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              {isEditingProfile ? (
                <Select
                  value={profileData.language}
                  onValueChange={(value) => {
                    setProfileData({ ...profileData, language: value })
                    setSelectedLanguage(value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          <Globe size={16} />
                          <span>{lang.nativeName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-gray-900">
                  {INDIAN_LANGUAGES.find((lang) => lang.code === profileData.language)?.nativeName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
              {isEditingProfile ? (
                <Input
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                />
              ) : (
                <p className="text-gray-900">{profileData.emergencyContact}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              {isEditingProfile ? (
                <Textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-gray-900">{profileData.address}</p>
              )}
            </div>
          </div>

          {isEditingProfile && (
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              >
                Save Changes
              </Button>
              <Button onClick={() => setIsEditingProfile(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>

          <div className="space-y-3">
            <button
              onClick={() => setCurrentScreen("faq")}
              className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-gray-600" />
                <span className="text-gray-900">Help & Support</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-gray-600" />
                <span className="text-gray-900">Privacy Settings</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-600" />
                <span className="text-gray-900">Notification Settings</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return <WelcomeScreen />
      case "login":
        return <LoginScreen />
      case "register":
        return <RegisterScreen />
      case "map":
        return <MapScreen />
      case "devices":
        return <DevicesScreen />
      case "safety-zones":
        return <SafetyZonesScreen />
      case "alerts":
        return <AlertsScreen />
      case "faq":
        return <FAQScreen />
      case "contact":
        return <ContactScreen />
      case "profile":
        return <ProfileScreen />
      default:
        return <WelcomeScreen />
    }
  }

  return <div className="max-w-md mx-auto bg-white min-h-screen relative overflow-hidden">{renderScreen()}</div>
}
