// Mock data for Tanaka UI Simulator
/* global console */

const mockWorkspaces = [
  {
    id: "work-project",
    name: "Work Project",
    tabCount: 12,
    status: "synced", // 'synced' | 'syncing' | 'error'
    isOpen: true,
    lastChange: "2 mins ago",
    tabs: [
      { id: "1", title: "GitHub - PR #123", url: "https://github.com/user/repo/pull/123", icon: "🌐" },
      {
        id: "2",
        title: "MDN Web Docs - Array.prototype",
        url: "https://developer.mozilla.org/en-US/docs/...",
        icon: "📄",
      },
      { id: "3", title: "Stack Overflow - React hook", url: "https://stackoverflow.com/questions/...", icon: "💬" },
    ],
  },
  {
    id: "research",
    name: "Research",
    tabCount: 8,
    status: "synced",
    isOpen: false,
    lastChange: "Fully synced",
    tabs: [
      { id: "4", title: "React Hooks Documentation", url: "https://reactjs.org/docs/hooks-intro.html", icon: "📚" },
      { id: "5", title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/", icon: "📖" },
    ],
  },
  {
    id: "shopping",
    name: "Shopping",
    tabCount: 5,
    status: "error",
    isOpen: false,
    lastChange: "Sync error - retry",
    tabs: [{ id: "6", title: "Amazon - Laptop Stand", url: "https://amazon.com/dp/B08...", icon: "🛒" }],
  },
];

const _mockRecentlyClosed = [
  {
    id: "closed-1",
    title: "Figma - Design System",
    url: "https://figma.com/file/...",
    workspace: "Work Project",
    closedAt: "1 hour ago",
    device: "Desktop",
  },
  {
    id: "closed-2",
    title: "Slack - #github channel",
    url: "https://workspace.slack.com/archives/...",
    workspace: "Work Project",
    closedAt: "3 hours ago",
    device: "Laptop",
  },
];

const _mockDevices = [
  { id: "desktop", name: "Desktop", status: "online", lastSeen: "now" },
  { id: "laptop", name: "Laptop", status: "online", lastSeen: "5 mins ago" },
];

const _mockSearchResults = {
  github: {
    workspaces: [
      {
        workspace: mockWorkspaces[0],
        matchingTabs: [
          { id: "1", title: "GitHub - PR #123", url: "https://github.com/user/repo/pull/123" },
          { id: "7", title: "GitHub - Issues", url: "https://github.com/user/repo/issues" },
        ],
        totalTabs: 20,
      },
      {
        workspace: { ...mockWorkspaces[1], name: "Work Stuff" },
        matchingTabs: [
          { id: "8", title: "Slack - #github channel", url: "https://workspace.slack.com/archives/github" },
        ],
        totalTabs: 1,
      },
    ],
  },
};

// State management utilities
class _SimulatorState {
  constructor() {
    this.currentState = "normal"; // 'loading' | 'empty' | 'normal' | 'searching' | 'error'
    this.searchQuery = "";
    this.workspaces = [...mockWorkspaces];
  }

  setState(newState) {
    this.currentState = newState;
    this.render();
  }

  setSearchQuery(query) {
    this.searchQuery = query;
    this.currentState = query ? "searching" : "normal";
    this.render();
  }

  render() {
    // To be implemented by specific page components
    console.log("State changed:", this.currentState);
  }
}
