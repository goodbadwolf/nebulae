import { Center, MantineProvider } from "@mantine/core";
import { useState } from "react";

import { PageShell } from "../../../components/page-shell";
import { WelcomeWizard } from "./components/welcome-wizard";

export function WelcomePage() {
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = () => {
    setIsComplete(true);
    console.log("Welcome wizard completed!");
  };

  return (
    <MantineProvider>
      <PageShell header={{ brand: "Tanaka Welcome" }}>
        <Center mih="calc(100vh - 240px)" p="xl">
          <WelcomeWizard onComplete={handleComplete} />
          {isComplete && (
            <div style={{ position: "absolute", top: "10px", right: "10px", color: "green" }}>✓ Setup Complete</div>
          )}
        </Center>
      </PageShell>
    </MantineProvider>
  );
}
