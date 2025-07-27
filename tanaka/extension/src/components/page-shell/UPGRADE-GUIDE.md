# Progressive TnkShell Implementation Guide

## Version 1: Simple Wrapper Component

This version provides a basic shell with a header containing your brand/logo. Perfect for simple pages that don't need navigation.

### Complete Implementation

#### Create the TnkHeader Component

```tsx
// src/components/tnk-shell/TnkHeader.tsx
import { Group, Title, Box } from '@mantine/core';

interface TnkHeaderProps {
  brand?: string;
  logo?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export function TnkHeader({
  brand = 'Tanaka',
  logo,
  align = 'left'
}: TnkHeaderProps) {
  return (
    <Box h="100%" px="md">
      <Group h="100%" justify={align === 'center' ? 'center' : `space-${align === 'left' ? 'apart' : 'between'}`}>
        <Group>
          {logo && logo}
          <Title order={2} size="h1">
            {brand}
          </Title>
        </Group>
      </Group>
    </Box>
  );
}
```

#### Create the TnkShell Wrapper

```tsx
// src/components/tnk-shell/TnkShell.tsx
import { AppShell, AppShellProps } from '@mantine/core';
import { TnkHeader } from './TnkHeader';

interface TnkShellProps extends Omit<AppShellProps, 'header'> {
  children: React.ReactNode;
  brand?: string;
  logo?: React.ReactNode;
  headerAlign?: 'left' | 'center' | 'right';
}

export function TnkShell({
  children,
  brand,
  logo,
  headerAlign,
  ...appShellProps
}: TnkShellProps) {
  return (
    <AppShell
      header={{ height: 60 }} // This configures the header space
      {...appShellProps}
    >
      <AppShell.Header> {/* This is where the header content goes */}
        <TnkHeader brand={brand} logo={logo} align={headerAlign} />
      </AppShell.Header>
      {children}
    </AppShell>
  );
}
```

**Note**: In Mantine's AppShell:

- The `header` prop on `<AppShell>` configures the header dimensions and behavior
- The `<AppShell.Header>` component is where you place the actual header content

#### Usage Examples

```tsx
// pages/Welcome.tsx
import { TnkShell } from '@/components/tnk-shell/TnkShell';

export function WelcomePage() {
  return (
    <TnkShell>
      <AppShell.Main>
        <h1>Welcome to Tanaka</h1>
        <p>Your content here</p>
      </AppShell.Main>
    </TnkShell>
  );
}

// pages/About.tsx - with custom branding
export function AboutPage() {
  return (
    <TnkShell brand="About Tanaka" headerAlign="center">
      <AppShell.Main>
        <Container>
          <Text>About page content...</Text>
        </Container>
      </AppShell.Main>
    </TnkShell>
  );
}

// pages/Settings.tsx - with custom logo
import { IconSettings } from '@tabler/icons-react';

export function SettingsPage() {
  return (
    <TnkShell
      brand="Settings"
      logo={<IconSettings size={32} />}
      padding="md"
    >
      <AppShell.Main>
        <SettingsForm />
      </AppShell.Main>
    </TnkShell>
  );
}
```

### When to Upgrade to Version 2

Upgrade when you need:

- ✅ A navigation sidebar (navbar)
- ✅ Burger menu to toggle the navbar on mobile
- ✅ Components that can control the navbar state
- ✅ Persistent navbar state across navigation

---

## Version 2: Shell with Navigation State Management

This version adds a collapsible navbar with burger menu control and state management through React Context.

### Complete Implementation

#### Create the Context Provider

```tsx
// src/components/tnk-shell/TnkShellProvider.tsx
import { createContext, useContext, ReactNode } from 'react';
import { useDisclosure } from '@mantine/hooks';

interface TnkShellContextValue {
  navbarOpened: boolean;
  toggleNavbar: () => void;
  setNavbarOpened: (opened: boolean) => void;
}

const TnkShellContext = createContext<TnkShellContextValue | null>(null);

export function useTnkShell() {
  const context = useContext(TnkShellContext);
  if (!context) {
    throw new Error('useTnkShell must be used within TnkShellProvider');
  }
  return context;
}

interface TnkShellProviderProps {
  children: ReactNode;
  defaultNavbarOpened?: boolean;
}

export function TnkShellProvider({
  children,
  defaultNavbarOpened = false
}: TnkShellProviderProps) {
  const [navbarOpened, { toggle: toggleNavbar, open, close }] = useDisclosure(defaultNavbarOpened);

  return (
    <TnkShellContext.Provider
      value={{
        navbarOpened,
        toggleNavbar,
        setNavbarOpened: (opened) => opened ? open() : close()
      }}
    >
      {children}
    </TnkShellContext.Provider>
  );
}
```

