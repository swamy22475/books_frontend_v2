import { useState } from 'react';
import { useNavigate } from 'react-router';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import api from 'src/lib/api-client';
import { Alert, AlertDescription } from 'src/components/ui/alert';
import { Loader2 } from 'lucide-react';

const BCrumb = [
  {
    to: '/',
    title: 'Home'
  },
  {
    to: '/super/utilities/plans',
    title: 'Manage Plans'
  },
  {
    title: 'Add New Plan'
  }];


const AddPlan = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    planName: '',
    maxStudents: '',
    monthlyPrice: '',
    yearlyPrice: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        plan_name: formData.planName,
        max_students: parseInt(formData.maxStudents, 10),
        monthly_price: parseFloat(formData.monthlyPrice),
        yearly_price: parseFloat(formData.yearlyPrice),
        is_active: true
      };

      await api.post('/master/plans/', payload);
      navigate('/super/utilities/plans');
    } catch (err) {
      console.error('Failed to create plan:', err);
      setError(err.response?.data?.detail || "Failed to create subscription plan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BreadcrumbComp title="Add New Plan" items={BCrumb} />

      <div className="rounded-xl border border-border md:p-6 p-4">
        <h5 className="card-title">Plan Details</h5>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col gap-6">
            {/* Plan Name */}
            <div>
              <Label htmlFor="planName">
                Plan Name <span className="text-error">*</span>
              </Label>
              <Input
                id="planName"
                type="text"
                required
                value={formData.planName}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                placeholder="Enter plan name"
                className="mt-2" />

            </div>

            {/* Max Students */}
            <div>
              <Label htmlFor="maxStudents">
                Maximum Students <span className="text-error">*</span>
              </Label>
              <Input
                id="maxStudents"
                type="number"
                required
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                placeholder="Enter maximum number of students"
                className="mt-2" />

            </div>

            {/* Monthly Price */}
            <div>
              <Label htmlFor="monthlyPrice">
                Monthly Price (₹) <span className="text-error">*</span>
              </Label>
              <Input
                id="monthlyPrice"
                type="number"
                step="0.01"
                required
                value={formData.monthlyPrice}
                onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                placeholder="Enter monthly price"
                className="mt-2" />

            </div>

            {/* Yearly Price */}
            <div>
              <Label htmlFor="yearlyPrice">
                Yearly Price (₹) <span className="text-error">*</span>
              </Label>
              <Input
                id="yearlyPrice"
                type="number"
                step="0.01"
                required
                value={formData.yearlyPrice}
                onChange={(e) => setFormData({ ...formData, yearlyPrice: e.target.value })}
                placeholder="Enter yearly price"
                className="mt-2" />

            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting} className="px-8 flex items-center gap-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Creating Plan..." : "Create Plan"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>);

};

export default AddPlan;