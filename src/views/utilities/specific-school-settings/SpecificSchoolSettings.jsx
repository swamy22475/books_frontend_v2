import { useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { Button } from 'src/components/ui/button';
import { Icon } from '@iconify/react';
import { Switch } from 'src/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'src/components/ui/select';

const BCrumb = [
{ to: '/', title: 'Home' },
{ title: 'Specific School Settings' }];


// ── Mock school list (would come from API) ──








const SCHOOLS = [
{ id: '1', name: 'Delhi Public School', code: 'DPS-001', plan: 'Premium', status: 'active' },
{ id: '2', name: 'St. Mary\'s Academy', code: 'SMA-002', plan: 'Standard', status: 'active' },
{ id: '3', name: 'Greenfield International', code: 'GFI-003', plan: 'Basic', status: 'active' },
{ id: '4', name: 'Sunrise Public School', code: 'SPS-004', plan: 'Premium', status: 'active' },
{ id: '5', name: 'Cambridge High School', code: 'CHS-005', plan: 'Standard', status: 'inactive' }];


// ── Feature module definitions ──









const FEATURE_MODULES = [
// Academics
{ id: 'attendance', name: 'Attendance Management', description: 'Track student and teacher attendance with biometric support', icon: 'solar:clipboard-check-bold-duotone', category: 'Academics', color: '#4F46E5' },
{ id: 'timetable', name: 'Timetable Scheduler', description: 'Auto-generate and manage class timetables', icon: 'solar:calendar-bold-duotone', category: 'Academics', color: '#7C3AED' },
{ id: 'exams', name: 'Exam & Results', description: 'Create exams, manage marks and generate report cards', icon: 'solar:document-text-bold-duotone', category: 'Academics', color: '#2563EB' },
{ id: 'assignments', name: 'Assignments & Homework', description: 'Assign, submit and grade homework digitally', icon: 'solar:notebook-bold-duotone', category: 'Academics', color: '#0891B2' },
{ id: 'library', name: 'Library Management', description: 'Manage book inventory, issue/return and fine tracking', icon: 'solar:book-bold-duotone', category: 'Academics', color: '#059669' },
{ id: 'online_classes', name: 'Online Classes', description: 'Integrate with Zoom/Google Meet for virtual classrooms', icon: 'solar:videocamera-record-bold-duotone', category: 'Academics', color: '#DC2626' },

// Administration
{ id: 'fee_management', name: 'Fee Management', description: 'Fee structure, collection, receipts and due reminders', icon: 'solar:wallet-bold-duotone', category: 'Administration', color: '#D97706' },
{ id: 'transport', name: 'Transport Management', description: 'Route planning, vehicle tracking and driver management', icon: 'solar:bus-bold-duotone', category: 'Administration', color: '#EA580C' },
{ id: 'hostel', name: 'Hostel Management', description: 'Room allocation, mess management and visitor logs', icon: 'solar:buildings-bold-duotone', category: 'Administration', color: '#9333EA' },
{ id: 'inventory', name: 'Inventory & Assets', description: 'Track school assets, supplies and maintenance', icon: 'solar:box-bold-duotone', category: 'Administration', color: '#0284C7' },
{ id: 'hr_payroll', name: 'HR & Payroll', description: 'Staff management, salary processing and leave tracking', icon: 'solar:user-id-bold-duotone', category: 'Administration', color: '#BE185D' },

// Communication
{ id: 'notifications', name: 'Push Notifications', description: 'Send instant alerts to parents and staff', icon: 'solar:bell-bold-duotone', category: 'Communication', color: '#F59E0B' },
{ id: 'sms_gateway', name: 'SMS Integration', description: 'Bulk SMS for fees, events and announcements', icon: 'solar:chat-round-dots-bold-duotone', category: 'Communication', color: '#10B981' },
{ id: 'parent_portal', name: 'Parent Portal', description: 'Dedicated portal for parents to track progress', icon: 'solar:users-group-rounded-bold-duotone', category: 'Communication', color: '#6366F1' },
{ id: 'student_app', name: 'Student Mobile App', description: 'Mobile app access for students', icon: 'solar:smartphone-bold-duotone', category: 'Communication', color: '#8B5CF6' },

// Advanced
{ id: 'analytics', name: 'Analytics Dashboard', description: 'Advanced analytics and performance insights', icon: 'solar:chart-2-bold-duotone', category: 'Advanced', color: '#0EA5E9' },
{ id: 'ai_reports', name: 'AI-Powered Reports', description: 'Automated insights and predictive analytics', icon: 'solar:stars-bold-duotone', category: 'Advanced', color: '#A855F7' },
{ id: 'custom_branding', name: 'Custom Branding', description: 'White-label with school logo, colors and domain', icon: 'solar:pallete-2-bold-duotone', category: 'Advanced', color: '#EC4899' }];


// ── Default enabled features per plan ──
const PLAN_DEFAULTS = {
  Basic: ['attendance', 'fee_management', 'notifications', 'exams'],
  Standard: ['attendance', 'fee_management', 'notifications', 'exams', 'timetable', 'assignments', 'library', 'sms_gateway', 'parent_portal', 'transport'],
  Premium: FEATURE_MODULES.map((f) => f.id)
};

const loadSchoolFeatures = (schoolId, plan) => {
  try {
    const saved = localStorage.getItem(`school_features_${schoolId}`);
    if (saved) return JSON.parse(saved);
  } catch {/* fallback */}
  const defaults = PLAN_DEFAULTS[plan] || PLAN_DEFAULTS.Basic;
  return FEATURE_MODULES.reduce((acc, f) => ({ ...acc, [f.id]: defaults.includes(f.id) }), {});
};

const SpecificSchoolSettings = () => {
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [features, setFeatures] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const selectedSchool = SCHOOLS.find((s) => s.id === selectedSchoolId);

  const handleSchoolChange = (schoolId) => {
    setSelectedSchoolId(schoolId);
    const school = SCHOOLS.find((s) => s.id === schoolId);
    if (school) {
      setFeatures(loadSchoolFeatures(schoolId, school.plan));
      setHasChanges(false);
    }
  };

  const toggleFeature = (featureId) => {
    setFeatures((prev) => ({
      ...prev,
      [featureId]: !prev[featureId]
    }));
    setHasChanges(true);
  };

  const toggleCategory = (category, enable) => {
    const categoryFeatures = FEATURE_MODULES.filter((f) => f.category === category);
    setFeatures((prev) => {
      const updated = { ...prev };
      categoryFeatures.forEach((f) => {updated[f.id] = enable;});
      return updated;
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!selectedSchoolId) return;
    localStorage.setItem(`school_features_${selectedSchoolId}`, JSON.stringify(features));
    setHasChanges(false);
    // TODO: API call to persist settings
  };

  const handleReset = () => {
    if (!selectedSchool) return;
    const defaults = PLAN_DEFAULTS[selectedSchool.plan] || PLAN_DEFAULTS.Basic;
    const reset = FEATURE_MODULES.reduce((acc, f) => ({ ...acc, [f.id]: defaults.includes(f.id) }), {});
    setFeatures(reset);
    setHasChanges(true);
  };

  const categories = [...new Set(FEATURE_MODULES.map((f) => f.category))];
  const enabledCount = Object.values(features).filter(Boolean).length;
  const totalCount = FEATURE_MODULES.length;

  const categoryIcons = {
    Academics: 'solar:square-academic-cap-bold-duotone',
    Administration: 'solar:buildings-2-bold-duotone',
    Communication: 'solar:letter-bold-duotone',
    Advanced: 'solar:rocket-bold-duotone'
  };

  const categoryColors = {
    Academics: '#4F46E5',
    Administration: '#D97706',
    Communication: '#10B981',
    Advanced: '#A855F7'
  };

  return (
    <>
            <BreadcrumbComp title="Specific School Settings" items={BCrumb} />

            {/* ── School Selector ── */}
            <div className="rounded-xl border border-border overflow-hidden mb-6">
                <div className="border-b border-border bg-muted/30 px-6 py-3">
                    <h5 className="font-semibold text-base flex items-center gap-2">
                        <Icon icon="solar:buildings-bold-duotone" width={20} />
                        Select School
                    </h5>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-12 md:col-span-5">
                            <label className="text-sm font-medium text-foreground mb-2 block">School</label>
                            <Select value={selectedSchoolId} onValueChange={handleSchoolChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose a school to configure..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {SCHOOLS.map((school) =>
                  <SelectItem key={school.id} value={school.id}>
                                            <div className="flex items-center gap-2">
                                                <span>{school.name}</span>
                                                <span className="text-xs text-muted-foreground">({school.code})</span>
                                            </div>
                                        </SelectItem>
                  )}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedSchool &&
            <>
                                <div className="col-span-6 md:col-span-2">
                                    <div className="rounded-lg bg-primary/10 text-primary px-3 py-2 text-center">
                                        <div className="text-[11px] uppercase tracking-wider font-semibold opacity-70">Plan</div>
                                        <div className="text-sm font-bold">{selectedSchool.plan}</div>
                                    </div>
                                </div>
                                <div className="col-span-6 md:col-span-2">
                                    <div className={`rounded-lg px-3 py-2 text-center ${selectedSchool.status === 'active' ?
                'bg-emerald-500/10 text-emerald-600' :
                'bg-orange-500/10 text-orange-600'}`
                }>
                                        <div className="text-[11px] uppercase tracking-wider font-semibold opacity-70">Status</div>
                                        <div className="text-sm font-bold capitalize">{selectedSchool.status}</div>
                                    </div>
                                </div>
                                <div className="col-span-12 md:col-span-3">
                                    <div className="rounded-lg bg-indigo-500/10 text-indigo-600 px-3 py-2 text-center">
                                        <div className="text-[11px] uppercase tracking-wider font-semibold opacity-70">Active Modules</div>
                                        <div className="text-sm font-bold">{enabledCount} / {totalCount}</div>
                                    </div>
                                </div>
                            </>
            }
                    </div>
                </div>
            </div>

            {/* ── Feature Modules Grid ── */}
            {selectedSchool ?
      <>
                    {categories.map((category) => {
          const categoryFeatures = FEATURE_MODULES.filter((f) => f.category === category);
          const allEnabled = categoryFeatures.every((f) => features[f.id]);
          const someEnabled = categoryFeatures.some((f) => features[f.id]);
          const enabledInCategory = categoryFeatures.filter((f) => features[f.id]).length;

          return (
            <div key={category} className="rounded-xl border border-border overflow-hidden mb-6">
                                <div className="border-b border-border bg-muted/30 px-6 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${categoryColors[category]}15`, color: categoryColors[category] }}>
                    
                                            <Icon icon={categoryIcons[category]} width={18} />
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-base">{category}</h5>
                                            <span className="text-xs text-muted-foreground">
                                                {enabledInCategory} of {categoryFeatures.length} modules enabled
                                            </span>
                                        </div>
                                    </div>
                                    <button
                  onClick={() => toggleCategory(category, !allEnabled)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${allEnabled ?
                  'bg-orange-500/15 text-orange-500 hover:bg-orange-500/25' :
                  someEnabled ?
                  'bg-blue-500/15 text-blue-500 hover:bg-blue-500/25' :
                  'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25'}`
                  }>
                  
                                        {allEnabled ? 'Disable All' : 'Enable All'}
                                    </button>
                                </div>

                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                        {categoryFeatures.map((feature) => {
                    const isEnabled = features[feature.id] ?? false;
                    return (
                      <div
                        key={feature.id}
                        className={`relative rounded-xl border p-4 transition-all duration-200 cursor-pointer group ${isEnabled ?
                        'border-primary/30 bg-primary/[0.03] hover:border-primary/50 shadow-sm' :
                        'border-border bg-card hover:border-muted-foreground/30 opacity-60 hover:opacity-80'}`
                        }
                        onClick={() => toggleFeature(feature.id)}>
                        
                                                    <div className="flex items-start gap-3">
                                                        {/* Icon */}
                                                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                            style={{
                              backgroundColor: isEnabled ? `${feature.color}15` : '#64748b15',
                              color: isEnabled ? feature.color : '#94A3B8'
                            }}>
                            
                                                            <Icon icon={feature.icon} width={22} />
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <h6 className="font-semibold text-sm text-foreground">{feature.name}</h6>
                                                                <Switch
                                checked={isEnabled}
                                onCheckedChange={() => toggleFeature(feature.id)}
                                className="shrink-0" />
                              
                                                            </div>
                                                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{feature.description}</p>
                                                        </div>
                                                    </div>

                                                    {/* Status indicator */}
                                                    <div className="absolute top-2 right-2">
                                                        <div
                            className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`
                            } />
                          
                                                    </div>
                                                </div>);

                  })}
                                    </div>
                                </div>
                            </div>);

        })}

                    {/* ── Action Bar ── */}
                    <div className="sticky bottom-0 bg-white/80 dark:bg-dark/80 backdrop-blur-md border border-border rounded-xl p-4 flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:info-circle-linear" width={16} className="text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Configuring: <strong className="text-foreground">{selectedSchool.name}</strong>
                                </span>
                            </div>
                            {hasChanges &&
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600">
                                    <Icon icon="solar:danger-circle-bold" width={12} />
                                    Unsaved changes
                                </span>
            }
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs">
              
                                <Icon icon="solar:restart-bold" width={14} className="mr-1" />
                                Reset to Plan Defaults
                            </Button>
                            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges}
              className="text-xs">
              
                                <Icon icon="solar:disk-bold" width={14} className="mr-1" />
                                Save Configuration
                            </Button>
                        </div>
                    </div>
                </> : (

      /* ── Empty state: no school selected ── */
      <div className="rounded-xl border border-dashed border-border bg-muted/10 py-20 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon icon="solar:tuning-4-bold-duotone" width={32} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-1">Select a School</h3>
                    <p className="text-sm text-muted-foreground max-w-md text-center">
                        Choose a school from the dropdown above to configure which modules and features are enabled for that specific school.
                    </p>
                </div>)
      }
        </>);

};

export default SpecificSchoolSettings;