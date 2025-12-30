# Build Instructions

This plugin supports two build modes: **Development** and **Production**.

## Build Modes

### Development Mode
- **Includes**: Debug panel, console logging, verbose diagnostics
- **File size**: ~202 KB (unminified)
- **Use case**: Testing, debugging, development work

### Production Mode  
- **Excludes**: All debug features (completely removed from bundle)
- **File size**: ~19 KB (minified)
- **Use case**: Production deployment, end users

---

## Building

### Development Build

Build with debug features enabled:

```bash
npm run build:dev
```

Or using the watch mode (auto-rebuild on file changes):

```bash
npm run dev
```

**Output**: `dist/` folder with development build

**Features included**:
- ✅ Large red/yellow DEBUG PANEL at top of panel
- ✅ Detailed variable state logging
- ✅ Console logs for:
  - Variable value changes
  - Ad hoc filter detection and parsing
  - SQL generation updates
  - Template service interactions
- ✅ Source maps for debugging

---

### Production Build

Build optimized version without debug features:

```bash
npm run build:prod
```

Or simply:

```bash
npm run build
```

**Output**: `dist/` folder with production build

**Features**:
- ❌ No DEBUG PANEL
- ❌ No console.log statements
- ✅ Minified code
- ✅ Tree-shaking (dead code elimination)
- ✅ ~90% smaller file size

---

## How It Works

The build system uses **webpack.DefinePlugin** to set compile-time constants:

- `__DEV__` - `true` in development, `false` in production
- `process.env.NODE_ENV` - `"development"` or `"production"`

### Code Example

```typescript
// This code exists in source
if (__DEV__) {
  console.log('[Debug] Variable updated:', value);
  // Show debug panel
}

// In production build, webpack removes this entire block
// Final bundle contains NO trace of debug code
```

---

## Deployment

### For Development/Testing:
1. Run `npm run build:dev`
2. Copy `dist/` folder to Grafana plugins directory
3. Restart Grafana
4. You'll see the DEBUG PANEL

### For Production:
1. Run `npm run build:prod`
2. Copy `dist/` folder to Grafana plugins directory
3. Restart Grafana
4. Clean, compact UI without debug features

---

## Build Scripts Summary

| Script | Command | Environment | Output Size |
|--------|---------|-------------|-------------|
| `npm run dev` | Watch mode (auto-rebuild) | Development | ~202 KB |
| `npm run build:dev` | Single build | Development | ~202 KB |
| `npm run build:prod` | Single build | Production | ~19 KB |
| `npm run build` | Alias for `build:prod` | Production | ~19 KB |

---

## Verification

### Check which version is running:

**Development build**: 
- Large red/yellow "DEBUG PANEL v2.0" visible at top
- Console full of `[Debug]`, `[Ad hoc]`, `[AlaEla]` messages

**Production build**:
- No debug panel visible
- Clean console (no plugin debug messages)
- Only filter controls and SQL preview shown

---

## Tips

1. **During development**: Use `npm run dev` for automatic rebuilds
2. **Before committing**: Build both versions to ensure no errors
3. **Before release**: Always use `npm run build:prod`
4. **Testing production build locally**: Use `build:prod`, reload Grafana, verify debug panel is gone

---

## Troubleshooting

### Debug panel still showing after production build?
- Clear browser cache (Ctrl+Shift+R)
- Check file size in `dist/module.js` (should be ~19KB, not 202KB)
- Verify you ran `build:prod`, not `build:dev`

### Console logs still appearing?
- Production build removes ALL `console.log` inside `if (__DEV__)` blocks
- Logs outside these blocks will still appear (by design)

---

## Technical Details

**Environment variables defined by webpack**:
```javascript
// .config/webpack/webpack.config.js
new webpack.DefinePlugin({
  __DEV__: JSON.stringify(isDev),
  'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production'),
})
```

**TypeScript declarations**:
```typescript
// src/types/globals.d.ts
declare const __DEV__: boolean;
```

This approach ensures:
- ✅ Single codebase
- ✅ Type safety
- ✅ Zero runtime overhead (dead code is completely eliminated)
- ✅ Automatic tree-shaking



