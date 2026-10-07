import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,cp,writeFile,rm,realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile);
const source=new URL('../plugins/chill-agent/skills/chill-agent/scripts/start.mjs',import.meta.url);
for(const harness of ['codex-desktop','claude-code'])test(`standalone starter routes ${harness} without inherited workspace or shell interpolation`,async()=>{
 const root=await mkdtemp(join(tmpdir(),'chill-start-')),project=join(root,"project 'with spaces'"),scripts=join(root,'skill/scripts'),runtime=join(scripts,'runtime');
 try{
  await mkdir(join(runtime,'bin'),{recursive:true});await mkdir(project);
  await cp(source,join(scripts,'start.mjs'));await writeFile(join(runtime,'extensions.json'),'{}');
  const launcher=join(root,'launcher.mjs');
  await writeFile(launcher,`if(process.env.PORT||process.env.CHILL_AGENT_DATA_DIR!==${JSON.stringify(root)})throw Error('Foreign workspace');console.log(process.argv[3]==='status'?'Stopped':'web-ready');`);
  await writeFile(join(runtime,'bin/chill-setup.mjs'),`import assert from 'node:assert/strict';assert.equal(process.env.PORT,undefined);assert.equal(process.env.CHILL_AGENT_DATA_DIR,undefined);if(process.argv[2]==='status'){console.log(JSON.stringify({idleWatchMs:60000}));process.exit(0);}assert.deepEqual(process.argv.slice(2),['prepare','--isolated','--project',${JSON.stringify(await realpath(project))},'--harness',${JSON.stringify(harness)},...${JSON.stringify(harness==='claude-code'?['--idle-watch-ms','60000']:[])}]);console.log(JSON.stringify({launcher:${JSON.stringify(launcher)},dataDirectory:${JSON.stringify(root)},command:'stable-prefix',url:'http://localhost:1234'}));`);
  const output=await run(process.execPath,[join(scripts,'start.mjs'),'--project',project,'--harness',harness],{env:{...process.env,PORT:'4174',CHILL_AGENT_DATA_DIR:'/foreign/workspace'}});
  const result=JSON.parse(output.stdout);assert.equal(result.server,'web-ready');assert.equal(result.connectionVerified,false);assert.equal(result.command,'stable-prefix');
  await assert.rejects(run(process.execPath,[join(scripts,'start.mjs'),'--project',project,'--harness','unknown']),/Specify/);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('source-only installation explains the missing runtime',async()=>{
 const root=await mkdtemp(join(tmpdir(),'chill-start-missing-'));
 try{await cp(source,join(root,'start.mjs'));await assert.rejects(run(process.execPath,[join(root,'start.mjs'),'--project',root,'--harness','claude-code']),/complete built dist\/skills\/chill-agent/);}finally{await rm(root,{recursive:true,force:true});}
});
