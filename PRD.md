# Product Requirements Document (PRD)
## AlaEla Panel v0.1 for Grafana (ClickHouse)

**Version:** 1.0  
**Date:** December 18, 2025  
**Status:** Draft  

---

## 1. Executive Summary

This document outlines the requirements for a Grafana panel/app plugin that enhances the default variable selector with advanced filtering capabilities. The plugin introduces a context menu for variables that allows users to toggle between positive/negative filtering and enable/disable filters dynamically, directly affecting ClickHouse SQL query generation.

**Current Status:** Phase 1 MVP Complete + Enhanced Features Implemented
- ✅ Query variables with Include/Exclude and Active/Inactive
- ✅ Ad hoc filter support with operator mapping
- ✅ FreeFilter textbox variable for custom SQL
- ✅ BlockAll master switch for bulk filter control
- ✅ Dev/Prod build system with tree-shaking
- ✅ Custom "All" value support (None, All, $__all)
- ✅ Multi-value variable handling
- ✅ Real-time DEBUG PANEL (dev mode)

---

## 2. Problem Statement

### Current State
- Grafana's default variable selector only allows selecting values for inclusion in queries
- Variables always generate `WHERE column = 'value'` conditions
- No native way to exclude values (`!=`) without creating separate variables
- No ability to temporarily disable a filter without clearing the selection
- Users must manually modify queries or create complex workarounds

### Pain Points
1. **Limited Filtering Logic**: Cannot negate a filter (e.g., "show everything EXCEPT this value")
2. **All-or-Nothing Filters**: No way to temporarily bypass a filter without losing the selection
3. **Query Complexity**: Users resort to complex template variable syntax or multiple dashboards
4. **Poor UX for Data Exploration**: Switching between inclusion/exclusion requires query editing

---

## 3. Goals & Objectives

### Primary Goals
1. Provide an intuitive menu-based interface for advanced variable filtering ✅
2. Enable positive (include) and negative (exclude) filtering modes ✅
3. Allow toggling filters on/off without losing selected values ✅
4. Dynamically modify SQL WHERE clauses based on filter state ✅
5. Support Ad hoc filters with operator mapping ✅
6. Enable custom SQL expressions via FreeFilter ✅
7. Provide bulk filter control with BlockAll switch ✅

### Success Metrics
- Reduced time for data exploration workflows by 50%
- Zero manual query modifications needed for basic include/exclude operations
- User satisfaction score > 4.5/5 for filtering UX
- **Achieved:** 10x size reduction in production builds (231 KB → 21.7 KB)

---

## 4. User Stories

### US-01: Toggle Filter Mode
> **As a** dashboard user  
> **I want to** switch a variable filter between include and exclude mode  
> **So that** I can quickly see data matching OR not matching my selection  

**Acceptance Criteria:**
- Clicking on variable label opens a context menu
- Menu displays current filter mode (Include/Exclude)
- Toggling mode immediately updates all panels using this variable
- SQL changes from `= 'value'` to `!= 'value'` (or vice versa)

### US-02: Disable Filter Temporarily
> **As a** dashboard user  
> **I want to** disable a filter without clearing my selection  
> **So that** I can compare filtered vs unfiltered data quickly  

**Acceptance Criteria:**
- Context menu shows "Filter Active" toggle
- When disabled, the WHERE clause for this variable is omitted entirely
- Visual indicator shows filter is inactive (e.g., strikethrough, grayed out)
- Selected value is preserved and shown
- Re-enabling filter restores the WHERE clause

### US-03: Visual State Indication
> **As a** dashboard user  
> **I want to** see the current state of each filter at a glance  
> **So that** I understand what filters are applied to my data  

**Acceptance Criteria:**
- Active include filter: Normal display
- Active exclude filter: Visual indicator (e.g., red highlight, "≠" icon, strikethrough value)
- Inactive filter: Grayed out or strikethrough on label

### US-04: Dynamic SQL Generation
> **As a** dashboard creator  
> **I want** the SQL WHERE clause to automatically adjust based on filter settings  
> **So that** I don't need to write complex conditional logic  

**Acceptance Criteria:**
- Plugin provides template variables or functions for query building
- Queries automatically include/exclude/omit conditions based on state

---

## 5. Functional Requirements

