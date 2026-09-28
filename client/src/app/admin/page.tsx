'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Sliders,
  Building2,
  Factory,
  ShoppingBag,
  Package,
  Layers,
  MessageSquare,
  Globe,
  FolderTree,
} from 'lucide-react';
import {
  Product,
  Category,
  InquiryRecord,
  SiteContent,
  ShowcaseCard,
  HeroSlide,
  FeaturePoint,
  BrandItem,
  StatMetric,
  SiteSeo,
} from '../../types';
import {
  fetchInquiries,
  updateInquiryStatus,
  deleteInquiry,
  fetchSiteContent,
  updateSiteContent,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImageToCloudinary,
  getAdminProfile,
} from '../../lib/api';

// Admin Components
import { AdminTab, SidebarItem, ConfirmModalState, ToastState } from '../../components/admin/types';
import AdminLogin from '../../components/admin/AdminLogin';
import Sidebar from '../../components/admin/Sidebar';
import TopHeader from '../../components/admin/TopHeader';
import ToastNotification from '../../components/admin/ToastNotification';
import ConfirmModal from '../../components/admin/ConfirmModal';

// Admin Tabs
import OverviewTab from '../../components/admin/tabs/OverviewTab';
import HeroTab from '../../components/admin/tabs/HeroTab';
import InstitutionalTab from '../../components/admin/tabs/InstitutionalTab';
import PrivateLabelTab from '../../components/admin/tabs/PrivateLabelTab';
import RetailTab from '../../components/admin/tabs/RetailTab';
import CategoriesTab from '../../components/admin/tabs/CategoriesTab';
import ProductsTab from '../../components/admin/tabs/ProductsTab';
import SiteContentTab from '../../components/admin/tabs/SiteContentTab';
import SeoTab from '../../components/admin/tabs/SeoTab';
import InquiriesTab from '../../components/admin/tabs/InquiriesTab';

// Admin Modals
import CardCrudModal from '../../components/admin/modals/CardCrudModal';
import HeroSlideModal from '../../components/admin/modals/HeroSlideModal';
import MetricModal from '../../components/admin/modals/MetricModal';
import FeaturePointModal from '../../components/admin/modals/FeaturePointModal';
import BrandModal from '../../components/admin/modals/BrandModal';
import CategoryCrudModal from '../../components/admin/modals/CategoryCrudModal';
import ProductCrudModal from '../../components/admin/modals/ProductCrudModal';

