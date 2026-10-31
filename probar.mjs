import {spawnSync, spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

process.chdir(fileURLToPath(new URL('.', import.meta.url)));
const major = Number(process.versions.node.split('.')[0]);
if (major < 24) {
 console.error('Instala Node.js 24 LTS desde https://nodejs.org y vuelve a abrir el iniciador.');
 process.exit(1);
}
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
function run(args) {
 const result = spawnSync(npm, args, {stdio: 'inherit', shell: process.platform === 'win32'});
 if (result.error) console.error(result.error.message);
 if (result.status !== 0) process.exit(result.status || 1);
}
if (!existsSync('node_modules/.package-lock.json')) run(['ci']);
// Webpack avoids the internal-port restriction encountered with Turbopack.
run(['run', 'build', '--', '--webpack']);
console.log('\nAbre http://localhost:3000 en tu navegador. Mantén esta ventana abierta.\n');
const server = spawn(npm, ['start'], {stdio: 'inherit', shell: process.platform === 'win32'});
server.on('error', error => {console.error(error.message); process.exitCode = 1;});
server.on('exit', code => {process.exitCode = code || 0;});
