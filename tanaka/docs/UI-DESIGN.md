# Tanaka UI Design Specification

## Overview

Tanaka is a Firefox extension that synchronizes browser tabs across devices using the concept of
"workspaces" - persistent collections of tabs that remain synchronized across all connected devices.

## Concept

Tanaka is a personal tab synchronization tool designed for a single user working across multiple desktop Firefox
instances. It transforms how you work across your devices by treating browser windows as shared workspaces rather than
isolated instances. When you track a window, it becomes a workspace that exists independently of any single device.

### Design Philosophy

Tanaka is a personal hobby project built to solve my own workflow needs. There's no multi-user support, no sharing
features, and no mobile compatibility by design. It's optimized for one person (me) who wants their desktop Firefox
browsers to work as a unified system rather than separate silos. The UI is intentionally minimal and focused on
efficiency over broad appeal.

### How It Works

1. **Track a Window**: Convert any browser window into a synchronized workspace with a name
2. **Automatic Sync**: All tabs in tracked windows sync in real-time across your devices
3. **Seamless Continuity**: Close a workspace on your laptop, open it on your desktop exactly where you left off
4. **Local-First**: Continue working even when offline - changes sync when connection returns

### Key Benefits

- **Persistent Workspaces**: Your work contexts survive device shutdowns and persist in the cloud
- **Natural Tab Management**: Use Firefox's native tab features - Tanaka syncs everything automatically
- **Selective Sync**: Only track windows you want to share, keep others private
- **Full History**: Navigate backward/forward through combined history from all devices
- **Recovery**: Restore accidentally closed tabs from any device

### Use Cases

- **Work Transitions**: Start research at the office desktop, continue seamlessly at home desktop
- **Multi-Machine Workflows**: Keep reference materials open on one machine while coding on another
- **Project Organization**: Maintain separate workspaces for different projects or clients
- **Backup**: Never lose important tabs - they're safely synced to your personal server

## Behavioral Specifications

### Sorting & Display

- **Workspace order**: Sorted by last content change (tab added/closed/navigated), most recent first
- **Duplicate names**: Allowed and shown as-is without disambiguation
- **Recently closed**: Shows only the most recent close event per URL, no grouping

### Performance Limits

- **Popup height**: Designed for 10-15 workspaces, scrolls if more
- **Timeline display**: Shows last 7 days by default, "Show more" button for up to 30 days
- **History retention**: Never auto-deleted, manual clear with confirmation required
- **Tab search**: No result limit needed for typical usage

### Visual Indicators

- **Combined status**: Single icon with color coding
  - [folder-open] = Workspace open on this device
  - [folder] = Workspace closed on this device
  - Green color = Fully synced
  - Orange color = Currently syncing
  - Red color = Sync error

## Core Concepts

### Workspaces

- **Definition**: A named collection of tabs that sync across devices
- **Persistence**: Workspaces exist independently of whether they're open on any device
- **Identity**: Each workspace has a unique ID and user-defined name
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

## Visual Design System

### Typography Hierarchy

- **Headers**: 14px bold (section titles like "My Workspaces")
- **Body**: 13px regular (workspace names, tab counts)
- **Small**: 11px regular (metadata like "Last synced: 2 mins ago")
- **Monospace**: 12px mono (URLs, technical info)

### Spacing System

- **Section padding**: 12px
- **Item spacing**: 8px between workspaces
- **Button padding**: 6px horizontal, 4px vertical
- **Icon margin**: 4px from text

### Visual Separators

- **Section dividers**: 1px solid border (color: theme border color)
- **Subtle dividers**: 1px dotted line (for subsections)
- **Empty space**: 16px between major sections

### Status Indicators

- **Sync status**: Icon color + subtle background tint
  - Green: #10b981 (success)
  - Orange: #f59e0b (syncing)
  - Red: #ef4444 (error)
- **Hover state**: Light background highlight
- **Active state**: Darker background + border

### Dimensions

- **Popup**: 320px wide (48 chars), max 480px tall
- **Manager/Settings**: 800px min width (64 chars)
- **Modals**: 280px wide (40 chars)

## UI Components

### 1. Popup UI (Minimal Interface)

The popup appears when clicking the Tanaka toolbar icon. Shows the same full view regardless of whether the current
window is tracked or not. Clicking the icon again closes the popup (toggle behavior).

#### Layout

Note: Icons shown in brackets (e.g., [gear], [folder]) represent Phosphor icon names to be rendered.

