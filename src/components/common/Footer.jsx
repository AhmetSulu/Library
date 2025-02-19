import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer gradient-border">
      <div className="footer-content">
        {/* Copyright and branding section */}
        <div className="footer-section">
          <h3>Library Management System</h3>
          <p>© {currentYear} All rights reserved.</p>
          <p>Managing your library efficiently</p>
        </div>

        {/* Contact information section with icons */}
        <div className="footer-section">
          <h3>Contact</h3>
          <div className="contact-info">
            <div className="contact-item">
              <Mail size={18} />
              <a href="mailto:info@library.com">info@library.com</a>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <a href="tel:+905555555555">+90 555 555 55 55</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}