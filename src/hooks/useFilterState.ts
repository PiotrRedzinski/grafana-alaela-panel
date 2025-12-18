import { useCallback, useEffect, useState } from 'react';
import { locationService } from '@grafana/runtime';
import { FilterMode, FilterState, FilterStateMap, URL_PARAM_PREFIX } from '../types';

/**
 * Parse filter state from URL parameters
 */
function parseFilterStateFromUrl(): FilterStateMap {
  const params = new URLSearchParams(window.location.search);
  const state: FilterStateMap = {};

  params.forEach((value, key) => {
    // Parse mode parameters: _fm-varname=include|exclude
    if (key.startsWith(URL_PARAM_PREFIX.MODE)) {
      const varName = key.slice(URL_PARAM_PREFIX.MODE.length);
      if (!state[varName]) {
        state[varName] = { name: varName, mode: 'include', active: true };
      }
      state[varName].mode = value === 'exclude' ? 'exclude' : 'include';
    }
    // Parse active parameters: _fa-varname=true|false
    else if (key.startsWith(URL_PARAM_PREFIX.ACTIVE)) {
      const varName = key.slice(URL_PARAM_PREFIX.ACTIVE.length);
      if (!state[varName]) {
        state[varName] = { name: varName, mode: 'include', active: true };
      }
      state[varName].active = value !== 'false';
    }
  });

  return state;
}

/**
 * Update URL with filter state
 */
function updateUrlWithState(filterState: FilterStateMap): void {
  // Build ONLY the filter state parameters we want to update
  const updates: Record<string, string | null> = {};

  Object.values(filterState).forEach((filter) => {
    const modeKey = `${URL_PARAM_PREFIX.MODE}${filter.name}`;
    const activeKey = `${URL_PARAM_PREFIX.ACTIVE}${filter.name}`;

    // Only add to URL if non-default values, otherwise remove
    if (filter.mode !== 'include') {
      updates[modeKey] = filter.mode;
    } else {
      updates[modeKey] = null; // null removes the parameter
    }

    if (!filter.active) {
      updates[activeKey] = 'false';
    } else {
      updates[activeKey] = null; // null removes the parameter
    }
  });

  // Update URL using locationService - this merges with existing params
  locationService.partial(updates, true);
}

/**
 * Hook for managing filter state with URL persistence
 */
export function useFilterState() {
  const [filterState, setFilterState] = useState<FilterStateMap>(() => parseFilterStateFromUrl());

  // Sync with URL on mount and URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      setFilterState(parseFilterStateFromUrl());
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  /**
   * Get filter state for a variable, with defaults if not set
   */
  const getFilterState = useCallback(
    (varName: string): FilterState => {
      return (
        filterState[varName] || {
          name: varName,
          mode: 'include' as FilterMode,
          active: true,
        }
      );
    },
    [filterState]
  );

  /**
   * Toggle filter mode between include and exclude
   */
  const toggleMode = useCallback(
    (varName: string) => {
      setFilterState((prev) => {
        const current = prev[varName] || { name: varName, mode: 'include', active: true };
        const newState = {
          ...prev,
          [varName]: {
            ...current,
            mode: current.mode === 'include' ? 'exclude' : 'include',
          } as FilterState,
        };
        updateUrlWithState(newState);
        return newState;
      });
    },
    []
  );

  /**
   * Toggle filter active state
   */
  const toggleActive = useCallback(
    (varName: string) => {
      setFilterState((prev) => {
        const current = prev[varName] || { name: varName, mode: 'include', active: true };
        const newState = {
          ...prev,
          [varName]: {
            ...current,
            active: !current.active,
          } as FilterState,
        };
        updateUrlWithState(newState);
        return newState;
      });
    },
    []
  );

  /**
   * Set filter mode directly
   */
  const setMode = useCallback(
    (varName: string, mode: FilterMode) => {
      setFilterState((prev) => {
        const current = prev[varName] || { name: varName, mode: 'include', active: true };
        const newState = {
          ...prev,
          [varName]: {
            ...current,
            mode,
          } as FilterState,
        };
        updateUrlWithState(newState);
        return newState;
      });
    },
    []
  );

  /**
   * Set filter active state directly
   */
  const setActive = useCallback(
    (varName: string, active: boolean) => {
      setFilterState((prev) => {
        const current = prev[varName] || { name: varName, mode: 'include', active: true };
        const newState = {
          ...prev,
          [varName]: {
            ...current,
            active,
          } as FilterState,
        };
        updateUrlWithState(newState);
        return newState;
      });
    },
    []
  );

  /**
   * Reset all filters to default state
   */
  const resetAll = useCallback(() => {
    setFilterState({});
    updateUrlWithState({});
  }, []);

  return {
    filterState,
    getFilterState,
    toggleMode,
    toggleActive,
    setMode,
    setActive,
    resetAll,
  };
}

