import{f as s,j as e}from"./index-CuuRsjV8.js";/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=s("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=s("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);function x({lat:t,lng:a,address:r,height:o="h-48"}){if(!t||!a)return e.jsx("p",{className:"text-xs text-slate-500 p-3 bg-slate-50 rounded-xl",children:"No map location recorded for this complaint."});const n=`https://www.google.com/maps/dir/?api=1&destination=${t},${a}`;return e.jsxs("div",{className:"space-y-2",children:[r&&e.jsx("p",{className:"text-xs text-slate-600",children:r}),e.jsx("iframe",{title:"Complaint location",className:`w-full ${o} rounded-xl border border-slate-200`,src:`https://www.openstreetmap.org/export/embed.html?bbox=${a-.01}%2C${t-.01}%2C${a+.01}%2C${t+.01}&layer=mapnik&marker=${t}%2C${a}`}),e.jsxs("a",{href:n,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline",children:[e.jsx(i,{className:"w-3.5 h-3.5"})," Open in Google Maps for navigation"]})]})}export{p as C,x as a};
