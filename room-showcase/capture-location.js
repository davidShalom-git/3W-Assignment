const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const art = 'C:\\Users\\david\\.gemini\\antigravity-ide\\brain\\cefd4f4d-19ac-4f1a-8af7-0683b24641e2';

const jobs = [
  { out: 'navigator_full_desktop.png', url: 'http://localhost:4173/?lang=en', w: 1200, h: 4400 },
  { out: 'navigator_full_mobile.png', url: 'http://localhost:4173/?lang=en', w: 390, h: 5400 },
  { out: 'navigator_full_tamil.png', url: 'http://localhost:4173/?lang=ta', w: 1200, h: 4400 }
];

for (const job of jobs) {
  const outFile = path.join(art, job.out);
  console.log('Capturing:', job.out);
  try {
    execFileSync(edge, [
      '--headless',
      '--disable-gpu',
      '--force-device-scale-factor=1',
      '--virtual-time-budget=2500',
      `--screenshot=${outFile}`,
      `--window-size=${job.w},${job.h}`,
      '--hide-scrollbars',
      job.url
    ]);
    console.log('Done:', job.out, fs.statSync(outFile).size, 'bytes');
  } catch(e) {
    console.error('Error capturing', job.out, e.message);
  }
}
