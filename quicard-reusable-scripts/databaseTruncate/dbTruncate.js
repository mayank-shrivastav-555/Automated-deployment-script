const Sequelize = require("sequelize");
const db = require("../config/database");
const { constant } = require("../constant/constant");

async function dataClean(schema) {
    const transaction = await db.sequelize.transaction();
    try {
        const getAllTablesQuery = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
          AND table_schema = '${schema}'
          AND table_name NOT IN ('${constant.MASTER_TABLE.CHECKS}', '${constant.MASTER_TABLE.PERMISSIONS}', '${constant.MASTER_TABLE.STATUS}', '${constant.MASTER_TABLE.THIRD_PARTY_API}', '${constant.MASTER_TABLE.USER_REMARKS}', '${constant.MASTER_TABLE.USER_SKILLS}', '${constant.MASTER_TABLE.MASTER_CONSENT}', '${constant.MASTER_TABLE.TERMS_N_CONDITIONS}','${constant.MASTER_TABLE.LOGOS}')
        ORDER BY table_name ASC;`;

        const tables = await db.sequelize.query(getAllTablesQuery, { type: Sequelize.QueryTypes.SELECT });

        console.log(tables);
        // await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;", { raw: true, transaction });

        for (const table of tables) {
            console.log(`${schema}.${table.TABLE_NAME}`);
        // await db.sequelize.query(`TRUNCATE TABLE ${schema}.${table.TABLE_NAME}`, { type: Sequelize.QueryTypes.RAW, transaction });
        }
        // await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;", { raw: true, transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
dataClean("quicard_production");

module.exports = {
    dataClean
};