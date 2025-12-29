import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Service de gestion des tokens CSRF
 * Gère la récupération et le stockage du token CSRF pour toutes les requêtes
 */
class CSRFService {
  constructor() {
    this.token = null;
    this.isFetching = false;
    this.fetchPromise = null;
  }

  /**
   * Récupérer un nouveau token CSRF depuis le serveur
   * @returns {Promise<string|null>} Le token CSRF ou null en cas d'erreur
   */
  async fetchToken() {
    // Si déjà en train de récupérer, attendre la promesse existante
    if (this.isFetching && this.fetchPromise) {
      return this.fetchPromise;
    }

    this.isFetching = true;
    this.fetchPromise = (async () => {
      try {
        const response = await axios.get(`${API_URL}/csrf-token`, {
          withCredentials: true,
        });
        this.token = response.data.csrfToken;
        console.log('Token CSRF récupéré avec succès');
        return this.token;
      } catch (error) {
        console.error('Erreur récupération token CSRF:', error);
        this.token = null;
        return null;
      } finally {
        this.isFetching = false;
        this.fetchPromise = null;
      }
    })();

    return this.fetchPromise;
  }

  /**
   * Obtenir le token CSRF actuel
   * @returns {string|null} Le token ou null
   */
  getToken() {
    return this.token;
  }

  /**
   * Effacer le token CSRF
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Vérifier si un token est disponible
   * @returns {boolean}
   */
  hasToken() {
    return !!this.token;
  }
}

// Instance singleton
const csrfService = new CSRFService();

export default csrfService;
