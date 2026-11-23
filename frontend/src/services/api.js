const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchJSON(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Foods API
  async getFoods(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.vegOnly) query.append('vegOnly', 'true');
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const queryString = query.toString();
    const url = `${API_BASE}/foods${queryString ? `?${queryString}` : ''}`;
    return fetchJSON(url);
  },

  async getFoodById(id) {
    return fetchJSON(`${API_BASE}/foods/${id}`);
  },

  async createFood(foodData) {
    return fetchJSON(`${API_BASE}/foods`, {
      method: 'POST',
      body: JSON.stringify(foodData)
    });
  },

  async updateFood(id, foodData) {
    return fetchJSON(`${API_BASE}/foods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(foodData)
    });
  },

  async deleteFood(id) {
    return fetchJSON(`${API_BASE}/foods/${id}`, {
      method: 'DELETE'
    });
  },

  async resetFoods() {
    return fetchJSON(`${API_BASE}/foods/reset`, {
      method: 'POST'
    });
  },

  // Orders API
  async getOrders(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.customerName) query.append('customerName', params.customerName);

    const queryString = query.toString();
    const url = `${API_BASE}/orders${queryString ? `?${queryString}` : ''}`;
    return fetchJSON(url);
  },

  async getOrderById(id) {
    return fetchJSON(`${API_BASE}/orders/${id}`);
  },

  async createOrder(orderData) {
    return fetchJSON(`${API_BASE}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async updateOrderStatus(id, statusData) {
    return fetchJSON(`${API_BASE}/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(statusData)
    });
  },

  async deleteOrder(id) {
    return fetchJSON(`${API_BASE}/orders/${id}`, {
      method: 'DELETE'
    });
  },

  // Stats API
  async getStats() {
    return fetchJSON(`${API_BASE}/stats`);
  }
};
