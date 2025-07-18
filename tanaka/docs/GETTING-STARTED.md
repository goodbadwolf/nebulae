# Getting Started

**Purpose**: Get Tanaka running on your machine  
**Prerequisites**: Firefox 126+ and command line basics

## Navigation

- [Home](../README.md)
- [Getting Started](GETTING-STARTED.md)
- [Development](DEVELOPMENT.md)
- [Architecture](ARCHITECTURE.md)
- [Sync Protocol](SYNC-PROTOCOL.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Git Guidelines](../../docs/GIT.md)

## Quick Start

### 1. Setup Server

```bash
# Create config
mkdir -p ~/.config/tanaka
cat > ~/.config/tanaka/tanaka.toml << EOF
[server]
bind_addr = "127.0.0.1:8000"  # HTTP for local use

[auth]
shared_token = "change-me-to-something-random"
EOF

# Build and run
cd server
cargo build --release
./target/release/tanaka-server --config ~/.config/tanaka/tanaka.toml
```

### 2. Install Extension

```bash
cd extension
pnpm install
pnpm run build:prod
```

1. Open Firefox → `about:debugging`
2. Click "This Firefox" → "Load Temporary Add-on"
3. Select `extension/dist/manifest.json`

### 3. Connect & Use

1. Click Tanaka icon in Firefox toolbar
2. Enter server URL: `http://localhost:8000`
3. Enter token from your config
4. Click "Track This Window"

That's it! Your tabs now sync across devices.

## Requirements

- Firefox 126+
- Rust & Node.js (for building)
- Any OS (Linux, macOS, Windows)

## Configuration

### Basic (HTTP)

```toml
[server]
bind_addr = "127.0.0.1:8000"

[auth]
shared_token = "your-random-token"
```

### With HTTPS

```toml
[server]
bind_addr = "0.0.0.0:443"

[auth]
shared_token = "your-random-token"

[tls]
cert_path = "/path/to/cert.pem"
key_path = "/path/to/key.pem"
```

## Running as a Service (Optional)

<details>
<summary>Linux systemd</summary>

```bash
# Create service file
sudo tee /etc/systemd/system/tanaka.service << EOF
[Unit]
Description=Tanaka Server
After=network.target

[Service]
ExecStart=$HOME/.cargo/bin/tanaka-server --config $HOME/.config/tanaka/tanaka.toml
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl enable --now tanaka
```

</details>

<details>
<summary>macOS launchd</summary>

```bash
# Create plist file
cat > ~/Library/LaunchAgents/com.tanaka.server.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.tanaka.server</string>
    <key>ProgramArguments</key>
    <array>
        <string>$HOME/.cargo/bin/tanaka-server</string>
        <string>--config</string>
        <string>$HOME/.config/tanaka/tanaka.toml</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF

# Load service
launchctl load ~/Library/LaunchAgents/com.tanaka.server.plist
```

</details>

## Backup

```bash
# Database is at ~/.local/share/tanaka/tanaka.db by default
sqlite3 ~/.local/share/tanaka/tanaka.db ".backup tanaka-backup-$(date +%Y%m%d).db"
```

## FAQ

**Multiple Firefox profiles?**  
Yes, just use the same server URL and token.

**How many tabs?**  
Designed for 200+ tabs across devices.

**Mobile support?**  
Not yet, but technically possible.

## Next Steps

- [Troubleshooting](TROUBLESHOOTING.md) - Common issues
- [Development](DEVELOPMENT.md) - Build from source
- [Architecture](ARCHITECTURE.md) - How it works
