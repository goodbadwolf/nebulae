# Firefox API Guide

**Purpose**: Comprehensive guide to Firefox WebExtension APIs used by Tanaka  
**Audience**: Extension developers

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

## Manifest Configuration

Tanaka currently uses **Manifest V2** for broader Firefox compatibility. Future migration to Manifest V3 is planned but
not yet implemented.

```json
{
  "manifest_version": 2,
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
    "https://*.tanaka.example.com/*"
  ]
}
```

### Permission Justification

| Permission | Purpose | User-visible features |
|------------|---------|---------------------|
| `tabs` | Read tab URLs, titles, manage tabs | Core functionality - tab synchronization |
| `windows` | Track windows, focus management | Window-as-workspace tracking |
| `sessions` | Recently closed tabs, tab metadata | Restore closed tabs, store UUIDs |
| `storage` | Persist settings and cache | Remember preferences across restarts |
| `webNavigation` | Track page navigation | Build tab history for back/forward |
| `menus` | Context menu integration | Right-click shortcuts |
| `notifications` | Alert on sync errors | Connection/sync failure alerts |
| `<all_urls>` | Track any website | Sync tabs from any site |

## Core API Patterns

### Tab Identity Management

Since Firefox tab IDs are ephemeral and device-specific, Tanaka uses persistent UUIDs:

```typescript
const TAB_UUID_KEY = 'tanaka_tab_uuid';

async function getOrCreateTabUuid(tabId: number): Promise<string> {
  // Use sessions API for persistence across browser restarts
  const result = await browser.sessions.getTabValue(tabId, TAB_UUID_KEY);
  if (result) return result;

  const uuid = generateUUID();
  await browser.sessions.setTabValue(tabId, TAB_UUID_KEY, uuid);
  return uuid;
}

// Listen for tab events
browser.tabs.onCreated.addListener(async (tab) => {
  if (!isWindowTracked(tab.windowId)) return;

  const uuid = await getOrCreateTabUuid(tab.id);
  const operation = {
    type: 'upsert_tab',
    id: uuid,
    data: {
      url: tab.url,
      title: tab.title,
      pinned: tab.pinned,
      index: tab.index,
      windowId: await getWindowUuid(tab.windowId)
    }
  };

  await queueOperation(operation);
});
```

### Window Tracking

```typescript
async function trackWindow(windowId: number, workspaceName: string) {
  const window = await browser.windows.get(windowId, { populate: true });
  const windowUuid = generateUUID();

  // Store tracking state
  await browser.sessions.setWindowValue(windowId, 'tanaka_workspace', {
    uuid: windowUuid,
    name: workspaceName,
    tracked: true
  });

  // Track all existing tabs
  for (const tab of window.tabs) {
    await trackTab(tab);
  }
}

// Window removal
browser.windows.onRemoved.addListener(async (windowId) => {
  const workspace = await browser.sessions.getWindowValue(
    windowId,
    'tanaka_workspace'
  );

  if (workspace?.tracked) {
    await handleWindowClosed(workspace.uuid);
  }
});
```

### Storage Strategy

```typescript
// Local storage for device-specific data
const localData = {
  deviceId: 'unique-device-id',
  authToken: 'secret-token',
  serverUrl: 'https://tanaka.example.com',
  syncCache: {}, // Last known state
  operationQueue: [] // Pending operations
};

await browser.storage.local.set(localData);

// Sync storage for user preferences (use sparingly due to rate limits)
const syncData = {
  syncInterval: 10000,
  theme: 'dark',
  shortcuts: {}
};

await browser.storage.sync.set(syncData);
```

## Workarounds for API Limitations

### Storage.sync Rate Limits

Firefox enforces strict limits on `storage.sync`:

- 100 write operations per minute
- 1,800 write operations per hour

**Solution**: Implement custom sync with batching and HTTP polling:

```typescript
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

### Navigation History Tracking

Firefox doesn't provide access to tab back/forward history, so we build our own:

```typescript
interface TabHistory {
  entries: Array<{
    url: string;
    title: string;
    timestamp: number;
    deviceId: string;
  }>;
  currentIndex: number;
}

const histories = new Map<string, TabHistory>(); // uuid -> history

