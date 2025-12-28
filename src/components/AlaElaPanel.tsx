import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { css, cx } from '@emotion/css';
import { PanelProps, GrafanaTheme2, VariableModel } from '@grafana/data';
import { useStyles2, Alert, ClipboardButton, Tooltip } from '@grafana/ui';
import { getTemplateSrv, locationService } from '@grafana/runtime';
import { AlaElaPanelOptions } from '../types';
import { useFilterState } from '../hooks/useFilterState';
import { FilterItem } from './FilterItem';
import { generateFilterClause, generateAdHocFilterClauses, generateFreeFilterClause } from '../utils/sqlGenerator';

interface Props extends PanelProps<AlaElaPanelOptions> {}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: ${theme.spacing(1)};
    gap: ${theme.spacing(1)};
  `,
  filtersWrapper: css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(1.5)};
  `,
  filtersHorizontal: css`
    flex-direction: row;
    align-items: center;
  `,
  filtersVertical: css`
    flex-direction: column;
    align-items: flex-start;
  `,
  sqlSection: css`
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(0.5)};
  `,
  sqlHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing(0.5)} 0;
  `,
  sqlLabel: css`
    font-size: ${theme.typography.bodySmall.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.colors.text.secondary};
  `,
  sqlPreview: css`
    flex: 1;
    min-height: 60px;
    font-family: ${theme.typography.fontFamilyMonospace};
    font-size: ${theme.typography.bodySmall.fontSize};
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(1)};
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-all;
  `,
  noVariables: css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${theme.colors.text.secondary};
    font-style: italic;
  `,
  compact: css`
    padding: ${theme.spacing(0.5)};
    gap: ${theme.spacing(0.5)};
  `,
});

// Helper to normalize values to array
function normalizeToArray(input: any): string[] {
  if (!input) {
    return [];
  }
  
  if (Array.isArray(input)) {
    return input
      .filter((v) => v && v !== '$__all' && v !== 'All' && v !== 'None')
      .map((v) => String(v).trim())
      .filter(Boolean);
  }
  
  if (typeof input === 'string') {
    if (input === '$__all' || input === 'All' || input === '' || input === 'None') {
      return [];
    }
    if (input.includes(',')) {
      return input
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v && v !== '$__all' && v !== 'All' && v !== 'None');
    }
    return [input.trim()];
  }
  
  return [];
}

// Parse ClickHouse format {value1,value2,value3} to array
function parseClickHouseFormat(value: string): string[] {
  if (!value) {
    return [];
  }
  
  const trimmed = value.trim();
  
  // Check if it's in ClickHouse array format {val1,val2}
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    const inner = trimmed.slice(1, -1); // Remove { and }
    const values = inner.split(',').map(v => v.trim()).filter(Boolean);
    if (__DEV__) {
      console.log(`[ClickHouse Parser] Input: "${trimmed}" → Output:`, values);
    }
    return values;
  }
  
  return [];
}

