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
