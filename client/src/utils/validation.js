// Règles de validation pour les formulaires d'authentification
// SYNC: Ces règles doivent correspondre à server/schemas/authSchemas.js

// Regex pour mot de passe fort (minuscule + majuscule + chiffre + caractère spécial)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]).*$/;

export const VALIDATION_RULES = {
  firstName: {
    min: 2,
    validate: (value) => value.length >= 2,
    message: 'Le prénom doit contenir au moins 2 caractères',
  },
  lastName: {
    min: 2,
    validate: (value) => value.length >= 2,
    message: 'Le nom doit contenir au moins 2 caractères',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Adresse email invalide',
  },
  password: {
    min: 8,
    validate: (value) => value.length >= 8 && PASSWORD_REGEX.test(value),
    message: 'Le mot de passe doit contenir au moins 8 caractères, une minuscule, une majuscule, un chiffre et un caractère spécial',
  },
};

/**
 * Analyse détaillée des critères du mot de passe
 * @param {string} password - Mot de passe à analyser
 * @returns {{ length: boolean, lowercase: boolean, uppercase: boolean, number: boolean, special: boolean, isValid: boolean }}
 */
export function getPasswordCriteria(password) {
  const criteria = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/.test(password),
  };

  // Valide si tous les critères sont satisfaits
  criteria.isValid = Object.values(criteria).every(Boolean);

  return criteria;
}

/**
 * Valide un champ en temps réel
 * @param {string} fieldName - Nom du champ
 * @param {string} value - Valeur à valider
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validateField(fieldName, value) {
  const rule = VALIDATION_RULES[fieldName];

  if (!rule) {
    return { isValid: true, error: null };
  }

  // Si le champ est vide, pas d'erreur (le required HTML s'en charge)
  if (!value || value.trim() === '') {
    return { isValid: false, error: null };
  }

  const isValid = rule.validate(value);
  return {
    isValid,
    error: isValid ? null : rule.message,
  };
}

/**
 * Valide la confirmation du mot de passe
 * @param {string} password - Mot de passe
 * @param {string} confirmPassword - Confirmation
 * @returns {{ isValid: boolean, error: string | null }}
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) {
    return { isValid: false, error: null };
  }

  const isValid = password === confirmPassword;
  return {
    isValid,
    error: isValid ? null : 'Les mots de passe ne correspondent pas',
  };
}

/**
 * Vérifie si le formulaire est valide pour soumission
 * @param {Object} formData - Données du formulaire
 * @param {string[]} requiredFields - Champs requis
 * @returns {boolean}
 */
export function isFormValid(formData, requiredFields) {
  for (const field of requiredFields) {
    const value = formData[field];

    if (!value || value.trim() === '') {
      return false;
    }

    const { isValid } = validateField(field, value);
    if (!isValid) {
      return false;
    }
  }

  // Vérifier la confirmation du mot de passe si présente
  if (formData.confirmPassword !== undefined) {
    const { isValid } = validatePasswordMatch(formData.password, formData.confirmPassword);
    if (!isValid) {
      return false;
    }
  }

  return true;
}
