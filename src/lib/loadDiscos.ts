import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

export interface Disco {
  album: string;
  artista: string;
  imagen: string;
}

export function loadDiscos(): Disco[] {
  const filePath = path.join(process.cwd(), "public", "discos.xlsx");

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

  return rawData.map((row) => ({
    album: row["Album"] || row["album"] || "",
    artista: row["Artista"] || row["artista"] || "",
    imagen: row["Imagen"] || row["imagen"] || "",
  }));
}
