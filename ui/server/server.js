const http = require('http');
const Queue = require('bull');


const port = process.env.PORT || 9090;
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;
const intervalInMilli = 1000; // 1000 milliseconds


// A queue for the jobs dynamically scheduled via http requests
const dynamicJobsQueue = new Queue('dynamic_jobs', { redis: { port: redisPort, host: redisHost } });

// A queue for the jobs scheduled based on a routine without any external requests
const routineJobsQueue = new Queue('routine_jobs', { redis: { port: redisPort, host: redisHost } });

// ( async () => await routineJobsQueue.empty())()

// routineJobsQueue.process(function (job, done) {
//   const jobData = job.data;
//   console.log(`processing job ${jobData.jobId}`);
//   // sleep(2 * intervalInMilli);
//   // job.progress(42);

//   // // or give a error if error
//   // done(new Error('error transcoding'));

//   // or pass it a result
//   done(null, { t2: jobData.value * 2, t3: jobData.value * 3 });

//   // // If the job throws an unhandled exception it is also handled correctly
//   // throw new Error('some unexpected error');
// });

routineJobsQueue.on('completed', function (job, result) {
  const jobData = job.data;
  console.log(`job ${jobData.jobId} completed with result: ${JSON.stringify(result)}`)
})
// Generate a routine job every second
let count = 0;
setInterval(async () => {
  await routineJobsQueue.add({
    jobId: count,
    value: count,
    jobType: 'routine'
  });
  console.log(`scheduled job: ${count}`);
  count++;
}, intervalInMilli);





const server = http.createServer();
server.listen(port);
console.log(`Listening on port: ${port}`)


