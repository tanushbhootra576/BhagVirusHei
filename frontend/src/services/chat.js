import axios from 'axios';

// Reuse axios defaults set elsewhere (baseURL + auth interceptor)

export const getIssueMessages = async (issueId, { page = 1, limit = 20 } = {}) => {
  try {
    const res = await axios.get(`/issues/${issueId}/chat`, { params: { page, limit } });
    const data = res.data;
    if (data.success) {
      return { success: true, data: data.data, pagination: data.pagination };
    }
    return { success: false, error: data.error || 'Failed to load messages' };
  } catch (e) {
    console.warn('[chat.service] getIssueMessages error', e.message);
    return { success: false, error: e.response?.data?.error || e.message };
  }
};

export default { getIssueMessages };
