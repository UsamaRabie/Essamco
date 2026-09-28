import { LucideIcon } from 'lucide-react';
import { Product, Category, InquiryRecord, SiteContent, ShowcaseCard, HeroSlide, FeaturePoint, BrandItem, StatMetric, SiteSeo } from '../../types';

export type AdminTab =
  | 'overview'
  | 'hero'
  | 'categories'
  | 'products'
  | 'retail'
  | 'institutional'
  | 'privateLabel'
  | 'siteContent'
  | 'seo'
  | 'inquiries';

export interface SidebarItem {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
  desc: string;
  count?: number;
  badgeColor?: string;
}

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error';
}
