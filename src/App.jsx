import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  ShoppingBag,
  Sparkles,
  Calendar,
  Clock,
  Check,
  X,
  ArrowUpRight,
  Star,
  MapPin,
  Phone,
  Instagram,
  Scissors,
  Lock,
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  Download,
  Upload,
  LogOut,
  MessageCircle,
  Settings,
  Layers,
  Image as ImageIcon,
  Sun,
  Moon,
  Type
} from 'lucide-react';

const DEFAULT_CONFIG = {
  brandName: 'LUMIÈRE',
  brandTagline: 'Hair & Beauty',
  heroBadge: 'Haute Coiffure & Aesthetics',
  heroTitleLine1: 'Your Beauty,',
  heroTitleLine2: 'Your Moment',
  heroSubtitle: 'Role a página para explorar nossos rituais exclusivos de beleza, colorimetria de luxo e cuidados personalizados.',
  heroVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  aboutTitle: 'Onde a precisão técnica encontra a arte da elegância.',
  aboutDescription: 'Cada detalhe do Lumière Hair & Beauty foi projetado para desacelerar o tempo. Trabalhamos com protocolos personalizados de visagismo, colorimetria internacional e tratamentos botânicos de alta performance.',
  address: 'Av. Bento de Abreu, 1240 — Araraquara, SP',
  phone: '(16) 99999-0000',
  whatsappClean: '5516999990000',
  hours: 'Terça a Sábado: 09h às 20h',
  instagram: '@lumierehairbeauty',
  themeMode: 'dark', // 'dark' ou 'light'
};

const DEFAULT_SERVICES = [
  {
    id: 1,
    category: 'Hair',
    title: 'Haircut & Couture Styling',
    duration: '60 min',
    price: 120,
    description: 'Visagismo personalizado, lavagem terapêutica com óleos essenciais e finalização de passarela.',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    category: 'Color',
    title: 'Signature Balayage',
    duration: '180 min',
    price: 340,
    description: 'Iluminação artesanal à mão livre com transição suave, proteção térmica e gloss tonalizante.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    category: 'Color',
    title: 'Luminous Gloss & Hair Color',
    duration: '120 min',
    price: 210,
    description: 'Coloração de alta definição livre de amônia para brilho espelhado e cobertura impecável.',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    category: 'Treatment',
    title: 'Ritual Kerastase Caviar',
    duration: '75 min',
    price: 190,
    description: 'Reconstrução profunda da fibra capilar com microesferas nutritivas e vapor de ozônio.',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    category: 'Bridal',
    title: 'Lumière Bridal Experience',
    duration: '240 min',
    price: 680,
    description: 'Penteado exclusivo, maquiagem blindada de alta durabilidade e teste prévio completo.',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    category: 'Hair',
    title: 'Silk Blowout & Waves',
    duration: '50 min',
    price: 95,
    description: 'Escova modelada com ondas duradouras, volume controlado e acabamento sedoso.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
  },
];

const DEFAULT_ADMIN_PASS = 'lumiere2026';

