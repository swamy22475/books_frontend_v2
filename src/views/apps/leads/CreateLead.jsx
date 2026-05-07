import CreateLeadForm from 'src/components/apps/leads/CreateLeadForm';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { LeadProvider } from 'src/context/lead-context/index';

const BCrumb = [
{
  to: '/',
  title: 'Home'
},
{
  to: '/super/apps/leads',
  title: 'Leads'
},
{
  title: 'Add Lead'
}];

const CreateLead = () => {
  return (
    <>
            <BreadcrumbComp title="Add New Lead" items={BCrumb} />
            <LeadProvider>
                <CreateLeadForm />
            </LeadProvider>
        </>);

};

export default CreateLead;