# FreeFilter Variable Support

The AlaEla Panel supports a special **Textbox variable named "FreeFilter"** that allows users to enter **raw SQL expressions** with Include/Exclude and Active/Inactive controls.

## Overview

- **Variable Type**: Textbox
- **Variable Name**: Must be exactly `FreeFilter` (case-sensitive)
- **Purpose**: Enter complete SQL conditions/expressions
- **Features**: Include/Exclude mode, Active/Inactive toggle, SQL generation

## Important: FreeFilter is for SQL Expressions

**FreeFilter is NOT a column value filter.** It contains complete SQL boolean expressions that are directly inserted into your WHERE clause.

### Examples:

| User Input | What It Means |
|------------|---------------|
| `source_ip = '192.168.1.10'` | Filter by specific IP |
| `status IN ('active', 'pending')` | Multiple status values |
| `timestamp > now() - interval 1 hour` | Time-based filter |
| `amount > 1000 AND category = 'premium'` | Complex condition |

## Setup in Grafana

### 1. Create the Variable

1. Go to **Dashboard Settings** → **Variables**
2. Click **New variable**
3. Configure:
   - **Name**: `FreeFilter` (exactly this name, case-sensitive)
   - **Type**: `Text box`
   - **Label**: `Free Filter` (optional, for display)
   - **Default value**: (leave empty)

### 2. Use in Panel

The FreeFilter variable will automatically appear in the AlaEla Panel with:
- ✅ Include (AND) / Exclude (AND NOT) toggle
- ✅ Active / Inactive switch
- ✅ SQL clause generation
- ✅ Real-time updates

## SQL Generation

### Basic Rules:

| Mode | State | Input | Generated SQL |
|------|-------|-------|---------------|
| Include | Active | `source_ip = '10.0.0.100'` | `AND (source_ip = '10.0.0.100')` |
| Exclude | Active | `source_ip = '10.0.0.100'` | `AND NOT (source_ip = '10.0.0.100')` |
| Either | Inactive | `anything` | *(no SQL clause)* |
| Either | Active | `value1,value2` | *(no SQL clause - comma not allowed)* |

### Key Points:

✅ **Single expression only**: No commas allowed (comma = no SQL generated)
✅ **Complete SQL**: Enter full boolean expressions
✅ **Include mode**: Wraps in `AND (expression)`
✅ **Exclude mode**: Wraps in `AND NOT (expression)`
✅ **Parentheses added**: Ensures proper SQL precedence

## Use Cases

### 1. Simple Column Filter
```
FreeFilter Input: source_ip = '192.168.1.10'
Include Mode: AND (source_ip = '192.168.1.10')
Exclude Mode: AND NOT (source_ip = '192.168.1.10')
```

### 2. IN Clause
```
FreeFilter Input: status IN ('active', 'pending', 'review')
Include Mode: AND (status IN ('active', 'pending', 'review'))
Exclude Mode: AND NOT (status IN ('active', 'pending', 'review'))
```

### 3. Range Filter
```
FreeFilter Input: amount BETWEEN 100 AND 1000
Include Mode: AND (amount BETWEEN 100 AND 1000)
Exclude Mode: AND NOT (amount BETWEEN 100 AND 1000)
```

### 4. Complex Condition
```
FreeFilter Input: (priority = 'high' OR status = 'critical') AND assigned = true
Include Mode: AND ((priority = 'high' OR status = 'critical') AND assigned = true)
Exclude Mode: AND NOT ((priority = 'high' OR status = 'critical') AND assigned = true)
```

### 5. NULL Check
```
FreeFilter Input: error_message IS NOT NULL
Include Mode: AND (error_message IS NOT NULL)
Exclude Mode: AND NOT (error_message IS NOT NULL)
```

### 6. LIKE Pattern
```
FreeFilter Input: hostname LIKE 'prod-%'
Include Mode: AND (hostname LIKE 'prod-%')
Exclude Mode: AND NOT (hostname LIKE 'prod-%')
```

### 7. Time-Based Filter (ClickHouse)
```
FreeFilter Input: timestamp > now() - interval 1 hour
Include Mode: AND (timestamp > now() - interval 1 hour)
Exclude Mode: AND NOT (timestamp > now() - interval 1 hour)
```

## Important Notes

### ✅ Will Work
- Any valid SQL boolean expression
- Column comparisons: `column = 'value'`
- IN clauses: `column IN (1,2,3)`
- Complex conditions with AND/OR
- Functions: `toDate(timestamp) = today()`
- NULL checks: `column IS NULL`

### ❌ Will NOT Generate SQL
- **Multiple values with commas at top level**: `value1, value2`
- **Empty input**: No text entered
- **Special Grafana values**: `$__all`, `All`
- **When Inactive**: Filter is turned off

### ⚠️ Security Warning

