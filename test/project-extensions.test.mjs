import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {prepareProject} from '../lib/project-workspace.mjs';
import {registeredExtensions} from '../lib/extension-registry.mjs';
import {connectionExtensions} from '../lib/connection-extensions.mjs';
import {notificationProvider} from '../lib/notification-provider.mjs';

test('project selection restricts Web, native hooks and notification routes independently',async t=>{
 const base=await mkdtemp(join(tmpdir(),'chill-project-extensions-'));
 const previous=process.env.CHILL_AGENT_DATA_DIR;
 t.after(async()=>{if(previous===undefined)delete process.env.CHILL_AGENT_DATA_DIR;else process.env.CHILL_AGENT_DATA_DIR=previous;await rm(base,{recursive:true,force:true});});
 const a=join(base,'a'),b=join(base,'b');await mkdir(a);await mkdir(b);
 process.env.CHILL_AGENT_DATA_DIR=await prepareProject(a,{base,extensions:[]});
 assert.deepEqual(registeredExtensions(),[]);assert.deepEqual(await connectionExtensions(),{});
 assert.equal((await (await notificationProvider()).prepare('1',1)).enabled,false);
 process.env.CHILL_AGENT_DATA_DIR=await prepareProject(b,{base,extensions:['public-link']});
 assert.deepEqual(registeredExtensions({tunnel:{}}).map(x=>x.id),['public-link']);
 assert.deepEqual(await connectionExtensions(),{});
 await prepareProject(b,{base,extensions:['web-notifications']});
 assert.deepEqual(registeredExtensions().map(x=>x.id),['web-notifications']);
 await assert.rejects(async()=> (await notificationProvider()).configure('1',{}),/disabled for this project/);
});
