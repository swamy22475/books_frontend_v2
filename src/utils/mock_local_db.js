/**
 * Mock Local Database Utility
 * Handles "Zero Data Integration" requirement by storing data in localStorage 
 * per tenantId. This ensures each school created in the admin panel has 
 * its own "fresh and empty" data account.
 */

const getTenantKey = (tenantId, resource) => `db_${tenantId}_${resource}`;

export const localDb = {
  get: (resource) => {
    const tenantId = localStorage.getItem('tenant_id');
    if (!tenantId) return [];
    return JSON.parse(localStorage.getItem(getTenantKey(tenantId, resource)) || '[]');
  },

  post: (resource, data) => {
    const tenantId = localStorage.getItem('tenant_id');
    if (!tenantId) return data;
    const items = localDb.get(resource);
    const newItem = { ...data, id: Date.now() };
    items.push(newItem);
    localStorage.setItem(getTenantKey(tenantId, resource), JSON.stringify(items));
    return newItem;
  },

  put: (resource, id, data) => {
    const tenantId = localStorage.getItem('tenant_id');
    if (!tenantId) return data;
    let items = localDb.get(resource);
    items = items.map(item => item.id === parseInt(id) ? { ...item, ...data } : item);
    localStorage.setItem(getTenantKey(tenantId, resource), JSON.stringify(items));
    return { ...data, id };
  },

  delete: (resource, id) => {
    const tenantId = localStorage.getItem('tenant_id');
    if (!tenantId) return;
    let items = localDb.get(resource);
    items = items.filter(item => item.id !== parseInt(id));
    localStorage.setItem(getTenantKey(tenantId, resource), JSON.stringify(items));
  },

  // Specialized dashboard summary generator
  getDashboardSummary: () => {
    const vendors = localDb.get('vendors');
    const books = localDb.get('inventory');
    const sales = localDb.get('sales');
    const returns = localDb.get('returns');

    const totalRevenue = sales.reduce((sum, s) => sum + (parseFloat(s.total_amount) || 0), 0);
    const totalSold = sales.reduce((sum, s) => sum + (parseInt(s.qty) || 0), 0);
    const totalStock = books.reduce((sum, b) => sum + (parseInt(b.stock_available) || 0), 0);

    return {
      kpis: {
        vendors: vendors.length,
        active_vendors: vendors.filter(v => v.status === 'Active').length,
        total_stock: totalStock,
        total_titles: books.length,
        total_sold: totalSold,
        total_revenue: totalRevenue,
        total_returns: returns.length
      },
      recent_sales: sales.slice(-6).reverse().map(s => ({
          id: s.id,
          student: s.student_name,
          class: s.student_class,
          book: s.book_name,
          price: s.total_amount,
          payment: s.payment_method,
          date: new Date().toISOString().split('T')[0]
      })),
      recent_vendors: vendors.slice(-5).reverse(),
      low_stock: books.filter(b => b.stock_available <= 20),
      payment_methods: [],
      vendor_types: [],
      monthly_sales: [],
      stock_vs_sold: []
    };
  }
};
