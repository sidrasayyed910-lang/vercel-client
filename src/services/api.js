const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('codeverse_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  auth: {
    register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
    getMe: () => request('/auth/me'),
    forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
  },
  languages: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/languages${query ? `?${query}` : ''}`);
    },
    getBySlug: (slug) => request(`/languages/${slug}`)
  },
  courses: {
    getAll: () => request('/courses'),
    getBySlug: (slug) => request(`/courses/${slug}`),
    getLesson: (courseSlug, lessonSlug) => request(`/courses/${courseSlug}/lessons/${lessonSlug}`)
  },
  progress: {
    markComplete: (lessonId, courseId) => request('/progress/mark-complete', {
      method: 'POST',
      body: JSON.stringify({ lessonId, courseId })
    }),
    getDashboard: () => request('/progress/dashboard')
  },
  quizzes: {
    getQuiz: (courseSlug) => request(`/quizzes/${courseSlug}`),
    submitQuiz: (courseSlug, answers) => request(`/quizzes/${courseSlug}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    })
  },
  practice: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/practice${query ? `?${query}` : ''}`);
    },
    getBySlug: (slug) => request(`/practice/${slug}`),
    runCode: (slug, payload) => request(`/practice/${slug}/run`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
    submitSolution: (slug, payload) => request(`/practice/${slug}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  },
  certificates: {
    getMyCertificates: () => request('/certificates/my-certificates'),
    getById: (certId) => request(`/certificates/${certId}`),
    verify: (certId) => request(`/certificates/verify/${certId}`),
    generate: (courseId) => request(`/certificates/generate/${courseId}`, { method: 'POST' })
  },
  roadmaps: {
    getAll: () => request('/roadmaps')
  },
  execution: {
    run: (payload) => request('/execute', { method: 'POST', body: JSON.stringify(payload) }),
    getTemplates: () => request('/execute/languages')
  },
  search: {
    query: (q) => request(`/search?q=${encodeURIComponent(q)}`)
  },
  admin: {
    getStats: () => request('/admin/stats'),
    getCourses: () => request('/admin/courses'),
    getLessons: () => request('/admin/lessons'),
    createLesson: (payload) => request('/admin/lessons', { method: 'POST', body: JSON.stringify(payload) }),
    updateLesson: (id, payload) => request(`/admin/lessons/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    deleteLesson: (id) => request(`/admin/lessons/${id}`, { method: 'DELETE' }),
    createProblem: (payload) => request('/admin/practice', { method: 'POST', body: JSON.stringify(payload) })
  }
};
