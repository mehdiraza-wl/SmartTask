import { Sequelize } from "sequelize"
import 'dotenv/config'; 

const sequelize = new Sequelize('test_mint','mintadmin',process.env.DB_PASSWORD,{
    host: 'localhost',
    dialect: 'mysql'
})

export async function connectDatabase() {
    try {
        await sequelize.authenticate();
        console.log("Connection successful");
    } catch (error) {
        console.log(error);
    }
}

export default sequelize
