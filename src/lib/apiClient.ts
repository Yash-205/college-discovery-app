// A clean, central client to handle all API requests from the frontend

export const apiClient = {
  auth: {
    login: async (credentials: any) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    },
    register: async (details: any) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    }
  },
  
  colleges: {
    // Fetch a single college by ID with discussions
    get: async (id: string) => {
      const res = await fetch(`/api/colleges/${id}`);
      if (!res.ok) throw new Error('Failed to fetch college');
      return res.json();
    },
    // Search and filter colleges
    search: async (params: { search?: string, location?: string, maxFee?: string, sortBy?: string }) => {
      const urlParams = new URLSearchParams();
      if (params.search) urlParams.append('search', params.search);
      if (params.location) urlParams.append('location', params.location);
      if (params.maxFee) urlParams.append('maxFee', params.maxFee);
      if (params.sortBy) urlParams.append('sortBy', params.sortBy);

      const res = await fetch(`/api/colleges?${urlParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch colleges');
      return res.json();
    },
    
    // Compare colleges
    compare: async (ids: string[]) => {
      const res = await fetch(`/api/colleges/compare?ids=${ids.join(',')}`);
      if (!res.ok) throw new Error('Failed to compare colleges');
      return res.json();
    }
  },
  
  users: {
    // Get saved colleges
    getSaved: async (token: string) => {
      const res = await fetch('/api/users/saved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch saved colleges');
      return res.json();
    },
    
    // Save or remove a college
    toggleSaved: async (token: string, collegeId: string, action: 'save' | 'remove') => {
      const res = await fetch('/api/users/saved', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ collegeId, action })
      });
      if (!res.ok) throw new Error(`Failed to ${action} college`);
      return res.json();
    }
  },

  upload: {
    // Upload image
    image: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Failed to upload image');
      return res.json();
    }
  },

  discussions: {
    // Browse all discussions
    browse: async (collegeId?: string) => {
      const url = collegeId ? `/api/discussions?collegeId=${collegeId}` : '/api/discussions';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch discussions');
      return res.json();
    },
    
    // Create new discussion
    ask: async (token: string, details: { title: string, body: string, collegeId?: string }) => {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(details)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create discussion');
      return data;
    },

    // Answer discussion
    answer: async (token: string, discussionId: string, body: string) => {
      const res = await fetch(`/api/discussions/${discussionId}/answers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ body })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create answer');
      return data;
    }
  }
};
