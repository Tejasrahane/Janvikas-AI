export type RequestChannel = 'voice' | 'whatsapp' | 'sms' | 'web' | 'kiosk';

export type RequestCategory = 
  | 'Water & Sanitation'
  | 'Rural Roads & Bridges'
  | 'Health & PHC'
  | 'Education & Anganwadis'
  | 'Power & Solar'
  | 'Telecom & Digital'
  | 'Irrigation & Flood Control';

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RequestStatus = 
  | 'Logged'
  | 'Clustered'
  | 'DPR_Drafted'
  | 'Sanctioned'
  | 'Tender_Issued'
  | 'Under_Execution'
  | 'Resolved';

export interface CitizenRequest {
  id: string;
  ticketId: string;
  channel: RequestChannel;
  language: string;
  languageNative: string;
  originalText: string;
  translatedText: string;
  category: RequestCategory;
  subcategory: string;
  urgency: UrgencyLevel;
  severityScore: number; // 0 to 100
  sentiment: 'Urgent' | 'Distressed' | 'Inconvenienced' | 'Constructive';
  location: {
    state: string;
    district: string;
    block: string;
    gramPanchayat: string;
    pincode: string;
    lat: number;
    lng: number;
  };
  attachments?: {
    type: 'image' | 'audio';
    url: string;
    description: string;
    aiTags?: string[];
  }[];
  audioDurationSeconds?: number;
  hotspotClusterId?: string;
  status: RequestStatus;
  timestamp: string;
}

export interface DemandHotspot {
  id: string;
  h3Index: string;
  title: string;
  sector: RequestCategory;
  state: string;
  district: string;
  block: string;
  gramPanchayats: string[];
  lat: number;
  lng: number;
  totalRequests: number;
  compositeUrgency: number; // 0 - 100
  populationAffected: number;
  vulnerabilityIndex: number; // 0 - 100 (SC/ST %, poverty)
  infraDeficitScore: number; // 0 - 100 (distance to services)
  priorityScore: number; // 0 - 100
  nearestFacility: {
    name: string;
    type: string;
    distanceKm: number;
  };
  recommendedProjectTitle: string;
  recommendedProjectId: string;
  estimatedCapexCr: number;
  status: 'Identified' | 'Under Review' | 'DPR Ready' | 'Sanctioned';
}

export interface BillOfQuantityItem {
  item: string;
  unit: string;
  quantity: number;
  sorRate: string;
  amountCr: number;
}

export interface ProjectProposal {
  id: string;
  code: string;
  title: string;
  sector: RequestCategory;
  state: string;
  district: string;
  block: string;
  coveredVillages: string[];
  targetScheme: string;
  ministry: string;
  estimatedCapexCr: number;
  centralSharePercent: number;
  stateSharePercent: number;
  timelineMonths: number;
  estimatedBeneficiaries: number;
  socioEconomicScore: number; // 0 - 100
  healthImpactMetric?: string;
  travelTimeReductionMin?: number;
  agriculturalUpliftPercent?: number;
  dprDetails: {
    executiveSummary: string;
    technicalSpecifications: string[];
    billOfQuantities: BillOfQuantityItem[];
    environmentalClearance: 'Exempt' | 'Category B2 Fast-Track' | 'Approved';
    socialImpactSummary: string;
    projectMilestones: { month: number; milestone: string }[];
  };
  approvalStatus: 'Pending Review' | 'Recommended' | 'Sanctioned' | 'Fund Disbursed';
  sanctionedBy?: string;
  sanctionedDate?: string;
  sourceHotspotId: string;
}

export interface DistrictMetric {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  lat: number;
  lng: number;
  totalRequests: number;
  activeHotspots: number;
  population: number;
  aspirationalDistrict: boolean;
  nitiAayogRank?: number;
  povertyRatePercent: number;
  roadDeficitIndex: number;
  waterStressIndex: number;
  healthDeficitIndex: number;
  sanctionedProjectsCount: number;
  totalSanctionedCapexCr: number;
}

export interface SchemeCatalog {
  id: string;
  code: string;
  name: string;
  hindiName: string;
  ministry: string;
  totalBudgetCr: number;
  utilizedBudgetCr: number;
  availableBudgetCr: number;
  targetSector: RequestCategory;
  maxGrantPerProjectCr: number;
  convergenceEligible: boolean;
}
