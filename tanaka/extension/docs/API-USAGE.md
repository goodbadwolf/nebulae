# Firefox WebExtension API Usage

**Purpose**: Document Firefox APIs used by Tanaka and their implementation patterns  
**Audience**: Extension developers

## Required Permissions

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

## Permission Justification

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

## API Usage Patterns

### Tab Management

```typescript
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

// Handle tab updates
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.title || changeInfo.pinned) {
    await handleTabUpdate(tab);
  }
});

// Tab removal
browser.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  const uuid = await getTabUuid(tabId);
  if (!uuid) return;

  await queueOperation({
    type: 'close_tab',
    id: uuid
  });
});
```

### Window Tracking

```typescript
// Track/untrack windows
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

// Window events
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

// Sync storage for user preferences (use sparingly)
const syncData = {
  syncInterval: 10000,
  theme: 'dark',
  shortcuts: {}
};

await browser.storage.sync.set(syncData);

// Listen for storage changes
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.syncInterval) {
    updateSyncInterval(changes.syncInterval.newValue);
  }
});
```

### Navigation History Tracking

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

### UI Integration

```typescript
// Toolbar button with dynamic icon
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

## Known Limitations

### Tab IDs Are Not Persistent

```typescript
// Wrong - tab IDs change on restart
const tabMapping = { [tab.id]: workspaceTabId };

// Correct - use sessions API
await browser.sessions.setTabValue(tab.id, 'uuid', workspaceTabId);
```

### Storage.sync Rate Limits

```typescript
// Avoid rapid storage.sync writes
let syncTimer: number | null = null;
const pendingSync: Record<string, any> = {};

function scheduleSyncWrite(key: string, value: any) {
  pendingSync[key] = value;

  if (syncTimer) clearTimeout(syncTimer);

  syncTimer = setTimeout(async () => {
    await browser.storage.sync.set(pendingSync);
    Object.keys(pendingSync).forEach(k => delete pendingSync[k]);
    syncTimer = null;
  }, 1000); // Batch writes
}
```

### No Direct History Access

Firefox doesn't expose tab back/forward history:

```typescript
// Not available
const history = await browser.tabs.getHistory(tabId); // ❌

// Build your own
browser.webNavigation.onCommitted.addListener(trackNavigation);
```

## Version Compatibility

### Firefox 106+ Features

- Event pages (non-persistent background)
- Manifest V3 support (use V2 for now)

### Firefox 128+ Features

- Improved performance for tabs API
- Better memory management

## Best Practices

1. **Always check if window is tracked** before syncing its tabs
2. **Use UUIDs consistently** - never sync local IDs
3. **Batch operations** to reduce network requests
4. **Handle offline gracefully** - queue operations locally
5. **Validate all data** from storage before use
6. **Clean up listeners** when windows are untracked

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

## Security Considerations

1. **Never sync sensitive data** like passwords or session cookies
2. **Validate URLs** before opening tabs
3. **Sanitize workspace names** for display
4. **Use HTTPS** for all server communication
5. **Store auth tokens** in storage.local only

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
