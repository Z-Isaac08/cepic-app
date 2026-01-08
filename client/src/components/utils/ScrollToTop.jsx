import { useEffect } from 'react';
import { useLocation } from 'react-router';

function ScrollToTop() {
  const { pathname } = useLocation();

  // Désactive la restauration automatique du scroll par le navigateur
  // Cela empêche le navigateur de revenir à la position précédente avec back/forward
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Scroll vers le haut à chaque changement de page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
