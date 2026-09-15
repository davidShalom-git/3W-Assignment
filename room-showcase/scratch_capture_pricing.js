const { execFileSync } = require('child_process');
const path = require('path');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artDir = 'C:\\Users\\david\\.gemini\\antigravity-ide\\brain\\78a66e9c-2a27-4410-a870-f6dbce313d5a';
const outPath = path.join(artDir, 'pricing_breakdown_preview.png');

console.log('Capturing pricing breakdown...');
try {
  execFileSync(edge, [
    '--headless',
    '--disable-gpu',
    '--force-device-scale-factor=1.5',
    '--virtual-time-budget=2000',
    `--screenshot=${outPath}`,
    '--window-size=1200,1400',
    '--hide-scrollbars',
    'http://localhost:4173/pricing-breakdown.html'
  ]);
  console.log('Saved pricing breakdown preview to:', outPath);
} catch (e) {
  console.error(e);
}
