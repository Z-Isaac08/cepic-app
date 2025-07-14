import React from "react";

/**
 * Composant ErrorBoundary pour capturer les erreurs JavaScript
 * dans la sous-hiérarchie React et afficher un fallback UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Méthode appelée lorsqu'une erreur est capturée dans un composant enfant
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Méthode facultative pour logguer l'erreur ailleurs (ex: service externe)
  componentDidCatch(error, errorInfo) {
    console.error("Une erreur a été capturée :", error, errorInfo);
    // Tu peux envoyer les erreurs vers un outil comme Sentry ici
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <h1 className="text-2xl font-semibold text-red-600">
            Une erreur est survenue
          </h1>
          <p className="mt-2 text-gray-700">
            {this.state.error?.message || "Quelque chose s'est mal passé."}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
