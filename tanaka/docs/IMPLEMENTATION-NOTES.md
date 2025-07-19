# Tanaka Implementation Notes

**Purpose**: Technical implementation details and Firefox API compatibility analysis  
**Audience**: Developers implementing Tanaka features

## Navigation

- [Home](../README.md)
- [Getting Started](GETTING-STARTED.md)
- [Development](DEVELOPMENT.md)
- [Architecture](ARCHITECTURE.md)
- [Sync Protocol](SYNC-PROTOCOL.md)
- [Implementation Notes](IMPLEMENTATION-NOTES.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Git Guidelines](../../docs/GIT.md)

---

## Firefox API Compatibility Analysis

Based on analysis of the UI design specifications and Firefox WebExtension APIs, here's what's possible and what requires
workarounds.

### Fully Supported Features

#### Window/Tab Management

- **APIs**: `tabs.*`, `windows.*`
- Track browser windows and tabs
- Open, close, move tabs between windows  
- Tab properties: URL, title, pinned state, muted state
- Tab reordering and positioning
- Recently closed tabs via `sessions.*` API

#### UI Components

- **APIs**: `browserAction.*` (MV2) or `action.*` (MV3)
- Toolbar button with dynamic color states and badge
- Popup interface with full HTML/CSS/JS
- Dedicated manager tab pages via `tabs.create()`
- Settings pages via `runtime.openOptionsPage()`
- Modal dialogs using standard web technologies

#### Storage & Sync

- **APIs**: `storage.local`, `storage.sync`
- Device identity and naming
- Cross-device data sync (with rate limits)
- Local storage for device-specific data
- Offline functionality

#### Visual Features

- Dynamic icon colors via `browserAction.setIcon()`
- Badge text via `browserAction.setBadgeText()`
- Theme-aware icons via `theme_icons` in manifest
- Keyboard shortcuts via `commands` API
- Context menu items via `menus.*` API

### Features Requiring Workarounds

#### Tab Navigation History

```javascript
// Current limitation: No direct access to tab's back/forward history
// Workaround: Track navigation events
browser.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId === 0) { // Main frame only
    // Store navigation in custom history structure
    trackTabNavigation(details.tabId, details.url, details.transitionType);
  }
});
```

#### Real-time Synchronization

```javascript
// Limitation: storage.sync has rate limits (100 operations/minute)
// Workaround: Batch operations and use periodic HTTP sync

// Extension side
class SyncManager {
  constructor() {
    this.pendingOps = [];
    this.batchTimer = null;
    this.syncInterval = null;
  }

  startSync() {
    // Adaptive sync intervals: 1s when active, 10s when idle
    this.syncInterval = setInterval(() => {
      if (this.pendingOps.length > 0) {
        this.sendBatch();
      }
    }, this.isActive() ? 1000 : 10000);
  }

  queueOperation(op) {
    this.pendingOps.push(op);
    this.scheduleBatch();
  }

  scheduleBatch() {
    if (this.batchTimer) return;
    this.batchTimer = setTimeout(() => {
      this.sendBatch();
      this.batchTimer = null;
    }, 100); // 100ms debounce
  }
}
```

#### Tab Identity Across Devices

```javascript
// Limitation: Tab IDs are not persistent across devices
// Workaround: Generate and track custom UUIDs

const TAB_UUID_KEY = 'tanaka_tab_uuid';

async function getOrCreateTabUuid(tabId) {
  const result = await browser.sessions.getTabValue(tabId, TAB_UUID_KEY);
  if (result) return result;

  const uuid = generateUUID();
  await browser.sessions.setTabValue(tabId, TAB_UUID_KEY, uuid);
  return uuid;
}

// Use session storage to persist UUID across browser restarts
browser.tabs.onCreated.addListener(async (tab) => {
  const uuid = await getOrCreateTabUuid(tab.id);
  // Include UUID in sync operations
});
```

### Not Supported

1. **Tab Groups/Containers** - No API access to Firefox Container tabs
2. **Scroll Position** - Not accessible via extension APIs
3. **Form Data** - Not accessible for security reasons
4. **Session State (cookies/auth)** - Not synchronized for security

## Implementation Strategies

### CRDT Implementation

For conflict-free synchronization, integrate a CRDT library:

```javascript
// Using Yjs for CRDT operations
import * as Y from 'yjs';

class WorkspaceSync {
  constructor(workspaceId) {
    this.doc = new Y.Doc();
    this.tabs = this.doc.getMap('tabs');
    this.windows = this.doc.getMap('windows');
    this.workspaceId = workspaceId;
  }

  addTab(tabData) {
    const tabId = tabData.uuid;
    this.tabs.set(tabId, {
      ...tabData,
      lastModified: Date.now(),
      deviceId: this.deviceId
    });
  }

  // Serialize for HTTP sync
  getStateUpdate() {
    return Y.encodeStateAsUpdate(this.doc);
  }

  // Apply remote updates
  applyUpdate(update) {
    Y.applyUpdate(this.doc, update);
  }
}
```

