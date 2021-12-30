const Queue = require('bull');

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;
const intervalInMilli = 1000; // 1000 milliseconds
const queueName = 'routine_jobs';

// A queue for the jobs scheduled based on a routine without any external requests
const routineJobsQueue = new Queue(queueName, { redis: { port: redisPort, host: redisHost } });

routineJobsQueue.process(function (job, done) {
  const jobData = job.data;
  console.log(`processing job ${jobData.jobId}`);  
  done(null, { t2: jobData.value * 2, t3: jobData.value * 3 });
});

routineJobsQueue.on('completed', function (job, result) {
  const jobData = job.data;
  console.log(`job ${jobData.jobId} completed with result: ${JSON.stringify(result)}`)
})

// Generate a routine job every second
let count = 0;
setInterval(async () => {
  const job = {
    jobId: count,
    value: count,
    jobType: 'routine'
  };
  await routineJobsQueue.add(job);
  console.log(`scheduled job: ${count}`);
  count++;
}, intervalInMilli);
