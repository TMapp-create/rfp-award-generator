
import { supabase } from '@/integrations/supabase/client';

interface SecurityEventData {
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  details?: Record<string, any>;
}

interface AuditLogData {
  action: string;
  table_name?: string;
  record_id?: string;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
}

export const useSecurityLog = () => {
  const logSecurityEvent = async (eventData: SecurityEventData) => {
    try {
      const { error } = await supabase
        .from('security_events')
        .insert({
          ...eventData,
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Security logging error:', error);
    }
  };

  const logAuditEvent = async (auditData: AuditLogData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          ...auditData,
          user_id: user?.id,
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Failed to log audit event:', error);
      }
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  };

  const getClientIP = async (): Promise<string | null> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  };

  return {
    logSecurityEvent,
    logAuditEvent
  };
};
