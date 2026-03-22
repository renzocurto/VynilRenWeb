import { loadDiscos } from "@/lib/loadDiscos";
import Catalogo from "@/components/Catalogo";

export const dynamic = "force-dynamic";

export default async function Home() {
  const discos = await loadDiscos();

  return <Catalogo discos={discos} />;
}
