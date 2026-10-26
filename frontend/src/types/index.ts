export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  company?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

export interface HostingPackage {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  monthlyPrice: number;
  annualDiscountPrice: number; // Harga per bulan jika langganan tahunan
  description: string;
  storage: string;
  bandwidth: string;
  websites: string;
  emailAccounts: string;
  databases: string;
  cPanel: boolean;
  freeDomain: boolean;
  freeSSL: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  isActive: boolean;
  displayOrder: number;
  whmcsPid?: number;
}

export interface VpsPackage {
  id: string;
  name: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  ipPublic: string;
  monthlyPrice: number;
  osOptions: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface DomainExtension {
  id: string;
  tld: string; // e.g. '.com', '.id'
  priceRegister: number;
  priceRenew: number;
  priceTransfer: number;
  isPopular?: boolean;
  isPromo?: boolean;
  promoBadge?: string;
  isActive: boolean;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  iconName: 'Server' | 'Shield' | 'Zap' | 'RefreshCw' | 'Headphones' | 'Globe' | 'Cpu' | 'Database';
  badge?: string;
  isActive: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  comment: string;
  rating: number;
  avatar: string;
  isActive: boolean;
}

export interface FaqItem {
  id: string;
  category: 'hosting' | 'domain' | 'billing' | 'general';
  question: string;
  answer: string;
  isActive: boolean;
}

export interface ThemeSettings {
  companyName: string;
  tagline: string;
  primaryColor: string; // Hex color
  logoTextFirst: string;
  logoTextSecond: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  topBannerText: string;
  topBannerEnabled: boolean;
}

export interface PaymentConfig {
  subdomainUrl: string;
  urlTemplate: string;
  simulationMode: boolean;
  taxPercent: number; // e.g. 11 for PPN 11%
}

export type OrderStatus = 'pending_payment' | 'paid' | 'active' | 'cancelled' | 'expired';

export interface OrderItem {
  id: string;
  itemType: 'hosting' | 'vps' | 'domain' | 'addon';
  name: string;
  periodMonths: number; // 1, 12, 24, 36
  price: number;
  domainName?: string;
  addons?: {
    whoisPrivacy?: boolean;
    autoBackup?: boolean;
    sslPremium?: boolean;
  };
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ORD-202610-001
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentRef?: string;
  subdomainPaymentUrl?: string;
  createdAt: string;
  paidAt?: string;
}

export interface CustomerService {
  id: string;
  userId: string;
  serviceType: 'hosting' | 'vps';
  serviceName: string;
  domainName: string;
  ipAddress: string;
  nameservers: string[];
  status: 'active' | 'suspended' | 'pending' | 'expired';
  billingCycleMonths: number;
  registeredDate: string;
  expiryDate: string;
  cpanelUsername?: string;
}

export interface CustomerDomain {
  id: string;
  userId: string;
  domainName: string;
  registrationDate: string;
  expiryDate: string;
  status: 'active' | 'pending' | 'expired';
  autoRenew: boolean;
  nameservers: string[];
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'hosting' | 'domain' | 'billing' | 'technical';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'answered' | 'closed';
  messages: {
    id: string;
    sender: 'customer' | 'admin';
    senderName: string;
    message: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
