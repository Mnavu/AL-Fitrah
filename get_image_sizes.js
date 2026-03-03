const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const publicDir = './public';
const images = fs.readdirSync(publicDir)
  .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));

const results = images.map(img => {
  try {
    const ffprobeOutput = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${path.join(publicDir, img)}"`).toString().trim();
    const [width, height] = ffprobeOutput.split('x').map(Number);
    return { name: img, width, height, size: width * height };
  } catch (err) {
    return { name: img, width: 0, height: 0, size: 0 };
  }
});

results.sort((a, b) => a.size - b.size);
console.log(JSON.stringify(results, null, 2));
