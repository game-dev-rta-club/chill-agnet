#!/usr/bin/env node
const [command='help',...args]=process.argv.slice(2);
const entries={goal:'chill-agent',server:'chill-server',setup:'chill-setup',settings:'chill-settings',hook:'chill-hook',monitor:'chill-monitor',help:'chill-help','--help':'chill-help'};
if(!entries[command])throw Error('Unknown command');
const url=new URL(`../dist/runtime/bin/${entries[command]}.mjs`,import.meta.url);process.argv=[process.execPath,url.pathname,...args];await import(url);
