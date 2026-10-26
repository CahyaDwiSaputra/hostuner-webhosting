import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ThemeSettings,
  PaymentConfig,
  HostingPackage,
  VpsPackage,
  DomainExtension,
  FeatureCard,
  TestimonialItem,
  FaqItem,
  User,
  Order,
  CustomerService,
  CustomerDomain,
  SupportTicket,
  OrderItem,
  OrderStatus,
} from '../types';
import {
  INITIAL_THEME,
  INITIAL_PAYMENT_CONFIG,
  INITIAL_HOSTING_PACKAGES,
  INITIAL_VPS_PACKAGES,
  INITIAL_DOMAINS,
  INITIAL_FEATURES,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_USERS,
  INITIAL_SERVICES,
  INITIAL_DOMAINS_CUSTOMER,
  INITIAL_ORDERS,
  INITIAL_TICKETS,
} from '../data/initialData';

export interface OrderDraft {
  packageType: 'hosting' | 'vps';
  selectedPackage: HostingPackage | VpsPackage | null;
  domainOption: 'new' | 'transfer' | 'existing';
  domainName: string;
  domainTld: string;
  domainPrice: number;
  periodMonths: number; // 1, 12, 24, 36
  addons: {
    whoisPrivacy: boolean;
    autoBackup: boolean;
    sslPremium: boolean;
  };
  promoCode: string;
  discountAmount: number;
}

interface AppContextType {
  // Theme & Appearance
  theme: ThemeSettings;
  updateTheme: (newSettings: Partial<ThemeSettings>) => void;
  resetTheme: () => void;

  // Payment Gateway Config
  paymentConfig: PaymentConfig;
  updatePaymentConfig: (newConfig: Partial<PaymentConfig>) => void;

  // CMS Content
  hostingPackages: HostingPackage[];
  addHostingPackage: (pkg: Omit<HostingPackage, 'id'>) => void;
  updateHostingPackage: (id: string, pkg: Partial<HostingPackage>) => void;
  deleteHostingPackage: (id: string) => void;
  resetHostingPackages: () => void;

  vpsPackages: VpsPackage[];
  addVpsPackage: (pkg: Omit<VpsPackage, 'id'>) => void;
  updateVpsPackage: (id: string, pkg: Partial<VpsPackage>) => void;
  deleteVpsPackage: (id: string) => void;

  domainExtensions: DomainExtension[];
  addDomainExtension: (dom: Omit<DomainExtension, 'id'>) => void;
  updateDomainExtension: (id: string, dom: Partial<DomainExtension>) => void;
  deleteDomainExtension: (id: string) => void;

  featureCards: FeatureCard[];
  addFeatureCard: (feat: Omit<FeatureCard, 'id'>) => void;
  updateFeatureCard: (id: string, feat: Partial<FeatureCard>) => void;
  deleteFeatureCard: (id: string) => void;

