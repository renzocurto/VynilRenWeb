import { supabase } from "./supabase";

export interface Disco {
  id?: number;
  album: string;
  artista: string;
  imagen: string;
}

const LEADING_ARTICLES = [
  "the ", "los ", "las ", "les ", "gli ",
  "der ", "die ", "das ",
  "el ", "la ", "le ", "lo ", "an ",
  "os ", "as ",
  "l'",
  "a ",
];

const TRAILING_ARTICLES = [
  " The", " Los", " Las", " Les", " Gli",
  " Der", " Die", " Das",
  " El", " La", " Le", " Lo",
];

function displayName(name: string): string {
  const trimmed = name.trim();
  for (const article of TRAILING_ARTICLES) {
    if (trimmed.endsWith(article)) {
      return `${article.trim()} ${trimmed.slice(0, -article.length)}`;
    }
  }
  return trimmed;
}

function sortName(name: string): string {
  const lower = name.trim().toLowerCase();

  for (const article of LEADING_ARTICLES) {
    if (lower.startsWith(article)) {
      return lower.substring(article.length).trim();
    }
  }

  for (const article of TRAILING_ARTICLES) {
    if (lower.endsWith(article.toLowerCase())) {
      return lower.slice(0, -article.length).trim();
    }
  }

  return lower;
}

export async function loadDiscos(): Promise<Disco[]> {
  const { data, error } = await supabase
    .from("discos")
    .select("*");

  if (error) {
    console.error("Error loading discos:", error);
    return [];
  }

  const discos = ((data || []) as Disco[]).map((d) => ({
    ...d,
    artista: displayName(d.artista),
  }));

  discos.sort((a, b) => {
    const cmp = sortName(a.artista).localeCompare(sortName(b.artista), "es");
    if (cmp !== 0) return cmp;
    return a.album.toLowerCase().localeCompare(b.album.toLowerCase(), "es");
  });

  return discos;
}
