import React from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2, RadioButtonGroup, Switch, Icon } from '@grafana/ui';
import { FilterMode, FilterState } from '../types';

interface FilterMenuProps {
  filterState: FilterState;
  onModeChange: (mode: FilterMode) => void;
  onActiveChange: (active: boolean) => void;
  onClose: () => void;
}

const getStyles = (theme: GrafanaTheme2) => ({
  menu: css`
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    min-width: 200px;
    background: ${theme.colors.background.primary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    box-shadow: ${theme.shadows.z3};
    padding: ${theme.spacing(1.5)};
    margin-top: ${theme.spacing(0.5)};
  `,
  section: css`
    margin-bottom: ${theme.spacing(1.5)};
    
    &:last-child {
      margin-bottom: 0;
    }
  `,
  label: css`
    display: block;
    font-size: ${theme.typography.bodySmall.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing(0.75)};
  `,
  modeOption: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.5)};
  `,
  activeRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing(0.5)} 0;
  `,
  activeLabel: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(0.75)};
    font-size: ${theme.typography.body.fontSize};
    color: ${theme.colors.text.primary};
  `,
  divider: css`
    height: 1px;
    background: ${theme.colors.border.weak};
    margin: ${theme.spacing(1)} 0;
  `,
});

export const FilterMenu: React.FC<FilterMenuProps> = ({
  filterState,
  onModeChange,
  onActiveChange,
  onClose,
}) => {
  const styles = useStyles2(getStyles);

  const modeOptions = [
    { label: '= Include', value: 'include' as FilterMode },
    { label: '≠ Exclude', value: 'exclude' as FilterMode },
  ];

  const handleModeChange = (value: FilterMode) => {
    onModeChange(value);
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onActiveChange(e.target.checked);
  };

  // Close on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-filter-menu]')) {
        onClose();
      }
    };
    // Delay to prevent immediate close
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.menu} data-filter-menu onClick={(e) => e.stopPropagation()}>
      <div className={styles.section}>
        <span className={styles.label}>Filter Mode</span>
        <RadioButtonGroup
          options={modeOptions}
          value={filterState.mode}
          onChange={handleModeChange}
          size="sm"
          fullWidth
        />
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.activeRow}>
          <span className={styles.activeLabel}>
            <Icon name={filterState.active ? 'check-circle' : 'circle'} />
            Filter Active
          </span>
          <Switch value={filterState.active} onChange={handleActiveChange} />
        </div>
      </div>
    </div>
  );
};

