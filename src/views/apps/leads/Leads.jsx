import LeadsApp from 'src/components/apps/leads';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

const BCrumb = [
{
  to: '/',
  title: 'Home'
},
{
  title: 'Leads'
}];

const Leads = () => {
  return (
    <>
            <BreadcrumbComp title="Leads Management" items={BCrumb} />
            <LeadsApp />
        </>);

};

export default Leads;