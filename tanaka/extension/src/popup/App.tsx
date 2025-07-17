import { useState } from "react";
import StatusIndicator from "./components/StatusIndicator";
import SyncButton from "./components/SyncButton";
import "./styles/App.css";

function App() {
  const [status, setStatus] = useState<"ready" | "syncing" | "error">("ready");
  const [tabCount, setTabCount] = useState<number>(0);
  const handleSync = async () => {
    setStatus("syncing");
    setTabCount(tabCount);
    setTimeout(() => {
      setStatus("ready");
      setTabCount(tabCount + 1);
    }, 100);
  };

  return (
    <div className="app">
      <h1>Tanaka Tab Sync</h1>
      <p className="subtitle">Sync your tabs across devices</p>
      <StatusIndicator status={status} tabCount={tabCount} />
      <SyncButton onSync={handleSync} disabled={status === "syncing"} />
    </div>
  );
}

export default App;
