# Quick Install Guide

## Linux Installation

### 1. Create Plugin Directory
```bash
sudo mkdir -p /var/lib/grafana/plugins/ala-ela-panel
```

### 2. Copy Plugin Files
Copy these files from the `dist/` folder to the plugin directory:
```bash
sudo cp dist/module.js /var/lib/grafana/plugins/ala-ela-panel/
sudo cp dist/module.js.map /var/lib/grafana/plugins/ala-ela-panel/
sudo cp dist/plugin.json /var/lib/grafana/plugins/ala-ela-panel/
sudo cp dist/README.md /var/lib/grafana/plugins/ala-ela-panel/
```

Or copy everything at once:
```bash
sudo cp -r dist/* /var/lib/grafana/plugins/ala-ela-panel/
```

### 3. Configure Grafana
Edit Grafana configuration to allow unsigned plugins:
```bash
sudo nano /etc/grafana/grafana.ini
```

Add or modify this line in the `[plugins]` section:
```ini
[plugins]
allow_loading_unsigned_plugins = ala-ela-panel
```

### 4. Restart Grafana
```bash
# For systemd (Ubuntu/Debian/CentOS/RHEL)
sudo systemctl restart grafana-server

# Or if using service command
sudo service grafana-server restart
```

### 5. Verify Installation
1. Open Grafana in browser: `http://localhost:3000`
2. Go to: Administration → Plugins
3. Search for "AlaEla Panel"

---

## Windows Installation

### 1. Copy Plugin Files
```powershell
xcopy "dist\*.*" "C:\Program Files\GrafanaLabs\grafana\data\plugins\ala-ela-panel\" /Y /S
```

### 2. Configure Grafana
Edit: `C:\Program Files\GrafanaLabs\grafana\conf\custom.ini`

Add:
```ini
[plugins]
allow_loading_unsigned_plugins = ala-ela-panel
```

### 3. Restart Grafana
```powershell
net stop grafana
net start grafana
```

---

## Docker Installation

```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/dist:/var/lib/grafana/plugins/ala-ela-panel \
  -e "GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=ala-ela-panel" \
  --name grafana \
  grafana/grafana:latest
```

---

## Quick Setup

After installation, add the panel to your dashboard:

1. **Add the Panel:** Edit dashboard → Add → Visualization → Select "AlaEla Panel"
2. **Configure Variables:** Dashboard Settings → Variables → Create Query variables for your filters
3. **Use in Queries:** Reference `${alaela_sql}` in your ClickHouse queries

See **[SQL_VARIABLE_GUIDE.md](SQL_VARIABLE_GUIDE.md)** for detailed usage instructions.

