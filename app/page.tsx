import AppShell from "../components/AppShell";
import { getConfig } from "../lib/config";
import { getSectionOptions } from "../lib/sections";

export const dynamic = "force-dynamic";

export default function Home() {
  const config = getConfig();
  return <AppShell sections={getSectionOptions(config.devPreview)} maxWords={config.maxWords} researchPreview={config.researchPreview} />;
}
