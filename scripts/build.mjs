import {copyRuntime} from '@game-dev-rta-club/chill-agent-cli/runtime';
import {cp,mkdir,rm,writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const cli=dirname(dirname(fileURLToPath(import.meta.resolve('@game-dev-rta-club/chill-agent-cli/runtime'))));
const version=JSON.parse(await readFile(join(root,'package.json'),'utf8')).version;
const target=join(root,'dist/runtime');
await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});
await copyRuntime(cli,target);
await cp(join(root,'lib'),join(target,'lib'),{recursive:true});
await cp(join(root,'bin/chill-monitor.mjs'),join(target,'bin/chill-monitor.mjs'));
await writeFile(join(target,'extensions.json'),JSON.stringify({modules:['./lib/continuation-extension.mjs','./lib/notifications.mjs'],notificationProvider:'./lib/notifications.mjs',commands:{monitor:'bin/chill-monitor.mjs'},help:{monitor:{summary:'Optional continuation checks.',detail:'Use chill monitor --help for controls and internal results.'}}}));
if(process.argv.includes('--test'))await cp(join(root,'test'),join(target,'test'),{recursive:true});
for(const name of ['chill-agent','chill-agent-message-setup']){
 const plugin=join(root,'dist/codex',name);await rm(plugin,{recursive:true,force:true});
 await cp(join(root,'plugins',name),plugin,{recursive:true});
 if(name==='chill-agent'){await cp(target,plugin,{recursive:true});await rm(join(plugin,'test'),{recursive:true,force:true});}
 else for(const file of ['bin/chill-link.mjs','lib/data-directory.mjs','lib/cli-help.mjs']){await mkdir(dirname(join(plugin,file)),{recursive:true});await cp(join(target,file),join(plugin,file));}
 const metadata=join(plugin,'.codex-plugin/plugin.json');
 const manifest=JSON.parse(await readFile(metadata,'utf8'));manifest.version=version;await writeFile(metadata,JSON.stringify(manifest,null,2)+'\n');
}
console.log('Built CLI + optional continuation policy');