  testimonials: TestimonialItem[];
  addTestimonial: (testi: Omit<TestimonialItem, 'id'>) => void;
  updateTestimonial: (id: string, testi: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;

  faqs: FaqItem[];
  addFaq: (faq: Omit<FaqItem, 'id'>) => void;
  updateFaq: (id: string, faq: Partial<FaqItem>) => void;
  deleteFaq: (id: string) => void;

  // Auth & Users
  currentUser: User | null;
  users: User[];
  login: (email: string, role?: 'customer' | 'admin') => boolean;
  register: (name: string, email: string, phone: string) => User;
  logout: () => void;
  updateUser: (id: string, data: Partial<User>) => void;

  // Navigation & UI state
  currentView: string; // 'home' | 'hosting' | 'domains' | 'vps' | 'order-config' | 'client-dashboard' | 'admin-dashboard'
  setCurrentView: (view: string) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  activeInvoiceId: string | null;
  setActiveInvoiceId: (id: string | null) => void;

  // Order & Checkout
  orderDraft: OrderDraft;
  setOrderDraft: React.Dispatch<React.SetStateAction<OrderDraft>>;
  startOrderWithPackage: (pkg: HostingPackage | VpsPackage, type: 'hosting' | 'vps') => void;
  startOrderWithDomain: (fullDomain: string, tld: string, price: number) => void;
  orders: Order[];
  createOrderFromDraft: () => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  generateSubdomainPaymentUrl: (order: Order) => string;

  // Customer Services & Domains
  customerServices: CustomerService[];
  customerDomains: CustomerDomain[];
  renewCustomerService: (serviceId: string, months: number) => void;

  // Support Tickets
  tickets: SupportTicket[];
  createTicket: (subject: string, category: SupportTicket['category'], priority: SupportTicket['priority'], initialMsg: string) => void;
  replyTicket: (ticketId: string, message: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to set color shades based on primary hex
function applyBrandColors(hex: string) {
  const root = document.documentElement;
  root.style.setProperty('--color-brand-600', hex);
  root.style.setProperty('--color-brand-500', hex);
  // generate simple variants
  if (hex.startsWith('#')) {
    root.style.setProperty('--color-brand-50', `${hex}15`);
    root.style.setProperty('--color-brand-100', `${hex}25`);
    root.style.setProperty('--color-brand-200', `${hex}45`);
    root.style.setProperty('--color-brand-700', hex);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence state loaders
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('buana_theme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          !parsed.companyName ||
          parsed.companyName !== 'Hostuner Webhosting' ||
          parsed.logoTextFirst === 'Cloud' ||
          parsed.logoTextFirst === 'Host' ||
          parsed.logoTextFirst !== 'Hostuner' ||
          parsed.logoTextSecond !== 'Webhosting'
        ) {
          localStorage.setItem('buana_theme', JSON.stringify(INITIAL_THEME));
          return INITIAL_THEME;
        }
        return parsed;
      } catch {
        return INITIAL_THEME;
      }
    }
    return INITIAL_THEME;
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => {
    const saved = localStorage.getItem('buana_payment_cfg');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.subdomainUrl || !parsed.subdomainUrl.includes('hostuner.com')) {
          localStorage.setItem('buana_payment_cfg', JSON.stringify(INITIAL_PAYMENT_CONFIG));
          return INITIAL_PAYMENT_CONFIG;
        }
        return parsed;
      } catch {
        return INITIAL_PAYMENT_CONFIG;
      }
    }
    return INITIAL_PAYMENT_CONFIG;
  });

  const [hostingPackages, setHostingPackages] = useState<HostingPackage[]>(() => {
    const saved = localStorage.getItem('buana_pkgs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          !Array.isArray(parsed) ||
          parsed.length < 3 || // Auto-restore if less than standard 3 packages
          parsed.some(
            (p: any) =>
              p.name === 'Starter' ||
              p.name === 'Starter Hosting' ||
              p.name === 'Pro' ||
              p.name === 'Business' ||
              p.monthlyPrice === 75000 ||
              p.monthlyPrice === 25000 ||
              !p.whmcsPid
          )
        ) {
          localStorage.setItem('buana_pkgs', JSON.stringify(INITIAL_HOSTING_PACKAGES));
          return INITIAL_HOSTING_PACKAGES;
        }
        return parsed;
      } catch {
        return INITIAL_HOSTING_PACKAGES;
      }
    }
    return INITIAL_HOSTING_PACKAGES;
  });

  // Database Synchronization: Auto-fetch live data from PostgreSQL database
  useEffect(() => {
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length >= 3) {
          setHostingPackages(data.data);
          localStorage.setItem('buana_pkgs', JSON.stringify(data.data));
        }
      })
      .catch((err) => console.warn('Sync packages from DB fallback to local:', err));

    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setTestimonials(data.data);
          localStorage.setItem('buana_testimonials', JSON.stringify(data.data));
        }
      })
      .catch((err) => console.warn('Sync testimonials from DB fallback to local:', err));
  }, []);

  const [vpsPackages, setVpsPackages] = useState<VpsPackage[]>(() => {
    const saved = localStorage.getItem('buana_vps');
    return saved ? JSON.parse(saved) : INITIAL_VPS_PACKAGES;
  });

  const [domainExtensions, setDomainExtensions] = useState<DomainExtension[]>(() => {
    const saved = localStorage.getItem('buana_domains');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.some((d: any) => d.priceRegister === 139000 || d.priceRegister === 110000 || d.priceRegister === 215000)) {
          localStorage.setItem('buana_domains', JSON.stringify(INITIAL_DOMAINS));
          return INITIAL_DOMAINS;
        }
        return parsed;
      } catch {
        return INITIAL_DOMAINS;
      }
    }
    return INITIAL_DOMAINS;
  });

  const [featureCards, setFeatureCards] = useState<FeatureCard[]>(() => {
    const saved = localStorage.getItem('buana_features');
    return saved ? JSON.parse(saved) : INITIAL_FEATURES;
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem('buana_testimonials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.some((t: any) => t.comment && t.comment.includes('Buana Hosting'))) {
          localStorage.setItem('buana_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
          return INITIAL_TESTIMONIALS;
        }
        return parsed;
      } catch {
        return INITIAL_TESTIMONIALS;
      }
    }
    return INITIAL_TESTIMONIALS;
  });

  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    const saved = localStorage.getItem('buana_faqs');
    return saved ? JSON.parse(saved) : INITIAL_FAQS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('buana_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('buana_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('buana_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [customerServices, setCustomerServices] = useState<CustomerService[]>(() => {
    const saved = localStorage.getItem('buana_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [customerDomains, setCustomerDomains] = useState<CustomerDomain[]>(() => {
    const saved = localStorage.getItem('buana_domains_cust');
    return saved ? JSON.parse(saved) : INITIAL_DOMAINS_CUSTOMER;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('buana_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [currentView, setCurrentView] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);

  // Initial order draft (starts empty until user chooses a plan)
  const [orderDraft, setOrderDraft] = useState<OrderDraft>({
    packageType: 'hosting',
    selectedPackage: null,
    domainOption: 'new',
    domainName: '',
    domainTld: '.com',
    domainPrice: 0,
    periodMonths: 12,
    addons: {
      whoisPrivacy: false,
      autoBackup: false,
      sslPremium: false,
    },
    promoCode: '',
    discountAmount: 0,
  });

  // Apply colors when theme updates
  useEffect(() => {
    localStorage.setItem('buana_theme', JSON.stringify(theme));
    applyBrandColors(theme.primaryColor);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('buana_payment_cfg', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  useEffect(() => {
    localStorage.setItem('buana_pkgs', JSON.stringify(hostingPackages));
  }, [hostingPackages]);

  useEffect(() => {
    localStorage.setItem('buana_vps', JSON.stringify(vpsPackages));
  }, [vpsPackages]);

  useEffect(() => {
    localStorage.setItem('buana_domains', JSON.stringify(domainExtensions));
  }, [domainExtensions]);

  useEffect(() => {
    localStorage.setItem('buana_features', JSON.stringify(featureCards));
  }, [featureCards]);

  useEffect(() => {
    localStorage.setItem('buana_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('buana_faqs', JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('buana_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('buana_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('buana_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('buana_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('buana_services', JSON.stringify(customerServices));
  }, [customerServices]);

  useEffect(() => {
    localStorage.setItem('buana_domains_cust', JSON.stringify(customerDomains));
  }, [customerDomains]);

  useEffect(() => {
    localStorage.setItem('buana_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Theme modifiers
  const updateTheme = (newSettings: Partial<ThemeSettings>) => {
    setTheme(prev => ({ ...prev, ...newSettings }));
  };

  const resetTheme = () => {
    setTheme(INITIAL_THEME);
  };

  const updatePaymentConfig = (newConfig: Partial<PaymentConfig>) => {
    setPaymentConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Hosting Packages CRUD (Full PostgreSQL Two-Way Sync)
  const addHostingPackage = (pkg: Omit<HostingPackage, 'id'>) => {
    const tempId = `pkg-${Date.now()}`;
    const newPkg: HostingPackage = { ...pkg, id: tempId };
    setHostingPackages(prev => [...prev, newPkg]);

    fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pkg),
    })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setHostingPackages(prev => prev.map(p => p.id === tempId ? d.data : p));
        }
      })
      .catch(e => console.error('Error saving package to DB:', e));
  };

  const updateHostingPackage = (id: string, pkg: Partial<HostingPackage>) => {
    setHostingPackages(prev => prev.map(p => p.id === id ? { ...p, ...pkg } : p));

    fetch(`/api/packages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pkg),
    }).catch(e => console.error('Error updating package in DB:', e));
  };

  const deleteHostingPackage = (id: string) => {
    setHostingPackages(prev => prev.filter(p => p.id !== id));

    fetch(`/api/packages/${id}`, {
      method: 'DELETE',
    }).catch(e => console.error('Error deleting package in DB:', e));
  };

  const resetHostingPackages = () => {
    setHostingPackages(INITIAL_HOSTING_PACKAGES);
    localStorage.setItem('buana_pkgs', JSON.stringify(INITIAL_HOSTING_PACKAGES));

    fetch('/api/packages/reset', { method: 'POST' })
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.data)) {
          setHostingPackages(d.data);
          localStorage.setItem('buana_pkgs', JSON.stringify(d.data));
        }
      })
      .catch(e => console.error('Error resetting packages in DB:', e));
  };

  // VPS Packages CRUD
  const addVpsPackage = (pkg: Omit<VpsPackage, 'id'>) => {
    const newPkg: VpsPackage = { ...pkg, id: `vps-${Date.now()}` };
    setVpsPackages(prev => [...prev, newPkg]);
  };

  const updateVpsPackage = (id: string, pkg: Partial<VpsPackage>) => {
    setVpsPackages(prev => prev.map(p => p.id === id ? { ...p, ...pkg } : p));
  };

  const deleteVpsPackage = (id: string) => {
    setVpsPackages(prev => prev.filter(p => p.id !== id));
  };

  // Domains CRUD
  const addDomainExtension = (dom: Omit<DomainExtension, 'id'>) => {
    const newDom: DomainExtension = { ...dom, id: `dom-${Date.now()}` };
    setDomainExtensions(prev => [...prev, newDom]);
  };

  const updateDomainExtension = (id: string, dom: Partial<DomainExtension>) => {
    setDomainExtensions(prev => prev.map(d => d.id === id ? { ...d, ...dom } : d));
  };

  const deleteDomainExtension = (id: string) => {
    setDomainExtensions(prev => prev.filter(d => d.id !== id));
  };

  // Features CRUD
  const addFeatureCard = (feat: Omit<FeatureCard, 'id'>) => {
    const newFeat: FeatureCard = { ...feat, id: `feat-${Date.now()}` };
    setFeatureCards(prev => [...prev, newFeat]);
  };

  const updateFeatureCard = (id: string, feat: Partial<FeatureCard>) => {
    setFeatureCards(prev => prev.map(f => f.id === id ? { ...f, ...feat } : f));
  };

  const deleteFeatureCard = (id: string) => {
    setFeatureCards(prev => prev.filter(f => f.id !== id));
  };

  // Testimonials CRUD (Full PostgreSQL Two-Way Sync)
  const addTestimonial = (testi: Omit<TestimonialItem, 'id'>) => {
    const tempId = `testi-${Date.now()}`;
    const newTesti: TestimonialItem = { ...testi, id: tempId };
    setTestimonials(prev => [...prev, newTesti]);

    fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTesti),
    })
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setTestimonials(prev => prev.map(t => t.id === tempId ? d.data : t));
        }
      })
      .catch(e => console.error('Error saving testimonial to DB:', e));
  };

  const updateTestimonial = (id: string, testi: Partial<TestimonialItem>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...testi } : t));

    fetch(`/api/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testi),
    }).catch(e => console.error('Error updating testimonial in DB:', e));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));

    fetch(`/api/testimonials/${id}`, {
      method: 'DELETE',
    }).catch(e => console.error('Error deleting testimonial in DB:', e));
  };

  // FAQs CRUD
  const addFaq = (faq: Omit<FaqItem, 'id'>) => {
    const newFaq: FaqItem = { ...faq, id: `faq-${Date.now()}` };
    setFaqs(prev => [...prev, newFaq]);
  };

  const updateFaq = (id: string, faq: Partial<FaqItem>) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...faq } : f));
  };

  const deleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  // Auth
  const login = (email: string, role?: 'customer' | 'admin') => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (role && found.role !== role) {
        // switch role for demo convenience
        const updated = { ...found, role };
        setCurrentUser(updated);
        setUsers(prev => prev.map(u => u.id === found.id ? updated : u));
        return true;
      }
      setCurrentUser(found);
      return true;
    }
    // If not found, create a demo user with requested role
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      phone: '081234567890',
      role: role || (email.includes('admin') ? 'admin' : 'customer'),
      company: 'CV. Pelanggan Mandiri',
      address: 'Indonesia',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const register = (name: string, email: string, phone: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  // Starting orders from landing page
  const startOrderWithPackage = (pkg: HostingPackage | VpsPackage, type: 'hosting' | 'vps') => {
    setOrderDraft(prev => ({
      ...prev,
      packageType: type,
      selectedPackage: pkg,
      periodMonths: 12, // Default 1 year for best savings
    }));
    setCurrentView('order-config');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startOrderWithDomain = (fullDomain: string, tld: string, price: number) => {
    const dotIndex = fullDomain.lastIndexOf('.');
    const baseName = dotIndex !== -1 ? fullDomain.substring(0, dotIndex) : fullDomain;
    
    // Auto attach recommended hosting package
    const defaultPkg = hostingPackages.find(p => p.isPopular) || hostingPackages[0];
    setOrderDraft(prev => ({
      ...prev,
      packageType: 'hosting',
      selectedPackage: defaultPkg,
      domainOption: 'new',
      domainName: baseName,
      domainTld: tld,
      domainPrice: defaultPkg.freeDomain ? 0 : price,
      periodMonths: 12,
    }));
    setCurrentView('order-config');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generating URL to subdomain payment (WHMCS Hostuner Billing Gateway)
  const generateSubdomainPaymentUrl = (order: Order): string => {
    const template = paymentConfig.urlTemplate;
    const base = paymentConfig.subdomainUrl.replace(/\/+$/, '');
    const returnUrl = encodeURIComponent(`${window.location.origin}?payment_return=${order.id}`);

    const mainItem = order.items.find(i => i.itemType === 'hosting' || i.itemType === 'vps');
    const domainItem = order.items.find(i => i.itemType === 'domain');
    const fullDomain = domainItem?.domainName || mainItem?.domainName || '';

    // WHMCS PID mapping (Mini/Starter=40, Pro=4, Enterprise/Business=5)
    let pid = '4';
    if (orderDraft.selectedPackage && 'whmcsPid' in orderDraft.selectedPackage && orderDraft.selectedPackage.whmcsPid) {
      pid = orderDraft.selectedPackage.whmcsPid.toString();
    } else if (mainItem?.name.toLowerCase().includes('mini') || mainItem?.name.toLowerCase().includes('starter')) {
      pid = '40';
    } else if (mainItem?.name.toLowerCase().includes('enterprise') || mainItem?.name.toLowerCase().includes('business')) {
      pid = '5';
    }

    let billingcycle = (mainItem?.periodMonths || 12) >= 12 ? 'annually' : 'monthly';
    if (pid === '40') {
      billingcycle = 'annually'; // Hosting Mini di Hostuner khusus siklus tahunan
    }

    let url = template
      .replace('{subdomain}', base)
      .replace('{pid}', pid)
      .replace('{billingcycle}', billingcycle)
      .replace('{domain}', encodeURIComponent(fullDomain))
      .replace('{invoice}', encodeURIComponent(order.orderNumber))
      .replace('{amount}', order.total.toString())
      .replace('{customer}', encodeURIComponent(order.userName))
      .replace('{email}', encodeURIComponent(order.userEmail))
      .replace('{return_url}', returnUrl);

    if (!url.startsWith('http')) {
      url = `${base}/cart.php?a=add&pid=${pid}&billingcycle=${billingcycle}&domain=register&query=${encodeURIComponent(fullDomain)}&invoice=${encodeURIComponent(order.orderNumber)}&amount=${order.total}`;
    }
    return url;
  };

  // Create Order from Draft
  const createOrderFromDraft = (): Order => {
    const user = currentUser || {
      id: `usr-${Date.now()}`,
      name: 'Tamu Checkout',
      email: 'tamu@buanalogikautama.co.id',
      phone: '081234567890',
      role: 'customer' as const,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const pkg = orderDraft.selectedPackage;
    const isHosting = orderDraft.packageType === 'hosting';
    const hPkg = isHosting ? (pkg as HostingPackage) : null;
    const vPkg = !isHosting ? (pkg as VpsPackage) : null;

    let basePkgPrice = 0;
    if (hPkg) {
      basePkgPrice = orderDraft.periodMonths >= 12
        ? hPkg.annualDiscountPrice * orderDraft.periodMonths
        : hPkg.monthlyPrice * orderDraft.periodMonths;
    } else if (vPkg) {
      basePkgPrice = vPkg.monthlyPrice * orderDraft.periodMonths;
    }

    const items: OrderItem[] = [
      {
        id: `item-${Date.now()}-1`,
        itemType: orderDraft.packageType,
        name: `${pkg?.name || 'Paket Layanan'} (${orderDraft.periodMonths} Bulan)`,
        periodMonths: orderDraft.periodMonths,
        price: basePkgPrice,
        domainName: orderDraft.domainName ? `${orderDraft.domainName}${orderDraft.domainTld}` : undefined,
        addons: orderDraft.addons,
      },
    ];

    // Domain Item if chosen
    if (orderDraft.domainName && orderDraft.domainOption === 'new') {
      const isFree = hPkg?.freeDomain && orderDraft.periodMonths >= 12;
      items.push({
        id: `item-${Date.now()}-2`,
        itemType: 'domain',
        name: `Registrasi Domain ${orderDraft.domainName}${orderDraft.domainTld} (1 Tahun)`,
        periodMonths: 12,
        price: isFree ? 0 : orderDraft.domainPrice,
        domainName: `${orderDraft.domainName}${orderDraft.domainTld}`,
      });
    }

    // Addons cost
    let addonsTotal = 0;
    if (orderDraft.addons.whoisPrivacy) addonsTotal += 45000;
    if (orderDraft.addons.autoBackup) addonsTotal += 120000;
    if (orderDraft.addons.sslPremium) addonsTotal += 150000;

    const rawSubtotal = basePkgPrice + (items[1]?.price || 0) + addonsTotal;
    const discount = orderDraft.discountAmount || 0;
    const taxableSubtotal = Math.max(0, rawSubtotal - discount);
    const tax = Math.round((taxableSubtotal * paymentConfig.taxPercent) / 100);
    const grandTotal = taxableSubtotal + tax;

    const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(orders.length + 1).padStart(3, '0')}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: invoiceNumber,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      items,
      subtotal: rawSubtotal,
      discount,
      promoCode: orderDraft.promoCode || undefined,
      tax,
      total: grandTotal,
      status: 'pending_payment',
      paymentMethod: 'Subdomain Payment Gateway',
      createdAt: new Date().toISOString(),
    };

    newOrder.subdomainPaymentUrl = generateSubdomainPaymentUrl(newOrder);

    setOrders(prev => [newOrder, ...prev]);

    // Also auto-prepare customer service upon order activation
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated = {
          ...o,
          status,
          paidAt: (status === 'paid' || status === 'active') ? new Date().toISOString() : o.paidAt,
        };
        // If activated, automatically register or activate the service in customerServices
        if (status === 'active' || status === 'paid') {
          const mainItem = o.items.find(i => i.itemType === 'hosting' || i.itemType === 'vps');
          const domainItem = o.items.find(i => i.itemType === 'domain');
          const domainName = mainItem?.domainName || domainItem?.domainName || 'buanacloud.my.id';

          // Add to services if not already added
          const alreadyHasService = customerServices.some(s => s.domainName === domainName);
          if (!alreadyHasService) {
            const expDate = new Date();
            expDate.setMonth(expDate.getMonth() + (mainItem?.periodMonths || 12));

            const newService: CustomerService = {
              id: `srv-${Date.now()}`,
              userId: o.userId,
              serviceType: (mainItem?.itemType === 'vps' ? 'vps' : 'hosting'),
              serviceName: mainItem?.name || 'Paket Hosting Buana',
              domainName: domainName,
              ipAddress: `103.147.154.${Math.floor(Math.random() * 200) + 20}`,
              nameservers: ['ns1.buanahost.com', 'ns2.buanahost.com'],
              status: 'active',
              billingCycleMonths: mainItem?.periodMonths || 12,
              registeredDate: new Date().toISOString().split('T')[0],
              expiryDate: expDate.toISOString().split('T')[0],
              cpanelUsername: domainName.split('.')[0].replace(/[^a-z0-9]/gi, '').toLowerCase().substring(0, 8),
            };
            setCustomerServices(curr => [newService, ...curr]);

            if (domainItem) {
              const newDomain: CustomerDomain = {
                id: `dom-${Date.now()}`,
                userId: o.userId,
                domainName: domainName,
                registrationDate: new Date().toISOString().split('T')[0],
                expiryDate: expDate.toISOString().split('T')[0],
                status: 'active',
                autoRenew: true,
                nameservers: ['ns1.buanahost.com', 'ns2.buanahost.com'],
              };
              setCustomerDomains(curr => [newDomain, ...curr]);
            }
          }
        }
        return updated;
      }
      return o;
    }));
  };

  const renewCustomerService = (serviceId: string, months: number) => {
    setCustomerServices(prev => prev.map(s => {
      if (s.id === serviceId) {
        const curExp = new Date(s.expiryDate);
        curExp.setMonth(curExp.getMonth() + months);
        return {
          ...s,
          expiryDate: curExp.toISOString().split('T')[0],
          status: 'active',
        };
      }
      return s;
    }));
  };

  // Support Tickets
  const createTicket = (subject: string, category: SupportTicket['category'], priority: SupportTicket['priority'], initialMsg: string) => {
    if (!currentUser) return;
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      subject,
      category,
      priority,
      status: 'open',
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'customer',
          senderName: currentUser.name,
          message: initialMsg,
          timestamp: new Date().toLocaleString('id-ID'),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const replyTicket = (ticketId: string, message: string) => {
    if (!currentUser) return;
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const isAdm = currentUser.role === 'admin';
        return {
          ...t,
          status: isAdm ? 'answered' : 'open',
          updatedAt: new Date().toISOString(),
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: isAdm ? 'admin' : 'customer',
              senderName: isAdm ? 'Customer Support Buana' : currentUser.name,
              message,
              timestamp: new Date().toLocaleString('id-ID'),
            },
          ],
        };
      }
      return t;
    }));
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        updateTheme,
        resetTheme,
        paymentConfig,
        updatePaymentConfig,
        hostingPackages,
        addHostingPackage,
        updateHostingPackage,
        deleteHostingPackage,
        resetHostingPackages,
        vpsPackages,
        addVpsPackage,
        updateVpsPackage,
        deleteVpsPackage,
        domainExtensions,
        addDomainExtension,
        updateDomainExtension,
        deleteDomainExtension,
        featureCards,
        addFeatureCard,
        updateFeatureCard,
        deleteFeatureCard,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        faqs,
        addFaq,
        updateFaq,
        deleteFaq,
        currentUser,
        users,
        login,
        register,
        logout,
        updateUser,
        currentView,
        setCurrentView,
        authModalOpen,
        setAuthModalOpen,
        activeInvoiceId,
        setActiveInvoiceId,
        orderDraft,
        setOrderDraft,
        startOrderWithPackage,
        startOrderWithDomain,
        orders,
        createOrderFromDraft,
        updateOrderStatus,
        generateSubdomainPaymentUrl,
        customerServices,
        customerDomains,
        renewCustomerService,
        tickets,
        createTicket,
        replyTicket,
        updateTicketStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
