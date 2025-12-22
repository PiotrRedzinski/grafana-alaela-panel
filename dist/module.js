define(["@grafana/data","react","@emotion/css","@grafana/ui","@grafana/runtime"],(e,t,a,n,o)=>(()=>{"use strict";var l={89(e){e.exports=a},388(e){e.exports=n},531(e){e.exports=o},781(t){t.exports=e},959(e){e.exports=t}},r={};function s(e){var t=r[e];if(void 0!==t)return t.exports;var a=r[e]={exports:{}};return l[e](a,a.exports,s),a.exports}s.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return s.d(t,{a:t}),t},s.d=(e,t)=>{for(var a in t)s.o(t,a)&&!s.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var c={};s.r(c),s.d(c,{plugin:()=>C});var i=s(781),m=s(959),u=s.n(m),d=s(89),p=s(388),g=s(531);const f="_fm-",h="_fa-",y={include:{single:"=",multi:"IN"},exclude:{single:"!=",multi:"NOT IN"}};function v(){const e=new URLSearchParams(window.location.search),t={};return e.forEach((e,a)=>{if(a.startsWith(f)){const n=a.slice(4);t[n]||(t[n]={name:n,mode:"include",active:!0}),t[n].mode="exclude"===e?"exclude":"include"}else if(a.startsWith(h)){const n=a.slice(4);t[n]||(t[n]={name:n,mode:"include",active:!0}),t[n].active="false"!==e}}),t}function b(e){const t={};Object.values(e).forEach(e=>{const a=`${f}${e.name}`,n=`${h}${e.name}`;"include"!==e.mode?t[a]=e.mode:t[a]=null,e.active?t[n]=null:t[n]="false"}),g.locationService.partial(t,!0)}const $=e=>({menu:d.css`
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
  `,section:d.css`
    margin-bottom: ${e.spacing(1.5)};
    
    &:last-child {
      margin-bottom: 0;
    }
  `,label:d.css`
    display: block;
    font-size: ${e.typography.bodySmall.fontSize};
    font-weight: ${e.typography.fontWeightMedium};
    color: ${e.colors.text.secondary};
    margin-bottom: ${e.spacing(.75)};
  `,modeOption:d.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.5)};
  `,activeRow:d.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${e.spacing(.5)} 0;
  `,activeLabel:d.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.75)};
    font-size: ${e.typography.body.fontSize};
    color: ${e.colors.text.primary};
  `,divider:d.css`
    height: 1px;
    background: ${e.colors.border.weak};
    margin: ${e.spacing(1)} 0;
  `}),x=({filterState:e,onModeChange:t,onActiveChange:a,onClose:n,isAdHoc:o=!1})=>{const l=(0,p.useStyles2)($);return u().useEffect(()=>{const e=e=>{"Escape"===e.key&&n()};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[n]),u().useEffect(()=>{const e=e=>{e.target.closest("[data-filter-menu]")||n()},t=setTimeout(()=>{document.addEventListener("click",e)},0);return()=>{clearTimeout(t),document.removeEventListener("click",e)}},[n]),u().createElement("div",{className:l.menu,"data-filter-menu":!0,onClick:e=>e.stopPropagation()},!o&&u().createElement(u().Fragment,null,u().createElement("div",{className:l.section},u().createElement("span",{className:l.label},"Filter Mode"),u().createElement(p.RadioButtonGroup,{options:[{label:"= Include",value:"include"},{label:"≠ Exclude",value:"exclude"}],value:e.mode,onChange:e=>{t(e)},size:"sm",fullWidth:!0})),u().createElement("div",{className:l.divider})),u().createElement("div",{className:l.section},u().createElement("div",{className:l.activeRow},u().createElement("span",{className:l.activeLabel},u().createElement(p.Icon,{name:e.active?"check-circle":"circle"}),"Filter Active"),u().createElement(p.Switch,{value:e.active,onChange:e=>{a(e.target.checked)}}))))},E=e=>({container:d.css`
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
  `,containerInactive:d.css`
    opacity: 0.6;
    background: ${e.colors.background.primary};
  `,containerExclude:d.css`
    border-color: ${e.colors.warning.border};
    background: ${e.colors.warning.transparent};
  `,modeIndicator:d.css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 4px;
    border-radius: ${e.shape.radius.default};
    font-size: 11px;
    font-weight: bold;
  `,modeInclude:d.css`
    background: ${e.colors.success.transparent};
    color: ${e.colors.success.text};
  `,modeExclude:d.css`
    background: ${e.colors.warning.transparent};
    color: ${e.colors.warning.text};
  `,label:d.css`
    font-size: ${e.typography.body.fontSize};
    font-weight: ${e.typography.fontWeightMedium};
    color: ${e.colors.text.primary};
    white-space: nowrap;
  `,labelInactive:d.css`
    text-decoration: line-through;
    color: ${e.colors.text.disabled};
  `,separator:d.css`
    color: ${e.colors.text.secondary};
    margin: 0 ${e.spacing(.25)};
  `,valuesWrapper:d.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.5)};
    flex-wrap: wrap;
    max-width: 300px;
  `,valueTag:d.css`
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
  `,valueTagExclude:d.css`
    background: ${e.colors.warning.transparent};
    color: ${e.colors.warning.text};
  `,valueTagInactive:d.css`
    background: ${e.colors.background.secondary};
    color: ${e.colors.text.disabled};
  `,moreValues:d.css`
    font-size: ${e.typography.bodySmall.fontSize};
    color: ${e.colors.text.secondary};
    font-style: italic;
  `,statusDot:d.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${e.colors.success.main};
    margin-left: ${e.spacing(.5)};
  `,statusDotInactive:d.css`
    background: ${e.colors.text.disabled};
  `,menuIcon:d.css`
    color: ${e.colors.text.secondary};
    margin-left: ${e.spacing(.5)};
    transition: transform 0.15s ease;
  `,menuIconOpen:d.css`
    transform: rotate(180deg);
  `,noValues:d.css`
    font-size: ${e.typography.bodySmall.fontSize};
    color: ${e.colors.text.disabled};
    font-style: italic;
  `,compact:d.css`
    padding: ${e.spacing(.25)} ${e.spacing(.75)};
    gap: ${e.spacing(.25)};
  `,compactLabel:d.css`
    font-size: ${e.typography.bodySmall.fontSize};
  `}),w=({variable:e,filterState:t,currentValues:a,showLabel:n,compact:o,onModeChange:l,onActiveChange:r,isAdHoc:s=!1})=>{const c=(0,p.useStyles2)(E),[i,g]=(0,m.useState)(!1),f=(0,m.useCallback)(()=>{g(e=>!e)},[]),h=(0,m.useCallback)(()=>{g(!1)},[]),y=e.label||e.name,v=a.length>0,b=o?2:3,$=a.slice(0,b),w=a.length-b,S=(0,d.cx)(c.container,o&&c.compact,!t.active&&c.containerInactive,t.active&&"exclude"===t.mode&&c.containerExclude),k=(0,d.cx)(c.valueTag,"exclude"===t.mode&&t.active&&c.valueTagExclude,!t.active&&c.valueTagInactive);return u().createElement(p.Tooltip,{content:s?`Ad hoc filter · ${t.active?"Active":"Inactive"} · Click to configure`:`${"include"===t.mode?"Including":"Excluding"} · ${t.active?"Active":"Inactive"} · Click to configure`,placement:"top"},u().createElement("div",{className:S,onClick:f,role:"button",tabIndex:0,onKeyDown:e=>"Enter"===e.key&&f()},!s&&u().createElement("span",{className:(0,d.cx)(c.modeIndicator,"include"===t.mode?c.modeInclude:c.modeExclude)},"include"===t.mode?"=":"≠"),n&&u().createElement(u().Fragment,null,u().createElement("span",{className:(0,d.cx)(c.label,o&&c.compactLabel,!t.active&&c.labelInactive)},y),u().createElement("span",{className:c.separator},":")),u().createElement("div",{className:c.valuesWrapper},v?u().createElement(u().Fragment,null,$.map((e,t)=>u().createElement("span",{key:t,className:k},e)),w>0&&u().createElement("span",{className:c.moreValues},"+",w," more")):u().createElement("span",{className:c.noValues},"No selection")),u().createElement("span",{className:(0,d.cx)(c.statusDot,!t.active&&c.statusDotInactive)}),u().createElement(p.Icon,{name:"angle-down",className:(0,d.cx)(c.menuIcon,i&&c.menuIconOpen)}),i&&u().createElement(x,{filterState:t,onModeChange:l,onActiveChange:r,onClose:h,isAdHoc:s})))};function S(e){return null==e?"NULL":e.replace(/'/g,"''")}function k(e,t,a){if(!a.active)return"";const n=function(e){if(!e)return[];let t=[];if(Array.isArray(e))e.forEach(e=>{if(e&&"string"==typeof e)if(e.includes(",")){const a=e.split(",").map(e=>e.trim()).filter(Boolean);t.push(...a)}else"$__all"!==e&&"All"!==e&&""!==e&&t.push(e.trim())});else if("string"==typeof e){if("$__all"===e||"All"===e||""===e)return[];t=e.includes(",")?e.split(",").map(e=>e.trim()).filter(e=>e&&"$__all"!==e&&"All"!==e):[e.trim()]}return[...new Set(t)].filter(e=>e&&"$__all"!==e&&"All"!==e)}(t);if(0===n.length)return"";const o=y[a.mode];if(1===n.length){const t=S(n[0]);return`AND ${e} ${o.single} '${t}'`}const l=n.map(e=>`'${S(e)}'`).join(", ");return`AND ${e} ${o.multi} (${l})`}function N(e){return e&&0!==e.length?e.map(e=>function(e){const t={"=":"=","!=":"!=","<":"<",">":">","<=":"<=",">=":">=","=~":"LIKE","!~":"NOT LIKE"}[a=e.operator]||a;var a;const n=S(e.value);return`AND ${e.key} ${t} '${n}'`}(e)).join("\n  "):""}const A=e=>({container:d.css`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: ${e.spacing(1)};
    gap: ${e.spacing(1)};
  `,filtersWrapper:d.css`
    display: flex;
    flex-wrap: wrap;
    gap: ${e.spacing(1.5)};
  `,filtersHorizontal:d.css`
    flex-direction: row;
    align-items: center;
  `,filtersVertical:d.css`
    flex-direction: column;
    align-items: flex-start;
  `,sqlSection:d.css`
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(.5)};
  `,sqlHeader:d.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${e.spacing(.5)} 0;
  `,sqlLabel:d.css`
    font-size: ${e.typography.bodySmall.fontSize};
    font-weight: ${e.typography.fontWeightMedium};
    color: ${e.colors.text.secondary};
  `,sqlPreview:d.css`
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
  `,noVariables:d.css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${e.colors.text.secondary};
    font-style: italic;
  `,compact:d.css`
    padding: ${e.spacing(.5)};
    gap: ${e.spacing(.5)};
  `});function L(e){return e?Array.isArray(e)?e.filter(e=>e&&"$__all"!==e&&"All"!==e).map(e=>String(e).trim()).filter(Boolean):"string"==typeof e?"$__all"===e||"All"===e||""===e?[]:e.includes(",")?e.split(",").map(e=>e.trim()).filter(e=>e&&"$__all"!==e&&"All"!==e):[e.trim()]:[]:[]}function I(e){const t={},a=(0,g.getTemplateSrv)(),n=(new Date).toISOString().split("T")[1].slice(0,12);return e.forEach(e=>{const o=e;let l=[],r="";const s=a.replace(`$${e.name}`);if(s&&s!==`$${e.name}`){const e=function(e){if(!e)return[];const t=e.trim();if(t.startsWith("{")&&t.endsWith("}")){const e=t.slice(1,-1).split(",").map(e=>e.trim()).filter(Boolean);return console.log(`[ClickHouse Parser] Input: "${t}" → Output:`,e),e}return[]}(s);e.length>0?(l=e,r="template-clickhouse"):(l=L(s),r="template")}if(0===l.length){const t=new URLSearchParams(window.location.search).get(`var-${e.name}`);t&&(l=L(t),r="URL")}if(0===l.length&&void 0!==o.current?.value&&(l=L(o.current.value),r="current"),0===l.length&&o.options){const e=o.options.filter(e=>e.selected).map(e=>e.value);e.length>0&&(l=L(e),r="options")}console.log(`[${n}] ${e.name}: ${JSON.stringify(l)} (from ${r})`),t[e.name]=l}),t}const C=new i.PanelPlugin(({options:e,width:t,height:a,data:n,timeRange:o,eventBus:l})=>{const r=(0,p.useStyles2)(A),{getFilterState:s,setMode:c,setActive:i}=function(){const[e,t]=(0,m.useState)(()=>v());(0,m.useEffect)(()=>{const e=()=>{t(v())};return window.addEventListener("popstate",e),()=>window.removeEventListener("popstate",e)},[]);const a=(0,m.useCallback)(t=>e[t]||{name:t,mode:"include",active:!0},[e]),n=(0,m.useCallback)(e=>{t(t=>{const a=t[e]||{name:e,mode:"include",active:!0},n={...t,[e]:{...a,mode:"include"===a.mode?"exclude":"include"}};return b(n),n})},[]),o=(0,m.useCallback)(e=>{t(t=>{const a=t[e]||{name:e,mode:"include",active:!0},n={...t,[e]:{...a,active:!a.active}};return b(n),n})},[]),l=(0,m.useCallback)((e,a)=>{t(t=>{const n=t[e]||{name:e,mode:"include",active:!0},o={...t,[e]:{...n,mode:a}};return b(o),o})},[]),r=(0,m.useCallback)((e,a)=>{t(t=>{const n=t[e]||{name:e,mode:"include",active:!0},o={...t,[e]:{...n,active:a}};return b(o),o})},[]),s=(0,m.useCallback)(()=>{t({}),b({})},[]);return{filterState:e,getFilterState:a,toggleMode:n,toggleActive:o,setMode:l,setActive:r,resetAll:s}}(),f=(0,g.getTemplateSrv)(),h=(0,m.useMemo)(()=>{const e=f.getVariables();return console.log("[ALL VARIABLES]:",e.map(e=>({name:e.name,type:e.type,allKeys:Object.keys(e)}))),e},[f]),y=(0,m.useMemo)(()=>{const e=h.filter(e=>{const t=e,a="adhoc"===t.type||"ad-hoc"===t.type||"adHoc"===t.type||"datasource"===t.type;return a&&console.log("[FOUND AD HOC VARIABLE]:",e.name,"type:",t.type),a});return console.log("[AD HOC VARIABLES COUNT]:",e.length),e},[h]),$=(0,m.useMemo)(()=>{if(e.variableNames&&e.variableNames.length>0){const t="string"==typeof e.variableNames?e.variableNames.split(",").map(e=>e.trim()).filter(Boolean):e.variableNames;return h.filter(e=>t.includes(e.name))}return h.filter(e=>"query"===e.type)},[h,e.variableNames]),[x,E]=(0,m.useState)({}),[S,L]=(0,m.useState)({}),C=(0,m.useRef)(()=>{const e=I($);E({...e})}),z=(0,m.useRef)(()=>{const e={};f.getVariables().filter(e=>"adhoc"===e.type).forEach(t=>{const a=t;console.log(`[Ad hoc Full Dump] ${t.name}:`,a),console.log(`[Ad hoc Keys] ${t.name}:`,Object.keys(a));const n=a.filters||[],o=a.current?.filters||[],l=a.state?.filters||[],r=a.options||[],s=a.query?.filters||[];console.log(`[Ad hoc Locations] ${t.name}:`,{filters:n.length,"filters array":n,"current?.filters":o.length,"state?.filters":l.length,options:r.length,"query?.filters":s.length,current:a.current,state:a.state});const c=n.length>0?n:o.length>0?o:l.length>0?l:[];console.log(`[Ad hoc actualFilters] ${t.name}:`,c),e[t.name]=c.map(e=>({key:e.key,operator:e.operator,value:e.value}))}),L({...e})});(0,m.useEffect)(()=>{C.current=()=>{const e=I($);E({...e})}},[$]),(0,m.useEffect)(()=>{z.current=()=>{const e={};f.getVariables().filter(e=>"adhoc"===e.type).forEach(t=>{const a=t;console.log(`[Ad hoc Full Dump] ${t.name}:`,a),console.log(`[Ad hoc Keys] ${t.name}:`,Object.keys(a));const n=a.filters||[],o=a.current?.filters||[],l=a.state?.filters||[];console.log(`[Ad hoc Locations] ${t.name}:`,{filters:n.length,"filters array":n,"current?.filters":o.length,"state?.filters":l.length,current:a.current,state:a.state});const r=n.length>0?n:o.length>0?o:l.length>0?l:[];console.log(`[Ad hoc actualFilters] ${t.name}:`,r),e[t.name]=r.map(e=>({key:e.key,operator:e.operator,value:e.value}))}),L({...e})}},[f]),(0,m.useEffect)(()=>{C.current(),z.current();const e=setInterval(()=>{C.current(),z.current()},50);return()=>clearInterval(e)},[]),(0,m.useEffect)(()=>g.locationService.getHistory().listen(()=>{setTimeout(()=>{C.current(),z.current()},10)}),[]),(0,m.useEffect)(()=>{C.current(),z.current()},[n.series.length,o]);const O=(0,m.useMemo)(()=>{const e=$.map(e=>{const t=s(e.name),a=x[e.name]||[];return k(e.name,a,t)}).filter(e=>""!==e),t=[];y.forEach(e=>{if(s(e.name).active){const a=S[e.name]||[];t.push(...a)}});const a=N(t),n=[...e,...a?a.split("\n  ").filter(Boolean):[]];return 0===$.length&&0===y.length?"-- No variables configured":0===n.length?"-- No active filters":`-- Generated WHERE clauses:\n${n.join("\n")}`},[$,y,s,x,S]),T=(0,m.useMemo)(()=>{const e=$.map(e=>{const t=s(e.name),a=x[e.name]||[];return k(e.name,a,t)}).filter(e=>""!==e),t=[];y.forEach(e=>{if(s(e.name).active){const a=S[e.name]||[];t.push(...a)}});const a=N(t);return[...e,...a?a.split("\n  ").filter(Boolean):[]].join("\n")},[$,y,s,x,S]),V=(0,m.useMemo)(()=>f.getVariables().filter(e=>"adhoc"===e.type).map(e=>{const t=e,a=S[e.name]||[],n=Object.keys(t),o=t.filters||[],l=t.current?.filters||[],r=t.state?.filters||[],s=t.current?.value,c=t.current?.text,i=o.length,m=l.length,u=r.length;return{name:e.name,type:"adhoc",filterCount:a.length,filters:a,debugInfo:{allKeys:n.join(", "),hasFilters:i,hasCurrentFilters:m,hasStateFilters:u,currentValue:JSON.stringify(s),currentText:JSON.stringify(c),filtersLocation:i>0?"filters":m>0?"current.filters":u>0?"state.filters":"NONE"}}}),[S,f]),B=(0,m.useMemo)(()=>$.map(e=>{const t=e,a=new URLSearchParams(window.location.search).get(`var-${e.name}`),n=f.replace(`$${e.name}`),o=t.current?.value,l=x[e.name];return{name:e.name,type:t.type||"unknown",url:a,template:n!==`$${e.name}`?n:"N/A",current:JSON.stringify(o),panel:JSON.stringify(l)}}),[$,x,f]);return(0,m.useEffect)(()=>{const e=$.map(e=>{const t=s(e.name),a=x[e.name]||[];return k(e.name,a,t)}).filter(e=>""!==e),t=[];y.forEach(e=>{if(s(e.name).active){const a=S[e.name]||[];t.push(...a)}});const a=N(t),n=[...e,...a?a.split("\n  ").filter(Boolean):[]].join("\n");if(new URLSearchParams(window.location.search).get("var-alaela_sql")!==n){console.log("[AlaEla] Updating alaela_sql variable:",n);const e=n||"-- No active filters";g.locationService.partial({"var-alaela_sql":e},!0)}},[$,y,s,x,S]),0===$.length?u().createElement("div",{className:(0,d.cx)(r.container,e.compact&&r.compact)},u().createElement(p.Alert,{title:"No variables found",severity:"info"},"Add Query-type variables to your dashboard, or specify variable names in the panel options.")):u().createElement("div",{className:(0,d.cx)(r.container,e.compact&&r.compact)},u().createElement("div",{style:{fontSize:"16px",background:"red",color:"white",padding:"20px",border:"5px solid yellow",borderRadius:"4px",marginBottom:"8px",fontFamily:"monospace",fontWeight:"bold",textAlign:"center"}},"🔴 DEBUG PANEL v2.0 🔴",u().createElement("br",null),"Time: ",(new Date).toLocaleTimeString(),u().createElement("br",null),"Variables: ",$.length," | Ad hoc Filters: ",y.length),u().createElement("div",{style:{fontSize:"11px",background:"#2a2a2a",padding:"8px",borderRadius:"4px",marginBottom:"8px",fontFamily:"monospace",maxHeight:"200px",overflow:"auto"}},u().createElement("div",{style:{color:"#ffa500",fontWeight:"bold",marginBottom:"4px"}},"Detailed Debug - Last update: ",(new Date).toLocaleTimeString()),B.length>0&&u().createElement("div",{style:{marginBottom:"8px"}},u().createElement("div",{style:{color:"#90caf9",fontWeight:"bold",marginBottom:"4px"}},"Regular Variables (",B.length,"):"),B.map(e=>u().createElement("div",{key:e.name,style:{color:"#aaa",marginBottom:"4px"}},u().createElement("span",{style:{color:"#4fc3f7"}},e.name),u().createElement("span",{style:{color:"#999"}}," (",e.type,")"),":",u().createElement("br",null),"  URL: ",e.url||"null"," | Template: ",e.template," | Current: ",e.current," |",u().createElement("span",{style:{color:e.panel===JSON.stringify(e.url?.split(","))?"#4caf50":"#f44336"}},"Panel: ",e.panel)))),V.length>0&&u().createElement("div",null,u().createElement("div",{style:{color:"#ff9800",fontWeight:"bold",marginBottom:"4px"}},"Ad Hoc Filters (",V.length,"):"),V.map(e=>u().createElement("div",{key:e.name,style:{color:"#aaa",marginBottom:"8px"}},u().createElement("span",{style:{color:"#ffb74d"}},e.name),u().createElement("span",{style:{color:"#999"}}," (adhoc)"),":",u().createElement("br",null),"  Filter count: ",u().createElement("span",{style:{color:e.filterCount>0?"#4caf50":"#f44336"}},e.filterCount),u().createElement("span",{style:{color:"#666",fontSize:"8px",marginLeft:"8px"}},"(polled @ ",(new Date).toLocaleTimeString(),")"),u().createElement("br",null),"  ",u().createElement("span",{style:{color:"#999",fontSize:"9px"}},"Keys: ",e.debugInfo.allKeys),u().createElement("br",null),"  ",u().createElement("span",{style:{color:"#999",fontSize:"9px"}},"Filters location: ",u().createElement("span",{style:{color:"NONE"!==e.debugInfo.filtersLocation?"#4caf50":"#f44336"}},e.debugInfo.filtersLocation)," (",e.debugInfo.hasFilters,"/",e.debugInfo.hasCurrentFilters,"/",e.debugInfo.hasStateFilters,")"),u().createElement("br",null),"  ",u().createElement("span",{style:{color:"#999",fontSize:"9px"}},"current.value: ",e.debugInfo.currentValue),u().createElement("br",null),"  ",u().createElement("span",{style:{color:"#999",fontSize:"9px"}},"current.text: ",e.debugInfo.currentText),u().createElement("br",null),"  ",u().createElement("span",{style:{color:"#ffa500",fontSize:"9px",fontWeight:"bold"}},"⚠️ Check browser console for full object dump!"),e.filters.length>0&&u().createElement("div",{style:{marginLeft:"16px",marginTop:"4px"}},e.filters.map((e,t)=>u().createElement("div",{key:t,style:{color:"#4caf50",fontSize:"10px",marginBottom:"2px"}},"[",t+1,"] ",e.key," ",e.operator,' "',e.value,'"')))))),0===B.length&&0===V.length&&u().createElement("div",{style:{color:"#999",fontStyle:"italic"}},"No variables found")),u().createElement("div",{className:(0,d.cx)(r.filtersWrapper,"horizontal"===e.layout?r.filtersHorizontal:r.filtersVertical)},$.map(t=>{const a=s(t.name),n=x[t.name]||[];return u().createElement(w,{key:t.name,variable:t,filterState:a,currentValues:n,showLabel:e.showLabels,compact:e.compact,onModeChange:e=>c(t.name,e),onActiveChange:e=>i(t.name,e),isAdHoc:!1})}),y.map(t=>{const a=s(t.name),n=(S[t.name]||[]).map(e=>`${e.key} ${e.operator} ${e.value}`);return u().createElement(w,{key:t.name,variable:t,filterState:a,currentValues:n,showLabel:e.showLabels,compact:e.compact,onModeChange:e=>c(t.name,e),onActiveChange:e=>i(t.name,e),isAdHoc:!0})})),a>150&&u().createElement("div",{className:r.sqlSection},u().createElement("div",{className:r.sqlHeader},u().createElement("span",{className:r.sqlLabel},"Generated SQL Clauses"),T&&u().createElement(p.ClipboardButton,{getText:()=>T,size:"sm",variant:"secondary",icon:"copy"},"Copy")),u().createElement("pre",{className:r.sqlPreview},O)))}).setPanelOptions(e=>{e.addTextInput({path:"variableNames",name:"Variable Names",description:"Comma-separated list of variable names to display. Leave empty to show all Query variables.",defaultValue:"",settings:{placeholder:"server, region, status"}}).addRadio({path:"layout",name:"Layout",description:"How to arrange the variable filters",defaultValue:"horizontal",settings:{options:[{value:"horizontal",label:"Horizontal"},{value:"vertical",label:"Vertical"}]}}).addBooleanSwitch({path:"showLabels",name:"Show Labels",description:"Display variable labels/names",defaultValue:true}).addBooleanSwitch({path:"compact",name:"Compact Mode",description:"Reduce padding and spacing",defaultValue:false})}).setNoPadding();return c})());
//# sourceMappingURL=module.js.map