### 5.1 Variable Menu Component

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Menu opens on click of variable label/name | Must Have |
| FR-02 | Menu displays two toggle options: Filter Mode, Filter Active | Must Have |
| FR-03 | Menu closes on outside click or selection | Must Have |
| FR-04 | Menu positioning follows Grafana UI patterns | Should Have |
| FR-05 | Keyboard navigation support (arrow keys, Enter, Escape) | Could Have |

### 5.2 Filter Mode Toggle

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-10 | Toggle between "Include" (=) and "Exclude" (!=) modes | Must Have |
| FR-11 | Default mode is "Include" | Must Have |
| FR-12 | Mode state persists across page refresh | Must Have |
| FR-13 | Mode state saved in dashboard JSON or URL | Should Have |
| FR-14 | Visual indicator of current mode on variable display | Must Have |

### 5.3 Filter Active Toggle

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-20 | Toggle filter between Active and Inactive states | Must Have |
| FR-21 | Default state is "Active" | Must Have |
| FR-22 | Inactive filter preserves selected value | Must Have |
| FR-23 | Inactive state reflected in variable display | Must Have |
| FR-24 | State persists across page refresh | Must Have |

### 5.4 SQL Query Generation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-30 | Provide mechanism to generate dynamic WHERE clauses | Must Have |
| FR-31 | Support single value selection | Must Have |
| FR-32 | Support multi-value selection | Must Have |
| FR-33 | Handle NULL/empty value edge cases | Must Have |
| FR-34 | Escape values to prevent SQL injection | Must Have |

#### SQL Generation Logic ✅ IMPLEMENTED

```
STATE MATRIX:
┌─────────────┬─────────────┬─────────────────┬─────────────────────────────────────┐
│ Filter Mode │ Active      │ Value Count     │ Generated SQL                       │
├─────────────┼─────────────┼─────────────────┼─────────────────────────────────────┤
│ Include     │ Active      │ 1 value         │ AND column = 'value'                │
│ Include     │ Active      │ 2+ values       │ AND column IN ('v1', 'v2', 'v3')    │
│ Exclude     │ Active      │ 1 value         │ AND column != 'value'               │
│ Exclude     │ Active      │ 2+ values       │ AND column NOT IN ('v1', 'v2')      │
│ Any         │ Inactive    │ Any             │ (no clause generated)               │
│ Any         │ Active      │ 0 / All         │ (no clause generated)               │
└─────────────┴─────────────┴─────────────────┴─────────────────────────────────────┘
```

**Dynamic Updates:** SQL clauses update automatically when:
- Variable values change (selecting/deselecting items)
- Filter mode is toggled (Include ↔ Exclude)
- Filter active state is toggled (On ↔ Off)

---

## 6. Technical Requirements

### 6.1 Plugin Type Analysis

| Plugin Type | Pros | Cons | Recommendation |
|-------------|------|------|----------------|
| **Panel Plugin** | Can display custom UI, familiar pattern | Limited to panel area, doesn't replace nav | Not ideal |
| **App Plugin** | Full control, can add pages/nav | Complex, may be overkill | Possible |
| **Data Source Plugin** | Direct query control | Doesn't control UI | Not suitable alone |
| **Custom Variable Editor** | Direct integration point | Limited API access | Partial solution |

**Recommended Approach:** **App Plugin** with custom variable picker component that:
1. Renders a custom navigation bar replacing/extending the default variable row
2. Stores filter state in dashboard variables or app state
3. Exposes template functions for SQL generation

### 6.2 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        GRAFANA DASHBOARD                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │          ADVANCED FILTER MENU PLUGIN (App Plugin)        │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │    │
│  │  │  Variable 1  │  │  Variable 2  │  │  Variable 3  │   │    │
│  │  │  [Server ▼]  │  │  [Region ▼]  │  │  [Status ▼]  │   │    │
│  │  │   ┌──────┐   │  │              │  │              │   │    │
│  │  │   │ Menu │   │  │              │  │              │   │    │
│  │  │   │──────│   │  │              │  │              │   │    │
│  │  │   │☑ Inc │   │  │              │  │              │   │    │
│  │  │   │☐ Exc │   │  │              │  │              │   │    │
│  │  │   │──────│   │  │              │  │              │   │    │
│  │  │   │☑ Act │   │  │              │  │              │   │    │
│  │  │   └──────┘   │  │              │  │              │   │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    FILTER STATE STORE                    │    │
│  │  {                                                       │    │
│  │    "server": { mode: "include", active: true },         │    │
│  │    "region": { mode: "exclude", active: true },         │    │
│  │    "status": { mode: "include", active: false }         │    │
│  │  }                                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 SQL GENERATION SERVICE                   │    │
│  │                                                          │    │
│  │  Input:  Variable name, value, filter state             │    │
│  │  Output: SQL WHERE clause fragment                      │    │
│  │                                                          │    │
│  │  Example: generateFilter('server', 'prod', state)       │    │
│  │           → "server = 'prod'"                           │    │
│  │           → "server != 'prod'"                          │    │
│  │           → ""                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              CLICKHOUSE QUERY (Panel)                    │    │
│  │                                                          │    │
│  │  SELECT *                                                │    │
│  │  FROM events                                             │    │
│  │  WHERE 1=1                                               │    │
│  │    ${advFilter:server}                                  │    │
│  │    ${advFilter:region}                                  │    │
│  │    ${advFilter:status}                                  │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend Framework | React (Grafana standard) |
| UI Components | @grafana/ui |
| State Management | React Context or Grafana's locationService |
| Build System | @grafana/create-plugin (webpack) |
| Language | TypeScript |
| Styling | Emotion (Grafana standard) |

