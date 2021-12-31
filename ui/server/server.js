const express = require('express');
const Queue = require('bull');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const port = process.env.PORT || 9090;
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;
const intervalInMilli = 1000; // 1000 milliseconds


// A queue for the jobs scheduled based on a routine without any external requests
const routineJobsQueue = new Queue('routine_jobs', { redis: { port: redisPort, host: redisHost } });

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


// ------------ enable bull-ui -----------
const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [
    new BullAdapter(routineJobsQueue),
  ],
  serverAdapter:serverAdapter
});

const app = express()

serverAdapter.setBasePath('/admin/queues'); // An arbitrary path to serve the dashboard
app.use('/admin/queues', serverAdapter.getRouter());

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
});

