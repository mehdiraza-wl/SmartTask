import Bull from "bull";

const reminderQueue = new Bull("reminder-queue", {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});
await reminderQueue.add("daily-task-reminder", {}, {
    repeat: {
        cron: '0 0 * * *'
    } 
});


export default reminderQueue;