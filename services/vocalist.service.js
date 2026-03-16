const pool = require("../config/db");

exports.vocalistProfileCreateService = async (
    full_name,
    performance_name,
    country,
    city,
    email,
    years_experience,
    vocal_range,
    performance_styles,
    languages_performed,
    musical_training,
    sample_link,
    worked_in_studio,
    willing_editorial_approval,
    accept_producer_coordination,
    accept_framework,
    user_id
) => {

    const client = await pool.connect();

    try {

        const profileExists = await client.query(
            "SELECT * FROM vocalists WHERE user_id=$1",
            [user_id]
        );

        if (profileExists.rows.length > 0) {
            throw new Error("Profile already exists");
        }

        await client.query(
            `INSERT INTO vocalists(
                full_name,
                performance_name,
                country,
                city,
                email,
                years_experience,
                vocal_range,
                performance_styles,
                languages_performed,
                musical_training,
                sample_link,
                worked_in_studio,
                willing_editorial_approval,
                accept_producer_coordination,
                accept_framework,
                user_id
            )
            VALUES(
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
            )`,
            [
                full_name,
                performance_name,
                country,
                city,
                email,
                years_experience,
                vocal_range,
                performance_styles,
                languages_performed,
                musical_training,
                sample_link,
                worked_in_studio,
                willing_editorial_approval,
                accept_producer_coordination,
                accept_framework,
                user_id
            ]
        );

        return { message: "Vocalist Profile Submitted! Please wait for approval" };

    } catch (error) {

        console.log("vocalistProfileCreateService", error);
        throw error;

    } finally {
        client.release();
    }
};


exports.vocalistProfileReadService = async (user_id) => {

    const client = await pool.connect();

    try {

        const result = await client.query(
            "SELECT * FROM vocalists WHERE user_id=$1",
            [user_id]
        );

        if (result.rows.length === 0) {
            throw new Error("Profile not found");
        }

        return result.rows[0];

    } catch (error) {

        console.log("vocalistProfileReadService", error);
        throw error;

    } finally {
        client.release();
    }
};


exports.vocalistProfileUpdateService = async (
    user_id,
    {
        full_name,
        performance_name,
        country,
        city,
        email,
        years_experience,
        vocal_range,
        performance_styles,
        languages_performed,
        musical_training,
        sample_link,
        worked_in_studio,
        willing_editorial_approval,
        accept_producer_coordination,
        accept_framework,
    }
) => {

    const client = await pool.connect();

    try {

        const result = await client.query(
            `UPDATE vocalists
            SET
                full_name=$1,
                performance_name=$2,
                country=$3,
                city=$4,
                email=$5,
                years_experience=$6,
                vocal_range=$7,
                performance_styles=$8,
                languages_performed=$9,
                musical_training=$10,
                sample_link=$11,
                worked_in_studio=$12,
                willing_editorial_approval=$13,
                accept_producer_coordination=$14,
                accept_framework=$15,
                updated_at=NOW()
            WHERE user_id=$16
            RETURNING *`,
            [
                full_name,
                performance_name,
                country,
                city,
                email,
                years_experience,
                vocal_range,
                performance_styles,
                languages_performed,
                musical_training,
                sample_link,
                worked_in_studio,
                willing_editorial_approval,
                accept_producer_coordination,
                accept_framework,
                user_id
            ]
        );

        if (result.rows.length === 0) {
            throw new Error("Profile not found or not updated");
        }

        return {
            message: "Vocalist Profile Updated Successfully",
            profile: result.rows[0]
        };

    } catch (error) {

        console.log("vocalistProfileUpdateService", error);
        throw error;

    } finally {
        client.release();
    }
};


exports.vocalistProfileDeleteService = async (user_id) => {

    const client = await pool.connect();

    try {

        const result = await client.query(
            "DELETE FROM vocalists WHERE id=$1 RETURNING *",
            [user_id]
        );

        if (result.rows.length === 0) {
            throw new Error("Profile not found or already deleted");
        }

        return { message: "Vocalist Profile Deleted Successfully" };

    } catch (error) {

        console.log("vocalistProfileDeleteService", error);
        throw error;

    } finally {
        client.release();
    }
};

exports.updateVocalistStatusService = async (id, status) => {
    const client = await pool.connect();

    try {

        const result = await client.query(
            `UPDATE vocalists
             SET
                status = $1,
                updated_at = NOW()
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            throw new Error("Vocalist not found");
        }

        return {
            message: "Vocalist status updated successfully",
            vocalist: result.rows[0]
        };

    } catch (error) {

        console.log("updateVocalistStatusService", error);
        throw error;

    } finally {
        client.release();
    }
};

exports.getAllVocalists = async () => {

    const client = await pool.connect();

    try {

        const result = await client.query(
            `SELECT * FROM vocalists ORDER BY created_at DESC`
        );

        if (result.rowCount === 0) {
            return { message: "No vocalists yet" };
        }

        return {
            message: "Vocalist Profiles Fetched!",
            vocalists: result.rows
        };

    } catch (err) {

        console.log("getAllVocalists", err);

    } finally {
        client.release();
    }
};