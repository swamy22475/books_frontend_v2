import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentContext } from '../../../context/StudentContext';
import './StudentCategories.css';
import StudentPageContainer from './components/StudentPageContainer';

const AddStudentCategoryPage = () => {
  const navigate = useNavigate();
  const { addCategory } = useContext(StudentContext);
  const [form, setForm] = useState({ name: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Category name is required';
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    setSubmitting(true);
    setTimeout(() => {
      const created = addCategory({ name: form.name.trim() });
      setSubmitting(false);
      // navigate back and indicate created
      navigate('/school/student-categories', { state: { created: true, newId: created.id } });
    }, 600);
  };

  return (
    <StudentPageContainer
      title="Add Category"
      breadcrumb={<><span>Student Management</span> / <span>Categories</span> / <span className="current">Add</span></>}
      backTitle="Go back to Categories"
      pageClass="student-cats-page animate-fade"
    >
      <form className="card soft-card form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category Name *</label>
          <input name="name" value={form.name} onChange={handleChange} className={errors.name ? 'form-input error' : 'form-input'} placeholder="e.g., Sports Team" />
          {errors.name && <div className="error-text">{errors.name}</div>}
        </div>


        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/school/student-categories')}>Cancel</button>
          <button type="submit" className={"btn btn-primary " + (submitting ? 'btn-loading' : '')} disabled={submitting}>{submitting ? 'Saving...' : 'Create Category'}</button>
        </div>
      </form>
    </StudentPageContainer>
  );
};

export default AddStudentCategoryPage;
