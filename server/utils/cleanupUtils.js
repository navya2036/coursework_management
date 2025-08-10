const fs = require('fs').promises;
const path = require('path');

const cleanEmptyFolders = async (folder) => {
  const isDir = (await fs.stat(folder)).isDirectory();
  if (!isDir) return false;

  let files = await fs.readdir(folder);
  
  // Recursively clean subfolders
  for (const file of files) {
    const fullPath = path.join(folder, file);
    if ((await fs.stat(fullPath)).isDirectory()) {
      const isEmpty = await cleanEmptyFolders(fullPath);
      if (isEmpty) {
        await fs.rmdir(fullPath);
      }
    }
  }
  
  // Check if folder is empty after cleaning subfolders
  files = await fs.readdir(folder);
  return files.length === 0;
};

module.exports = { cleanEmptyFolders };
