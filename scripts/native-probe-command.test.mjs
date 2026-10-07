import test from 'node:test';
import assert from 'node:assert/strict';
import {probeCommand} from './native-probe-command.mjs';
const launcher='/tmp/prepared/runtime/chill.mjs';
test('only simple prepared help is distinguished from a mutation attempt',()=>{
 assert.equal(probeCommand(`node '${launcher}' goal create --help`,launcher).helpOnly,true);
 for(const text of [`node '${launcher}' goal create --title Test`,`node '${launcher}' goal create --help; node '${launcher}' goal create`,`node '${launcher}' goal create --help\nnode '${launcher}' goal work`,`node '${launcher}' goal create --help $(touch file)`,`node /other/chill.mjs goal create --help`])assert.equal(probeCommand(text,launcher).helpOnly,false);
 assert.equal(probeCommand(`node '${launcher}' goal create --title secret`,launcher).action,'goal create');
 assert.ok(!JSON.stringify(probeCommand('secret',launcher)).includes('secret'));
});
