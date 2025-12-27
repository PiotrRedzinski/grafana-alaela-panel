# AlaEla Panel v0.1 for Grafana

A Grafana panel plugin that enhances variable filtering with **include/exclude modes**, **active/inactive states**, **Ad hoc filters**, and **custom SQL expressions** for ClickHouse queries.

## Features

### Core Filtering
- 🔀 **Toggle Include/Exclude**: Switch between `=` and `!=` filtering for Query variables
- ⏸️ **Enable/Disable Filters**: Temporarily bypass filters without losing selections
- 🚫 **BlockAll Master Switch**: One-click deactivation of all active filters with state restore

### Variable Types Supported
- 📊 **Query Variables**: Full Include/Exclude and Active/Inactive controls
- 🔧 **Ad hoc Filters**: Native Grafana Ad hoc variables with Active/Inactive toggle (no Include/Exclude needed)
- ✏️ **FreeFilter**: Special Textbox variable for raw SQL expressions with Include/Exclude and Active/Inactive

### Developer Features
- 📋 **SQL Preview**: See generated WHERE clauses in real-time (Dev build only)
- 🐛 **DEBUG PANEL**: Inspect variable values and filter states (Dev build only)
- 🔗 **URL Persistence**: Filter states saved in URL for sharing
- 🎨 **Visual Indicators**: Clear display of filter modes and states
- 🔨 **Dev/Prod Builds**: Separate builds with/without debug features (10x size reduction in prod)

### SQL Generation
- Automatic operator mapping for Ad hoc: `=~` → `LIKE`, `!~` → `NOT LIKE`
- Multi-value support: `IN` / `NOT IN` clauses
- Custom "All" values: Supports `All`, `$__all`, `None`, or empty as "no filter"
- SQL injection protection with proper value escaping

## Variable Types

### 1. Query Variables
Standard Grafana Query variables with enhanced controls:
- **Include/Exclude Mode**: Toggle between `=` and `!=` operators
- **Active/Inactive**: Enable/disable filter without losing selection
- **Multi-value Support**: Generates `IN` / `NOT IN` clauses

**Example SQL Generation:**
```sql
-- Single value, Include: AND server = 'prod-01'
-- Multiple values, Include: AND server IN ('prod-01', 'prod-02')
-- Single value, Exclude: AND server != 'prod-01'
-- Multiple values, Exclude: AND server NOT IN ('prod-01', 'prod-02')
-- Inactive: (no clause)
```

### 2. Ad hoc Filters
Native Grafana Ad hoc filter variables:
- **Active/Inactive Toggle**: Only control available (no Include/Exclude - Ad hoc handles this internally)
- **Operator Mapping**: `=~` → `LIKE`, `!~` → `NOT LIKE`
- **Dynamic Updates**: Changes reflect immediately in DEBUG PANEL

**Example SQL Generation:**
```sql
-- Ad hoc: key=destination_ip, operator==, value=10.0.0.200
-- Result: AND destination_ip = '10.0.0.200'

-- Ad hoc: key=source_ip, operator==~, value=%192.168%
-- Result: AND source_ip LIKE '%192.168%'
```

### 3. FreeFilter (Textbox Variable)
Special Textbox variable named **exactly** "FreeFilter" for raw SQL expressions:
- **Include/Exclude Mode**: Wraps expression with `AND (...)` or `AND NOT (...)`
- **Active/Inactive**: Enable/disable the custom SQL
- **Flexible**: Any valid ClickHouse SQL expression

**Requirements:**
- Variable must be named **exactly** "FreeFilter" (case-sensitive)
- Variable type must be **Textbox**
- Only single-value input supported (multi-value input is ignored)

**Example SQL Generation:**
```sql
-- Input: "status = 'ok' OR priority > 5"
-- Include mode: AND (status = 'ok' OR priority > 5)
-- Exclude mode: AND NOT (status = 'ok' OR priority > 5)
-- Inactive: (no clause)
```

### 4. BlockAll Master Switch
Special control to temporarily deactivate all filters:
- **Position**: First item in the panel filter list
- **Visual States**:
  - OFF (default): Gray background, ⚡ icon, toggle on left
  - ON (blocking): Red background, 🚫 icon, toggle on right, badge showing count
- **Behavior**:
  1. Initially OFF - all filters work normally
  2. Switch ON → Saves current active state, deactivates ALL filters
  3. Switch OFF → Restores previously active filters
  4. Independent operation: Any filter can be toggled manually while BlockAll is ON

## Screenshots

### Filter Menu
Click on any variable label to open the filter configuration menu:
- Toggle between **Include (=)** and **Exclude (≠)** modes (Query and FreeFilter only)
- Enable or disable the filter (all variable types)
- Ad hoc filters show only Active/Inactive toggle

### Visual States
- ✅ **Green indicator + "="**: Include mode, filter active
- ⚠️ **Orange indicator + "≠"**: Exclude mode, filter active  
- ⚫ **Gray indicator + strikethrough**: Filter inactive
- 🚫 **Red BlockAll switch**: All filters temporarily blocked

### DEBUG PANEL (Dev Build Only)
Expandable panel showing:
- Variable values from URL, Template, Current state
- Panel-detected values
- Ad hoc filter details (keys, operators, values)
- Filter counts by type
- Real-time updates (50ms polling for Ad hoc)

## Installation

### Option 1: Development Mode (Recommended for Testing)

1. **Build the plugin:**
   ```bash
   cd C:\Users\USER\projekty\grafana_plugin
   npm install
   
   # Dev build (with DEBUG PANEL, 231 KB)
   npm run build:dev
   
   # OR Production build (compact, 21.7 KB)
   npm run build:prod
   ```

