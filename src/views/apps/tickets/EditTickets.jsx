import EditTicketForm from 'src/components/apps/tickets/EditTicketForm';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { TicketProvider } from 'src/context/ticket-context/index';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Tickets' }
];

const EditTickets = () => {
    return (
        <>
            <BreadcrumbComp title="Edit Ticket" items={BCrumb} />
            <TicketProvider>
                <EditTicketForm />
            </TicketProvider>
        </>
    );
};

export default EditTickets;
