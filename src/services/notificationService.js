/**
 * Notification Settings Service
 * Handles all API calls related to notification settings
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ourschoolerp-m9y9k.ondigitalocean.app/api/v1';

/**
 * Fetch all notification settings
 */
export const fetchNotificationSettings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/system-settings/notification-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    throw error;
  }
};

/**
 * Save notification settings
 */
export const saveNotificationSettings = async (settings) => {
  try {
    const response = await fetch(`${API_BASE_URL}/system-settings/notification-settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving notification settings:', error);
    throw error;
  }
};

/**
 * Update specific notification setting
 */
export const updateNotificationSetting = async (eventKey, updatedSetting) => {
  try {
    const response = await fetch(`${API_BASE_URL}/system-settings/notification-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      body: JSON.stringify({
        event_key: eventKey,
        ...updatedSetting,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating notification setting:', error);
    throw error;
  }
};

/**
 * Get available template IDs for a channel
 */
export const fetchTemplateIds = async (channel) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/system-settings/notification-templates?channel=${channel}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching template IDs:', error);
    throw error;
  }
};

/**
 * Export notification settings
 */
export const exportNotificationSettings = async (format) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/system-settings/notification-settings/export?format=${format}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error exporting notification settings:', error);
    throw error;
  }
};