### 6.4 Data Flow

```
1. User clicks variable label
         │
         ▼
2. Context menu opens with current state
         │
         ▼
3. User toggles Include/Exclude or Active/Inactive
         │
         ▼
4. State updated in FilterStateStore
         │
         ▼
5. Dashboard variables refreshed (trigger re-query)
         │
         ▼
6. Panel queries use SQL Generation Service
         │
         ▼
7. ClickHouse receives modified WHERE clause
         │
         ▼
8. Results displayed with visual state indicators
```

### 6.5 State Persistence Options

| Method | Pros | Cons |
|--------|------|------|
| URL Parameters | Shareable links, bookmarkable | URL length limits |
| Dashboard JSON | Persists with dashboard save | Requires edit permission |
| Local Storage | Works without save | Not shareable |
| Custom Variables | Native Grafana pattern | Variable pollution |

**Recommendation:** Hybrid approach - URL for session state, dashboard JSON for defaults

---

## 7. User Interface Design

### 7.1 Variable Display States

```
NORMAL (Include, Active):
┌─────────────────────┐
│ Server: [prod-01 ▼] │
└─────────────────────┘

EXCLUDE MODE (Exclude, Active):
┌─────────────────────────┐
│ Server: [≠ prod-01 ▼] │  ← "≠" prefix indicates exclusion
└─────────────────────────┘
  └── Optional: Red/orange accent color

INACTIVE (Any, Inactive):
┌─────────────────────────┐
│ S̶e̶r̶v̶e̶r̶: [prod-01 ▼] │  ← Strikethrough on label
└─────────────────────────┘
  └── Grayed out appearance
```

### 7.2 Context Menu Design

```
┌────────────────────────┐
│ ● Include    ○ Exclude │  ← Radio button group
├────────────────────────┤
│ [✓] Filter Active      │  ← Checkbox toggle
└────────────────────────┘

Alternative design:

┌────────────────────────┐
│ 🔍 Include (=)    [ON] │  ← Toggle switches
│ 🚫 Exclude (≠)   [OFF] │
├────────────────────────┤
│ ⚡ Filter Active  [ON] │
└────────────────────────┘
```

### 7.3 Interaction Flow

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   1. HOVER          2. CLICK           3. INTERACT          │
│   ┌────────┐        ┌────────┐         ┌────────┐           │
│   │ Server │   →    │ Server │    →    │ Server │           │
│   │  ▼     │        │  ▼     │         │  ▼     │           │
│   └────────┘        ├────────┤         ├────────┤           │
│     cursor:         │ Menu   │         │●Inc ○Ex│           │
│     pointer         │ opens  │         │[✓]Active│          │
│                     └────────┘         └────────┘           │
│                                              │               │
│                                              ▼               │
│                                        4. UPDATED           │
│                                        ┌──────────┐         │
│                                        │ S̶e̶r̶v̶e̶r̶   │         │
│                                        │ (inactive)│         │
│                                        └──────────┘         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. Query Integration

### 8.1 Usage in ClickHouse Queries

**Template Variable Syntax**

Variable name must match the ClickHouse column name:

```sql
SELECT 
  timestamp,
  server,
  region,
  metric_value
FROM metrics
WHERE 1=1
  ${__advancedFilter(server)}   -- Variable $server → column "server"
  ${__advancedFilter(region)}   -- Variable $region → column "region"
  ${__advancedFilter(status)}   -- Variable $status → column "status"
ORDER BY timestamp DESC
```

