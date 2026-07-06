import { connectDatabase } from './configs/database.js';
import app from './index.js'
import 'dotenv/config'; 

app.listen(process.env.PORT, async () => {
    await connectDatabase()
    console.log(`[server]: Server is running`);
});