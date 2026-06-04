import { z } from 'zod';

// ===== Shared base =====
export const BaseItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string().max(300),
  content: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  source: z.string(),
  sourceUrl: z.string().optional(),
  publishDate: z.string(),
  lastUpdated: z.string(),
});

export type BaseItem = z.infer<typeof BaseItemSchema>;

// ===== Policy =====
export const PolicySchema = BaseItemSchema.extend({
  type: z.literal('policy'),
  issuingBody: z.string(),
  level: z.enum(['国家', '省级', '市级', '区级']),
  documentNumber: z.string().optional(),
});

export type PolicyItem = z.infer<typeof PolicySchema>;

// ===== Competition =====
export const CompetitionSchema = BaseItemSchema.extend({
  type: z.literal('competition'),
  organizer: z.string(),
  district: z.string(),
  applicableGrades: z.array(z.string()),
  subjects: z.array(z.string()),
  registrationDeadline: z.string().optional(),
  officialUrl: z.string().optional(),
});

export type CompetitionItem = z.infer<typeof CompetitionSchema>;

// ===== Admission =====
export const AdmissionSchema = BaseItemSchema.extend({
  type: z.literal('admission'),
  school: z.string(),
  schoolType: z.enum(['市直属', '区属', '民办']),
  admissionQuota: z.number(),
  requiredCertificates: z.array(z.string()),
  examContent: z.array(z.string()),
  enrollmentYear: z.number(),
  applicationPeriod: z.string().optional(),
  scoreRequirement: z.string().optional(),
  examWeight: z.string().optional(),
});

export type AdmissionItem = z.infer<typeof AdmissionSchema>;

// ===== District =====
export const DistrictSchema = BaseItemSchema.extend({
  type: z.literal('district'),
  district: z.string(),
  year: z.number(),
  schoolType: z.enum(['小学', '初中', '九年一贯制']),
  hasDualDistrict: z.boolean().optional(),
  hasSiblingPolicy: z.boolean().optional(),
});

export type DistrictItem = z.infer<typeof DistrictSchema>;

// ===== Union type =====
export type ContentItem = PolicyItem | CompetitionItem | AdmissionItem | DistrictItem;

// ===== Validation helpers =====
export function parseContent(type: string, data: unknown) {
  switch (type) {
    case 'policy': return PolicySchema.parse(data);
    case 'competition': return CompetitionSchema.parse(data);
    case 'admission': return AdmissionSchema.parse(data);
    case 'district': return DistrictSchema.parse(data);
    default: throw new Error(`Unknown content type: ${type}`);
  }
}

export function validateArray(type: string, data: unknown[]) {
  return data.map(item => parseContent(type, item));
}
