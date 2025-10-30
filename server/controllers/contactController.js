const prisma = require('../lib/prisma');

// POST /api/contact - Envoyer un message
exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        status: 'NEW'
      }
    });

    // TODO: Envoyer email de notification à l'admin

    res.status(201).json({
      success: true,
      data: contactMessage,
      message: 'Message envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/contact - Liste des messages (ADMIN)
exports.getAllMessages = async (req, res, next) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/contact/:id/reply - Répondre à un message (ADMIN)
exports.replyToMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const repliedBy = req.user.id;

    const message = await prisma.contactMessage.update({
      where: { id },
      data: {
        reply,
        repliedBy,
        repliedAt: new Date(),
        status: 'REPLIED'
      }
    });

    // TODO: Envoyer email de réponse au contact

    res.json({
      success: true,
      data: message,
      message: 'Réponse envoyée'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
