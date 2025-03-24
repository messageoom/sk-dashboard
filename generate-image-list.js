const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public/images');
const outputFile = path.join(__dirname, 'src/data/imageList.ts');

fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('Error reading images directory:', err);
    return;
  }

  // 过滤出 .jpg 文件
  const imageFiles = files.filter((file) => file.endsWith('.jpg'));

  // 生成 imageList 内容
  const imageList = imageFiles.map((name) => {
    const number = name.match(/#(\d+)/)?.[0] || '';
    const type = name.match(/的(.+?)食客/)?.[1] || '未知食客';
    return `{ name: "${name}", number: "${number}", type: "${type}" }`;
  });

  // 生成 TypeScript 文件内容
  const fileContent = `
  export const imageList = [
    ${imageList.join(',\n  ')}
  ] as const;

  export type ImageItem = {
    name: string;
    number: string;
    type: string;
  };
  `;

  // 确保 src/data 目录存在
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 写入 imageList.ts
  fs.writeFileSync(outputFile, fileContent);
  console.log('imageList.ts generated successfully!');
});