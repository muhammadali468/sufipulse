const { sanitizeInput } = require("../utils/sanitize");
const sadaService = require("../services/sada.service");
exports.updateSadaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, revision_notes } = sanitizeInput(req.body);
    const reviewed_by = req.user.id;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const result = await sadaService.updateSadaStatusService(
      id,
      status,
      revision_notes,
      reviewed_by
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error("updateSadaStatus error:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.deleteSada = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sadaId } = req.params;

        const result = await sadaService.deleteSadaService(userId, sadaId);

        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateSada = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sadaId } = req.params;

        const { title, language, singing_style, link } = sanitizeInput(req.body);

        const result = await sadaService.updateSadaService(
            userId,
            sadaId,
            title,
            language,
            singing_style,
            link
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUserSadas = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await sadaService.getUserSadasService(userId);

        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getAllSadasAdmin = async (__, res) => {
    try {
        const result = await sadaService.getAllSadasAdminService();
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.create = async (req, res) => {
    try {
        const userId = req.user.id;

        const { title, language, performance_style, link } = sanitizeInput(req.body);

        if (!title || !language || !performance_style || !link) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const result = await sadaService.createSadaService(
            userId,
            title,
            language,
            performance_style,
            link
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};