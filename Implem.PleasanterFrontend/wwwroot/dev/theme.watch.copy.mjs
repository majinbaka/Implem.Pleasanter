import { watch, copyFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const watchDir = resolve(rootDir, 'src/clone/assets/themes');
const outputDir = resolve(rootDir, '../../Implem.Pleasanter/wwwroot/assets/themes');

function copyCssFile(srcPath) {
    if (!srcPath.endsWith('.css')) return;
    const relPath = srcPath.substring(watchDir.length + 1);
    const destPath = join(outputDir, relPath);
    const destDir = dirname(destPath);
    if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
    }
    copyFileSync(srcPath, destPath);
    console.log(`[copy] ${srcPath} -> ${destPath}`);
}

const debounceMap = new Map();
const DEBOUNCE_MS = 200;

watch(watchDir, { recursive: true }, (eventType, filename) => {
    if (!filename || !filename.endsWith('.css')) return;
    const srcPath = join(watchDir, filename);
    if (debounceMap.has(srcPath)) {
        clearTimeout(debounceMap.get(srcPath));
    }
    const timeout = setTimeout(() => {
        debounceMap.delete(srcPath);
        if (existsSync(srcPath)) {
            copyCssFile(srcPath);
        }
    }, DEBOUNCE_MS);
    debounceMap.set(srcPath, timeout);
});

console.log(`Watching ${watchDir} for CSS changes...`);
