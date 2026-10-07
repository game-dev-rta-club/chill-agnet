// Git dependencies are built by npm before packing; published archives already contain dist.
import {execFileSync} from 'node:child_process';
const npm=process.env.npm_execpath;if(!npm)throw Error('Run preparation through npm.');
if(process.env.CHILL_BUILD_DEVELOPMENT==='1')execFileSync(process.execPath,[npm,'run','cli:development'],{stdio:'inherit'});
execFileSync(process.execPath,[npm,'run','build'],{stdio:'inherit'});
