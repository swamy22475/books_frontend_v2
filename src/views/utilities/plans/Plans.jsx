import { useState, useEffect } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { PlansTable } from './PlansTable';
import { api } from 'src/lib/api-client';

const BCrumb = [
  {
    to: '/',
    title: 'Home'
  },
  {
    title: 'Manage Plans'
  }];


const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/master/plans/');
        console.log("Raw response from /master/plans/:", response);
        if (response) {
          setPlans(response);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleDeletePlan = async (id) => {
    try {
      await api.delete(`/master/plans/${id}`);
      setPlans(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete plan:", error);
    }
  };

  return (
    <>
      <BreadcrumbComp title="Manage Subscription Plans" items={BCrumb} />
      <div className="flex gap-6 flex-col">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 bg-gray-50/50 dark:bg-white/5 rounded-md border border-dashed border-gray-200 dark:border-white/10">
            <p className="text-lg font-medium animate-pulse">Loading plans...</p>
          </div>
        ) : (
          <PlansTable data={plans} onDeletePlan={handleDeletePlan} />
        )}
      </div>
    </>
  );

};

export default Plans;