#### Create the Enhanced TnkHeader with Burger Menu

```tsx
// src/components/tnk-shell/TnkHeader.tsx
import { Group, Title, Box, Burger } from '@mantine/core';
import { useTnkShell } from './TnkShellProvider';

interface TnkHeaderProps {
  brand?: string;
  logo?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  showBurger?: boolean;
}

export function TnkHeader({
  brand = 'Tanaka',
  logo,
  align = 'left',
  showBurger = false
}: TnkHeaderProps) {
  const { navbarOpened, toggleNavbar } = useTnkShell();

  return (
    <Box h="100%" px="md">
      <Group h="100%" justify="space-between">
        <Group>
          {showBurger && (
            <Burger
              opened={navbarOpened}
              onClick={toggleNavbar}
              size="sm"
              hiddenFrom="sm"
            />
          )}
          {logo && logo}
          <Title order={2} size="h1">
            {brand}
          </Title>
        </Group>

        {/* Space for future header actions */}
        <Group>
          {/* User menu, notifications, etc. can go here */}
        </Group>
      </Group>
    </Box>
  );
}
```

#### Create the TnkShell with Provider

```tsx
// src/components/tnk-shell/TnkShell.tsx
import { AppShell, AppShellProps } from '@mantine/core';
import { TnkHeader } from './TnkHeader';
import { TnkShellProvider, useTnkShell } from './TnkShellProvider';

interface TnkShellProps extends Omit<AppShellProps, 'header' | 'navbar'> {
  children: React.ReactNode;
  header?: {
    brand?: string;
    logo?: React.ReactNode;
    align?: 'left' | 'center' | 'right';
  };
  navbar?: Omit<AppShellProps['navbar'], 'collapsed'>;
  defaultNavbarOpened?: boolean;
}

// Inner component that uses the context
function TnkShellInner({
  children,
  header,
  navbar,
  ...appShellProps
}: Omit<TnkShellProps, 'defaultNavbarOpened'>) {
  const { navbarOpened } = useTnkShell();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={navbar ? {
        width: 300,
        breakpoint: 'sm',
        ...navbar,
        collapsed: { mobile: !navbarOpened }
      } : undefined}
      {...appShellProps}
    >
      <AppShell.Header>
        <TnkHeader
          brand={header?.brand}
          logo={header?.logo}
          align={header?.align}
          showBurger={!!navbar}
        />
      </AppShell.Header>
      {children}
    </AppShell>
  );
}

// Main component with provider
export function TnkShell({ defaultNavbarOpened, ...props }: TnkShellProps) {
  return (
    <TnkShellProvider defaultNavbarOpened={defaultNavbarOpened}>
      <TnkShellInner {...props} />
    </TnkShellProvider>
  );
}

// Export the hook for use in child components
export { useTnkShell } from './TnkShellProvider';
```

#### Usage Examples

```tsx
// Simple usage - works exactly like Version 1
import { TnkShell } from '@/components/tnk-shell';

export function WelcomePage() {
  return (
    <TnkShell>
      <AppShell.Main>
        <h1>Welcome to Tanaka</h1>
        <p>Your tab synchronization extension</p>
      </AppShell.Main>
    </TnkShell>
  );
}

// With navbar - now with state management!
import { AppShell, NavLink } from '@mantine/core';

export function DashboardPage() {
  return (
    <TnkShell
      header={{ brand: "Dashboard", align: "left" }}
      navbar={{ width: 300, breakpoint: 'sm' }}
    >
      <AppShell.Navbar p="md">
        <NavLink label="Overview" />
        <NavLink label="Analytics" />
        <NavLink label="Reports" />
      </AppShell.Navbar>

      <AppShell.Main>
        <h1>Dashboard Content</h1>
        <p>The navbar state is now managed by context!</p>
      </AppShell.Main>
    </TnkShell>
  );
}

// Controlling navbar from child components
import { Button } from '@mantine/core';
import { IconGear } from '@tabler/icons-react';
import { useTnkShell } from '@/components/tnk-shell/TnkShellProvider';

function SettingsContent() {
  const { setNavbarOpened } = useTnkShell();

  return (
    <div>
      <h2>Settings</h2>
      <Button onClick={() => setNavbarOpened(false)}>
        Hide Navigation
      </Button>
    </div>
  );
}

export function SettingsPage() {
  return (
    <TnkShell
      header={{ brand: "Settings", logo: <IconGear size={24} /> }}
      navbar={{ width: 250 }}
    >
      <AppShell.Navbar p="md">
        <NavLink label="General" />
        <NavLink label="Privacy" />
        <NavLink label="Advanced" />
      </AppShell.Navbar>

      <AppShell.Main>
        <SettingsContent />
      </AppShell.Main>
    </TnkShell>
  );
}
```

