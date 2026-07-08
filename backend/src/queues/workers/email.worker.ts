import { sendMail } from "../../configs/mailsend.js";
import emailQueue from "../email.queue.js";
emailQueue.process(async (job) => {
    const { email, subject, message } = job.data;
    
  await sendMail(email, subject, message);
});