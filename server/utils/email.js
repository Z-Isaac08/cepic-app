const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Configuration email
    if (process.env.NODE_ENV === 'production' && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      this.transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      this.isConfigured = true;
      console.log('📧 Email Service: Production mode - emails will be sent');
    } else {
      this.transporter = null;
      this.isConfigured = false;
      console.log('📧 Email Service: Development mode - emails will be logged to console');
    }
    
    // Informations CEPIC
    this.cepicInfo = {
      name: 'CEPIC',
      fullName: 'Centre d\'Expertise et de Perfectionnement Ivoire Compétences',
      email: process.env.EMAIL_USER || 'contact@cepic.ci',
      phone: '+225 07 00 00 00 00',
      address: 'Cocody M\'Badon village, Abidjan, Côte d\'Ivoire',
      website: 'https://cepic.ci',
      colors: {
        primary: '#1e3a5f',
        secondary: '#f59e0b',
        success: '#10b981',
        danger: '#ef4444'
      }
    };
  }
  
  // Template HTML de base
  getEmailTemplate(content, title = '') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, ${this.cepicInfo.colors.primary} 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                      ${this.cepicInfo.name}
                    </h1>
                    <p style="color: ${this.cepicInfo.colors.secondary}; margin: 5px 0 0 0; font-size: 14px;">
                      ${this.cepicInfo.fullName}
                    </p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    ${content}
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                      <strong>${this.cepicInfo.name}</strong>
                    </p>
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px;">
                      ${this.cepicInfo.address}
                    </p>
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px;">
                      ${this.cepicInfo.phone} | ${this.cepicInfo.email}
                    </p>
                    <p style="margin: 15px 0 0 0; color: #9ca3af; font-size: 11px;">
                      © ${new Date().getFullYear()} ${this.cepicInfo.name}. Tous droits réservés.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  async send2FACode(email, code, name = '') {
    // In development mode, just log to console
    if (!this.isConfigured) {
      console.log('\n🔐 2FA CODE EMAIL SIMULATION');
      console.log('='.repeat(50));
      console.log(`📧 To: ${email}`);
      console.log(`👤 Name: ${name || 'User'}`);
      console.log(`🔑 2FA Code: ${code}`);
      console.log(`⏰ Expires: 10 minutes`);
      console.log('='.repeat(50));
      return { success: true };
    }

    const content = `
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Code de vérification</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Bonjour <strong>${name || 'cher(e) utilisateur(trice)'}</strong>,
      </p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Voici votre code de vérification pour finaliser votre inscription :
      </p>
      <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 30px; text-align: center; margin: 30px 0; border-radius: 8px; border: 2px dashed ${this.cepicInfo.colors.primary};">
        <h1 style="color: ${this.cepicInfo.colors.primary}; margin: 0; font-size: 48px; letter-spacing: 10px; font-weight: bold;">${code}</h1>
      </div>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
        ⏰ Ce code expire dans <strong>10 minutes</strong>.
      </p>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
        🔒 Si vous n'avez pas demandé ce code, veuillez ignorer cet email.
      </p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
        Cordialement,<br>
        <strong>L'équipe ${this.cepicInfo.name}</strong>
      </p>
    `;

    const mailOptions = {
      from: `${this.cepicInfo.name} <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Code de vérification ${this.cepicInfo.name}`,
      html: this.getEmailTemplate(content, 'Code de vérification')
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ 2FA code sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(email, name) {
    // In development mode, just log to console
    if (!this.isConfigured) {
      console.log('\n🎉 WELCOME EMAIL SIMULATION');
      console.log('='.repeat(50));
      console.log(`📧 To: ${email}`);
      console.log(`👤 Name: ${name}`);
      console.log(`📄 Subject: Bienvenue au CEPIC!`);
      console.log('='.repeat(50));
      return { success: true };
    }

    const content = `
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Bienvenue au ${this.cepicInfo.name}! 🎉</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Bonjour <strong>${name}</strong>,
      </p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Nous sommes ravis de vous accueillir au sein du <strong>${this.cepicInfo.fullName}</strong>!
      </p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Votre compte a été créé avec succès. Vous pouvez maintenant :
      </p>
      <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
        <li>✅ Parcourir notre catalogue de formations</li>
        <li>✅ Vous inscrire aux formations qui vous intéressent</li>
        <li>✅ Suivre vos inscriptions et votre progression</li>
        <li>✅ Accéder à vos certificats</li>
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${this.cepicInfo.website}/formations" style="display: inline-block; background-color: ${this.cepicInfo.colors.primary}; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Découvrir nos formations</a>
      </div>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
        Pour toute question, n'hésitez pas à nous contacter :
      </p>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 5px 0;">
        📞 ${this.cepicInfo.phone}<br>
        📧 ${this.cepicInfo.email}
      </p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
        À très bientôt,<br>
        <strong>L'équipe ${this.cepicInfo.name}</strong>
      </p>
    `;

    const mailOptions = {
      from: `${this.cepicInfo.name} <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Bienvenue au ${this.cepicInfo.name}!`,
      html: this.getEmailTemplate(content, 'Bienvenue')
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Welcome email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendEnrollmentConfirmation(email, name, trainingData) {
    // In development mode, just log to console
    if (!this.isConfigured) {
      console.log('\n📚 ENROLLMENT CONFIRMATION EMAIL SIMULATION');
      console.log('='.repeat(50));
      console.log(`📧 To: ${email}`);
      console.log(`👤 Name: ${name}`);
      console.log(`📖 Training: ${trainingData.title}`);
      console.log(`💰 Cost: ${trainingData.cost / 100} FCFA`);
      console.log(`📅 Duration: ${trainingData.duration} ${trainingData.durationUnit}`);
      console.log('='.repeat(50));
      return { success: true };
    }

    const content = `
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Confirmation d'inscription ✅</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Bonjour <strong>${name}</strong>,
      </p>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Nous avons le plaisir de confirmer votre inscription à la formation suivante :
      </p>
      <div style="background-color: #f9fafb; border-left: 4px solid ${this.cepicInfo.colors.primary}; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <h3 style="color: ${this.cepicInfo.colors.primary}; margin: 0 0 15px 0; font-size: 20px;">${trainingData.title}</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">📅 Durée :</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${trainingData.duration} ${trainingData.durationUnit === 'hours' ? 'heures' : 'jours'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">📍 Lieu :</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${trainingData.location || 'À définir'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">💰 Montant :</td>
            <td style="padding: 8px 0; color: ${this.cepicInfo.colors.success}; font-size: 16px; font-weight: bold;">${(trainingData.cost / 100).toLocaleString()} FCFA</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">👨‍🏫 Formateur :</td>
            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${trainingData.instructor || 'À définir'}</td>
          </tr>
        </table>
      </div>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
        <strong>Prochaines étapes :</strong>
      </p>
      <ol style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
        <li>Vous recevrez un email avec les détails de la session quelques jours avant le début</li>
        <li>Préparez vos documents et matériels nécessaires</li>
        <li>Connectez-vous à votre espace personnel pour suivre votre progression</li>
      </ol>
      <div style="background-color: #fef3c7; border-left: 4px solid ${this.cepicInfo.colors.secondary}; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="color: #92400e; font-size: 14px; line-height: 1.6; margin: 0;">
          <strong>💡 Conseil :</strong> Consultez régulièrement votre espace personnel pour ne manquer aucune information importante concernant votre formation.
        </p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${this.cepicInfo.website}/mes-inscriptions" style="display: inline-block; background-color: ${this.cepicInfo.colors.primary}; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Voir mes inscriptions</a>
      </div>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
        Nous sommes impatients de vous accompagner dans votre parcours de formation!<br><br>
        Cordialement,<br>
        <strong>L'équipe ${this.cepicInfo.name}</strong>
      </p>
    `;

    const mailOptions = {
      from: `${this.cepicInfo.name} <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Confirmation d'inscription - ${trainingData.title}`,
      html: this.getEmailTemplate(content, 'Confirmation d\'inscription')
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Enrollment confirmation sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Enrollment email sending failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();