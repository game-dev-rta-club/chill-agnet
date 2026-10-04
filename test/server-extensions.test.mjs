import test from 'node:test';
import assert from 'node:assert/strict';
import {createExtensionHost} from '../lib/server-extensions.mjs';
import {createContinuationExtension,continuationKeepsAlive} from '../lib/continuation-extension.mjs';
const idle=()=>({queue:[],pendingFeedback:[],stable:true,harnessState:'idle',turn:{completedAt:1},revision:'r'});
const exhausted=()=>({enabled:true,revision:'r',attempts:[{completedAt:1},{completedAt:2}]});
test('monitor enablement is not a keepalive; actual work and unspent nudges are',()=>{
 assert.equal(continuationKeepsAlive(idle(),exhausted()),false);
 assert.equal(continuationKeepsAlive(idle(),{...exhausted(),revision:'old'}),true);
 assert.equal(continuationKeepsAlive(idle(),{enabled:true,revision:'r',attempts:[]}),true);
 assert.equal(continuationKeepsAlive({...idle(),paused:true},{enabled:true}),false);
 for(const patch of [{queue:[{}]},{pendingFeedback:[{}]},{heartbeatFresh:true},{harnessState:'active'},{turn:{completedAt:null}},{stable:false}])assert.equal(continuationKeepsAlive({...idle(),...patch},{enabled:false}),true);
 assert.equal(continuationKeepsAlive({...idle(),paused:true,pendingFeedback:[{}]},{enabled:false}),false);
 assert.equal(continuationKeepsAlive(idle(),{...exhausted(),attempts:[{phase:'uncertain'}]}),true);
});
test('host does not overlap ticks, waits for running work on stop, and rejects further writes',async()=>{
 let release,calls=0,stops=0;
 const host=createExtensionHost([{id:'test',label:'Test',read:async()=>({enabled:false}),set:async()=>{},tick:()=>{calls++;return new Promise(r=>release=r);},stop:()=>stops++}]);
 const first=host.tick(),second=host.tick();assert.equal(calls,1);assert.equal(await host.busy(),true);
 let ended=false;const stopping=host.stop().then(()=>ended=true);await Promise.resolve();assert.equal(ended,false);
 release();await Promise.all([first,second,stopping]);assert.equal(stops,1);await host.tick();assert.equal(calls,1);
 await assert.rejects(host.change('1','test',{enabled:true}),/shutting down/);
});
test('child control maps to its Root; existing state/counters survive toggle and old process retires once',async()=>{
 const state=exhausted(),retired=[],ticks=[];
 const ext=createContinuationExtension({roots:async()=>[{id:'1'}],context:async()=>({root:{id:'1',threadId:'t'}}),read:async()=>state,configure:async(id,on)=>{assert.equal(id,'1');state.enabled=on;},tick:async id=>ticks.push(id),retireLegacy:async id=>retired.push(id),touch:async()=>{},observe:async()=>idle()});
 await ext.start();await ext.tick();await ext.tick();assert.deepEqual(retired,['1']);assert.equal(ticks.length,2);
 const control=await ext.read('2');assert.equal(control.rootId,'1');
 await ext.set('2',{rootId:'1',enabled:false});assert.equal((await ext.read('1')).enabled,false);assert.equal(state.attempts.length,2);
 await ext.set('2',{rootId:'1',enabled:true});assert.equal(await ext.busy(),false);
 await assert.rejects(ext.set('2',{rootId:'3',enabled:true}),/Goal moved/);
});
test('empty registry works, isolated tick failure does not stop other extensions',async()=>{
 assert.deepEqual(await createExtensionHost([]).controls('1'),[]);
 let ticks=0,errors=0;const host=createExtensionHost([{id:'bad',read:async()=>null,tick:async()=>{throw Error('bad');}},{id:'good',read:async()=>({enabled:false}),tick:async()=>ticks++}],{onError:()=>errors++});
 await host.tick();assert.equal(ticks,1);assert.equal(errors,1);assert.equal((await host.controls('1')).length,1);
});
