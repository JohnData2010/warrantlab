import Workspace from "../components/Workspace";
import { getConfig } from "../lib/config";
import { getSectionOptions } from "../lib/sections";

export const dynamic = "force-dynamic";

export default function Home() {
  const config = getConfig();
  return <Workspace sections={getSectionOptions(config.devPreview)} maxWords={config.maxWords} />;
}