### Key Differences from Version 1

1. **State Management**: Navbar state is managed via Context API
2. **Burger Menu**: Automatically appears when navbar is present
3. **Responsive Behavior**: Navbar collapses on mobile with burger control
4. **Programmatic Control**: Any child component can control navbar state
5. **Header Props Structure**: Header configuration is now an object for better organization

### When to Upgrade to Version 3

Upgrade when you need:

- ✅ Multiple shell variants (compact, dashboard, admin)
- ✅ Different header components for different sections
- ✅ Dynamic shell configuration based on user roles
- ✅ Reusable shell patterns across multiple apps

---

## Version 3: Higher-Order Component Pattern

This version allows you to create multiple shell variants with different headers and configurations.

### Complete Implementation

#### Create the HOC

```tsx
// src/components/tnk-shell/withTnkHeader.tsx
import { ComponentType, forwardRef } from 'react';
import { AppShell, AppShellProps } from '@mantine/core';
import { TnkHeader } from './TnkHeader';
import { TnkShellProvider, useTnkShell } from './TnkShellProvider';

interface WithTnkHeaderOptions {
  headerHeight?: number;
  headerComponent?: ComponentType<any>;
  includeProvider?: boolean;
}

export function withTnkHeader<P extends AppShellProps>(
  options: WithTnkHeaderOptions = {}
) {
  const {
    headerHeight = 60,
    headerComponent: HeaderComponent = TnkHeader,
    includeProvider = true
  } = options;

  return function enhance(Component: ComponentType<P> = AppShell as ComponentType<P>) {
    const EnhancedComponent = forwardRef<HTMLDivElement, Omit<P, 'header'>>((props, ref) => {
      const { children, navbar, ...restProps } = props;

      // Try to use context if available
      let finalNavbar = navbar;
      try {
        if (navbar && !includeProvider) {
          const { navbarOpened } = useTnkShell();
          finalNavbar = {
            ...navbar,
            collapsed: { mobile: !navbarOpened }
          };
        }
      } catch {
        // Context not available, use navbar as-is
      }

      return (
        <Component
          ref={ref}
          header={{ height: headerHeight }}
          navbar={finalNavbar}
          {...(restProps as P)}
        >
          <AppShell.Header>
            <HeaderComponent />
          </AppShell.Header>
          {children}
        </Component>
      );
    });

    // Wrap with provider if needed
    if (includeProvider) {
      return forwardRef<HTMLDivElement, Omit<P, 'header'>>((props, ref) => (
        <TnkShellProvider>
          <EnhancedComponent ref={ref} {...props} />
        </TnkShellProvider>
      ));
    }

    return EnhancedComponent;
  };
}
```

#### Create Alternative Headers

```tsx
// src/components/tnk-shell/TnkCompactHeader.tsx
import { Group, Text, Burger } from '@mantine/core';
import { useTnkShell } from './TnkShellProvider';

export function TnkCompactHeader() {
  const { navbarOpened, toggleNavbar } = useTnkShell();

  return (
    <Group h="100%" px="xs" justify="space-between">
      <Group>
        <Burger
          opened={navbarOpened}
          onClick={toggleNavbar}
          size="xs"
          hiddenFrom="sm"
        />
        <Text size="sm" fw={600}>Tanaka</Text>
      </Group>
    </Group>
  );
}

// src/components/tnk-shell/TnkDashboardHeader.tsx
import { Group, Title, Button, Avatar, Menu } from '@mantine/core';
import { IconBell, IconSettings, IconLogout } from '@tabler/icons-react';
import { useTnkShell } from './TnkShellProvider';

export function TnkDashboardHeader() {
  const { navbarOpened, toggleNavbar } = useTnkShell();

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger
          opened={navbarOpened}
          onClick={toggleNavbar}
          hiddenFrom="sm"
        />
        <Title order={3}>Dashboard</Title>
      </Group>

      <Group>
        <Button variant="subtle" size="sm" px="xs">
          <IconBell size={20} />
        </Button>

        <Menu>
          <Menu.Target>
            <Avatar radius="xl" size="sm" style={{ cursor: 'pointer' }}>
              JD
            </Avatar>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconSettings size={16} />}>
              Settings
            </Menu.Item>
            <Menu.Item leftSection={<IconLogout size={16} />}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
```

