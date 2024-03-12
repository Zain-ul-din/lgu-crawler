/**
 * Purges all stale files that are no longer needed or up-to-date.
 */

const fs = require('fs');
const path = require('path');

const DIR = path.join(process.cwd(), 'db');
const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

// Get a list of files in the directory
const files = fs.readdirSync(DIR);

files.forEach(file => {
  const filePath = path.join(DIR, file);
  const stats = fs.statSync(filePath);
  const timeSinceLastModified = Date.now() - stats.mtime.getTime();
  
  // Check if the file hasn't been updated for 2 days
  if (timeSinceLastModified > TWO_DAYS_IN_MS) {
    console.log(`Deleting stale file: ${file}`);
    fs.unlinkSync(filePath); // Delete the file
  } else {
    const lastModifiedDate = new Date(stats.mtime);
    console.log(`"${file.slice(0, 10)}..." was last modified at ${lastModifiedDate}`);
  }
});
