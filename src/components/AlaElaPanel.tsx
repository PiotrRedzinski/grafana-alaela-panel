import React, { useMemo, useState, useEffect, useRef } from 'react';
import { css, cx } from '@emotion/css';
import { PanelProps, GrafanaTheme2, VariableModel } from '@grafana/data';
import { useStyles2, Alert, ClipboardButton } from '@grafana/ui';
import { getTemplateSrv, locationService } from '@grafana/runtime';
import { AlaElaPanelOptions } from '../types';
import { useFilterState } from '../hooks/useFilterState';
import { FilterItem } from './FilterItem';
import { generateFilterClause } from '../utils/sqlGenerator';

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
      .filter((v) => v && v !== '$__all' && v !== 'All')
      .map((v) => String(v).trim())
      .filter(Boolean);
  }
  
  if (typeof input === 'string') {
    if (input === '$__all' || input === 'All' || input === '') {
      return [];
    }
    if (input.includes(',')) {
      return input
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v && v !== '$__all' && v !== 'All');
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
    console.log(`[ClickHouse Parser] Input: "${trimmed}" → Output:`, values);
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
    
    // Method 1: Template replacement (has multi-values in ClickHouse format!)
    const replaced = templateSrv.replace(`$${variable.name}`);
    if (replaced && replaced !== `$${variable.name}`) {
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
    
    // Method 2: URL parameters (fallback for single values)
    if (extractedValues.length === 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlValue = urlParams.get(`var-${variable.name}`);
      if (urlValue) {
        extractedValues = normalizeToArray(urlValue);
        source = 'URL';
      }
    }
    
    // Method 3: current.value (might be stale)
    if (extractedValues.length === 0 && varAny.current?.value !== undefined) {
      extractedValues = normalizeToArray(varAny.current.value);
      source = 'current';
    }
    
    // Method 4: selected options
    if (extractedValues.length === 0 && varAny.options) {
      const selected = varAny.options
        .filter((opt: any) => opt.selected)
        .map((opt: any) => opt.value);
      if (selected.length > 0) {
        extractedValues = normalizeToArray(selected);
        source = 'options';
      }
    }
    
    console.log(`[${timestamp}] ${variable.name}: ${JSON.stringify(extractedValues)} (from ${source})`);
    values[variable.name] = extractedValues;
  });
  
  return values;
}

