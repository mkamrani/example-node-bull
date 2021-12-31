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
  console.log(`processing job ${jobData.jobId}`);
  await delay(2 * intervalInMilli).then();
  // job.progress(42);

  // // or give a error if error
  // done(new Error('error transcoding'));

  // or pass it a result
  return ({ t2: jobData.value * 2, t3: jobData.value * 3 });

});

// routineJobsQueue.on('completed', function (job, result) {
//   const jobData = job.data;
//   console.log(`job ${jobData.jobId} completed with result: ${JSON.stringify(result)}`)
// })