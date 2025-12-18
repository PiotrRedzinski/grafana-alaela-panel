# AlaEla Panel v0.1 for Grafana

A Grafana panel plugin that enhances variable filtering with **include/exclude modes** and **active/inactive states** for ClickHouse queries.

## Features

- 🔀 **Toggle Include/Exclude**: Switch between `=` and `!=` filtering for any variable
- ⏸️ **Enable/Disable Filters**: Temporarily bypass filters without losing selections
- 📋 **SQL Preview**: See generated WHERE clauses in real-time
- 🔗 **URL Persistence**: Filter states are saved in URL for sharing
- 🎨 **Visual Indicators**: Clear display of filter modes and states

## Screenshots

### Filter Menu
Click on any variable label to open the filter configuration menu:
- Toggle between **Include (=)** and **Exclude (≠)** modes
- Enable or disable the filter

### Visual States
- ✅ **Green indicator + "="**: Include mode, filter active
- ⚠️ **Orange indicator + "≠"**: Exclude mode, filter active  
- ⚫ **Gray indicator + strikethrough**: Filter inactive

## Installation

### Option 1: Development Mode (Recommended for Testing)

1. **Build the plugin:**
   ```bash
   cd C:\Users\USER\projekty\grafana_plugin
   npm install
   npm run build
   ```

2. **Find your Grafana plugins directory:**
   - Windows: `C:\Program Files\GrafanaLabs\grafana\data\plugins\`
   - Linux: `/var/lib/grafana/plugins/`
   - Docker: Mount volume to `/var/lib/grafana/plugins`

3. **Copy the plugin:**
   ```bash
   # Linux
   sudo mkdir -p /var/lib/grafana/plugins/ala-ela-panel
   sudo cp -r dist/* /var/lib/grafana/plugins/ala-ela-panel/
   
   # Windows (run as Administrator)
   xcopy /E /I dist "C:\Program Files\GrafanaLabs\grafana\data\plugins\ala-ela-panel"
   
   # Or create a symbolic link for development (Linux)
   sudo ln -s /path/to/grafana_plugin/dist /var/lib/grafana/plugins/ala-ela-panel
   ```

4. **Configure Grafana for unsigned plugins:**
   
   ```bash
   # Linux
   sudo nano /etc/grafana/grafana.ini
   
   # Windows
   # Edit: C:\Program Files\GrafanaLabs\grafana\conf\grafana.ini
   ```
   
   Add this in the `[plugins]` section:
   ```ini
   [plugins]
   allow_loading_unsigned_plugins = ala-ela-panel
   ```

5. **Restart Grafana:**
   ```bash
   # Linux (systemd)
   sudo systemctl restart grafana-server
   
   # Or using service command
   sudo service grafana-server restart
   
   # Windows Service
   net stop grafana
   net start grafana
   ```

6. **Verify installation:**
   - Go to Grafana → Administration → Plugins
   - Search for "Advanced Variable Filter"

### Option 2: Docker Development

```yaml
# docker-compose.yml
version: '3'
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    volumes:
      - ./dist:/var/lib/grafana/plugins/ala-ela-panel
    environment:
      - GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=ala-ela-panel
```

## Usage

### 1. Add the Panel to Your Dashboard

1. Edit your dashboard
2. Add a new panel
3. Search for "AlaEla Panel"
4. Configure panel height (recommended: 100-200px for filter bar, taller for SQL preview)

### 2. Configure Panel Options

| Option | Description |
|--------|-------------|
| **Variable Names** | Comma-separated list of variables to show. Leave empty for all Query variables. |
| **Layout** | Horizontal (row) or Vertical (column) arrangement |
| **Show Labels** | Display variable names/labels |
| **Compact Mode** | Reduced spacing for smaller panels |

### 3. Using Filters

1. **Click on variable label** to open the filter menu
2. **Select filter mode**: Include (=) or Exclude (≠)
3. **Toggle active state**: Enable/disable the filter
4. **Select values** from the dropdown

### 4. Using in ClickHouse Queries

The panel shows generated SQL in real-time. Copy the clauses to your queries:

```sql
SELECT 
  timestamp,
  server,
  region,
  metric_value
FROM metrics
WHERE 1=1
  AND server = 'prod-01'        -- From include filter
  AND region != 'us-east'       -- From exclude filter
  -- status filter omitted (inactive)
ORDER BY timestamp DESC
```

**Important:** Variable names must match your ClickHouse column names!

## URL Parameters

Filter state is persisted in URL parameters:

| Parameter | Format | Example |
|-----------|--------|---------|
| Filter Mode | `_fm-{varname}` | `_fm-server=exclude` |
| Filter Active | `_fa-{varname}` | `_fa-server=false` |

Example URL:
```
?var-server=prod-01&var-region=us-east&_fm-region=exclude&_fa-status=false
```

## Development

```bash
# Install dependencies
npm install

# Development mode (watch for changes)
npm run dev

# Production build
npm run build

# Type checking
npm run typecheck
```

## Requirements

- Grafana >= 10.0
- Node.js >= 18

## Troubleshooting

### Plugin not loading
1. Check Grafana logs: `C:\Program Files\GrafanaLabs\grafana\data\log\grafana.log`
2. Ensure `allow_loading_unsigned_plugins` is set correctly
3. Verify plugin files exist in the plugins directory

### Variables not showing
1. Ensure you have Query-type variables in your dashboard
2. Check the "Variable Names" panel option
3. Variable names are case-sensitive

### SQL not generating
1. Select a value for the variable
2. Ensure the filter is set to "Active"
3. Check that the value is not "All"

## License

Apache 2.0