export const AlaElaPanel: React.FC<Props> = ({ options, width, height, data, timeRange, eventBus }) => {
  const styles = useStyles2(getStyles);
  const { getFilterState, setMode, setActive } = useFilterState();
  const templateSrv = getTemplateSrv();

  // Get all dashboard variables
  const allVariables = useMemo(() => {
    return templateSrv.getVariables() as VariableModel[];
  }, [templateSrv]);

  // Filter to display variables
  const displayVariables = useMemo(() => {
    if (options.variableNames && options.variableNames.length > 0) {
      const varNames = typeof options.variableNames === 'string'
        ? (options.variableNames as string).split(',').map((n) => n.trim()).filter(Boolean)
        : options.variableNames;
      
      return allVariables.filter((v) => varNames.includes(v.name));
    }
    return allVariables.filter((v) => (v as any).type === 'query');
  }, [allVariables, options.variableNames]);

  // State for variable values
  const [variableValues, setVariableValues] = useState<Record<string, string[]>>({});

  // Update function - always creates new object to force re-render
  const updateValues = useRef(() => {
    const newValues = getVariableValues(displayVariables);
    // Always create new object reference to ensure React detects change
    setVariableValues({ ...newValues });
  });

  // Update the ref when displayVariables changes
  useEffect(() => {
    updateValues.current = () => {
      const newValues = getVariableValues(displayVariables);
      setVariableValues({ ...newValues });
    };
  }, [displayVariables]);

  // Very fast polling - 50ms
  useEffect(() => {
    // Initial update
    updateValues.current();
    
    // Poll every 50ms
    const intervalId = setInterval(() => {
      updateValues.current();
    }, 50);
    
    return () => clearInterval(intervalId);
  }, []);

  // Also update on location/URL changes
  useEffect(() => {
    const unsubscribe = locationService.getHistory().listen(() => {
      setTimeout(() => updateValues.current(), 10);
    });
    return unsubscribe;
  }, []);

  // Update on data/time range changes
  useEffect(() => {
    updateValues.current();
  }, [data.series.length, timeRange]);

  // Generate SQL preview
  const sqlPreview = useMemo(() => {
    if (displayVariables.length === 0) {
      return '-- No variables configured';
    }

    const clauses = displayVariables.map((variable) => {
      const state = getFilterState(variable.name);
      const values = variableValues[variable.name] || [];
      return generateFilterClause(variable.name, values, state);
    });

    const nonEmptyClauses = clauses.filter((c) => c !== '');
    
    if (nonEmptyClauses.length === 0) {
      return '-- No active filters';
    }

    return `-- Generated WHERE clauses:\n${nonEmptyClauses.join('\n')}`;
  }, [displayVariables, getFilterState, variableValues]);

  // Copy-friendly SQL
  const copyableSql = useMemo(() => {
    const clauses = displayVariables.map((variable) => {
      const state = getFilterState(variable.name);
      const values = variableValues[variable.name] || [];
      return generateFilterClause(variable.name, values, state);
    });

    return clauses.filter((c) => c !== '').join('\n');
  }, [displayVariables, getFilterState, variableValues]);

  // Automatically update the alaela_sql variable in URL
  useEffect(() => {
    const sqlClauses = displayVariables.map((variable) => {
      const state = getFilterState(variable.name);
      const values = variableValues[variable.name] || [];
      return generateFilterClause(variable.name, values, state);
    }).filter((c) => c !== '').join('\n');

    // Update URL parameter (which Grafana treats as a variable value)
    // For Textbox/Custom variables, updating the URL param updates the variable
    const currentParams = new URLSearchParams(window.location.search);
    const currentSql = currentParams.get('var-alaela_sql');
    
    // Only update if the SQL actually changed to avoid unnecessary URL updates
    if (currentSql !== sqlClauses) {
      console.log('[AlaEla] Updating alaela_sql variable:', sqlClauses);
      
      // For empty SQL, set to a comment instead of null to keep the variable defined
      const valueToSet = sqlClauses || '-- No active filters';
      
      locationService.partial({
        'var-alaela_sql': valueToSet,
      }, true);
    }
  }, [displayVariables, getFilterState, variableValues]);

  if (displayVariables.length === 0) {
    return (
      <div className={cx(styles.container, options.compact && styles.compact)}>
        <Alert title="No variables found" severity="info">
          Add Query-type variables to your dashboard, or specify variable names in the panel options.
        </Alert>
      </div>
    );
  }

  // Debug info - show what we're reading from Grafana
  const debugInfo = displayVariables.map((v) => {
    const varAny = v as any;
    const urlParams = new URLSearchParams(window.location.search);
    const urlValue = urlParams.get(`var-${v.name}`);
    const templateValue = templateSrv.replace(`$${v.name}`);
    const currentValue = varAny.current?.value;
    const panelValue = variableValues[v.name];
    
    return {
      name: v.name,
      url: urlValue,
      template: templateValue !== `$${v.name}` ? templateValue : 'N/A',
      current: JSON.stringify(currentValue),
      panel: JSON.stringify(panelValue)
    };
  });

  return (
    <div className={cx(styles.container, options.compact && styles.compact)}>
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
        Variables: {displayVariables.length}
      </div>
      
      {/* Detailed debug info */}
      <div style={{ 
        fontSize: '11px', 
        background: '#2a2a2a', 
        padding: '8px', 
        borderRadius: '4px',
        marginBottom: '8px',
        fontFamily: 'monospace',
        maxHeight: '150px',
        overflow: 'auto'
      }}>
        <div style={{ color: '#ffa500', fontWeight: 'bold', marginBottom: '4px' }}>
          Detailed Debug - Last update: {new Date().toLocaleTimeString()}
        </div>
        {debugInfo.map(info => (
          <div key={info.name} style={{ color: '#aaa', marginBottom: '4px' }}>
            <span style={{ color: '#4fc3f7' }}>{info.name}:</span>
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
      
      <div
        className={cx(
          styles.filtersWrapper,
          options.layout === 'horizontal' ? styles.filtersHorizontal : styles.filtersVertical
        )}
      >
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
            />
          );
        })}
      </div>

      {height > 150 && (
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
