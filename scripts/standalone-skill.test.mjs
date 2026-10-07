import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,cp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile),source=new URL('../plugins/chill-agent/skills/chill-agent/scripts/start.mjs',import.meta.url);
test('standalone entry delegates arbitrary selected harness without shell interpolation',async()=>{
 const root=await mkdtemp(join(tmpdir(),'chill-start-')),scripts=join(root,'skill/scripts'),runtime=join(scripts,'runtime');
 try{
  await mkdir(join(runtime,'bin'),{recursive:true});await cp(source,join(scripts,'start.mjs'));await writeFile(join(runtime,'extensions.json'),'{}');
  await writeFile(join(runtime,'bin/chill-session.mjs'),'console.log(JSON.stringify(process.argv.slice(2)))');
  const args=['start','--project',"project 'with spaces'",'--harness','future-host'];
  const output=await run(process.execPath,[join(scripts,'start.mjs'),...args]);assert.deepEqual(JSON.parse(output.stdout),args);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('source-only installation explains missing runtime',async()=>{
 const root=await mkdtemp(join(tmpdir(),'chill-missing-'));
 try{await cp(source,join(root,'start.mjs'));await assert.rejects(run(process.execPath,[join(root,'start.mjs'),'guide','--harness','unknown']),/complete built dist/);}finally{await rm(root,{recursive:true,force:true});}
});
