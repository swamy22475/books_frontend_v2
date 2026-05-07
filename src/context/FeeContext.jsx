import React, { createContext, useState } from 'react';

export const FeeContext = createContext();

export const FeeProvider = ({ children }) => {
  const [feeTypes, setFeeTypes] = useState([
    { id: 1, name: 'Tuition', code: 'TUI001', description: 'Monthly tuition fees', status: 'Active' },
    { id: 2, name: 'Transport', code: 'TRN001', description: 'Monthly transport charges', status: 'Active' },
    { id: 3, name: 'Library', code: 'LIB001', description: 'Library membership fee', status: 'Inactive' },
    { id: 4, name: 'Activities', code: 'ACT001', description: 'Co-curricular activities fee', status: 'Active' },
    { id: 5, name: 'Examination', code: 'EXM001', description: 'Examination and test fees', status: 'Active' },
  ]);

  const [feeMasters, setFeeMasters] = useState([
    { id: 1, typeId: 1, type: 'Tuition', dueDate: '2026-03-01', amount: 1000, fineType: 'None', status: 'Active' },
    { id: 2, typeId: 2, type: 'Transport', dueDate: '2026-03-05', amount: 300, fineType: 'Fixed', status: 'Active' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate API delay
  const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

  // Get all fee types
  const getFeeTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      await delay();
      return feeTypes;
    } catch {
      const errorMsg = 'Failed to fetch fee types';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Get single fee type by ID
  const getFeeTypeById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await delay();
      const feeType = feeTypes.find(ft => ft.id === id);
      if (!feeType) {
        throw new Error('Fee type not found');
      }
      return feeType;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch fee type';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Add new fee type
  const addFeeType = async (feeTypeData) => {
    setLoading(true);
    setError(null);
    try {
      if (!feeTypeData.name) {
        throw new Error('Name is required');
      }

      await delay();

      const newId = Math.max(...feeTypes.map(ft => ft.id), 0) + 1;
      const codeNum = Math.max(...feeTypes.map(ft => parseInt(ft.code.slice(3)) || 0), 0) + 1;

      const newFeeType = {
        id: newId,
        name: feeTypeData.name,
        code: `FEE${String(codeNum).padStart(3, '0')}`,
        description: feeTypeData.description || '',
        status: feeTypeData.status || 'Active'
      };

      setFeeTypes(prev => [newFeeType, ...prev]);
      return newFeeType;
    } catch (err) {
      const errorMsg = err.message || 'Failed to add fee type';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Update fee type
  const updateFeeType = async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      if (updates.name && !updates.name.trim()) {
        throw new Error('Name cannot be empty');
      }

      await delay();

      const feeTypeExists = feeTypes.find(ft => ft.id === id);
      if (!feeTypeExists) {
        throw new Error('Fee type not found');
      }

      setFeeTypes(prev =>
        prev.map(ft =>
          ft.id === id ? { ...ft, ...updates } : ft
        )
      );

      return { ...feeTypeExists, ...updates };
    } catch (err) {
      const errorMsg = err.message || 'Failed to update fee type';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Delete fee type
  const deleteFeeType = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await delay();

      const feeTypeExists = feeTypes.find(ft => ft.id === id);
      if (!feeTypeExists) {
        throw new Error('Fee type not found');
      }

      setFeeTypes(prev => prev.filter(ft => ft.id !== id));
      return true;
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete fee type';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Update fee type status
  const updateFeeTypeStatus = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      if (!['Active', 'Inactive'].includes(status)) {
        throw new Error('Invalid status');
      }

      await delay();

      const feeTypeExists = feeTypes.find(ft => ft.id === id);
      if (!feeTypeExists) {
        throw new Error('Fee type not found');
      }

      setFeeTypes(prev =>
        prev.map(ft =>
          ft.id === id ? { ...ft, status } : ft
        )
      );

      return { ...feeTypeExists, status };
    } catch (err) {
      const errorMsg = err.message || 'Failed to update status';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fee Master APIs
  const getFeeMasters = async () => {
    setLoading(true);
    setError(null);
    try {
      await delay();
      return feeMasters;
    } catch {
      const errorMsg = 'Failed to fetch fee masters';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const addFeeMaster = async (data) => {
    setLoading(true);
    setError(null);
    try {
      if (!data.typeId || !data.amount) {
        throw new Error('Type and Amount are required');
      }
      await delay();
      const newId = Math.max(...feeMasters.map(fm => fm.id), 0) + 1;
      const typeObj = feeTypes.find(t => t.id === data.typeId) || {};
      const newMaster = {
        id: newId,
        typeId: data.typeId,
        type: typeObj.name || data.type || '',
        dueDate: data.dueDate || null,
        amount: Number(data.amount),
        fineType: data.fineType || 'None',
        status: data.status || 'Active'
      };
      setFeeMasters(prev => [newMaster, ...prev]);
      return newMaster;
    } catch (err) {
      const errorMsg = err.message || 'Failed to add fee master';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateFeeMaster = async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      await delay();
      const exists = feeMasters.find(fm => fm.id === id);
      if (!exists) throw new Error('Fee master not found');
      setFeeMasters(prev => prev.map(fm => fm.id === id ? { ...fm, ...updates } : fm));
      return { ...exists, ...updates };
    } catch (err) {
      const errorMsg = err.message || 'Failed to update fee master';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteFeeMaster = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await delay();
      const exists = feeMasters.find(fm => fm.id === id);
      if (!exists) throw new Error('Fee master not found');
      setFeeMasters(prev => prev.filter(fm => fm.id !== id));
      return true;
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete fee master';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateFeeMasterStatus = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      if (!['Active', 'Inactive'].includes(status)) throw new Error('Invalid status');
      await delay();
      const exists = feeMasters.find(fm => fm.id === id);
      if (!exists) throw new Error('Fee master not found');
      setFeeMasters(prev => prev.map(fm => fm.id === id ? { ...fm, status } : fm));
      return { ...exists, status };
    } catch (err) {
      const errorMsg = err.message || 'Failed to update status';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    feeTypes,
    feeMasters,
    loading,
    error,
    getFeeTypes,
    getFeeTypeById,
    addFeeType,
    updateFeeType,
    deleteFeeType,
    updateFeeTypeStatus,
    getFeeMasters,
    addFeeMaster,
    updateFeeMaster,
    deleteFeeMaster,
    updateFeeMasterStatus,
    setError // Allow clearing errors
  };

  return (
    <FeeContext.Provider value={value}>
      {children}
    </FeeContext.Provider>
  );
};
