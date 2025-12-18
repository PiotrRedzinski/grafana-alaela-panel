# Using the Automatic SQL Variable

The AlaEla Panel automatically generates SQL WHERE clauses and makes them available as a Grafana variable `${alaela_sql}` that you can reference in any panel query.

---

## Quick Setup (5 minutes)

### Step 1: Create the Variable (One-Time Setup)

1. Open your dashboard
2. Click **⚙️ Settings** (gear icon)
3. Go to **Variables** tab
4. Click **Add variable**
5. Configure:
   - **Name:** `alaela_sql`
   - **Type:** Text box
   - **Hide:** Variable (users don't need to see this)
   - **Default value:** (leave empty or put `-- No active filters`)
6. Click **Apply**
7. Click **Save dashboard**

> **Important:** Must be **Text box** type, NOT Constant! Text box variables automatically sync with URL parameters.

### Step 2: Use in Your Queries

In any ClickHouse panel, structure your query like this:

```sql
SELECT timestamp, source_ip, destination_ip, cause 
FROM "default"."network_events" 
WHERE 1=1 
${alaela_sql}
LIMIT 1000
```

That's it! The `${alaela_sql}` will be automatically replaced with your filter clauses.

---

## Example

### Dashboard Variables Setup:
- `source_ip` (Query variable: SELECT DISTINCT source_ip FROM network_events)
- `destination_ip` (Query variable: SELECT DISTINCT destination_ip FROM network_events)
- `alaela_sql` (Text box variable: auto-populated by AlaEla Panel)

### AlaEla Panel State:
- `source_ip`: Selected `['192.168.1.10', '192.168.1.20']`, **Include** mode, **Active**
- `destination_ip`: Selected `['10.0.0.50']`, **Exclude** mode, **Active**

### Your Query:
```sql
SELECT timestamp, source_ip, destination_ip, bytes_sent
FROM "default"."network_events"
WHERE 1=1
${alaela_sql}
ORDER BY timestamp DESC
LIMIT 1000
```

### Actual Query Executed:
```sql
SELECT timestamp, source_ip, destination_ip, bytes_sent
FROM "default"."network_events"
WHERE 1=1
AND source_ip IN ('192.168.1.10','192.168.1.20')
AND destination_ip != '10.0.0.50'
ORDER BY timestamp DESC
LIMIT 1000
```

---

## Advanced Tips

### Multiple WHERE Conditions

You can combine the auto-generated SQL with your own conditions:

```sql
SELECT *
FROM events
WHERE 1=1
  AND event_type = 'error'  -- Your custom condition
  ${alaela_sql}             -- Auto-generated filter clauses
  AND timestamp > now() - INTERVAL 1 DAY  -- Another custom condition
```

### Using with Complex Queries

```sql
SELECT 
  toStartOfHour(timestamp) as time,
  source_ip,
  count() as event_count
FROM network_events
WHERE 1=1
${alaela_sql}
GROUP BY time, source_ip
HAVING event_count > 100
ORDER BY time DESC
```

### Debugging

To see what SQL is being generated:
1. Look at the SQL Preview section in the AlaEla Panel
2. Or check the DEBUG panel (if enabled)
3. Or inspect the URL parameter `var-alaela_sql`

---

## Why Use This?

✅ **Automatic**: No manual SQL copying needed  
✅ **Real-time**: All panels update instantly when you change filters  
✅ **Clean**: Keep your queries readable and maintainable  
✅ **Flexible**: Works with any ClickHouse query  
✅ **Powerful**: Supports Include/Exclude, Active/Inactive, single/multi-values  

---

## Troubleshooting

### Variable not updating?

Make sure:
1. The `alaela_sql` variable exists and is type **Text box** (NOT Constant!)
2. The AlaEla Panel is present on the dashboard
3. You've saved the dashboard after creating the variable
4. Check the browser console (F12) for `[AlaEla] Updating alaela_sql variable:` logs

### SQL not appearing in query?

Check:
1. Spelling: Must be exactly `${alaela_sql}` (case-sensitive)
2. The filters are **Active** (not inactive/disabled)
3. Variables have values selected

### Still having issues?

Enable the DEBUG panel in `AlaElaPanel.tsx` to see detailed diagnostics.

