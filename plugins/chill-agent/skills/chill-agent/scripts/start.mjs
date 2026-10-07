#!/usr/bin/env node
import {access,realpath} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile),here=dirname(fileURLToPath(import.meta.url));
export async function runtimeDirectory(){
 for(const directory of [join(here,'runtime'),resolve(here,'../../..')]){
  try{await access(join(directory,'bin/chill-session.mjs'));await access(join(directory,'extensions.json'));return directory;}catch{}
 }
 throw Error('This skill is missing its bundled runtime. Install the complete built dist/skills/chill-agent folder, not the source SKILL.md alone.');
}
if(process.argv[1]&&await realpath(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const runtime=await runtimeDirectory();
  const result=await run(process.execPath,[join(runtime,'bin/chill-session.mjs'),...process.argv.slice(2)],{maxBuffer:4*1024*1024});
  process.stdout.write(result.stdout);
 }catch(error){console.error(error.stderr||error.message);process.exitCode=1;}
}
