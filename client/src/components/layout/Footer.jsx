import {
  Calendar,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "À propos", href: "/about" },
      { name: "Équipe", href: "/team" },
      { name: "Carrières", href: "/careers" },
      { name: "Presse", href: "/press" },
    ],
    services: [
      { name: "Créer un événement", href: "/create" },
      { name: "Gestion d'événements", href: "/manage" },
      { name: "Billetterie", href: "/ticketing" },
      { name: "Support", href: "/support" },
    ],
    legal: [
      { name: "Conditions d'utilisation", href: "/terms" },
      { name: "Politique de confidentialité", href: "/privacy" },
      { name: "Cookies", href: "/cookies" },
      { name: "Mentions légales", href: "/legal" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                EventPro
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>contact@eventpro.ci</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+225 01 02 03 04 05</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Abidjan, Côte d'Ivoire</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-400">
              Entreprise
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary-400">
              Services
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-secondary-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-400">
              Légal
            </h3>
            <ul className="space-y-2 mb-6">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-secondary-400">
                Suivez-nous
              </h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-9 h-9 bg-gray-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
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
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 EventPro. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
