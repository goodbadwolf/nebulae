# Troubleshooting

**Purpose**: Fix common issues with Tanaka

## Navigation

- [Home](../README.md)
- [Getting Started](GETTING-STARTED.md)
- [Development](DEVELOPMENT.md)
- [Architecture](ARCHITECTURE.md)
- [Sync Protocol](SYNC-PROTOCOL.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Git Guidelines](../../docs/GIT.md)

## Quick Checklist

**Extension not working?**

- Is server running? (`ps aux | grep tanaka`)
- Correct server URL and token in extension settings?
- Try restarting Firefox
- Check extension console: `about:debugging` → Tanaka → Inspect

**Sync not working?**

- Same server URL/token on all devices?
- Did you click "Track This Window"?
- Can you reach server URL in browser?
- Wait 10 seconds (sync is adaptive)

## Common Issues

### Extension Won't Load

```bash
# Check Firefox version (needs 126+)
firefox --version

# Validate extension
cd extension
npx web-ext lint
```

If still broken:

1. Remove from `about:addons`
2. Rebuild: `pnpm run build:prod`
3. Load again from `extension/dist`

### Can't Connect to Server

**Using HTTPS?** Visit server URL in Firefox first to accept certificate.

**Check token matches:**

```bash
grep shared_token ~/.config/tanaka/tanaka.toml
```

**URL format:** Must be full URL like `http://localhost:8000` or `https://example.com:8443`

### Tabs Not Syncing

1. Check extension console for errors:
   `about:debugging` → This Firefox → Tanaka → Inspect

2. Test server is responding:

   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/sync
   ```

3. Nuclear option - clear and restart:
   - Extension settings → Clear Local Data
   - Restart Firefox
   - Track windows again

### High Memory Usage

Too many tabs? Try:

- Only track important windows
- Clear extension storage: `await browser.storage.local.clear()`
- Check memory: `about:memory` → Measure

### Build Issues

```bash
# Extension won't build?
cd extension
rm -rf dist node_modules
pnpm install
pnpm run build:dev

# Server won't build?
cd server
cargo clean
cargo build
```

### Port Already in Use

```bash
# Find what's using it
lsof -i :8000  # macOS/Linux

# Kill it
kill -9 <PID>
```

## Debug Mode

### Extension

```javascript
// View stored data
await browser.storage.local.get()

// Watch network
// DevTools → Network tab → Filter by "sync"
```

### Server

```bash
# Verbose logging
RUST_LOG=debug cargo run

# Check database
sqlite3 ~/.local/share/tanaka/tanaka.db
.tables
```

## Self-Signed HTTPS

```bash
# Generate certificate
openssl req -x509 -newkey rsa:4096 \
  -keyout key.pem -out cert.pem \
  -days 365 -nodes -subj "/CN=localhost"
```

## Still Stuck?

Check the other docs:

- [Getting Started](GETTING-STARTED.md)
- [Development](DEVELOPMENT.md)
- [Architecture](ARCHITECTURE.md)
