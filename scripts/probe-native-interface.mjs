#!/usr/bin/env node
// Opt-in native standalone-skill exercise. Only disposable settings, conversation and Goals.
import {probeCommand} from './native-probe-command.mjs';
import {spawn,execFile} from 'node:child_process';
import {mkdtemp,mkdir,readFile,readdir,rm,cp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,relative} from 'node:path';
import {parseArgs,promisify} from 'node:util';
import {authNames,probeAuthSettings} from './native-probe-auth.mjs';
import {pathToFileURL} from 'node:url';
const {values}=parseArgs({options:{run:{type:'boolean'},'sqlite-web':{type:'boolean'},skill:{type:'string'},claude:{type:'string',default:'claude'},'auth-settings':{type:'string'},help:{type:'boolean'}}});
if(values.help||!values.run){console.log('Usage: node scripts/probe-native-interface.mjs --run --skill /path/to/dist/skills/chill-agent [--sqlite-web] [--claude /path/to/claude] [--auth-settings /path/to/native-settings.json]\nLoads the standalone skill and its runtime interface in an isolated print-mode conversation. Prepares only disposable hooks, asks the skill to create one Root and report there, and inspects persisted results. $0.80 budget, 180-second conversation limit. With --sqlite-web, use SQLite and resume the same disposable session for a Web reply ($0.80/180 seconds per phase). No ordinary settings, production data or permission modes are changed.');process.exit(0);}
if(!values.skill)throw Error('A complete built standalone skill is required.');
const artifact=resolve(values.skill),base=await mkdtemp(join(tmpdir(),'chill-native-plugin-')),cwd=join(base,'project'),data=join(base,'data'),config=join(base,'config');
const skill=join(cwd,'.claude/skills/chill-agent'),plugin=join(skill,'scripts/runtime');
const report={checkedAt:new Date().toISOString(),scope:'Standalone skill discovery and selected runtime interface routing in a disposable print-mode conversation; not a production install, cold-start permission UX or indefinite idle test.'};
const env={};for(const k of ['PATH','HOME','TMPDIR','USER','LOGNAME','SHELL','LANG','LC_ALL',...(values['auth-settings']?[]:authNames)])if(process.env[k]!==undefined)env[k]=process.env[k];
Object.assign(env,{CLAUDE_CONFIG_DIR:config,CHILL_AGENT_DATA_DIR:data,CHILL_AGENT_CODEX_PATH:'/never/call/codex',CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC:'1',CLAUDE_CODE_DISABLE_OFFICIAL_MARKETPLACE_AUTOINSTALL:'1'});
const execute=promisify(execFile),calls=[],results=[],reads=[],skills=[],discovered=[],readEvidence=[],toolNames=new Set(),toolsById=new Map(),guideBodies=[];let server,child,timer,phase='prepare',stream='',stderrBytes=0,exit;
const safeCommand=command=>probeCommand(command,join(data,'runtime/chill.mjs'));
try{
 const auth=values['auth-settings']?await probeAuthSettings(values['auth-settings']):null;if(auth)Object.assign(env,auth.env);
 await mkdir(cwd);await mkdir(config);await mkdir(join(cwd,'.claude/skills'),{recursive:true});await cp(artifact,skill,{recursive:true});
 for(const file of ['workspace/connect.md','goals/create.md','messages/send.md'])guideBodies.push({path:'skills/chill-agent/references/'+file,body:await readFile(join(skill,'references',file),'utf8')});
 const {harnessGuidance}=await import(pathToFileURL(join(plugin,'extensions/harnesses/index.mjs')).href);
 guideBodies.push({path:'runtime-interface:claude-code',body:JSON.stringify(harnessGuidance('claude-code'),null,2)});
 report.version=(await execute(values.claude,['--version'],{env,cwd,timeout:10000})).stdout.trim();
 const prepared=JSON.parse((await execute(process.execPath,[join(plugin,'bin/chill-setup.mjs'),'prepare','--harness','claude-code','--project',cwd],{env,cwd,timeout:15000,maxBuffer:1024*1024})).stdout);
 report.runtimeId=prepared.id;
 const prefix=prepared.command;
 const prompt=`Use the chill-agent skill to record this agreed outcome in this Claude conversation: a one-page draft that a reviewer can read without staying at the screen. The current scope is only to create its Root Goal with a concrete criterion and leave one short Comment explaining that drafting is a later step. Do not create the draft or child Goals. Native project hooks are already prepared; the stable command prefix is ${prefix}. Keep the current conversation. Do not start a server, enable Auto mode, change settings, or contact anyone. When the Root and Comment are saved, finish.`;
 const entry=prepared.launcher,q=s=>`'${s.replaceAll("'","'\\''")}'`;
 const allowed=['Skill(chill-agent)',`Read(${skill}/**)`,`Bash(node ${q(join(skill,'scripts/start.mjs'))} guide *)`,`Bash(${q(process.execPath)} ${q(join(skill,'scripts/start.mjs'))} guide *)`,`Bash(${process.execPath} ${join(skill,'scripts/start.mjs')} guide *)`,`Bash(${prefix} *)`,`Bash(${process.execPath} ${entry} *)`,`Bash(${q(process.execPath)} ${q(entry)} *)`,`Bash(node ${q(entry)} *)`];
 async function converse(prompt,resume){
 phase=resume?'web-conversation':'conversation';stream='';child=spawn(values.claude,['--print','--verbose','--output-format','stream-json','--max-budget-usd','0.80',...(auth?.model?['--model',auth.model]:[]),...(values['sqlite-web']?[]:['--no-session-persistence']),...(resume?['--resume',resume]:[]),'--setting-sources','project,local','--strict-mcp-config','--mcp-config','{"mcpServers":{}}','--tools','Bash,Read,Skill','--allowedTools',...allowed,'--no-chrome',prompt],{env,cwd,stdio:['ignore','pipe','pipe'],detached:true});
 const ended=new Promise(r=>{child.on('error',()=>r({spawnError:true}));child.on('exit',(code,signal)=>r({code,signal}));});
 child.stderr.on('data',c=>stderrBytes+=c.length);
 child.stdout.on('data',chunk=>{stream+=chunk.toString();if(stream.length>2*1024*1024){child.kill();return;}let i;while((i=stream.indexOf('\n'))>=0){const line=stream.slice(0,i);stream=stream.slice(i+1);if(!line.trim())continue;let m;try{m=JSON.parse(line);}catch{continue;}
  if(m.type==='result')results.push(m);
  if(m.type==='system'&&m.subtype==='init')discovered.push(...(m.slash_commands||[]).filter(x=>typeof x==='string'&&x.includes('chill-agent')));
  for(const c of m.message?.content||[])if(c.type==='tool_result'&&!c.is_error){
   const returned=typeof c.content==='string'?c.content:(c.content||[]).filter(x=>x.type==='text').map(x=>x.text).join('\n');
   for(const guide of guideBodies)if(returned.includes(guide.body.trim())){reads.push(guide.path);readEvidence.push({path:guide.path,tool:toolsById.get(c.tool_use_id)||'unknown',bytesMatched:true,confirmed:true});}
  }
  for(const c of m.message?.content||[])if(c.type==='tool_use'){
   toolNames.add(c.name);toolsById.set(c.id,c.name);
   if(c.name==='Skill')skills.push(c.input?.skill);
   if(c.name==='Bash'){
    calls.push(safeCommand(c.input?.command));

   }
  }
 }});
 timer=setTimeout(()=>{try{process.kill(-child.pid,'SIGTERM');}catch{}},180000);
 exit=await ended;clearTimeout(timer);
 }
 await converse(prompt);
 phase='verify';
 const readRecords=async()=>JSON.parse((await execute(process.execPath,['--input-type=module','-e',`import {listStoredGoals} from ${JSON.stringify(pathToFileURL(join(plugin,'lib/goal-store.mjs')).href)};console.log(JSON.stringify(await listStoredGoals()));`],{env,cwd,timeout:15000,maxBuffer:2*1024*1024})).stdout);
 const goals=await readRecords(),goal=goals[0],ids=goals.map(g=>g.id),feedback=goals.flatMap(g=>g.conversation);
 let continuation=false;try{continuation=JSON.parse(await readFile(join(data,'workspace/continuation',`${goal.id}.json`),'utf8')).enabled===true;}catch{}
 report.goal={title:goal.title,scope:goal.scope,criteria:goal.criteria};report.comments=feedback.filter(e=>e.author==='agent'&&e.type==='comment').map(e=>e.text);
 report.checks={skillDiscovered:discovered.includes('chill-agent'),skillInvoked:skills.includes('chill-agent'),selectedInterfaceRead:readEvidence.some(e=>e.path==='runtime-interface:claude-code'&&e.confirmed),oneRoot:ids.length===1&&!goal.parentId,agreedCriterion:typeof goal.criteria==='string'&&goal.criteria.trim().length>10,nativeOwnership:goal.connection?.harnessId==='claude-code'&&goal.connection.sessionId===results[0]?.session_id&&goal.threadId===null,oneSavedComment:feedback.filter(e=>e.author==='agent'&&e.goalId===goal.id&&e.type==='comment').length===1,noCodexActions:!calls.some(c=>['goal assign','goal work','goal create'].includes(c.action)&&!c.helpOnly),autoRemainsOff:!continuation,noServerStarted:!calls.some(c=>c.action==='server start'),nativeSuccess:exit.code===0&&results.length===1&&!results[0].is_error};
 if(values['sqlite-web']){
  phase='web';
  const {once}=await import('node:events');
  server=spawn(process.execPath,[join(plugin,'server.mjs'),'--local'],{env:{...env,PORT:'0'},cwd,stdio:['ignore','pipe','pipe']});
  const url=await new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>reject(Error('Web startup timed out')),15000);
   server.stdout.on('data',b=>{const m=String(b).match(/http:\/\/127\.0\.0\.1:\d+/);if(m){clearTimeout(timeout);resolve(m[0]);}});
   server.once('error',error=>{clearTimeout(timeout);reject(error);});server.once('exit',()=>{clearTimeout(timeout);reject(Error('Web exited'));});
  });
  const marker='SQLITE_WEB_ROUNDTRIP_OK';
  const response=await fetch(url+'/api/goals/'+goal.id+'/feedback',{method:'POST',headers:{'Content-Type':'application/json',Origin:url},body:JSON.stringify({text:'Please save one Comment with exactly '+marker+'. Then record this feedback activity as completed. Do not create another Root or enable Auto mode.'}),signal:AbortSignal.timeout(15000)});
  if(response.status!==201)throw Error('Web feedback was not saved');
  const receipt=await response.json();
  await converse('Read the existing Goal context using the prepared launcher. Handle pending Web feedback in this same conversation, using its activity receipt. Keep the original Root and finish after reporting the requested result.',results[0]?.session_id);
  phase='verify-web';
  const webGoals=await (await fetch(url+'/api/goals?view=web&history=paged',{signal:AbortSignal.timeout(15000)})).json();
  const deliveries=await (await fetch(url+'/api/goals/'+goal.id+'/deliveries',{signal:AbortSignal.timeout(15000)})).json();
  const saved=webGoals.find(g=>g.id===goal.id)?.conversation||[];
  const end=once(server,'exit');server.kill();await end;server=null;
  // A new reader after shutdown proves persistence, not only the Web response.
  const reopened=await readRecords();
  report.checks.webSaved=response.status===201;
  report.checks.webReply=saved.filter(e=>e.author==='agent'&&e.type==='comment'&&e.text.trim()===marker).length===1;
  report.checks.feedbackCompleted=deliveries.some(d=>d.eventId===receipt.feedback.id&&d.status==='completed');
  report.checks.sameNativeSession=results.length===2&&results[1].session_id===results[0].session_id&&exit.code===0&&!results[1].is_error;
  report.checks.persistedReply=reopened.length===1&&reopened[0].conversation.some(e=>e.text.trim()===marker);
  const {access}=await import('node:fs/promises');await access(join(data,'workspace/workspace.sqlite'));
  report.checks.sqliteDatabase=true;
  report.scope='Isolated SQLite standalone skill and Web feedback roundtrip through the same resumed native session. Requires explicit resume stimulus; not unattended idle reception, production installation or migration.';
 }
 report.passed=Object.values(report.checks).every(Boolean);
}catch(error){report.passed=false;report.failure={phase,code:error.code??null,resource:error.path?relative(base,error.path):null,message:'Raw native output withheld.'};}
finally{if(server)server.kill();clearTimeout(timer);report.discovered=discovered;report.toolNames=[...toolNames];report.readEvidence=readEvidence;report.skills=skills;report.reads=[...new Set(reads)];report.calls=calls;report.nativeResults=results.map(r=>({isError:r.is_error===true,subtype:r.subtype,sessionId:r.session_id,costUSD:r.total_cost_usd,permissionDenials:(r.permission_denials||[]).map(d=>({tool:d.tool_name,...(d.tool_name==='Bash'?safeCommand(d.tool_input?.command):{})}))}));report.stderrBytes=stderrBytes;if(child?.pid)try{process.kill(-child.pid,'SIGTERM');}catch{}await new Promise(r=>setTimeout(r,300));await rm(base,{recursive:true,force:true});}
console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;
