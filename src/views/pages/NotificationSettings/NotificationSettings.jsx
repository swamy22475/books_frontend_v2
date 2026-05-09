import React, { useState, useEffect } from 'react';
import NotificationTable from './components/NotificationTable';
import TemplateModal from './components/TemplateModal';
import NotificationTableToolbar from './components/NotificationTableToolbar';
import { Button } from 'src/components/ui/button';
import { Card } from 'src/components/ui/card';
import { fetchNotificationSettings, saveNotificationSettings } from 'src/services/notificationService';
import { mockNotificationSettings } from './mockData';
import { AVAILABLE_PLACEHOLDERS } from './constants';
import './NotificationSettings.css';

// Simple toast notification function
const showToast = (message, type = 'success') => {
  // Create a simple toast element
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  toast.className = `fixed bottom-4 right-4 px-4 py-3 rounded-lg text-white ${bgColor} shadow-lg z-50 animate-pulse`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

const NotificationSettings = () => {
  const [settings, setSettings] = useState([]);
  const [filteredSettings, setFilteredSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('all');
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);

  // Fetch settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from API, fallback to mock data
        let data;
        try {
          const response = await fetchNotificationSettings();
          data = response.data || response;
        } catch (apiError) {
          console.warn('API call failed, using mock data:', apiError);
          data = mockNotificationSettings;
        }

        setSettings(Array.isArray(data) ? data : data.settings || []);
      } catch (error) {
        console.error('Error loading notification settings:', error);
        showToast('Failed to load notification settings. Using mock data.', 'error');
        setSettings(mockNotificationSettings);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Filter settings based on search and recipient filter
  useEffect(() => {
    let filtered = settings;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.event_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by recipient
    if (selectedRecipient !== 'all') {
      filtered = filtered.filter(s =>
        (s.recipients || []).includes(selectedRecipient)
      );
    }

    setFilteredSettings(filtered);
  }, [settings, searchQuery, selectedRecipient]);

  const handleSettingChange = (eventKey, changes) => {
    setSettings(prevSettings =>
      prevSettings.map(s =>
        s.event_key === eventKey ? { ...s, ...changes } : s
      )
    );
    setHasChanges(true);
  };

  const handleTemplateEdit = (setting, mode) => {
    setSelectedSetting(setting);
    setTemplateModalOpen(true);
  };

  const handleTemplateSave = (formData) => {
    if (selectedSetting) {
      handleSettingChange(selectedSetting.event_key, {
        sms_template_id: formData.smsTemplateId,
        whatsapp_template_id: formData.whatsappTemplateId,
        sample_message: formData.sampleMessage,
      });
    }
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      await saveNotificationSettings({ settings });
      setHasChanges(false);
      showToast('Notification settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Failed to save notification settings. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format) => {
    try {
      let content = '';
      let filename = `notification-settings.${format}`;

      if (format === 'copy') {
        // Copy to clipboard
        const tableData = filteredSettings.map(s => ({
          Event: s.event_name,
          Email: s.enable_email ? '✓' : '✗',
          SMS: s.enable_sms ? '✓' : '✗',
          'Mobile App': s.enable_app ? '✓' : '✗',
          WhatsApp: s.enable_whatsapp ? '✓' : '✗',
          Recipients: (s.recipients || []).join(', '),
        }));

        const text = tableData
          .map(row => Object.values(row).join('\t'))
          .join('\n');

        await navigator.clipboard.writeText(text);
        showToast('Settings copied to clipboard!', 'success');
      } else if (format === 'csv') {
        // Export as CSV
        const headers = [
          'Event Name',
          'Email Enabled',
          'SMS Enabled',
          'Mobile App Enabled',
          'WhatsApp Enabled',
          'Recipients',
          'SMS Template ID',
          'WhatsApp Template ID',
          'Sample Message',
        ];

        const rows = filteredSettings.map(s => [
          `"${s.event_name}"`,
          s.enable_email ? 'Yes' : 'No',
          s.enable_sms ? 'Yes' : 'No',
          s.enable_app ? 'Yes' : 'No',
          s.enable_whatsapp ? 'Yes' : 'No',
          `"${(s.recipients || []).join('; ')}"`,
          `"${s.sms_template_id || ''}"`,
          `"${s.whatsapp_template_id || ''}"`,
          `"${(s.sample_message || '').replace(/"/g, '""')}"`,
        ]);

        content = [headers, ...rows].map(row => row.join(',')).join('\n');
        downloadFile(content, filename, 'text/csv');
      } else if (format === 'excel') {
        // Export as Excel (CSV format with .xlsx extension for simplicity)
        const headers = [
          'Event Name',
          'Email',
          'SMS',
          'Mobile App',
          'WhatsApp',
          'Recipients',
          'SMS Template ID',
          'WhatsApp Template ID',
        ];

        const rows = filteredSettings.map(s => [
          s.event_name,
          s.enable_email ? '✓' : '✗',
          s.enable_sms ? '✓' : '✗',
          s.enable_app ? '✓' : '✗',
          s.enable_whatsapp ? '✓' : '✗',
          (s.recipients || []).join('; '),
          s.sms_template_id || '',
          s.whatsapp_template_id || '',
        ]);

        content = [headers, ...rows].map(row => row.join('\t')).join('\n');
        downloadFile(content, 'notification-settings.xlsx', 'application/vnd.ms-excel');
      } else if (format === 'pdf') {
        showToast('PDF export feature requires additional library integration.', 'info');
      }
    } catch (error) {
      console.error('Error exporting:', error);
      showToast('Failed to export settings.', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="notification-settings-container p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Notification Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure how and when system notifications are sent across different channels
        </p>
      </div>

      {/* Main Card */}
      <Card className="overflow-hidden shadow-lg">
        {/* Toolbar */}
        <NotificationTableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRecipient={selectedRecipient}
          onRecipientChange={setSelectedRecipient}
          onExport={handleExport}
          onPrint={handlePrint}
        />

        {/* Table */}
        <div className="overflow-x-auto">
          <NotificationTable
            settings={filteredSettings}
            onSettingChange={handleSettingChange}
            onTemplateEdit={handleTemplateEdit}
            isLoading={isLoading}
          />
        </div>

        {/* Empty State */}
        {!isLoading && filteredSettings.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                No notification settings found
              </p>
              {searchQuery || selectedRecipient !== 'all' ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRecipient('all');
                  }}
                >
                  Clear Filters
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </Card>

      {/* Template Modal */}
      <TemplateModal
        open={templateModalOpen}
        onOpenChange={setTemplateModalOpen}
        eventName={selectedSetting?.event_name || ''}
        smsTemplateId={selectedSetting?.sms_template_id}
        whatsappTemplateId={selectedSetting?.whatsapp_template_id}
        sampleMessage={selectedSetting?.sample_message}
        onSave={handleTemplateSave}
        availablePlaceholders={AVAILABLE_PLACEHOLDERS}
      />

      {/* Save Button - Fixed Bottom Right */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-40 drop-shadow-lg">
          <Button
            onClick={handleSaveAll}
            disabled={isSaving}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg"
          >
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * Helper function to download file
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default NotificationSettings;
