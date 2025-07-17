import React from 'react';

interface SyncButtonProps {
  onSync: () => void;
  disabled: boolean;
}

const SyncButton: React.FC<SyncButtonProps> = ({ onSync, disabled }) => {
  return (
    <button
      className="sync-button"
      onClick={onSync}
      disabled={disabled}
    >
      {disabled ? 'Syncing...' : 'Sync Now'}
    </button>
  );
};

export default SyncButton;
