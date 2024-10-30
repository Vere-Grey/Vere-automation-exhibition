const { exec } = require('child_process');

// Measure performance of test suites. Can be used to manually run a suite multiple times and calculate the average run time.
// Run: node ./tests/e2e/utils/measure-test-run.js

const suite = 'tests/e2e/specs/transactions.spec.ts'; // Replace with your suite path
const iterations = 10; // Number of times to run the suite

async function runSuite() {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    exec(`npx playwright test ${suite} --project chromium`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`);
      } else {
        const duration = Date.now() - start;
        resolve(duration);
      }
    });
  });
}

async function measureAverageRunTime() {
  let totalDuration = 0;

  for (let i = 0; i < iterations; i++) {
    try {
      const duration = await runSuite();
      console.log(`Run ${i + 1}: ${duration} ms`);
      totalDuration += duration;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  const averageDuration = totalDuration / iterations;
  console.log(`Average run time: ${averageDuration} ms`);
}

measureAverageRunTime();
