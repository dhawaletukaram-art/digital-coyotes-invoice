import { InvoiceItem, ProposalMilestone, ProposalPricingItem, ProposalSection, ServiceInvoicePreset, ServiceProposalPreset } from '../types';

export function makeInvoicePreset(
  title: string,
  items: Array<{ title: string; desc: string; qty: number; rate: number }>,
  terms?: string,
  notes?: string
): ServiceInvoicePreset {
  const lineItems: InvoiceItem[] = items.map((it, idx) => {
    const amount = Math.round(it.qty * it.rate * 1.18);
    return {
      id: `inv-${Date.now()}-${idx}`,
      serviceTitle: it.title,
      description: it.desc,
      quantity: it.qty,
      rate: it.rate,
      discountPercent: 0,
      taxPercent: 18,
      amount
    };
  });

  return {
    items: lineItems,
    notes: notes || `Deliverables certified by Digital Coyotes. Payment in INR via NEFT/RTGS or UPI.`,
    terms: terms || `1. 50% advance before milestone initiation, balance on deployment.\n2. Invoiced with standard 18% GST.\n3. Bengaluru / Indian jurisdiction applies.`,
    taxRate: 18
  };
}

export function makeProposalPreset(
  title: string,
  summary: string,
  scopeOfWork: string[],
  milestones: Array<{ title: string; duration: string; cost: number; deliverable: string }>,
  pricingItems: Array<{ title: string; rate: number }>,
  terms?: string
): ServiceProposalPreset {
  const sections: ProposalSection[] = [
    {
      id: `sec-exec`,
      title: 'Executive Summary',
      content: summary
    },
    {
      id: `sec-scope`,
      title: 'Scope of Work & Deliverables',
      content: scopeOfWork.map((s, i) => `${i + 1}. ${s}`).join('\n')
    },
    {
      id: `sec-sla`,
      title: 'Execution & Quality Assurance',
      content: 'Digital Coyotes guarantees enterprise-grade performance, dedicated weekly sprint synchronization, and transparent Indian Rupee invoicing.'
    }
  ];

  const pMilestones: ProposalMilestone[] = milestones.map((m, idx) => ({
    id: `ms-${idx + 1}`,
    title: m.title,
    duration: m.duration,
    cost: m.cost,
    deliverable: m.deliverable
  }));

  const pItems: ProposalPricingItem[] = pricingItems.map((p, idx) => ({
    id: `pr-${idx + 1}`,
    title: p.title,
    quantity: 1,
    rate: p.rate,
    discountPercent: 0,
    taxPercent: 18,
    amount: Math.round(p.rate * 1.18)
  }));

  return {
    title,
    summary,
    scopeOfWork,
    sections,
    milestones: pMilestones,
    pricingItems: pItems,
    terms: terms || '1. Valid for 30 calendar days from issue.\n2. Milestone delivery cadence with dedicated PM.\n3. All figures stated in Indian Rupees (INR / ₹) excluding/including statutory GST.'
  };
}
