import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from 'src/components/ui/dialog';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Textarea } from 'src/components/ui/textarea';
import { Label } from 'src/components/ui/label';

const TemplateModal = ({
  open,
  onOpenChange,
  eventName,
  smsTemplateId = '',
  whatsappTemplateId = '',
  sampleMessage = '',
  onSave,
  availablePlaceholders = [],
}) => {
  const [formData, setFormData] = useState({
    smsTemplateId: '',
    whatsappTemplateId: '',
    sampleMessage: '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        smsTemplateId: smsTemplateId || '',
        whatsappTemplateId: whatsappTemplateId || '',
        sampleMessage: sampleMessage || '',
      });
    }
  }, [open, smsTemplateId, whatsappTemplateId, sampleMessage]);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const insertPlaceholder = (field, placeholder) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || '') + `{{${placeholder}}}`,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Template - {eventName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* SMS Template ID */}
          <div className="space-y-2">
            <Label htmlFor="sms-template-id" className="text-base font-semibold">
              SMS Template ID
            </Label>
            <Input
              id="sms-template-id"
              value={formData.smsTemplateId}
              onChange={e => setFormData(prev => ({ ...prev, smsTemplateId: e.target.value }))}
              placeholder="Enter SMS template ID"
              className="font-mono"
            />
            <p className="text-xs text-gray-500">
              Template ID from your SMS provider (e.g., Twilio, AWS SNS)
            </p>
          </div>

          {/* WhatsApp Template ID */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp-template-id" className="text-base font-semibold">
              WhatsApp Template ID
            </Label>
            <Input
              id="whatsapp-template-id"
              value={formData.whatsappTemplateId}
              onChange={e => setFormData(prev => ({ ...prev, whatsappTemplateId: e.target.value }))}
              placeholder="Enter WhatsApp template ID"
              className="font-mono"
            />
            <p className="text-xs text-gray-500">
              Template ID from your WhatsApp Business API provider
            </p>
          </div>

          {/* Sample Message */}
          <div className="space-y-2">
            <Label htmlFor="sample-message" className="text-base font-semibold">
              Sample Message
            </Label>
            <Textarea
              id="sample-message"
              value={formData.sampleMessage}
              onChange={e => setFormData(prev => ({ ...prev, sampleMessage: e.target.value }))}
              placeholder="Enter the message template with placeholders"
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mb-2">
              Use placeholders like {'{{placeholder_name}}'} to insert dynamic values
            </p>

            {/* Available Placeholders */}
            {availablePlaceholders.length > 0 && (
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded border border-gray-300 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Available Placeholders (click to insert):
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {availablePlaceholders.map(placeholder => (
                    <button
                      key={placeholder}
                      type="button"
                      onClick={() => insertPlaceholder('sampleMessage', placeholder)}
                      className="text-left text-xs px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition font-mono"
                    >
                      {'{{'}{placeholder}{'}}'} 
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal;
