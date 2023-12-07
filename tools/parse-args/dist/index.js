const s=()=>{const s={path:""};return process.argv.forEach((t=>{if(t.startsWith("--")){const[e,i]=t.slice(2).split("=");s[e]=i||!0}else t.includes("node_modules")?s.path=t.split("node_modules")[0]:t.includes("dist")&&(s.path=t.split("dist")[0])})),s};export{s as parseArgs};
//# sourceMappingURL=index.js.map
