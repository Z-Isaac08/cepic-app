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
      { name: 'Mes inscriptions', href: '/mes-inscriptions' },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.jpg" alt="CEPIC" className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-xl font-bold text-white">CEPIC</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">{CEPIC_INFO.fullName}</p>
            <p className="text-gray-400 text-xs">Excellence en Formation Professionnelle</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <a
                  href={`mailto:${CEPIC_INFO.email}`}
                  className="hover:text-secondary-500 transition-colors"
                >
                  {CEPIC_INFO.email}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{CEPIC_INFO.phone.primary}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{CEPIC_INFO.phone.secondary}</span>
              </div>
              <div className="flex items-start space-x-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>{CEPIC_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* Formations Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary-500">Formations</h3>
            <ul className="space-y-2">
              {footerLinks.formations.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-secondary-500 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary-500">CEPIC</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-secondary-500 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary-500">Légal</h3>
            <ul className="space-y-2 mb-6">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-secondary-500 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-secondary-500">Suivez-nous</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-9 h-9 bg-gray-800 hover:bg-secondary-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {CEPIC_INFO.shortName}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
