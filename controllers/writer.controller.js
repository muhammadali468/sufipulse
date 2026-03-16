const { sanitizeInput } = require("../utils/sanitize");
const writerService = require("../services/writer.service");

exports.writerProfileCreate = async (req, res) => {
    try {
        const {
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
        } = sanitizeInput(req.body);
        const user_id = req.user.id;
        const result = await writerService.writerProfileCreateService(
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
        );
        res.status(200).json(result.message)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
// READ
exports.writerProfileRead = async (req, res) => {
    try {
        const user_id = req.user.id;
        const profile = await writerService.writerProfileReadService(user_id);
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// UPDATE
exports.writerProfileUpdate = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { ...updateData } = sanitizeInput(req.body);
        const result = await writerService.writerProfileUpdateService(user_id, updateData);
        res.status(200).json({ message: result.message, profile: result.profile });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// UPDATE STATUS
exports.updateWriterStatus = async (req, res) => {
    try {
        const writer_id = req.params.id;
        const { status } = req.body;

        const result = await writerService.updateWriterStatusService(writer_id, status);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// DELETE
exports.writerProfileDelete = async (req, res) => {
    try {
        const user_id = req.user.id;
        const result = await writerService.writerProfileDeleteService(user_id);
        res.status(200).json({ message: result.message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// GET ALL
exports.writerGetAll = async (req, res) => {
    try {
        const user_role = req.user.role
        if (user_role === "admin" || user_role === "super admin") {
            const result = await writerService.getAllWriters()
            res.status(200).json({ message:result.message,writers:result.writers });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
