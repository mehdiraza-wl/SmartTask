import { connectDatabase } from './configs/database.js';
import { sendMail } from './configs/mailsend.js';
import app from './index.js'
import 'dotenv/config'; 
import User from './models/user.js';
import RefreshToken from './models/refreshToken.js';

app.listen(process.env.PORT, async () => {
    await connectDatabase()
    console.log(`[server]: The Server is running`);
});