**FreeFilter directly inserts SQL into your queries!**

- Only use in trusted environments
- Never expose to untrusted users
- No SQL injection protection (by design - you control the SQL)
- Validate input in production environments

## Example Configuration

### Complete Dashboard Setup:

1. **Query Variables** (for dropdowns):
   - Name: `source_ip`, `destination_ip`, `cause`
   - Type: Query
   
2. **FreeFilter Variable** (for SQL expressions):
   - Name: `FreeFilter`
   - Type: Text box
   - Default: (empty)

3. **Ad hoc Variable** (for dynamic filters):
   - Name: `adhoc`
   - Type: Ad hoc filters

4. **SQL Variable** (for generated clauses):
   - Name: `alaela_sql`
   - Type: Text box
   - Hide: Variable

### In Your Query:
```sql
SELECT 
  timestamp,
  IPv4NumToString(source_ip) AS source_ip,
  IPv4NumToString(destination_ip) AS destination_ip,
  cause
FROM network_events
WHERE 1=1
  ${alaela_sql}
ORDER BY timestamp DESC
```

### User enters in FreeFilter:
```
source_ip = IPv4StringToNum('192.168.1.10')
```

### Panel Display:
```
[=] source_ip: 192.168.1.10 ●
[=] FreeFilter: source_ip = IPv4StringToNum('192.168.1.10') ●
[adhoc] network_events.cause = "ok" ●
```

### Generated SQL:
```sql
AND source_ip = '192.168.1.10'
AND (source_ip = IPv4StringToNum('192.168.1.10'))
AND network_events.cause = 'ok'
```

### Final Query Executed:
```sql
SELECT 
  timestamp,
  IPv4NumToString(source_ip) AS source_ip,
  IPv4NumToString(destination_ip) AS destination_ip,
  cause
FROM network_events
WHERE 1=1
  AND source_ip = '192.168.1.10'
  AND (source_ip = IPv4StringToNum('192.168.1.10'))
  AND network_events.cause = 'ok'
ORDER BY timestamp DESC
```

## Advanced Patterns

### 1. Subquery Condition
```sql
user_id IN (SELECT user_id FROM premium_users WHERE active = true)
```

### 2. Function-Based Filter
```sql
toStartOfHour(timestamp) = toStartOfHour(now())
```

### 3. JSON Path (if supported)
```sql
JSONExtractString(metadata, 'category') = 'urgent'
```

### 4. Regular Expression (ClickHouse)
```sql
match(hostname, '^(prod|staging)-.*$')
```

## Troubleshooting

### FreeFilter not appearing in panel?
- Variable name must be exactly `FreeFilter` (case-sensitive)
- Variable type must be `Text box`
- Check panel options - ensure not filtered out

### SQL not generating?
1. Filter is Active (green dot)?
2. Input contains valid expression?
3. No commas in the input?
4. Check Generated SQL Clauses section in panel

### SQL syntax error in query?
- Verify your SQL expression is valid for your database
- Check for unmatched quotes or parentheses
- Test the expression directly in your database first

### Exclude mode not working as expected?
- Exclude wraps expression in `AND NOT (...)`
- Ensure your expression logic is correct with NOT
- Example: `NOT (status = 'active')` excludes active status

## Tips

1. **Test expressions first**: Try your SQL expression directly in ClickHouse before using in FreeFilter
2. **Use parentheses**: For complex conditions, add your own parentheses for clarity
3. **Include mode is default**: Most users will want Include mode
4. **Exclude for exceptions**: Use Exclude to filter out unwanted data
5. **Combine with other filters**: FreeFilter works alongside Query, Ad hoc, and other variables

---

## Summary

FreeFilter provides **maximum flexibility** by letting you write raw SQL boolean expressions. Unlike column-value filters, FreeFilter gives you complete control over the SQL logic with Include/Exclude toggle and Active/Inactive state management.

## Overview

- **Variable Type**: Textbox
- **Variable Name**: Must be exactly `FreeFilter` (case-sensitive)
- **Features**: Include/Exclude mode, Active/Inactive toggle, SQL generation

## Setup in Grafana

### 1. Create the Variable

1. Go to **Dashboard Settings** → **Variables**
2. Click **New variable**
3. Configure:
   - **Name**: `FreeFilter` (exactly this name, case-sensitive)
   - **Type**: `Text box`
   - **Label**: `Free Filter` (optional, for display)
   - **Default value**: (leave empty or set a default)

### 2. Use in Panel

The FreeFilter variable will automatically appear in the AlaEla Panel alongside Query and Ad hoc variables with:
- ✅ Include (=) / Exclude (≠) toggle
- ✅ Active / Inactive switch
- ✅ SQL clause generation
- ✅ Real-time updates

## How It Works

### Display

