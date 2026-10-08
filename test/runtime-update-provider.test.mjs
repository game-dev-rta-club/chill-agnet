import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,realpath,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createRuntimeUpdates,rememberRuntimeSource} from '../lib/runtime-update-provider.mjs';
import {readRuntimeUpdateSource,saveRuntimeUpdateSource} from '../lib/extension-api.mjs';
const a='a'.repeat(40),b='b'.repeat(40);
const pin=key=>({name:'@game-dev-rta-club/chill-agent',spec:`git+https://github.com/game-dev-rta-club/chill-agnet.git#${key}`});
const json=(file,value)=>writeFile(file,JSON.stringify(value));
async function fixture(t){
 const root=await realpath(await mkdtemp(join(tmpdir(),'chill-update-source-')));
 t.after(()=>rm(root,{recursive:true,force:true}));
 const runtime=join(root,'runtime'),project=join(root,'project'),directory=join(root,'data');
 for(const path of [runtime,project,directory])await mkdir(path);
 const manifest=join(project,'runtime.json');await json(manifest,pin(a));
 await json(join(runtime,'extensions.json'),{build:{revision:a}});
 const source={version:1,project,manifest};return {root,runtime,project,directory,manifest,source};
}
test('source is bound to the prepared store and survives immutable guide use; detection only reads the installed pin',async t=>{
 const f=await fixture(t);
 await rememberRuntimeSource(f,{runtime:f.runtime});
 assert.deepEqual(await readRuntimeUpdateSource(f.directory),f.source);
 await rememberRuntimeSource({...f,manifest:undefined},{runtime:f.runtime});
 let acquired=0;
 const api=createRuntimeUpdates({runtime:f.runtime,acquire:async()=>acquired++});
 assert.equal(await api.current(),a);assert.deepEqual(await api.candidate(f.directory),{key:a});
 await json(f.manifest,pin(b));
 assert.deepEqual(await api.candidate(f.directory),{key:b});assert.equal(await api.current(),a);assert.equal(acquired,0);
 assert.deepEqual(await readRuntimeUpdateSource(f.directory),f.source);
 assert.equal(await api.candidate(join(f.root,'another-data')),null);
});
test('changed preparation input is rejected without overwriting the prior source',async t=>{
 const f=await fixture(t);await saveRuntimeUpdateSource({keep:true},f.directory);
 await json(f.manifest,pin(b));
 await assert.rejects(rememberRuntimeSource(f,{runtime:f.runtime}),/changed during preparation/);
 assert.deepEqual(await readRuntimeUpdateSource(f.directory),{keep:true});
});
test('foreign or moving pins, missing sources and moved projects cannot select an update',async t=>{
 const f=await fixture(t);await saveRuntimeUpdateSource(f.source,f.directory);
 const api=createRuntimeUpdates({runtime:f.runtime});
 for(const spec of ['git+https://github.com/game-dev-rta-club/chill-agnet.git#develop','https://other.example/runtime']){
  await json(f.manifest,{...pin(a),spec});assert.equal(await api.candidate(f.directory),null);
 }
 await json(f.manifest,pin(b));await saveRuntimeUpdateSource({...f.source,project:join(f.root,'missing')},f.directory);
 assert.equal(await api.candidate(f.directory),null);
});
test('acquisition uses the exact selected pin and project; stale requests and mismatched builds cannot switch',async t=>{
 const f=await fixture(t);await json(f.manifest,pin(b));await saveRuntimeUpdateSource(f.source,f.directory);
 const target=join(f.root,'target');await mkdir(target);await json(join(target,'extensions.json'),{build:{revision:b}});
 const calls=[];const api=createRuntimeUpdates({runtime:f.runtime,acquire:async options=>{calls.push(options);return target;}});
 await assert.rejects(api.acquire(f.directory,a),/changed/);assert.equal(calls.length,0);
 assert.equal(await api.acquire(f.directory,b),target);assert.deepEqual(calls,[{project:f.project,pin:pin(b)}]);
 await json(join(target,'extensions.json'),{build:{revision:a}});await assert.rejects(api.acquire(f.directory,b),/does not match/);
 assert.equal(JSON.parse(await readFile(f.manifest,'utf8')).spec,pin(b).spec);
});
