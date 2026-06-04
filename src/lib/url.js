// Préfixe le `base` GitHub Pages à un chemin interne.
// Usage : url('/expertises') -> '/site-willie/expertises'
const BASE = import.meta.env.BASE_URL; // ex: '/site-willie/'

export function url(path = '/') {
  const base = BASE.replace(/\/$/, '');
  if (!path.startsWith('/')) path = '/' + path;
  return base + path;
}

// Liens externes / contacts réutilisés partout
export const CALENDLY = 'https://calendly.com/willie-leroux38/30min';
export const LINKEDIN = 'https://www.linkedin.com/in/willie-leroux-docone/';
export const LIEU = 'Mérignac, Nouvelle-Aquitaine';
// Web3Forms : colle ici la clé d'accès reçue par mail depuis https://web3forms.com
// (entre l'email wleroux@docone.fr sur le site → la clé arrive par mail).
// Tant que la clé est vide, le formulaire renvoie vers Calendly.
export const WEB3FORMS_KEY = 'bbb1062b-8665-41de-b30a-fe9d1d44e3de';
export const EMAIL = 'wleroux@docone.fr'; // destinataire des messages (fallback mailto)