#### Create Different Shell Variants

```tsx
// src/components/tnk-shell/shells.tsx
import { withTnkHeader } from './withTnkHeader';
import { TnkCompactHeader } from './TnkCompactHeader';
import { TnkDashboardHeader } from './TnkDashboardHeader';

// Standard shell with default header
export const TnkShell = withTnkHeader()();

// Compact shell with smaller header
export const TnkCompactShell = withTnkHeader({
  headerHeight: 48,
  headerComponent: TnkCompactHeader
})();

// Dashboard shell with user menu
export const TnkDashboardShell = withTnkHeader({
  headerHeight: 70,
  headerComponent: TnkDashboardHeader
})();

// Shell without provider (for nested use)
export const TnkNestedShell = withTnkHeader({
  includeProvider: false
})();
```

#### Usage Examples

```tsx
// Using standard shell
import { TnkShell } from '@/components/tnk-shell/shells';

export function HomePage() {
  return (
    <TnkShell>
      <AppShell.Main>
        <h1>Home</h1>
      </AppShell.Main>
    </TnkShell>
  );
}

// Using compact shell
import { TnkCompactShell } from '@/components/tnk-shell/shells';

export function MobilePage() {
  return (
    <TnkCompactShell
      navbar={{ width: 200 }}
      padding="xs"
    >
      <AppShell.Navbar p="xs">
        <NavLink label="Item 1" />
        <NavLink label="Item 2" />
      </AppShell.Navbar>

      <AppShell.Main>
        <Text size="sm">Compact layout for mobile</Text>
      </AppShell.Main>
    </TnkCompactShell>
  );
}

// Using dashboard shell
import { TnkDashboardShell } from '@/components/tnk-shell/shells';

export function AdminDashboard() {
  return (
    <TnkDashboardShell
      navbar={{ width: 280 }}
      aside={{ width: 300, breakpoint: 'lg' }}
    >
      <AppShell.Navbar p="md">
        <NavLink label="Users" />
        <NavLink label="Analytics" />
        <NavLink label="Settings" />
      </AppShell.Navbar>

      <AppShell.Main>
        <DashboardContent />
      </AppShell.Main>

      <AppShell.Aside p="md">
        <ActivityFeed />
      </AppShell.Aside>
    </TnkDashboardShell>
  );
}
```

### When to Upgrade to Version 4

Upgrade when you need:

- ✅ Dynamic shell creation based on configuration
- ✅ User preference-based layouts
- ✅ Theme-specific shell variants
- ✅ Centralized configuration management

---

## Version 4: Factory Pattern

This version enables dynamic shell creation from configuration objects.

### Complete Implementation

#### Create the Factory

```tsx
// src/components/tnk-shell/createTnkShell.tsx
import { ComponentType, forwardRef } from 'react';
import { AppShell, AppShellProps } from '@mantine/core';
import { TnkHeader } from './TnkHeader';
import { TnkShellProvider, useTnkShell } from './TnkShellProvider';

export interface TnkShellConfig {
  headerHeight?: number;
  headerComponent?: ComponentType<any>;
  defaultNavbarWidth?: number;
  defaultPadding?: AppShellProps['padding'];
  withProvider?: boolean;
  providerDefaults?: {
    navbarOpened?: boolean;
  };
}

export function createTnkShell(config: TnkShellConfig = {}) {
  const {
    headerHeight = 60,
    headerComponent: HeaderComponent = TnkHeader,
    defaultNavbarWidth = 300,
    defaultPadding = 'md',
    withProvider = true,
    providerDefaults = {},
  } = config;

  const ShellComponent = forwardRef<HTMLDivElement, Omit<AppShellProps, 'header'>>(
    ({ children, navbar, padding = defaultPadding, ...props }, ref) => {
      // Try to use context if available
      let finalNavbar = navbar;
      try {
        if (navbar && !withProvider) {
          const { navbarOpened } = useTnkShell();
          finalNavbar = {
            width: defaultNavbarWidth,
            breakpoint: 'sm',
            ...navbar,
            collapsed: { mobile: !navbarOpened }
          };
        }
      } catch {
        // Context not available, use navbar as-is
      }

      return (
        <AppShell
          ref={ref}
          header={{ height: headerHeight }}
          navbar={finalNavbar}
          padding={padding}
          {...props}
        >
          <AppShell.Header>
            <HeaderComponent />
          </AppShell.Header>
          {children}
        </AppShell>
      );
    }
  );

  if (withProvider) {
    return forwardRef<HTMLDivElement, Omit<AppShellProps, 'header'>>((props, ref) => (
      <TnkShellProvider {...providerDefaults}>
        <ShellComponent ref={ref} {...props} />
      </TnkShellProvider>
    ));
  }

  return ShellComponent;
}
```

