import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export const HeroSlider = () => {
  const { openInquiryModal } = useApp();

  const slides = [
    {
      id: "master",
      label: "ERPHAN ALAM ENTERPRISES • MULTI-SECTOR GROUP",
      shortLabel: "Multi-Sector Group",
      number: "01",
      title: "Direct Industrial Contracting, Heavy Fabrication, Kiln Bricks & Commercial Agribusiness",
      subtitle: "Erphan Alam Enterprises provides comprehensive technical execution and direct production: Control panel wiring, cable tray manufacturing, 9\"x4\"x3\" kiln bricks, commercial duck egg harvests, and scientific freshwater aquaculture nationwide.",
      image: "/assets/images/hero-conglomerate.jpg",
      stat: "5 Core Verticals",
      badge: "ALL INDIA SUPPLY",
      targetId: "services"
    },
    {
      id: "elec",
      label: "SERVICE 01 • ELECTRICAL & MANPOWER",
      shortLabel: "Electrical & Wiremen",
      number: "02",
      title: "Industrial Electrical Contracting & Certified Technical Manpower",
      subtitle: "Turnkey HT/LT substations up to 33kV, control panel wiring, factory high-bay lighting, and nationwide mobilization of certified wiremen within 48-72 hours.",
      image: "/assets/images/electrical-manpower.jpg",
      stat: "150+ Certified Wiremen",
      badge: "RAPID MOBILIZATION",
      targetId: "services"
    },
    {
      id: "fab",
      label: "SERVICE 02 • HEAVY ENGINEERING & STRUCTURAL STEEL",
      shortLabel: "Fabrication & PEB",
      number: "03",
      title: "Cable Tray Fabrication, PEB Warehouses & Heavy Gantry Girders",
      subtitle: "Precision sheet metal fabrication of galvanized cable tray bends, pre-engineered building factory frameworks, overhead crane run-beams, and certified welding.",
      image: "/assets/images/metal-fabrication.jpg",
      stat: "150+ Tons Monthly Output",
      badge: "IS 2062 HIGH TENSILE",
      targetId: "services"
    },
    {
      id: "brick",
      label: "SERVICE 03 • HIGH-STRENGTH RED KILN BRICKS",
      shortLabel: "Red Kiln Bricks",
      number: "04",
      title: "Standard 9\" × 4\" × 3\" Red Clay Bricks: 4.2 Million Annual Output",
      subtitle: "High compressive strength (12.5–15.0 N/mm²) exceeding IS 1077 norms, 2,000,000 units ready yard stock, and direct multi-axle truckload dispatch nationwide.",
      image: "/assets/images/brick-manufacturing.jpg",
      stat: "2,000,000 Ready in Yard",
      badge: "EXACT 9\" × 4\" × 3\"",
      targetId: "services"
    },
    {
      id: "farm",
      label: "SERVICE 04 & 05 • AGRIBUSINESS & AQUACULTURE",
      shortLabel: "Agro & Aquaculture",
      number: "05",
      title: "Commercial Freshwater Aquaculture & Daily High-Yield Duck Egg Harvests",
      subtitle: "Biosecure production facility supplying 6,000 fresh duck eggs daily with 12,000 ready stock, alongside continuous aerated pond harvests of 4 freshwater fish species.",
      image: "/assets/images/integrated-farming.jpg",
      stat: "6,000 Eggs / Day",
      badge: "DAILY HARVESTS",
      targetId: "services"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Touch swipe handling for mobile
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  const currentSlide = slides[currentIndex];

  return (
    <section className="cinematic-hero-section" id="home">
      <div className="hero-stage-container">
        {/* Main Architectural Framed Window */}
        <div
          className="cinematic-frame"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="cinematic-slide-bg"
            style={{ backgroundImage: `url('${currentSlide.image}')` }}
          ></div>
          <div className="cinematic-gradient-overlay"></div>

          {/* Left Arrow Button */}
          <button
            className="slider-nav-arrow arrow-left"
            onClick={prevSlide}
            aria-label="Previous Service Slide"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Arrow Button */}
          <button
            className="slider-nav-arrow arrow-right"
            onClick={nextSlide}
            aria-label="Next Service Slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Slide Editorial Information Overlay */}
          <div className="slide-content-overlay">
            <div className="slide-top-meta">
              <span className="slide-roman-num">{currentSlide.number} / 05</span>
              <span className="slide-division-tag">
                <span className="tag-desktop">{currentSlide.label}</span>
                <span className="tag-mobile">
                  {currentSlide.label.includes("•") ? currentSlide.label.split("•")[1].trim() : currentSlide.label}
                </span>
              </span>
              <span className="slide-spec-pill">{currentSlide.badge}</span>
            </div>

            <h1 className="slide-editorial-title">{currentSlide.title}</h1>
            <p className="slide-editorial-desc">{currentSlide.subtitle}</p>

            <div className="slide-action-cluster">
              <a
                href={`#${currentSlide.targetId}`}
                className="btn-editorial-primary"
              >
                <span className="btn-text-desktop">Explore Services Grid</span>
                <span className="btn-text-mobile">Explore Scope</span>
                <ArrowRight size={14} />
              </a>

              <button
                className="btn-editorial-inquire"
                onClick={() => openInquiryModal(currentSlide.title)}
              >
                <span className="btn-text-desktop">Direct Procurement RFP</span>
                <span className="btn-text-mobile">Direct RFP</span>
              </button>

              <div className="slide-highlight-stat">
                <span className="stat-label">CAPACITY METRIC</span>
                <span className="stat-value">{currentSlide.stat}</span>
              </div>
            </div>
          </div>

          {/* Bottom Thumbnails Strip (Direct child of cinematic-frame) */}
          <div className="slider-bottom-indicators">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                className={`indicator-dot-card ${idx === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Slide ${s.number}: ${s.shortLabel}`}
              >
                <span className="ind-num">{s.number}</span>
                <span className="ind-name ind-name-full">{s.label.includes("•") ? s.label.split("•")[1].trim() : s.label}</span>
                <span className="ind-name ind-name-short">{s.shortLabel}</span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
