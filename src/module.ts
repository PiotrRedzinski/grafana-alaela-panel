import { PanelPlugin } from '@grafana/data';
import { AlaElaPanel } from './components/AlaElaPanel';
import { AlaElaPanelOptions, defaultOptions } from './types';

export const plugin = new PanelPlugin<AlaElaPanelOptions>(AlaElaPanel)
  .setPanelOptions((builder) => {
    builder
      .addTextInput({
        path: 'variableNames',
        name: 'Variable Names',
        description: 'Comma-separated list of variable names to display. Leave empty to show all Query variables.',
        defaultValue: '',
        settings: {
          placeholder: 'server, region, status',
        },
      })
      .addRadio({
        path: 'layout',
        name: 'Layout',
        description: 'How to arrange the variable filters',
        defaultValue: defaultOptions.layout,
        settings: {
          options: [
            { value: 'horizontal', label: 'Horizontal' },
            { value: 'vertical', label: 'Vertical' },
          ],
        },
      })
      .addBooleanSwitch({
        path: 'showLabels',
        name: 'Show Labels',
        description: 'Display variable labels/names',
        defaultValue: defaultOptions.showLabels,
      })
      .addBooleanSwitch({
        path: 'compact',
        name: 'Compact Mode',
        description: 'Reduce padding and spacing',
        defaultValue: defaultOptions.compact,
      });
  })
  .setNoPadding();

