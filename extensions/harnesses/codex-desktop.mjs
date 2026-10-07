export default {
 id:'codex-desktop',
 async setupOptions(){return [];},
 guidance:{
  operations:{
   inspect:{command:'goal show --id <GOAL> --section context --format text',confirmation:'Read the current Goal and its bound conversation before continuing.'},
   createRoot:{command:'goal create --help',confirmation:'Verify the saved Root belongs to the calling conversation.'},
   receipt:{command:'goal activity --event <ID> --state <STATE>',states:['deferred','working','completed','failed'],confirmation:'Check queueError. Deferred must preserve a verified native Queue entry; working removes only the matching entry.'},
   selectWork:{command:'goal work --id <GOAL>',confirmation:'A receipt does not select work or complete the Goal.'}
  },
  nextActions:[
   'A new or changed project Hook may require the user to review/trust it in native /hooks. A settings write is not approval.',
   'Use the supplied stable prefix with these command suffixes. Use installed --help for arguments.',
   'For independent later input, defer only if its Queue entry is verified. If deferment fails, inspect current state; do not promise redelivery or blindly enqueue again.'
  ],
  constraints:['Preserve native trust, manual pauses, other queues and the existing conversation. Never assign another Root merely because its project matches.']
 }
};
