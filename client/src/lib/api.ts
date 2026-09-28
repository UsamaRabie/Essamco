import { Product, Category, Brand, InquirySubmission, InquiryRecord, ContactSubmission } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// PUBLIC API
export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('[API Client] Backend offline or unavailable for categories', err);
    return [];
  }
}

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/brands`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch brands');
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('[API Client] Backend offline or unavailable for brands', err);
    return [];
  }
}

export async function fetchProducts(category?: string, brand?: string, search?: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (brand && brand !== 'all') params.append('brand', brand);
    if (search && search.trim() !== '') params.append('search', search.trim());

    const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('[API Client] Backend offline or unavailable for products fetch', err);
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.warn('[API Client] Failed to fetch product by slug:', err);
    return null;
  }
}

export async function submitInquiry(inquiry: InquirySubmission): Promise<{ success: boolean; message: string; data?: unknown }> {
  try {
    const res = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
    });
    return await res.json();
  } catch (err) {
    console.error('[API Client Error submitting inquiry]', err);
    return {
      success: false,
      message: 'Failed to communicate with API server. Please check that backend server is running.',
    };
  }
}

export async function submitContact(contact: ContactSubmission): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/inquiries/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    return await res.json();
  } catch (err) {
    console.error('[API Client Error submitting contact]', err);
    return {
      success: false,
      message: 'Failed to send message to backend server.',
    };
  }
}

export async function fetchInquiries(token?: string): Promise<InquiryRecord[]> {
  try {
    if (!token) return [];
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    const res = await fetch(`${API_BASE_URL}/inquiries`, { headers, cache: 'no-store' });
    if (res.status === 401) {
      console.warn('[API Client] Unauthorized to fetch inquiries (token invalid or expired)');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('essamco_admin_token');
        localStorage.removeItem('essamco_admin_user');
      }
      return [];
    }
    if (!res.ok) {
      console.warn('[API Client] fetchInquiries returned status:', res.status);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.warn('[API Client fetch inquiries error]', err);
    return [];
  }
}

// ADMIN & AUTHENTICATION API
export async function adminLogin(email: string, password: string): Promise<{ success: boolean; token?: string; admin?: unknown; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (err) {
    console.error('[Admin Login Error]', err);
    return { success: false, message: 'Could not connect to server for authentication.' };
  }
}

export async function getAdminProfile(token: string): Promise<{ success: boolean; data?: unknown }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return { success: false };
  }
}

// CLOUDINARY IMAGE UPLOADER API
export async function uploadImageToCloudinary(file: File, token: string): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Cloudinary upload failed');
    }

    return {
      success: true,
      url: data.url,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error uploading image to Cloudinary';
    console.error('[Upload to Cloudinary Error]', msg);
    return {
      success: false,
      message: msg,
    };
  }
}

// ADMIN PRODUCT CRUD
export async function createProduct(product: Partial<Product>, token: string): Promise<{ success: boolean; data?: Product; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to create product' };
  }
}

export async function updateProduct(id: string, product: Partial<Product>, token: string): Promise<{ success: boolean; data?: Product; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to update product' };
  }
}

export async function deleteProduct(id: string, token: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to delete product' };
  }
}

// ADMIN CATEGORY & BRAND CRUD
export async function createCategory(data: Partial<Category>, token: string): Promise<{ success: boolean; data?: Category; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to create category' };
  }
}

export async function updateCategory(id: string, data: Partial<Category>, token: string): Promise<{ success: boolean; data?: Category; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string, token: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to delete category' };
  }
}

export async function updateBrand(id: string, data: Partial<Brand>, token: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/brands/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to update brand' };
  }
}

// ADMIN INQUIRY MANAGEMENT
export async function updateInquiryStatus(id: string, status: string, token: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/inquiries/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to update status' };
  }
}

export async function deleteInquiry(id: string, token: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to delete inquiry' };
  }
}

// SITE CONTENT & HOMEPAGE SECTIONS
export async function fetchSiteContent(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/site-content`, { cache: 'no-store' });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Failed to fetch site content:', err);
    return null;
  }
}

export async function updateSiteContent(data: any, token: string): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/site-content`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Failed to update site content' };
  }
}

