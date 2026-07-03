/**
 * Échappe une valeur pour un fichier CSV : guillemets doublés, et mise entre
 * guillemets dès que la valeur contient un séparateur, un guillemet ou un
 * retour à la ligne.
 */
export function escapeCsvValue(value: unknown): string {
  let text: string;
  if (value === null || value === undefined) {
    text = '';
  } else if (value instanceof Date) {
    text = value.toLocaleDateString('fr-FR');
  } else {
    text = String(value);
  }

  if (/[",\n\r;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/** Construit un contenu CSV complet à partir d'en-têtes et de lignes. */
export function buildCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(escapeCsvValue).join(',')];
  for (const row of rows) {
    lines.push(row.map(escapeCsvValue).join(','));
  }
  return lines.join('\n') + '\n';
}
