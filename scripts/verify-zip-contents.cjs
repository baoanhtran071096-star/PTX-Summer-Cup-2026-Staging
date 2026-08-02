const { execSync } = require('child_process');

const zipPath = 'C:/Users/ASUS/Desktop/PTX-Summer-Cup-2026-v2.7.0-WAVE2E1-FINAL-CERTIFIED.zip';

const listPs = [
    `Add-Type -AssemblyName System.IO.Compression.FileSystem`,
    `$zip = [System.IO.Compression.ZipFile]::OpenRead('${zipPath}')`,
    `$zip.Entries | ForEach-Object { $_.FullName }`,
    `$zip.Dispose()`
].join('; ');

const output = execSync(`powershell -Command "${listPs}"`, { encoding: 'utf8' });
console.log('ZIP Entries inside PTX-Summer-Cup-2026-v2.7.0-WAVE2E1-FINAL-CERTIFIED.zip:\n');
console.log(output);

const readHealthPs = [
    `Add-Type -AssemblyName System.IO.Compression.FileSystem`,
    `$zip = [System.IO.Compression.ZipFile]::OpenRead('${zipPath}')`,
    `$entry = $zip.GetEntry('scripts/health-check.cjs')`,
    `$stream = $entry.Open()`,
    `$reader = New-Object System.IO.StreamReader($stream)`,
    `$text = $reader.ReadToEnd()`,
    `$reader.Close()`,
    `$stream.Close()`,
    `$zip.Dispose()`,
    `Write-Output $text`
].join('; ');

const healthText = execSync(`powershell -Command "${readHealthPs}"`, { encoding: 'utf8' });
console.log('--- Verification: scripts/health-check.cjs inside ZIP contains Provenance Check ---');
console.log(healthText.includes('Provenance Check') ? '✅ YES, Provenance Check present in ZIP health-check.cjs' : '❌ NO');
