const pool = require("../config/db");

exports.updateSadaStatusService = async (id, status, revision_notes, reviewed_by) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `UPDATE sadas
       SET status=$1,
           revision_notes=$2,
           reviewed_by=$3,
           updated_at=NOW()
       WHERE id=$4
       RETURNING *`,
      [status, revision_notes || null, reviewed_by, id]
    );

    return result;

  } finally {
    client.release();
  }
};
exports.deleteSadaService = async (userId, sadaId) => {
  try {
    const client = await pool.connect();

    const result = await client.query(
      `DELETE FROM sadas s
       USING vocalists v
       WHERE s.vocalist_id = v.id
       AND v.user_id = $1
       AND s.id = $2
       RETURNING s.id`,
      [userId, sadaId]
    );

    client.release();

    if (result.rows.length === 0) {
      throw new Error("Sada not found or unauthorized");
    }

    return { message: "Sada deleted successfully" };

  } catch (error) {
    console.error("deleteSadaService error:", error);
    throw error;
  }
};
exports.updateSadaService = async (
  userId,
  sadaId,
  title,
  language,
  performance_style,
  link
) => {
  try {
    const client = await pool.connect();

    const result = await client.query(
      `UPDATE sadas s
       SET title=$1,
           language=$2,
           performance_style=$3,
           link=$4,
           updated_at=NOW()
       FROM vocalists v
       WHERE s.vocalist_id = v.id
       AND v.user_id = $5
       AND s.id = $6
       RETURNING s.*`,
      [title, language, performance_style, link, userId, sadaId]
    );

    client.release();

    if (result.rows.length === 0) {
      throw new Error("Sada not found or unauthorized");
    }

    return result.rows[0];

  } catch (error) {
    console.error("updateSadaService error:", error);
    throw error;
  }
};
exports.getUserSadasService = async (userId) => {
  try {
    const client = await pool.connect();

    const result = await client.query(`
      SELECT s.*
      FROM sadas s
      JOIN vocalists v ON s.vocalist_id = v.id
      WHERE v.user_id=$1
      ORDER BY s.created_at DESC
    `, [userId]);

    client.release();
    return result.rows;

  } catch (error) {
    console.error("getUserSadasService error:", error);
    throw error;
  }
};
exports.getAllSadasAdminService = async () => {
  try {
    const client = await pool.connect();

    const result = await client.query(`
      SELECT s.*, v.user_id
      FROM sadas s
      JOIN vocalists v ON s.vocalist_id = v.id
      ORDER BY s.created_at DESC
    `);

    client.release();
    return result.rows;

  } catch (error) {
    console.error("getAllSadasAdminService error:", error);
    throw error;
  }
};
exports.createSadaService = async (
  userId,
  title,
  language,
  performance_style,
  link
) => {
  try {
    const client = await pool.connect();

    const vocalist = await client.query(
      `SELECT id FROM vocalists
       WHERE user_id=$1 AND status='approved'`,
      [userId]
    );

    if (vocalist.rows.length === 0) {
      throw new Error("Vocalist profile not approved");
    }

    const vocalistId = vocalist.rows[0].id;

    const result = await client.query(
      `INSERT INTO sadas
      (user_id, vocalist_id, title, status, language, performance_style, link, reviewed_by)
      VALUES ($1,$2,$3,'draft',$4,$5,$6,$7)
      RETURNING *`,
      [userId, vocalistId, title, language, performance_style, link, 0]
    );

    client.release();
    return { message: "Sada created", sada: result.rows[0] };

  } catch (err) {
    console.error(err);
  }
};