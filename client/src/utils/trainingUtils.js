// Utilitaires pour les formations
export const formatTrainingLevel = (level) => {
  const levelMap = {
    DEBUTANT: 'Débutant',
    INTERMEDIATE: 'Intermédiaire',
    ADVANCED: 'Avancé',
    Débutant: 'Débutant',
    Intermédiaire: 'Intermédiaire',
    Avancé: 'Avancé',
  };

  return levelMap[level] || level;
};

export default {
  formatTrainingLevel,
};