```text
┌────────────────────────────────────────────────┐
│ Tanaka                                 [gear]  │
├────────────────────────────────────────────────┤
│ [magnifying-glass] [_____________________]     │
├────────────────────────────────────────────────┤
│ MY WORKSPACES                                  │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ ● Work Project                      12 tabs    │
│   [folder-open]  Last change: 2 mins ago       │
│                  [Switch to] [Close]           │
│                                                │
│ ● Research                          8 tabs     │
│   [folder]       Fully synced                  │
│                  [Open]                        │
│                                                │
│ ● Shopping                          5 tabs     │
│   [folder]       Sync error - retry            │
│                  [Open]                        │
├────────────────────────────────────────────────┤
│ CURRENT WINDOW                                 │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ [play-circle] Track as Workspace               │
├────────────────────────────────────────────────┤
│ [plus-circle] New Workspace                    │
│ [list-bullets] Manage Workspaces               │
└────────────────────────────────────────────────┘
```

#### Connection Error State

```text
┌────────────────────────────────────────────────┐
│ Tanaka                                 [gear]  │
├────────────────────────────────────────────────┤
│ ⚠ Connection lost - working offline            │
│   [arrow-clockwise] Retry Now                  │
├────────────────────────────────────────────────┤
│ [magnifying-glass] [_____________________]     │
├────────────────────────────────────────────────┤
│ MY WORKSPACES                                  │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ ● Work Project                      12 tabs    │
│   [folder-open]  Connection lost               │
│                  [Switch to] [Close]           │
│                                                │
│ ● Research                          8 tabs     │
│   [folder]       Connection lost               │
│                  [Open]                        │
└────────────────────────────────────────────────┘
```

#### Search Results Display

When searching, workspaces show why they matched:

```text
├────────────────────────────────────────────────┤
│ [magnifying-glass] [github______________]      │
├────────────────────────────────────────────────┤
│ SEARCH RESULTS                                 │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ ● GitHub Projects           3 matching tabs    │
│   [folder-open]                                │
│   └─ [file-text] GitHub - PR #123              │
│   └─ [file-text] GitHub - Issues               │
│   └─ [caret-down] Show 17 more matches         │
│                                                │
│ ● Work Stuff                1 matching tab     │
│   [folder]                                     │
│   └─ [file-text] Slack - #github channel       │
└────────────────────────────────────────────────┘
```

#### Empty State

When no workspaces exist:

```text
┌────────────────────────────────────────────────┐
│ Tanaka                                 [gear]  │
├────────────────────────────────────────────────┤
│                                                │
│              Welcome to Tanaka!                │
│                                                │
│         Track browser windows to sync          │
│           tabs across devices.                 │
│                                                │
├────────────────────────────────────────────────┤
│ CURRENT WINDOW                                 │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ [play-circle] Track as Workspace               │
├────────────────────────────────────────────────┤
│ [plus-circle] New Workspace                    │
└────────────────────────────────────────────────┘
```

#### Elements

- **Header**: "Tanaka" title with settings gear icon (clicking opens settings in new tab)
- **Search Bar**:
  - Magnifying glass icon with rounded input field
  - Instant filtering as you type
  - Searches across workspace names, tab titles/URLs
  - Shows hierarchical results with indentation
  - Collapses tab results if more than 5 matches
- **Workspace List**:
  - Bold section header "MY WORKSPACES"
  - Sorted by last content change (most recent first)
  - Two-line layout per workspace:
    - Line 1: Status dot, name, tab count
    - Line 2: Icon, status text, action buttons
  - Status indicators:
    - Color dot (●) shows sync state
    - Text describes current status
    - Green = synced, Orange = syncing, Red = error
  - Context-appropriate actions (visible on hover):
    - `[Switch to]` - Focus existing window
    - `[Close]` - Close locally (workspace persists)
    - `[Open]` - Open workspace in new window
  - 8px spacing between workspaces
  - Scrollable list optimized for 10-15 workspaces
- **Current Window Section** (only if untracked):
  - Bold section header
  - Single action with icon
- **Global Actions**:
  - Full-width buttons with icons
  - Clear visual hierarchy
- **Interaction**: Mouse-driven, no keyboard shortcuts
- **Toggle behavior**: Clicking toolbar icon closes popup

### 2. Full Manager Tab

A dedicated tab for detailed workspace management.

#### Layout

