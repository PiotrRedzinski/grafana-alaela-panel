/**
 * Filter mode: Include (=) or Exclude (!=)
 */
export type FilterMode = 'include' | 'exclude';

/**
 * State of a single variable filter
 */
export interface FilterState {
  /** Variable name */
  name: string;
  /** Whether the filter uses = (include) or != (exclude) */
  mode: FilterMode;
  /** Whether the filter is active (affects query) or inactive (bypassed) */
  active: boolean;
}

/**
 * Map of variable names to their filter states
 */
export type FilterStateMap = Record<string, FilterState>;

/**
 * Panel options stored in dashboard JSON
 */
export interface AlaElaPanelOptions {
  /** Which variables to display (empty = all Query type variables) */
  variableNames: string[];
  /** Layout direction */
  layout: 'horizontal' | 'vertical';
  /** Show variable labels */
  showLabels: boolean;
  /** Compact mode */
  compact: boolean;
}

/**
 * Default panel options
 */
export const defaultOptions: AlaElaPanelOptions = {
  variableNames: [],
  layout: 'horizontal',
  showLabels: true,
  compact: false,
};

/**
 * URL parameter prefixes for filter state
 */
export const URL_PARAM_PREFIX = {
  MODE: '_fm-',      // Filter Mode: _fm-varname=include|exclude
  ACTIVE: '_fa-',    // Filter Active: _fa-varname=true|false
} as const;

/**
 * SQL operators for each filter mode
 */
export const SQL_OPERATORS: Record<FilterMode, { single: string; multi: string }> = {
  include: { single: '=', multi: 'IN' },
  exclude: { single: '!=', multi: 'NOT IN' },
};