#### Create Shell Configurations

```tsx
// src/components/tnk-shell/shellConfigs.ts
import { TnkHeader } from './TnkHeader';
import { TnkCompactHeader } from './TnkCompactHeader';
import { TnkDashboardHeader } from './TnkDashboardHeader';
import { createTnkShell, TnkShellConfig } from './createTnkShell';

// Define your shell configurations
export const shellConfigs = {
  default: {
    headerHeight: 60,
    headerComponent: TnkHeader,
    defaultNavbarWidth: 300,
    defaultPadding: 'md',
  },
  compact: {
    headerHeight: 48,
    headerComponent: TnkCompactHeader,
    defaultNavbarWidth: 250,
    defaultPadding: 'xs',
  },
  dashboard: {
    headerHeight: 70,
    headerComponent: TnkDashboardHeader,
    defaultNavbarWidth: 280,
    defaultPadding: 'md',
    providerDefaults: {
      navbarOpened: true, // Dashboard starts with navbar open
    }
  },
} satisfies Record<string, TnkShellConfig>;

// Export pre-configured shells
export const TnkShell = createTnkShell(shellConfigs.default);
export const TnkCompactShell = createTnkShell(shellConfigs.compact);
export const TnkDashboardShell = createTnkShell(shellConfigs.dashboard);

// Export factory for dynamic creation
export { createTnkShell };
```

#### Dynamic Shell Creation

```tsx
// hooks/useUserShell.ts
import { useMemo } from 'react';
import { createTnkShell } from '@/components/tnk-shell/shellConfigs';
import { useUser } from '@/hooks/useUser';

export function useUserShell() {
  const { user } = useUser();

  const UserShell = useMemo(() => {
    return createTnkShell({
      headerHeight: user?.preferences?.compactMode ? 48 : 60,
      defaultNavbarWidth: user?.preferences?.wideNavbar ? 350 : 280,
      providerDefaults: {
        navbarOpened: user?.preferences?.navbarDefaultOpen ?? false,
      }
    });
  }, [user?.preferences]);

  return UserShell;
}

// pages/UserDashboard.tsx
export function UserDashboard() {
  const UserShell = useUserShell();

  return (
    <UserShell navbar={{ width: 300 }}>
      <AppShell.Navbar p="md">
        <UserNavigation />
      </AppShell.Navbar>

      <AppShell.Main>
        <h1>Personalized Dashboard</h1>
        <p>Layout based on your preferences!</p>
      </AppShell.Main>
    </UserShell>
  );
}
```

### When to Upgrade to Version 5

Upgrade when you need:

- ✅ Maximum TypeScript flexibility
- ✅ Polymorphic component behavior
- ✅ Custom root element types
- ✅ Building a component library

---

## Version 5: Polymorphic Component

This version provides maximum flexibility using Mantine's polymorphic pattern.

### Complete Implementation

