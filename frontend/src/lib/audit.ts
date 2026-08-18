import { createClient } from '@supabase/supabase-js';

interface AuditLogParams {
  actorId?: string;
  actorRole?: string;
  action: string;
  entityId?: string;
  entityType?: string;
  details?: any;
  ipAddress?: string;
}

export async function logAuditAction({
  actorId = 'SYSTEM',
  actorRole = 'SYSTEM',
  action,
  entityId,
  entityType,
  details = {},
  ipAddress = 'unknown'
}: AuditLogParams) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) return;
    
    // We use the Service Role Key here to bypass RLS, because audit logs 
    // are highly secure system records that shouldn't be affected by user policies.
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    await supabaseAdmin.from('audit_logs').insert({
      actor_id: actorId,
      actor_role: actorRole,
      action,
      entity_id: entityId,
      entity_type: entityType,
      details,
      ip_address: ipAddress
    });
    
    console.log(`[AUDIT LOG] ${action} on ${entityType || 'SYSTEM'}`);
  } catch (error) {
    console.error('[AUDIT LOG FAILED]:', error);
  }
}
