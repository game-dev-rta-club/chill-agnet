#!/usr/bin/env node
import {access,realpath,readFile,writeFile,mkdir,mkdtemp,rename,rm} from 'node:fs/promises';
import {dirname,join,resolve,delimiter} from 'node:path';
import {homedir} from 'node:os';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile),here=dirname(fileURLToPath(import.meta.url));
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
   // npm.cmd needs a shell on Windows; locate npm's JS entry and run it via Node instead.
   const candidates=[process.env.npm_execpath,join(dirname(process.execPath),'node_modules/npm/bin/npm-cli.js'),resolve(dirname(process.execPath),'../lib/node_modules/npm/bin/npm-cli.js')].filter(Boolean);
   for(const directory of (process.env.PATH||'').split(delimiter)){
    candidates.push(join(directory,'node_modules/npm/bin/npm-cli.js'));
    try{const entry=await realpath(join(directory,'npm'));if(entry.endsWith('npm-cli.js'))candidates.push(entry);}catch{}
   }
   let npm;for(const candidate of candidates){try{await access(candidate);npm=candidate;break;}catch{}}
   if(!npm)throw Error('npm is required alongside Node.js for the first installation.');
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
  const runtime=await runtimeDirectory({project:index<0?process.cwd():args[index+1]});
  const result=await run(process.execPath,[join(runtime,'bin/chill-session.mjs'),...args],{maxBuffer:4*1024*1024});process.stdout.write(result.stdout);
 }catch(error){console.error(error.stderr||error.message);process.exitCode=1;}
}
