import { createContext, useState, useEffect } from 'react';
import { api } from 'src/lib/api-client';

export const TicketContext = createContext({});

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [ticketSearch, setTicketSearch] = useState('');
  const [filter, setFilter] = useState('total_tickets');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await api.get('/master/tickets/');
        setTickets(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Add ticket
  const addTicket = async (newTicket) => {
    try {
      const addedTicket = await api.post('/master/tickets/', newTicket);
      setTickets((prev) => [addedTicket, ...prev]);
    } catch (err) {
      console.error('Error adding ticket:', err);
    }
  };

  // Edit ticket
  const editTicket = async (updatedTicket) => {
    try {
      const ticketId = updatedTicket.Id;
      const returnedTicket = await api.put(`/master/tickets/${ticketId}`, updatedTicket);
      setTickets((prev) => prev.map((t) => t.Id === ticketId ? returnedTicket : t));
    } catch (err) {
      console.error('Error updating ticket:', err);
    }
  };

  // Delete ticket
  const deleteTicket = async (id) => {
    try {
      await api.delete(`/master/tickets/${id}`);
      setTickets((prev) => prev.filter((t) => t.Id !== id));
    } catch (err) {
      console.error('Error deleting ticket:', err);
    }
  };

  const searchTickets = (searchTerm) => {
    setTicketSearch(searchTerm);
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        error,
        loading,
        deleteTicket,
        setTicketSearch,
        searchTickets,
        ticketSearch,
        filter,
        setFilter,
        addTicket,
        editTicket
      }}>

      {children}
    </TicketContext.Provider>);

};