browser.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId !== 0) return; // Main frame only

  const uuid = await getTabUuid(details.tabId);
  if (!uuid) return;

  const history = histories.get(uuid) || {
    entries: [],
    currentIndex: -1
  };

  if (details.transitionType === 'back_forward') {
    // User navigated with back/forward
    const newIndex = history.entries.findIndex(e => e.url === details.url);
    if (newIndex !== -1) {
      history.currentIndex = newIndex;
    }
  } else {
    // New navigation
    history.entries = history.entries.slice(0, history.currentIndex + 1);
    history.entries.push({
      url: details.url,
      title: '', // Will be updated on onUpdated event
      timestamp: Date.now(),
      deviceId: await getDeviceId()
    });
    history.currentIndex = history.entries.length - 1;
  }

  histories.set(uuid, history);
  await syncHistory(uuid, history);
});
```

## UI Integration

### Toolbar Button

```typescript
async function updateToolbarIcon(windowId: number) {
  const workspace = await getWindowWorkspace(windowId);

  if (!workspace) {
    browser.browserAction.setIcon({
      path: {
        16: 'icons/inactive-16.png',
        32: 'icons/inactive-32.png'
      },
      windowId
    });
    browser.browserAction.setBadgeText({ text: '', windowId });
  } else {
    const syncStatus = await getSyncStatus(workspace.uuid);
    const iconColor = syncStatus === 'error' ? 'red' :
                     syncStatus === 'syncing' ? 'orange' : 'green';

    browser.browserAction.setIcon({
      path: {
        16: `icons/${iconColor}-16.png`,
        32: `icons/${iconColor}-32.png`
      },
      windowId
    });

    const tabCount = await getWorkspaceTabCount(workspace.uuid);
    browser.browserAction.setBadgeText({
      text: tabCount.toString(),
      windowId
    });
  }
}

// Update icon when window focus changes
browser.windows.onFocusChanged.addListener((windowId) => {
  if (windowId !== browser.windows.WINDOW_ID_NONE) {
    updateToolbarIcon(windowId);
  }
});
```

## Performance Optimization

### Web Worker Implementation

Offload heavy CRDT operations to keep UI responsive:

```typescript
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

## Known Limitations

### Not Supported by Firefox APIs

1. **Tab Groups/Containers** - No API access to Firefox Container tabs
2. **Scroll Position** - Not accessible via extension APIs
3. **Form Data** - Not accessible for security reasons
4. **Session State (cookies/auth)** - Not synchronized for security
5. **Direct History Access** - Must build custom history tracking

### API Quirks

1. **Tab IDs Are Not Persistent** - Change on browser restart
2. **Window IDs Reset** - New IDs after browser restart
3. **Storage.sync Rate Limits** - Very restrictive for real-time sync
4. **No Batch Tab Operations** - Must handle tabs individually

## Best Practices

1. **Always check if window is tracked** before syncing its tabs
2. **Use UUIDs consistently** - never sync local IDs
3. **Batch operations** to reduce network requests
4. **Handle offline gracefully** - queue operations locally
5. **Validate all data** from storage before use
6. **Clean up listeners** when windows are untracked
7. **Never store auth tokens** in storage.sync (use storage.local)

## Debugging

```typescript
// Enable verbose logging in development
const DEBUG = true;

function log(...args: any[]) {
  if (DEBUG) {
    console.log('[Tanaka]', new Date().toISOString(), ...args);
  }
}

// Monitor API errors
browser.runtime.onError.addListener((error) => {
  console.error('[Tanaka] Runtime error:', error);
});

// Check permissions
async function verifyPermissions() {
  const perms = await browser.permissions.getAll();
  log('Current permissions:', perms);
}
```

## Testing Helpers

```typescript
// Create test workspace with many tabs
async function createTestWorkspace(tabCount: number) {
  const window = await browser.windows.create();
  const urls = Array(tabCount).fill(0).map((_, i) =>
    `https://example.com/test${i}`
  );

  for (const url of urls) {
    await browser.tabs.create({ windowId: window.id, url });
    await new Promise(r => setTimeout(r, 100)); // Avoid rate limits
  }

  await trackWindow(window.id, `Test Workspace ${tabCount}`);
}

// Simulate sync conflict
async function createConflict() {
  const tab = await browser.tabs.create({ url: 'https://example.com' });
  const uuid = await getTabUuid(tab.id);

  // Simulate concurrent operations
  await Promise.all([
    queueOperation({ type: 'move_tab', id: uuid, index: 0 }),
    queueOperation({ type: 'move_tab', id: uuid, index: 5 })
  ]);
}
```

## Manifest V3 Migration Notes

When Firefox fully supports Manifest V3, these changes will be needed:

- `browserAction` → `action`
- Background pages → Service workers
- Some permission changes
- Different message passing for service workers

Currently staying with V2 for stability and compatibility.
