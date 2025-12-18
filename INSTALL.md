# Installation Instructions

## Quick Start (Windows)

### Step 1: Build the Plugin

Open PowerShell in the project directory and run:

```powershell
cd C:\Users\USER\projekty\grafana_plugin
npm install
npm run build
```

This creates a `dist` folder with the compiled plugin.

### Step 2: Locate Grafana Plugins Directory

Default locations:
- **Installed via MSI:** `C:\Program Files\GrafanaLabs\grafana\data\plugins\`
- **Portable/Custom:** Check your `grafana.ini` for the `plugins` path

### Step 3: Copy Plugin Files

**Option A: Copy files (simple)**
```powershell
# Run as Administrator
Copy-Item -Path ".\dist\*" -Destination "C:\Program Files\GrafanaLabs\grafana\data\plugins\ala-ela-panel\" -Recurse -Force
```

**Option B: Symbolic link (better for development)**
```powershell
# Run as Administrator
New-Item -ItemType SymbolicLink -Path "C:\Program Files\GrafanaLabs\grafana\data\plugins\ala-ela-panel" -Target "C:\Users\USER\projekty\grafana_plugin\dist"
```

### Step 4: Allow Unsigned Plugin

Edit `C:\Program Files\GrafanaLabs\grafana\conf\defaults.ini` or create a custom `grafana.ini`:

```ini
[plugins]
allow_loading_unsigned_plugins = ala-ela-panel
```

### Step 5: Restart Grafana

```powershell
# If running as a Windows service
Restart-Service grafana

# Or via Services GUI:
# 1. Press Win+R, type "services.msc"
# 2. Find "Grafana"
# 3. Right-click → Restart
```

### Step 6: Verify Installation

1. Open Grafana: http://localhost:3000
2. Go to **Administration** → **Plugins**
3. Search for "AlaEla Panel"
4. You should see the plugin listed

---

## Adding to a Dashboard

### 1. Create Dashboard Variables

First, ensure you have Query-type variables:

1. Open your dashboard → **Settings** (gear icon) → **Variables**
2. Add a new variable:
   - **Type:** Query
   - **Name:** `server` (must match your ClickHouse column name!)
   - **Data source:** Your ClickHouse datasource
   - **Query:** `SELECT DISTINCT server FROM your_table`
3. Repeat for other columns you want to filter

### 2. Add the Filter Panel

1. Click **Add** → **Visualization**
2. Search for "Advanced Variable Filter"
3. Select it to add to dashboard
4. Resize the panel:
   - **Width:** Full dashboard width
   - **Height:** ~100-150px for just filters, ~250px with SQL preview

### 3. Configure Panel Options

In the panel editor sidebar:
- **Variable Names:** Leave empty to show all Query variables, or specify: `server, region, status`
- **Layout:** Choose Horizontal for a toolbar-like appearance
- **Show Labels:** Enable to see variable names
- **Compact Mode:** Enable for tighter spacing

### 4. Position the Panel

Drag the panel to the top of your dashboard to act as a filter bar.

---

## Using Generated SQL

### Method 1: Copy from Panel

1. The panel shows generated SQL clauses
2. Click **Copy** to copy to clipboard
3. Paste into your panel queries

### Method 2: Build Queries with Variables

Structure your ClickHouse queries like this:

```sql
SELECT 
    toStartOfHour(timestamp) as time,
    server,
    avg(cpu_usage) as avg_cpu
FROM metrics
WHERE 1=1
    -- Paste generated clauses here:
    AND server = '${server}'
    AND region != '${region}'  -- if exclude mode
GROUP BY time, server
ORDER BY time
```

**Note:** Currently, the SQL clauses are generated for display/copy. Direct macro injection requires additional development.

---

## Troubleshooting

### "Plugin not found"
- Check the dist folder was copied correctly
- Verify folder name is exactly `ala-ela-panel`
- Check Grafana logs: `C:\Program Files\GrafanaLabs\grafana\data\log\grafana.log`

### "Unsigned plugin" error
- Ensure `allow_loading_unsigned_plugins` is set in the correct config file
- Restart Grafana after config changes

### Variables not appearing
- Only Query-type variables are shown by default
- Check variable names match what's configured in panel options

### Filter changes not affecting queries
- This is expected! Copy the generated SQL clauses manually
- Or modify your queries to use the filter state (advanced usage)