```tsx
// src/components/tnk-shell/TnkShellPolymorphic.tsx
import { forwardRef } from 'react';
import {
  AppShell,
  AppShellProps,
  createPolymorphicComponent,
  Box,
} from '@mantine/core';
import { TnkHeader } from './TnkHeader';
import { TnkCompactHeader } from './TnkCompactHeader';
import { TnkDashboardHeader } from './TnkDashboardHeader';
import { TnkShellProvider, useTnkShell } from './TnkShellProvider';

interface _TnkShellProps extends Omit<AppShellProps, 'header'> {
  headerHeight?: number;
  headerProps?: Record<string, any>;
  variant?: 'default' | 'compact' | 'dashboard';
}

const _TnkShell = forwardRef<HTMLDivElement, _TnkShellProps>(
  ({
    children,
    headerHeight,
    headerProps,
    navbar,
    variant = 'default',
    ...props
  }, ref) => {
    const { navbarOpened } = useTnkShell();

    // Variant-based configuration
    const variantConfig = {
      default: {
        height: 60,
        padding: 'md',
        component: TnkHeader
      },
      compact: {
        height: 48,
        padding: 'xs',
        component: TnkCompactHeader
      },
      dashboard: {
        height: 70,
        padding: 'lg',
        component: TnkDashboardHeader
      },
    }[variant];

    const HeaderComponent = variantConfig.component;
    const finalHeight = headerHeight ?? variantConfig.height;
    const finalPadding = props.padding ?? variantConfig.padding;

    const finalNavbar = navbar ? {
      ...navbar,
      collapsed: { mobile: !navbarOpened }
    } : undefined;

    return (
      <AppShell
        ref={ref}
        header={{ height: finalHeight }}
        navbar={finalNavbar}
        padding={finalPadding}
        {...props}
      >
        <AppShell.Header>
          <HeaderComponent {...headerProps} />
        </AppShell.Header>
        {children}
      </AppShell>
    );
  }
);

// Create the polymorphic component
const PolymorphicShell = createPolymorphicComponent<'div', _TnkShellProps>(_TnkShell);

// Export with Provider wrapper
export const TnkShell = forwardRef<
  HTMLDivElement,
  _TnkShellProps & { component?: any }
>((props, ref) => (
  <TnkShellProvider>
    <PolymorphicShell ref={ref} {...props} />
  </TnkShellProvider>
));

TnkShell.displayName = 'TnkShell';
```

#### Usage Examples

```tsx
// Using variants
export function VariantExamples() {
  return (
    <>
      {/* Default variant */}
      <TnkShell variant="default">
        <AppShell.Main>
          <h1>Default Layout</h1>
        </AppShell.Main>
      </TnkShell>

      {/* Compact variant */}
      <TnkShell variant="compact" navbar={{ width: 200 }}>
        <AppShell.Navbar p="xs">
          <CompactNav />
        </AppShell.Navbar>
        <AppShell.Main>
          <h1>Compact Layout</h1>
        </AppShell.Main>
      </TnkShell>

      {/* Dashboard variant with custom props */}
      <TnkShell
        variant="dashboard"
        headerProps={{ userName: "John Doe" }}
        navbar={{ width: 280 }}
      >
        <AppShell.Navbar p="md">
          <DashboardNav />
        </AppShell.Navbar>
        <AppShell.Main>
          <h1>Dashboard</h1>
        </AppShell.Main>
      </TnkShell>
    </>
  );
}

// Using as a polymorphic component
export function PolymorphicExample() {
  return (
    <TnkShell
      component="section"
      variant="default"
      navbar={{ width: 300 }}
    >
      <AppShell.Navbar>
        <Navigation />
      </AppShell.Navbar>
      <AppShell.Main>
        <h1>Rendered as a section element</h1>
      </AppShell.Main>
    </TnkShell>
  );
}
```

---

## Migration Summary

### Decision Tree

```text
Start with Version 1 (Simple Wrapper)
    ↓
Need navbar with state management?
    → Yes: Migrate to Version 2 (Context)
    → No: Stay with Version 1
        ↓
Need multiple shell variants?
    → Yes: Migrate to Version 3 (HOC)
    → No: Stay with Version 2
        ↓
Need dynamic configuration?
    → Yes: Migrate to Version 4 (Factory)
    → No: Stay with Version 3
        ↓
Need polymorphic behavior?
    → Yes: Migrate to Version 5 (Polymorphic)
    → No: Stay with Version 4
```

### Key Migration Principles

1. **Backward Compatibility**: Each version maintains the same basic API
2. **Progressive Enhancement**: Add complexity only when needed
3. **Minimal Refactoring**: Existing pages work with minimal changes
4. **Clear Benefits**: Each version solves specific problems

### Version Comparison

| Feature | V1 | V2 | V3 | V4 | V5 |
|---------|----|----|----|----|-----|
| Basic Header | ✅ | ✅ | ✅ | ✅ | ✅ |
| Custom Branding | ✅ | ✅ | ✅ | ✅ | ✅ |
| Navbar Support | ❌ | ✅ | ✅ | ✅ | ✅ |
| State Management | ❌ | ✅ | ✅ | ✅ | ✅ |
| Multiple Variants | ❌ | ❌ | ✅ | ✅ | ✅ |
| Dynamic Config | ❌ | ❌ | ❌ | ✅ | ✅ |
| Polymorphic | ❌ | ❌ | ❌ | ❌ | ✅ |

Choose the version that matches your current needs, and upgrade when those needs change!
