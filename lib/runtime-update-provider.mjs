import {readFile,realpath} from 'node:fs/promises';
import {join,basename,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import * as workspace from './extension-api.mjs';
import {runtimeDirectory,validatePin} from '../skills/chill-agent/scripts/start.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const json=async file=>JSON.parse(await readFile(file,'utf8'));
const revision=pin=>validatePin(pin).spec.split('#')[1];

async function selection(source){
 if(source?.version!==1||!isAbsolute(source.project||'')||!isAbsolute(source.manifest||'')||basename(source.manifest)!=='runtime.json')throw Error('Invalid installed skill source.');
 if(await realpath(source.project)!==source.project)throw Error('The installed project moved. Invoke the skill again from its project.');
 const pin=validatePin(await json(source.manifest));
 return {source,pin,key:revision(pin)};
}

// The starter names the installed manifest; an immutable runtime guide does not
// overwrite that reference. Read JSON from the checkout, never execute its code.
export async function rememberRuntimeSource({manifest,project,directory},{save=workspace.saveRuntimeUpdateSource,runtime=root}={}){
 if(!manifest||!save)return; // Older CLI builds have no optional update capability.
 const source={version:1,project:await realpath(project),manifest:await realpath(manifest)};
 const selected=await selection(source),build=await json(join(runtime,'extensions.json'));
 if(selected.key!==build.build?.revision)throw Error('The installed skill changed during preparation. Invoke it again.');
 await save(source,directory);
}

export function createRuntimeUpdates({runtime=root,readSource=workspace.readRuntimeUpdateSource,acquire=runtimeDirectory}={}){
 const current=async()=>(await json(join(runtime,'extensions.json'))).build?.revision;
 async function selected(directory){return selection(await readSource(directory));}
 return {
  current,
  async candidate(directory){
   try{return {key:(await selected(directory)).key};}catch{return null;}
  },
  async acquire(directory,key){
   const {source,pin,key:actual}=await selected(directory);
   if(actual!==key)throw Error('The installed skill changed. Confirm its update again.');
   const target=await acquire({project:source.project,pin});
   if((await json(join(target,'extensions.json'))).build?.revision!==key)throw Error('The acquired runtime does not match the selected commit.');
   return target;
  },
 };
}
