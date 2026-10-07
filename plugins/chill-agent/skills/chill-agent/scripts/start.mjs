#!/usr/bin/env node
import {access,realpath} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile);
const here=dirname(fileURLToPath(import.meta.url));

export async function runtimeDirectory(){
 for(const directory of [join(here,'runtime'),resolve(here,'../../..')]){
  try{await access(join(directory,'bin/chill-setup.mjs'));await access(join(directory,'extensions.json'));return directory;}catch{}
 }
 throw Error('This skill is missing its bundled runtime. Install the complete built dist/skills/chill-agent folder, not the source SKILL.md alone.');
}
export async function start({project,harness}){
 if(!project||!['codex-desktop','claude-code'].includes(harness))throw Error('Specify --project <project directory> and --harness codex-desktop|claude-code.');
 const cwd=await realpath(project),runtime=await runtimeDirectory();
 // A new project must never inherit another project’s store or port.
 const env={...process.env};delete env.CHILL_AGENT_DATA_DIR;delete env.PORT;
 const setupFile=join(runtime,'bin/chill-setup.mjs'),selection=['--isolated','--project',cwd,'--harness',harness];
 const retained=[];
 if(harness==='claude-code'){
  const status=JSON.parse((await run(process.execPath,[setupFile,'status',...selection],{cwd,env,maxBuffer:4*1024*1024})).stdout);
  if(status.idleWatchMs!=null)retained.push('--idle-watch-ms',String(status.idleWatchMs));
 }
 const prepared=await run(process.execPath,[setupFile,'prepare',...selection,...retained],{cwd,env,maxBuffer:4*1024*1024});
 const setup=JSON.parse(prepared.stdout);
 const options={cwd,env:{...env,CHILL_AGENT_DATA_DIR:setup.dataDirectory},maxBuffer:4*1024*1024};
 const status=await run(process.execPath,[setup.launcher,'server','status'],options);
 const server=/^Running \(PID /m.test(status.stdout)?status:await run(process.execPath,[setup.launcher,'server','start','--configured'],options);
 return {...setup,server:server.stdout.trim(),connectionVerified:false};
}
if(process.argv[1]&&await realpath(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2);
 if(args.length===1&&args[0]==='--help')console.log('Agent-only first use: node scripts/start.mjs --project <directory> --harness codex-desktop|claude-code. Prepares an isolated workspace and starts its local Web. Native hook activation is still required.');
 else{
  try{
   const values={};for(let i=0;i<args.length;i+=2){if(!['--project','--harness'].includes(args[i])||!args[i+1]||values[args[i]])throw Error('Use --help for supported arguments.');values[args[i]]=args[i+1];}
   console.log(JSON.stringify(await start({project:values['--project'],harness:values['--harness']}),null,2));
  }catch(error){console.error(error.stderr||error.message);process.exitCode=1;}
 }
}
