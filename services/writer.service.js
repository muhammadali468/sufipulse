const pool = require("../config/db");

exports.writerProfileCreateService = async (
    full_name,
    pen_name,
    country,
    city,
    email,
    years_experience,
    primary_languages,
    writing_styles,
    literary_background,
    thematic_focus,
    sample_kalam,
    previous_publications,
    editorial_review_experience,
    willing_editorial_process,
    revision_acknowledged,
    institutional_acknowledged,
    user_id

) => {
    const client = await pool.connect();
    try {
        const writerProfileExists = await client.query(
            "SELECT * FROM writer_profiles WHERE user_id=$1",
            [user_id]
        );
        if (writerProfileExists.rows.length > 0) {
            throw new Error("Profile already exists");
        }
        const result = await client.query(
            `INSERT INTO writer_profiles(
            full_name,
            pen_name,
            country,
            city,
            email,
            years_experience,
            primary_languages,
            writing_styles,
            literary_background,
            thematic_focus,
            sample_kalam,
            previous_publications,
            editorial_review_experience,
            willing_editorial_process,
            revision_acknowledged,
            institutional_acknowledged,
            user_id
      )
      VALUES(
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
      )`,
            [
                full_name,
                pen_name,
                country,
                city,
                email,
                years_experience,
                primary_languages,
                writing_styles,
                literary_background,
                thematic_focus,
                sample_kalam,
                previous_publications,
                editorial_review_experience,
                willing_editorial_process,
                revision_acknowledged,
                institutional_acknowledged,
                user_id
            ]
        );
        console.log(result)
        return { message: "Writer Profile Submitted! Please wait for approval" }
    } catch (error) {
        console.log("writerProfileCreateService", error)
        throw error
    } finally {
        client.release()
    }
}

exports.writerProfileReadService = async (user_id) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            "SELECT * FROM writer_profiles WHERE user_id=$1",
            [user_id]
        );

        if (result.rows.length === 0) {
            throw new Error("Profile not found");
        }

        return result.rows[0]; // Return writer's own profile
    } catch (error) {
        console.log("writerProfileReadService", error);
        throw error;
    } finally {
        client.release();
    }
};
// Update writer profile
exports.writerProfileUpdateService = async (
    user_id,
    {
        full_name,
        pen_name,
        country,
        city,
        email,
        years_experience,
        primary_languages,
        writing_styles,
        literary_background,
        thematic_focus,
        sample_kalam,
        previous_publications,
        editorial_review_experience,
        willing_editorial_process,
        revision_acknowledged,
        institutional_acknowledged
    }
) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `UPDATE writer_profiles
             SET 
                 full_name=$1,
                 pen_name=$2,
                 country=$3,
                 city=$4,
                 email=$5,
                 years_experience=$6,
                 primary_languages=$7,
                 writing_styles=$8,
                 literary_background=$9,
                 thematic_focus=$10,
                 sample_kalam=$11,
                 previous_publications=$12,
                 editorial_review_experience=$13,
                 willing_editorial_process=$14,
                 revision_acknowledged=$15,
                 institutional_acknowledged=$16,
                 updated_at=NOW()
             WHERE user_id=$17
             RETURNING *`,
            [
                full_name,
                pen_name,
                country,
                city,
                email,
                years_experience,
                primary_languages,
                writing_styles,
                literary_background,
                thematic_focus,
                sample_kalam,
                previous_publications,
                editorial_review_experience,
                willing_editorial_process,
                revision_acknowledged,
                institutional_acknowledged,
                user_id
            ]
        );

        if (result.rows.length === 0) {
            throw new Error("Profile not found or not updated");
        }

        return { message: "Writer Profile Updated Successfully", profile: result.rows[0] };
    } catch (error) {
        console.log("writerProfileUpdateService", error);
        throw error;
    } finally {
        client.release();
    }
};
// Update writer status (Admin)
exports.updateWriterStatusService = async (writerId, newStatus) => {
    const client = await pool.connect();

    try {
        const result = await client.query(
            `UPDATE writer_profiles
             SET
                profile_status = $1,
                updated_at = NOW()
             WHERE id = $2
             RETURNING *`,
            [newStatus, writerId]
        );

        if (result.rows.length === 0) {
            throw new Error("Writer not found");
        }

        return {
            message: "Writer status updated successfully",
            writer: result.rows[0]
        };

    } catch (error) {
        console.log("updateWriterStatus", error);
        throw error;
    } finally {
        client.release();
    }
};

// Delete writer profile
exports.writerProfileDeleteService = async (user_id) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            "DELETE FROM writer_profiles WHERE user_id=$1 RETURNING *",
            [user_id]
        );

        if (result.rows.length === 0) {
            throw new Error("Profile not found or already deleted");
        }

        return { message: "Writer Profile Deleted Successfully" };
    } catch (error) {
        console.log("writerProfileDeleteService", error);
        throw error;
    } finally {
        client.release();
    }
};

// Get all writers
exports.getAllWriters = async () => {
    const client = await pool.connect()
    try {
        const result = await client.query(
            `SELECT * FROM writer_profiles ORDER BY created_at DESC`
        );
        if(result.rowCount === 0){
            return {message:"No writers yet"}
        }
        const writers = result.rows
        return {message:"Writer Profiles Fetched!", writers}

    } catch (err) {
        console.log("getAllWriters", err)
    }
    finally{
        client.release();
    }
};