```text
┌────────────────────────────────────────────────────────────────┐
│ Tanaka Workspace Manager                                       │
├──────────────┬─────────────────────────────────────────────────┤
│              │                                                 │
│ WORKSPACES   │  Work Project                      [pencil]     │
│ ──────────   │  12 tabs • Last synced: 2 mins ago              │
│              ├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ ▼ All (3)    │                                                 │
│   Work...    │  OPEN TABS                                      │
│   Research   │  ──────────                                     │
│   Shopping   │  [file-text] GitHub - PR #123                   │
│              │  https://github.com/user/repo/pull/123          │
│              │                                                 │
│              │  [file-text] MDN Web Docs - Array.prototype     │
│              │  https://developer.mozilla.org/en-US/docs/...   │
│              │                                                 │
│ DEVICES      │  [file-text] Stack Overflow - React hooks       │
│ ────────     │  https://stackoverflow.com/questions/...        │
│ ● Desktop    │                                                 │
│ ○ Laptop     │  Open on 2 devices                              │
│              │                                                 │
│              │  RECENTLY CLOSED (last 24h)                     │
│ ACTIONS      │  ─────────────────                              │
│ ────────     │  [file-text] Figma - Design System              │
│ Timeline     │  Closed 1 hour ago from Desktop                 │
│ Trash (2)    │  [arrow-clockwise] Restore                      │
│ Settings     │                                                 │
│              │  [file-text] Slack - #project-discussion        │
│              │  Closed 3 hours ago from Laptop                 │
│              │  [arrow-clockwise] Restore                      │
│              │                                                 │
└──────────────┴─────────────────────────────────────────────────┘
```

#### Features

- **Sidebar Navigation**:
  - Bold section headers with underlines
  - Workspace list with counts
  - Device filter with radio buttons
  - Actions section for utility pages
  - 16px section spacing

- **Main Content Area**:
  - Large workspace title with edit button
  - Metadata in smaller text
  - Subsections with bold headers
  - Tab list with icons and full URLs
  - Recently closed with timestamps and device info
  - Restore buttons aligned right
  - Subtle dotted dividers between sections

- **Visual Hierarchy**:
  - 14px bold for section headers
  - 13px regular for content
  - 11px for metadata
  - 12px monospace for URLs

### 3. Timeline/History View

Shows chronological activity across all workspaces.

#### Layout

```text
┌────────────────────────────────────────────────────────────────┐
│ Activity Timeline                                              │
├────────────────────────────────────────────────────────────────┤
│ Filters: [All Workspaces ▼] [All Devices ▼] [7 days ▼]         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ TODAY                                                          │
│ ──────                                                         │
│                                                                │
│ [clock] 10:45 AM • Desktop                                     │
│ Closed "GitHub PR #123" from Work Project                      │
│ [caret-right] Show details                                     │
│                                                                │
│ [clock] 10:30 AM • Laptop                                      │
│ Opened 3 tabs in Research workspace                            │
│   • React Hooks Documentation                                  │
│   • TypeScript Handbook                                        │
│   • CSS Grid Guide                                             │
│                                                                │
│ [clock] 9:15 AM • Desktop                                      │
│ Created new workspace "Project Planning"                       │
│                                                                │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│                                                                │
│ YESTERDAY                                                      │
│ ──────────                                                     │
│                                                                │
│ [clock] 4:15 PM • Laptop                                       │
│ Moved 3 tabs from Research to Archive                          │
│                                                                │
│ [plus] Show more (23 days remaining)                           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### Features

- **Filters**:
  - Dropdown selectors in header
  - Workspace, device, and time range filters
  - Filters apply instantly

- **Timeline Layout**:
  - Day sections with bold headers
  - Entries with clock icon, time, and device
  - Action description on separate line
  - Bullet lists for multiple items
  - Expandable details link
  - Subtle dotted dividers between days

- **Progressive Loading**:
  - Shows 7 days by default
  - "Show more" button at bottom
  - Loads up to 30 days total
  - Clear indication of remaining days

### 4. Trash View

Shows deleted workspaces that can be restored or permanently deleted.

#### Layout

```text
┌────────────────────────────────────────────────────────────────┐
│ Trash                                                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ 2 DELETED WORKSPACES                                           │
│ ────────────────────                                           │
│                                                                │
│ [folder-dashed] Old Project                                    │
│ 12 tabs • Created Jan 15, 2024                                 │
│ Deleted by Desktop on Dec 1, 2024 at 3:45 PM                   │
│ [arrow-clockwise] Restore  [trash] Delete Permanently          │
│                                                                │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│                                                                │
│ [folder-dashed] Archived Research                              │
│ 8 tabs • Created Nov 3, 2024                                   │
│ Deleted by Laptop on Nov 30, 2024 at 10:22 AM                  │
│ [arrow-clockwise] Restore  [trash] Delete Permanently          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### Features

- **Visual Design**:
  - Bold section header
  - Dashed folder icon for deleted items
  - Three lines of metadata per workspace
  - Action buttons with clear icons
  - Dotted dividers between items

- **Information Hierarchy**:
  - Workspace name prominent
  - Tab count and creation date secondary
  - Deletion details on third line
  - Actions aligned and spaced clearly

- **Actions**:
  - **Restore**: Shows modal dialog
  - **Delete Permanently**: Confirmation required
  - Icons make actions clear

### 5. Welcome/Setup Page

First-run experience for configuration.

#### Layout

