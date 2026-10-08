import {execFileSync} from 'node:child_process';
import * as extensionApi from '@game-dev-rta-club/chill-agent-cli/extension-api';
import {createRequire} from 'node:module';
import {copyRuntime} from '@game-dev-rta-club/chill-agent-cli/runtime';
import {cp,mkdir,rm,writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {dirname,join} from 'node:path';
import {checkSkill} from './check-skill.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const cli=dirname(dirname(fileURLToPath(import.meta.resolve('@game-dev-rta-club/chill-agent-cli/runtime'))));
const version=JSON.parse(await readFile(join(root,'package.json'),'utf8')).version;
await checkSkill(join(root,'plugins/chill-agent/skills/chill-agent'));
if(!['public-origin','agent-guidance','goal-context','run-output','connection-hooks','project-isolation'].every(cap=>extensionApi.extensionCapabilities?.includes(cap)))throw Error('Install a CLI archive with public-origin, agent-guidance, goal-context, run-output and connection-hooks support before building. See docs/development/two-repositories.md.');
const target=join(root,'dist/runtime');
await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});
await copyRuntime(cli,target);
await cp(join(root,'lib'),join(target,'lib'),{recursive:true});
await cp(join(root,'extensions'),join(target,'extensions'),{recursive:true});
await cp(join(root,'plugins/chill-agent/skills'),join(target,'skills'),{recursive:true});
const {marked}=await import(pathToFileURL(createRequire(join(target,'package.json')).resolve('marked')).href);
for(const [source,output] of [['public-link','guide'],['notifications','notifications']]){
 const markdown=(await readFile(join(root,`docs/using/${source}.md`),'utf8')).replace(/^---[\s\S]*?---\n/,'');
 const html=marked.parse(markdown).replaceAll('href="notifications.md"','href="notifications.html"').replaceAll('href="public-link.md"','href="guide.html"');
 await writeFile(join(target,`extensions/public-link/${output}.html`),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>chill-agent · ${source}</title><link rel="stylesheet" href="/extensions/public-link/guide.css"><main>${html}</main></html>`);
}
// Carry application dependencies through the same immutable-runtime copier.
const appLock=JSON.parse(await readFile(join(root,'package-lock.json'),'utf8'));
const runtimeLock=JSON.parse(await readFile(join(target,'npm-shrinkwrap.json'),'utf8'));
for(const [path,pkg] of Object.entries(appLock.packages)){
 if(!path.startsWith('node_modules/')||pkg.dev||path==='node_modules/@game-dev-rta-club/chill-agent-cli')continue;
 await cp(join(root,path),join(target,path),{recursive:true});runtimeLock.packages[path]=pkg;
}
await writeFile(join(target,'npm-shrinkwrap.json'),JSON.stringify(runtimeLock,null,2)+'\n');
for(const entry of ['chill-monitor','chill-session'])await cp(join(root,`bin/${entry}.mjs`),join(target,`bin/${entry}.mjs`));
await writeFile(join(target,'extensions.json'),JSON.stringify({agentGuide:'skills/chill-agent/SKILL.md',connectionExtensions:{continuation:'./lib/claude-continuation.mjs'},modules:['./lib/continuation-extension.mjs','./lib/notifications.mjs','./lib/web-notifications.mjs','./lib/public-link-extension.mjs'],notificationProvider:'./lib/notification-routes.mjs',commands:{monitor:'bin/chill-monitor.mjs',session:'bin/chill-session.mjs'},help:{session:{summary:'Selected harness operations and first-use preparation.',detail:'Use chill session --help for the supported harness IDs and interface.'},monitor:{summary:'Optional continuation checks.',detail:'Use chill monitor --help for controls and internal results.'}}}));
if(process.argv.includes('--test'))await cp(join(root,'test'),join(target,'test'),{recursive:true});
// Recreate the generated plugin directory so retired plugins cannot ship again.
await rm(join(root,'dist/codex'),{recursive:true,force:true});
const plugin=join(root,'dist/codex/chill-agent');
await cp(join(root,'plugins/chill-agent'),plugin,{recursive:true});
await cp(target,plugin,{recursive:true});await rm(join(plugin,'test'),{recursive:true,force:true});
const metadata=join(plugin,'.codex-plugin/plugin.json');
const manifest=JSON.parse(await readFile(metadata,'utf8'));manifest.version=version;await writeFile(metadata,JSON.stringify(manifest,null,2)+'\n');
// Both hosts receive the identical shared skill and composed runtime. Native
// hooks are explicit project setup, not plugin-load side effects.
await rm(join(root,'dist/claude'),{recursive:true,force:true});
const claudePlugin=join(root,'dist/claude/chill-agent');
await cp(target,claudePlugin,{recursive:true});
await rm(join(claudePlugin,'test'),{recursive:true,force:true});
await cp(join(root,'plugins/claude-code/.claude-plugin'),join(claudePlugin,'.claude-plugin'),{recursive:true});
const claudeMetadata=join(claudePlugin,'.claude-plugin/plugin.json');
const claudeManifest=JSON.parse(await readFile(claudeMetadata,'utf8'));
claudeManifest.version=version;await writeFile(claudeMetadata,JSON.stringify(claudeManifest,null,2)+'\n');
// Standalone skills pin an npm-installable runtime instead of copying its dependencies.
await rm(join(root,'dist/skills'),{recursive:true,force:true});
const standalone=join(root,'dist/skills/chill-agent');
await cp(join(root,'plugins/chill-agent/skills/chill-agent'),standalone,{recursive:true});
const commit=process.env.CHILL_SKILL_REVISION||execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
if(!/^[a-f0-9]{40}$/.test(commit))throw Error('Full runtime commit required.');
await writeFile(join(standalone,'scripts/runtime.json'),JSON.stringify({name:'@game-dev-rta-club/chill-agent',spec:`git+https://github.com/game-dev-rta-club/chill-agnet.git#${commit}`},null,2)+'\n');
console.log('Built standalone skill, CLI + optional continuation policy, Codex plugin and experimental Claude plugin');
