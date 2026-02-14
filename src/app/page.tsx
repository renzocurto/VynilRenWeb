import { loadDiscos } from "@/lib/loadDiscos";
import Catalogo from "@/components/Catalogo";

export default function Home() {
  const discos = loadDiscos();

  return <Catalogo discos={discos} />;
}