2. **Find your Grafana plugins directory:**
   - Windows: `C:\Program Files\GrafanaLabs\grafana\data\plugins\`
   - Linux: `/var/lib/grafana/plugins/`
   - Docker: Mount volume to `/var/lib/grafana/plugins`

3. **Copy the plugin:**
   ```bash
   # Windows (run as Administrator)
   xcopy /E /I dist "C:\Program Files\GrafanaLabs\grafana\data\plugins\ala-ela-panel"
   
   # Or create a symbolic link for development
   mklink /D "C:\Program Files\GrafanaLabs\grafana\data\plugins\ala-ela-panel" "C:\Users\USER\projekty\grafana_plugin\dist"
   ```

4. **Configure Grafana for unsigned plugins:**
   
   Edit `grafana.ini` (usually in `C:\Program Files\GrafanaLabs\grafana\conf\`):
   ```ini
   [plugins]
   allow_loading_unsigned_plugins = ala-ela-panel
   ```

5. **Restart Grafana:**
   ```bash
   # Windows Service
   net stop grafana
   net start grafana
   
   # Or restart from Services manager
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
| **Variable Names** | Comma-separated list of variables to show. Leave empty to auto-detect all Query, Ad hoc, and FreeFilter variables. |
| **Layout** | Horizontal (row) or Vertical (column) arrangement |
| **Show Labels** | Display variable names/labels |
| **Compact Mode** | Reduced spacing for smaller panels |

### 3. Configure Variables

#### Query Variables
Create standard Grafana Query variables matching your ClickHouse column names.

#### Ad hoc Filter (Optional)
1. Add a new variable, type: **Ad hoc Filters**
2. Select your ClickHouse datasource
3. The plugin will automatically detect and display it

#### FreeFilter (Optional)
1. Add a new variable:
   - **Name:** `FreeFilter` (exactly, case-sensitive)
   - **Type:** Textbox
   - **Default value:** (leave empty or set a default SQL expression)
2. The plugin will automatically detect it and add Include/Exclude controls

#### Custom "All" Values
If you use custom "All" values in your Query variables (e.g., "None"), the plugin automatically recognizes these and skips SQL generation:
- Supported: `All`, `$__all`, `None`, empty string `''`

### 4. Using Filters

1. **BlockAll switch** at the top to temporarily disable all filters
2. **Click on variable label** to open the filter menu
3. **Select filter mode**: Include (=) or Exclude (≠) (Query/FreeFilter only)
4. **Toggle active state**: Enable/disable the filter (all types)
5. **Select values** from native Grafana dropdowns

### 5. Using in ClickHouse Queries

The panel shows generated SQL in real-time (Dev build). Copy the clauses to your queries:

```sql
SELECT 
  timedate,
  source_ip,
  destination_ip,
  cause
FROM network_events
WHERE $__timeFilter(timedate)  -- Grafana time range macro
  AND source_ip IN ('192.168.1.10', '192.168.1.20')  -- Query variable (Include)
  AND destination_ip != '10.0.0.200'                 -- Ad hoc filter (Exclude)
  AND (status = 'ok' OR priority > 5)                -- FreeFilter (Include)
ORDER BY timedate DESC
```

**Important Notes:**
- Query variable names must match your ClickHouse column names
- Ad hoc filter keys are column names
- FreeFilter must contain valid ClickHouse SQL
- Use `$__timeFilter(column_name)` for Grafana time range integration

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

### Build Commands

```bash
# Install dependencies
npm install

# Development build (with DEBUG PANEL and console logs, ~230 KB)
npm run build:dev

# Production build (compact, no debug features, ~22 KB - 10x smaller!)
npm run build:prod

# Watch mode (auto-rebuild on changes)
npm run dev

# Type checking
npm run typecheck
```

### Dev vs Prod Builds

| Feature | Dev Build | Prod Build |
|---------|-----------|------------|
| **Size** | ~230 KB | ~22 KB |
| **DEBUG PANEL** | ✅ Included | ❌ Removed |
| **Console Logging** | ✅ Enabled | ❌ Tree-shaken |
| **Core Functionality** | ✅ | ✅ |
| **Use Case** | Development, testing, debugging | Production deployment |

The build system uses `webpack.DefinePlugin` with `__DEV__` constant for conditional compilation and tree-shaking.

See `BUILD.md` for detailed instructions.

## Requirements

- Grafana >= 10.0
- Node.js >= 18

## Troubleshooting

### Plugin not loading
1. Check Grafana logs: `C:\Program Files\GrafanaLabs\grafana\data\log\grafana.log`
2. Ensure `allow_loading_unsigned_plugins` is set correctly
3. Verify plugin files exist in the plugins directory

### Variables not showing
1. Ensure you have Query-type, Ad hoc, or FreeFilter (Textbox) variables in your dashboard
2. Check the "Variable Names" panel option (leave empty for auto-detect)
3. Variable names are case-sensitive
4. FreeFilter must be named exactly "FreeFilter" (not "freefilter" or "FreeFilter1")

### SQL not generating
1. Select a value for the variable
2. Ensure the filter is set to "Active"
3. Check that the value is not "All", "None", or empty (unless intentional)
4. For FreeFilter, multi-value input is ignored (only single expressions supported)

### Ad hoc filters not detected
1. Ensure Ad hoc variable type is correctly set
2. Select a datasource for the Ad hoc variable
3. Check DEBUG PANEL (Dev build) to see filter detection status

### Multi-value variables not working
1. Verify Template value shows ClickHouse format: `{val1,val2,val3}`
2. Check URL parameter (may only show first value, but Template has all)
3. Panel should detect and use all values from Template service

## Additional Documentation

- `BUILD.md` - Detailed dev/prod build instructions
- `FREEFILTER.md` - FreeFilter variable feature documentation
- `PRD.md` - Complete product requirements document

## License

Apache 2.0