// Get variable values from Grafana with detailed logging
function getVariableValues(variables: VariableModel[]): Record<string, string[]> {
  const values: Record<string, string[]> = {};
  const templateSrv = getTemplateSrv();
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 12);

  variables.forEach((variable) => {
    const varAny = variable as any;
    let extractedValues: string[] = [];
    let source = '';
    
    // Method 1: Template replacement (BEST for multi-values - has ClickHouse format!)
    const replaced = templateSrv.replace(`$${variable.name}`);
    if (replaced && replaced !== `$${variable.name}`) {
      // Check if it's "all" or empty first
      if (replaced === '$__all' || replaced === 'All' || replaced === '' || replaced === 'None') {
        // Check URL to confirm it's actually cleared
        const urlParams = new URLSearchParams(window.location.search);
        const urlValue = urlParams.get(`var-${variable.name}`);
        if (urlValue === '' || urlValue === '$__all' || urlValue === 'All' || urlValue === 'None' || urlValue === null) {
          extractedValues = [];
          source = 'template-cleared';
        } else {
          // Template says "all" but URL has value - use URL
          extractedValues = normalizeToArray(urlValue);
          source = 'URL-override';
        }
      } else {
        // Try parsing ClickHouse format {val1,val2}
        const clickhouseValues = parseClickHouseFormat(replaced);
        if (clickhouseValues.length > 0) {
          extractedValues = clickhouseValues;
          source = 'template-clickhouse';
        } else {
          extractedValues = normalizeToArray(replaced);
          source = 'template';
        }
      }
    }
    
    // Method 2: URL parameters (only if template didn't work, or to detect clearing)
    if (extractedValues.length === 0 && source === '') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlValue = urlParams.get(`var-${variable.name}`);
      if (urlValue !== null) {
        if (urlValue === '' || urlValue === '$__all' || urlValue === 'All' || urlValue === 'None') {
          extractedValues = [];
          source = 'URL-cleared';
        } else {
          extractedValues = normalizeToArray(urlValue);
          source = 'URL';
        }
      }
    }
    
    // Method 3: current.value (only as last resort)
    if (extractedValues.length === 0 && source === '' && varAny.current?.value !== undefined) {
      const currentVal = varAny.current.value;
      if (currentVal === '$__all' || currentVal === 'All' || currentVal === '' || currentVal === 'None') {
        extractedValues = [];
        source = 'current-cleared';
      } else {
        extractedValues = normalizeToArray(currentVal);
        source = 'current';
      }
    }
    
    // Method 4: selected options (only if nothing else worked)
    if (extractedValues.length === 0 && source === '' && varAny.options) {
      const selected = varAny.options
        .filter((opt: any) => opt.selected && opt.value !== '$__all' && opt.value !== 'All' && opt.value !== 'None')
        .map((opt: any) => opt.value);
      if (selected.length > 0) {
        extractedValues = normalizeToArray(selected);
        source = 'options';
      }
    }
    
    if (__DEV__) {
      console.log(`[${timestamp}] ${variable.name}: ${JSON.stringify(extractedValues)} (from ${source})`);
    }
    values[variable.name] = extractedValues;
  });
  
  return values;
}

