const pool = require("../config/db");

// Create Kalam
exports.createKalamService = async (id, title, content, language, writing_style) => {
    try {
        const client = await pool.connect();
        const writer = await client.query(
            `SELECT id FROM writer_profiles 
             WHERE user_id=$1 AND profile_status='approved'`,
            [id]
        );

        if (writer.rows.length === 0) {
            throw new Error("Writer profile not approved");
        }

        const writerId = writer.rows[0].id;
        const result = await client.query(
            `INSERT INTO kalams (writer_id, title, content, status ,language, writing_style) 
       VALUES ($1, $2, $3, 'draft', $4, $5) RETURNING *`,
            [writerId, title, content, language, writing_style]
        );
        client.release();
        console.log(result.rows[0])
        return ({ message: "Kalam created", kalam: result.rows[0] });
    } catch (err) {
        console.error(err);
    }
};
// Get all kalams for admin
exports.getAllKalamsAdminService = async () => {
    try {
        const client = await pool.connect();

        const result = await client.query(`
            SELECT k.*, w.user_id
            FROM kalams k
            JOIN writer_profiles w ON k.writer_id = w.id
            ORDER BY k.created_at DESC
        `);

        client.release();
        return result.rows;

    } catch (error) {
        console.error("getAllKalamsAdminService error:", error);
        throw error;
    }
};

exports.getUserKalamsService = async (id) => {
    try {
        const client = await pool.connect();

        const result = await client.query(`
            SELECT k.*
            FROM kalams k
            JOIN writer_profiles w ON k.writer_id = w.id
            WHERE w.user_id=$1
            ORDER BY k.created_at DESC
        `,[id]);

        client.release();
        return result.rows;

    } catch (error) {
        console.error("getUserKalamsService error:", error);
        throw error;
    }
};

