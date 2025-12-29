import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Link } from 'react-router';
import { CEPIC_INFO } from '../../config/cepic';

const Footer = () => {
  const footerLinks = {
    formations: [
      { name: 'Toutes les formations', href: '/formations' },
      { name: 'Management de projet', href: '/formations?category=management-projet' },
      { name: 'Banque et finance', href: '/formations?category=banque-finance' },
      { name: 'Entrepreneuriat', href: '/formations?category=entrepreneuriat' },
    ],
    company: [
      { name: 'À propos', href: '/a-propos' },
      { name: 'Galerie', href: '/galerie' },
      { name: 'Contact', href: '/contact' },
      { name: 'Mes formations', href: '/mes-formations' },
    ],
    legal: [
      { name: "Conditions d'utilisation", href: '/conditions' },
      { name: 'Politique de confidentialité', href: '/confidentialite' },
      { name: 'Mentions légales', href: '/mentions-legales' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand & Contact */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-2 min-h-[44px]">
              <img src="/logo.jpg" alt="CEPIC" className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover" />
              <span className="text-xl sm:text-2xl font-bold text-white">CEPIC</span>
            </Link>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xs">{CEPIC_INFO.fullName}</p>
            <p className="text-gray-500 text-xs sm:text-sm">Excellence en Formation Professionnelle</p>
            <div className="space-y-3 pt-2">
              <a
                href={`mailto:${CEPIC_INFO.email}`}
                className="flex items-center space-x-3 text-sm text-gray-400 hover:text-secondary-500 transition-colors py-1.5 min-h-[44px]"
              >
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="break-all">{CEPIC_INFO.email}</span>
              </a>
              <a
                href={`tel:${CEPIC_INFO.phone.primary}`}
                className="flex items-center space-x-3 text-sm text-gray-400 hover:text-secondary-500 transition-colors py-1.5 min-h-[44px]"
              >
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>{CEPIC_INFO.phone.primary}</span>
              </a>
              <a
                href={`tel:${CEPIC_INFO.phone.secondary}`}
                className="flex items-center space-x-3 text-sm text-gray-400 hover:text-secondary-500 transition-colors py-1.5 min-h-[44px]"
              >
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>{CEPIC_INFO.phone.secondary}</span>
              </a>
              <div className="flex items-start space-x-3 text-sm text-gray-400 py-1.5">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{CEPIC_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* Formations Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-secondary-500">Formations</h3>
            <ul className="space-y-1">
              {footerLinks.formations.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center text-gray-400 hover:text-secondary-500 transition-colors duration-200 text-sm sm:text-base py-2 min-h-[44px]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-secondary-500">CEPIC</h3>
            <ul className="space-y-1">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center text-gray-400 hover:text-secondary-500 transition-colors duration-200 text-sm sm:text-base py-2 min-h-[44px]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            {/* Legal Links - Commenté temporairement
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-secondary-500">Légal</h3>
            <ul className="space-y-1 mb-6">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center text-gray-400 hover:text-secondary-500 transition-colors duration-200 text-sm sm:text-base py-2 min-h-[44px]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            */}

            {/* Social Links */}
            <div>
              <h4 className="text-sm sm:text-base font-semibold mb-4 text-secondary-500">Suivez-nous</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-11 h-11 sm:w-10 sm:h-10 bg-gray-800 hover:bg-secondary-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5 sm:w-4 sm:h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 sm:mt-10 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} {CEPIC_INFO.shortName}. Tous droits réservés.
          </p>
          {/* Optional: Add back-to-top or other links */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
