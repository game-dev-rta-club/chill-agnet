import {continuationExcerpt} from './continuation-excerpt.mjs';
// Optional policy layer. The harness adapter supplies facts; this module decides when to ask.
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {requireProtocol,storage,policyLock as withAgentControlLock,observe as continuationObservation,eligibility as continuationEligibility,enqueue as enqueueContinuation,dataDirectory,validThreadId,readGoalContext} from '@game-dev-rta-club/chill-agent-cli/extension-api';
requireProtocol(1);
const journal=storage('continuation');
export const readMonitor=journal.read;
const save=journal.write;
export async function configureMonitor(id,enabled){
 const {root,goal}=await readGoalContext(id);if(root.id!==goal.id||!root.threadId)throw Error('An assigned Root Goal is required.');
 return withAgentControlLock(root.threadId,async()=>{
  const old=await readMonitor(id);
  // Enabling does not erase an uncertain transmission or reset the attempt cap.
  const next={...old,rootId:id,threadId:root.threadId,enabled,attempts:old?.attempts||[],idleSince:null,updatedAt:new Date().toISOString()};
  await save(id,next);return next;
 });
}
const quote=value=>"'"+String(value).replaceAll("'", "'\\''")+"'";
export function continuationMessage(f,attempt,id){
 const command=`PORT=${quote(process.env.PORT||'4173')} CHILL_AGENT_DATA_DIR=${quote(dataDirectory())} ${quote(process.execPath)} ${quote(join(dataDirectory(),'runtime','chill.mjs'))}`;
 const letters=f.context?.letters||[],goals=f.context?.goals;
 const filter=goals?.unfinished?' --state unfinished':letters.length?' --letters':'';
 // Older CLI releases do not expose the compact review contract. Their tree is still bounded to metadata.
 const review=goals?`chill goal review --id ${f.rootId}${filter}`:`chill goal tree --id ${f.rootId}`;
 const state=!goals?'Revisit the agreed work and carry on with anything you can move forward.'
  :goals.unfinished?`There ${goals.unfinished===1?'is 1 unfinished Goal':`are ${goals.unfinished} unfinished Goals`}${goals.waiting?`, including ${goals.waiting} Waiting`:''}. Start with the short list below and pick up anything you can move forward.`
  :letters.length?'Every Goal is marked Done, but there are still questions waiting for the user. Review those Letters and look for work you can advance independently.'
  :'Every Goal is marked Done, and no Letters are waiting for the user. Check for a concrete omission in the agreed outcome; otherwise leave the project at rest.';
 const waiting=letters.length?'\nWaiting for your user’s answer: '+letters.slice(0,3).map(l=>`Goal #${l.goalId}: “${continuationExcerpt(l.title,100)}”`).join('; ')+(letters.length>3?`; and ${letters.length-3} more.`:'.')+'\n':'';
 return `=== chill-agent · Keep going ===

${state}
${waiting}${attempt===2?'\nBefore you stop, take one more look. The user is counting on you to carry the agreed work through. A missed step may stay unfinished until they return. Reread the skill if needed, open the relevant Goal, and act on what you find.\n':''}
Your run has ended, with no messages being delivered or queued and no manual pause detected.

1. Read the index below, then open a relevant Goal with \`chill goal show --id <GOAL> --format text\`. The output links to older discussion when needed.
2. Select work with \`chill goal work --id <GOAL>\` and continue it. If the outcome is achieved, check its success criteria and mark it Done. Child completion alone does not complete a parent.
3. If a user decision is needed, send a Letter with \`chill goal letter --id <GOAL> --title '<question>' --text '<details>'\`. Do not duplicate questions; continue independent work while waiting. Preserve other Goals’ queues and manual pauses.

\`\`\`sh
chill() { ${command} "$@"; }
${review}
\`\`\`

Save actual results to the Web, then return the outcome below. If there is no work, replace \`worked\` with \`no-work\` and do not post a no-work report to the Web. This check does not expand the agreed scope.
\`\`\`sh
chill monitor result --id ${f.rootId} --attempt ${id} --outcome worked
\`\`\``;
}

