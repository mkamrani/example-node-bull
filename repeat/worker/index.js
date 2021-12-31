const Queue = require('bull');
const port = process.env.PORT || 9090;
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;
const intervalInMilli = 1000; // 1000 milliseconds

// A queue for the jobs scheduled based on a routine without any external requests
const routineJobsQueue = new Queue('routine_jobs', { redis: { port: redisPort, host: redisHost } });


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

routineJobsQueue.process(async function (job) {
  const jobData = job.data;
  console.log(`processing job with id ${job.id}`);
  await delay(2 * intervalInMilli).then();

  // Let's just set a dummy result
  return ({ datePlusThousand: jobData.date + 1000 });

});

// routineJobsQueue.on('completed', function (job, result) {
//   const jobData = job.data;
//   console.log(`job ${jobData.jobId} completed with result: ${JSON.stringify(result)}`)
// })