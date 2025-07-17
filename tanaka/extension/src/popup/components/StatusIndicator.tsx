import React from "react";

interface StatusIndicatorProps {
  status: "ready" | "syncing" | "error";
  tabCount: number | null;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  tabCount,
}) => {
  const getStatusText = () => {
    switch (status) {
      case "syncing":
        return "Syncing...";
      case "error":
        return "Sync failed";
      case "ready":
        return tabCount !== null ? `Synced ${tabCount} tabs` : "Ready";
      default:
        return "Unknown status";
    }
  };

  return (
    <div className={`status-indicator status-${status}`}>{getStatusText()}</div>
  );
};

export default StatusIndicator;
