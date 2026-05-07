import { useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { Button } from 'src/components/ui/button';
import { Icon } from '@iconify/react';
import { Switch } from 'src/components/ui/switch';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Master Menu Builder' }];


// ── Roles ──








const ROLES = [
  { id: 'school_admin', name: 'School Admin', description: 'Full access within school (all branches)', icon: 'solar:shield-user-bold-duotone', color: '#4F46E5' },
  { id: 'branch_admin', name: 'Branch Admin', description: 'Full access within assigned branch', icon: 'solar:buildings-2-bold-duotone', color: '#0284C7' },
  { id: 'branch_principal', name: 'Branch Principal', description: 'Read-only oversight of assigned branch', icon: 'solar:eye-bold-duotone', color: '#7C3AED' },
  { id: 'principal', name: 'Principal', description: 'School leadership (all branches)', icon: 'solar:crown-bold-duotone', color: '#B45309' },
  { id: 'teacher', name: 'Teacher', description: 'Teaching staff', icon: 'solar:square-academic-cap-bold-duotone', color: '#059669' },
  { id: 'student', name: 'Student', description: 'Student portal access', icon: 'solar:user-bold-duotone', color: '#0891B2' },
  { id: 'parent', name: 'Parent', description: 'Parent/guardian access', icon: 'solar:users-group-rounded-bold-duotone', color: '#D97706' },
  { id: 'accountant', name: 'Accountant', description: 'Finance management', icon: 'solar:calculator-bold-duotone', color: '#DC2626' },
  { id: 'receptionist', name: 'Receptionist', description: 'Front desk operations', icon: 'solar:phone-calling-bold-duotone', color: '#EC4899' },
  { id: 'librarian', name: 'Librarian', description: 'Library management', icon: 'solar:book-bold-duotone', color: '#0D9488' }];


// ── Menu items grouped by sections ──















const MENU_SECTIONS = [
  {
    id: 'dashboard',
    title: 'Dashboard & Overview',
    icon: 'solar:widget-bold-duotone',
    color: '#4F46E5',
    items: [
      { id: 'dashboard_overview', name: 'Dashboard', icon: 'solar:chart-bold-duotone' },
      { id: 'profile', name: 'My Profile', icon: 'solar:user-circle-bold-duotone' },
      { id: 'calendar', name: 'Calendar', icon: 'solar:calendar-bold-duotone' },
      { id: 'announcements', name: 'Announcements', icon: 'solar:bell-bing-bold-duotone' }]

  },
  {
    id: 'academics',
    title: 'Academics',
    icon: 'solar:square-academic-cap-bold-duotone',
    color: '#2563EB',
    items: [
      {
        id: 'classes', name: 'Classes & Sections', icon: 'solar:buildings-bold-duotone',
        children: [
          { id: 'class_list', name: 'View Classes' },
          { id: 'class_create', name: 'Create Class' },
          { id: 'section_manage', name: 'Manage Sections' }]

      },
      {
        id: 'subjects', name: 'Subjects', icon: 'solar:notebook-bold-duotone',
        children: [
          { id: 'subject_list', name: 'View Subjects' },
          { id: 'subject_assign', name: 'Assign to Class' }]

      },
      {
        id: 'timetable', name: 'Timetable', icon: 'solar:clock-circle-bold-duotone',
        children: [
          { id: 'timetable_view', name: 'View Timetable' },
          { id: 'timetable_create', name: 'Create Timetable' }]

      },
      { id: 'syllabus', name: 'Syllabus', icon: 'solar:document-text-bold-duotone' },
      {
        id: 'homework', name: 'Homework', icon: 'solar:pen-new-round-bold-duotone',
        children: [
          { id: 'homework_list', name: 'View Homework' },
          { id: 'homework_create', name: 'Assign Homework' },
          { id: 'homework_submit', name: 'Submit Homework' }]

      },
      { id: 'online_classes', name: 'Online Classes', icon: 'solar:videocamera-record-bold-duotone' }]

  },
  {
    id: 'students',
    title: 'Student Management',
    icon: 'solar:users-group-two-rounded-bold-duotone',
    color: '#0891B2',
    items: [
      {
        id: 'student_mgmt', name: 'Students', icon: 'solar:user-bold-duotone',
        children: [
          { id: 'student_list', name: 'All Students' },
          { id: 'student_add', name: 'Add Student' },
          { id: 'student_promote', name: 'Promote Students' }]

      },
      {
        id: 'attendance', name: 'Attendance', icon: 'solar:clipboard-check-bold-duotone',
        children: [
          { id: 'attendance_mark', name: 'Mark Attendance' },
          { id: 'attendance_report', name: 'Attendance Report' }]

      },
      { id: 'behaviour', name: 'Behaviour Records', icon: 'solar:shield-check-bold-duotone' },
      { id: 'transfer_cert', name: 'Transfer Certificate', icon: 'solar:document-add-bold-duotone' }]

  },
  {
    id: 'exams',
    title: 'Examination',
    icon: 'solar:document-text-bold-duotone',
    color: '#7C3AED',
    items: [
      {
        id: 'exam_mgmt', name: 'Exams', icon: 'solar:clipboard-text-bold-duotone',
        children: [
          { id: 'exam_schedule', name: 'Exam Schedule' },
          { id: 'exam_create', name: 'Create Exam' }]

      },
      {
        id: 'marks', name: 'Marks & Grades', icon: 'solar:medal-ribbon-star-bold-duotone',
        children: [
          { id: 'marks_entry', name: 'Enter Marks' },
          { id: 'marks_report', name: 'Marks Report' },
          { id: 'report_cards', name: 'Report Cards' }]

      }]

  },
  {
    id: 'finance',
    title: 'Finance & Fees',
    icon: 'solar:wallet-bold-duotone',
    color: '#D97706',
    items: [
      {
        id: 'fees', name: 'Fee Management', icon: 'solar:hand-money-bold-duotone',
        children: [
          { id: 'fee_structure', name: 'Fee Structure' },
          { id: 'fee_collect', name: 'Collect Fee' },
          { id: 'fee_dues', name: 'Fee Dues' },
          { id: 'fee_reports', name: 'Fee Reports' }]

      },
      { id: 'expenses', name: 'Expenses', icon: 'solar:bill-list-bold-duotone' },
      { id: 'salary', name: 'Staff Salary', icon: 'solar:wallet-money-bold-duotone' }]

  },
  {
    id: 'hr',
    title: 'Human Resources',
    icon: 'solar:user-id-bold-duotone',
    color: '#BE185D',
    items: [
      {
        id: 'staff_mgmt', name: 'Staff', icon: 'solar:user-id-bold-duotone',
        children: [
          { id: 'staff_list', name: 'All Staff' },
          { id: 'staff_add', name: 'Add Staff' }]

      },
      {
        id: 'leave_mgmt', name: 'Leave Management', icon: 'solar:calendar-mark-bold-duotone',
        children: [
          { id: 'leave_apply', name: 'Apply Leave' },
          { id: 'leave_approve', name: 'Approve Leave' },
          { id: 'leave_report', name: 'Leave Report' }]

      },
      { id: 'staff_attendance', name: 'Staff Attendance', icon: 'solar:clipboard-check-bold-duotone' }]

  },
  {
    id: 'communication',
    title: 'Communication',
    icon: 'solar:letter-bold-duotone',
    color: '#10B981',
    items: [
      { id: 'messages', name: 'Messages', icon: 'solar:chat-round-dots-bold-duotone' },
      { id: 'notice_board', name: 'Notice Board', icon: 'solar:clipboard-bold-duotone' },
      { id: 'sms_send', name: 'Send SMS', icon: 'solar:chat-line-bold-duotone' },
      { id: 'email_send', name: 'Send Email', icon: 'solar:letter-bold-duotone' },
      { id: 'push_notify', name: 'Push Notification', icon: 'solar:bell-bold-duotone' }]

  },
  {
    id: 'extras',
    title: 'Other Modules',
    icon: 'solar:widget-5-bold-duotone',
    color: '#64748B',
    items: [
      { id: 'library', name: 'Library', icon: 'solar:book-bold-duotone' },
      { id: 'transport', name: 'Transport', icon: 'solar:bus-bold-duotone' },
      { id: 'hostel', name: 'Hostel', icon: 'solar:buildings-bold-duotone' },
      { id: 'inventory', name: 'Inventory', icon: 'solar:box-bold-duotone' },
      { id: 'visitor_log', name: 'Visitor Log', icon: 'solar:login-3-bold-duotone' },
      {
        id: 'reports', name: 'Reports', icon: 'solar:chart-2-bold-duotone',
        children: [
          { id: 'report_academic', name: 'Academic Reports' },
          { id: 'report_financial', name: 'Financial Reports' },
          { id: 'report_attendance', name: 'Attendance Reports' }]

      },
      { id: 'settings', name: 'Settings', icon: 'solar:settings-bold-duotone' }]

  }];


// ── Default access per role ──
const ROLE_DEFAULTS = {
  school_admin: getAllMenuIds(), // full access
  branch_admin: getAllMenuIds(), // full access within branch
  branch_principal: ['dashboard_overview', 'profile', 'calendar', 'announcements', 'class_list', 'subject_list', 'timetable_view', 'syllabus', 'homework_list', 'online_classes', 'student_list', 'attendance_report', 'behaviour', 'exam_schedule', 'marks_report', 'report_cards', 'fee_structure', 'fee_dues', 'fee_reports', 'staff_list', 'leave_report', 'staff_attendance', 'messages', 'notice_board', 'library', 'transport', 'report_academic', 'report_financial', 'report_attendance'],
  principal: getAllMenuIds(), // school leadership — full visibility
  teacher: ['dashboard_overview', 'profile', 'calendar', 'announcements', 'class_list', 'subject_list', 'timetable_view', 'timetable_create', 'syllabus', 'homework_list', 'homework_create', 'online_classes', 'student_list', 'attendance_mark', 'attendance_report', 'behaviour', 'exam_schedule', 'marks_entry', 'marks_report', 'report_cards', 'leave_apply', 'staff_attendance', 'messages', 'notice_board', 'library'],
  student: ['dashboard_overview', 'profile', 'calendar', 'announcements', 'timetable_view', 'syllabus', 'homework_list', 'homework_submit', 'online_classes', 'attendance_report', 'exam_schedule', 'marks_report', 'report_cards', 'messages', 'notice_board', 'library'],
  parent: ['dashboard_overview', 'profile', 'calendar', 'announcements', 'timetable_view', 'homework_list', 'attendance_report', 'exam_schedule', 'marks_report', 'report_cards', 'fee_structure', 'fee_dues', 'messages', 'notice_board', 'transport'],
  accountant: ['dashboard_overview', 'profile', 'fee_structure', 'fee_collect', 'fee_dues', 'fee_reports', 'expenses', 'salary', 'report_financial'],
  receptionist: ['dashboard_overview', 'profile', 'announcements', 'student_list', 'staff_list', 'messages', 'visitor_log'],
  librarian: ['dashboard_overview', 'profile', 'announcements', 'student_list', 'library', 'messages', 'notice_board']
};

function getAllMenuIds() {
  const ids = [];
  MENU_SECTIONS.forEach((section) => {
    section.items.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => ids.push(child.id));
      } else {
        ids.push(item.id);
      }
    });
  });
  return ids;
}

