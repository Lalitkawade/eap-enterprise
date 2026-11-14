import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Maximize2,
  X,
  Layers,
  Wrench,
  Zap,
  Boxes,
  Fish,
  Egg,
  Truck,
  CheckCircle2
} from "lucide-react";

export const ArchitecturalDivisions = () => {
  const { divisions, settings, openInquiryModal } = useApp();
  // Smooth anchor hash scroll support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const target = document.getElementById(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Curated relevant technical specifications per division (minimalist)
  const getRelevantSpecs = (divId) => {
    switch (divId) {
      case "elec":
        return [
          { icon: <Zap size={13} className="text-cyan" />, label: "MCC / PCC Single-Line Panels" },
          { icon: <ShieldCheck size={13} className="text-emerald" />, label: "150+ Certified Wiremen" },
          { icon: <Truck size={13} className="text-amber" />, label: "48-72h Pan-India Mobilization" }
        ];
      case "fab":
        return [
          { icon: <Wrench size={13} className="text-amber" />, label: "150+ Tons Monthly Output" },
          { icon: <ShieldCheck size={13} className="text-emerald" />, label: "IS 2062 Grade Steel" },
          { icon: <Layers size={13} className="text-cyan" />, label: "90° & 45° Galvanized Bends" }
        ];
      case "brick":
        return [
          { icon: <Boxes size={13} className="text-terracotta" />, label: "Standard 9\" × 4\" × 3\" Size" },
          { icon: <CheckCircle2 size={13} className="text-emerald" />, label: "2,000,000 Buffer Yard Stock" },
          { icon: <Layers size={13} className="text-amber" />, label: "4,200,000 Annual Output" }
        ];
      case "fish":
        return [
          { icon: <Fish size={13} className="text-blue" />, label: "Catla, Rohu, Carp & Catfish" },
          { icon: <CheckCircle2 size={13} className="text-cyan" />, label: "Electric Paddlewheel Aerators" },
          { icon: <Truck size={13} className="text-emerald" />, label: "Live Oxygenated Transport Tanks" }
        ];
      case "duck":
        return [
          { icon: <Egg size={13} className="text-emerald" />, label: "6,000 Fresh Eggs / Day" },
          { icon: <Boxes size={13} className="text-amber" />, label: "12,000 Stock in Sanitized Crates" },
          { icon: <Truck size={13} className="text-cyan" />, label: "Cold-Chain Wholesale Logistics" }
        ];
      default:
        return [];
    }
  };

  // Lightbox state
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    imageSrc: "",
    title: "",
    tag: "",
    desc: "",
    serviceName: ""
  });

  const openLightbox = (imageSrc, title, tag, desc, serviceName) => {
    setLightbox({
      isOpen: true,
      imageSrc,
      title: title || serviceName,
      tag: tag || "Operational Photography",
      desc: desc || "Authentic on-site photograph showcasing specialized technical execution and facility capacity.",
      serviceName: serviceName || "General Service"
    });
  };

  const closeLightbox = () => {
    setLightbox({
      isOpen: false,
      imageSrc: "",
      title: "",
      tag: "",
      desc: "",
      serviceName: ""
    });
  };

  return (
    <section className="arch-section divisions-arch-section" id="services">
      <div className="container">
        
        {/* Section Header */}
        <div className="arch-section-header text-center">
          <div className="arch-eyebrow centered">
            <span className="eyebrow-line"></span>
            <span className="eyebrow-text">ERPHAN ALAM ENTERPRISES • CORE OPERATIONAL DIVISIONS</span>
            <span className="eyebrow-line"></span>
          </div>
          <h2 className="arch-headline">
            Specialized Technical Execution & <em>Facility Output</em>
          </h2>
          <p className="arch-subheadline max-w-700">
            Explore turnkey electrical contracting, in-house cable tray fabrication, certified 9"×4"×3" brick kilns, 
            and biosecure commercial agro-aquaculture operated directly across India by Erphan Alam Enterprises.
          </p>
        </div>

        {/* Minimalist Alternating Division Cards (Left-Right Pattern) */}
        <div className="minimal-divisions-flow">
          {divisions.map((div, idx) => {
            const isPhotoRight = idx % 2 === 1;
            const specs = getRelevantSpecs(div.id);

            return (
              <article 
                key={div.id} 
                id={div.id} 
                className={`min-division-card ${isPhotoRight ? "reverse" : ""}`}
              >
                {/* Visual Media Frame */}
                <div 
                  className="min-card-media"
                  onClick={() => openLightbox(div.image, div.name, div.category, div.leadDesc, div.name)}
                  title={`Inspect ${div.name}`}
                >
                  <img src={div.image} alt={div.name} className="min-card-img" loading="lazy" />
                  <div className="min-card-gradient"></div>

                  <div className="min-card-badge">
                    <span className="badge-kpi">{div.highlightStat}</span>
                  </div>

                  <button 
                    type="button" 
                    className="min-card-expand-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(div.image, div.name, div.category, div.leadDesc, div.name);
                    }}
                    aria-label="Inspect Full Image"
                  >
                    <Maximize2 size={13} />
                    <span>Inspect</span>
                  </button>
                </div>

                {/* Content Side */}
                <div className="min-card-content">
                  <div className="min-card-eyebrow">
                    <span className="min-index-num">0{idx + 1}</span>
                    <span className="min-cat-sep">•</span>
                    <span className="min-cat-text">{div.category}</span>
                  </div>

                  <h3 className="min-card-title">{div.name}</h3>
                  <p className="min-card-desc">{div.leadDesc}</p>

                  {/* 3 Curated Relevant Spec Badges */}
                  <div className="min-card-specs">
                    {specs.map((spec, sIdx) => (
                      <span key={sIdx} className="min-spec-chip">
                        {spec.icon}
                        <span>{spec.label}</span>
                      </span>
                    ))}
                  </div>

                  {/* Minimalist Action Controls */}
                  <div className="min-card-actions">
                    <button
                      type="button"
                      className="btn-min-primary"
                      onClick={() => openInquiryModal(div.name)}
                    >
                      <span>Inquire Scope</span>
                      <ArrowRight size={14} />
                    </button>

                    <a
                      href={`https://wa.me/${settings.whatsappNumber}?text=Hello,%20I%20have%20an%20urgent%20requirement%20for%20${encodeURIComponent(div.name)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-min-secondary"
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp Desk</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

      </div>

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {lightbox.isOpen && (
        <div className="arch-lightbox-overlay" onClick={closeLightbox}>
          <div className="arch-lightbox-container" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button className="lightbox-close-btn" onClick={closeLightbox} aria-label="Close Viewer">
              <X size={22} />
            </button>

            {/* Main Lightbox Image */}
            <div className="lightbox-media-box">
              <img src={lightbox.imageSrc} alt={lightbox.title} className="lightbox-full-img" />
            </div>

            {/* Lightbox Information Bar */}
            <div className="lightbox-details-bar">
              <div className="lightbox-meta">
                <span className="lightbox-tag">{lightbox.tag}</span>
                <h4 className="lightbox-title">{lightbox.title}</h4>
                <p className="lightbox-desc">{lightbox.desc}</p>
              </div>

              <div className="lightbox-actions">
                <button
                  className="btn-arch-primary"
                  onClick={() => {
                    closeLightbox();
                    openInquiryModal(lightbox.serviceName);
                  }}
                >
                  <span>Procure This Service</span>
                  <ArrowRight size={14} />
                </button>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=Hello,%20I%20am%20inquiring%20about%20the%20${encodeURIComponent(lightbox.title)}%20service.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-arch-secondary"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
