import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtemp,writeFile,mkdir,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {validateInput,exportCommit} from './prepare-development-cli.mjs';

test('development inputs cannot float or select an unrelated repository',()=>{
 const repository='https://github.com/game-dev-rta-club/chill-agent-cli.git';
 assert.throws(()=>validateInput({repository,commit:'develop'}));
 assert.throws(()=>validateInput({repository,commit:'abcdef0'}));
 assert.throws(()=>validateInput({repository:'https://example.com/other.git',commit:'a'.repeat(40)}));
 assert.equal(validateInput({repository,commit:'a'.repeat(40)}).commit,'a'.repeat(40));
});
test('local preparation exports the pinned commit, not dirty files or current HEAD',async t=>{
 const dir=await mkdtemp(join(tmpdir(),'chill-cli-input-test-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 const git=(...args)=>execFileSync('git',['-C',dir,...args],{encoding:'utf8'}).trim();
 git('init');git('config','user.name','Fixture');git('config','user.email','fixture@example.invalid');
 await writeFile(join(dir,'value.txt'),'pinned');git('add','.');git('commit','-m','pin');const sha=git('rev-parse','HEAD');
 await writeFile(join(dir,'value.txt'),'new HEAD');git('add','.');git('commit','-m','new');
 await writeFile(join(dir,'value.txt'),'dirty');await writeFile(join(dir,'untracked.txt'),'private');
 const archive=join(dir,'source.tar'),out=join(dir,'out');await mkdir(out);exportCommit(dir,sha,archive);
 execFileSync('tar',['-xf',archive,'-C',out]);assert.equal(await readFile(join(out,'value.txt'),'utf8'),'pinned');
 await assert.rejects(readFile(join(out,'untracked.txt')),/ENOENT/);
 assert.equal(await readFile(join(dir,'value.txt'),'utf8'),'dirty');
 assert.throws(()=>exportCommit(dir,'f'.repeat(40),archive));
});
