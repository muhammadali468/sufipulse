const { sanitizeInput } = require("../utils/sanitize");
const vocalistService = require("../services/vocalist.service");

// CREATE
exports.vocalistProfileCreate = async (req, res) => {
    try {
        const {
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
            accept_framework
        } = sanitizeInput(req.body);

        const user_id = req.user.id;
        console.log("user_id", user_id)
        const result = await vocalistService.vocalistProfileCreateService(
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
        );

        res.status(200).json(result.message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// READ
exports.vocalistProfileRead = async (req, res) => {
    try {
        const user_id = req.user.id;
        console.log(user_id)
        const profile = await vocalistService.vocalistProfileReadService(user_id);
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// UPDATE
exports.vocalistProfileUpdate = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { ...updateData } = sanitizeInput(req.body);
        const result = await vocalistService.vocalistProfileUpdateService(user_id, updateData);

        res.status(200).json({
            message: result.message,
            profile: result.profile
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// DELETE
exports.vocalistProfileDelete = async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await vocalistService.vocalistProfileDeleteService(user_id);

        res.status(200).json({ message: result.message });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// GET ALL
exports.vocalistGetAll = async (req, res) => {
    try {
        const user_role = req.user.role;

        if (user_role === "admin" || user_role === "super admin") {

            const result = await vocalistService.getAllVocalists();

            res.status(200).json({
                message: result.message,
                vocalists: result.vocalists
            });

        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// UPDATE STATUS
exports.updateVocalistStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status, revision_notes } = req.body;

        const result = await vocalistService.updateVocalistStatusService(
            id,
            status,
            revision_notes
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};