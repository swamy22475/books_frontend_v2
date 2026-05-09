import { useState, useRef } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { Button } from 'src/components/ui/button';
import { Icon } from '@iconify/react';

const BCrumb = [
{ to: '/', title: 'Home' },
{ title: 'Page Sections' }];









const DEFAULT_SECTIONS = [
{ id: 'hero', title: 'Hero', subtitle: 'School ERP | Multi School Management System with Apps', visible: true },
{ id: 'features', title: 'Features', subtitle: 'Explore Our Top Features', visible: true },
{ id: 'panel_preview', title: 'Panel_preview', subtitle: 'Intuitive School Admin Panel', visible: true },
{ id: 'pricing', title: 'Pricing', subtitle: 'Flexible Pricing Packages', visible: true },
{ id: 'contact', title: 'Contact', subtitle: "Let's Get In Touch", visible: true },
{ id: 'faq', title: 'Faq', subtitle: 'Frequently Asked Questions', visible: true }];


const loadSections = () => {
  try {
    const saved = localStorage.getItem('landing_sections');
    if (saved) return JSON.parse(saved);
  } catch {/* fallback */}
  return DEFAULT_SECTIONS;
};

const PageSections = () => {
  const [sections, setSections] = useState(loadSections);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const saveSections = (updated) => {
    setSections(updated);
    localStorage.setItem('landing_sections', JSON.stringify(updated));
  };

  const toggleVisibility = (index) => {
    const updated = [...sections];
    updated[index].visible = !updated[index].visible;
    saveSections(updated);
  };

  const deleteSection = (index) => {
    const updated = sections.filter((_, i) => i !== index);
    saveSections(updated);
  };

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const updated = [...sections];
    const draggedItem = updated.splice(dragItem.current, 1)[0];
    updated.splice(dragOverItem.current, 0, draggedItem);
    dragItem.current = null;
    dragOverItem.current = null;
    saveSections(updated);
  };

  return (
    <>
            <BreadcrumbComp title="Manage Landing Page" items={BCrumb} />

            <div className="rounded-xl border border-border overflow-hidden">
                <div className="border-b border-border bg-muted/30 px-6 py-4">
                    <h5 className="font-semibold text-base flex items-center gap-2">
                        <Icon icon="solar:layers-linear" width={20} />
                        Page Sections (Drag to reorder)
                    </h5>
                </div>

                <div className="p-2">
                    {sections.length === 0 ?
          <div className="text-center py-12 text-muted-foreground">
                            <Icon icon="solar:layers-minimalistic-linear" width={48} className="mx-auto mb-3 opacity-40" />
                            <p>No sections configured. Add sections to build your landing page.</p>
                        </div> :

          <div className="flex flex-col gap-1">
                            {sections.map((section, index) =>
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDrop}
              className="flex items-center gap-4 px-4 py-3, rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors cursor-grab active:cursor-grabbing"
              style={{ padding: '0.75rem 1rem' }}>
              
                                    {/* Drag handle */}
                                    <div className="text-muted-foreground/50 hover:text-muted-foreground cursor-grab">
                                        <Icon icon="solar:hamburger-menu-linear" width={20} />
                                    </div>

                                    {/* Section info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm text-foreground">{section.title}</div>
                                        <div className="text-xs text-muted-foreground truncate">{section.subtitle}</div>
                                    </div>

                                    {/* Visibility toggle */}
                                    <button
                onClick={() => toggleVisibility(index)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${section.visible ?
                'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25' :
                'bg-orange-500/15 text-orange-500 hover:bg-orange-500/25'}`
                }>
                
                                        <Icon icon={section.visible ? 'solar:eye-bold' : 'solar:eye-closed-linear'} width={14} />
                                        {section.visible ? 'Visible' : 'Hidden'}
                                    </button>

                                    {/* Delete */}
                                    <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteSection(index)}
                className="h-8 px-3 text-xs">
                
                                        Delete
                                    </Button>
                                </div>
            )}
                        </div>
          }
                </div>

                {/* Info footer */}
                <div className="border-t border-border bg-muted/10 px-6 py-3">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Icon icon="solar:info-circle-linear" width={14} />
                        Drag sections to reorder them on the landing page. Toggle visibility to show or hide sections.
                        Changes are saved automatically and reflected on the landing page at <code className="bg-muted px-1.5 py-0.5 rounded text-[11px]">/</code>.
                    </p>
                </div>
            </div>
        </>);

};

export default PageSections;