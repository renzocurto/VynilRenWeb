import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const discos = [
  {
    Album: "The Dark Side of the Moon",
    Artista: "Pink Floyd",
    Imagen: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
  },
  {
    Album: "Abbey Road",
    Artista: "The Beatles",
    Imagen: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
  },
  {
    Album: "Rumours",
    Artista: "Fleetwood Mac",
    Imagen: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumworsCov.png",
  },
  {
    Album: "OK Computer",
    Artista: "Radiohead",
    Imagen: "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
  },
  {
    Album: "Led Zeppelin IV",
    Artista: "Led Zeppelin",
    Imagen: "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg",
  },
  {
    Album: "Wish You Were Here",
    Artista: "Pink Floyd",
    Imagen: "https://upload.wikimedia.org/wikipedia/en/a/a4/Pink_Floyd%2C_Wish_You_Were_Here_%281975%29.png",
  },
  {
    Album: "Kind of Blue",
    Artista: "Miles Davis",
    Imagen: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg",
  },
  {
    Album: "Nevermind",
    Artista: "Nirvana",
    Imagen: "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
  },
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(discos);
XLSX.utils.book_append_sheet(wb, ws, "Discos");

const outPath = path.join(__dirname, "..", "public", "discos.xlsx");
XLSX.writeFile(wb, outPath);
console.log(`Created ${outPath} with ${discos.length} discos`);
