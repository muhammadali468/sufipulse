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
exports.updateKalam = async (req, res) => {
    try {
        const userId = req.user.id;
        const { kalamId } = req.params;
        const { title, content, language, writing_style } = req.body;

        const result = await kalamService.updateKalamService(
            userId,
            kalamId,
            title,
            content,
            language,
            writing_style
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteKalam = async (req, res) => {
    try {
        const userId = req.user.id;
        const { kalamId } = req.params;

        const result = await kalamService.deleteKalamService(userId, kalamId);

        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateKalamStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, revision_notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const result = await kalamService.updateKalamStatusService(
      id,
      status,
      revision_notes
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateKalamStatus error:", error);
    res.status(500).json({ error: error.message });
  }
};




