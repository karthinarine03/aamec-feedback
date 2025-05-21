import React from 'react';
import logo from '../images/aamec_logo.jpg';
import nba from '../images/NBA.png';
import naac from '../images/naac.jpg';

function Header() {
  return (
    <header className="bg-light py-3 shadow-lg">
      <div className="container">
        <div className="row align-items-center text-center text-md-start gy-3">
          
          {/* Left Logo */}
          <div className="col-12 col-md-2 d-flex justify-content-center justify-content-md-start">
            <img src={logo} alt="AAMEC Logo" width="80" className="img-fluid" />
          </div>

          {/* Center Text */}
          <div className="col-12 col-md-8">
            <h1 className="h6 fw-bold text-primary mb-1">
              ANJALAI AMMAL MAHALINGAM ENGINEERING COLLEGE
            </h1>
            <h2 className="h6 text-dark mb-1">
              KOVILVENNI - 614 403, THIRUVARUR DISTRICT
            </h2>
            <h3 className="h6 text-success mb-0 d-none d-md-block">
              NAAC Accredited with “B” Grade & NBA (ECE, IT, MECH)
            </h3>
          </div>

          {/* Right Logo (visible only on md+) */}
          <div className="col-md-2 d-none d-md-flex justify-content-md-end">
            <img src={naac} alt="NAAC Logo" width="80" className="img-fluid" />
          </div>

          {/* Bottom Logos for small screens only */}
          <div className="col-12 d-md-none d-flex justify-content-center gap-3">
            <img src={naac} alt="NAAC Logo" width="60" className="img-fluid" />
            <img src={nba} alt="NBA Logo" width="60" className="img-fluid" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