function getItemIds(item) {
  if (item.children) return item.children.map((c) => c.id);
  return [item.id];
}

const loadRoleAccess = (roleId) => {
  try {
    const saved = localStorage.getItem(`menu_access_${roleId}`);
    if (saved) return JSON.parse(saved);
  } catch {/* fallback */ }
  const defaults = ROLE_DEFAULTS[roleId] || [];
  const allIds = getAllMenuIds();
  return allIds.reduce((acc, id) => ({ ...acc, [id]: defaults.includes(id) }), {});
};

const MasterMenuBuilder = () => {
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [access, setAccess] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const selectedRole = ROLES.find((r) => r.id === selectedRoleId);

  const handleRoleSelect = (roleId) => {
    setSelectedRoleId(roleId);
    setAccess(loadRoleAccess(roleId));
    setHasChanges(false);
    setExpandedItems({});
  };

  const toggleAccess = (itemId) => {
    setAccess((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
    setHasChanges(true);
  };

  const toggleParentItem = (item) => {
    if (!item.children) return;
    const childIds = item.children.map((c) => c.id);
    const allEnabled = childIds.every((id) => access[id]);
    setAccess((prev) => {
      const updated = { ...prev };
      childIds.forEach((id) => { updated[id] = !allEnabled; });
      return updated;
    });
    setHasChanges(true);
  };

  const toggleSection = (section, enable) => {
    const ids = [];
    section.items.forEach((item) => {
      getItemIds(item).forEach((id) => ids.push(id));
    });
    setAccess((prev) => {
      const updated = { ...prev };
      ids.forEach((id) => { updated[id] = enable; });
      return updated;
    });
    setHasChanges(true);
  };

  const toggleExpand = (itemId) => {
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleSave = () => {
    if (!selectedRoleId) return;
    localStorage.setItem(`menu_access_${selectedRoleId}`, JSON.stringify(access));
    setHasChanges(false);
  };

  const handleReset = () => {
    if (!selectedRoleId) return;
    const defaults = ROLE_DEFAULTS[selectedRoleId] || [];
    const allIds = getAllMenuIds();
    const reset = allIds.reduce((acc, id) => ({ ...acc, [id]: defaults.includes(id) }), {});
    setAccess(reset);
    setHasChanges(true);
  };

  const enabledCount = Object.values(access).filter(Boolean).length;
  const totalCount = Object.keys(access).length;

  return (
    <>
      <BreadcrumbComp title="Master Menu Builder" items={BCrumb} />

      {/* ── Role Selector Cards ── */}
      <div className="rounded-xl border border-border overflow-hidden mb-6">
        <div className="border-b border-border bg-muted/30 px-6 py-3">
          <h5 className="font-semibold text-base flex items-center gap-2">
            <Icon icon="solar:shield-user-bold-duotone" width={20} />
            Select Role
          </h5>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose a role to configure its menu access and permissions
          </p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {ROLES.map((role) => {
              const isSelected = selectedRoleId === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-center group ${isSelected ?
                    'border-primary bg-primary/[0.05] shadow-md shadow-primary/10' :
                    'border-transparent bg-card hover:border-muted-foreground/20 hover:bg-muted/30'}`
                  }>

                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: isSelected ? `${role.color}20` : `${role.color}10`,
                      color: role.color
                    }}>

                    <Icon icon={role.icon} width={24} />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {role.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                      {role.description}
                    </div>
                  </div>
                  {isSelected &&
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Icon icon="tabler:check" width={12} className="text-white" />
                    </div>
                  }
                </button>);

            })}
          </div>
        </div>
      </div>

      {/* ── Menu Access Configuration ── */}
      {selectedRole ?
        <>
          {/* Summary bar */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3 mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${selectedRole.color}15`, color: selectedRole.color }}>

                <Icon icon={selectedRole.icon} width={20} />
              </div>
              <div>
                <span className="font-semibold text-sm text-foreground">{selectedRole.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {enabledCount} of {totalCount} menu items enabled
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalCount > 0 ? enabledCount / totalCount * 100 : 0}%`,
                    backgroundColor: selectedRole.color
                  }} />

              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {totalCount > 0 ? Math.round(enabledCount / totalCount * 100) : 0}%
              </span>
            </div>
          </div>

          {/* Menu Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {MENU_SECTIONS.map((section) => {
              const sectionIds = [];
              section.items.forEach((item) => {
                getItemIds(item).forEach((id) => sectionIds.push(id));
              });
              const sectionEnabled = sectionIds.filter((id) => access[id]).length;
              const allSectionEnabled = sectionEnabled === sectionIds.length;

              return (
                <div key={section.id} className="rounded-xl border border-border overflow-hidden">
                  {/* Section Header */}
                  <div className="border-b border-border bg-muted/30 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: `${section.color}15`, color: section.color }}>

                        <Icon icon={section.icon} width={16} />
                      </div>
                      <div>
                        <h6 className="font-semibold text-sm">{section.title}</h6>
                        <span className="text-[11px] text-muted-foreground">
                          {sectionEnabled}/{sectionIds.length} enabled
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSection(section, !allSectionEnabled)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${allSectionEnabled ?
                        'bg-orange-500/15 text-orange-500 hover:bg-orange-500/25' :
                        'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25'}`
                      }>

                      {allSectionEnabled ? 'Disable All' : 'Enable All'}
                    </button>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 flex flex-col gap-0.5">
                    {section.items.map((item) => {
                      const isExpanded = expandedItems[item.id] ?? true;
                      const hasChildren = item.children && item.children.length > 0;

                      if (hasChildren) {
                        const childIds = item.children.map((c) => c.id);
                        const childEnabled = childIds.filter((id) => access[id]).length;
                        const allChildEnabled = childEnabled === childIds.length;
                        const someChildEnabled = childEnabled > 0;

                        return (
                          <div key={item.id} className="rounded-lg border border-border/50 overflow-hidden">
                            {/* Parent row */}
                            <div
                              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${someChildEnabled ? 'bg-primary/[0.02]' : 'bg-card hover:bg-muted/20'}`
                              }>

                              <button
                                onClick={() => toggleExpand(item.id)}
                                className="text-muted-foreground hover:text-foreground transition-transform"
                                style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>

                                <Icon icon="tabler:chevron-right" width={14} />
                              </button>
                              <Icon icon={item.icon} width={18} className="text-muted-foreground shrink-0" />
                              <span className="flex-1 text-sm font-medium text-foreground">{item.name}</span>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${someChildEnabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`
                              }>
                                {childEnabled}/{childIds.length}
                              </span>
                              <Switch
                                checked={allChildEnabled}
                                onCheckedChange={() => toggleParentItem(item)}
                                className="scale-[0.8]" />

                            </div>

                            {/* Children */}
                            {isExpanded &&
                              <div className="bg-muted/10 border-t border-border/30">
                                {item.children.map((child) => {
                                  const isOn = access[child.id] ?? false;
                                  return (
                                    <div
                                      key={child.id}
                                      className={`flex items-center gap-3 pl-10 pr-3 py-2 cursor-pointer transition-colors border-b border-border/20 last:border-b-0 ${isOn ? 'hover:bg-primary/[0.03]' : 'hover:bg-muted/20 opacity-50'}`
                                      }
                                      onClick={() => toggleAccess(child.id)}>

                                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOn ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                      <span className="flex-1 text-[13px] text-foreground">{child.name}</span>
                                      <Switch
                                        checked={isOn}
                                        onCheckedChange={() => toggleAccess(child.id)}
                                        className="scale-[0.75]" />

                                    </div>);

                                })}
                              </div>
                            }
                          </div>);

                      }

                      // Simple item (no children)
                      const isOn = access[item.id] ?? false;
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${isOn ? 'bg-card hover:bg-primary/[0.03]' : 'bg-card hover:bg-muted/20 opacity-50'}`
                          }
                          onClick={() => toggleAccess(item.id)}>

                          <Icon icon={item.icon} width={18} className="text-muted-foreground shrink-0" />
                          <span className="flex-1 text-sm font-medium text-foreground">{item.name}</span>
                          <Switch
                            checked={isOn}
                            onCheckedChange={() => toggleAccess(item.id)}
                            className="scale-[0.8]" />

                        </div>);

                    })}
                  </div>
                </div>);

            })}
          </div>

          {/* ── Sticky Action Bar ── */}
          <div className="sticky bottom-0 bg-white/80 dark:bg-dark/80 backdrop-blur-md border border-border rounded-xl p-4 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Icon icon="solar:info-circle-linear" width={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Editing: <strong className="text-foreground">{selectedRole.name}</strong>
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
              <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
                <Icon icon="solar:restart-bold" width={14} className="mr-1" />
                Reset to Defaults
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!hasChanges} className="text-xs">
                <Icon icon="solar:disk-bold" width={14} className="mr-1" />
                Save Permissions
              </Button>
            </div>
          </div>
        </> : (

          /* ── Empty State ── */
          <div className="rounded-xl border border-dashed border-border bg-muted/10 py-20 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Icon icon="solar:settings-minimalistic-bold-duotone" width={32} className="text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-1">Select a Role</h3>
            <p className="text-sm text-muted-foreground max-w-md text-center">
              Choose a role above to configure which menu items and features are accessible for users with that role.
            </p>
          </div>)
      }
    </>);

};

export default MasterMenuBuilder;