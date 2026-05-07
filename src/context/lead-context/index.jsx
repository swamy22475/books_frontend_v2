import { createContext, useState, useEffect } from 'react';
import { api } from 'src/lib/api-client';

export const LeadContext = createContext({});

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [filter, setFilter] = useState('total_leads');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const data = await api.get('/master/leads/');
        setLeads(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Add lead
  const addLead = async (newLead) => {
    try {
      const addedLead = await api.post('/master/leads/', newLead);
      setLeads((prev) => [addedLead, ...prev]);
    } catch (err) {
      console.error('Error adding lead:', err);
    }
  };

  // Edit lead
  const editLead = async (updatedLead) => {
    try {
      const leadId = updatedLead.Id;
      const returnedLead = await api.put(`/master/leads/${leadId}`, updatedLead);
      setLeads((prev) => prev.map((l) => l.Id === leadId ? returnedLead : l));
    } catch (err) {
      console.error('Error updating lead:', err);
    }
  };

  // Delete lead
  const deleteLead = async (id) => {
    try {
      await api.delete(`/master/leads/${id}`);
      setLeads((prev) => prev.filter((l) => l.Id !== id));
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const searchLeads = (searchTerm) => {
    setLeadSearch(searchTerm);
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        error,
        loading,
        deleteLead,
        setLeadSearch,
        searchLeads,
        leadSearch,
        filter,
        setFilter,
        addLead,
        editLead
      }}>

      {children}
    </LeadContext.Provider>);

};