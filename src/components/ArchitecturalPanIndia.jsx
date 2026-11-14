import React from "react";
import { useApp } from "../context/AppContext";
import { Truck, Snowflake, Users, ShieldCheck, MapPin, ArrowRight, MessageCircle } from "lucide-react";

export const ArchitecturalPanIndia = () => {
  const { settings, openInquiryModal } = useApp();

  return (
    <section className="arch-section pan-india-arch-section" id="pan-india">
      <div className="container">
        
        <div className="pan-india-arch-card">
          <div className="arch-eyebrow centered">
            <span className="eyebrow-line"></span>
            <span className="eyebrow-text">ERPHAN ALAM ENTERPRISES • ALL-INDIA SUPPLY NETWORK</span>
            <span className="eyebrow-line"></span>
          </div>

          <h2 className="arch-headline text-center">
            All India Supply Available: <br />
            <em>Connecting Facilities Directly to Your Jobsite</em>
          </h2>

          <p className="arch-subheadline text-center max-w-700">
            From industrial manufacturing belts to agricultural distribution terminals and construction sites, 
            Erphan Alam Enterprises coordinates comprehensive freight transit and on-site workforce mobilization 
            across all 28 Indian States & Union Territories.
          </p>

          {/* Logistics Matrix */}
          <div className="arch-logistics-grid">
            <div className="logistics-cell">
              <div className="logistics-icon-box">
                <Truck size={22} />
              </div>
              <h4>Heavy Flatbeds & Trailers</h4>
              <p>Multi-axle articulated carriers engineered for oversized structural steel, PEB crane girders, and bulk brick truckloads.</p>
            </div>

            <div className="logistics-cell">
              <div className="logistics-icon-box">
                <Snowflake size={22} />
              </div>
              <h4>Oxygenated & Live Transit</h4>
              <p>Specialized aeration tanks for live freshwater fish distribution and sanitized crate freight for daily fresh duck eggs.</p>
            </div>

            <div className="logistics-cell">
              <div className="logistics-icon-box">
                <Users size={22} />
              </div>
              <h4>48-72h Workforce Deputation</h4>
              <p>Rapid dispatch of certified electricians, wiremen, and safety supervisors to remote plant locations across all zones.</p>
            </div>

            <div className="logistics-cell">
              <div className="logistics-icon-box">
                <ShieldCheck size={22} />
              </div>
              <h4>Transit Security & Handling</h4>
              <p>Palletized and strapped packaging for bricks to minimize transit chipping, accompanied by proactive dispatch updates.</p>
            </div>
          </div>

          {/* Geographical Zones Bar */}
          <div className="regional-corridors-strip">
            <div className="corridor-item">
              <span className="corridor-zone">NORTH</span>
              <span className="corridor-states">Delhi NCR, UP, Haryana, Punjab, Rajasthan</span>
            </div>
            <div className="corridor-item">
              <span className="corridor-zone">WEST</span>
              <span className="corridor-states">Maharashtra, Gujarat, Goa, Madhya Pradesh</span>
            </div>
            <div className="corridor-item">
              <span className="corridor-zone">SOUTH</span>
              <span className="corridor-states">Karnataka, Tamil Nadu, Telangana, AP, Kerala</span>
            </div>
            <div className="corridor-item">
              <span className="corridor-zone">EAST</span>
              <span className="corridor-states">West Bengal, Bihar, Odisha, Jharkhand, Assam</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="arch-cta-centered">
            <button
              className="btn-arch-primary"
              onClick={() => openInquiryModal("Interstate Logistics Inquiry")}
            >
              <span>Request Freight Schedule & Quote</span>
              <ArrowRight size={15} />
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Hello,%20I%20would%20like%20to%20verify%20shipping%20rates%20and%20transit%20timelines%20for%20my%20state.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-arch-secondary"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Logistics Desk</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
