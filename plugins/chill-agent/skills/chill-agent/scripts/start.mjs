#!/usr/bin/env node
import {access,realpath,readFile,writeFile,mkdir,mkdtemp,rename,rm} from 'node:fs/promises';
import {dirname,join,resolve,delimiter} from 'node:path';
import {homedir} from 'node:os';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile),here=dirname(fileURLToPath(import.meta.url));
export async function npmEntry(env=process.env,node=process.execPath){
 // Run npm's JS entry directly, including on Windows where npm.cmd needs a shell.
 const candidates=[env.npm_execpath,join(dirname(node),'node_modules/npm/bin/npm-cli.js'),resolve(dirname(node),'../lib/node_modules/npm/bin/npm-cli.js')].filter(Boolean);
 for(const directory of (env.PATH||'').split(delimiter)){
  candidates.push(join(directory,'node_modules/npm/bin/npm-cli.js'));
  try{const entry=await realpath(join(directory,'npm'));if(entry.endsWith('npm-cli.js'))candidates.push(entry);}catch{}
 }
 for(const candidate of candidates){try{await access(candidate);return candidate;}catch{}}
 throw Object.assign(Error('npm is required alongside Node.js for the first installation.'),{code:'MISSING'});
}
export async function prerequisites({env=process.env,node=process.execPath,version=process.versions.node,execute=run,findNpm=npmEntry}={}){
 const options={env,timeout:5000,maxBuffer:16384};
 async function probe(id,required,purpose,check){
  try{return {id,required,purpose,status:'available',version:(await check()).trim().slice(0,200)};}
  catch(error){return {id,required,purpose,status:error.code==='ENOENT'||error.code==='MISSING'?'missing':'unavailable'};}
 }
 const [major,minor]=version.split('.').map(Number);
 const nodeCheck={id:'node',required:true,purpose:'Run chill-agent and its SQLite store',status:major>24||major===24&&minor>=15?'available':'unsupported',version};
 const tools=await Promise.all([
  probe('npm',true,'Download the fixed application and its dependencies',async()=>{const entry=await findNpm(env,node);return (await execute(node,[entry,'--version'],options)).stdout;}),
  probe('git',true,'Download the exact application revision',async()=>(await execute('git',['--version'],options)).stdout),
  probe('cloudflared',false,'Open this workspace on a phone or another computer',async()=>{
   const paths=env.CHILL_AGENT_CLOUDFLARED_PATH?[env.CHILL_AGENT_CLOUDFLARED_PATH]:[...(env.PATH||'').split(delimiter).filter(Boolean).map(path=>join(path,'cloudflared')),'/opt/homebrew/bin/cloudflared','/usr/local/bin/cloudflared'];
   for(const path of paths){try{await access(path);return (await execute(path,['--version'],options)).stdout;}catch(error){if(error.code!=='ENOENT')throw error;}}
   throw Object.assign(Error('cloudflared missing'),{code:'MISSING'});
  })
 ]);
 const checks=[nodeCheck,...tools];
 return {checks,localReady:checks.filter(x=>x.required).every(x=>x.status==='available'),publicLinkToolReady:checks.at(-1).status==='available',
  next:'This check installs nothing. Before setup, explain missing or unusable tools and ask permission for a specific installation or repair. cloudflared is optional for local use: offer installation for phone access or local-only use. Do not install a package manager without permission. Recheck after any approved installation. Installing cloudflared does not publish the workspace; Public link On remains a separate user choice.'};
}
export function validatePin(pin){
 if(pin?.name!=='@game-dev-rta-club/chill-agent'||!/^git\+https:\/\/github\.com\/game-dev-rta-club\/chill-agnet\.git#[a-f0-9]{40}$/.test(pin.spec))throw Error('Expected an immutable official runtime commit in runtime.json.');
 return pin;
}
async function usable(directory){try{await access(join(directory,'bin/chill-session.mjs'));await access(join(directory,'extensions.json'));return true;}catch{return false;}}
export async function runtimeDirectory({project=process.cwd(),cacheRoot=join(homedir(),'.chill-agent','installations'),install}={}){
 // Compatibility plugins and immutable runtime guides already have a runtime.
 const embedded=resolve(here,'../../..');if(await usable(embedded))return embedded;
 let pin;try{pin=validatePin(JSON.parse(await readFile(join(here,'runtime.json'),'utf8')));}catch(error){throw Error('Install the complete built skill with its fixed runtime.json. '+error.message);}
 const identity=await realpath(resolve(project));
 const key=createHash('sha256').update(identity).digest('hex');
 const version=createHash('sha256').update(JSON.stringify(pin)).digest('hex');
 const parent=join(cacheRoot,key),target=join(parent,version),runtime=join(target,'node_modules',pin.name,'dist/runtime');
 try{if(await usable(runtime)&&JSON.stringify(JSON.parse(await readFile(join(target,'installed.json'),'utf8')))===JSON.stringify(pin))return runtime;}catch{}
 await mkdir(parent,{recursive:true});const stage=await mkdtemp(join(parent,'.install-'));
 try{
  await writeFile(join(stage,'package.json'),JSON.stringify({private:true,dependencies:{[pin.name]:pin.spec}}));
  if(install)await install(stage,pin);
  else{
   const npm=await npmEntry();
   await run(process.execPath,[npm,'install','--no-audit','--no-fund','--no-progress'],{cwd:stage,env:{...process.env,CHILL_BUILD_DEVELOPMENT:'1',CHILL_SKILL_REVISION:pin.spec.split('#')[1]},maxBuffer:8*1024*1024});
  }
  if(!await usable(join(stage,'node_modules',pin.name,'dist/runtime')))throw Error('Installed package is missing its built runtime.');
  await writeFile(join(stage,'installed.json'),JSON.stringify(pin));
  try{await rename(stage,target);}catch(error){if(!['EEXIST','ENOTEMPTY','EPERM'].includes(error.code))throw error;if(!await usable(runtime)||JSON.stringify(JSON.parse(await readFile(join(target,'installed.json'),'utf8')))!==JSON.stringify(pin))throw error;}
  return runtime;
 }finally{await rm(stage,{recursive:true,force:true});}
}
if(process.argv[1]&&await realpath(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const args=process.argv.slice(2),index=args.indexOf('--project');
  if(args[0]==='preflight'){
   if(args.length!==1)throw Error('Usage: node <skill>/scripts/start.mjs preflight');
   console.log(JSON.stringify(await prerequisites(),null,2));
  }else{
  const runtime=await runtimeDirectory({project:index<0?process.cwd():args[index+1]});
  const result=await run(process.execPath,[join(runtime,'bin/chill-session.mjs'),...args],{maxBuffer:4*1024*1024});process.stdout.write(result.stdout);
  }
 }catch(error){console.error(error.stderr||error.message);process.exitCode=1;}
}