export default function App() {
  const heroContainerRef = useRef(null);

  const [siteConfig, setSiteConfig] = useState(() => {
    const saved = localStorage.getItem('lumiere_site_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('lumiere_services');
    return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('lumiere_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('lumiere_admin_pass') || DEFAULT_ADMIN_PASS;
  });

  useEffect(() => {
    localStorage.setItem('lumiere_site_config', JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    localStorage.setItem('lumiere_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('lumiere_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('lumiere_admin_pass', adminPassword);
  }, [adminPassword]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([2]);
  const [bag, setBag] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    service: services[0]?.title || 'Signature Balayage',
    date: '',
    time: '14:00',
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [adminTab, setAdminTab] = useState('services');
  const [editingService, setEditingService] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const { scrollYProgress } = useScroll({
    target: heroContainerRef,
    offset: ['start start', 'end end'],
  });

  const mediaScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.82, 1.05, 1.18]);
  const mediaBorderRadius = useTransform(scrollYProgress, [0, 0.5, 1], ['28px', '12px', '0px']);
  const titleY = useTransform(scrollYProgress, [0, 0.45], ['0%', '-65%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const leftCardX = useTransform(scrollYProgress, [0.15, 0.55, 0.95], ['-120%', '0%', '-10%']);
  const leftCardOpacity = useTransform(scrollYProgress, [0.15, 0.4, 0.85, 1], [0, 1, 1, 0]);
  const rightCardX = useTransform(scrollYProgress, [0.25, 0.65, 0.95], ['120%', '0%', '10%']);
  const rightCardOpacity = useTransform(scrollYProgress, [0.25, 0.5, 0.85, 1], [0, 1, 1, 0]);
  const overlayDarkness = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.2, 0.65]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const addToBag = (service) => {
    if (!bag.find((item) => item.id === service.id)) {
      setBag([...bag, service]);
    }
    setBookingData((prev) => ({ ...prev, service: service.title }));
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      status: 'Pendente',
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
    setBookings([newBooking, ...bookings]);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsBookingOpen(false);
    }, 2200);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      setLoginError(false);
      setPasswordInput('');
    } else {
      setLoginError(true);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 800;
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setEditingService((prev) => ({ ...prev, image: compressedBase64 }));
        showToast('Imagem carregada com sucesso!');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!editingService) return;
    if (editingService.id) {
      setServices(services.map((s) => (s.id === editingService.id ? editingService : s)));
      showToast('Serviço atualizado com sucesso!');
    } else {
      const created = { ...editingService, id: Date.now() };
      setServices([...services, created]);
      showToast('Novo serviço adicionado ao catálogo!');
    }
    setEditingService(null);
  };

  const handleDeleteService = (id) => {
    setServices(services.filter((s) => s.id !== id));
    showToast('Serviço removido.');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Deseja restaurar todos os textos e serviços originais?')) {
      setSiteConfig(DEFAULT_CONFIG);
      setServices(DEFAULT_SERVICES);
      showToast('Conteúdo padrão restaurado!');
    }
  };

  const handleExportBackup = () => {
    const data = JSON.stringify({ siteConfig, services, bookings }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-lumiere-site.json';
    a.click();
    showToast('Backup baixado com sucesso!');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.siteConfig) setSiteConfig(parsed.siteConfig);
        if (parsed.services) setServices(parsed.services);
        if (parsed.bookings) setBookings(parsed.bookings);
        showToast('Backup importado com sucesso!');
      } catch {
        alert('Arquivo de backup inválido.');
      }
    };
    reader.readAsText(file);
  };

  const isLight = siteConfig.themeMode === 'light';

  const filteredServices =
    selectedCategory === 'All'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className={`min-h-screen font-sans overflow-x-clip transition-colors duration-500 ${isLight ? 'bg-[#F9F8F6] text-stone-900' : 'bg-[#0A0A0A] text-stone-100'}`}>
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 right-6 z-[70] px-5 py-3 rounded-full bg-[#D4AF37] text-black text-xs font-semibold shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-xl border-b ${isLight ? 'bg-[#F9F8F6]/80 border-stone-200' : 'bg-[#0A0A0A]/75 border-white/5'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <Sparkles className="w-5 h-5 text-[#D4AF37] transition-transform duration-500 group-hover:rotate-45" />
            <div className="flex flex-col">
              <span className={`font-serif text-xl tracking-[0.22em] font-semibold ${isLight ? 'text-stone-900' : 'text-white'}`}>
                {siteConfig.brandName}
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#D4AF37] uppercase -mt-1">
                {siteConfig.brandTagline}
              </span>
            </div>
          </a>

          <nav className={`hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
            <a href="#hero" className="hover:text-[#D4AF37] transition-colors">Home</a>
            <a href="#experience" className="hover:text-[#D4AF37] transition-colors">Salon</a>
            <a href="#services" className="hover:text-[#D4AF37] transition-colors">Services</a>
            <a href="#pricing" className="hover:text-[#D4AF37] transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-[#D4AF37] transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className={`p-2 transition-colors ${isLight ? 'text-stone-700 hover:text-[#D4AF37]' : 'text-stone-300 hover:text-[#D4AF37]'}`}
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              aria-label="Favorites"
              className={`relative p-2 transition-colors ${isLight ? 'text-stone-700 hover:text-[#D4AF37]' : 'text-stone-300 hover:text-[#D4AF37]'}`}
            >
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              )}
            </button>

            <button
              aria-label="Bag"
              onClick={() => setIsBookingOpen(true)}
              className={`relative p-2 transition-colors ${isLight ? 'text-stone-700 hover:text-[#D4AF37]' : 'text-stone-300 hover:text-[#D4AF37]'}`}
            >
              <ShoppingBag className="w-4 h-4" />
              {bag.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center">
                  {bag.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="ml-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B59224] text-black text-xs font-semibold uppercase tracking-[0.15em] hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20"
            >
              Book Now
            </button>

            <button
              onClick={() => setIsAdminModalOpen(true)}
              title="Gerenciar Site"
              className={`p-2.5 rounded-full border transition-colors ml-1 ${isLight ? 'border-stone-300 text-stone-700 hover:text-[#D4AF37] hover:border-[#D4AF37]' : 'border-white/10 text-stone-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/40'}`}
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO COM SCROLL-DRIVEN VIDEO / MOTION */}
      <section id="hero" ref={heroContainerRef} className="relative h-[260vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <motion.div
            style={{
              scale: mediaScale,
              borderRadius: mediaBorderRadius,
            }}
            className={`relative w-[92vw] h-[84vh] overflow-hidden shadow-2xl border ${isLight ? 'border-[#D4AF37]/40' : 'border-[#D4AF37]/20'}`}
          >
            <video
              key={siteConfig.heroVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              poster="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1800&q=85"
              className="w-full h-full object-cover object-center"
            >
              <source src={siteConfig.heroVideoUrl} type="video/mp4" />
            </video>

            <motion.div
              style={{ opacity: overlayDarkness }}
              className="absolute inset-0 bg-black pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
          </motion.div>

          <motion.div
            style={{ y: titleY, opacity: titleOpacity }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none text-white"
          >
            <span className="px-4 py-1.5 rounded-full glass-card text-[11px] uppercase tracking-[0.3em] text-[#F3E5AB] mb-6">
              {siteConfig.heroBadge}
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight leading-[0.95] max-w-4xl text-white">
              {siteConfig.heroTitleLine1} <br />
              <span className="italic text-[#E5C158]">{siteConfig.heroTitleLine2}</span>
            </h1>
            <p className="mt-6 text-sm sm:text-base text-stone-200 max-w-md font-light tracking-wide">
              {siteConfig.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
              <span>Scroll to Reveal</span>
              <div className="w-px h-10 bg-gradient-to-b from-[#D4AF37] to-transparent" />
            </div>
          </motion.div>

          <motion.div
            style={{ x: leftCardX, opacity: leftCardOpacity }}
            className={`hidden md:block absolute left-10 bottom-24 z-20 max-w-xs p-6 rounded-2xl shadow-2xl ${isLight ? 'bg-white/80 backdrop-blur-md border border-[#D4AF37]/30 text-stone-900' : 'glass-card text-white'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
                Signature Ritual
              </span>
              <Scissors className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <h3 className={`font-serif text-2xl mb-2 ${isLight ? 'text-stone-900' : 'text-white'}`}>
              {services[1]?.title || 'Couture Balayage'}
            </h3>
            <p className={`text-xs leading-relaxed mb-4 ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
              {services[1]?.description}
            </p>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#E5C158] hover:text-[#D4AF37] transition-colors font-semibold"
            >
              Agendar Sessão <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          <motion.div
            style={{ x: rightCardX, opacity: rightCardOpacity }}
            className={`hidden md:block absolute right-10 top-32 z-20 max-w-xs p-6 rounded-2xl shadow-2xl ${isLight ? 'bg-white/80 backdrop-blur-md border border-[#D4AF37]/30 text-stone-900' : 'glass-card text-white'}`}
          >
            <div className="flex items-center gap-1 text-[#D4AF37] mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
              ))}
            </div>
            <p className={`font-serif italic text-lg mb-3 ${isLight ? 'text-stone-800' : 'text-white'}`}>
              “Uma experiência sensorial impecável. O melhor corte e tonalização que já fiz.”
            </p>
            <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
              — Helena Vasconcelos
            </div>
          </motion.div>
        </div>
      </section>

      {/* EXPERIÊNCIA / SOBRE O SALÃO */}
      <section id="experience" className="py-28 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
              The {siteConfig.brandName} Philosophy
            </span>
            <h2 className={`font-serif text-4xl sm:text-5xl leading-tight ${isLight ? 'text-stone-900' : 'text-white'}`}>
              {siteConfig.aboutTitle}
            </h2>
            <p className={`leading-relaxed font-light ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
              {siteConfig.aboutDescription}
            </p>
            <div className={`grid grid-cols-3 gap-6 pt-4 border-t ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
              <div>
                <div className="font-serif text-3xl text-[#E5C158]">12+</div>
                <div className={`text-xs uppercase tracking-wider mt-1 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>Anos de Excelência</div>
              </div>
              <div>
                <div className="font-serif text-3xl text-[#E5C158]">4.9★</div>
                <div className={`text-xs uppercase tracking-wider mt-1 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>Avaliação Clientes</div>
              </div>
              <div>
                <div className="font-serif text-3xl text-[#E5C158]">100%</div>
                <div className={`text-xs uppercase tracking-wider mt-1 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>Produtos Veganos</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-[#D4AF37]/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=85"
                alt="Interior do Salão"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className={`absolute -bottom-6 -left-6 p-6 rounded-2xl max-w-[240px] shadow-xl ${isLight ? 'bg-white border border-[#D4AF37]/30 text-stone-900' : 'glass-card text-white'}`}>
              <p className="font-serif text-xl font-medium">Atendimento Privativo</p>
              <p className={`text-xs mt-1 ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
                Suítes exclusivas para noivas e dia de spa completo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DE SERVIÇOS */}
      <section id="services" className={`py-24 px-6 border-y ${isLight ? 'bg-[#F2EFE9] border-stone-200' : 'bg-[#0F0F0F] border-white/5'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                Curated Menu
              </span>
              <h2 className={`font-serif text-4xl sm:text-5xl mt-2 ${isLight ? 'text-stone-900' : 'text-white'}`}>
                Signature Services
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {['All', 'Hair', 'Color', 'Treatment', 'Bridal'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs uppercase tracking-[0.18em] transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#D4AF37] text-black font-semibold'
                      : isLight ? 'bg-stone-200 text-stone-700 hover:bg-stone-300' : 'bg-white/5 text-stone-300 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={service.id}
                className={`group rounded-2xl overflow-hidden border transition-all flex flex-col shadow-lg ${isLight ? 'bg-white border-stone-200 hover:border-[#D4AF37]' : 'bg-[#141414] border-white/5 hover:border-[#D4AF37]/40'}`}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <button
                    onClick={() => toggleFavorite(service.id)}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:text-[#D4AF37] transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(service.id) ? 'fill-[#D4AF37] text-[#D4AF37]' : ''
                      }`}
                    />
                  </button>
                  <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] text-[#E5C158]">
                    {service.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className={`font-serif text-2xl group-hover:text-[#E5C158] transition-colors ${isLight ? 'text-stone-900' : 'text-white'}`}>
                        {service.title}
                      </h3>
                      <span className="font-serif text-xl text-[#D4AF37] font-semibold">
                        R$ {service.price}
                      </span>
                    </div>
                    <p className={`text-xs mt-2 leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                      {service.description}
                    </p>
                  </div>

                  <div className={`mt-6 pt-4 border-t flex items-center justify-between ${isLight ? 'border-stone-100' : 'border-white/5'}`}>
                    <span className={`flex items-center gap-1.5 text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {service.duration}
                    </span>
                    <button
                      onClick={() => addToBag(service)}
                      className="text-xs uppercase tracking-[0.2em] text-[#E5C158] hover:text-[#D4AF37] font-semibold flex items-center gap-1 transition-colors"
                    >
                      Reservar <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TABELA DE PREÇOS */}
      <section id="pricing" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
            Transparent Luxury
          </span>
          <h2 className={`font-serif text-4xl sm:text-5xl mt-2 ${isLight ? 'text-stone-900' : 'text-white'}`}>
            Service Menu & Pricing
          </h2>
        </div>

        <div className="space-y-4">
          {services.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${isLight ? 'bg-white border-stone-200 hover:border-[#D4AF37]/50' : 'bg-[#121212] border-white/5 hover:border-[#D4AF37]/30'}`}
            >
              <div>
                <div className="flex items-center gap-3">
                  <h4 className={`font-serif text-xl ${isLight ? 'text-stone-900' : 'text-white'}`}>{item.title}</h4>
                  <span className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full ${isLight ? 'bg-stone-100 text-stone-600' : 'bg-white/5 text-stone-400'}`}>
                    {item.duration}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>{item.description}</p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6">
                <span className="font-serif text-2xl text-[#E5C158]">R$ {item.price}</span>
                <button
                  onClick={() => addToBag(item)}
                  className="px-4 py-2 rounded-full border border-[#D4AF37]/40 text-xs uppercase tracking-widest text-[#E5C158] hover:bg-[#D4AF37] hover:text-black transition-all font-medium"
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER / CONTATO */}
      <footer id="contact" className={`border-t pt-20 pb-12 px-6 ${isLight ? 'bg-[#F2EFE9] border-stone-200 text-stone-800' : 'bg-[#070707] border-white/10 text-stone-300'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 pb-16 border-b border-stone-300/20">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span className={`font-serif text-2xl tracking-[0.22em] ${isLight ? 'text-stone-900' : 'text-white'}`}>
                {siteConfig.brandName}
              </span>
            </div>
            <p className={`text-xs leading-relaxed max-w-xs ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
              Alta cabeleireira, colorimetria personalizada e rituais de bem-estar em um ambiente pensado para realçar sua beleza natural.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <h5 className="uppercase tracking-[0.25em] text-[#D4AF37] mb-4">Visite-nos</h5>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37]" /> {siteConfig.address}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D4AF37]" /> {siteConfig.phone}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" /> {siteConfig.hours}
            </p>
          </div>

          <div>
            <h5 className="uppercase tracking-[0.25em] text-[#D4AF37] mb-4">Agendamento Rápido</h5>
            <p className={`text-xs mb-4 ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
              Reserve seu horário online em menos de 1 minuto.
            </p>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-6 py-3 rounded-full bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-md"
            >
              Agendar Horário
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-4">
          <p>© 2026 {siteConfig.brandName} {siteConfig.brandTagline.toUpperCase()}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
              <Instagram className="w-3.5 h-3.5" /> {siteConfig.instagram}
            </a>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 text-stone-500 font-medium"
            >
              <Lock className="w-3 h-3" /> Gerenciar Site
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL DE AGENDAMENTO */}
      <AnimatePresence>
        {isBookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[#141414] border border-[#D4AF37]/30 p-8 relative shadow-2xl text-white"
            >
              <button
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {bookingSuccess ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-3xl text-white">Horário Reservado!</h3>
                  <p className="text-xs text-stone-400">
                    Seu pedido foi registrado no sistema do salão.
                  </p>
                </div>
              ) : (
                <>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
                    Online Reservation
                  </span>
                  <h3 className="font-serif text-3xl text-white mt-1 mb-6">
                    Book Your Moment
                  </h3>

                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1.5">
                        Seu Nome
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Maria Clara"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1.5">
                        WhatsApp
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="(16) 99999-9999"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1.5">
                        Serviço Desejado
                      </label>
                      <select
                        value={bookingData.service}
                        onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title} — R$ {s.price}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1.5">
                          Data
                        </label>
                        <input
                          required
                          type="date"
                          value={bookingData.date}
                          onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1.5">
                          Horário
                        </label>
                        <select
                          value={bookingData.time}
                          onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="09:30">09:30</option>
                          <option value="11:00">11:00</option>
                          <option value="14:00">14:00</option>
                          <option value="16:30">16:30</option>
                          <option value="18:00">18:00</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B59224] text-black font-semibold text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" /> Confirmar Agendamento
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAINEL ADMINISTRATIVO DO GERENTE (CMS COMPLETO) */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl rounded-3xl bg-[#121212] border border-[#D4AF37]/30 p-6 sm:p-8 relative shadow-2xl my-8 max-h-[90vh] overflow-y-auto text-white"
            >
              <button
                onClick={() => setIsAdminModalOpen(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {!isAuthenticated ? (
                <div className="max-w-sm mx-auto py-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-3xl text-white mb-2">Painel do Gerente</h3>
                  <p className="text-xs text-stone-400 mb-6">
                    Digite a senha administrativa para controlar o tema (escuro/claro), vídeos, textos e serviços.
                  </p>
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <input
                      type="password"
                      placeholder="Senha (padrão: lumiere2026)"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-sm text-white text-center focus:outline-none focus:border-[#D4AF37]"
                    />
                    {loginError && (
                      <p className="text-xs text-red-400">Senha incorreta. Tente novamente.</p>
                    )}
                    <button
                      type="submit"
                      className="w-full py-3 rounded-full bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-[0.2em]"
                    >
                      Acessar Painel
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 pr-8">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
                        Gerenciamento Total
                      </span>
                      <h3 className="font-serif text-3xl text-white">Painel de Controle do Gerente</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleExportBackup}
                        title="Baixar Backup"
                        className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-stone-300 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" /> Backup
                      </button>
                      <label className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-stone-300 flex items-center gap-1.5 cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-[#D4AF37]" /> Restaurar
                        <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                      </label>
                      <button
                        onClick={() => setIsAuthenticated(false)}
                        className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400 flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sair
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 my-6 border-b border-white/5 pb-4 overflow-x-auto">
                    <button
                      onClick={() => setAdminTab('services')}
                      className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap ${
                        adminTab === 'services'
                          ? 'bg-[#D4AF37] text-black font-semibold'
                          : 'bg-white/5 text-stone-400'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" /> Serviços & Preços ({services.length})
                    </button>
                    <button
                      onClick={() => setAdminTab('general')}
                      className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap ${
                        adminTab === 'general'
                          ? 'bg-[#D4AF37] text-black font-semibold'
                          : 'bg-white/5 text-stone-400'
                      }`}
                    >
                      <Type className="w-3.5 h-3.5" /> Tema, Vídeo & Letras
                    </button>
                    <button
                      onClick={() => setAdminTab('bookings')}
                      className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap ${
                        adminTab === 'bookings'
                          ? 'bg-[#D4AF37] text-black font-semibold'
                          : 'bg-white/5 text-stone-400'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" /> Agendamentos ({bookings.length})
                    </button>
                  </div>

                  {/* ABA 1: SERVIÇOS & UPLOAD DE FOTO */}
                  {adminTab === 'services' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-stone-400">
                          Adicione, edite ou envie fotos do computador para os serviços do site.
                        </p>
                        <button
                          onClick={() =>
                            setEditingService({
                              category: 'Hair',
                              title: '',
                              duration: '60 min',
                              price: 150,
                              description: '',
                              image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80',
                            })
                          }
                          className="px-4 py-2 rounded-full bg-[#D4AF37] text-black text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Novo Serviço
                        </button>
                      </div>

                      {editingService && (
                        <form
                          onSubmit={handleSaveService}
                          className="p-6 rounded-2xl bg-black/60 border border-[#D4AF37]/40 space-y-4"
                        >
                          <h4 className="font-serif text-xl text-[#E5C158]">
                            {editingService.id ? 'Editar Serviço' : 'Adicionar Novo Serviço'}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] text-stone-400 mb-1">Nome do Serviço</label>
                              <input
                                required
                                type="text"
                                value={editingService.title}
                                onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-sm text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-stone-400 mb-1">Categoria</label>
                              <select
                                value={editingService.category}
                                onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-sm text-white"
                              >
                                <option value="Hair">Hair</option>
                                <option value="Color">Color</option>
                                <option value="Treatment">Treatment</option>
                                <option value="Bridal">Bridal</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] text-stone-400 mb-1">Preço (R$)</label>
                              <input
                                required
                                type="number"
                                value={editingService.price}
                                onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-sm text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-stone-400 mb-1">Duração</label>
                              <input
                                required
                                type="text"
                                value={editingService.duration}
                                onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-sm text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">
                              Foto do Serviço (Escolha do computador ou cole o link)
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3 items-center">
                              <label className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-xs text-[#E5C158] hover:bg-[#D4AF37]/25 cursor-pointer text-center whitespace-nowrap transition-colors flex items-center justify-center gap-1.5">
                                <ImageIcon className="w-4 h-4" /> Enviar Foto do PC
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </label>

                              <input
                                required
                                type="text"
                                placeholder="Ou cole a URL da imagem..."
                                value={editingService.image}
                                onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-sm text-white"
                              />
                            </div>

                            {editingService.image && (
                              <img
                                src={editingService.image}
                                alt="Prévia"
                                className="mt-3 h-24 w-36 object-cover rounded-lg border border-white/10"
                              />
                            )}
                          </div>

                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">Descrição</label>
                            <textarea
                              required
                              rows={2}
                              value={editingService.description}
                              onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-sm text-white"
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingService(null)}
                              className="px-4 py-2 rounded-lg bg-white/5 text-xs text-stone-300"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold flex items-center gap-1.5"
                            >
                              <Save className="w-3.5 h-3.5" /> Salvar Serviço
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-3">
                        {services.map((s) => (
                          <div
                            key={s.id}
                            className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <img src={s.image} alt={s.title} className="w-12 h-12 rounded-lg object-cover" />
                              <div>
                                <div className="font-medium text-sm text-white">{s.title}</div>
                                <div className="text-xs text-stone-400">
                                  {s.category} • {s.duration} • <span className="text-[#D4AF37]">R$ {s.price}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingService(s)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(s.id)}
                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ABA 2: TEMA (ESCURO/CLARO), VÍDEO & LETRAS / TEXTOS */}
                  {adminTab === 'general' && (
                    <div className="space-y-6">
                      {/* SEÇÃO DE TEMA: ESCURO OU CLARO */}
                      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                        <h4 className="font-serif text-lg text-[#E5C158] flex items-center gap-2">
                          <Moon className="w-4 h-4" /> Aparência do Site (Tema Escuro / Claro)
                        </h4>
                        <p className="text-xs text-stone-400">
                          Escolha se o site completo exibirá o visual luxuoso escuro ou o visual clean claro.
                        </p>
                        <div className="flex gap-4 pt-2">
                          <button
                            type="button"
                            onClick={() => setSiteConfig({ ...siteConfig, themeMode: 'dark' })}
                            className={`flex-1 py-3 px-4 rounded-xl border text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                              siteConfig.themeMode === 'dark'
                                ? 'bg-[#D4AF37] text-black font-semibold border-[#D4AF37]'
                                : 'bg-black/50 text-stone-300 border-white/10'
                            }`}
                          >
                            <Moon className="w-4 h-4" /> Tema Escuro (Dark)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSiteConfig({ ...siteConfig, themeMode: 'light' })}
                            className={`flex-1 py-3 px-4 rounded-xl border text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                              siteConfig.themeMode === 'light'
                                ? 'bg-[#D4AF37] text-black font-semibold border-[#D4AF37]'
                                : 'bg-black/50 text-stone-300 border-white/10'
                            }`}
                          >
                            <Sun className="w-4 h-4" /> Tema Claro (Light)
                          </button>
                        </div>
                      </div>

                      {/* SEÇÃO DE VÍDEO & MARCA */}
                      <div className="space-y-4">
                        <h4 className="font-serif text-lg text-[#E5C158]">Vídeo de Fundo & Identidade</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">Nome da Marca</label>
                            <input
                              type="text"
                              value={siteConfig.brandName}
                              onChange={(e) => setSiteConfig({ ...siteConfig, brandName: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">Subtítulo da Marca</label>
                            <input
                              type="text"
                              value={siteConfig.brandTagline}
                              onChange={(e) => setSiteConfig({ ...siteConfig, brandTagline: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">URL do Vídeo de Fundo (.mp4)</label>
                          <input
                            type="url"
                            value={siteConfig.heroVideoUrl}
                            onChange={(e) => setSiteConfig({ ...siteConfig, heroVideoUrl: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white"
                          />
                        </div>
                      </div>

                      {/* SEÇÃO DE LETRAS E TEXTOS DO SITE */}
                      <div className="space-y-4 pt-4 border-t border-white/10">
                        <h4 className="font-serif text-lg text-[#E5C158]">Edição de Textos e Letras do Site</h4>
                        
                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">Texto Pequeno Superior (Hero Badge)</label>
                          <input
                            type="text"
                            value={siteConfig.heroBadge}
                            onChange={(e) => setSiteConfig({ ...siteConfig, heroBadge: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">Título Principal (Linha 1)</label>
                            <input
                              type="text"
                              value={siteConfig.heroTitleLine1}
                              onChange={(e) => setSiteConfig({ ...siteConfig, heroTitleLine1: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">Título Principal (Linha 2 Dourada)</label>
                            <input
                              type="text"
                              value={siteConfig.heroTitleLine2}
                              onChange={(e) => setSiteConfig({ ...siteConfig, heroTitleLine2: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">Subtítulo do Banner (Hero)</label>
                          <textarea
                            rows={2}
                            value={siteConfig.heroSubtitle}
                            onChange={(e) => setSiteConfig({ ...siteConfig, heroSubtitle: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">Título da Seção "Sobre" (Philosophy)</label>
                          <input
                            type="text"
                            value={siteConfig.aboutTitle}
                            onChange={(e) => setSiteConfig({ ...siteConfig, aboutTitle: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1">Descrição da Seção "Sobre"</label>
                          <textarea
                            rows={3}
                            value={siteConfig.aboutDescription}
                            onChange={(e) => setSiteConfig({ ...siteConfig, aboutDescription: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white"
                          />
                        </div>
                      </div>

                      {/* CONTATO & SENHA */}
                      <div className="space-y-4 pt-4 border-t border-white/10">
                        <h4 className="font-serif text-lg text-[#E5C158]">Informações de Contato & Senha do Painel</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">Endereço Completo</label>
                            <input
                              type="text"
                              value={siteConfig.address}
                              onChange={(e) => setSiteConfig({ ...siteConfig, address: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">Telefone / WhatsApp</label>
                            <input
                              type="text"
                              value={siteConfig.phone}
                              onChange={(e) => setSiteConfig({ ...siteConfig, phone: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">Horário de Funcionamento</label>
                            <input
                              type="text"
                              value={siteConfig.hours}
                              onChange={(e) => setSiteConfig({ ...siteConfig, hours: e.target.value })}
                              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-stone-400 mb-1">Nova Senha de Acesso ao Painel</label>
                            <input
                              type="text"
                              value={adminPassword}
                              onChange={(e) => setAdminPassword(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-white/10">
                        <button
                          type="button"
                          onClick={handleResetDefaults}
                          className="text-xs text-stone-400 hover:text-white flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Restaurar Padrão Original
                        </button>
                        <button
                          type="button"
                          onClick={() => showToast('Todas as alterações e textos foram salvos!')}
                          className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-wider"
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ABA 3: AGENDAMENTOS */}
                  {adminTab === 'bookings' && (
                    <div className="space-y-4">
                      {bookings.length === 0 ? (
                        <div className="py-12 text-center text-xs text-stone-400">
                          Nenhum agendamento realizado pelo site ainda.
                        </div>
                      ) : (
                        bookings.map((b) => (
                          <div
                            key={b.id}
                            className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{b.name}</span>
                                <span className="text-xs text-[#D4AF37]">• {b.service}</span>
                              </div>
                              <p className="text-xs text-stone-400 mt-1">
                                Data: {b.date} às {b.time} | Tel: {b.phone}
                              </p>
                            </div>
                            <a
                              href={`https://wa.me/55${b.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Olá ${b.name}! Confirmamos seu agendamento de ${b.service} no ${siteConfig.brandName} para o dia ${b.date} às ${b.time}.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs flex items-center gap-1.5 w-fit"
                            >
                              <MessageCircle className="w-3.5 h-3.5" /> Confirmar no WhatsApp
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}