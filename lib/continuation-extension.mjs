import {listGoals,readGoalContext,observe as continuationObservation,touch as hostTouch} from '@game-dev-rta-club/chill-agent-cli/extension-api';
import {configureMonitor,readMonitor,tickMonitor} from './continuation-monitor.mjs';
import {monitorService} from './continuation-service.mjs';

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
  async read(goalId){const {root}=await context(goalId);if(!root.threadId)return null;const state=await read(root.id);return {rootId:root.id,enabled:Boolean(state?.enabled),placement:'header',icon:'repeat'};},
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
