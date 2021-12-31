const Queue = require('bull');
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;

// A queue for the jobs scheduled based on a routine without any external requests
const routineJobsQueue = new Queue('routine_jobs', { redis: { port: redisPort, host: redisHost } });

routineJobsQueue.process(async function (job) {
  const jobData = job.data;
  await job.log("started to process"); //This is displayed in the dashboard
  console.log(`processing job ${jobData.jobId}`);
  await job.progress(20); // Let's set the progress to see how it's displayed in our UI
  for (let index = 0; index < (jobData.value * 100); index++) {
    // causing some delay
  }
  await job.progress(100);
  // Let's set a dummy result
  return ({ t2: jobData.value * 2, t3: jobData.value * 3 });
});
