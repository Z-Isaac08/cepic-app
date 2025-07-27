const prisma = require('../lib/prisma');
const { auditLogSchema } = require('../schemas/authSchemas');

class AuditLogger {
  static async log(data) {
    try {
      // Ensure data has required structure
      const sanitizedData = {
        userId: data.userId || null,
        action: data.action || 'UNKNOWN',
        resource: data.resource || null,
        details: data.details || {},
        ipAddress: data.ipAddress || '127.0.0.1',
        userAgent: data.userAgent || 'Unknown',
        success: data.success !== undefined ? data.success : true
      };
      
      const validatedData = auditLogSchema.parse(sanitizedData);
      
      await prisma.auditLog.create({
        data: validatedData
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw error to prevent breaking the main flow
    }
  }

  static async logAuth(action, req, userId = null, success = true, details = null) {
    const ipAddress = this.getClientIP(req);
    const userAgent = req.get('User-Agent');
    
    await this.log({
      userId,
      action: `AUTH_${action.toUpperCase()}`,
      resource: 'authentication',
      details: details || {}, // Ensure details is an object, not null
      ipAddress: ipAddress === 'unknown' ? '127.0.0.1' : ipAddress, // Provide valid IP
      userAgent: userAgent || 'Unknown',
      success
    });
  }

  static async logSecurity(action, req, details = null) {
    const ipAddress = this.getClientIP(req);
    const userAgent = req.get('User-Agent');
    
    await this.log({
      action: `SECURITY_${action.toUpperCase()}`,
      resource: 'security',
      details: details || {},
      ipAddress: ipAddress === 'unknown' ? '127.0.0.1' : ipAddress,
      userAgent: userAgent || 'Unknown',
      success: true
    });
  }

  static getClientIP(req) {
    return req.ip || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress || 
           req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
           'unknown';
  }
}

module.exports = AuditLogger;