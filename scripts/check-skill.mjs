import {readdir,readFile,stat} from 'node:fs/promises';
import {dirname,join,resolve,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';

export async function checkSkill(root) {
 const pages=[];
 async function visit(dir){
  for(const entry of await readdir(dir,{withFileTypes:true})){
   const path=join(dir,entry.name);
   if(entry.isDirectory())await visit(path);
   else if(entry.isFile()&&entry.name.endsWith('.md'))pages.push(path);
  }
 }
 await visit(root);
 const linked=new Set([join(root,'SKILL.md')]),edges=new Map();
 for(const page of pages){
  const body=await readFile(page,'utf8'),targets=[];
  for(const match of body.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)){
   const href=match[1];if(/^(?:[a-z]+:|#)/i.test(href))continue;
   const target=resolve(dirname(page),decodeURIComponent(href.split('#')[0]));
   const local=relative(root,target);
   if(local.startsWith('..')||isAbsolute(local))throw Error(`Skill link leaves package: ${page} → ${href}`);
   if(!(await stat(target)).isFile())throw Error(`Invalid skill link: ${page} → ${href}`);
   targets.push(target);
  }
  edges.set(page,targets);
 }
 for(const page of linked)for(const target of edges.get(page)||[])linked.add(target);
 for(const page of pages)if(!linked.has(page))throw Error(`Unreachable skill guide: ${page}`);
 return pages.length;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=resolve(process.argv[2]||fileURLToPath(new URL('../plugins/chill-agent/skills/chill-agent',import.meta.url)));
 console.log(`Checked ${await checkSkill(root)} linked skill pages.`);
}