When you type in the FreeFilter textbox in Grafana:
```
Input: "192.168.1.10"
```

The panel shows:
```
[=] FreeFilter: 192.168.1.10 ●
```

Click the filter to toggle:
- **Include mode (=)**: Green indicator
- **Exclude mode (≠)**: Orange indicator
- **Active (green dot)**: Filter applies to SQL
- **Inactive (gray dot)**: Filter bypassed

### SQL Generation

The FreeFilter value is used directly in WHERE clauses:

**Include mode + Active:**
```sql
AND FreeFilter = '192.168.1.10'
```

**Exclude mode + Active:**
```sql
AND FreeFilter != '192.168.1.10'
```

**Inactive:**
```
(no SQL clause generated)
```

## Use Cases

### 1. Manual IP Address Filter
```
Variable Name: FreeFilter
User enters: 10.0.0.100
Generated SQL: AND FreeFilter = '10.0.0.100'
```

### 2. Text Search
```
Variable Name: FreeFilter
User enters: error_message
Generated SQL: AND FreeFilter = 'error_message'
```

### 3. Exclude Pattern
```
Variable Name: FreeFilter
User enters: test_data
Mode: Exclude
Generated SQL: AND FreeFilter != 'test_data'
```

## Important Notes

### ✅ Requirements
- Variable name **must be exactly** `FreeFilter`
- Variable type must be `Text box`
- Works alongside Query, Textbox, and Ad hoc variables

### ❌ Will NOT Work
- Variable name `freefilter` (wrong case)
- Variable name `FreeFilter2` (wrong name)
- Other Textbox variables with different names
- Custom variables (use Query type instead)

### Column Mapping

The SQL uses `FreeFilter` as the column name. To map this to your actual database column:

**Option 1: Use variable substitution in your query:**
```sql
SELECT * FROM table
WHERE 1=1
  ${alaela_sql}
  -- Then manually replace FreeFilter with your column name
```

**Option 2: Create a view/alias:**
```sql
SELECT 
  your_column AS FreeFilter,
  other_columns
FROM your_table
WHERE 1=1
  ${alaela_sql}
```

**Option 3: Use the SQL generator as a template and modify the query manually**

## Example Configuration

### Complete Grafana Dashboard Setup:

1. **Query Variable** (for dropdowns):
   - Name: `source_ip`
   - Type: Query
   - Query: `SELECT DISTINCT source_ip FROM network_events`

2. **FreeFilter Variable** (for free text):
   - Name: `FreeFilter`
   - Type: Text box
   - Default: (empty)

3. **Ad hoc Variable** (for dynamic filters):
   - Name: `adhoc`
   - Type: Ad hoc filters
   - Data source: Your ClickHouse datasource

4. **SQL Variable** (for generated WHERE clauses):
   - Name: `alaela_sql`
   - Type: Text box
   - Hide: Variable

### In Your Query:
```sql
SELECT 
  timestamp,
  source_ip,
  destination_ip,
  cause
FROM network_events
WHERE 1=1
  ${alaela_sql}
ORDER BY timestamp DESC
```

### Panel Display:
```
[=] source_ip: 192.168.1.10 ●
[=] FreeFilter: custom_value ●
[adhoc] network_events.cause = "error" ●
```

### Generated SQL:
```sql
AND source_ip = '192.168.1.10'
AND FreeFilter = 'custom_value'
AND network_events.cause = 'error'
```

## Advanced Usage

### Multiple Values (Comma-Separated)

If you enter multiple values in FreeFilter:
```
Input: "value1,value2,value3"
```

**Include mode:**
```sql
AND FreeFilter IN ('value1', 'value2', 'value3')
```

**Exclude mode:**
```sql
AND FreeFilter NOT IN ('value1', 'value2', 'value3')
```

### Special Characters

The plugin automatically escapes single quotes for SQL injection protection:
```
Input: "O'Brien"
Generated: AND FreeFilter = 'O''Brien'
```

## Troubleshooting

### FreeFilter not appearing in panel?

**Check:**
1. Variable name is exactly `FreeFilter` (case-sensitive)
2. Variable type is `Text box`, not Custom or Constant
3. Panel is configured to show all variables (not filtered in options)

### SQL not generating?

**Check:**
1. Filter is Active (green dot, not gray)
2. FreeFilter has a value entered
3. `alaela_sql` variable exists in dashboard
4. Query uses `${alaela_sql}` to inject clauses

### Wrong column name in SQL?

The SQL uses `FreeFilter` as the column name. You'll need to:
- Rename your database column to `FreeFilter`, OR
- Use a column alias in your SELECT, OR
- Manually modify the generated SQL

---

## Summary

The FreeFilter feature provides a flexible way to add user-defined filters to your ClickHouse queries with full control over include/exclude logic and active state, all while maintaining the same UI/UX as Query-type variables.

