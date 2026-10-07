import assert from 'node:assert/strict';
import {readFile,readdir,lstat,access} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {checkSkill} from './check-skill.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const skill='skills/chill-agent',source=join(root,'plugins/chill-agent',skill);
async function files(dir){
 const result=[];for(const name of await readdir(dir)){const path=join(dir,name),stat=await lstat(path);assert(!stat.isSymbolicLink(),'Shipped guides must not escape through symlinks');if(stat.isDirectory())for(const child of await files(path))result.push(`${name}/${child}`);else result.push(name);}return result.sort();
}
const expected=await files(source);
for(const target of ['dist/runtime','dist/codex/chill-agent','dist/claude/chill-agent']){
 const at=join(root,target,skill);assert.deepEqual(await files(at),expected);
 for(const file of expected)assert.deepEqual(await readFile(join(at,file)),await readFile(join(source,file)),`${target}/${file}`);
 await checkSkill(at);
}
const native=join(root,'dist/claude/chill-agent'),manifest=JSON.parse(await readFile(join(native,'.claude-plugin/plugin.json'),'utf8'));
assert.equal(manifest.name,'chill-agent');assert.equal(manifest.version,JSON.parse(await readFile(join(root,'package.json'),'utf8')).version);
assert.equal(manifest.hooks,undefined);assert.equal(manifest.settings,undefined);
for(const file of ['hooks/hooks.json','.codex-plugin/plugin.json','test'])await assert.rejects(access(join(native,file)));
for(const file of ['bin/chill-setup.mjs','bin/chill-connection.mjs','lib/claude-setup.mjs','lib/claude-continuation.mjs','extensions.json'])await access(join(native,file));
assert(JSON.parse(await readFile(join(root,'package.json'),'utf8')).files.includes('dist/claude'));
console.log(`Verified identical ${expected.length}-file skills in runtime and both plugins, isolated metadata and explicit hook setup.`);
const standalone=join(root,'dist/skills/chill-agent');
for(const file of expected)assert.deepEqual(await readFile(join(standalone,file)),await readFile(join(source,file)),`standalone/${file}`);
for(const file of ['bin/chill-setup.mjs','bin/chill-server.mjs','extensions.json','skills/chill-agent/SKILL.md','public/themes.css'])await access(join(standalone,'scripts/runtime',file));
for(const file of ['test','.claude-plugin','.codex-plugin','skills/chill-agent/scripts/runtime'])await assert.rejects(access(join(standalone,'scripts/runtime',file)));
assert(JSON.parse(await readFile(join(root,'package.json'),'utf8')).files.includes('dist/skills'));
console.log('Verified self-contained standalone skill and non-recursive runtime.');
