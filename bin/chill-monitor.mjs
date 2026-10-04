#!/usr/bin/env node
import {configureMonitor,readMonitor,tickMonitor,reportMonitorResult} from '../lib/continuation-monitor.mjs';
import {monitorService} from '../lib/continuation-service.mjs';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {touch as hostTouch} from '@game-dev-rta-club/chill-agent-cli/extension-api';
const [command,...args]=process.argv.slice(2);
const usage='Optional continuation checks with durable attempt limits.\nUsage: chill monitor <start|stop|enable|disable|status|tick|watch|result> --id <ROOT>\nOpt-in continuation: at most 2 nudges per user/Goal/Brief revision. The hosted extension checks every 30s, without fixed idle/cooldown delays. start runs monitoring inside the Web server; stop disables only this Root monitor. Web remains available. watch is retired; use start. CLI-only servers may disable extensions with CHILL_AGENT_EXTENSIONS=none. Unknown/paused/queued states never send. enable preserves attempts. disable stops future sends, not a message already queued.\nResult: chill monitor result --id <ROOT> --attempt <UUID> --outcome <worked|no-work>. Saves internal results only; requires the assigned CODEX_THREAD_ID.';
try{
 if(!command||command==='--help'||args.includes('--help'))console.log(usage);
 else if(command==='result'){
  if(args.length!==6||args[0]!=='--id'||args[2]!=='--attempt'||args[4]!=='--outcome')throw Error(usage);
  console.log(JSON.stringify(await reportMonitorResult(args[1],args[3],args[5]),null,2));
 }
 else{
  if(args.length!==2||args[0]!=='--id'||! /^[1-9][0-9]*$/.test(args[1])||!['start','stop','enable','disable','status','tick','watch'].includes(command))throw Error(usage);
  const id=args[1];
  if(command==='start'){
   const url=`http://127.0.0.1:${process.env.PORT||'4173'}/api/goals/${id}/extensions`;
   let response;try{response=await fetch(url,{signal:AbortSignal.timeout(2000)});}catch{
    await promisify(execFile)(process.execPath,[new URL('./chill-server.mjs',import.meta.url).pathname,'start']);
    response=await fetch(url,{signal:AbortSignal.timeout(5000)});
   }
   if(!response.ok||!(await response.json()).some(e=>e.id==='continuation'))throw Error('This Web server does not host the continuation extension. Update/restart it first.');
   if(process.platform==='darwin')await monitorService(id,'stop');
   await configureMonitor(id,true);await hostTouch();console.log(JSON.stringify({enabled:true,host:'web-server'},null,2));
  }
  else if(command==='stop'){await configureMonitor(id,false);if(process.platform==='darwin')await monitorService(id,'stop');console.log(JSON.stringify({enabled:false,host:'web-server'},null,2));}
  else if(['enable','disable'].includes(command))console.log(JSON.stringify(await configureMonitor(id,command==='enable'),null,2));
  else if(command==='status')console.log(JSON.stringify(await readMonitor(id),null,2));
  else if(command==='tick')console.log(JSON.stringify(await tickMonitor(id),null,2));
  else throw Error('Standalone watch is retired. Use monitor start to run in the Web server.');

 }
}catch(error){console.error(error.message);process.exitCode=1;}
