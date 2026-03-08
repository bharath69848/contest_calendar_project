import cron from 'node-cron';
import runScrapers from './runScrapers.js';

/**
 * Start a scheduler that runs `runScrapers` immediately and then every 30 minutes.
 * Returns an object with a `stop()` method to stop the cron task.
 */
export default function startScheduler() {
  // run once immediately (fire-and-forget)
  (async () => {
    try {
      console.log('Initial runScrapers starting');
      await runScrapers();
      console.log('Initial runScrapers finished');
    } catch (err) {
      console.error('Initial runScrapers failed:', err?.message || err);
    }
  })();

  // Cron expression: every 30 minutes (at minute 0 and 30 of every hour)
  const task = cron.schedule('*/30 * * * *', async () => {
    console.log('Scheduled runScrapers starting at', new Date().toISOString());
    try {
      await runScrapers();
      console.log('Scheduled runScrapers finished at', new Date().toISOString());
    } catch (err) {
      console.error('Scheduled runScrapers failed:', err?.message || err);
    }
  }, {
    scheduled: true,
    timezone: 'UTC'
  });

  // start the cron job
  task.start();

  return {
    stop: () => task.stop()
  };
}
