import Bull from "bull";

export interface EmailJobData {
  email: string;
  subject: string;
  message: string;
}

const emailQueue = new Bull<EmailJobData>("email-queue", {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

export default emailQueue;