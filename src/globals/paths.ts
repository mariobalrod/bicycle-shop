export const paths = {
  auth: '/auth',
  admin: {
    root: '/admin',
    products: {
      all: '/admin/products',
      new: '/admin/products/new',
      edit: (id: string) => `/admin/products/${id}`,
    },
    categories: {
      all: '/admin/categories',
      new: '/admin/categories/new',
      edit: (id: string) => `/admin/categories/${id}`,
    },
    orders: {
      all: '/admin/orders',
    },
  },
  products: {
    all: '/products',
    details: (slug: string) => `/products/${slug}`,
  },
  cart: '/cart',
};
