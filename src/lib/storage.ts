/**
 * Accès sécurisé au localStorage : un contenu corrompu ou un stockage
 * indisponible ne doit jamais faire planter l'application au démarrage.
 */

export function loadFromStorage<T>(key: string, dateFields: readonly string[] = []): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw, (field, value) =>
      dateFields.includes(field) && typeof value === 'string' ? new Date(value) : value
    ) as T;
  } catch (error) {
    console.error(`Lecture impossible de "${key}" depuis le stockage local :`, error);
    return null;
  }
}

export function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Écriture impossible de "${key}" dans le stockage local :`, error);
  }
}
