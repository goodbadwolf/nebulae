# Tanaka Extension Architecture

**Purpose**: How Tanaka works under the hood  
**Audience**: Future me and anyone interested in the implementation

## Navigation

- [Home](../README.md)
- [Getting Started](GETTING-STARTED.md)
- [Development](DEVELOPMENT.md)
- [Architecture](ARCHITECTURE.md)
- [Firefox API Guide](FIREFOX-API-GUIDE.md)
- [UI Design](UI-DESIGN.md)
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

Tanaka uses custom JSON-based CRDT operations that automatically resolve conflicts:

- **Operations**: `upsert_tab`, `close_tab`, `move_tab`, etc.
- **Ordering**: Lamport clock ensures consistent operation order
- **Implementation**: Custom CRDT approach (not Yjs) optimized for tab sync

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

## Extension Components Overview

Tanaka consists of several interconnected components:

```text
┌─────────────────────────────────────────────────────┐
│                Firefox Extension                     │
├─────────────────────────┬───────────────────────────┤
│   Background Script     │      UI Components        │
│                        │                            │
│  - Tab/Window Events   │  - Popup (tracking)      │
│  - Sync Manager        │  - Settings (config)     │
│  - Message Broker      │  - Manager (tab list)    │
│  - Web Worker          │  - Playground (dev)      │
└────────────────────────┴───────────────────────────┘
```

### Background Service

The persistent background script is the heart of the extension:

- **Event Handling**: Captures all tab/window events from Firefox
- **Sync Coordination**: Manages periodic sync with server
- **Message Broker**: Routes messages between UI components
- **State Management**: Maintains current tab state in memory
- **Worker Management**: Spawns Web Worker for heavy operations

### UI Components

#### Popup

- Quick access window tracking controls
- Minimal UI for fast interactions
- Shows sync status and tracked windows

#### Settings Page

- Server configuration (URL, auth token)
- Sync preferences and intervals
- Debug options and logging

#### Manager Page

- Full tab list across all devices
- Search and filter capabilities
- Batch operations on tabs

#### Playground (Development)

- Component showcase and testing
- Mock data for safe experimentation
- Living documentation of UI patterns

### Message Passing Architecture

All communication flows through the background script:

```typescript
// Message types are strongly typed
type BackgroundMessage =
  | { type: "TRACK_WINDOW"; windowId: number }
  | { type: "UNTRACK_WINDOW"; windowId: number }
  | { type: "SYNC_NOW" }
  | { type: "GET_STATUS" };
```

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

## Directory Structure

```text
extension/
├── src/
│   ├── background/         # Background script
│   │   ├── sync/          # Sync manager and operations
│   │   ├── tracker/       # Window/tab tracking
│   │   └── messages/      # Message handling
│   ├── popup/             # Popup UI
│   ├── settings/          # Settings page
│   ├── manager/           # Manager page
│   ├── playground/        # Development playground
│   ├── components/        # Shared UI components
│   ├── di/               # Dependency injection
│   ├── storage/          # Storage providers
│   └── api/              # API providers
├── manifest.json          # Extension manifest
└── webpack.config.js      # Multi-entry build config
```

## Firefox Extension Architecture

### Browser API Integration

Tanaka integrates deeply with Firefox WebExtension APIs:

```text
┌─────────────────────────────────────────────────────┐
│                  Extension Process                   │
├─────────────────────────────────────────────────────┤
│  Background Script (Persistent)                      │
│  - Tab/Window Event Listeners                       │
│  - Sync Coordination                                │
│  - Message Broker                                   │
├─────────────────────────────────────────────────────┤
│  Content Scripts         │   Extension Pages         │
│  - Not used currently    │   - Popup UI             │
│                         │   - Settings Page         │
│                         │   - Manager Tab           │
└─────────────────────────────────────────────────────┘
                    │
                    ▼
        Firefox WebExtension APIs
        - tabs.*
        - windows.*
        - storage.*
        - sessions.*
        - webNavigation.*
```

### Storage Strategy

Tanaka uses a hybrid storage approach:

- **storage.local**: Device-specific data, auth tokens, cache
- **storage.sync**: User preferences (limited use due to rate limits)
- **Custom sync**: HTTP + CRDT for periodic tab sync
- **sessions API**: Tab metadata persistence (UUIDs)

### Message Passing Architecture

All UI components communicate through the background script:

```text
Popup ←──────→ Background ←──────→ Server
              Script
Settings ←────→     ↑
                    │
Manager Tab ←───────┘
```

Message types are strongly typed with TypeScript interfaces.

## Dependency Injection System

Tanaka uses a service provider pattern for dependency injection:

### Service Providers

```typescript
interface IServiceProvider {
  storage: IStorageProvider;
  api: IAPIProvider;
  // Future: auth, logger, etc.
}
```

### Benefits

- **Testability**: Easy to mock services for testing
- **Flexibility**: Switch between real and mock implementations
- **Maintainability**: Clear separation of concerns
- **Development**: Playground uses mock providers

### Usage Pattern

```typescript
// Production popup
export default withServicesContainer(PopupApp, {
  storage: new BrowserStorageProvider(),
  api: new ServerAPIProvider()
});

// Playground popup
export default withServicesContainer(PopupApp, {
  storage: new MockStorageProvider(),
  api: new MockAPIProvider()
});
```

### Periodic Sync Architecture

Due to storage.sync rate limits, Tanaka implements custom periodic sync:

1. **Local Changes**: Captured by background script event listeners
2. **Operation Queue**: Buffered in memory with deduplication
3. **Batch Sync**: Operations sent to server every 1s (active) or 10s (idle)
4. **Polling**: Periodic HTTP requests to check for updates from other devices
5. **CRDT Merge**: Conflict-free merge of remote operations

## Development Tools

### Playground

The playground is a development environment for building and testing Tanaka components:

- **Component Showcase**: Living documentation of all UI components
- **Mock Services**: Test with fake data without affecting production
- **Rapid Prototyping**: Iterate quickly on new features
- **Pattern Library**: Reference implementation of best practices

### Playground URL Structure

- `/playground` - Main playground with navigation
- `/playground#pages` - Extension pages showcase
- `/playground#components` - Component library
- `/playground#experiments` - Experimental features
- `/playground/welcome` - Welcome page with mock services
- `/playground/settings` - Settings page with mock services
- `/playground/manager` - Manager page with mock services

### Playground Features

The playground provides:

- **Component Examples**: Each component can provide `*.examples.tsx` files
- **Mock Services**: Test with fake data using MockStorageProvider and MockAPIProvider
- **Debug Toolbar**: Service switchers, theme controls, and state inspection
- **Navigation**: Hash-based routing for different sections

Built with React and Mantine UI, following the same patterns as production components.

## Related Documentation

- [Development Setup](DEVELOPMENT.md) - Get started with the codebase
- [Firefox API Guide](FIREFOX-API-GUIDE.md) - Firefox API details and workarounds
- [UI Design](UI-DESIGN.md) - User interface specifications
- [Troubleshooting](TROUBLESHOOTING.md) - Debug common issues
