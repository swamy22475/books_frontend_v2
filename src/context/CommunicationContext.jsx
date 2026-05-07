import React, { createContext, useContext, useState } from 'react';

const CommunicationContext = createContext();

const INITIAL_EMAIL_TEMPLATES = [
    {
        id: 1,
        title: "Fee Reminder - Term 2",
        message: "Dear Parents,<br/><br/>This is a gentle reminder that the fee payment for Term 2 is due by [DATE]. Please ignore if already paid.<br/><br/>Regards,<br/>School Administration"
    },
    {
        id: 2,
        title: "Annual Sports Day Invitation",
        message: "Dear Parents,<br/><br/>We cordially invite you to our Annual Sports Day on [DATE]. Please find the schedule attached.<br/><br/>Warm Regards,<br/>Principal"
    },
    {
        id: 3,
        title: "Parent-Teacher Meeting",
        message: "Dear Guardian,<br/><br/>The PTM for Class [CLASS] is scheduled on [DATE] from 9:00 AM to 12:00 PM. Your presence is requested.<br/><br/>Thank you."
    }
];

const INITIAL_SMS_TEMPLATES = [
    {
        id: 1,
        title: "Sports Day Events",
        message: "Dear Parents, We are excited to announce our Annual Sports Day on [DATE]. Please ensure your ward is present by 8:00 AM. Dress Code: House T-shirt."
    },
    {
        id: 2,
        title: "Independence Day",
        message: "Join us in celebrating Independence Day on August 15th at the School Ground. Flag hoisting at 9:00 AM sharp. Jai Hind!"
    }
];

const INITIAL_WHATSAPP_TEMPLATES = [
    {
        id: 1,
        title: "Exam Schedule Released",
        message: "Hello *[NAME]*, the exam schedule for Term 1 has been released. Please check the school app for details. 📅"
    },
    {
        id: 2,
        title: "Holiday Announcement",
        message: "Dear Parents, School will remain closed on *[DATE]* due to heavy rains. Stay safe! ☔"
    }
];

export const CommunicationProvider = ({ children }) => {
    const [emailTemplates, setEmailTemplates] = useState(INITIAL_EMAIL_TEMPLATES);
    const [smsTemplates, setSmsTemplates] = useState(INITIAL_SMS_TEMPLATES);
    const [whatsappTemplates, setWhatsappTemplates] = useState(INITIAL_WHATSAPP_TEMPLATES);

    const addEmailTemplate = (template) => {
        setEmailTemplates(prev => [...prev, { ...template, id: prev.length + 1 }]);
    };

    const updateEmailTemplate = (id, updatedTemplate) => {
        setEmailTemplates(prev => prev.map(t => t.id === id ? { ...updatedTemplate, id } : t));
    };

    const deleteEmailTemplate = (id) => {
        setEmailTemplates(prev => prev.filter(t => t.id !== id));
    };

    const addSmsTemplate = (template) => {
        setSmsTemplates(prev => [...prev, { ...template, id: prev.length + 1 }]);
    };

    const updateSmsTemplate = (id, updatedTemplate) => {
        setSmsTemplates(prev => prev.map(t => t.id === id ? { ...updatedTemplate, id } : t));
    };

    const deleteSmsTemplate = (id) => {
        setSmsTemplates(prev => prev.filter(t => t.id !== id));
    };

    const addWhatsappTemplate = (template) => {
        setWhatsappTemplates(prev => [...prev, { ...template, id: prev.length + 1 }]);
    };

    const updateWhatsappTemplate = (id, updatedTemplate) => {
        setWhatsappTemplates(prev => prev.map(
            t => t.id === id ? { ...updatedTemplate, id } : t
        ));
    };

    const deleteWhatsappTemplate = (id) => {
        setWhatsappTemplates(prev => prev.filter(t => t.id !== id));
    };

    return (
        <CommunicationContext.Provider value={{
            emailTemplates,
            addEmailTemplate,
            updateEmailTemplate,
            deleteEmailTemplate,
            smsTemplates,
            addSmsTemplate,
            updateSmsTemplate,
            deleteSmsTemplate,
            whatsappTemplates,
            addWhatsappTemplate,
            updateWhatsappTemplate,
            deleteWhatsappTemplate
        }}>
            {children}
        </CommunicationContext.Provider>
    );
};

export const useCommunication = () => useContext(CommunicationContext);
