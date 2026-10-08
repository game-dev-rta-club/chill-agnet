import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,cp,writeFile,rm,readFile,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const source=new URL('../plugins/chill-agent/skills/chill-agent/scripts/start.mjs',import.meta.url);
const pin={name:'@game-dev-rta-club/chill-agent',spec:'git+https://github.com/game-dev-rta-club/chill-agnet.git#'+'a'.repeat(40)};
async function fixture(fn){const root=await mkdtemp(join(tmpdir(),'chill-install-'));try{const scripts=join(root,'skill/scripts');await mkdir(scripts,{recursive:true});await cp(source,join(scripts,'start.mjs'));await writeFile(join(scripts,'runtime.json'),JSON.stringify(pin));const api=await import(pathToFileURL(join(scripts,'start.mjs')));await fn(root,api);}finally{await rm(root,{recursive:true,force:true});}}
async function fakeInstall(stage,p){const runtime=join(stage,'node_modules',p.name,'dist/runtime');await mkdir(join(runtime,'bin'),{recursive:true});await writeFile(join(runtime,'bin/chill-session.mjs'),'');await writeFile(join(runtime,'extensions.json'),'{}');}
test('fixed installation reuses offline, isolates projects and versions',()=>fixture(async(root,api)=>{
 const project=join(root,'project'),other=join(root,'other');await mkdir(project);await mkdir(other);const options={project,cacheRoot:join(root,'cache')};let calls=0;const install=async(...args)=>{calls++;await fakeInstall(...args);};
 const a=await api.runtimeDirectory({...options,install});assert.equal(await api.runtimeDirectory({...options,install:()=>{throw Error('offline');}}),a);assert.equal(calls,1);
 assert.notEqual(await api.runtimeDirectory({...options,project:other,install}),a);
 await writeFile(join(root,'skill/scripts/runtime.json'),JSON.stringify({...pin,spec:pin.spec.replace(/a{40}$/,'b'.repeat(40))}));assert.notEqual(await api.runtimeDirectory({...options,install}),a);assert.equal(await readFile(join(a,'extensions.json'),'utf8'),'{}');
}));
test('failed installation is not published; concurrent installs converge',()=>fixture(async(root,api)=>{
 const options={project:root,cacheRoot:join(root,'cache')};await assert.rejects(api.runtimeDirectory({...options,install:async()=>{throw Error('network');}}),/network/);
 const [a,b]=await Promise.all([1,2].map(()=>api.runtimeDirectory({...options,install:fakeInstall})));assert.equal(a,b);
}));
test('moving or foreign pins are rejected',()=>fixture(async(root,api)=>{for(const spec of ['latest','git+https://github.com/game-dev-rta-club/chill-agnet.git#develop','git+https://evil.example/repo#'+'a'.repeat(40)])assert.throws(()=>api.validatePin({...pin,spec}),/immutable/);}));
test('preflight runs without a runtime manifest and writes no installation',()=>fixture(async(root)=>{
 await rm(join(root,'skill/scripts/runtime.json'));
 const before=await readdir(root);
 const {stdout}=await promisify(execFile)(process.execPath,[join(root,'skill/scripts/start.mjs'),'preflight'],{cwd:root,env:{...process.env,CHILL_AGENT_CLOUDFLARED_PATH:join(root,'missing')}});
 const result=JSON.parse(stdout);assert.equal(result.checks.find(x=>x.id==='cloudflared').status,'missing');
 assert.equal(result.publicLinkToolReady,false);assert.deepEqual(await readdir(root),before);
}));
test('preflight separates required tools, optional phone access and unusable binaries',()=>fixture(async(root,api)=>{
 const binary=join(root,'cloudflared');await writeFile(binary,'fixture');
 const calls=[];const execute=async(file,args)=>{calls.push([file,...args]);return {stdout:'version 1'};};
 const options={env:{CHILL_AGENT_CLOUDFLARED_PATH:binary,PATH:''},findNpm:async()=>'/npm-cli.js',execute,version:'24.15.0'};
 let result=await api.prerequisites(options);assert.equal(result.localReady,true);assert.equal(result.publicLinkToolReady,true);
 assert(calls.every(call=>call.at(-1)==='--version'));
 result=await api.prerequisites({...options,version:'24.14.0'});assert.equal(result.localReady,false);
 result=await api.prerequisites({...options,env:{...options.env,CHILL_AGENT_CLOUDFLARED_PATH:join(root,'absent')}});assert.equal(result.localReady,true);assert.equal(result.publicLinkToolReady,false);
 result=await api.prerequisites({...options,execute:async()=>{throw Object.assign(Error('cannot execute'),{code:'EACCES'});}});
 assert.equal(result.localReady,false);assert.equal(result.checks.find(x=>x.id==='cloudflared').status,'unavailable');
}));
