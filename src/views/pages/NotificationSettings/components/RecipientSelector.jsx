import React from 'react';
import { Checkbox } from 'src/components/ui/checkbox';
import { Label } from 'src/components/ui/label';

const RecipientSelector = ({ recipients = [], onChange, disabled = false }) => {
  const recipientOptions = [
    { value: 'student', label: 'Student', icon: '👤' },
    { value: 'guardian', label: 'Guardian', icon: '👨‍👩‍👧' },
    { value: 'staff', label: 'Staff', icon: '👨‍💼' },
  ];

  const handleRecipientChange = (recipientValue) => {
    const updated = recipients.includes(recipientValue)
      ? recipients.filter(r => r !== recipientValue)
      : [...recipients, recipientValue];
    onChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-3 px-2 py-1">
      {recipientOptions.map(option => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={recipients.includes(option.value)}
            onCheckedChange={() => handleRecipientChange(option.value)}
            disabled={disabled}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {option.icon} {option.label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default RecipientSelector;
