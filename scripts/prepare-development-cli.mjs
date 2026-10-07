import {execFileSync} from 'node:child_process';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

export function validateInput(input) {
  if (input?.repository !== 'https://github.com/game-dev-rta-club/chill-agent-cli.git'
    || !/^[a-f0-9]{40}$/.test(input?.commit || '')) {
    throw new Error('Development CLI input needs the official repository and a full immutable commit SHA.');
  }
  return input;
}
export function exportCommit(repository,commit,archive) {
  if(!/^[a-f0-9]{40}$/.test(commit))throw new Error('Full commit SHA required.');
  const actual=execFileSync('git',['-C',repository,'rev-parse','--verify',`${commit}^{commit}`],{encoding:'utf8'}).trim();
  if(actual!==commit)throw new Error('CLI commit did not resolve exactly.');
  execFileSync('git',['-C',repository,'archive','--format=tar',`--output=${archive}`,commit]);
}
export async function prepare({root=fileURLToPath(new URL('../',import.meta.url)),source, npmCli=process.env.npm_execpath}={}) {
  if(!npmCli)throw new Error('Run through npm run cli:development so the same npm executable is used.');
  const input=validateInput(JSON.parse(await readFile(join(root,'development-cli.json'),'utf8')));
  const directory=await mkdtemp(join(tmpdir(),'chill-development-cli-'));
  const run=(command,args,cwd=directory)=>execFileSync(command,args,{cwd,stdio:'inherit'});
  const npm=(args,cwd)=>run(process.execPath,[npmCli,...args],cwd);
  const tracked=await Promise.all(['package.json','package-lock.json'].map(name=>readFile(join(root,name))));
  try {
    let repository=source&&resolve(source);
    if(!repository){
      repository=join(directory,'repository');
      run('git',['init',repository]);
      run('git',['-C',repository,'fetch','--depth=1',input.repository,input.commit]);
    }
    const archive=join(directory,'source.tar');
    exportCommit(repository,input.commit,archive);
    const {mkdir}=await import('node:fs/promises');
    const build=join(directory,'build');await mkdir(build);
    run('tar',['-xf',archive,'-C',build]);
    // Only committed source is built, including when an existing checkout is supplied.
    npm(['ci'],build);
    const packs=JSON.parse(execFileSync(process.execPath,[npmCli,'pack','--json','--pack-destination',directory],{cwd:build,encoding:'utf8',stdio:['ignore','pipe','inherit']}));
    if(packs.length!==1 || packs[0].name!=='@game-dev-rta-club/chill-agent-cli')throw new Error('Unexpected CLI package.');
    const packagePath=join(directory,packs[0].filename);
    npm(['install','--ignore-scripts','--no-save','--package-lock=false',packagePath],root);
    for(const [index,name] of ['package.json','package-lock.json'].entries()){
      if(!(await readFile(join(root,name))).equals(tracked[index]))throw new Error(`${name} changed during development preparation.`);
    }
    console.log(JSON.stringify({developmentCli:{...input,integrity:packs[0].integrity},source:source?'local committed source':'remote committed source'}));
  } finally {await rm(directory,{recursive:true,force:true});}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const args=process.argv.slice(2);
  if(args.length&&!(args.length===2&&args[0]==='--source'))throw new Error('Usage: npm run cli:development -- [--source /path/to/cli-checkout]');
  await prepare({source:args[1]});
}
