"use strict";(self.webpackChunk_elucidario_app_lcdr_docs=self.webpackChunk_elucidario_app_lcdr_docs||[]).push([[125],{7522:(e,t,o)=>{o.d(t,{Zo:()=>c,kt:()=>k});var a=o(9901);function n(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function r(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,a)}return o}function i(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?r(Object(o),!0).forEach((function(t){n(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):r(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function s(e,t){if(null==e)return{};var o,a,n=function(e,t){if(null==e)return{};var o,a,n={},r=Object.keys(e);for(a=0;a<r.length;a++)o=r[a],t.indexOf(o)>=0||(n[o]=e[o]);return n}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)o=r[a],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(n[o]=e[o])}return n}var l=a.createContext({}),d=function(e){var t=a.useContext(l),o=t;return e&&(o="function"==typeof e?e(t):i(i({},t),e)),o},c=function(e){var t=d(e.components);return a.createElement(l.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var o=e.components,n=e.mdxType,r=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),p=d(o),u=n,k=p["".concat(l,".").concat(u)]||p[u]||m[u]||r;return o?a.createElement(k,i(i({ref:t},c),{},{components:o})):a.createElement(k,i({ref:t},c))}));function k(e,t){var o=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=o.length,i=new Array(r);i[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:n,i[1]=s;for(var d=2;d<r;d++)i[d]=o[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,o)}u.displayName="MDXCreateElement"},3516:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>m,frontMatter:()=>r,metadata:()=>s,toc:()=>d});var a=o(3124),n=(o(9901),o(7522));const r={id:"doc",slug:"/"},i="Elucid\xe1rio.art",s={unversionedId:"doc",id:"doc",title:"Elucid\xe1rio.art",description:"teste",source:"@site/docs/home.md",sourceDirName:".",slug:"/",permalink:"/",draft:!1,editUrl:"https://github.com/hgodinho/elucidario/tree/main/apps/mdorim-docs/docs/home.md",tags:[],version:"current",frontMatter:{id:"doc",slug:"/"},sidebar:"sidebar"},l={},d=[{value:"Descri\xe7\xe3o",id:"descri\xe7\xe3o",level:2},{value:"Como ler este documento?",id:"como-ler-este-documento",level:3},{value:"Como contribuir?",id:"como-contribuir",level:3}],c={toc:d},p="wrapper";function m(e){let{components:t,...r}=e;return(0,n.kt)(p,(0,a.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"elucid\xe1rioart"},"Elucid\xe1rio.art"),(0,n.kt)("p",null,"teste"),(0,n.kt)("admonition",{title:"Observa\xe7\xe3o no desenvolvimento",type:"note"},(0,n.kt)("p",{parentName:"admonition"},"Precisa separar em dois tipos:"),(0,n.kt)("ol",{parentName:"admonition"},(0,n.kt)("li",{parentName:"ol"},"Para registro na DB",(0,n.kt)("blockquote",{parentName:"li"},(0,n.kt)("p",{parentName:"blockquote"},"O registro na DB \xe9 feito atrav\xe9s de refer\xeancias pela ID de outras entidades ou taxonomias."))),(0,n.kt)("li",{parentName:"ol"},"Para retorno na API",(0,n.kt)("blockquote",{parentName:"li"},(0,n.kt)("p",{parentName:"blockquote"},"O retorno da API traz consigo todas as refer\xeancias resolvidas em objetos completos (entidades ou taxonomias)."))))),(0,n.kt)("h2",{id:"descri\xe7\xe3o"},"Descri\xe7\xe3o"),(0,n.kt)("p",null,"Modelo de Dados para Organiza\xe7\xe3o e Representa\xe7\xe3o da Informa\xe7\xe3o Museol\xf3gica"),(0,n.kt)("p",null,"Baseado em ",(0,n.kt)("a",{parentName:"p",href:"https://linked.art/"},"Linked-Art")," e ",(0,n.kt)("a",{parentName:"p",href:"https://collectionstrust.org.uk/spectrum/"},"SPECTRUM")),(0,n.kt)("h3",{id:"como-ler-este-documento"},"Como ler este documento?"),(0,n.kt)("p",null,"Este documento \xe9 dividido em 5 partes principais:"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},"Tabelas - Defini\xe7\xe3o das tabelas criadas no wordpress para funcionamento adequado do Elucid\xe1rio e do MDORIM;"),(0,n.kt)("li",{parentName:"ol"},"Entidades - Classes principais de conte\xfado, representam as entidades utilizadas no modelo;"),(0,n.kt)("li",{parentName:"ol"},"Metadata - Classes secund\xe1rias, definem os metadados utilizados pelas classes em sua representa\xe7\xe3o;"),(0,n.kt)("li",{parentName:"ol"},"Conceitos pr\xe9-definidos - utilizados pelo modelo;"),(0,n.kt)("li",{parentName:"ol"},"Gloss\xe1rio - defini\xe7\xe3o de termos utilizados no modelo;")),(0,n.kt)("p",null,"Cada parte cont\xe9m defini\xe7\xf5es de classes e propriedades, al\xe9m de exemplos de uso. Em cada defini\xe7\xe3o de classe deste documento \xe9 poss\xedvel encontrar um resumo objetivo da classe, uma descri\xe7\xe3o mais detalhada, al\xe9m de exemplos de uso."),(0,n.kt)("p",null,"O resumo objetivo de cada classe \xe9 apresentado da seguinte forma:"),(0,n.kt)("admonition",{type:"info"},(0,n.kt)("p",{parentName:"admonition"},"tipo ",(0,n.kt)("a",{parentName:"p",href:"/entities/concept#conceptref"},(0,n.kt)("inlineCode",{parentName:"a"},"ConceptRef[]"))," usado em ",(0,n.kt)("a",{parentName:"p",href:"/entities/concept#concept"},(0,n.kt)("inlineCode",{parentName:"a"},"Concept")),".")),(0,n.kt)("p",null,"O documento tamb\xe9m conta com informa\xe7\xf5es sobre o status de desenvolvimento de cada classe que auxilia no andamento do desenvolvimento e devem ser removidas ao final, por exemplo:"),(0,n.kt)("admonition",{title:"Status",type:"caution"},(0,n.kt)("ul",{parentName:"admonition",className:"contains-task-list"},(0,n.kt)("li",{parentName:"ul",className:"task-list-item"},(0,n.kt)("input",{parentName:"li",type:"checkbox",checked:!1,disabled:!0})," ","definido"),(0,n.kt)("li",{parentName:"ul",className:"task-list-item"},(0,n.kt)("input",{parentName:"li",type:"checkbox",checked:!1,disabled:!0})," ","revisado"),(0,n.kt)("li",{parentName:"ul",className:"task-list-item"},(0,n.kt)("input",{parentName:"li",type:"checkbox",checked:!1,disabled:!0})," ","testado"),(0,n.kt)("li",{parentName:"ul",className:"task-list-item"},(0,n.kt)("input",{parentName:"li",type:"checkbox",checked:!1,disabled:!0})," ","exemplo"))),(0,n.kt)("p",null,"Em @to-do listamos o andamento do denvolvimento como um todo."),(0,n.kt)("h3",{id:"como-contribuir"},"Como contribuir?"),(0,n.kt)("p",null,"Para contribuir com o desenvolvimento do MDORIM, basta abrir uma ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/hgodinho/elucidario/issues"},"issue")," e selecionar uma das op\xe7\xf5es dispon\xedveis:"),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"issues",src:o(2414).Z,width:"508",height:"252"})))}m.isMDXComponent=!0},2414:(e,t,o)=>{o.d(t,{Z:()=>a});const a=o.p+"assets/images/issues-38f694acf22cb21d351c06c40eab77d1.png"}}]);