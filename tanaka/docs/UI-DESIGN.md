# Tanaka UI Design Specification

## Overview

Tanaka is a Firefox extension that synchronizes browser tabs across devices using the concept of
"workspaces" - persistent collections of tabs that remain synchronized across all connected devices.

## Core Concepts

### Workspaces

- **Definition**: A named collection of tabs that sync across devices
- **Persistence**: Workspaces exist independently of whether they're open on any device
- **Identity**: Each workspace has a unique ID, user-defined name, and tags
- **Lifecycle**: Workspaces persist as long as at least one device tracks them
- **Deletion**: When all devices delete a workspace, it moves to trash for later recovery
- **Empty State**: Can exist with zero tabs, shows "Empty workspace - add tabs to get started"
- **Naming**: Duplicate names allowed for flexible organization (e.g., "Project - Nov 2024")

### Window States

- **Tracked Window**: A browser window that is synchronized as part of a workspace
- **Untracked Window**: A regular browser window with no synchronization

### Device Identity

- Each device running Tanaka has a user-defined name (e.g., "Work Laptop", "Home Desktop")
- Set during initial setup
- Used in activity history to show which device performed actions
- **Device Management**: Automatic timeout for offline devices (e.g., 30 days)
- **Cleanup**: Workspaces only tracked by offline devices eventually become deletable

## Visual Indicators

### Toolbar Icon Colors

- **Green**: Tracked window, fully synced
- **Orange**: Tracked window, currently syncing
- **Red**: Tracked window, sync error
- **Gray**: Untracked window (default state)

### Badge

- Shows number of tabs in the current tracked window
- Only appears on tracked windows
- No badge on untracked windows

## UI Components

### 1. Popup UI (Minimal Interface)

The popup appears when clicking the Tanaka toolbar icon. Shows the same full view regardless of whether the current
window is tracked or not.

#### Layout

```text
┌─────────────────────────────────┐
│ Tanaka                     [⚙️] │
├─────────────────────────────────┤
│ Search: [                    ] │
│ ─────────────────────────────── │
│ My Workspaces                   │
│ ─────────────────────────────── │
│ 📂 Work Project (12 tabs) 🟢 ● │
│    [Switch to] [Close]          │
│                                 │
│ 📁 Research (8 tabs) 🟢         │
│    [Open]                       │
│                                 │
│ 📁 Shopping (5 tabs) 🔴         │
│    [Open]                       │
├─────────────────────────────────┤
│ Current Window                  │
│ ─────────────────────────────── │
│ [▶️ Track as Workspace]         │
│ [🔀 Merge into...]              │
├─────────────────────────────────┤
│ [➕ New Workspace]               │
│ [📋 Manage Workspaces]          │
└─────────────────────────────────┘
```

#### Search Results Display

When searching, workspaces show why they matched:

```text
│ Search: [github              ] │
│ ─────────────────────────────── │
│ 📂 GitHub Projects 📝           │
│    📄 GitHub - PR #123 🔗       │
│    📄 GitHub - Issues 🔗        │
│    [▼ Show 17 more matches]    │
│                                 │
│ 📁 Work Stuff                   │
│    📄 Slack - #github 🔗        │
└─────────────────────────────────┘
```

#### Empty State

When no workspaces exist:

```text
┌─────────────────────────────────┐
│ Tanaka                     [⚙️] │
├─────────────────────────────────┤
│                                 │
│   Welcome to Tanaka!            │
│                                 │
│   Track browser windows to      │
│   sync tabs across devices.     │
│                                 │
├─────────────────────────────────┤
│ Current Window                  │
│ ─────────────────────────────── │
│ [▶️ Track as Workspace]         │
├─────────────────────────────────┤
│ [➕ New Workspace]               │
└─────────────────────────────────┘
```

#### Elements

- **Header**: "Tanaka" title with settings gear icon
- **Search Bar**:
  - Instant filtering as you type
  - Searches across workspace names, tab titles/URLs
  - Shows match type indicators (📝 name, 🔗 tab)
  - Collapses tab results if more than 5 matches
- **Workspace List**:
  - Sorted by most recently active
  - Name and tab count for each workspace
  - ● indicator for workspaces open on current device
  - Sync status indicators: 🟢 synced, 🟠 syncing, 🔴 error
  - Context-appropriate actions (shown on hover for cleaner UI):
    - `[Switch to]` - Focus existing window and bring to front
    - `[Close]` - Close locally (workspace persists)
    - `[Open]` - Open workspace in new window
  - Action buttons overlay on hover to avoid layout shift
  - Scrollable list with max height for many workspaces
- **Current Window Section** (only if current window is untracked):
  - `[Track as Workspace]` - Opens modal to name workspace
  - `[Merge into...]` - Add tabs to existing workspace