**Generated Output Examples:**

```sql
-- If server=prod-01 (Include, Active), region=us-east (Exclude, Active), status (Inactive):
WHERE 1=1
  AND server = 'prod-01'
  AND region != 'us-east'
  -- status filter omitted (inactive)
```

### 8.2 Multi-Value Handling

```sql
-- Single value, Include mode:
WHERE server = 'prod-01'

-- Multiple values, Include mode:
WHERE server IN ('prod-01', 'prod-02', 'prod-03')

-- Single value, Exclude mode:
WHERE server != 'prod-01'

-- Multiple values, Exclude mode:
WHERE server NOT IN ('prod-01', 'prod-02', 'prod-03')

-- Inactive (regardless of mode):
-- (nothing generated)
```

### 8.3 Automatic SQL Variable (`alaela_sql`) ✅ NEW

The panel automatically creates and updates a Grafana variable containing all generated WHERE clauses. This can be referenced in any panel's query.

**Setup (One-Time):**

Users should create a Text box variable in Dashboard Settings:
- **Name:** `alaela_sql`
- **Type:** Text box
- **Default value:** (leave empty or set to `-- No active filters`)
- **Hide:** Variable (optional, to hide from UI)

> **Note:** Must be **Text box** type (not Constant) because Text box variables automatically sync with URL parameters, which the panel uses to update the value.

**Usage in Queries:**

Simply reference `${alaela_sql}` in your SQL queries:

```sql
SELECT timestamp, source_ip, destination_ip, cause 
FROM "default"."network_events" 
WHERE 1=1 
${alaela_sql}
LIMIT 1000
```

**Generated Output:**

The `${alaela_sql}` variable will be automatically replaced with all active filter clauses:

```sql
-- Example when filters are active:
SELECT timestamp, source_ip, destination_ip, cause 
FROM "default"."network_events" 
WHERE 1=1 
AND source_ip IN ('192.168.1.10','192.168.1.20')
AND destination_ip != '10.0.0.50'
LIMIT 1000
```

**Benefits:**
- ✅ No manual SQL copying needed
- ✅ All panels automatically stay in sync with filter changes
- ✅ Clean, maintainable query structure
- ✅ Works with any ClickHouse query panel
- ✅ Updates in real-time when filters change

### 8.4 Ad hoc Filter Support ✅ IMPLEMENTED

**Variable Type:** Grafana Ad hoc Filters

Ad hoc filters are natively supported with the following behavior:

**Panel Integration:**
- Automatically detected and displayed in the panel
- Shows only **Active/Inactive** toggle (no Include/Exclude mode needed)
- Ad hoc handles positive/negative filtering through its own operator selection

**Operator Mapping:**
| Grafana Operator | ClickHouse SQL |
|------------------|----------------|
| `=` | `=` |
| `!=` | `!=` |
| `<` | `<` |
| `>` | `>` |
| `=~` | `LIKE` |
| `!~` | `NOT LIKE` |

**SQL Generation:**
```sql
-- Ad hoc: key=destination_ip, operator==, value=10.0.0.200
AND destination_ip = '10.0.0.200'

-- Ad hoc: key=source_ip, operator==~, value=%192.168%
AND source_ip LIKE '%192.168%'

-- Ad hoc: key=cause, operator=!=, value=error
AND cause != 'error'
```

**Real-time Updates:**
- 50ms polling for Ad hoc filter changes
- DEBUG PANEL shows filter details immediately
- URL parameters updated automatically

### 8.5 FreeFilter Variable ✅ IMPLEMENTED

**Variable Type:** Textbox (must be named exactly "FreeFilter")

Allows users to input raw SQL expressions that are wrapped with `AND (...)` or `AND NOT (...)` based on mode.

**Requirements:**
- Variable name must be **exactly** `FreeFilter` (case-sensitive)
- Variable type must be **Textbox**
- Only single-value input (multi-value is ignored)

**SQL Generation:**

| Mode | State | Input | Generated SQL |
|------|-------|-------|---------------|
| Include | Active | `status = 'ok' OR priority > 5` | `AND (status = 'ok' OR priority > 5)` |
| Exclude | Active | `status = 'ok' OR priority > 5` | `AND NOT (status = 'ok' OR priority > 5)` |
| Either | Inactive | Any | (no SQL clause) |
| Include | Active | `v1,v2` (multi) | (no SQL clause) |

