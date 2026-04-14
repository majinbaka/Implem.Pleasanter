import { readdirSync, statSync } from 'fs';
import { resolve, basename, join, dirname } from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const inputDir = resolve(rootDir, 'src/styles');
const outputDir = resolve(rootDir, '../../Implem.Pleasanter/wwwroot/assets/css');
const sassCmd = join(rootDir, 'node_modules/.bin/sass');

const entries = readdirSync(inputDir)
    .filter(file => {
        const filePath = resolve(inputDir, file);
        return statSync(filePath).isFile() && file.endsWith('.scss') && !file.startsWith('_');
    })
    .map(file => {
        const name = basename(file, '.scss');
        return `${inputDir}/${file}:${outputDir}/${name}.min.css`;
    });

const args = ['--watch', ...entries].join(' ');
execSync(`"${sassCmd}" ${args}`, { stdio: 'inherit' });
