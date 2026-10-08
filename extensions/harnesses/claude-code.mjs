export default {
 id:'claude-code',
 async setupOptions({execute,node,setupFile,selection,options}){
  const status=JSON.parse((await execute(node,[setupFile,'status',...selection],options)).stdout);
  return status.idleWatchMs==null?[]:['--idle-watch-ms',String(status.idleWatchMs)];
 },
 guidance:{
  operations:{
   inspect:{command:'connection show',confirmation:'Run through the main Bash tool. Verify the SessionStart identity handoff; existing Root session AND context must match.'},
   createRoot:{command:'connection create-goal --help',confirmation:'A request marker is pending. Only main PostToolUse confirmation establishes the saved Root.'},
   receipt:{command:'connection activity --event <ID> --state <STATE>',states:['working','completed','failed'],confirmation:'Use separate main Bash calls and preserve stdout. Wait for main-hook confirmation; inspect connection request --id <ID> for uncertain results before any retry.'},
   selectWork:null,
   inbox:{command:'connection inbox',confirmation:'Recover pending input or establish a verified prompt through the main hook before expecting ordinary tool hooks to receive input.'}
  },
  activation:{
   beforeCreate:'Run connection show through the main Bash tool and verify the SessionStart identity before createRoot. Missing identity cannot be replaced with an ordinary goal create, fabricated environment variables or a Codex route.',
   whenUserActionNeeded:'If native Hook review is pending, explain it first. If SessionStart is missing after review, guide the user to resume this same conversation. Open the workspace Web before asking them to act; do not claim a Goal or return path exists yet.',
   userMessage:'The Web page is ready. To receive its replies here, Claude needs to load the connection settings. {observedReviewAction} Then exit and resume this same conversation with claude --resume. I will check the connection and prepare your Goal.',
   confirmation:'After resume, verify connection show and the main PostToolUse confirmation of Root creation. Reuse a Root already owned by this session AND context. Do not clear, fork, launch another receiver or change permissions.'
  },
  nextActions:[
   'For first use, follow onboarding in order, including opening Web; activation below owns the native prerequisites.',
   'Use the actual native project/settings directory. Local settings may be at the main Git repository root. Do not substitute the skill installation directory.',
   'Review native Hooks when required. If SessionStart is missing, explain exiting and resuming THIS SAME conversation. Do not clear, fork, fabricate identity variables or launch a second writer.',
   'Run connection show from main Bash to verify the handoff before creating a Root. Run each connection action separately; a shell receipt alone is not confirmation.',
   'There is no deferred Queue state or goal work route. Keep independent input in the current work plan; do not claim that an unclaimed event will start a new turn by itself.',
   'Children, Briefs, Comments, Letters and ordinary reads use the shared goal commands. Existing Root connections cannot be reassigned.'
  ],
  constraints:[
   'Setup preserves native permissions, other Hooks and disablement; it never enables Auto mode.',
   'An explicitly configured idle watch is finite and requires the same conversation to remain open. Expiry does not renew it. Do not promise overnight reception.',
   'Pause holds future continuation, not native execution. Model settings, usage, live execution status and cancellation remain native controls.'
  ]
 }
};
