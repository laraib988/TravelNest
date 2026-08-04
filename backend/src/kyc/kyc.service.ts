import { Injectable, NotFoundException } from '@nestjs/common';
import { dbStore, KYCRecord } from '../mock-db/db.store';

@Injectable()
export class KYCService {
  public getStatus(supplierId: string): KYCRecord {
    let record = dbStore.kycRecords.get(supplierId);
    if (!record) {
      record = {
        supplier_id: supplierId,
        company_name: 'Pending Submission',
        business_type: 'CORPORATE',
        business_reg: '',
        tax_id: '',
        kyc_state: 'DRAFT',
        documents: [],
        ocr_confidence: 0,
        ai_fraud_score: 0,
        audit_reasons: [],
        updated_at: new Date().toISOString(),
      };
      dbStore.kycRecords.set(supplierId, record);
    }
    return record;
  }

  public submitDocument(payload: {
    supplier_id: string;
    company_name: string;
    business_type?: 'CORPORATE' | 'INDIVIDUAL_FREELANCER';
    business_reg: string;
    tax_id: string;
    trade_license_doc?: string;
  }): KYCRecord {
    const record = this.getStatus(payload.supplier_id);
    record.company_name = payload.company_name;
    record.business_type = payload.business_type || 'CORPORATE';
    record.business_reg = payload.business_reg;
    record.tax_id = payload.tax_id;
    record.kyc_state = 'SUBMITTED_PENDING_REVIEW';
    record.updated_at = new Date().toISOString();

    const ocrConfidence = Number((0.92 + Math.random() * 0.07).toFixed(2));
    const aiFraudScore = Math.floor(Math.random() * 15);

    record.ocr_confidence = ocrConfidence;
    record.ai_fraud_score = aiFraudScore;

    if (payload.business_type === 'INDIVIDUAL_FREELANCER') {
      record.kyc_state = 'APPROVED_VERIFIED';
      record.audit_reasons = [
        `Individual Tour Guide License ${payload.business_reg} verified with Maritime Tourism Authority`,
        `Personal Tax ID ${payload.tax_id} OCR checksum matched at ${Math.round(ocrConfidence * 100)}% confidence`,
        'Individual Guide Identity & Liability Policy verified by AI Prescreening Engine',
      ];
    } else {
      record.kyc_state = 'APPROVED_VERIFIED';
      record.audit_reasons = [
        `Corporate Registry ${payload.business_reg} verified with Commercial Business Bureau`,
        `Company VAT Tax ID ${payload.tax_id} verified with Ministry of Revenue`,
        'Corporate Marine Liability Policy active & valid for 2026 season',
        'Low risk fraud score auto-cleared by AI Prescreening Engine',
      ];
    }

    dbStore.kycRecords.set(payload.supplier_id, record);
    return record;
  }

  public adminOverride(supplierId: string, action: 'APPROVE' | 'REJECT', reason: string): KYCRecord {
    const record = this.getStatus(supplierId);
    record.kyc_state = action === 'APPROVE' ? 'APPROVED_VERIFIED' : 'REJECTED';
    record.audit_reasons.push(`Admin Override [${new Date().toISOString()}]: ${reason}`);
    record.updated_at = new Date().toISOString();
    return record;
  }
}
