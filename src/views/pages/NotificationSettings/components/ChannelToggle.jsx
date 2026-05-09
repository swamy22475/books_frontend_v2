import React from 'react';
import { Switch } from 'src/components/ui/switch';

const ChannelToggle = ({ channel, enabled, onChange, disabled = false }) => {
  const channelIcons = {
    email: '📧',
    sms: '💬',
    app: '📱',
    whatsapp: '💚',
  };

  const channelLabels = {
    email: 'Email',
    sms: 'SMS',
    app: 'Mobile App',
    whatsapp: 'WhatsApp',
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <span className="text-lg">{channelIcons[channel]}</span>
      <label className="flex items-center gap-2 cursor-pointer">
        <Switch
          checked={enabled}
          onCheckedChange={onChange}
          disabled={disabled}
        />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {channelLabels[channel]}
        </span>
      </label>
    </div>
  );
};

export default ChannelToggle;
