import React, { useState, useEffect } from 'react';
import { ReseoLogo } from './ReseoLogo';
import { ShieldAlert, MessageCircle, Menu, X, ArrowRight, Flame, Calculator, Utensils, Tag } from 'lucide-react';

interface NavbarProps {
  onOpenConfigurator?: () => void;
  onOpenAffiliates?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConfigurator, onOpenAffiliates }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl =
    "https://wa.me/34686478561?text=Hola,%20he%20visto%20el%20informe%20de%20RESEO%20STUDIO%20y%20quiero%20información%20para%20mi%20negocio";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800 shadow-xl py-3'
          : 'bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <a href="#" className="flex items-center group">
            <ReseoLogo size="md" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
            <a href="#trampa-estatica" className="hover:text-blue-400 transition-colors">
              La Trampa
            </a>
            <a href="#causas-caida" className="hover:text-blue-400 transition-colors">
              3 Causas IA
            </a>
            <a href="#sistema-5-pasos" className="hover:text-blue-400 transition-colors">
              Sistema 5 Pasos
            </a>
            <a href="#ecosistema-nfc" className="hover:text-blue-400 transition-colors">
              Hardware NFC
            </a>
            <a href="#planes-inversion" className="hover:text-blue-400 transition-colors">
              Planes (59€)
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Affiliates Portal Link */}
            <button
              onClick={onOpenAffiliates}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Portal Afiliados (20%)</span>
            </button>

            {/* Quick Configurator Link */}
            <button
              onClick={onOpenConfigurator}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Presupuesto Online</span>
            </button>

            {/* WhatsApp */}
            <a
              id="nav-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenConfigurator}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold flex items-center gap-1"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Presupuesto</span>
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 pb-6 border-t border-slate-800 bg-[#111827] rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/50 border border-red-800/40 text-red-400 text-xs font-semibold mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Informe Algoritmo Maps 2026</span>
            </div>
            <a
              href="#trampa-estatica"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 font-medium text-xs"
            >
              La Trampa de las Estrellas
            </a>
            <a
              href="#causas-caida"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 font-medium text-xs"
            >
              Las 3 Causas Mortales
            </a>
            <a
              href="#sistema-5-pasos"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 font-medium text-xs"
            >
              Sistema de 5 Pasos
            </a>
            <a
              href="#ecosistema-nfc"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 font-medium text-xs"
            >
              Hardware NFC (Expositor & Tarjetas)
            </a>
            <a
              href="#planes-inversion"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 font-medium text-xs"
            >
              Planes y Precios (59€)
            </a>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConfigurator && onOpenConfigurator();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg"
              >
                <Calculator className="w-4 h-4" />
                <span>Configurar Presupuesto Online</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAffiliates && onOpenAffiliates();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-bold text-xs"
              >
                <Utensils className="w-4 h-4" />
                <span>Portal Afiliados & Foodies (20% Comisión)</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Hablar por WhatsApp Directo</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