export async function reportMonitorResult(rootId,attemptId,outcome,threadId=process.env.CODEX_THREAD_ID){
 validThreadId(attemptId);
 if(!['worked','no-work'].includes(outcome))throw Error('Outcome must be worked or no-work.');
 const before=await readMonitor(rootId);
 if(!before||before.threadId!==threadId)throw Error('Result must come from the assigned chat.');
 return withAgentControlLock(before.threadId,async()=>{
  const state=await readMonitor(rootId);
  if(state.threadId!==threadId)throw Error('Assignment changed.');
  const attempt=state.attempts.find(a=>a.id===attemptId)||state.history?.find(a=>a.id===attemptId);
  if(!attempt)throw Error('Unknown monitor attempt.');
  if(attempt.result){
   if(attempt.result.outcome!==outcome)throw Error('A different result is already recorded.');
   return attempt.result;
  }
  attempt.result={outcome,at:new Date().toISOString()};
  await save(rootId,state);return attempt.result;
 });
}
export function createMonitorRunner({read=readMonitor,write=save,observe=continuationObservation,send=enqueueContinuation,lock=withAgentControlLock,now=Date.now}={}){
 return async rootId=>{
  const configured=await read(rootId);if(!configured?.enabled)return {status:'disabled'};
  return lock(configured.threadId,async()=>{
   let state=await read(rootId);if(!state?.enabled)return {status:'disabled'};
   const last=state.attempts.at(-1);let facts;
   try{facts=await observe(rootId,last);}catch(error){state={...state,idleSince:null,status:'unknown',error:error.message,checkedAt:new Date(now()).toISOString()};await write(rootId,state);return state;}
   if(facts.threadId!==state.threadId){state={...state,enabled:false,status:'assignment-changed'};await write(rootId,state);return state;}
   const time=now();const status=continuationEligibility(facts);
   state={...state,checkedAt:new Date(time).toISOString(),facts,error:null,status};
   // Recover via positive native evidence only. A missing receipt never permits a resend.
   if(last&&facts.pendingWork?.endedAt){last.completedAt=facts.pendingWork.endedAt;last.phase='completed';}
   if(last&&facts.pendingWork&&!facts.pendingWork.endedAt)last.phase='running';
   if(last&&facts.queue.some(q=>q.messageId===last.id))last.phase='queued';
   const unresolved=last&&!last.completedAt;
   // Only user feedback and substantive Goal/Brief content define a revision.
   // Never discard an unresolved send when the revision changes.
   if(!unresolved&&facts.revision!==state.revision){
    state.history=[...(state.history||[]),...state.attempts];state.attempts=[];state.revision=facts.revision;
   }
   if(status!=='idle'){state.idleSince=null;await write(rootId,state);return state;}
   if(unresolved){state.status='awaiting-receipt';state.idleSince=null;await write(rootId,state);return state;}
   if(state.attempts.length>=2){state.status='exhausted';await write(rootId,state);return state;}
   const key=JSON.stringify([facts.turn.id,facts.revision]);
   // A fresh full snapshot under the same lock immediately before enqueueing.
   let fresh;try{fresh=await observe(rootId,null);}catch(error){state.status='unknown';state.idleSince=null;state.error=error.message;await write(rootId,state);return state;}
   if(fresh.threadId!==state.threadId||continuationEligibility(fresh)!=='idle'||JSON.stringify([fresh.turn.id,fresh.revision])!==key){state.status='changed';state.idleSince=null;await write(rootId,state);return state;}
   const attempt={id:randomUUID(),at:new Date(time).toISOString(),phase:'sending'};
   const text=continuationMessage(fresh,state.attempts.length+1,attempt.id);
   state.attempts.push(attempt);state.idleSince=null;state.status='sending';state.facts=fresh;
   await write(rootId,state); // durable reservation before side effect
   try{const result=await send(fresh,text,attempt.id);if(!result?.queuedSubmission?.id)throw Error('No queue receipt');attempt.queueId=result.queuedSubmission.id;attempt.phase='queued';state.status='queued';}
   catch(error){attempt.phase='uncertain';state.status='uncertain';state.error=error.message;}
   await write(rootId,state);return state;
  });
 };
}
export const tickMonitor=createMonitorRunner();
