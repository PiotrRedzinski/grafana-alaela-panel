import React, { useState, useCallback } from 'react';
import { css, cx } from '@emotion/css';
import { GrafanaTheme2, VariableModel } from '@grafana/data';
import { useStyles2, Tooltip, Icon } from '@grafana/ui';
import { FilterState, FilterMode } from '../types';
import { FilterMenu } from './FilterMenu';

interface FilterItemProps {
  variable: VariableModel;
  filterState: FilterState;
  currentValues: string[];
  showLabel: boolean;
  compact: boolean;
  onModeChange: (mode: FilterMode) => void;
  onActiveChange: (active: boolean) => void;
  isAdHoc?: boolean;
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    position: relative;
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.5)};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;

    &:hover {
      background: ${theme.colors.action.hover};
      border-color: ${theme.colors.border.medium};
    }
  `,
  containerInactive: css`
    opacity: 0.6;
    background: ${theme.colors.background.primary};
  `,
  containerExclude: css`
    border-color: ${theme.colors.warning.border};
    background: ${theme.colors.warning.transparent};
  `,
  modeIndicator: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 4px;
    border-radius: ${theme.shape.radius.default};
    font-size: 11px;
    font-weight: bold;
  `,
  modeInclude: css`
    background: ${theme.colors.success.transparent};
    color: ${theme.colors.success.text};
  `,
  modeExclude: css`
    background: ${theme.colors.warning.transparent};
    color: ${theme.colors.warning.text};
  `,
  label: css`
    font-size: ${theme.typography.body.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.colors.text.primary};
    white-space: nowrap;
  `,
  labelInactive: css`
    text-decoration: line-through;
    color: ${theme.colors.text.disabled};
  `,
  separator: css`
    color: ${theme.colors.text.secondary};
    margin: 0 ${theme.spacing(0.25)};
  `,
  valuesWrapper: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.5)};
    flex-wrap: wrap;
    max-width: 300px;
  `,
  valueTag: css`
    display: inline-flex;
    align-items: center;
    padding: ${theme.spacing(0.25)} ${theme.spacing(0.75)};
    background: ${theme.colors.background.canvas};
    border-radius: ${theme.shape.radius.pill};
    font-size: ${theme.typography.bodySmall.fontSize};
    color: ${theme.colors.text.primary};
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  valueTagExclude: css`
    background: ${theme.colors.warning.transparent};
    color: ${theme.colors.warning.text};
  `,
  valueTagInactive: css`
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.disabled};
  `,
  moreValues: css`
    font-size: ${theme.typography.bodySmall.fontSize};
    color: ${theme.colors.text.secondary};
    font-style: italic;
  `,
  statusDot: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${theme.colors.success.main};
    margin-left: ${theme.spacing(0.5)};
  `,
  statusDotInactive: css`
    background: ${theme.colors.text.disabled};
  `,
  menuIcon: css`
    color: ${theme.colors.text.secondary};
    margin-left: ${theme.spacing(0.5)};
    transition: transform 0.15s ease;
  `,
  menuIconOpen: css`
    transform: rotate(180deg);
  `,
  noValues: css`
    font-size: ${theme.typography.bodySmall.fontSize};
    color: ${theme.colors.text.disabled};
    font-style: italic;
  `,
  compact: css`
    padding: ${theme.spacing(0.25)} ${theme.spacing(0.75)};
    gap: ${theme.spacing(0.25)};
  `,
  compactLabel: css`
    font-size: ${theme.typography.bodySmall.fontSize};
  `,
});

export const FilterItem: React.FC<FilterItemProps> = ({
  variable,
  filterState,
  currentValues,
  showLabel,
  compact,
  onModeChange,
  onActiveChange,
  isAdHoc = false,
}) => {
  const styles = useStyles2(getStyles);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const displayLabel = (variable as any).label || variable.name;
  const hasValues = currentValues.length > 0;
  const maxDisplayValues = compact ? 2 : 3;
  const displayValues = currentValues.slice(0, maxDisplayValues);
  const remainingCount = currentValues.length - maxDisplayValues;

  const getModeTooltip = () => {
    if (isAdHoc) {
      const activeText = filterState.active ? 'Active' : 'Inactive';
      return `Ad hoc filter · ${activeText} · Click to configure`;
    }
    const modeText = filterState.mode === 'include' ? 'Including' : 'Excluding';
    const activeText = filterState.active ? 'Active' : 'Inactive';
    return `${modeText} · ${activeText} · Click to configure`;
  };

  const containerClasses = cx(
    styles.container,
    compact && styles.compact,
    !filterState.active && styles.containerInactive,
    filterState.active && filterState.mode === 'exclude' && styles.containerExclude
  );

  const valueTagClasses = cx(
    styles.valueTag,
    filterState.mode === 'exclude' && filterState.active && styles.valueTagExclude,
    !filterState.active && styles.valueTagInactive
  );

  return (
    <Tooltip content={getModeTooltip()} placement="top">
      <div
        className={containerClasses}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        {/* Mode indicator - hide for ad hoc filters */}
        {!isAdHoc && (
          <span
            className={cx(
              styles.modeIndicator,
              filterState.mode === 'include' ? styles.modeInclude : styles.modeExclude
            )}
          >
            {filterState.mode === 'include' ? '=' : '≠'}
          </span>
        )}

        {/* Label */}
        {showLabel && (
          <>
            <span
              className={cx(
                styles.label,
                compact && styles.compactLabel,
                !filterState.active && styles.labelInactive
              )}
            >
              {displayLabel}
            </span>
            <span className={styles.separator}>:</span>
          </>
        )}

        {/* Values display */}
        <div className={styles.valuesWrapper}>
          {hasValues ? (
            <>
              {displayValues.map((value, index) => (
                <span key={index} className={valueTagClasses}>
                  {value}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className={styles.moreValues}>+{remainingCount} more</span>
              )}
            </>
          ) : (
            <span className={styles.noValues}>No selection</span>
          )}
        </div>

        {/* Status dot */}
        <span
          className={cx(styles.statusDot, !filterState.active && styles.statusDotInactive)}
        />

        {/* Menu arrow */}
        <Icon
          name="angle-down"
          className={cx(styles.menuIcon, menuOpen && styles.menuIconOpen)}
        />

        {/* Filter menu */}
        {menuOpen && (
          <FilterMenu
            filterState={filterState}
            onModeChange={onModeChange}
            onActiveChange={onActiveChange}
            onClose={handleMenuClose}
            isAdHoc={isAdHoc}
          />
        )}
      </div>
    </Tooltip>
  );
};
