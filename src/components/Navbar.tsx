import React, { useState, useEffect } from 'react';
import { ReseoLogo } from './ReseoLogo';
import { ShieldAlert, MessageCircle, Menu, X, ArrowRight, Flame } from 'lucide-react';

export const Navbar: React.FC = () => {
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

          {/* Confidential tag / Algorithmic Status (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>ALGORITMO MAPS 2026 // AUDITORÍA ABIERTA</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
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
              Ecosistema Físico
            </a>
            <a href="#planes-inversion" className="hover:text-blue-400 transition-colors">
              Planes
            </a>
          </nav>

          {/* Action CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              id="nav-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/40 hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Directo</span>
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
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
          <div className="md:hidden mt-4 pt-4 pb-6 border-t border-slate-800 bg-[#111827] rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/50 border border-red-800/40 text-red-400 text-xs font-semibold mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Informe Algoritmo Maps 2026</span>
            </div>
            <a
              href="#trampa-estatica"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 font-medium"
            >
              La Trampa de las Estrellas
            </a>
            <a
              href="#causas-caida"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 font-medium"
            >
              Las 3 Causas Mortales
            </a>
            <a
              href="#sistema-5-pasos"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 font-medium"
            >
              Sistema de 5 Pasos
            </a>
            <a
              href="#ecosistema-nfc"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 font-medium"
            >
              Ecosistema Físico (Expositor & Tarjetas)
            </a>
            <a
              href="#planes-inversion"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 font-medium"
            >
              Planes y Precios
            </a>
            <div className="pt-2 border-t border-slate-800">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Hablar por WhatsApp (+34 686 47 85 61)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
