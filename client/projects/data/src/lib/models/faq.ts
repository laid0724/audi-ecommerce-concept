import { DynamicDocument } from "./dynamic-document";

export interface Faq extends Partial<DynamicDocument> {
  faqItems: FaqItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}
