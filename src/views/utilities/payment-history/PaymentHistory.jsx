import React, { useState, useEffect } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { PaymentHistoryTable } from './PaymentHistoryTable';
import { api } from 'src/lib/api-client';
import { Loader2 } from 'lucide-react';

const BCrumb = [
  {
    to: '/',
    title: 'Home'
  },
  {
    title: 'Payment History'
  }];

const PaymentHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/master/payment-history/');
      setData(res || []);
    } catch (err) {
      console.error('Failed to fetch payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAddTransaction = async (newTransaction) => {
    try {
      const added = await api.post('/master/payment-history/', newTransaction);
      setData(prev => [added, ...prev]);
    } catch (err) {
      console.error('Failed to add transaction:', err);
    }
  };

  const handleEditTransaction = async (updatedTransaction) => {
    try {
      const transactionId = updatedTransaction.orderId || updatedTransaction.id;
      const updated = await api.put(`/master/payment-history/${transactionId}`, updatedTransaction);
      setData(prev => prev.map(t => (t.orderId || t.id) === transactionId ? updated : t));
    } catch (err) {
      console.error('Failed to update transaction:', err);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await api.delete(`/master/payment-history/${id}`);
      setData(prev => prev.filter(t => (t.orderId || t.id) !== id));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  return (
    <div className="max-w-full overflow-hidden">
      <BreadcrumbComp title="Payment History" items={BCrumb} />
      <div className="flex gap-6 flex-col">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <PaymentHistoryTable
            data={data}
            onAddTransaction={handleAddTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;