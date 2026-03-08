const { sanitizeInput } = require("../utils/sanitize");
const kalamService = require("../services/kalam.service")
exports.create = async (req, res) => {
    try {
        const id = req.user.id;
        const { title, content, language, writing_style } = sanitizeInput(req.body);
        console.log(title, content, language, writing_style)
        if (!title || !content || !language || !writing_style) {
            return res.status(400).json({ error: "Missing fields" });
        }
        const result = await kalamService.createKalamService(id,title,content, language, writing_style)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.getAllKalamsAdmin = async (__, res) => {
    try {
        const result = await kalamService.getAllKalamsAdminService();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getUserKalams = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await kalamService.getUserKalamsService(userId);
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