```text
┌────────────────────────────────────────────────────────────────┐
│                      Welcome to Tanaka                         │
│                                                                │
│           Sync your Firefox tabs across devices                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  STEP 1: Name this device                                      │
│  ┌──────────────────────────────────────┐                      │
│  │ Work Laptop                          │                      │
│  └──────────────────────────────────────┘                      │
│                                                                │
│  STEP 2: Connect to your server                                │
│                                                                │
│  Server URL                                                    │
│  ┌──────────────────────────────────────┐                      │
│  │ https://tanaka.example.com:8443      │                      │
│  └──────────────────────────────────────┘                      │
│                                                                │
│  Auth Token                                                    │
│  ┌──────────────────────────────────────┐                      │
│  │ ••••••••••••••••••••••••••••••••     │                      │
│  └──────────────────────────────────────┘                      │
│                                                                │
│               [wifi] Test Connection                           │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                    [check-circle] Get Started                  │
└────────────────────────────────────────────────────────────────┘
```

#### Features

- **Visual Hierarchy**:
  - Centered title and subtitle
  - Bold step headers
  - Field labels above inputs
  - Clear action buttons with icons

- **Form Design**:
  - 40-character wide inputs
  - Proper spacing between fields
  - Labels positioned above fields
  - Password field shows dots

- **Modal Dialogs**: Small centered modals:

```text
┌────────────────────────────────────────┐
│        Name Your Workspace             │
├────────────────────────────────────────┤
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ Enter workspace name...            │ │
│ └────────────────────────────────────┘ │
│                                        │
│      [x] Cancel  [check] Create        │
└────────────────────────────────────────┘
```

### 6. Settings Page

A dedicated tab for configuration and preferences.

#### Layout

```text
┌─────────────────────────────────────────────────────────────────┐
│ Tanaka Settings                                                 │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│ GENERAL      │  CONNECTION                                      │
│ ──────────   │  ──────────                                      │
│              │                                                  │
│ Connection   │  Server URL                               ✓      │
│ Sync         │  ┌───────────────────────────────────────────┐   │
│ Data         │  │ https://tanaka.example.com:8443           │   │
│ About        │  └───────────────────────────────────────────┘   │
│              │                                                  │
│              │  Auth Token                               ✓      │
│              │  ┌───────────────────────────────────────────┐   │
│              │  │ ••••••••••••••••••••••••••••••••••••••    │   │
│              │  └───────────────────────────────────────────┘   │
│              │                                                  │
│              │  Device Name                                     │
│              │  ┌───────────────────────────────────────────┐   │
│              │  │ Work Laptop                               │   │
│              │  └───────────────────────────────────────────┘   │
│              │                                                  │
│              │  [check-circle] Connected • Last sync: 2 min ago │
│              │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

#### Features

- **Visual Design**:
  - Bold section headers in sidebar
  - Underlines for active section
  - Field labels with validation indicators
  - Status icon with connection state
  - Consistent 45-character input width

- **Layout Structure**:
  - Two-column with fixed sidebar
  - Section headers in main area
  - Grouped related fields
  - Clear visual hierarchy

- **Validation**:
  - Check/cross marks align right
  - Real-time validation on blur
  - Disabled state during testing
  - Clear status messaging

- **Sections**:
  - **General**: Device settings, theme
  - **Connection**: Server configuration
  - **Sync**: Timing and retry options
  - **Data**: Storage management
  - **About**: Version information

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
- Inline message in popup: "Connection lost - working offline [Retry Now]"
- Workspace-specific sync indicators (red folder icons)
- Automatic retry with exponential backoff
- Full manager shows last successful sync time
- No notifications - relies on visual indicators

### Auth Errors

- Inline message: "Authentication failed - check token [Settings]"
- All workspaces show sync error state (red)
- Settings link opens settings page to update token

### Version Mismatch

- Inline message: "Server version incompatible [Update Required]"
- Prevents sync but maintains local functionality
- Links to update instructions

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
- **Search matches**: Icons indicate match type ([text] name, [link] tab)
- **Sync status**: Per-workspace indicators in popup
- **URL display**: Full URLs stored, truncated in UI for readability

### Icon System

- **Library**: Phosphor Icons for consistency and flexibility
- **Weight Strategy**:
  - Bold: Primary actions (Create, Track, Open)
  - Regular: Secondary actions and UI elements
  - Light: Subtle indicators and decorative elements
- **Color Usage**:
  - Semantic colors for status (green/success, orange/warning, red/error)
  - Adapt shades to system theme (lighter in dark mode, darker in light mode)
  - Monochrome for neutral actions
- **Consistency Principles**:
  - Same icon for same concept throughout UI
  - Maintain visual weight balance
  - Ensure accessibility contrast ratios

## Future Considerations

- Tab search across all workspaces
- Tab grouping within workspaces
- Import/export workspace definitions
- Temporary "pause sync" mode
- Private workspace mode (local only)
- Better history navigation indicators (if API permits)
