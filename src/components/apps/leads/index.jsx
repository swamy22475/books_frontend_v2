import { LeadProvider } from 'src/context/lead-context/index';
import CardBox from '../../shared/CardBox';
import LeadFilter from './LeadFilter';
import LeadListing from './LeadListing';

const LeadsApp = () => {
  return (
    <LeadProvider>
            <CardBox>
                <LeadFilter />
                <LeadListing />
            </CardBox>
        </LeadProvider>);

};

export default LeadsApp;