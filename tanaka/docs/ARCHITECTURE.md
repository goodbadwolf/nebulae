# Tanaka Architecture

**Purpose**: How Tanaka works under the hood  
**Audience**: Future me and anyone interested in the implementation

## Navigation

- [Home](../README.md)
- [Getting Started](GETTING-STARTED.md)
- [Development](DEVELOPMENT.md)
- [Architecture](ARCHITECTURE.md)
- [Sync Protocol](SYNC-PROTOCOL.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Git Guidelines](../../docs/GIT.md)

---

## System Overview

```text
┌──────────────┐  JSON Operations via HTTPS  ┌──────────────┐
│  Extension   │ ─────────────────────────▶  │    Server    │
│ (TypeScript) │ ◀─────────────────────────  │    (Rust)    │
└──────────────┘    Adaptive 1-10s sync      └─────┬────────┘
                                                   │  SQLite WAL
                                                   ▼
                                                tanaka.db
```

## How It Works

### Extension Side

1. **Capture** – Listens to Firefox tab and window events
2. **Encode** – Converts changes to operations like `upsert_tab` or `close_tab`
3. **Sync** – Sends operations to server and receives updates from other devices

### Server Side

1. **Merge** – Server receives operations and applies them to the shared state
2. **Persist** – Operations are cached in memory and saved to SQLite
3. **Respond** – Server sends back any newer operations from other devices

## Data Guarantees

The system provides:

- **Eventual Consistency** – CRDT operations ensure all devices converge to the same state
- **Crash Safety** – SQLite with WAL mode persists data across restarts
- **Security** – HTTPS + bearer token authentication

## CRDT Synchronization Protocol

Tanaka uses JSON-based CRDT operations that automatically resolve conflicts:

- **Operations**: `upsert_tab`, `close_tab`, `move_tab`, etc.
- **Ordering**: Lamport clock ensures consistent operation order

### Sync Flow

1. Extension captures tab/window changes
2. Changes are queued as operations
3. Operations sent to server `/sync` endpoint
4. Server merges operations and saves to database
5. Server returns any newer operations from other devices
6. Extension applies those operations locally

## Security

- Bearer token authentication (configured in both extension and server)
- HTTPS for all communication (self-signed certs work for local use)
- SQLite database for server storage
- Browser storage API for client data

## Performance

Designed to handle 200+ tabs smoothly with these optimizations:

- In-memory caching for fast access
- SQLite WAL mode for better performance
- Adaptive sync: 1s when active, 10s when idle
- Web Workers to keep UI responsive
- Batching and deduplication to reduce network traffic

## Storage

### Client Storage

- Browser's local storage for tab state and settings
- Queue for pending operations

### Server Storage

- SQLite database (tanaka.db) with WAL mode
- Operations table for sync history
- Current state table for quick access

## Extension Architecture

### Background Service

- Persistent background script
- Manages all tab/window events
- Handles sync operations
- Message broker for UI components

### UI Components

The UI components include:

- Popup: Window tracking controls
- Settings: Server configuration

### Message Passing

- Background ↔ Popup communication
- Background ↔ Settings communication
- Structured message types with TypeScript

### Web Worker Implementation

Tanaka uses Web Workers to offload heavy CRDT operations from the main thread:

```text
     Main Thread            Web Worker Thread
┌──────────────────┐       ┌─────────────────┐
│ SyncManager      │       │ CrdtWorker      │
│                  │ ───── │                 │
│  - Queue ops     │  msgs │ - Operation     │
│  - Sync with API │ <──── │   queueing      │
│  - Apply remote  │       │ - Deduplication │
│    operations    │       │ - Priority      │
│                  │       │   management    │
└──────────────────┘       └─────────────────┘
         │
         ▼
    Browser APIs
   (tabs, windows)
```

This keeps the UI responsive even when syncing lots of tabs by moving heavy operations to a background thread.

## Possible Future Ideas

- Tab search UI
- P2P sync between devices
- Cross-browser support

## Related Documentation

- [Development Setup](DEVELOPMENT.md) - Get started with the codebase
- [Troubleshooting](TROUBLESHOOTING.md) - Debug common issues
