# Sync Protocol

**Purpose**: How Tanaka syncs tabs between devices

## Navigation

- [Home](../README.md)
- [Getting Started](GETTING-STARTED.md)
- [Development](DEVELOPMENT.md)
- [Architecture](ARCHITECTURE.md)
- [Sync Protocol](SYNC-PROTOCOL.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Git Guidelines](../../docs/GIT.md)

## Overview

Tanaka uses JSON-based CRDT operations to sync tabs without conflicts.
Each change becomes an operation that can be merged safely across devices.

## How It Works

### Message Format

```json
{
  "clock": 12345,
  "device_id": "device-uuid-123",
  "operations": [
    {
      "type": "upsert_tab",
      "id": "tab1",
      "data": {
        "window_id": "window1",
        "url": "https://example.com",
        "title": "Example Site",
        "active": true,
        "index": 0
      }
    },
    {
      "type": "close_tab",
      "id": "tab2"
    }
  ]
}
```

### Operation Types

#### Tab Operations

- `upsert_tab` - Create or update a tab
- `close_tab` - Remove a tab
- `set_active` - Mark a tab as active/inactive
- `move_tab` - Change tab index within window
- `change_url` - Update tab URL (navigation)

#### Window Operations  

- `track_window` - Start tracking a window
- `untrack_window` - Stop tracking a window
- `set_window_focus` - Mark window as focused

### Conflict Resolution

Operations include timestamps (Lamport clocks) to ensure consistent ordering across devices. Last-write-wins for conflicts.

### Sync Flow

1. Extension sends operations to server
2. Server merges operations and updates database
3. Server returns new operations from other devices
4. Extension applies those operations locally

### API Endpoint: POST /sync

Exchange operations between client and server:

```json
// Request: Send local operations + request updates
{
  "clock": 12345,
  "device_id": "device-123",
  "since_clock": 12300,  // "Give me operations newer than this"
  "operations": [{...}]   // Local changes to sync
}

// Response: New operations from other devices
{
  "clock": 12346,
  "operations": [{...}]   // Operations to apply locally
}
```

## Technical Details

### Storage

Operations are stored in SQLite with:

- Operation history for full sync capability
- Current state cache for performance
- Lamport clock indexing for efficient queries

### Performance

- Batches multiple operations per request
- Only syncs changes since last update
- In-memory cache for active data
- Handles 200+ tabs smoothly

### Security

- Bearer token authentication
- HTTPS encryption (optional for local use)
- Input validation on all operations

## Tab Identity Management

Since Firefox tab IDs are ephemeral and device-specific, Tanaka uses persistent UUIDs:

### UUID Generation

```javascript
// Store UUID using sessions API for persistence
browser.sessions.setTabValue(tabId, 'tanaka_tab_uuid', uuid);

// Retrieve UUID (survives browser restarts)
const uuid = await browser.sessions.getTabValue(tabId, 'tanaka_tab_uuid');
```

### Identity Mapping

Each device maintains a mapping:

- Local tab ID ↔ Persistent UUID
- UUID is included in all sync operations
- Server only knows about UUIDs, not local IDs

## Navigation History Sync

Firefox doesn't provide access to tab history, so Tanaka builds its own:

### History Tracking

```javascript
// Listen to navigation events
browser.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId === 0) { // Main frame only
    const operation = {
      type: 'add_history_entry',
      tab_uuid: getTabUuid(details.tabId),
      url: details.url,
      timestamp: Date.now(),
      transition_type: details.transitionType
    };
    syncQueue.add(operation);
  }
});
```

### History Structure

```json
{
  "tab_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "history": [
    {
      "url": "https://example.com",
      "title": "Example",
      "timestamp": 1704067200000,
      "device_id": "laptop-123"
    }
  ],
  "current_index": 0
}
```

## Periodic Sync Strategy

To overcome storage.sync rate limits, Tanaka uses adaptive HTTP polling:

### Sync Intervals

- **Active Mode**: 1 second intervals when user is actively browsing
- **Idle Mode**: 10 second intervals when user is inactive
- **Offline Mode**: Operations queued locally until connection restored

### Sync Approach

1. **HTTP Sync**: Periodic sync via `/sync` endpoint
2. **Operation Queue**: Buffer operations locally with deduplication
3. **Adaptive Intervals**: Fast sync when active, slower when idle
4. **Reconciliation**: Merge operations when coming back online

## CRDT Library Integration

Tanaka uses operation-based CRDTs for conflict resolution:

### Operation Ordering

```javascript
class LamportClock {
  constructor(deviceId) {
    this.time = 0;
    this.deviceId = deviceId;
  }

  tick() {
    this.time++;
    return { time: this.time, device: this.deviceId };
  }

  update(remoteTime) {
    this.time = Math.max(this.time, remoteTime) + 1;
  }
}
```

### Conflict Resolution Rules

1. **Tab URL Changes**: Last-write-wins based on Lamport timestamp
2. **Tab Position**: Operational transformation for concurrent moves
3. **Tab Close**: Tombstone with timestamp, removes win over updates
4. **Window Assignment**: Last-write-wins

### Example: Concurrent Tab Move

```javascript
// Device A: Move tab to position 0
{ clock: { time: 10, device: "A" }, type: "move_tab", id: "tab1", index: 0 }

// Device B: Move same tab to position 5  
{ clock: { time: 10, device: "B" }, type: "move_tab", id: "tab1", index: 5 }

// Resolution: Device ID breaks tie, "B" > "A", tab ends at position 5
```
