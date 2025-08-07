const fs = require('fs');
const path = require('path');

function removeConsoleLogs(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            removeConsoleLogs(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Remove console.log, console.warn, console.error statements
            content = content.replace(/console\.(log|warn|error|info|debug)\s*\([^)]*\);?\s*/g, '');
            
            // Remove empty lines that might be left
            content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
            
            fs.writeFileSync(filePath, content);
        }
    });
}

// Start from the current directory
removeConsoleLogs('.');
console.log('Console statements removed successfully!'); 