- **Global Actions**:
  - `[New Workspace]` - Create empty workspace (asks for name)
  - `[Manage Workspaces]` - Open full manager tab
- **Interaction**: Mouse-driven, no keyboard shortcuts for simplicity

### 2. Full Manager Tab

A dedicated tab for detailed workspace management.

#### Layout

```text
┌──────────────────────────────────────────────────────────┐
│ Tanaka Workspace Manager                                 │
├────────────┬─────────────────────────────────────────────┤
│            │                                             │
│ Workspaces │  Work Project                          [✏️] │
│ ────────── │  12 tabs • Last synced: 2 mins ago         │
│            │  ─────────────────────────────────────────  │
│ ▼ All (3)  │                                             │
│   Work...  │  📄 GitHub - PR #123                        │
│   Research │     https://github.com/user/repo/pull/123   │
│   Shopping │                                             │
│            │     2 devices tracking                      │
│            │                                             │
│ Tags Off   │  Recently Closed (last 24h)                 │
│            │  ─────────────────────────────────────────  │
│            │  📄 MDN - Array methods      [Restore]      │
│            │     Closed 1 hour ago from Desktop           │
│            │  📄 Figma - Design System                    │
│ Devices    │     https://figma.com/file/abc123           │
│ ────────── │                                             │
│ ● Desktop  │  📄 Slack - #project-discussion             │
│ ○ Laptop   │     https://app.slack.com/client/...        │
│            │                                             │
│ Actions    │  Recently Closed (last 24h)                 │
│ ────────── │  ─────────────────────────────────────────  │
│ Timeline   │  📄 MDN - Array methods      [Restore]      │
│ Settings   │     Closed 1 hour ago from Desktop           │
│            │                                             │
└────────────┴─────────────────────────────────────────────┘
```

#### Features

- **Sidebar Navigation**:
  - Workspace list with counts
  - Device filter (show only workspaces on specific device)
  - Timeline/History view
  - Settings

- **Main Content Area**:
  - Workspace details (name, tab count, last sync, device tracking count)
  - Tab list with favicons, titles, and URLs (truncated if too long)
  - Recently closed tabs with restore option (shared across devices)
  - Edit button for workspace name only
  - Recently closed section shows tabs from all devices

- **Search Bar** (not shown): Global search across all workspace tabs

### 3. Timeline/History View

Shows chronological activity across all workspaces.

#### Layout

```text
┌──────────────────────────────────────────────────────────┐
│ Activity Timeline                                        │
├──────────────────────────────────────────────────────────┤
│ Filters: [All Workspaces ▼] [All Devices ▼] [7 days ▼] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Today                                                    │
│ ──────                                                   │
│ 🕐 10:45 AM • Desktop                                    │
│    Closed "GitHub PR #123" from Work Project            │
│    [▶ Details]                                           │
│                                                          │
│ 🕐 10:30 AM • Laptop                                     │
│    Opened 3 tabs in Research workspace                   │
│    • "React Hooks Documentation"                         │
│    • "TypeScript Handbook"                               │
│    • "CSS Grid Guide"                                    │
│                                                          │
│ 🕐 9:15 AM • Desktop                                     │
│    Created new workspace "Project Planning"              │
│                                                          │
│ Yesterday                                                │
│ ─────────                                                │
│ 🕐 4:15 PM • Laptop                                      │
│    Moved 3 tabs from Research to Archive                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Features

- **Filters**:
  - By workspace (or all)
  - By device (or all)
  - By time range (24h, 7 days, 30 days)

- **Timeline Entries**:
  - Timestamp and device
  - Minimal action description
  - Expandable details showing:
    - Full URLs
    - Time spent on tabs
    - Complete navigation history
    - Related actions
  - Permanent storage (never auto-deleted)

### 4. Welcome/Setup Page

First-run experience for configuration.

#### Layout

```text
┌──────────────────────────────────────────────────────────┐
│                    Welcome to Tanaka                     │
│                                                          │
│         Sync your Firefox tabs across devices            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Step 1: Name this device                                │
│  ┌────────────────────────────────────┐                 │
│  │ Work Laptop                        │                 │
│  └────────────────────────────────────┘                 │
│                                                          │
│  Step 2: Connect to your server                          │
│  ┌────────────────────────────────────┐                 │
│  │ https://tanaka.example.com:8443    │  Server URL     │
│  └────────────────────────────────────┘                 │
│                                                          │
│  ┌────────────────────────────────────┐                 │
│  │ ••••••••••••••••••••••••••••••••  │  Auth Token     │
│  └────────────────────────────────────┘                 │
│                                                          │
│               [Test Connection]                         │
│                                                          │
│                    [Get Started]                         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Features

