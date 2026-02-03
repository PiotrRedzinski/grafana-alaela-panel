define(["@grafana/data","react","@emotion/css","@grafana/ui","@grafana/runtime"],(e,t,a,n,r)=>(()=>{"use strict";var o={89(e){e.exports=a},388(e){e.exports=n},531(e){e.exports=r},781(t){t.exports=e},959(e){e.exports=t}},l={};function s(e){var t=l[e];if(void 0!==t)return t.exports;var a=l[e]={exports:{}};return o[e](a,a.exports,s),a.exports}s.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return s.d(t,{a:t}),t},s.d=(e,t)=>{for(var a in t)s.o(t,a)&&!s.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};s.r(i),s.d(i,{plugin:()=>_});var c=s(781),d=s(959),u=s.n(d),p=s(89),m=s(388),f=s(531);const g="_fm-",h="_fa-",v={include:{single:"=",multi:"IN"},exclude:{single:"!=",multi:"NOT IN"}};function y(){const e=new URLSearchParams(window.location.search),t={};return e.forEach((e,a)=>{if(a.startsWith(g)){const n=a.slice(4);t[n]||(t[n]={name:n,mode:"include",active:!0}),t[n].mode="exclude"===e?"exclude":"include"}else if(a.startsWith(h)){const n=a.slice(4);t[n]||(t[n]={name:n,mode:"include",active:!0}),t[n].active="false"!==e}}),t}function b(e){const t={};Object.values(e).forEach(e=>{const a=`${g}${e.name}`,n=`${h}${e.name}`;"include"!==e.mode?t[a]=e.mode:t[a]=null,e.active?t[n]=null:t[n]="false"}),f.locationService.partial(t,!0)}const x=e=>({menu:p.css`
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    min-width: 200px;
    background: ${e.colors.background.primary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    box-shadow: ${e.shadows.z3};
    padding: ${e.spacing(1.5)};
    margin-top: ${e.spacing(.5)};
  `,section:p.css`
    margin-bottom: ${e.spacing(1.5)};
    
    &:last-child {
      margin-bottom: 0;
    }
  `,label:p.css`
    display: block;
    font-size: ${e.typography.bodySmall.fontSize};
    font-weight: ${e.typography.fontWeightMedium};
    color: ${e.colors.text.secondary};
    margin-bottom: ${e.spacing(.75)};
  `,modeOption:p.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.5)};
  `,activeRow:p.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${e.spacing(.5)} 0;
  `,activeLabel:p.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.75)};
    font-size: ${e.typography.body.fontSize};
    color: ${e.colors.text.primary};
  `,divider:p.css`
    height: 1px;
    background: ${e.colors.border.weak};
    margin: ${e.spacing(1)} 0;
  `}),$=({filterState:e,onModeChange:t,onActiveChange:a,onClose:n,isAdHoc:r=!1})=>{const o=(0,m.useStyles2)(x);return u().useEffect(()=>{const e=e=>{"Escape"===e.key&&n()};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[n]),u().useEffect(()=>{const e=e=>{e.target.closest("[data-filter-menu]")||n()},t=setTimeout(()=>{document.addEventListener("click",e)},0);return()=>{clearTimeout(t),document.removeEventListener("click",e)}},[n]),u().createElement("div",{className:o.menu,"data-filter-menu":!0,onClick:e=>e.stopPropagation()},!r&&u().createElement(u().Fragment,null,u().createElement("div",{className:o.section},u().createElement("span",{className:o.label},"Filter Mode"),u().createElement(m.RadioButtonGroup,{options:[{label:"= Include",value:"include"},{label:"≠ Exclude",value:"exclude"}],value:e.mode,onChange:e=>{t(e)},size:"sm",fullWidth:!0})),u().createElement("div",{className:o.divider})),u().createElement("div",{className:o.section},u().createElement("div",{className:o.activeRow},u().createElement("span",{className:o.activeLabel},u().createElement(m.Icon,{name:e.active?"check-circle":"circle"}),"Filter Active"),u().createElement(m.Switch,{value:e.active,onChange:e=>{a(e.target.checked)}}))))},w=e=>({container:p.css`
    position: relative;
    display: flex;
    align-items: center;
    gap: ${e.spacing(.5)};
    padding: ${e.spacing(.5)} ${e.spacing(1)};
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;

    &:hover {
      background: ${e.colors.action.hover};
      border-color: ${e.colors.border.medium};
    }
  `,containerInactive:p.css`
    opacity: 0.6;
    background: ${e.colors.background.primary};
  `,containerExclude:p.css`
    border-color: ${e.colors.warning.border};
    background: ${e.colors.warning.transparent};
  `,modeIndicator:p.css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 4px;
    border-radius: ${e.shape.radius.default};
    font-size: 11px;
    font-weight: bold;
  `,modeInclude:p.css`
    background: ${e.colors.success.transparent};
    color: ${e.colors.success.text};
  `,modeExclude:p.css`
    background: ${e.colors.warning.transparent};
    color: ${e.colors.warning.text};
  `,label:p.css`
    font-size: ${e.typography.body.fontSize};
    font-weight: ${e.typography.fontWeightMedium};
    color: ${e.colors.text.primary};
    white-space: nowrap;
  `,labelInactive:p.css`
    text-decoration: line-through;
    color: ${e.colors.text.disabled};
  `,separator:p.css`
    color: ${e.colors.text.secondary};
    margin: 0 ${e.spacing(.25)};
  `,valuesWrapper:p.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.5)};
    flex-wrap: wrap;
    max-width: 300px;
  `,valueTag:p.css`
    display: inline-flex;
    align-items: center;
    padding: ${e.spacing(.25)} ${e.spacing(.75)};
    background: ${e.colors.background.canvas};
    border-radius: ${e.shape.radius.pill};
    font-size: ${e.typography.bodySmall.fontSize};
    color: ${e.colors.text.primary};
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,valueTagExclude:p.css`
    background: ${e.colors.warning.transparent};
    color: ${e.colors.warning.text};
  `,valueTagInactive:p.css`
    background: ${e.colors.background.secondary};
    color: ${e.colors.text.disabled};
  `,moreValues:p.css`
    font-size: ${e.typography.bodySmall.fontSize};
    color: ${e.colors.text.secondary};
    font-style: italic;
  `,statusDot:p.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${e.colors.success.main};
    margin-left: ${e.spacing(.5)};
  `,statusDotInactive:p.css`
    background: ${e.colors.text.disabled};
  `,menuIcon:p.css`
    color: ${e.colors.text.secondary};
    margin-left: ${e.spacing(.5)};
    transition: transform 0.15s ease;
  `,menuIconOpen:p.css`
    transform: rotate(180deg);
  `,noValues:p.css`
    font-size: ${e.typography.bodySmall.fontSize};
    color: ${e.colors.text.disabled};
    font-style: italic;
  `,compact:p.css`
    padding: ${e.spacing(.25)} ${e.spacing(.75)};
    gap: ${e.spacing(.25)};
  `,compactLabel:p.css`
    font-size: ${e.typography.bodySmall.fontSize};
  `}),E=({variable:e,filterState:t,currentValues:a,showLabel:n,compact:r,onModeChange:o,onActiveChange:l,isAdHoc:s=!1})=>{const i=(0,m.useStyles2)(w),[c,f]=(0,d.useState)(!1),g=(0,d.useCallback)(()=>{f(e=>!e)},[]),h=(0,d.useCallback)(()=>{f(!1)},[]),v=e.label||e.name,y=a.length>0,b=r?2:3,x=a.slice(0,b),E=a.length-b,k=(0,p.cx)(i.container,r&&i.compact,!t.active&&i.containerInactive,t.active&&"exclude"===t.mode&&i.containerExclude),S=(0,p.cx)(i.valueTag,"exclude"===t.mode&&t.active&&i.valueTagExclude,!t.active&&i.valueTagInactive);return u().createElement(m.Tooltip,{content:s?`Ad hoc filter · ${t.active?"Active":"Inactive"} · Click to configure`:`${"include"===t.mode?"Including":"Excluding"} · ${t.active?"Active":"Inactive"} · Click to configure`,placement:"top"},u().createElement("div",{className:k,onClick:g,role:"button",tabIndex:0,onKeyDown:e=>"Enter"===e.key&&g()},!s&&u().createElement("span",{className:(0,p.cx)(i.modeIndicator,"include"===t.mode?i.modeInclude:i.modeExclude)},"include"===t.mode?"=":"≠"),n&&u().createElement(u().Fragment,null,u().createElement("span",{className:(0,p.cx)(i.label,r&&i.compactLabel,!t.active&&i.labelInactive)},v),u().createElement("span",{className:i.separator},":")),u().createElement("div",{className:i.valuesWrapper},y?u().createElement(u().Fragment,null,x.map((e,t)=>u().createElement("span",{key:t,className:S},e)),E>0&&u().createElement("span",{className:i.moreValues},"+",E," more")):u().createElement("span",{className:i.noValues},"No selection")),u().createElement("span",{className:(0,p.cx)(i.statusDot,!t.active&&i.statusDotInactive)}),u().createElement(m.Icon,{name:"angle-down",className:(0,p.cx)(i.menuIcon,c&&i.menuIconOpen)}),c&&u().createElement($,{filterState:t,onModeChange:o,onActiveChange:l,onClose:h,isAdHoc:s})))};function k(e){return null==e?"NULL":e.replace(/'/g,"''")}function S(e,t,a){if(!a.active)return"";const n=function(e){if(!e)return[];let t=[];if(Array.isArray(e))e.forEach(e=>{if(e&&"string"==typeof e)if(e.includes(",")){const a=e.split(",").map(e=>e.trim()).filter(Boolean);t.push(...a)}else"$__all"!==e&&"All"!==e&&""!==e&&"None"!==e&&t.push(e.trim())});else if("string"==typeof e){if("$__all"===e||"All"===e||""===e)return[];t=e.includes(",")?e.split(",").map(e=>e.trim()).filter(e=>e&&"$__all"!==e&&"All"!==e&&"None"!==e):[e.trim()]}return[...new Set(t)].filter(e=>e&&"$__all"!==e&&"All"!==e&&"None"!==e)}(t);if(0===n.length)return"";const r=v[a.mode],o="RespCause"!==e;if(1===n.length){if(o){const t=k(n[0]);return`AND ${e} ${r.single} '${t}'`}return`AND ${e} ${r.single} ${n[0]}`}if(o){const t=n.map(e=>`'${k(e)}'`).join(", ");return`AND ${e} ${r.multi} (${t})`}{const t=n.join(", ");return`AND ${e} ${r.multi} (${t})`}}function N(e,t){if(!t.active)return"";let a="";if(Array.isArray(e)){if(e.length>1)return"";1===e.length&&(a=e[0].trim())}else if("string"==typeof e){if(e.includes(","))return"";a=e.trim()}return a&&"$__all"!==a&&"All"!==a&&""!==a?"include"===t.mode?`AND (${a})`:`AND NOT (${a})`:""}function A(e){return e&&0!==e.length?e.map(e=>function(e){const t={"=":"=","!=":"!=","<":"<",">":">","<=":"<=",">=":">=","=~":"LIKE","!~":"NOT LIKE"}[a=e.operator]||a;var a;const n=k(e.value);return`AND ${e.key} ${t} '${n}'`}(e)).join("\n  "):""}const F=e=>({container:p.css`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: ${e.spacing(1)};
    gap: ${e.spacing(1)};
  `,filtersWrapper:p.css`
    display: flex;
    flex-wrap: wrap;
    gap: ${e.spacing(1.5)};
  `,filtersHorizontal:p.css`
    flex-direction: row;
    align-items: center;
  `,filtersVertical:p.css`
    flex-direction: column;
    align-items: flex-start;
  `,sqlSection:p.css`
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(.5)};
  `,sqlHeader:p.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${e.spacing(.5)} 0;
  `,sqlLabel:p.css`
    font-size: ${e.typography.bodySmall.fontSize};
    font-weight: ${e.typography.fontWeightMedium};
    color: ${e.colors.text.secondary};
  `,sqlPreview:p.css`
    flex: 1;
    min-height: 60px;
    font-family: ${e.typography.fontFamilyMonospace};
    font-size: ${e.typography.bodySmall.fontSize};
    background: ${e.colors.background.secondary};
    border: 1px solid ${e.colors.border.weak};
    border-radius: ${e.shape.radius.default};
    padding: ${e.spacing(1)};
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-all;
  `,noVariables:p.css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${e.colors.text.secondary};
    font-style: italic;
  `,compact:p.css`
    padding: ${e.spacing(.5)};
    gap: ${e.spacing(.5)};
  `});function L(e){return e?Array.isArray(e)?e.filter(e=>e&&"$__all"!==e&&"All"!==e&&"None"!==e).map(e=>String(e).trim()).filter(Boolean):"string"==typeof e?"$__all"===e||"All"===e||""===e||"None"===e?[]:e.includes(",")?e.split(",").map(e=>e.trim()).filter(e=>e&&"$__all"!==e&&"All"!==e&&"None"!==e):[e.trim()]:[]:[]}function C(e){const t={},a=(0,f.getTemplateSrv)();return(new Date).toISOString().split("T")[1].slice(0,12),e.forEach(e=>{const n=e;let r=[],o="";const l=a.replace(`$${e.name}`);if(l&&l!==`$${e.name}`)if("$__all"===l||"All"===l||""===l||"None"===l){const t=new URLSearchParams(window.location.search).get(`var-${e.name}`);""===t||"$__all"===t||"All"===t||"None"===t||null===t?(r=[],o="template-cleared"):(r=L(t),o="URL-override")}else{const e=function(e){if(!e)return[];const t=e.trim();return t.startsWith("{")&&t.endsWith("}")?t.slice(1,-1).split(",").map(e=>e.trim()).filter(Boolean):[]}(l);e.length>0?(r=e,o="template-clickhouse"):(r=L(l),o="template")}if(0===r.length&&""===o){const t=new URLSearchParams(window.location.search).get(`var-${e.name}`);null!==t&&(""===t||"$__all"===t||"All"===t||"None"===t?(r=[],o="URL-cleared"):(r=L(t),o="URL"))}if(0===r.length&&""===o&&void 0!==n.current?.value){const e=n.current.value;"$__all"===e||"All"===e||""===e||"None"===e?(r=[],o="current-cleared"):(r=L(e),o="current")}if(0===r.length&&""===o&&n.options){const e=n.options.filter(e=>e.selected&&"$__all"!==e.value&&"All"!==e.value&&"None"!==e.value).map(e=>e.value);e.length>0&&(r=L(e),o="options")}t[e.name]=r}),t}const _=new c.PanelPlugin(({options:e,width:t,height:a,data:n,timeRange:r,eventBus:o})=>{const l=(0,m.useStyles2)(F),{getFilterState:s,setMode:i,setActive:c}=function(){const[e,t]=(0,d.useState)(()=>y());(0,d.useEffect)(()=>{const e=()=>{t(y())};return window.addEventListener("popstate",e),()=>window.removeEventListener("popstate",e)},[]);const a=(0,d.useCallback)(t=>e[t]||{name:t,mode:"include",active:!0},[e]),n=(0,d.useCallback)(e=>{t(t=>{const a=t[e]||{name:e,mode:"include",active:!0},n={...t,[e]:{...a,mode:"include"===a.mode?"exclude":"include"}};return b(n),n})},[]),r=(0,d.useCallback)(e=>{t(t=>{const a=t[e]||{name:e,mode:"include",active:!0},n={...t,[e]:{...a,active:!a.active}};return b(n),n})},[]),o=(0,d.useCallback)((e,a)=>{t(t=>{const n=t[e]||{name:e,mode:"include",active:!0},r={...t,[e]:{...n,mode:a}};return b(r),r})},[]),l=(0,d.useCallback)((e,a)=>{t(t=>{const n=t[e]||{name:e,mode:"include",active:!0},r={...t,[e]:{...n,active:a}};return b(r),r})},[]),s=(0,d.useCallback)(()=>{t({}),b({})},[]);return{filterState:e,getFilterState:a,toggleMode:n,toggleActive:r,setMode:o,setActive:l,resetAll:s}}(),g=(0,f.getTemplateSrv)(),[h,v]=(0,d.useState)(!1),[x,$]=(0,d.useState)(new Set),w=(0,d.useMemo)(()=>g.getVariables(),[g]),k=(0,d.useMemo)(()=>w.filter(e=>{if(e.name.startsWith("x_"))return!1;const t=e;return"adhoc"===t.type||"ad-hoc"===t.type||"adHoc"===t.type||"datasource"===t.type}),[w]),L=(0,d.useMemo)(()=>{if(e.variableNames&&e.variableNames.length>0){const t="string"==typeof e.variableNames?e.variableNames.split(",").map(e=>e.trim()).filter(Boolean):e.variableNames;return w.filter(e=>!e.name.startsWith("x_")&&t.includes(e.name))}return w.filter(e=>{if(e.name.startsWith("x_"))return!1;const t=e;return"query"===t.type||"textbox"===t.type&&"FreeFilter"===e.name})},[w,e.variableNames]),[_,z]=(0,d.useState)({}),[I,T]=(0,d.useState)({}),M=(0,d.useRef)(()=>{const e=C(L);z({...e})}),R=(0,d.useRef)(()=>{const e={};g.getVariables().filter(e=>"adhoc"===e.type).forEach(t=>{const a=t,n=a.filters||[],r=a.current?.filters||[],o=a.state?.filters||[];a.options,a.query;const l=n.length>0?n:r.length>0?r:o.length>0?o:[];e[t.name]=l.map(e=>({key:e.key,operator:e.operator,value:e.value}))}),T({...e})});(0,d.useEffect)(()=>{M.current=()=>{const e=C(L);z({...e})}},[L]),(0,d.useEffect)(()=>{R.current=()=>{const e={};g.getVariables().filter(e=>"adhoc"===e.type).forEach(t=>{const a=t,n=a.filters||[],r=a.current?.filters||[],o=a.state?.filters||[],l=n.length>0?n:r.length>0?r:o.length>0?o:[];e[t.name]=l.map(e=>({key:e.key,operator:e.operator,value:e.value}))}),T({...e})}},[g]),(0,d.useEffect)(()=>{M.current(),R.current();const e=setInterval(()=>{M.current(),R.current()},50);return()=>clearInterval(e)},[]),(0,d.useEffect)(()=>f.locationService.getHistory().listen(()=>{setTimeout(()=>{M.current(),R.current()},10)}),[]),(0,d.useEffect)(()=>{M.current(),R.current()},[n.series.length,r]);const V=(0,d.useMemo)(()=>{const e=L.filter(e=>"FreeFilter"!==e.name).map(e=>{const t=s(e.name),a=_[e.name]||[];return S(e.name,a,t)}).filter(e=>""!==e),t=(L.find(e=>"FreeFilter"===e.name)?[N(_.FreeFilter,s("FreeFilter"))]:[]).filter(e=>""!==e),a=[];k.forEach(e=>{if(s(e.name).active){const t=I[e.name]||[];a.push(...t)}});const n=A(a),r=[...e,...t,...n?n.split("\n  ").filter(Boolean):[]];return 0===L.length&&0===k.length?"-- No variables configured":0===r.length?"-- No active filters":`-- Generated WHERE clauses:\n${r.join("\n")}`},[L,k,s,_,I]);(0,d.useMemo)(()=>{const e=L.filter(e=>"FreeFilter"!==e.name).map(e=>{const t=s(e.name),a=_[e.name]||[];return S(e.name,a,t)}).filter(e=>""!==e),t=(L.find(e=>"FreeFilter"===e.name)?[N(_.FreeFilter,s("FreeFilter"))]:[]).filter(e=>""!==e),a=[];k.forEach(e=>{if(s(e.name).active){const t=I[e.name]||[];a.push(...t)}});const n=A(a);return[...e,...t,...n?n.split("\n  ").filter(Boolean):[]].join("\n")},[L,k,s,_,I]),(0,d.useMemo)(()=>g.getVariables().filter(e=>"adhoc"===e.type).map(e=>{const t=e,a=I[e.name]||[],n=Object.keys(t),r=t.filters||[],o=t.current?.filters||[],l=t.state?.filters||[],s=t.current?.value,i=t.current?.text,c=r.length,d=o.length,u=l.length;return{name:e.name,type:"adhoc",filterCount:a.length,filters:a,debugInfo:{allKeys:n.join(", "),hasFilters:c,hasCurrentFilters:d,hasStateFilters:u,currentValue:JSON.stringify(s),currentText:JSON.stringify(i),filtersLocation:c>0?"filters":d>0?"current.filters":u>0?"state.filters":"NONE"}}}),[I,g]),(0,d.useMemo)(()=>L.map(e=>{const t=e,a=new URLSearchParams(window.location.search).get(`var-${e.name}`),n=g.replace(`$${e.name}`),r=t.current?.value,o=_[e.name];return{name:e.name,type:t.type||"unknown",url:a,template:n!==`$${e.name}`?n:"N/A",current:JSON.stringify(r),panel:JSON.stringify(o)}}),[L,_,g]),(0,d.useEffect)(()=>{const e=L.filter(e=>"FreeFilter"!==e.name).map(e=>{const t=s(e.name),a=_[e.name]||[];return S(e.name,a,t)}).filter(e=>""!==e),t=(L.find(e=>"FreeFilter"===e.name)?[N(_.FreeFilter,s("FreeFilter"))]:[]).filter(e=>""!==e),a=[];k.forEach(e=>{if(s(e.name).active){const t=I[e.name]||[];a.push(...t)}});const n=A(a),r=[...e,...t,...n?n.split("\n  ").filter(Boolean):[]].join("\n");if(new URLSearchParams(window.location.search).get("var-alaela_sql")!==r){const e=r||"-- No active filters";f.locationService.partial({"var-alaela_sql":e},!0)}},[L,k,s,_,I]);const W=(0,d.useCallback)(()=>{if(h)x.forEach(e=>{c(e,!0)}),v(!1);else{const e=new Set;L.forEach(t=>{s(t.name).active&&(e.add(t.name),c(t.name,!1))}),k.forEach(t=>{s(t.name).active&&(e.add(t.name),c(t.name,!1))}),$(e),v(!0)}},[h,x,L,k,s,c]);return 0===L.length&&0===k.length?u().createElement("div",{className:(0,p.cx)(l.container,e.compact&&l.compact)},u().createElement(m.Alert,{title:"No variables found",severity:"info"},"Add Query-type variables, Ad hoc filters, or FreeFilter (Textbox) to your dashboard.")):u().createElement("div",{className:(0,p.cx)(l.container,e.compact&&l.compact),style:{position:"relative"}},V&&u().createElement(m.Tooltip,{content:u().createElement("pre",{style:{margin:0,whiteSpace:"pre-wrap",maxWidth:"600px"}},V),placement:"bottom-end"},u().createElement("div",{style:{position:"absolute",top:"8px",right:"8px",padding:"4px 10px",background:"#1f1f1f",border:"1px solid #444",borderRadius:"4px",cursor:"help",fontSize:"11px",fontWeight:"bold",color:"#aaa",zIndex:1e3,transition:"all 0.2s ease"},onMouseEnter:e=>{e.currentTarget.style.background="#2a2a2a",e.currentTarget.style.color="#fff",e.currentTarget.style.borderColor="#666"},onMouseLeave:e=>{e.currentTarget.style.background="#1f1f1f",e.currentTarget.style.color="#aaa",e.currentTarget.style.borderColor="#444"}},"SQL")),!1,u().createElement("div",{className:(0,p.cx)(l.filtersWrapper,"horizontal"===e.layout?l.filtersHorizontal:l.filtersVertical)},u().createElement("div",{style:{position:"relative",display:"flex",alignItems:"center",gap:"8px",padding:e.compact?"4px 12px":"8px 16px",background:h?"#ff4444":"#2a2a2a",border:"1px solid "+(h?"#ff6666":"#444"),borderRadius:"4px",cursor:"pointer",transition:"all 0.15s ease",userSelect:"none"},onClick:W,onMouseEnter:e=>{e.currentTarget.style.background=h?"#ff5555":"#333",e.currentTarget.style.borderColor=h?"#ff7777":"#555"},onMouseLeave:e=>{e.currentTarget.style.background=h?"#ff4444":"#2a2a2a",e.currentTarget.style.borderColor=h?"#ff6666":"#444"}},u().createElement("span",{style:{fontSize:e.compact?"16px":"18px"}},h?"🚫":"⚡"),e.showLabels&&u().createElement("span",{style:{fontSize:e.compact?"12px":"14px",fontWeight:500,color:h?"#fff":"#aaa"}},"BlockAll"),u().createElement("div",{style:{width:e.compact?"32px":"40px",height:e.compact?"16px":"20px",background:h?"#ff6666":"#555",borderRadius:"10px",position:"relative",transition:"background 0.2s ease",marginLeft:"auto"}},u().createElement("div",{style:{position:"absolute",top:"2px",left:h?e.compact?"16px":"22px":"2px",width:e.compact?"12px":"16px",height:e.compact?"12px":"16px",background:"white",borderRadius:"50%",transition:"left 0.2s ease"}})),h&&x.size>0&&u().createElement("span",{style:{background:"#fff",color:"#ff4444",fontSize:e.compact?"10px":"11px",fontWeight:"bold",padding:"2px 6px",borderRadius:"10px",minWidth:e.compact?"16px":"20px",textAlign:"center"}},x.size)),L.map(t=>{const a=s(t.name),n=_[t.name]||[];return u().createElement(E,{key:t.name,variable:t,filterState:a,currentValues:n,showLabel:e.showLabels,compact:e.compact,onModeChange:e=>i(t.name,e),onActiveChange:e=>c(t.name,e),isAdHoc:!1})}),k.map(t=>{const a=s(t.name),n=(I[t.name]||[]).map(e=>`${e.key} ${e.operator} ${e.value}`);return u().createElement(E,{key:t.name,variable:t,filterState:a,currentValues:n,showLabel:e.showLabels,compact:e.compact,onModeChange:e=>i(t.name,e),onActiveChange:e=>c(t.name,e),isAdHoc:!0})})),!1)}).setPanelOptions(e=>{e.addTextInput({path:"variableNames",name:"Variable Names",description:"Comma-separated list of variable names to display. Leave empty to show all Query variables.",defaultValue:"",settings:{placeholder:"server, region, status"}}).addRadio({path:"layout",name:"Layout",description:"How to arrange the variable filters",defaultValue:"horizontal",settings:{options:[{value:"horizontal",label:"Horizontal"},{value:"vertical",label:"Vertical"}]}}).addBooleanSwitch({path:"showLabels",name:"Show Labels",description:"Display variable labels/names",defaultValue:true}).addBooleanSwitch({path:"compact",name:"Compact Mode",description:"Reduce padding and spacing",defaultValue:false})}).setNoPadding();return i})());
//# sourceMappingURL=module.js.map