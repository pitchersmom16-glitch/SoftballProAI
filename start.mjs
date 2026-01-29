// Ultra-simple startup script
process.env.NODE_ENV = 'development';

// Import and run tsx directly
import('tsx/cli/index.js').then(() => {
  // tsx is now loaded
}).catch(err => {
  console.error('Failed to load tsx:', err);
  console.log('\nTrying alternative method...');
  
  // Fallback: use node with experimental loader
  import('child_process').then(({ spawn }) => {
    const proc = spawn('node', ['--import', 'tsx', 'server/index.ts'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NODE_ENV: 'development' }
    });
  });
});