### Navigation History Tracking

Custom implementation for combined navigation history:

```javascript
class NavigationHistory {
  constructor() {
    this.history = new Map(); // tabUuid -> history array
    this.currentIndex = new Map(); // tabUuid -> current position
  }

  async trackNavigation(tabId, url, transitionType) {
    const uuid = await getOrCreateTabUuid(tabId);

    if (!this.history.has(uuid)) {
      this.history.set(uuid, []);
      this.currentIndex.set(uuid, -1);
    }

    const history = this.history.get(uuid);
    const currentIndex = this.currentIndex.get(uuid);

    if (transitionType === 'back_forward') {
      // User used back/forward button
      // Update index based on URL matching
    } else {
      // New navigation, truncate forward history
      history.splice(currentIndex + 1);
      history.push({
        url,
        title: '', // Will be updated when available
        timestamp: Date.now(),
        deviceId: this.deviceId
      });
      this.currentIndex.set(uuid, history.length - 1);
    }

    // Sync history to server
    this.syncHistory(uuid, history);
  }
}
```

### Performance Optimizations

#### Web Worker for Heavy Operations

```javascript
// worker.js
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'PROCESS_SYNC_BATCH':
      const processed = processCRDTOperations(data);
      self.postMessage({ type: 'SYNC_BATCH_READY', data: processed });
      break;

    case 'DEDUPLICATE_TABS':
      const deduplicated = deduplicateTabs(data);
      self.postMessage({ type: 'TABS_DEDUPLICATED', data: deduplicated });
      break;
  }
});

// main.js
const syncWorker = new Worker('worker.js');

syncWorker.addEventListener('message', (event) => {
  const { type, data } = event.data;
  if (type === 'SYNC_BATCH_READY') {
    sendToServer(data);
  }
});
```

## API Permission Requirements

Required permissions in `manifest.json`:

```json
{
  "permissions": [
    "tabs",
    "windows",
    "sessions",
    "storage",
    "webNavigation",
    "menus",
    "notifications",
    "<all_urls>"
  ],
  "host_permissions": [
    "https://tanaka.example.com/*"
  ]
}
```

### Permission Justification

- `tabs` - Access tab properties and manage tabs
- `windows` - Track and manage browser windows
- `sessions` - Access recently closed tabs, store tab metadata
- `storage` - Sync settings and workspace data
- `webNavigation` - Track navigation for custom history
- `menus` - Add context menu items
- `notifications` - Alert users to sync issues
- `<all_urls>` - Track tabs on any website
- Host permission - Connect to Tanaka sync server

## Known Limitations & Workarounds

### Storage.sync Rate Limits

Firefox enforces these limits on `storage.sync`:

- 100 write operations per minute
- 1,800 write operations per hour

**Workaround**: Use local queue with batching and custom sync server.

### Tab ID Persistence

Tab IDs change on browser restart and differ across devices.

**Workaround**: Use `sessions.setTabValue()` to store persistent UUID.

### Missing Tab History API

No direct access to tab's back/forward history stack.

**Workaround**: Build custom history using `webNavigation` events.

### Event Page Support

Firefox 106+ supports event pages (non-persistent background).

**Implementation**:

```json
{
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  }
}
```

## Testing Considerations

### Multi-Device Testing

1. Use Firefox Developer Edition and Release simultaneously
2. Create separate profiles for each "device"
3. Use different device names in settings

### Simulating Sync Conflicts

```javascript
// Test helper to create conflicting operations
async function createConflict() {
  // Device A
  await moveTab(tabId, 0);

  // Device B (simulate delayed)
  setTimeout(() => moveTab(tabId, 5), 100);

  // Both operations should resolve correctly via CRDT
}
```

### Performance Testing

```javascript
// Create many tabs for stress testing
async function stressTest() {
  const urls = Array(200).fill(0).map((_, i) =>
    `https://example.com/test${i}`
  );

  for (const url of urls) {
    await browser.tabs.create({ url });
    await new Promise(r => setTimeout(r, 100)); // Avoid overwhelming
  }
}
```

## Security Considerations

### Token Storage

Never store auth tokens in sync storage. Use local storage only:

```javascript
// Correct
await browser.storage.local.set({ authToken: token });

// Incorrect - would sync to all devices
// await browser.storage.sync.set({ authToken: token });
```

### Content Security Policy

For the popup and options pages:

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```