- **Connection Validation**: Tests server connection during setup
- **Error Feedback**: Shows connection errors immediately
- **Simple Flow**: Minimal steps for personal use
- **Modal Dialogs**: Uses small modals for workspace naming:

```text
┌─────────────────────────────────┐
│   Name Your Workspace           │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Enter workspace name...     │ │
│ └─────────────────────────────┘ │
│                                 │
│        [Cancel] [Create]        │
└─────────────────────────────────┘
```

## User Flows

### Creating a Workspace

1. **From existing window**:
   - Click Tanaka icon → "Track as Workspace"
   - Modal appears asking for workspace name
   - Enter name and click Create
   - Window becomes tracked, syncs to other devices

2. **New empty workspace**:
   - Click Tanaka icon → "New Workspace"
   - Modal appears asking for workspace name
   - Enter name and click Create
   - New window opens, already tracked

3. **Merge window into workspace**:
   - Click Tanaka icon → "Merge into..."
   - Select target workspace
   - All tabs added to end of workspace
   - Original window remains untracked

### Managing Workspaces

1. **Opening on new device**:
   - Workspace appears in popup as "closed"
   - Click "Open" → New window with all workspace tabs

2. **Switching between workspaces**:
   - Click "Switch to" → Browser focuses that window and brings to front

3. **Closing locally**:
   - Click "Close" → Window closes on current device only
   - Workspace remains in list, can reopen later

### Tab Synchronization

- **Adding tabs**: Open in tracked window → Appears on all devices
- **Closing tabs**: Close in any device → Closes everywhere
- **Moving tabs between windows**:
  - If atomic operation possible: Direct move between workspaces
  - Otherwise: Copy to destination, remove from source
- **Dragging out of window**: Tab closes (goes to "recently closed")
- **Reordering**: Drag within window → Order syncs to all devices
- **Tab Identity**: Each tab unique to its workspace (same URL can exist in multiple workspaces)
- **Recently Closed**: Shared across devices, shows most recent timestamp for duplicates

## Data Synchronized

### Per Tab

- URL
- Title
- Pinned state (preserved across devices)
- Muted state
- Navigation history (back/forward)
  - Combined history from all devices
  - CRDT handles merge automatically
  - May show device indicator at history boundaries (if API allows)

### Per Workspace

- Name (duplicates allowed)
- Tab order
- Recently closed tabs (with timestamp and device)
- Creation time
- Last modified time
- Device tracking count
- Trash status (if deleted by all devices)

### Not Synchronized

- Session state (cookies, auth)
- Scroll position
- Form data
- Tab groups (Firefox Container tabs)

## Settings

Accessible via gear icon in popup or full manager:

- Device name (editable)
- Server URL
- Auth token
- Sync interval preferences
- Clear local data option
- Workspace management (rename, delete)
- Data persistence (local-first - continues working if server unavailable)
- Sync retry strategy (adaptive exponential backoff)

## Error States

### Connection Errors

- Red toolbar icon (passive indicator)
- Workspace-specific sync indicators (🟢 🟠 🔴)
- Automatic retry with exponential backoff
- Full manager shows last successful sync time
- No notifications - relies on visual indicators

### Sync Conflicts

- CRDT resolution handles automatically
- No user intervention needed
- Activity timeline shows all changes
- Concurrent operations (e.g., same tab closed on multiple devices) handled gracefully

## Design Decisions

### UI Philosophy

- **Mouse-driven**: No keyboard shortcuts, optimized for mouse interaction
- **Hover interactions**: Buttons appear on hover to reduce visual clutter
- **Desktop-only**: Designed specifically for desktop Firefox
- **Minimal popup**: Quick actions only, full details in manager tab
- **Consistent views**: Same popup interface regardless of window state
- **Progressive disclosure**: Minimal info by default, details on demand

### Data Model

- **Local-first**: Extension continues working even if server is unavailable
- **CRDT-based**: Automatic conflict resolution without user intervention
- **Tab uniqueness**: Each tab belongs to exactly one workspace
- **History merging**: Combined navigation history from all devices
- **Workspace operations**: Single workspace at a time (no batch operations)
- **Search scope**: Instant search across names and tab content

### Visual Feedback

- **Timeline**: Shows minimal info with expandable details
- **Recently closed**: Deduplicates by most recent timestamp
- **Empty workspaces**: Persist with placeholder message
- **Device tracking**: Shows count in manager view
- **Search matches**: Icons indicate match type (📝 name, 🔗 tab)
- **Sync status**: Per-workspace indicators in popup
- **URL display**: Full URLs stored, truncated in UI for readability

## Future Considerations

- Tab search across all workspaces
- Tab grouping within workspaces
- Import/export workspace definitions
- Temporary "pause sync" mode
- Private workspace mode (local only)
- Better history navigation indicators (if API permits)
