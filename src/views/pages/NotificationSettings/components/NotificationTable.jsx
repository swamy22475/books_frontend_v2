import React, { useState } from 'react';
import ChannelToggle from './ChannelToggle';
import RecipientSelector from './RecipientSelector';
import { Button } from 'src/components/ui/button';
import { Eye, Edit2 } from 'lucide-react';

const NotificationTable = ({
  settings,
  onSettingChange,
  onTemplateEdit,
  isLoading = false,
}) => {
  const channels = ['email', 'sms', 'app', 'whatsapp'];

  const getChannelKey = (channel) => {
    const keyMap = {
      email: 'enable_email',
      sms: 'enable_sms',
      app: 'enable_app',
      whatsapp: 'enable_whatsapp',
    };
    return keyMap[channel];
  };

  const handleChannelToggle = (eventKey, channel) => {
    const channelKey = getChannelKey(channel);
    onSettingChange(eventKey, {
      [channelKey]: !settings[eventKey]?.[channelKey],
    });
  };

  const handleRecipientChange = (eventKey, recipients) => {
    onSettingChange(eventKey, {
      recipients,
    });
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan="9" className="px-6 py-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Event
            </th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Destination
            </th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Recipients
            </th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
              SMS Template ID
            </th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
              WhatsApp Template ID
            </th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Sample Message
            </th>
            <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {settings.map((setting) => (
            <tr
              key={setting.id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              {/* Event Name */}
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap sticky left-0 z-10 bg-white dark:bg-gray-800">
                {setting.event_name}
              </td>

              {/* Destination (Channels) */}
              <td className="px-6 py-2">
                <div className="flex flex-col gap-2">
                  {channels.map(channel => (
                    <ChannelToggle
                      key={channel}
                      channel={channel}
                      enabled={setting[getChannelKey(channel)] || false}
                      onChange={() => handleChannelToggle(setting.event_key, channel)}
                    />
                  ))}
                </div>
              </td>

              {/* Recipients */}
              <td className="px-6 py-2">
                <RecipientSelector
                  recipients={setting.recipients || []}
                  onChange={(recipients) =>
                    handleRecipientChange(setting.event_key, recipients)
                  }
                />
              </td>

              {/* SMS Template ID */}
              <td className="px-6 py-4">
                <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-700 dark:text-gray-300 break-all max-w-xs">
                  {setting.sms_template_id || '-'}
                </div>
              </td>

              {/* WhatsApp Template ID */}
              <td className="px-6 py-4">
                <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-700 dark:text-gray-300 break-all max-w-xs">
                  {setting.whatsapp_template_id || '-'}
                </div>
              </td>

              {/* Sample Message Preview */}
              <td className="px-6 py-4">
                <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 max-w-xs">
                  {setting.sample_message || (
                    <span className="text-gray-400 italic">No message</span>
                  )}
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onTemplateEdit(setting, 'view')
                    }
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onTemplateEdit(setting, 'edit')
                    }
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationTable;
