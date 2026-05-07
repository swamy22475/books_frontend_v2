import { useContext } from 'react';
import { LeadContext } from 'src/context/lead-context/index';


const LeadFilter = () => {
  const { leads, setFilter } = useContext(LeadContext);
  const newC = leads.filter((l) => l.status === 'New' && !l.deleted).length;
  const contactedC = leads.filter((l) => l.status === 'Contacted' && !l.deleted).length;
  const qualifiedC = leads.filter((l) => l.status === 'Qualified' && !l.deleted).length;
  const convertedC = leads.filter((l) => l.status === 'Converted' && !l.deleted).length;
  const lostC = leads.filter((l) => l.status === 'Lost' && !l.deleted).length;
  const totalC = leads.filter((l) => !l.deleted).length;

  return (
    <>
            <div className="grid grid-cols-12 gap-6">
                <div className="lg:col-span-2 md:col-span-4 col-span-6">
                    <div
            className="p-[24px] bg-lightprimary dark:bg-lightprimary text-center rounded-md cursor-pointer"
            onClick={() => setFilter('total_leads')}>
            
                        <h3 className="text-primary text-2xl">{totalC}</h3>
                        <h6 className="text-sm text-primary">Total Leads</h6>
                    </div>
                </div>
                <div className="lg:col-span-2 md:col-span-4 col-span-6">
                    <div
            className="p-[24px] bg-lightinfo dark:bg-lightinfo text-center rounded-md cursor-pointer"
            onClick={() => setFilter('New')}>
            
                        <h3 className="text-info text-2xl">{newC}</h3>
                        <h6 className="text-sm text-info">New</h6>
                    </div>
                </div>
                <div className="lg:col-span-2 md:col-span-4 col-span-6">
                    <div
            className="p-[24px] bg-lightwarning dark:bg-lightwarning text-center rounded-md cursor-pointer"
            onClick={() => setFilter('Contacted')}>
            
                        <h3 className="text-warning text-2xl">{contactedC}</h3>
                        <h6 className="text-sm text-warning">Contacted</h6>
                    </div>
                </div>
                <div className="lg:col-span-2 md:col-span-4 col-span-6">
                    <div
            className="p-[24px] bg-lightsuccess dark:bg-lightsuccess text-center rounded-md cursor-pointer"
            onClick={() => setFilter('Qualified')}>
            
                        <h3 className="text-success text-2xl">{qualifiedC}</h3>
                        <h6 className="text-sm text-success">Qualified</h6>
                    </div>
                </div>
                <div className="lg:col-span-2 md:col-span-4 col-span-6">
                    <div
            className="p-[24px] bg-lightsecondary dark:bg-lightsecondary text-center rounded-md cursor-pointer"
            onClick={() => setFilter('Converted')}>
            
                        <h3 className="text-secondary text-2xl">{convertedC}</h3>
                        <h6 className="text-sm text-secondary">Converted</h6>
                    </div>
                </div>
                <div className="lg:col-span-2 md:col-span-4 col-span-6">
                    <div
            className="p-[24px] bg-lighterror dark:bg-lighterror text-center rounded-md cursor-pointer"
            onClick={() => setFilter('Lost')}>
            
                        <h3 className="text-error text-2xl">{lostC}</h3>
                        <h6 className="text-sm text-error">Lost</h6>
                    </div>
                </div>
            </div>
        </>);

};

export default LeadFilter;