import { FilterState, SQL_OPERATORS } from '../types';

/**
 * Escape a value for safe use in ClickHouse SQL
 * Prevents SQL injection by escaping single quotes
 */
export function escapeClickHouseValue(value: string): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  // Escape single quotes by doubling them (ClickHouse standard)
  return value.replace(/'/g, "''");
}

/**
 * Check if a value represents "all" or empty selection
 */
export function isAllOrEmpty(value: string | string[] | undefined): boolean {
  if (!value) {
    return true;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return true;
    }
    // Filter out special "all" values
    const filtered = value.filter((v) => v && v !== '$__all' && v !== 'All' && v !== '' && v !== 'None');
    return filtered.length === 0;
  }
  return value === '$__all' || value === 'All' || value === '' || value === 'None';
}

/**
 * Normalize value to array format, handling all edge cases:
 * - undefined/null -> []
 * - single string -> [string] or split if comma-separated
 * - array with single comma-separated string -> split into multiple values
 * - array of values -> filter out special values
 */
function normalizeToArray(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }
  
  let values: string[] = [];
  
  if (Array.isArray(value)) {
    // Flatten: if array contains comma-separated strings, split them
    value.forEach((v) => {
      if (v && typeof v === 'string') {
        if (v.includes(',')) {
          // Split comma-separated values within array elements
          const split = v.split(',').map((s) => s.trim()).filter(Boolean);
          values.push(...split);
        } else if (v !== '$__all' && v !== 'All' && v !== '' && v !== 'None') {
          values.push(v.trim());
        }
      }
    });
  } else if (typeof value === 'string') {
    if (value === '$__all' || value === 'All' || value === '') {
      return [];
    }
    if (value.includes(',')) {
      // Split comma-separated string
      values = value.split(',').map((v) => v.trim()).filter((v) => v && v !== '$__all' && v !== 'All' && v !== 'None');
    } else {
      values = [value.trim()];
    }
  }
  
  // Remove duplicates and filter out empty/special values
  return [...new Set(values)].filter((v) => v && v !== '$__all' && v !== 'All' && v !== 'None');
}

/**
 * Generate a SQL WHERE clause fragment for a filter
 * 
 * @param columnName - The column name (should match variable name)
 * @param value - The selected value(s)
 * @param filterState - Current filter state
 * @returns SQL clause string (e.g., "AND server IN ('v1', 'v2')") or empty string
 */
export function generateFilterClause(
  columnName: string,
  value: string | string[] | undefined,
  filterState: FilterState
): string {
  // If filter is not active, return empty string
  if (!filterState.active) {
    return '';
  }

  // Normalize value to array
  const values = normalizeToArray(value);
  
  // If no valid values, no filter needed
  if (values.length === 0) {
    return '';
  }

  const operators = SQL_OPERATORS[filterState.mode];
  
  if (values.length === 1) {
    // Single value - use simple operator (= or !=)
    const escapedValue = escapeClickHouseValue(values[0]);
    return `AND ${columnName} ${operators.single} '${escapedValue}'`;
  }
  
  // Multiple values - use IN or NOT IN
  const escapedValues = values.map((v) => `'${escapeClickHouseValue(v)}'`).join(', ');
  return `AND ${columnName} ${operators.multi} (${escapedValues})`;
}

/**
 * Generate all filter clauses for multiple variables
 * 
 * @param filters - Map of column names to their values and states
 * @returns Combined SQL WHERE clause fragments
 */
export function generateAllFilterClauses(
  filters: Array<{ columnName: string; value: string | string[] | undefined; state: FilterState }>
): string {
  return filters
    .map(({ columnName, value, state }) => generateFilterClause(columnName, value, state))
    .filter((clause) => clause !== '')
    .join('\n  ');
}

/**
 * Format filter state for display
 */
export function formatFilterDisplay(state: FilterState, value: string | string[]): string {
  const prefix = state.mode === 'exclude' ? '≠ ' : '';
  const valueStr = Array.isArray(value) ? value.join(', ') : value;
  return `${prefix}${valueStr}`;
}

/**
 * Generate SQL WHERE clause for FreeFilter (raw SQL expression)
 * FreeFilter is special - it contains a complete SQL condition, not a column value
 * 
 * @param value - The SQL expression entered by user
 * @param filterState - Current filter state
 * @returns SQL clause string (e.g., "AND (expression)") or empty string
 */
export function generateFreeFilterClause(
  value: string | string[] | undefined,
  filterState: FilterState
): string {
  // If filter is not active, return empty string
  if (!filterState.active) {
    return '';
  }

  // Get the value as string
  let sqlExpression = '';
  
  if (Array.isArray(value)) {
    // If multiple values (comma-separated), no SQL generated
    if (value.length > 1) {
      return '';
    }
    // Single value in array
    if (value.length === 1) {
      sqlExpression = value[0].trim();
    }
  } else if (typeof value === 'string') {
    // Check if it contains comma (multiple values)
    if (value.includes(',')) {
      return '';
    }
    sqlExpression = value.trim();
  }
  
  // If no valid value, no filter needed
  if (!sqlExpression || sqlExpression === '$__all' || sqlExpression === 'All' || sqlExpression === '') {
    return '';
  }

  // Generate SQL based on mode
  if (filterState.mode === 'include') {
    return `AND (${sqlExpression})`;
  } else {
    // Exclude mode
    return `AND NOT (${sqlExpression})`;
  }
}

/**
 * Get CSS class for filter state visualization
 */
export function getFilterStateClass(state: FilterState): string {
  const classes: string[] = [];
  
  if (!state.active) {
    classes.push('filter-inactive');
  }
  
  if (state.mode === 'exclude') {
    classes.push('filter-exclude');
  }
  
  return classes.join(' ');
}

/**
 * Map Grafana Ad hoc filter operators to SQL operators
 * Handles special regex operators =~ and !~
 */
function mapAdHocOperatorToSQL(operator: string): string {
  const operatorMap: Record<string, string> = {
    '=': '=',
    '!=': '!=',
    '<': '<',
    '>': '>',
    '<=': '<=',
    '>=': '>=',
    '=~': 'LIKE',
    '!~': 'NOT LIKE',
  };
  
  return operatorMap[operator] || operator;
}

/**
 * Generate SQL WHERE clause for a single Ad hoc filter
 * 
 * @param filter - Ad hoc filter object with key, operator, and value
 * @returns SQL clause string (e.g., "AND column_name != 'value'")
 */
export function generateAdHocFilterClause(filter: { key: string; operator: string; value: string }): string {
  const sqlOperator = mapAdHocOperatorToSQL(filter.operator);
  const escapedValue = escapeClickHouseValue(filter.value);
  
  return `AND ${filter.key} ${sqlOperator} '${escapedValue}'`;
}

/**
 * Generate all SQL WHERE clauses for Ad hoc filters
 * 
 * @param filters - Array of Ad hoc filter objects
 * @returns Combined SQL WHERE clause fragments
 */
export function generateAdHocFilterClauses(
  filters: Array<{ key: string; operator: string; value: string }>
): string {
  if (!filters || filters.length === 0) {
    return '';
  }
  
  return filters
    .map((filter) => generateAdHocFilterClause(filter))
    .join('\n  ');
}
