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
exports.updateKalamService = async (userId, kalamId, title, content, language, writing_style) => {
    try {
        const client = await pool.connect();

        const result = await client.query(
            `UPDATE kalams k
             SET title=$1,
                 content=$2,
                 language=$3,
                 writing_style=$4,
                 updated_at=NOW()
             FROM writer_profiles w
             WHERE k.writer_id = w.id
             AND w.user_id = $5
             AND k.id = $6
             RETURNING k.*`,
            [title, content, language, writing_style, userId, kalamId]
        );

        client.release();

        if (result.rows.length === 0) {
            throw new Error("Kalam not found or unauthorized");
        }

        return result.rows[0];

    } catch (error) {
        console.error("updateKalamService error:", error);
        throw error;
    }
};
exports.deleteKalamService = async (userId, kalamId) => {
    try {
        const client = await pool.connect();

        const result = await client.query(
            `DELETE FROM kalams k
             USING writer_profiles w
             WHERE k.writer_id = w.id
             AND w.user_id = $1
             AND k.id = $2
             RETURNING k.id`,
            [userId, kalamId]
        );

        client.release();

        if (result.rows.length === 0) {
            throw new Error("Kalam not found or unauthorized");
        }

        return { message: "Kalam deleted successfully" };

    } catch (error) {
        console.error("deleteKalamService error:", error);
        throw error;
    }
};
exports.updateKalamStatusService = async (id, status, revision_notes) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `UPDATE kalams
       SET status = $1,
           revision_notes = $2
       WHERE id = $3
       RETURNING *`,
      [status, revision_notes || null, id]
    );

    return result;
  } finally {
    client.release();
  }
};

