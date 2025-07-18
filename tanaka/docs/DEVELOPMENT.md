# Tanaka Development

**Purpose**: How to work on Tanaka locally
**Prerequisites**: Basic Rust and TypeScript knowledge

## Navigation

- [Home](../README.md)
- [Getting Started](GETTING-STARTED.md)
- [Development](DEVELOPMENT.md)
- [Architecture](ARCHITECTURE.md)
- [Sync Protocol](SYNC-PROTOCOL.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Git Guidelines](../../docs/GIT.md)

---

## Prerequisites

- **Rust** 1.83+ (for server)
- **Node.js** 24+ and **pnpm** (for extension)
- **Firefox** 126+ (for testing)
- **SQLite** (usually pre-installed)

### Quick Install

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Node.js via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm install 24

# Install pnpm
npm install -g pnpm

# Install SQLx CLI for database migrations
cargo install sqlx-cli --no-default-features --features sqlite
```

## Quick Start

```bash
# From tanaka directory

# Build and run server
cd server
cargo build
cargo run

# In another terminal - build and run extension
cd extension
pnpm install
pnpm run dev
pnpm run start  # Launches Firefox
```

## Configuration

For local development, create a simple config:

```toml
# server/.env or ~/.config/tanaka/tanaka.toml
[server]
bind_addr = "127.0.0.1:8000"  # HTTP for local dev

[auth]
shared_token = "dev-token"
```

## Database Migrations

```bash
cd server
export DATABASE_URL=sqlite://tanaka.db

# Create new migration
sqlx migrate add -r description_here

# Run migrations (also happens automatically on server start)
sqlx migrate run
```

## Project Structure

```text
tanaka/
├── extension/          # Firefox WebExtension (TypeScript)
├── server/            # Rust server
└── docs/              # Documentation
```

## Common Commands

### Server (Rust)

```bash
cargo build             # Build
cargo run               # Run server
cargo test              # Run tests
cargo fmt               # Format code
cargo clippy            # Lint
```

### Extension (TypeScript)

```bash
pnpm install            # Install deps
pnpm run dev           # Dev mode with hot reload
pnpm run start         # Launch Firefox
pnpm run build:prod    # Production build
pnpm run lint          # Lint code
pnpm test              # Run tests
```

## Testing

```bash
# Run server tests
cd server && cargo test

# Run extension tests  
cd extension && pnpm test
```

For faster Rust tests, install cargo-nextest:

```bash
cargo install cargo-nextest --locked
cargo nextest run
```

## Debugging Tips

### Extension

- `about:debugging` → This Firefox → Tanaka → Inspect
- Check browser console for errors

### Server

- `RUST_LOG=debug cargo run` for verbose logging
- `sqlite3 tanaka.db` to inspect database

## Release Process

1. Update version in `extension/manifest.json` and `server/Cargo.toml`
2. Tag release: `git tag vX.Y.Z`
3. Build artifacts:

   ```bash
   cd server && cargo build --release
   cd extension && pnpm run build:prod
   ```

## Next Steps

- [Architecture](ARCHITECTURE.md) - How Tanaka works
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues
- [Git Guidelines](../../docs/GIT.md) - Git workflow