**Use Cases:**
- Complex conditions with OR logic
- Subqueries or EXISTS clauses
- Mathematical expressions
- Date/time calculations

**Example:**
```sql
-- FreeFilter input: "toHour(timedate) BETWEEN 9 AND 17"
-- Generated: AND (toHour(timedate) BETWEEN 9 AND 17)
```

See `FREEFILTER.md` for detailed documentation.

### 8.6 BlockAll Master Switch ✅ IMPLEMENTED

A special control that allows users to temporarily deactivate all filters with one click, and restore them later.

**Position:** First item in the panel filter list

**Visual Design:**

**OFF State (Default):**
```
[⚡ BlockAll ○] [= source_ip: ...] [= destination_ip: ...] ...
```
- Gray background (#2a2a2a)
- Lightning bolt icon (⚡)
- Toggle switch on left
- Hover: Brightens

**ON State (Blocking):**
```
[🚫 BlockAll ● 3] [≠ source_ip: ...] [≠ destination_ip: ...] ...
```
- Red background (#ff4444)
- Block icon (🚫)
- Toggle switch on right
- Badge showing count of blocked filters
- All other filters appear inactive (grayed out)

**Behavior:**
1. **Initially OFF**: All filters work normally
2. **User clicks BlockAll** → Switch turns ON:
   - Saves current active/inactive state of all filters
   - Deactivates ALL filters (no SQL generated)
   - Badge shows count of previously active filters
3. **User clicks BlockAll again** → Switch turns OFF:
   - Restores previously saved active states
   - Filters that were active are reactivated

**Independent Operation:**
- Users can manually activate/deactivate individual filters while BlockAll is ON
- BlockAll doesn't track these manual changes
- When BlockAll is turned OFF, it only restores the original snapshot

**State Management:**
```typescript
// State stored in component
blockAllEnabled: boolean
snapshotActiveFilters: Set<string>  // Names of filters that were active when BlockAll was turned ON
```

### 8.7 Custom "All" Value Support ✅ IMPLEMENTED

The plugin recognizes multiple representations of "no filter" / "all values" and automatically skips SQL generation:

**Supported Values:**
- `$__all` (Grafana default)
- `All` (common custom value)
- `None` (custom all value)
- Empty string `''`

**Configuration:**
In Grafana variable settings, under "Selection Options":
- Enable "Include All option"
- Set "Custom all value" to `None` (or leave default)

**Behavior:**
```sql
-- When variable is set to "None", "All", or empty:
-- (no SQL clause generated)

-- When variable has actual values:
WHERE column IN ('value1', 'value2')
```

This allows users to configure "None" as their "All" representation without generating invalid SQL like `AND column = 'None'`.

---

## 9. Implementation Phases

### Phase 1: MVP (4-6 weeks) ✅ COMPLETED
- [x] Basic app plugin scaffold
- [x] Custom variable menu component
- [x] Include/Exclude toggle functionality
- [x] Active/Inactive toggle functionality
- [x] Basic SQL generation for single values
- [x] URL-based state persistence
- [x] Visual state indicators
- [x] Multi-value support with IN/NOT IN
- [x] Copy filter state to clipboard
- [x] Dynamic SQL updates on variable value changes

### Phase 2: Enhanced Features (2-3 weeks) ✅ COMPLETED
- [x] Ad hoc filter support with Active/Inactive toggle
- [x] Ad hoc operator mapping (=~ → LIKE, !~ → NOT LIKE)
- [x] FreeFilter textbox variable for custom SQL expressions
- [x] BlockAll master switch for bulk filter control
- [x] Dev/Prod build system with conditional compilation
- [x] DEBUG PANEL for development (real-time variable inspection)
- [x] Custom "All" value support (None, All, $__all)
- [x] Multi-value variable prioritization (Template > URL > Current)
- [x] Real-time Ad hoc filter polling (50ms)

### Phase 3: Polish & Advanced (Future)
- [ ] Dashboard JSON persistence
- [ ] Keyboard navigation
- [ ] Filter presets/saved states
- [ ] Dashboard variable migration tool
- [ ] Comprehensive documentation & examples (partially complete)

---

## 10. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Grafana API changes | High | Medium | Pin Grafana version, follow deprecation notices |
| Performance with many variables | Medium | Low | Lazy rendering, virtualization |
| State sync issues | High | Medium | Centralized state store, event-driven updates |
| ClickHouse query injection | Critical | Low | Parameterized queries, strict value escaping |
| User confusion with states | Medium | Medium | Clear visual indicators, tooltips, onboarding |

---

## 11. Dependencies

### External Dependencies
- Grafana >= 10.0 (for latest plugin APIs)
- @grafana/ui component library
- @grafana/data for data frame handling
- @grafana/runtime for plugin services
- ClickHouse data source plugin

### Internal Dependencies
- Dashboard variable system
- Query execution pipeline
- URL/location service

---

## 12. Design Decisions

| Question | Decision | Rationale |
|----------|----------|-----------|
| Datasource support | **ClickHouse only** | Focused scope, no abstraction layer needed |
| Variable → Column mapping | **Variable name = Column name** | Simplest approach; users name variables to match DB columns |
| URL parameter format | Separate params: `?var-server=prod&_fm-server=exclude&_fa-server=false` | Clean, readable, easy to parse |
| "All" value behavior | Treat as inactive (no WHERE clause) | Logical - selecting all = no filter |
| Inactive filter visibility | Show grayed out with preserved value | User can see what would be filtered |

### Naming Convention Requirement

Since variable names must match column names, users should follow this pattern:

```
Grafana Variable Name    →    ClickHouse Column Name
─────────────────────────────────────────────────────
$server                  →    server
$region                  →    region  
$status_code             →    status_code
```

**Example Query:**
```sql
SELECT timestamp, server, region, status_code, response_time
FROM http_logs
WHERE 1=1
  ${__advancedFilter(server)}       -- generates: AND server = 'prod-01'
  ${__advancedFilter(region)}       -- generates: AND region != 'us-east'
  ${__advancedFilter(status_code)}  -- generates: (nothing, filter inactive)
ORDER BY timestamp DESC
```

---

## 13. Success Criteria

### Launch Criteria
- [ ] All Phase 1 features complete and tested
- [ ] No critical or high-severity bugs
- [ ] Documentation complete
- [ ] Performance benchmarks met (menu opens < 100ms)
- [ ] Works with Grafana 10.x and 11.x

### Post-Launch Metrics
- User adoption rate
- Error/crash rate < 0.1%
- Feature usage analytics (Include vs Exclude ratio)
- User feedback score

---

## 14. Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| Filter Mode | Whether the variable filters for inclusion (=) or exclusion (!=) |
| Filter Active | Whether the filter is currently applied to queries |
| Template Variable | Grafana's mechanism for parameterizing dashboard queries |
| WHERE Clause | SQL condition for filtering query results |

### B. References

- [Grafana Plugin Development Guide](https://grafana.com/developers/plugin-tools/)
- [Grafana UI Components](https://developers.grafana.com/ui/latest/)
- [ClickHouse SQL Reference](https://clickhouse.com/docs/en/sql-reference)
- [Grafana Variables Documentation](https://grafana.com/docs/grafana/latest/dashboards/variables/)

### C. Build System ✅ IMPLEMENTED

The plugin uses a dual-build system for development and production:

**Build Configuration:**
- `webpack.DefinePlugin` injects `__DEV__` constant
- TypeScript global declaration: `declare const __DEV__: boolean`
- Conditional compilation: `if (__DEV__) { ... }`
- Tree-shaking removes debug code in production

**Build Commands:**
```bash
npm run build:dev    # Dev build: __DEV__ = true
npm run build:prod   # Prod build: __DEV__ = false
npm run dev          # Watch mode (dev)
```

**Size Comparison:**
- Dev: ~231 KB (includes DEBUG PANEL, console logs)
- Prod: ~21.7 KB (10x smaller, debug code removed)

**Debug Features (Dev Only):**
- DEBUG PANEL with expandable sections
- Variable value inspection (URL/Template/Current/Panel)
- Ad hoc filter details
- Console logging for all operations
- Real-time filter count updates

See `BUILD.md` for detailed documentation.

### D. Additional Documentation

- **README.md**: User-facing installation and usage guide
- **BUILD.md**: Dev/Prod build instructions
- **FREEFILTER.md**: FreeFilter variable feature documentation
- **PRD.md**: This document - comprehensive product requirements

---

**Document History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 18, 2025 | - | Initial draft |
| 2.0 | Dec 27, 2025 | - | Updated with Phase 2 implementations: Ad hoc filters, FreeFilter, BlockAll, Dev/Prod builds, Custom "All" values |

