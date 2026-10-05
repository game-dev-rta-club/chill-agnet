import {listGoals,readGoalContext,observe as continuationObservation,touch as hostTouch} from '@game-dev-rta-club/chill-agent-cli/extension-api';
import {configureMonitor,readMonitor,tickMonitor} from './continuation-monitor.mjs';
import {monitorService} from './continuation-service.mjs';

export function continuationActivity(state,now=Date.now()){
 const labels={running:'Agent running',queued:'Queue pending','feedback-pending':'Delivery pending',paused:'Paused',exhausted:'Checks complete',idle:'Watching',sending:'Sending','awaiting-receipt':'Awaiting confirmation',uncertain:'Delivery unconfirmed',unknown:'Status unavailable',changed:'Checking','assignment-changed':'Agent changed'};
 const entries=[...(state?.history||[]),...(state?.attempts||[])].slice().reverse().slice(0,20).map(a=>({
  id:a.id,at:a.at,summary:a.summary||'Automatic check',message:a.message||null,
  status:a.result?'Result received':a.completedAt?'Run ended':({sending:'Sending',queued:'Queued',running:'Last seen running',uncertain:'Delivery unconfirmed'}[a.phase]||'Status unavailable'),
  result:a.result?{label:a.result.outcome==='worked'?'Work reported':'No work reported',at:a.result.at}:null,
 }));
 return {label:'AutoContinue',status:!state?.enabled?'Off':now-Date.parse(state.checkedAt)>90000||!state.checkedAt?'Checking':labels[state.status]||'Checking',checkedAt:state?.checkedAt||null,entries,total:(state?.history?.length||0)+(state?.attempts?.length||0)};
}

export function continuationKeepsAlive(f,state){
 // Active work is protected even when automatic nudges are disabled.
 if(f.queue.length||f.heartbeatFresh||f.harnessState==='active'||f.turn&&f.turn.completedAt==null)return true;
 if(f.pendingFeedback.length&&!f.paused)return true;
 if(!f.stable||!['idle','notLoaded','active'].includes(f.harnessState))return true;
 if(!state?.enabled||f.paused)return false;
 const last=state.attempts?.at(-1);
 if(last&&!last.completedAt&&!f.pendingWork?.endedAt)return true;
 return state.revision!==f.revision||(state.attempts?.length||0)<2;
}
export function createContinuationExtension({roots=async()=>(await listGoals()).filter(g=>!g.parentId&&g.threadId),context=readGoalContext,read=readMonitor,configure=configureMonitor,tick=tickMonitor,observe=continuationObservation,retireLegacy=async id=>{if(process.platform==='darwin')await monitorService(id,'stop');},touch=hostTouch}={}){
 const ready=new Set();
 async function prepare(root){if(!ready.has(root.id)){await retireLegacy(root.id);ready.add(root.id);}}
 return {
  id:'continuation',label:'Auto-continue',
  async start(){for(const root of await roots())await prepare(root);},
  async tick(){for(const root of await roots()){await prepare(root);await tick(root.id);}},
  async read(goalId,{activity=false}={}){const {root}=await context(goalId);if(!root.threadId)return null;const stored=await read(root.id);const state=stored?.threadId===root.threadId?stored:null;return {rootId:root.id,enabled:Boolean(state?.enabled),placement:'header',icon:'repeat',...(activity?{activity:continuationActivity(state)}:{})};},
  async set(goalId,input){const {root}=await context(goalId);if(input.rootId!==root.id)throw Error('Goal moved. Refresh to retry.');await prepare(root);await configure(root.id,input.enabled);await touch();},
  async busy(){
   for(const root of await roots()){
    const state=await read(root.id);
    // A failed observation is not proof that work has stopped.
    try{if(continuationKeepsAlive(await observe(root.id,state?.attempts?.at(-1)),state))return true;}catch{return true;}
   }
   return false;
  },
 };
}

export const createExtension=createContinuationExtension;
