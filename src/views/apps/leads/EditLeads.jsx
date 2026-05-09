import React from 'react';
import EditLeadForm from 'src/components/apps/leads/EditLeadForm';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { LeadProvider } from 'src/context/lead-context/index';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Leads' }
];

const EditLeads = () => {
    return (
        <>
            <BreadcrumbComp title="Edit Lead" items={BCrumb} />
            <LeadProvider>
                <EditLeadForm />
            </LeadProvider>
        </>
    );
};

export default EditLeads;
