const axios = require('axios');
const crypto = require('crypto');

class CinetPayHelper {
  constructor() {
    this.apiKey = process.env.CINETPAY_API_KEY;
    this.siteId = process.env.CINETPAY_SITE_ID;
    this.secretKey = process.env.CINETPAY_SECRET_KEY;
    this.mode = process.env.CINETPAY_MODE || 'SANDBOX';
    this.baseUrl = 'https://api-checkout.cinetpay.com/v2';
  }

  /**
   * Initialiser un paiement
   */
  async initiatePayment(data) {
    const {
      transactionId,
      amount,
      currency = 'XOF',
      description,
      customerName,
      customerSurname,
      customerEmail,
      customerPhone,
      notifyUrl,
      returnUrl,
      channels = 'ALL'
    } = data;

    try {
      const payload = {
        apikey: this.apiKey,
        site_id: this.siteId,
        transaction_id: transactionId,
        amount: amount,
        currency: currency,
        description: description,
        customer_name: customerName,
        customer_surname: customerSurname,
        customer_email: customerEmail,
        customer_phone_number: customerPhone,
        notify_url: notifyUrl || process.env.CINETPAY_NOTIFY_URL,
        return_url: returnUrl || process.env.CINETPAY_RETURN_URL,
        channels: channels,
        metadata: JSON.stringify({
          platform: 'CEPIC',
          mode: this.mode
        })
      };

      const response = await axios.post(
        `${this.baseUrl}/payment`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.code === '201') {
        return {
          success: true,
          data: {
            paymentUrl: response.data.data.payment_url,
            paymentToken: response.data.data.payment_token,
            transactionId: transactionId
          }
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Erreur lors de l\'initialisation du paiement'
        };
      }
    } catch (error) {
      console.error('CinetPay initiate error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion à CinetPay'
      };
    }
  }

  /**
   * Vérifier le statut d'un paiement
   */
  async checkPaymentStatus(transactionId) {
    try {
      const payload = {
        apikey: this.apiKey,
        site_id: this.siteId,
        transaction_id: transactionId
      };

      const response = await axios.post(
        `${this.baseUrl}/payment/check`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.code === '00') {
        const data = response.data.data;
        return {
          success: true,
          data: {
            status: data.status, // ACCEPTED, REFUSED, PENDING
            amount: data.amount,
            currency: data.currency,
            paymentMethod: data.payment_method,
            operatorId: data.operator_id,
            paymentDate: data.payment_date,
            metadata: data.metadata
          }
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Transaction non trouvée'
        };
      }
    } catch (error) {
      console.error('CinetPay check error:', error.response?.data || error.message);
      return {
        success: false,
        error: 'Erreur lors de la vérification du paiement'
      };
    }
  }

  /**
   * Vérifier la signature du webhook
   */
  verifyWebhookSignature(data) {
    const { cpm_trans_id, cpm_amount, cpm_currency, signature } = data;
    
    // Créer la signature attendue
    const expectedSignature = crypto
      .createHash('sha256')
      .update(this.apiKey + this.siteId + cpm_trans_id + cpm_amount + cpm_currency + this.secretKey)
      .digest('hex');

    return signature === expectedSignature;
  }

  /**
   * Générer un ID de transaction unique
   */
  generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `CEPIC_${timestamp}_${random}`;
  }
}

module.exports = new CinetPayHelper();
