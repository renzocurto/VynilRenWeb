import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

const supabaseUrl = "https://bixkojgawegaxozenuxw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpeGtvamdhd2VnYXhvemVudXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMDIwNzcsImV4cCI6MjA4OTc3ODA3N30.w319VEEpiCo0XBdLn9HAO0DtyoZXy1xiQmFMT1MIeUw";

const supabase = createClient(supabaseUrl, supabaseKey);

// Leer el Excel
const filePath = path.join(process.cwd(), "public", "discos.xlsx");

if (!fs.existsSync(filePath)) {
  console.error("No se encontro el archivo public/discos.xlsx");
  process.exit(1);
}

const buffer = fs.readFileSync(filePath);
const workbook = XLSX.read(buffer, { type: "buffer" });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(sheet);

const discos = rawData.map((row) => ({
  album: row["Album"] || row["album"] || "",
  artista: row["Artista"] || row["artista"] || "",
  imagen: row["Imagen"] || row["imagen"] || "",
}));

console.log(`\nMigrando ${discos.length} discos a Supabase...\n`);

// Insertar en batches de 50
const batchSize = 50;
let total = 0;

for (let i = 0; i < discos.length; i += batchSize) {
  const batch = discos.slice(i, i + batchSize);
  const { data, error } = await supabase.from("discos").insert(batch).select();

  if (error) {
    console.error(`Error en batch ${i / batchSize + 1}:`, error.message);
    process.exit(1);
  }

  total += data.length;
  console.log(`  Batch ${Math.floor(i / batchSize) + 1}: ${data.length} discos insertados`);
}

console.log(`\n${total} discos migrados exitosamente!\n`);