export default function AdminPage() {
  // -------------------------------------------------------------
  // 1. AUTHENTICATION & APP STATE
  // -------------------------------------------------------------
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data States
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [siteContentData, setSiteContentData] = useState<SiteContent | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [savingContent, setSavingContent] = useState(false);

  // Upload States
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingItem, setUploadingItem] = useState<string | null>(null);
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);

  // Product & Category Modal States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Notification Toast State
  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: () => {},
  });

  const openConfirm = (opts: {
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title: opts.title,
      message: opts.message,
      confirmText: opts.confirmText || 'نعم، احذف',
      onConfirm: () => {
        opts.onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // -------------------------------------------------------------
  // 2. MODALS FORM STATES
  // -------------------------------------------------------------
  // Card Modal
  const [cardModalSection, setCardModalSection] = useState<'institutional' | 'privateLabel' | 'retail' | null>(null);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [cardForm, setCardForm] = useState<ShowcaseCard>({
    slug: '',
    title: '',
    titleAr: '',
    shortDescription: '',
    shortDescriptionAr: '',
    description: '',
    descriptionAr: '',
    image: '',
    images: [],
    badge: '',
    badgeAr: '',
    features: [],
    featuresAr: [],
  });

  // Hero Slide Modal
  const [heroSlideModalOpen, setHeroSlideModalOpen] = useState(false);
  const [editingHeroSlideIndex, setEditingHeroSlideIndex] = useState<number | null>(null);
  const [heroSlideForm, setHeroSlideForm] = useState<HeroSlide>({
    title: '',
    titleAr: '',
    subtitle: '',
    subtitleAr: '',
    badge: '',
    badgeAr: '',
    image: '/images/showcase/hero_scientist_clean.png',
    primaryBtnText: 'Explore Our Products',
    primaryBtnTextAr: 'استكشف منتجاتنا',
    primaryBtnLink: 'products',
    secondaryBtnText: 'Request a Quote',
    secondaryBtnTextAr: 'طلب عرض سعر',
    secondaryBtnLink: 'quote',
  });

  // Metric Modal
  const [metricModalOpen, setMetricModalOpen] = useState(false);
  const [metricForm, setMetricForm] = useState<StatMetric>({ value: '', label: '', labelAr: '' });

  // Feature Point Modal
  const [pointModalOpen, setPointModalOpen] = useState(false);
  const [pointForm, setPointForm] = useState<FeaturePoint>({ title: '', titleAr: '', desc: '', descAr: '' });

  // Brand Modal
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [brandForm, setBrandForm] = useState<BrandItem>({ name: '', nameAr: '', image: '', slug: '' });

  // -------------------------------------------------------------
  // 3. INITIALIZATION & DATA FETCHING
  // -------------------------------------------------------------
  useEffect(() => {
    const savedToken = localStorage.getItem('essamco_admin_token');
    if (savedToken) {
      // Proactively validate the saved token against the backend
      getAdminProfile(savedToken)
        .then((res) => {
          if (res.success && res.data) {
            setToken(savedToken);
            setAdminUser(res.data as { name: string; email: string; role: string });
          } else {
            // Token is invalid/expired -> clean up stale storage and prompt login
            localStorage.removeItem('essamco_admin_token');
            localStorage.removeItem('essamco_admin_user');
            setToken(null);
            setAdminUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('essamco_admin_token');
          localStorage.removeItem('essamco_admin_user');
          setToken(null);
          setAdminUser(null);
        });
    }
  }, []);

  const loadAllData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const [inqs, content, prods, cats] = await Promise.all([
        fetchInquiries(token),
        fetchSiteContent(),
        fetchProducts(),
        fetchCategories(),
      ]);
      setInquiries(inqs || []);
      if (content) setSiteContentData(content);
      setProducts(prods || []);
      setCategories(cats || []);
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  // Handle Login & Logout
  const handleLoginSuccess = (newToken: string, user: { name: string; email: string; role: string }) => {
    setToken(newToken);
    setAdminUser(user);
    localStorage.setItem('essamco_admin_token', newToken);
    localStorage.setItem('essamco_admin_user', JSON.stringify(user));
    showToast('تم تسجيل الدخول بنجاح إلى لوحة تحكم عصامكو');
  };

  const handleLogout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('essamco_admin_token');
    localStorage.removeItem('essamco_admin_user');
  };

  // Direct Save helper
  const saveContentDirectly = async (dataToSave?: SiteContent) => {
    const data = dataToSave || siteContentData;
    if (!token || !data) return;
    setSavingContent(true);
    try {
      const res = await updateSiteContent(data, token);
      if (res.success) {
        if (res.data) setSiteContentData(res.data);
        showToast('تم حفظ التعديلات بنجاح في قاعدة البيانات');
      } else {
        showToast(res.message || 'فشل حفظ التعديلات', 'error');
      }
      return res;
    } catch (err) {
      showToast('خطأ في الاتصال بالسيرفر أثناء الحفظ', 'error');
    } finally {
      setSavingContent(false);
    }
  };

  // -------------------------------------------------------------
  // 4. ACTION HANDLERS (CATEGORIES, PRODUCTS, CARDS, SLIDES, SEO, INQUIRIES)
  // -------------------------------------------------------------
  // --- Category CRUD Handlers ---
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    if (!token) return;
    try {
      if (editingCategory && editingCategory._id) {
        const res = await updateCategory(editingCategory._id, categoryData, token);
        if (res.success) {
          showToast('تم تحديث بيانات التصنيف بنجاح');
          const [refreshedCats, refreshedProds] = await Promise.all([
            fetchCategories(),
            fetchProducts(),
          ]);
          setCategories(refreshedCats);
          setProducts(refreshedProds);
        } else {
          showToast(res.message || 'فشل تحديث التصنيف', 'error');
        }
      } else {
        const res = await createCategory(categoryData, token);
        if (res.success) {
          showToast('تمت إضافة التصنيف الجديد بنجاح');
          const refreshedCats = await fetchCategories();
          setCategories(refreshedCats);
        } else {
          showToast(res.message || 'فشل إضافة التصنيف', 'error');
        }
      }
    } catch (err) {
      showToast('خطأ أثناء حفظ التصنيف', 'error');
    }
  };

  const handleDeleteCategory = (category: Category) => {
    if (!token || !category._id) return;
    const name = category.nameAr || category.name;
    openConfirm({
      title: 'حذف تصنيف من قاعدة البيانات',
      message: `هل أنت متأكد من حذف التصنيف "${name}" نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: 'نعم، احذف التصنيف',
      onConfirm: async () => {
        const res = await deleteCategory(category._id!, token);
        if (res.success) {
          showToast('تم حذف التصنيف بنجاح');
          const [refreshedCats, refreshedProds] = await Promise.all([
            fetchCategories(),
            fetchProducts(),
          ]);
          setCategories(refreshedCats);
          setProducts(refreshedProds);
        } else {
          showToast(res.message || 'فشل حذف التصنيف', 'error');
        }
      },
    });
  };

  const handleCategoryImageUpload = async (categoryId: string, file: File) => {
    if (!token) return;
    setUploadingItem(`cat-${categoryId}`);
    try {
      const res = await uploadImageToCloudinary(file, token);
      if (res.success && res.url) {
        const updateRes = await updateCategory(categoryId, { image: res.url }, token);
        if (updateRes.success) {
          showToast('تم تحديث صورة التصنيف بنجاح');
          const refreshedCats = await fetchCategories();
          setCategories(refreshedCats);
        } else {
          showToast('فشل تحديث صورة التصنيف', 'error');
        }
      } else {
        showToast(res.message || 'فشل رفع الصورة', 'error');
      }
    } finally {
      setUploadingItem(null);
    }
  };

  // --- Product CRUD Handlers ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (!token) return;
    try {
      if (editingProduct && editingProduct._id) {
        const res = await updateProduct(editingProduct._id, productData, token);
        if (res.success) {
          showToast('تم تحديث بيانات المنتج بنجاح');
          const [refreshedProds, refreshedCats] = await Promise.all([
            fetchProducts(),
            fetchCategories(),
          ]);
          setProducts(refreshedProds);
          setCategories(refreshedCats);
        } else {
          showToast(res.message || 'فشل تحديث المنتج', 'error');
        }
      } else {
        const res = await createProduct(productData, token);
        if (res.success) {
          showToast('تمت إضافة المنتج الجديد للكتالوج بنجاح');
          const [refreshedProds, refreshedCats] = await Promise.all([
            fetchProducts(),
            fetchCategories(),
          ]);
          setProducts(refreshedProds);
          setCategories(refreshedCats);
        } else {
          showToast(res.message || 'فشل إضافة المنتج', 'error');
        }
      }
    } catch (err) {
      showToast('خطأ أثناء حفظ المنتج', 'error');
    }
  };

  const handleDeleteProduct = (product: Product) => {
    if (!token || !product._id) return;
    const name = product.nameAr || product.name;
    openConfirm({
      title: 'حذف منتج من الكتالوج',
      message: `هل أنت متأكد من حذف المنتج "${name}" نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: 'نعم، احذف المنتج',
      onConfirm: async () => {
        const res = await deleteProduct(product._id!, token);
        if (res.success) {
          showToast('تم حذف المنتج بنجاح من قاعدة البيانات');
          const [refreshedProds, refreshedCats] = await Promise.all([
            fetchProducts(),
            fetchCategories(),
          ]);
          setProducts(refreshedProds);
          setCategories(refreshedCats);
        } else {
          showToast(res.message || 'فشل حذف المنتج', 'error');
        }
      },
    });
  };

  const handleProductImageUpload = async (productId: string, file: File) => {
    if (!token) return;
    setUploadingItem(productId);
    try {
      const res = await uploadImageToCloudinary(file, token);
      if (res.success && res.url) {
        const updateRes = await updateProduct(productId, { image: res.url }, token);
        if (updateRes.success) {
          showToast('تم تحديث صورة المنتج بنجاح');
          const refreshed = await fetchProducts();
          setProducts(refreshed);
        } else {
          showToast('فشل ربط الصورة بالمنتج', 'error');
        }
      } else {
        showToast(res.message || 'فشل رفع الصورة', 'error');
      }
    } finally {
      setUploadingItem(null);
    }
  };
  // Hero Image Upload
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token || !siteContentData) return;
    setUploadingHero(true);
    const res = await uploadImageToCloudinary(file, token);
    setUploadingHero(false);
    if (res.success && res.url) {
      const updated = {
        ...siteContentData,
        hero: { ...siteContentData.hero, image: res.url },
      };
      setSiteContentData(updated);
      await saveContentDirectly(updated);
    } else {
      showToast(res.message || 'Hero image upload failed', 'error');
    }
  };

  // Reset Hero Image
  const handleResetHeroImage = () => {
    if (!siteContentData) return;
    openConfirm({
      title: 'استعادة صورة الهيرو الافتراضية',
      message: 'هل أنت متأكد من رغبتك في استعادة صورة كيميائي المختبر الافتراضية؟',
      confirmText: 'نعم، استعادة',
      onConfirm: async () => {
        const updated = {
          ...siteContentData,
          hero: { ...siteContentData.hero, image: '/images/showcase/hero_scientist_clean.png' },
        };
        setSiteContentData(updated);
        await saveContentDirectly(updated);
      },
    });
  };

  // Card Image Upload (Cover)
  const handleCardImageUpload = async (
    section: 'institutional' | 'privateLabel' | 'retail',
    index: number,
    file: File
  ) => {
    if (!token || !siteContentData) return;
    setUploadingItem(`${section}-${index}`);
    const res = await uploadImageToCloudinary(file, token);
    setUploadingItem(null);
    if (res.success && res.url) {
      const updatedCards = [...siteContentData[section].cards];
      updatedCards[index] = { ...updatedCards[index], image: res.url };
      const updated = {
        ...siteContentData,
        [section]: { ...siteContentData[section], cards: updatedCards },
      };
      setSiteContentData(updated);
      await saveContentDirectly(updated);
    } else {
      showToast(res.message || 'Upload failed', 'error');
    }
  };

  // Why Us Image Upload
  const handleWhyUsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token || !siteContentData) return;
    setUploadingItem('why-us');
    const res = await uploadImageToCloudinary(file, token);
    setUploadingItem(null);
    if (res.success && res.url) {
      const updated = {
        ...siteContentData,
        whyChooseUs: { ...siteContentData.whyChooseUs, image: res.url },
      };
      setSiteContentData(updated);
      await saveContentDirectly(updated);
    } else {
      showToast(res.message || 'Upload failed', 'error');
    }
  };

  // Reset Why Us Image
  const handleResetWhyUsImage = () => {
    if (!siteContentData) return;
    openConfirm({
      title: 'استعادة صورة المختبر الافتراضية',
      message: 'هل أنت متأكد من رغبتك في استعادة صورة المختبر الافتراضية؟',
      confirmText: 'نعم، استعادة',
      onConfirm: async () => {
        const updated = {
          ...siteContentData,
          whyChooseUs: {
            ...siteContentData.whyChooseUs,
            image: '/images/showcase/why_us_scientist_hd.png',
          },
        };
        setSiteContentData(updated);
        await saveContentDirectly(updated);
      },
    });
  };

  // Brand Logo Upload
  const handleBrandImageUpload = async (index: number, file: File) => {
    if (!token || !siteContentData?.brands) return;
    setUploadingItem(`brand-${index}`);
    const res = await uploadImageToCloudinary(file, token);
    setUploadingItem(null);
    if (res.success && res.url) {
      const updatedBrands = [...siteContentData.brands];
      updatedBrands[index] = { ...updatedBrands[index], image: res.url };
      const updated = { ...siteContentData, brands: updatedBrands };
      setSiteContentData(updated);
      await saveContentDirectly(updated);
    } else {
      showToast(res.message || 'Upload failed', 'error');
    }
  };

  // SEO Share Image Upload
  const handleSeoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token || !siteContentData) return;
    setUploadingItem('seo-og');
    const res = await uploadImageToCloudinary(file, token);
    setUploadingItem(null);
    if (res.success && res.url) {
      const currentSeo = siteContentData.seo || {
        metaTitle: '',
        metaTitleAr: '',
        metaDescription: '',
        metaDescriptionAr: '',
        keywords: '',
        keywordsAr: '',
        ogImage: '',
        canonicalUrl: '',
        robotsIndex: true,
        robotsFollow: true,
      };
      const updated = {
        ...siteContentData,
        seo: { ...currentSeo, ogImage: res.url },
      };
      setSiteContentData(updated);
      await saveContentDirectly(updated);
    } else {
      showToast(res.message || 'Upload failed', 'error');
    }
  };

  // Reset SEO Defaults
  const handleResetSeoDefaults = () => {
    if (!siteContentData || !token) return;
    openConfirm({
      title: 'استعادة إعدادات SEO الافتراضية',
      message: 'هل أنت متأكد من استعادة كافة إعدادات وعناوين الـ SEO الموصى بها وحفظها في قاعدة البيانات؟',
      confirmText: 'نعم، استعادة وحفظ',
      onConfirm: async () => {
        const updated = {
          ...siteContentData,
          seo: {
            metaTitle: 'ESSAMCO | Industrial Detergents & Disinfectants Manufacturer',
            metaTitleAr: 'عصامكو | تصنيع المنظفات والمطهرات الصناعية وحلول التطهير',
            metaDescription:
              'ESSAMCO is an Egyptian manufacturer of ISO-certified industrial detergents, disinfectants, institutional hygiene solutions, and private label chemicals since 1997.',
            metaDescriptionAr:
              'شركة عصامكو لصناعة المنظفات والمطهرات الكيميائية المعتمدة وفقاً لمعايير الآيزو، حلول النظافة المؤسسية والتصنيع للغير منذ عام 1997.',
            keywords:
              'industrial detergents, disinfectants, ISO 9001, hospital hygiene, private label manufacturing, Egypt chemicals, bulk cleaning supply',
            keywordsAr:
              'منظفات صناعية، مطهرات، شهادة الآيزو، تعقيم مستشفيات، تصنيع للغير، كيماويات مصر، توريد منظفات بالجملة',
            ogImage: '/images/showcase/hero_scientist_clean.png',
            canonicalUrl: 'https://essamco.com',
            robotsIndex: true,
            robotsFollow: true,
          },
        };
        setSiteContentData(updated);
        await saveContentDirectly(updated);
      },
    });
  };

  // --- Hero Slides CRUD ---
  const handleOpenAddHeroSlide = () => {
    setEditingHeroSlideIndex(null);
    setHeroSlideForm({
      title: '',
      titleAr: '',
      subtitle: '',
      subtitleAr: '',
      badge: '',
      badgeAr: '',
      image: '/images/showcase/hero_scientist_clean.png',
      primaryBtnText: 'Explore Our Products',
      primaryBtnTextAr: 'استكشف منتجاتنا',
      primaryBtnLink: 'products',
      secondaryBtnText: 'Request a Quote',
      secondaryBtnTextAr: 'طلب عرض سعر',
      secondaryBtnLink: 'quote',
    });
    setHeroSlideModalOpen(true);
  };

  const handleOpenEditHeroSlide = (index: number) => {
    if (!siteContentData?.heroSlides?.[index]) return;
    setEditingHeroSlideIndex(index);
    setHeroSlideForm({ ...siteContentData.heroSlides[index] });
    setHeroSlideModalOpen(true);
  };

  const handleSaveHeroSlide = async () => {
    if (!siteContentData || !token) return;
    if (!heroSlideForm.title?.trim() && !heroSlideForm.titleAr?.trim()) {
      showToast('عنوان الشريحة مطلوب', 'error');
      return;
    }

    const currentSlides = [...(siteContentData.heroSlides || [])];
    if (editingHeroSlideIndex !== null) {
      currentSlides[editingHeroSlideIndex] = heroSlideForm;
    } else {
      currentSlides.push({
        ...heroSlideForm,
        id: `slide-${Date.now()}`,
      });
    }

    const updated = { ...siteContentData, heroSlides: currentSlides };
    setSiteContentData(updated);
    setHeroSlideModalOpen(false);
    await saveContentDirectly(updated);
  };

  const handleDeleteHeroSlide = (index: number) => {
    if (!siteContentData?.heroSlides || !token) return;
    if (siteContentData.heroSlides.length <= 1) {
      showToast('يجب الاحتفاظ بسلايد واحد على الأقل في الهيرو', 'error');
      return;
    }
    const sTitle = siteContentData.heroSlides[index]?.titleAr || siteContentData.heroSlides[index]?.title || `شريحة #${index + 1}`;
    openConfirm({
      title: 'حذف شريحة من الهيرو',
      message: `هل أنت متأكد من حذف الشريحة "${sTitle}" من سلايدر الهيرو الرئيسي؟`,
      confirmText: 'نعم، احذف',
      onConfirm: async () => {
        const updatedSlides = siteContentData.heroSlides!.filter((_, i) => i !== index);
        const updated = { ...siteContentData, heroSlides: updatedSlides };
        setSiteContentData(updated);
        await saveContentDirectly(updated);
      },
    });
  };

  // --- Cards CRUD ---
  const handleOpenAddCardModal = (section: 'institutional' | 'privateLabel' | 'retail') => {
    setCardModalSection(section);
    setEditingCardIndex(null);
    setCardForm({
      slug: '',
      title: '',
      titleAr: '',
      shortDescription: '',
      shortDescriptionAr: '',
      description: '',
      descriptionAr: '',
      image: '/images/showcase/bulk_contracts.png',
      images: ['/images/showcase/bulk_contracts.png'],
      badge: '',
      badgeAr: '',
      features: [],
      featuresAr: [],
    });
  };

  const handleOpenEditCardModal = (section: 'institutional' | 'privateLabel' | 'retail', index: number) => {
    if (!siteContentData?.[section]?.cards?.[index]) return;
    const card = siteContentData[section].cards[index];
    setCardModalSection(section);
    setEditingCardIndex(index);
    setCardForm({
      slug: card.slug || '',
      title: card.title || '',
      titleAr: card.titleAr || '',
      shortDescription: card.shortDescription || '',
      shortDescriptionAr: card.shortDescriptionAr || '',
      description: card.description || '',
      descriptionAr: card.descriptionAr || '',
      image: card.image || '/images/showcase/bulk_contracts.png',
      images: card.images && card.images.length > 0 ? card.images : [card.image],
      badge: card.badge || '',
      badgeAr: card.badgeAr || '',
      features: card.features || [],
      featuresAr: card.featuresAr || [],
    });
  };

  const handleCreateOrUpdateCard = async () => {
    if (!cardModalSection || !siteContentData || !token) return;
    if (!cardForm.title?.trim() && !cardForm.titleAr?.trim()) {
      showToast('عنوان الكارت مطلوب', 'error');
      return;
    }

    const currentCards = [...(siteContentData[cardModalSection]?.cards || [])];
    const generatedSlug =
      cardForm.slug?.trim() ||
      cardForm.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      `item-${Date.now()}`;

    const cardToSave: ShowcaseCard = {
      ...cardForm,
      slug: generatedSlug,
      image: cardForm.image?.trim() || '/images/showcase/bulk_contracts.png',
      images:
        cardForm.images && cardForm.images.length > 0
          ? cardForm.images
          : [cardForm.image?.trim() || '/images/showcase/bulk_contracts.png'],
    };

    if (editingCardIndex !== null) {
      currentCards[editingCardIndex] = cardToSave;
    } else {
      currentCards.push(cardToSave);
    }

    const updated = {
      ...siteContentData,
      [cardModalSection]: {
        ...siteContentData[cardModalSection],
        cards: currentCards,
      },
    };

    setSiteContentData(updated);
    setCardModalSection(null);
    setEditingCardIndex(null);
    await saveContentDirectly(updated);
  };

  const handleDeleteCard = (section: 'institutional' | 'privateLabel' | 'retail', index: number) => {
    if (!siteContentData || !token) return;
    if (siteContentData[section].cards.length <= 1) {
      showToast('يجب الاحتفاظ بكارت واحد على الأقل في هذا القسم', 'error');
      return;
    }
    const cardTitle = siteContentData[section].cards[index]?.titleAr || siteContentData[section].cards[index]?.title || `كارت #${index + 1}`;
    openConfirm({
      title: 'حذف الكارت',
      message: `هل أنت متأكد من رغبتك في حذف "${cardTitle}" نهائياً من قاعدة البيانات؟`,
      confirmText: 'نعم، احذف',
      onConfirm: async () => {
        const updatedCards = siteContentData[section].cards.filter((_, i) => i !== index);
        const updated = {
          ...siteContentData,
          [section]: { ...siteContentData[section], cards: updatedCards },
        };
        setSiteContentData(updated);
        await saveContentDirectly(updated);
      },
    });
  };

  // --- Metrics CRUD ---
  const handleCreateMetric = async () => {
    if (!siteContentData || !token) return;
    if (!metricForm.value.trim() || !metricForm.label.trim()) {
      showToast('القيمة والتسمية مطلوبتان للمؤشر', 'error');
      return;
    }
    const currentMetrics = siteContentData.stats?.metrics || [];
    const updated = {
      ...siteContentData,
      stats: {
        ...siteContentData.stats,
        metrics: [...currentMetrics, { ...metricForm }],
      },
    };
    setSiteContentData(updated);
    setMetricModalOpen(false);
    setMetricForm({ value: '', label: '', labelAr: '' });
    await saveContentDirectly(updated);
  };

  const handleDeleteMetric = (index: number) => {
    if (!siteContentData?.stats?.metrics || !token) return;
    if (siteContentData.stats.metrics.length <= 1) {
      showToast('يجب الاحتفاظ بمقياس واحد على الأقل', 'error');
      return;
    }
    const label = siteContentData.stats.metrics[index]?.labelAr || siteContentData.stats.metrics[index]?.label || `مؤشر #${index + 1}`;
    openConfirm({
      title: 'حذف المؤشر الرقمي',
      message: `هل أنت متأكد من حذف المؤشر "${label}" نهائياً؟`,
      confirmText: 'نعم، احذف',
      onConfirm: async () => {
        const updatedMetrics = siteContentData.stats!.metrics!.filter((_, i) => i !== index);
        const updated = {
          ...siteContentData,
          stats: { ...siteContentData.stats, metrics: updatedMetrics },
        };
        setSiteContentData(updated);
        await saveContentDirectly(updated);
      },
    });
  };

  // --- Feature Points CRUD ---
  const handleCreatePoint = async () => {
    if (!siteContentData || !token) return;
    if (!pointForm.title.trim() || !pointForm.desc.trim()) {
      showToast('عنوان الميزة والوصف مطلوبان', 'error');
      return;
    }
    const currentPoints = siteContentData.whyChooseUs?.points || [];
    const updated = {
      ...siteContentData,
      whyChooseUs: {
        ...siteContentData.whyChooseUs,
        points: [...currentPoints, { ...pointForm }],
      },
    };
    setSiteContentData(updated);
    setPointModalOpen(false);
    setPointForm({ title: '', titleAr: '', desc: '', descAr: '' });
    await saveContentDirectly(updated);
  };

  const handleDeletePoint = (index: number) => {
    if (!siteContentData?.whyChooseUs?.points || !token) return;
    if (siteContentData.whyChooseUs.points.length <= 1) {
      showToast('يجب الاحتفاظ بميزة واحدة على الأقل', 'error');
      return;
    }
    const title = siteContentData.whyChooseUs.points[index]?.titleAr || siteContentData.whyChooseUs.points[index]?.title || `ميزة #${index + 1}`;
    openConfirm({
      title: 'حذف الميزة',
      message: `هل أنت متأكد من حذف الميزة "${title}" نهائياً؟`,
      confirmText: 'نعم، احذف',
      onConfirm: async () => {
        const updated = siteContentData.whyChooseUs!.points!.filter((_, i) => i !== index);
        const updatedContent = {
          ...siteContentData,
          whyChooseUs: { ...siteContentData.whyChooseUs, points: updated },
        };
        setSiteContentData(updatedContent);
        await saveContentDirectly(updatedContent);
      },
    });
  };

  // --- Brands CRUD ---
  const handleCreateBrand = async () => {
    if (!siteContentData || !token) return;
    if (!brandForm.name.trim() || !brandForm.image.trim()) {
      showToast('اسم العلامة التجارية وصورتها مطلوبان', 'error');
      return;
    }
    const currentBrands = siteContentData.brands || [];
    const updated = {
      ...siteContentData,
      brands: [
        ...currentBrands,
        {
          ...brandForm,
          slug: brandForm.slug?.trim() || brandForm.name.toLowerCase().replace(/\s+/g, '-'),
        },
      ],
    };
    setSiteContentData(updated);
    setBrandModalOpen(false);
    setBrandForm({ name: '', nameAr: '', image: '', slug: '' });
    await saveContentDirectly(updated);
  };

  const handleDeleteBrand = (index: number) => {
    if (!siteContentData?.brands || !token) return;
    if (siteContentData.brands.length <= 1) {
      showToast('يجب الاحتفاظ بعلامة تجارية واحدة على الأقل', 'error');
      return;
    }
    const bName = siteContentData.brands[index]?.nameAr || siteContentData.brands[index]?.name || `ماركة #${index + 1}`;
    openConfirm({
      title: 'حذف العلامة التجارية',
      message: `هل أنت متأكد من حذف الماركة "${bName}" نهائياً من قاعدة البيانات؟`,
      confirmText: 'نعم، احذف',
      onConfirm: async () => {
        const updated = siteContentData.brands!.filter((_, i) => i !== index);
        const updatedContent = { ...siteContentData, brands: updated };
        setSiteContentData(updatedContent);
        await saveContentDirectly(updatedContent);
      },
    });
  };

  // --- Inquiries CRUD ---
  const handleStatusChange = async (id: string, status: InquiryRecord['status']) => {
    if (!token) return;
    const res = await updateInquiryStatus(id, status, token);
    if (res.success) {
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === id ? { ...inq, status } : inq))
      );
      showToast('تم تحديث حالة طلب عرض السعر');
    } else {
      showToast('فشل تحديث الحالة', 'error');
    }
  };

  const handleDeleteInquiry = (id: string) => {
    if (!token) return;
    openConfirm({
      title: 'حذف طلب عرض السعر',
      message: 'هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      confirmText: 'نعم، احذف الطلب',
      onConfirm: async () => {
        const res = await deleteInquiry(id, token);
        if (res.success) {
          setInquiries((prev) => prev.filter((inq) => inq._id !== id));
          showToast('تم حذف الطلب بنجاح');
        } else {
          showToast('فشل حذف الطلب', 'error');
        }
      },
    });
  };

  // -------------------------------------------------------------
  // 5. UNCOMMITTED / NOT LOGGED IN VIEW
  // -------------------------------------------------------------
  if (!token) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // -------------------------------------------------------------
  // 6. SIDEBAR ITEMS DEFINITION
  // -------------------------------------------------------------
  const sidebarItems: SidebarItem[] = [
    {
      id: 'overview',
      label: 'نظرة عامة وإحصائيات',
      icon: LayoutDashboard,
      desc: 'ملخص النشاط والطلبات',
    },
    {
      id: 'hero',
      label: 'سلايدر الهيرو الرئيسي',
      icon: Sliders,
      desc: 'شرائح العرض (10 ثوانٍ تلقائي)',
      count: siteContentData?.heroSlides?.length || 0,
    },
    {
      id: 'institutional',
      label: 'الحلول المؤسسية',
      icon: Building2,
      desc: 'عقود التوريد والمصانع',
      count: siteContentData?.institutional?.cards?.length || 0,
    },
    {
      id: 'privateLabel',
      label: 'التصنيع لحساب الغير',
      icon: Factory,
      desc: 'التركيبات والتصنيع التعاقدي',
      count: siteContentData?.privateLabel?.cards?.length || 0,
    },
    {
      id: 'retail',
      label: 'منتجات التجزئة',
      icon: ShoppingBag,
      desc: 'المنتجات الاستهلاكية',
      count: siteContentData?.retail?.cards?.length || 0,
    },
    {
      id: 'categories',
      label: 'تصنيفات المنتجات',
      icon: FolderTree,
      desc: 'إدارة وتصنيف الكتالوج',
      count: categories.length,
      badgeColor: 'bg-indigo-600',
    },
    {
      id: 'products',
      label: 'كتالوج المنتجات',
      icon: Package,
      desc: 'المواصفات الكيميائية والتعبئة',
      count: products.length,
      badgeColor: 'bg-blue-600',
    },
    {
      id: 'siteContent',
      label: 'أقسام ومحتوى الموقع',
      icon: Layers,
      desc: 'المقاييس، لماذا تختارنا، والمعرض',
    },
    {
      id: 'inquiries',
      label: 'طلبات عروض الأسعار',
      icon: MessageSquare,
      desc: 'متابعة وفلترة العملاء',
      count: inquiries.length,
      badgeColor: 'bg-emerald-500',
    },
    {
      id: 'seo',
      label: 'إعدادات السيو والبحث',
      icon: Globe,
      desc: 'الكلمات المفتاحية والميتا تاغ',
    },
  ];

  const currentTab = sidebarItems.find((item) => item.id === activeTab) || sidebarItems[0];

  // -------------------------------------------------------------
  // 7. MAIN RENDER
  // -------------------------------------------------------------
  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex font-sans font-arabic text-slate-900">
      {/* Toast Notification */}
      <ToastNotification toast={toast} />

      {/* Right-Hand Sidebar (Desktop & Mobile Drawer) */}
      <Sidebar
        items={sidebarItems}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        adminUser={adminUser}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:mr-64 xl:mr-72 min-h-screen">
        {/* Top Navbar Header */}
        <TopHeader
          currentTab={currentTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onReload={loadAllData}
          loadingData={loadingData}
          onSave={() => saveContentDirectly()}
          savingContent={savingContent}
        />

        {/* Tab View Container */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewTab
              inquiries={inquiries}
              siteContentData={siteContentData}
              categoriesCount={categories.length}
              productsCount={products.length}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'hero' && siteContentData && (
            <HeroTab
              siteContentData={siteContentData}
              setSiteContentData={setSiteContentData}
              onOpenAddHeroSlide={handleOpenAddHeroSlide}
              onOpenEditHeroSlide={handleOpenEditHeroSlide}
              onDeleteHeroSlide={handleDeleteHeroSlide}
              uploadingHero={uploadingHero}
              onHeroImageUpload={handleHeroImageUpload}
              onResetHeroImage={handleResetHeroImage}
            />
          )}

          {activeTab === 'institutional' && siteContentData && (
            <InstitutionalTab
              siteContentData={siteContentData}
              setSiteContentData={setSiteContentData}
              onOpenAddCard={() => handleOpenAddCardModal('institutional')}
              onOpenEditCard={(idx) => handleOpenEditCardModal('institutional', idx)}
              onDeleteCard={(idx) => handleDeleteCard('institutional', idx)}
              onCardImageUpload={(idx, file) => handleCardImageUpload('institutional', idx, file)}
              uploadingItem={uploadingItem}
            />
          )}

          {activeTab === 'privateLabel' && siteContentData && (
            <PrivateLabelTab
              siteContentData={siteContentData}
              setSiteContentData={setSiteContentData}
              onOpenAddCard={() => handleOpenAddCardModal('privateLabel')}
              onOpenEditCard={(idx) => handleOpenEditCardModal('privateLabel', idx)}
              onDeleteCard={(idx) => handleDeleteCard('privateLabel', idx)}
              onCardImageUpload={(idx, file) => handleCardImageUpload('privateLabel', idx, file)}
              uploadingItem={uploadingItem}
            />
          )}

          {activeTab === 'retail' && siteContentData && (
            <RetailTab
              siteContentData={siteContentData}
              setSiteContentData={setSiteContentData}
              onOpenAddCard={() => handleOpenAddCardModal('retail')}
              onOpenEditCard={(idx) => handleOpenEditCardModal('retail', idx)}
              onDeleteCard={(idx) => handleDeleteCard('retail', idx)}
              onCardImageUpload={(idx, file) => handleCardImageUpload('retail', idx, file)}
              uploadingItem={uploadingItem}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesTab
              categories={categories}
              onOpenAddCategory={handleOpenAddCategory}
              onOpenEditCategory={handleOpenEditCategory}
              onDeleteCategory={handleDeleteCategory}
              onUploadImage={handleCategoryImageUpload}
              uploadingId={uploadingItem}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              categories={categories}
              onOpenAddProduct={handleOpenAddProduct}
              onOpenEditProduct={handleOpenEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onUploadImage={handleProductImageUpload}
              uploadingId={uploadingItem}
            />
          )}

          {activeTab === 'siteContent' && siteContentData && (
            <SiteContentTab
              siteContentData={siteContentData}
              setSiteContentData={setSiteContentData}
              onOpenMetricModal={() => setMetricModalOpen(true)}
              onDeleteMetric={handleDeleteMetric}
              onOpenPointModal={() => setPointModalOpen(true)}
              onDeletePoint={handleDeletePoint}
              onWhyUsImageUpload={handleWhyUsImageUpload}
              onResetWhyUsImage={handleResetWhyUsImage}
              onOpenBrandModal={() => setBrandModalOpen(true)}
              onDeleteBrand={handleDeleteBrand}
              onBrandImageUpload={handleBrandImageUpload}
              uploadingItem={uploadingItem}
              onSaveContent={() => saveContentDirectly()}
              savingContent={savingContent}
            />
          )}

          {activeTab === 'seo' && siteContentData && (
            <SeoTab
              siteContentData={siteContentData}
              setSiteContentData={setSiteContentData}
              onResetSeoDefaults={handleResetSeoDefaults}
              onSaveContent={() => saveContentDirectly()}
              savingContent={savingContent}
              onSeoImageUpload={handleSeoImageUpload}
              uploadingItem={uploadingItem}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesTab
              inquiries={inquiries}
              onStatusChange={handleStatusChange}
              onDeleteInquiry={handleDeleteInquiry}
            />
          )}
        </main>
      </div>

      {/* CRUD Modals */}
      <CardCrudModal
        section={cardModalSection}
        cardIndex={editingCardIndex}
        form={cardForm}
        setForm={setCardForm}
        onClose={() => setCardModalSection(null)}
        onSave={handleCreateOrUpdateCard}
        token={token}
        showToast={showToast}
      />

      <HeroSlideModal
        isOpen={heroSlideModalOpen}
        slideIndex={editingHeroSlideIndex}
        form={heroSlideForm}
        setForm={setHeroSlideForm}
        onClose={() => setHeroSlideModalOpen(false)}
        onSave={handleSaveHeroSlide}
        token={token}
        showToast={showToast}
      />

      <MetricModal
        isOpen={metricModalOpen}
        form={metricForm}
        setForm={setMetricForm}
        onClose={() => setMetricModalOpen(false)}
        onSave={handleCreateMetric}
      />

      <FeaturePointModal
        isOpen={pointModalOpen}
        form={pointForm}
        setForm={setPointForm}
        onClose={() => setPointModalOpen(false)}
        onSave={handleCreatePoint}
      />

      <BrandModal
        isOpen={brandModalOpen}
        form={brandForm}
        setForm={setBrandForm}
        onClose={() => setBrandModalOpen(false)}
        onSave={handleCreateBrand}
        token={token}
        showToast={showToast}
      />

      <ProductCrudModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
        onUploadImage={async (file) => {
          if (!token) return null;
          setUploadingProductImage(true);
          const res = await uploadImageToCloudinary(file, token);
          setUploadingProductImage(false);
          if (res.success && res.url) {
            return res.url;
          } else {
            showToast(res.message || 'فشل رفع الصورة', 'error');
            return null;
          }
        }}
        isUploading={uploadingProductImage}
      />

      <CategoryCrudModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        category={editingCategory}
        onSave={handleSaveCategory}
        onUploadImage={async (file) => {
          if (!token) return null;
          setUploadingCategoryImage(true);
          const res = await uploadImageToCloudinary(file, token);
          setUploadingCategoryImage(false);
          if (res.success && res.url) {
            return res.url;
          } else {
            showToast(res.message || 'فشل رفع الصورة', 'error');
            return null;
          }
        }}
        isUploading={uploadingCategoryImage}
      />

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        modal={confirmModal}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
