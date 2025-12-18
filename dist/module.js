define(["@grafana/data","react","@emotion/css","@grafana/ui","@grafana/runtime"],(e,t,a,n,o)=>(()=>{"use strict";var r={89(e){e.exports=a},388(e){e.exports=n},531(e){e.exports=o},781(t){t.exports=e},959(e){e.exports=t}},l={};function s(e){var t=l[e];if(void 0!==t)return t.exports;var a=l[e]={exports:{}};return r[e](a,a.exports,s),a.exports}s.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return s.d(t,{a:t}),t},s.d=(e,t)=>{for(var a in t)s.o(t,a)&&!s.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var c={};s.r(c),s.d(c,{plugin:()=>C});var i=s(781),d=s(959),m=s.n(d),u=s(89),p=s(388),g=s(531);const f="_fm-",v="_fa-",b={include:{single:"=",multi:"IN"},exclude:{single:"!=",multi:"NOT IN"}};function y(){const e=new URLSearchParams(window.location.search),t={};return e.forEach((e,a)=>{if(a.startsWith(f)){const n=a.slice(4);t[n]||(t[n]={name:n,mode:"include",active:!0}),t[n].mode="exclude"===e?"exclude":"include"}else if(a.startsWith(v)){const n=a.slice(4);t[n]||(t[n]={name:n,mode:"include",active:!0}),t[n].active="false"!==e}}),t}function h(e){const t={};Object.values(e).forEach(e=>{const a=`${f}${e.name}`,n=`${v}${e.name}`;"include"!==e.mode?t[a]=e.mode:t[a]=null,e.active?t[n]=null:t[n]="false"}),g.locationService.partial(t,!0)}const $=e=>({menu:u.css`
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
  `,section:u.css`
    margin-bottom: ${e.spacing(1.5)};
    
    &:last-child {
      margin-bottom: 0;
    }
  `,label:u.css`
    display: block;
    font-size: ${e.typography.bodySmall.fontSize};
    font-weight: ${e.typography.fontWeightMedium};
    color: ${e.colors.text.secondary};
    margin-bottom: ${e.spacing(.75)};
  `,modeOption:u.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.5)};
  `,activeRow:u.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${e.spacing(.5)} 0;
  `,activeLabel:u.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.75)};
    font-size: ${e.typography.body.fontSize};
    color: ${e.colors.text.primary};
  `,divider:u.css`
    height: 1px;
    background: ${e.colors.border.weak};
    margin: ${e.spacing(1)} 0;
  `}),x=({filterState:e,onModeChange:t,onActiveChange:a,onClose:n})=>{const o=(0,p.useStyles2)($);return m().useEffect(()=>{const e=e=>{"Escape"===e.key&&n()};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},[n]),m().useEffect(()=>{const e=e=>{e.target.closest("[data-filter-menu]")||n()},t=setTimeout(()=>{document.addEventListener("click",e)},0);return()=>{clearTimeout(t),document.removeEventListener("click",e)}},[n]),m().createElement("div",{className:o.menu,"data-filter-menu":!0,onClick:e=>e.stopPropagation()},m().createElement("div",{className:o.section},m().createElement("span",{className:o.label},"Filter Mode"),m().createElement(p.RadioButtonGroup,{options:[{label:"= Include",value:"include"},{label:"≠ Exclude",value:"exclude"}],value:e.mode,onChange:e=>{t(e)},size:"sm",fullWidth:!0})),m().createElement("div",{className:o.divider}),m().createElement("div",{className:o.section},m().createElement("div",{className:o.activeRow},m().createElement("span",{className:o.activeLabel},m().createElement(p.Icon,{name:e.active?"check-circle":"circle"}),"Filter Active"),m().createElement(p.Switch,{value:e.active,onChange:e=>{a(e.target.checked)}}))))},w=e=>({container:u.css`
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
  `,containerInactive:u.css`
    opacity: 0.6;
    background: ${e.colors.background.primary};
  `,containerExclude:u.css`
    border-color: ${e.colors.warning.border};
    background: ${e.colors.warning.transparent};
  `,modeIndicator:u.css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 4px;
    border-radius: ${e.shape.radius.default};
    font-size: 11px;
    font-weight: bold;
  `,modeInclude:u.css`
    background: ${e.colors.success.transparent};
    color: ${e.colors.success.text};
  `,modeExclude:u.css`
    background: ${e.colors.warning.transparent};
    color: ${e.colors.warning.text};
  `,label:u.css`
    font-size: ${e.typography.body.fontSize};
    font-weight: ${e.typography.fontWeightMedium};
    color: ${e.colors.text.primary};
    white-space: nowrap;
  `,labelInactive:u.css`
    text-decoration: line-through;
    color: ${e.colors.text.disabled};
  `,separator:u.css`
    color: ${e.colors.text.secondary};
    margin: 0 ${e.spacing(.25)};
  `,valuesWrapper:u.css`
    display: flex;
    align-items: center;
    gap: ${e.spacing(.5)};
    flex-wrap: wrap;
    max-width: 300px;
  `,valueTag:u.css`
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
  `,valueTagExclude:u.css`
    background: ${e.colors.warning.transparent};
    color: ${e.colors.warning.text};
  `,valueTagInactive:u.css`
    background: ${e.colors.background.secondary};
    color: ${e.colors.text.disabled};
  `,moreValues:u.css`
    font-size: ${e.typography.bodySmall.fontSize};
    color: ${e.colors.text.secondary};
    font-style: italic;
  `,statusDot:u.css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${e.colors.success.main};
    margin-left: ${e.spacing(.5)};
  `,statusDotInactive:u.css`
    background: ${e.colors.text.disabled};
  `,menuIcon:u.css`
    color: ${e.colors.text.secondary};
    margin-left: ${e.spacing(.5)};
    transition: transform 0.15s ease;
  `,menuIconOpen:u.css`
    transform: rotate(180deg);
  `,noValues:u.css`
    font-size: ${e.typography.bodySmall.fontSize};
    color: ${e.colors.text.disabled};
    font-style: italic;
  `,compact:u.css`
    padding: ${e.spacing(.25)} ${e.spacing(.75)};
    gap: ${e.spacing(.25)};
  `,compactLabel:u.css`
    font-size: ${e.typography.bodySmall.fontSize};
  `}),E=({variable:e,filterState:t,currentValues:a,showLabel:n,compact:o,onModeChange:r,onActiveChange:l})=>{const s=(0,p.useStyles2)(w),[c,i]=(0,d.useState)(!1),g=(0,d.useCallback)(()=>{i(e=>!e)},[]),f=(0,d.useCallback)(()=>{i(!1)},[]),v=e.label||e.name,b=a.length>0,y=o?2:3,h=a.slice(0,y),$=a.length-y,E=(0,u.cx)(s.container,o&&s.compact,!t.active&&s.containerInactive,t.active&&"exclude"===t.mode&&s.containerExclude),S=(0,u.cx)(s.valueTag,"exclude"===t.mode&&t.active&&s.valueTagExclude,!t.active&&s.valueTagInactive);return m().createElement(p.Tooltip,{content:`${"include"===t.mode?"Including":"Excluding"} · ${t.active?"Active":"Inactive"} · Click to configure`,placement:"top"},m().createElement("div",{className:E,onClick:g,role:"button",tabIndex:0,onKeyDown:e=>"Enter"===e.key&&g()},m().createElement("span",{className:(0,u.cx)(s.modeIndicator,"include"===t.mode?s.modeInclude:s.modeExclude)},"include"===t.mode?"=":"≠"),n&&m().createElement(m().Fragment,null,m().createElement("span",{className:(0,u.cx)(s.label,o&&s.compactLabel,!t.active&&s.labelInactive)},v),m().createElement("span",{className:s.separator},":")),m().createElement("div",{className:s.valuesWrapper},b?m().createElement(m().Fragment,null,h.map((e,t)=>m().createElement("span",{key:t,className:S},e)),$>0&&m().createElement("span",{className:s.moreValues},"+",$," more")):m().createElement("span",{className:s.noValues},"No selection")),m().createElement("span",{className:(0,u.cx)(s.statusDot,!t.active&&s.statusDotInactive)}),m().createElement(p.Icon,{name:"angle-down",className:(0,u.cx)(s.menuIcon,c&&s.menuIconOpen)}),c&&m().createElement(x,{filterState:t,onModeChange:r,onActiveChange:l,onClose:f})))};function S(e){return null==e?"NULL":e.replace(/'/g,"''")}function k(e,t,a){if(!a.active)return"";const n=function(e){if(!e)return[];let t=[];if(Array.isArray(e))e.forEach(e=>{if(e&&"string"==typeof e)if(e.includes(",")){const a=e.split(",").map(e=>e.trim()).filter(Boolean);t.push(...a)}else"$__all"!==e&&"All"!==e&&""!==e&&t.push(e.trim())});else if("string"==typeof e){if("$__all"===e||"All"===e||""===e)return[];t=e.includes(",")?e.split(",").map(e=>e.trim()).filter(e=>e&&"$__all"!==e&&"All"!==e):[e.trim()]}return[...new Set(t)].filter(e=>e&&"$__all"!==e&&"All"!==e)}(t);if(0===n.length)return"";const o=b[a.mode];if(1===n.length){const t=S(n[0]);return`AND ${e} ${o.single} '${t}'`}const r=n.map(e=>`'${S(e)}'`).join(", ");return`AND ${e} ${o.multi} (${r})`}const N=e=>({container:u.css`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: ${e.spacing(1)};
    gap: ${e.spacing(1)};
  `,filtersWrapper:u.css`
    display: flex;
    flex-wrap: wrap;
    gap: ${e.spacing(1.5)};
  `,filtersHorizontal:u.css`
    flex-direction: row;
    align-items: center;
  `,filtersVertical:u.css`
    flex-direction: column;
    align-items: flex-start;
  `,sqlSection:u.css`
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: ${e.spacing(.5)};
  `,sqlHeader:u.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${e.spacing(.5)} 0;
  `,sqlLabel:u.css`
    font-size: ${e.typography.bodySmall.fontSize};
    font-weight: ${e.typography.fontWeightMedium};
    color: ${e.colors.text.secondary};
  `,sqlPreview:u.css`
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
  `,noVariables:u.css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${e.colors.text.secondary};
    font-style: italic;
  `,compact:u.css`
    padding: ${e.spacing(.5)};
    gap: ${e.spacing(.5)};
  `});function L(e){return e?Array.isArray(e)?e.filter(e=>e&&"$__all"!==e&&"All"!==e).map(e=>String(e).trim()).filter(Boolean):"string"==typeof e?"$__all"===e||"All"===e||""===e?[]:e.includes(",")?e.split(",").map(e=>e.trim()).filter(e=>e&&"$__all"!==e&&"All"!==e):[e.trim()]:[]:[]}function z(e){const t={},a=(0,g.getTemplateSrv)(),n=(new Date).toISOString().split("T")[1].slice(0,12);return e.forEach(e=>{const o=e;let r=[],l="";const s=a.replace(`$${e.name}`);if(s&&s!==`$${e.name}`){const e=function(e){if(!e)return[];const t=e.trim();if(t.startsWith("{")&&t.endsWith("}")){const e=t.slice(1,-1).split(",").map(e=>e.trim()).filter(Boolean);return console.log(`[ClickHouse Parser] Input: "${t}" → Output:`,e),e}return[]}(s);e.length>0?(r=e,l="template-clickhouse"):(r=L(s),l="template")}if(0===r.length){const t=new URLSearchParams(window.location.search).get(`var-${e.name}`);t&&(r=L(t),l="URL")}if(0===r.length&&void 0!==o.current?.value&&(r=L(o.current.value),l="current"),0===r.length&&o.options){const e=o.options.filter(e=>e.selected).map(e=>e.value);e.length>0&&(r=L(e),l="options")}console.log(`[${n}] ${e.name}: ${JSON.stringify(r)} (from ${l})`),t[e.name]=r}),t}const C=new i.PanelPlugin(({options:e,width:t,height:a,data:n,timeRange:o,eventBus:r})=>{const l=(0,p.useStyles2)(N),{getFilterState:s,setMode:c,setActive:i}=function(){const[e,t]=(0,d.useState)(()=>y());(0,d.useEffect)(()=>{const e=()=>{t(y())};return window.addEventListener("popstate",e),()=>window.removeEventListener("popstate",e)},[]);const a=(0,d.useCallback)(t=>e[t]||{name:t,mode:"include",active:!0},[e]),n=(0,d.useCallback)(e=>{t(t=>{const a=t[e]||{name:e,mode:"include",active:!0},n={...t,[e]:{...a,mode:"include"===a.mode?"exclude":"include"}};return h(n),n})},[]),o=(0,d.useCallback)(e=>{t(t=>{const a=t[e]||{name:e,mode:"include",active:!0},n={...t,[e]:{...a,active:!a.active}};return h(n),n})},[]),r=(0,d.useCallback)((e,a)=>{t(t=>{const n=t[e]||{name:e,mode:"include",active:!0},o={...t,[e]:{...n,mode:a}};return h(o),o})},[]),l=(0,d.useCallback)((e,a)=>{t(t=>{const n=t[e]||{name:e,mode:"include",active:!0},o={...t,[e]:{...n,active:a}};return h(o),o})},[]),s=(0,d.useCallback)(()=>{t({}),h({})},[]);return{filterState:e,getFilterState:a,toggleMode:n,toggleActive:o,setMode:r,setActive:l,resetAll:s}}(),f=(0,g.getTemplateSrv)(),v=(0,d.useMemo)(()=>f.getVariables(),[f]),b=(0,d.useMemo)(()=>{if(e.variableNames&&e.variableNames.length>0){const t="string"==typeof e.variableNames?e.variableNames.split(",").map(e=>e.trim()).filter(Boolean):e.variableNames;return v.filter(e=>t.includes(e.name))}return v.filter(e=>"query"===e.type)},[v,e.variableNames]),[$,x]=(0,d.useState)({}),w=(0,d.useRef)(()=>{const e=z(b);x({...e})});(0,d.useEffect)(()=>{w.current=()=>{const e=z(b);x({...e})}},[b]),(0,d.useEffect)(()=>{w.current();const e=setInterval(()=>{w.current()},50);return()=>clearInterval(e)},[]),(0,d.useEffect)(()=>g.locationService.getHistory().listen(()=>{setTimeout(()=>w.current(),10)}),[]),(0,d.useEffect)(()=>{w.current()},[n.series.length,o]);const S=(0,d.useMemo)(()=>{if(0===b.length)return"-- No variables configured";const e=b.map(e=>{const t=s(e.name),a=$[e.name]||[];return k(e.name,a,t)}).filter(e=>""!==e);return 0===e.length?"-- No active filters":`-- Generated WHERE clauses:\n${e.join("\n")}`},[b,s,$]),L=(0,d.useMemo)(()=>b.map(e=>{const t=s(e.name),a=$[e.name]||[];return k(e.name,a,t)}).filter(e=>""!==e).join("\n"),[b,s,$]);if((0,d.useEffect)(()=>{const e=b.map(e=>{const t=s(e.name),a=$[e.name]||[];return k(e.name,a,t)}).filter(e=>""!==e).join("\n");if(new URLSearchParams(window.location.search).get("var-alaela_sql")!==e){console.log("[AlaEla] Updating alaela_sql variable:",e);const t=e||"-- No active filters";g.locationService.partial({"var-alaela_sql":t},!0)}},[b,s,$]),0===b.length)return m().createElement("div",{className:(0,u.cx)(l.container,e.compact&&l.compact)},m().createElement(p.Alert,{title:"No variables found",severity:"info"},"Add Query-type variables to your dashboard, or specify variable names in the panel options."));const C=b.map(e=>{const t=e,a=new URLSearchParams(window.location.search).get(`var-${e.name}`),n=f.replace(`$${e.name}`),o=t.current?.value,r=$[e.name];return{name:e.name,url:a,template:n!==`$${e.name}`?n:"N/A",current:JSON.stringify(o),panel:JSON.stringify(r)}});return m().createElement("div",{className:(0,u.cx)(l.container,e.compact&&l.compact)},m().createElement("div",{style:{fontSize:"16px",background:"red",color:"white",padding:"20px",border:"5px solid yellow",borderRadius:"4px",marginBottom:"8px",fontFamily:"monospace",fontWeight:"bold",textAlign:"center"}},"🔴 DEBUG PANEL v2.0 🔴",m().createElement("br",null),"Time: ",(new Date).toLocaleTimeString(),m().createElement("br",null),"Variables: ",b.length),m().createElement("div",{style:{fontSize:"11px",background:"#2a2a2a",padding:"8px",borderRadius:"4px",marginBottom:"8px",fontFamily:"monospace",maxHeight:"150px",overflow:"auto"}},m().createElement("div",{style:{color:"#ffa500",fontWeight:"bold",marginBottom:"4px"}},"Detailed Debug - Last update: ",(new Date).toLocaleTimeString()),C.map(e=>m().createElement("div",{key:e.name,style:{color:"#aaa",marginBottom:"4px"}},m().createElement("span",{style:{color:"#4fc3f7"}},e.name,":"),m().createElement("br",null),"  URL: ",e.url||"null"," | Template: ",e.template," | Current: ",e.current," |",m().createElement("span",{style:{color:e.panel===JSON.stringify(e.url?.split(","))?"#4caf50":"#f44336"}},"Panel: ",e.panel)))),m().createElement("div",{className:(0,u.cx)(l.filtersWrapper,"horizontal"===e.layout?l.filtersHorizontal:l.filtersVertical)},b.map(t=>{const a=s(t.name),n=$[t.name]||[];return m().createElement(E,{key:t.name,variable:t,filterState:a,currentValues:n,showLabel:e.showLabels,compact:e.compact,onModeChange:e=>c(t.name,e),onActiveChange:e=>i(t.name,e)})})),a>150&&m().createElement("div",{className:l.sqlSection},m().createElement("div",{className:l.sqlHeader},m().createElement("span",{className:l.sqlLabel},"Generated SQL Clauses"),L&&m().createElement(p.ClipboardButton,{getText:()=>L,size:"sm",variant:"secondary",icon:"copy"},"Copy")),m().createElement("pre",{className:l.sqlPreview},S)))}).setPanelOptions(e=>{e.addTextInput({path:"variableNames",name:"Variable Names",description:"Comma-separated list of variable names to display. Leave empty to show all Query variables.",defaultValue:"",settings:{placeholder:"server, region, status"}}).addRadio({path:"layout",name:"Layout",description:"How to arrange the variable filters",defaultValue:"horizontal",settings:{options:[{value:"horizontal",label:"Horizontal"},{value:"vertical",label:"Vertical"}]}}).addBooleanSwitch({path:"showLabels",name:"Show Labels",description:"Display variable labels/names",defaultValue:true}).addBooleanSwitch({path:"compact",name:"Compact Mode",description:"Reduce padding and spacing",defaultValue:false})}).setNoPadding();return c})());
//# sourceMappingURL=module.js.map