export const AlaElaPanel: React.FC<Props> = ({ options, width, height, data, timeRange, eventBus }) => {
  const styles = useStyles2(getStyles);
  const { getFilterState, setMode, setActive } = useFilterState();
  const templateSrv = getTemplateSrv();

  // BlockAll state - master switch to deactivate all filters
  const [blockAllEnabled, setBlockAllEnabled] = useState(false);
  const [snapshotActiveFilters, setSnapshotActiveFilters] = useState<Set<string>>(new Set());

  // Get all dashboard variables
  const allVariables = useMemo(() => {
    const vars = templateSrv.getVariables() as VariableModel[];
    // Log ALL variables to see what types exist
    if (__DEV__) {
      console.log('[ALL VARIABLES]:', vars.map((v: any) => ({
        name: v.name,
        type: v.type,
        allKeys: Object.keys(v)
      })));
    }
    return vars;
  }, [templateSrv]);

  // Get Ad hoc filter variables separately - try multiple type variations
  const adHocVariables = useMemo(() => {
    const adhocVars = allVariables.filter((v) => {
      const varAny = v as any;
      const isAdhoc = varAny.type === 'adhoc' || 
                      varAny.type === 'ad-hoc' || 
                      varAny.type === 'adHoc' ||
                      varAny.type === 'datasource';
      
      if (isAdhoc && __DEV__) {
        console.log('[FOUND AD HOC VARIABLE]:', v.name, 'type:', varAny.type);
      }
      
      return isAdhoc;
    });
    
    if (__DEV__) {
      console.log('[AD HOC VARIABLES COUNT]:', adhocVars.length);
    }
    return adhocVars;
  }, [allVariables]);

  // Filter to display variables (excluding adhoc for now, we'll handle them separately)
  const displayVariables = useMemo(() => {
    if (options.variableNames && options.variableNames.length > 0) {
      const varNames = typeof options.variableNames === 'string'
        ? (options.variableNames as string).split(',').map((n) => n.trim()).filter(Boolean)
        : options.variableNames;
      
      return allVariables.filter((v) => varNames.includes(v.name));
    }
    // Include Query variables AND Textbox variable named "FreeFilter"
    return allVariables.filter((v) => {
      const varAny = v as any;
      return varAny.type === 'query' || (varAny.type === 'textbox' && v.name === 'FreeFilter');
    });
  }, [allVariables, options.variableNames]);

  // State for variable values
  const [variableValues, setVariableValues] = useState<Record<string, string[]>>({});
  
  // State for ad hoc filter values - store as array of filter objects
  const [adHocFilters, setAdHocFilters] = useState<Record<string, Array<{key: string, operator: string, value: string}>>>({});

  // Update function - always creates new object to force re-render
  const updateValues = useRef(() => {
    const newValues = getVariableValues(displayVariables);
    // Always create new object reference to ensure React detects change
    setVariableValues({ ...newValues });
  });

  // Update function for ad hoc filters - get fresh reference each time
  const updateAdHocValues = useRef(() => {
    const newAdHocValues: Record<string, Array<{key: string, operator: string, value: string}>> = {};
    
    // Get FRESH variable references from template service
    const freshVariables = templateSrv.getVariables() as VariableModel[];
    const freshAdHocVars = freshVariables.filter((v) => (v as any).type === 'adhoc');
    
    freshAdHocVars.forEach((v) => {
      const varAny = v as any;
      
      // Log the ENTIRE variable structure to console
      if (__DEV__) {
        console.log(`[Ad hoc Full Dump] ${v.name}:`, varAny);
        console.log(`[Ad hoc Keys] ${v.name}:`, Object.keys(varAny));
      }
      
      // Check all possible locations
      const filters = varAny.filters || [];
      const currentFilters = varAny.current?.filters || [];
      const stateFilters = varAny.state?.filters || [];
      const optionFilters = varAny.options || [];
      const queryFilters = varAny.query?.filters || [];
      
      if (__DEV__) {
        console.log(`[Ad hoc Locations] ${v.name}:`, {
          'filters': filters.length,
          'filters array': filters,
          'current?.filters': currentFilters.length,
          'state?.filters': stateFilters.length,
          'options': optionFilters.length,
          'query?.filters': queryFilters.length,
          'current': varAny.current,
          'state': varAny.state
        });
      }
      
      // Use whichever has actual data
      const actualFilters = filters.length > 0 ? filters : 
                           currentFilters.length > 0 ? currentFilters : 
                           stateFilters.length > 0 ? stateFilters :
                           [];
      
      if (__DEV__) {
        console.log(`[Ad hoc actualFilters] ${v.name}:`, actualFilters);
      }
      
      newAdHocValues[v.name] = actualFilters.map((f: any) => ({
        key: f.key,
        operator: f.operator,
        value: f.value
      }));
    });
    
    setAdHocFilters({ ...newAdHocValues });
  });

  // Update the ref when displayVariables changes
  useEffect(() => {
    updateValues.current = () => {
      const newValues = getVariableValues(displayVariables);
      setVariableValues({ ...newValues });
    };
  }, [displayVariables]);

  // Update the ref when adHocVariables changes
  useEffect(() => {
    updateAdHocValues.current = () => {
      const newAdHocValues: Record<string, Array<{key: string, operator: string, value: string}>> = {};
      
      // Get FRESH variable references from template service
      const freshVariables = templateSrv.getVariables() as VariableModel[];
      const freshAdHocVars = freshVariables.filter((v) => (v as any).type === 'adhoc');
      
      freshAdHocVars.forEach((v) => {
        const varAny = v as any;
        
        // Log the ENTIRE variable structure to console
        if (__DEV__) {
          console.log(`[Ad hoc Full Dump] ${v.name}:`, varAny);
          console.log(`[Ad hoc Keys] ${v.name}:`, Object.keys(varAny));
        }
        
        const filters = varAny.filters || [];
        const currentFilters = varAny.current?.filters || [];
        const stateFilters = varAny.state?.filters || [];
        
        if (__DEV__) {
          console.log(`[Ad hoc Locations] ${v.name}:`, {
            'filters': filters.length,
            'filters array': filters,
            'current?.filters': currentFilters.length,
            'state?.filters': stateFilters.length,
            'current': varAny.current,
            'state': varAny.state
          });
        }
        
        const actualFilters = filters.length > 0 ? filters : 
                             currentFilters.length > 0 ? currentFilters : 
                             stateFilters.length > 0 ? stateFilters :
                             [];
        
        if (__DEV__) {
          console.log(`[Ad hoc actualFilters] ${v.name}:`, actualFilters);
        }
        
        newAdHocValues[v.name] = actualFilters.map((f: any) => ({
          key: f.key,
          operator: f.operator,
          value: f.value
        }));
      });
      
      setAdHocFilters({ ...newAdHocValues });
    };
  }, [templateSrv]);

  // Very fast polling - 50ms for both regular and ad hoc variables
  useEffect(() => {
    // Initial update
    updateValues.current();
    updateAdHocValues.current();
    
    // Poll every 50ms
    const intervalId = setInterval(() => {
      updateValues.current();
      updateAdHocValues.current();
    }, 50);
    
    return () => clearInterval(intervalId);
  }, []);

  // Also update on location/URL changes
  useEffect(() => {
    const unsubscribe = locationService.getHistory().listen(() => {
      setTimeout(() => {
        updateValues.current();
        updateAdHocValues.current();
      }, 10);
    });
    return unsubscribe;
  }, []);

  // Update on data/time range changes
  useEffect(() => {
    updateValues.current();
    updateAdHocValues.current();
  }, [data.series.length, timeRange]);

  // Generate SQL preview
  const sqlPreview = useMemo(() => {
    // Generate clauses from regular variables (excluding FreeFilter)
    const regularClauses = displayVariables
      .filter((variable) => variable.name !== 'FreeFilter')
      .map((variable) => {
        const state = getFilterState(variable.name);
        const values = variableValues[variable.name] || [];
        return generateFilterClause(variable.name, values, state);
      }).filter((c) => c !== '');

    // Generate FreeFilter clause (if exists)
    const freeFilterVar = displayVariables.find((v) => v.name === 'FreeFilter');
    const freeFilterClauses = freeFilterVar
      ? [generateFreeFilterClause(variableValues['FreeFilter'], getFilterState('FreeFilter'))]
      : [];
    const filteredFreeFilterClauses = freeFilterClauses.filter((c) => c !== '');

    // Generate clauses from ACTIVE Ad hoc filters only
    const allAdHocFilters: Array<{ key: string; operator: string; value: string }> = [];
    adHocVariables.forEach((v) => {
      const state = getFilterState(v.name);
      if (state.active) {
        const filters = adHocFilters[v.name] || [];
        allAdHocFilters.push(...filters);
      }
    });
    
    const adHocClausesStr = generateAdHocFilterClauses(allAdHocFilters);
    const adHocClauses = adHocClausesStr ? adHocClausesStr.split('\n  ').filter(Boolean) : [];
    
    const allClauses = [...regularClauses, ...filteredFreeFilterClauses, ...adHocClauses];
    
    if (displayVariables.length === 0 && adHocVariables.length === 0) {
      return '-- No variables configured';
    }
    
    if (allClauses.length === 0) {
      return '-- No active filters';
    }

    return `-- Generated WHERE clauses:\n${allClauses.join('\n')}`;
  }, [displayVariables, adHocVariables, getFilterState, variableValues, adHocFilters]);

  // Copy-friendly SQL
  const copyableSql = useMemo(() => {
    // Regular variable clauses (excluding FreeFilter)
    const regularClauses = displayVariables
      .filter((variable) => variable.name !== 'FreeFilter')
      .map((variable) => {
        const state = getFilterState(variable.name);
        const values = variableValues[variable.name] || [];
        return generateFilterClause(variable.name, values, state);
      }).filter((c) => c !== '');

    // FreeFilter clause (if exists)
    const freeFilterVar = displayVariables.find((v) => v.name === 'FreeFilter');
    const freeFilterClauses = freeFilterVar
      ? [generateFreeFilterClause(variableValues['FreeFilter'], getFilterState('FreeFilter'))]
      : [];
    const filteredFreeFilterClauses = freeFilterClauses.filter((c) => c !== '');

    // ACTIVE Ad hoc filter clauses only
    const allAdHocFilters: Array<{ key: string; operator: string; value: string }> = [];
    adHocVariables.forEach((v) => {
      const state = getFilterState(v.name);
      if (state.active) {
        const filters = adHocFilters[v.name] || [];
        allAdHocFilters.push(...filters);
      }
    });
    
    const adHocClausesStr = generateAdHocFilterClauses(allAdHocFilters);
    const adHocClauses = adHocClausesStr ? adHocClausesStr.split('\n  ').filter(Boolean) : [];

    return [...regularClauses, ...filteredFreeFilterClauses, ...adHocClauses].join('\n');
  }, [displayVariables, adHocVariables, getFilterState, variableValues, adHocFilters]);

  // Debug info for Ad hoc filters - use state values for real-time updates
  // MUST be before early returns (React Hooks rules)
  const adHocDebugInfo = useMemo(() => {
    // Get fresh variables to show current state
    const freshVariables = templateSrv.getVariables() as VariableModel[];
    const freshAdHocVars = freshVariables.filter((v) => (v as any).type === 'adhoc');
    
    return freshAdHocVars.map((v) => {
      const varAny = v as any;
      const stateFilters = adHocFilters[v.name] || [];
      
      // Get all property keys for debugging
      const allKeys = Object.keys(varAny);
      const filters = varAny.filters || [];
      const currentFilters = varAny.current?.filters || [];
      const variableStateFilters = varAny.state?.filters || [];
      
      // Check current value structure
      const currentValue = varAny.current?.value;
      const currentText = varAny.current?.text;
      
      const hasFilters = filters.length;
      const hasCurrentFilters = currentFilters.length;
      const hasStateFilters = variableStateFilters.length;
      
      return {
        name: v.name,
        type: 'adhoc',
        filterCount: stateFilters.length,
        filters: stateFilters,
        // Debug info
        debugInfo: {
          allKeys: allKeys.join(', '),
          hasFilters,
          hasCurrentFilters,
          hasStateFilters,
          currentValue: JSON.stringify(currentValue),
          currentText: JSON.stringify(currentText),
          filtersLocation: hasFilters > 0 ? 'filters' : 
                          hasCurrentFilters > 0 ? 'current.filters' : 
                          hasStateFilters > 0 ? 'state.filters' : 'NONE'
        }
      };
    });
  }, [adHocFilters, templateSrv]);

  // Debug info - show what we're reading from Grafana
  const debugInfo = useMemo(() => {
    return displayVariables.map((v) => {
      const varAny = v as any;
      const urlParams = new URLSearchParams(window.location.search);
      const urlValue = urlParams.get(`var-${v.name}`);
      const templateValue = templateSrv.replace(`$${v.name}`);
      const currentValue = varAny.current?.value;
      const panelValue = variableValues[v.name];
      
      return {
        name: v.name,
        type: varAny.type || 'unknown',
        url: urlValue,
        template: templateValue !== `$${v.name}` ? templateValue : 'N/A',
        current: JSON.stringify(currentValue),
        panel: JSON.stringify(panelValue)
      };
    });
  }, [displayVariables, variableValues, templateSrv]);

  // Automatically update the alaela_sql variable in URL
  useEffect(() => {
    // Generate regular variable clauses (excluding FreeFilter)
    const regularClauses = displayVariables
      .filter((variable) => variable.name !== 'FreeFilter')
      .map((variable) => {
        const state = getFilterState(variable.name);
        const values = variableValues[variable.name] || [];
        return generateFilterClause(variable.name, values, state);
      }).filter((c) => c !== '');

    // Generate FreeFilter clause (if exists)
    const freeFilterVar = displayVariables.find((v) => v.name === 'FreeFilter');
    const freeFilterClauses = freeFilterVar
      ? [generateFreeFilterClause(variableValues['FreeFilter'], getFilterState('FreeFilter'))]
      : [];
    const filteredFreeFilterClauses = freeFilterClauses.filter((c) => c !== '');

    // Generate ACTIVE Ad hoc filter clauses only
    const allAdHocFilters: Array<{ key: string; operator: string; value: string }> = [];
    adHocVariables.forEach((v) => {
      const state = getFilterState(v.name);
      if (state.active) {
        const filters = adHocFilters[v.name] || [];
        allAdHocFilters.push(...filters);
      }
    });
    
    const adHocClausesStr = generateAdHocFilterClauses(allAdHocFilters);
    const adHocClauses = adHocClausesStr ? adHocClausesStr.split('\n  ').filter(Boolean) : [];

    // Combine all clauses
    const sqlClauses = [...regularClauses, ...filteredFreeFilterClauses, ...adHocClauses].join('\n');

    // Update URL parameter (which Grafana treats as a variable value)
    // For Textbox/Custom variables, updating the URL param updates the variable
    const currentParams = new URLSearchParams(window.location.search);
    const currentSql = currentParams.get('var-alaela_sql');
    
    // Only update if the SQL actually changed to avoid unnecessary URL updates
    if (currentSql !== sqlClauses) {
      if (__DEV__) {
        console.log('[AlaEla] Updating alaela_sql variable:', sqlClauses);
      }
      
      // For empty SQL, set to a comment instead of null to keep the variable defined
      const valueToSet = sqlClauses || '-- No active filters';
      
      locationService.partial({
        'var-alaela_sql': valueToSet,
      }, true);
    }
  }, [displayVariables, adHocVariables, getFilterState, variableValues, adHocFilters]);

  // Handle BlockAll toggle
  const handleBlockAllToggle = useCallback(() => {
    if (!blockAllEnabled) {
      // Turning BlockAll ON - save current active states and deactivate all
      const activeFilters = new Set<string>();
      
      // Check all display variables
      displayVariables.forEach((v) => {
        const state = getFilterState(v.name);
        if (state.active) {
          activeFilters.add(v.name);
          setActive(v.name, false);
        }
      });
      
      // Check all ad hoc variables
      adHocVariables.forEach((v) => {
        const state = getFilterState(v.name);
        if (state.active) {
          activeFilters.add(v.name);
          setActive(v.name, false);
        }
      });
      
      setSnapshotActiveFilters(activeFilters);
      setBlockAllEnabled(true);
      
      if (__DEV__) {
        console.log('[BlockAll] Enabled - deactivated filters:', Array.from(activeFilters));
      }
    } else {
      // Turning BlockAll OFF - restore previously active filters
      snapshotActiveFilters.forEach((varName) => {
        setActive(varName, true);
      });
      
      setBlockAllEnabled(false);
      
      if (__DEV__) {
        console.log('[BlockAll] Disabled - reactivated filters:', Array.from(snapshotActiveFilters));
      }
    }
  }, [blockAllEnabled, snapshotActiveFilters, displayVariables, adHocVariables, getFilterState, setActive]);

  if (displayVariables.length === 0) {
    return (
      <div className={cx(styles.container, options.compact && styles.compact)}>
        <Alert title="No variables found" severity="info">
          Add Query-type variables to your dashboard, or specify variable names in the panel options.
        </Alert>
      </div>
    );
  }

  return (
    <div className={cx(styles.container, options.compact && styles.compact)} style={{ position: 'relative' }}>
      {/* SQL Tooltip - Production only, compact view in top-right corner */}
      {!__DEV__ && sqlPreview && (
        <Tooltip content={<pre style={{ margin: 0, whiteSpace: 'pre-wrap', maxWidth: '600px' }}>{sqlPreview}</pre>} placement="bottom-end">
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '4px 10px',
            background: '#1f1f1f',
            border: '1px solid #444',
            borderRadius: '4px',
            cursor: 'help',
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#aaa',
            zIndex: 1000,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2a2a2a';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = '#666';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1f1f1f';
            e.currentTarget.style.color = '#aaa';
            e.currentTarget.style.borderColor = '#444';
          }}>
            SQL
          </div>
        </Tooltip>
      )}

      {/* DEBUG PANEL - Only shown in development builds */}
      {__DEV__ && (
        <>
          {/* HUGE DEBUG PANEL - VERSION 2.0 - IMPOSSIBLE TO MISS */}
          <div style={{ 
            fontSize: '16px', 
            background: 'red', 
            color: 'white',
            padding: '20px', 
            border: '5px solid yellow',
            borderRadius: '4px',
            marginBottom: '8px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            🔴 DEBUG PANEL v2.0 🔴
            <br/>
            Time: {new Date().toLocaleTimeString()}
            <br/>
            Variables: {displayVariables.length} | Ad hoc Filters: {adHocVariables.length}
          </div>
          
          {/* Detailed debug info */}
          <div style={{ 
            fontSize: '11px', 
            background: '#2a2a2a', 
            padding: '8px', 
            borderRadius: '4px',
            marginBottom: '8px',
            fontFamily: 'monospace',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            <div style={{ color: '#ffa500', fontWeight: 'bold', marginBottom: '4px' }}>
              Detailed Debug - Last update: {new Date().toLocaleTimeString()}
            </div>
            
            {/* Regular variables */}
            {debugInfo.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ color: '#90caf9', fontWeight: 'bold', marginBottom: '4px' }}>
                  Regular Variables ({debugInfo.length}):
                </div>
                {debugInfo.map(info => (
                  <div key={info.name} style={{ color: '#aaa', marginBottom: '4px' }}>
                    <span style={{ color: '#4fc3f7' }}>{info.name}</span> 
                    <span style={{ color: '#999' }}> ({info.type})</span>:
                    <br/>
                    &nbsp;&nbsp;URL: {info.url || 'null'} | 
                    Template: {info.template} | 
                    Current: {info.current} | 
                    <span style={{ color: info.panel === JSON.stringify(info.url?.split(',')) ? '#4caf50' : '#f44336' }}>
                      Panel: {info.panel}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Ad hoc filters */}
            {adHocDebugInfo.length > 0 && (
              <div>
                <div style={{ color: '#ff9800', fontWeight: 'bold', marginBottom: '4px' }}>
                  Ad Hoc Filters ({adHocDebugInfo.length}):
                </div>
                {adHocDebugInfo.map(info => (
                  <div key={info.name} style={{ color: '#aaa', marginBottom: '8px' }}>
                    <span style={{ color: '#ffb74d' }}>{info.name}</span>
                    <span style={{ color: '#999' }}> (adhoc)</span>:
                    <br/>
                    &nbsp;&nbsp;Filter count: <span style={{ color: info.filterCount > 0 ? '#4caf50' : '#f44336' }}>
                      {info.filterCount}
                    </span>
                    <span style={{ color: '#666', fontSize: '8px', marginLeft: '8px' }}>
                      (polled @ {new Date().toLocaleTimeString()})
                    </span>
                    <br/>
                    &nbsp;&nbsp;<span style={{ color: '#999', fontSize: '9px' }}>
                      Keys: {info.debugInfo.allKeys}
                    </span>
                    <br/>
                    &nbsp;&nbsp;<span style={{ color: '#999', fontSize: '9px' }}>
                      Filters location: <span style={{ color: info.debugInfo.filtersLocation !== 'NONE' ? '#4caf50' : '#f44336' }}>
                        {info.debugInfo.filtersLocation}
                      </span> ({info.debugInfo.hasFilters}/{info.debugInfo.hasCurrentFilters}/{info.debugInfo.hasStateFilters})
                    </span>
                    <br/>
                    &nbsp;&nbsp;<span style={{ color: '#999', fontSize: '9px' }}>
                      current.value: {info.debugInfo.currentValue}
                    </span>
                    <br/>
                    &nbsp;&nbsp;<span style={{ color: '#999', fontSize: '9px' }}>
                      current.text: {info.debugInfo.currentText}
                    </span>
                    <br/>
                    &nbsp;&nbsp;<span style={{ color: '#ffa500', fontSize: '9px', fontWeight: 'bold' }}>
                      ⚠️ Check browser console for full object dump!
                    </span>
                    {info.filters.length > 0 && (
                      <div style={{ marginLeft: '16px', marginTop: '4px' }}>
                        {info.filters.map((filter: any, idx: number) => (
                          <div key={idx} style={{ color: '#4caf50', fontSize: '10px', marginBottom: '2px' }}>
                            [{idx + 1}] {filter.key} {filter.operator} &quot;{filter.value}&quot;
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {debugInfo.length === 0 && adHocDebugInfo.length === 0 && (
              <div style={{ color: '#999', fontStyle: 'italic' }}>
                No variables found
              </div>
            )}
          </div>
        </>
      )}
      
      <div
        className={cx(
          styles.filtersWrapper,
          options.layout === 'horizontal' ? styles.filtersHorizontal : styles.filtersVertical
        )}
      >
        {/* BlockAll Master Switch - First item in the list */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: options.compact ? '4px 12px' : '8px 16px',
            background: blockAllEnabled ? '#ff4444' : '#2a2a2a',
            border: `1px solid ${blockAllEnabled ? '#ff6666' : '#444'}`,
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            userSelect: 'none',
          }}
          onClick={handleBlockAllToggle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = blockAllEnabled ? '#ff5555' : '#333';
            e.currentTarget.style.borderColor = blockAllEnabled ? '#ff7777' : '#555';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = blockAllEnabled ? '#ff4444' : '#2a2a2a';
            e.currentTarget.style.borderColor = blockAllEnabled ? '#ff6666' : '#444';
          }}
        >
          {/* Icon/Indicator */}
          <span style={{
            fontSize: options.compact ? '16px' : '18px',
          }}>
            {blockAllEnabled ? '🚫' : '⚡'}
          </span>
          
          {/* Label */}
          {options.showLabels && (
            <span style={{
              fontSize: options.compact ? '12px' : '14px',
              fontWeight: 500,
              color: blockAllEnabled ? '#fff' : '#aaa',
            }}>
              BlockAll
            </span>
          )}
          
          {/* Status indicator */}
          <div style={{
            width: options.compact ? '32px' : '40px',
            height: options.compact ? '16px' : '20px',
            background: blockAllEnabled ? '#ff6666' : '#555',
            borderRadius: '10px',
            position: 'relative',
            transition: 'background 0.2s ease',
            marginLeft: 'auto',
          }}>
            <div style={{
              position: 'absolute',
              top: '2px',
              left: blockAllEnabled ? (options.compact ? '16px' : '22px') : '2px',
              width: options.compact ? '12px' : '16px',
              height: options.compact ? '12px' : '16px',
              background: 'white',
              borderRadius: '50%',
              transition: 'left 0.2s ease',
            }} />
          </div>
          
          {/* Count badge when active */}
          {blockAllEnabled && snapshotActiveFilters.size > 0 && (
            <span style={{
              background: '#fff',
              color: '#ff4444',
              fontSize: options.compact ? '10px' : '11px',
              fontWeight: 'bold',
              padding: '2px 6px',
              borderRadius: '10px',
              minWidth: options.compact ? '16px' : '20px',
              textAlign: 'center',
            }}>
              {snapshotActiveFilters.size}
            </span>
          )}
        </div>

        {/* Regular Query variables */}
        {displayVariables.map((variable) => {
          const state = getFilterState(variable.name);
          const values = variableValues[variable.name] || [];
          return (
            <FilterItem
              key={variable.name}
              variable={variable}
              filterState={state}
              currentValues={values}
              showLabel={options.showLabels}
              compact={options.compact}
              onModeChange={(mode) => setMode(variable.name, mode)}
              onActiveChange={(active) => setActive(variable.name, active)}
              isAdHoc={false}
            />
          );
        })}
        
        {/* Ad hoc filters */}
        {adHocVariables.map((variable) => {
          const state = getFilterState(variable.name);
          const filters = adHocFilters[variable.name] || [];
          // Display as formatted string showing all filters
          const filterStrings = filters.map(f => `${f.key} ${f.operator} ${f.value}`);
          return (
            <FilterItem
              key={variable.name}
              variable={variable}
              filterState={state}
              currentValues={filterStrings}
              showLabel={options.showLabels}
              compact={options.compact}
              onModeChange={(mode) => setMode(variable.name, mode)}
              onActiveChange={(active) => setActive(variable.name, active)}
              isAdHoc={true}
            />
          );
        })}
      </div>

      {/* SQL Preview Section - Only shown in development builds */}
      {__DEV__ && height > 150 && (
        <div className={styles.sqlSection}>
          <div className={styles.sqlHeader}>
            <span className={styles.sqlLabel}>Generated SQL Clauses</span>
            {copyableSql && (
              <ClipboardButton
                getText={() => copyableSql}
                size="sm"
                variant="secondary"
                icon="copy"
              >
                Copy
              </ClipboardButton>
            )}
          </div>
          <pre className={styles.sqlPreview}>{sqlPreview}</pre>
        </div>
      )}
    </div>
  );
};
