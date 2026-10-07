// Keep raw command text out of reports. Only recognize a single prepared-launcher
// help invocation; compound shell commands are never exempted from route checks.
export function probeCommand(command,launcher){
 const text=typeof command==='string'?command:'';
 const usesPreparedLauncher=text.includes(launcher);
 const action=['connection create-goal','goal create','goal assign','goal work','goal comment','connection show','setup prepare','server start'].find(a=>text.includes(a))||null;
 const helpOnly=usesPreparedLauncher&&!/[;&|`$()\n\r]/.test(text)&&/\bgoal (create|assign|work) --help\s*$/.test(text);
 return {usesPreparedLauncher,action,helpOnly};
}
