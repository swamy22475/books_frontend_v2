import { useState, useRef } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Icon } from '@iconify/react';

const BCrumb = [
{ to: '/', title: 'Home' },
{ title: 'Navigation Menu' }];










const DEFAULT_NAV_ITEMS = [
{ id: 'nav-features', title: 'Features', url: '#features', visible: true, isButton: false },
{ id: 'nav-faq', title: 'FAQ', url: '#faq', visible: true, isButton: false },
{ id: 'nav-contact', title: 'Contact', url: '#contact', visible: true, isButton: false },
{ id: 'nav-start-trial', title: 'Start Trial', url: '/register', visible: true, isButton: true },
{ id: 'nav-parent', title: 'Parent & Student Portal', url: '/parent/login', visible: true, isButton: false }];


const loadNavItems = () => {
  try {
    const saved = localStorage.getItem('landing_nav_items');
    if (saved) return JSON.parse(saved);
  } catch {/* fallback */}
  return DEFAULT_NAV_ITEMS;
};

const NavigationMenu = () => {
  const [items, setItems] = useState(loadNavItems);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIsButton, setNewIsButton] = useState(false);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const saveItems = (updated) => {
    setItems(updated);
    localStorage.setItem('landing_nav_items', JSON.stringify(updated));
  };

  const toggleVisibility = (index) => {
    const updated = [...items];
    updated[index].visible = !updated[index].visible;
    saveItems(updated);
  };

  const deleteItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    saveItems(updated);
  };

  const addItem = () => {
    if (!newTitle.trim()) return;
    const newItem = {
      id: `nav-${Date.now()}`,
      title: newTitle.trim(),
      url: newUrl.trim() || '#',
      visible: true,
      isButton: newIsButton
    };
    const updated = [...items, newItem];
    saveItems(updated);
    setNewTitle('');
    setNewUrl('');
    setNewIsButton(false);
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
    const updated = [...items];
    const draggedItem = updated.splice(dragItem.current, 1)[0];
    updated.splice(dragOverItem.current, 0, draggedItem);
    dragItem.current = null;
    dragOverItem.current = null;
    saveItems(updated);
  };

  return (
    <>
            <BreadcrumbComp title="Manage Front-End Menu" items={BCrumb} />

            <div className="grid grid-cols-12 gap-6">
                {/* ═════ LEFT — Menu Items ═════ */}
                <div className="lg:col-span-8 col-span-12">
                    <div className="rounded-xl border border-border overflow-hidden">
                        <div className="border-b border-border bg-muted/30 px-6 py-4">
                            <h5 className="font-semibold text-base flex items-center gap-2">
                                <Icon icon="solar:list-bold" width={20} />
                                Menu Items (Drag to reorder)
                            </h5>
                        </div>

                        <div className="p-2">
                            {items.length === 0 ?
              <div className="text-center py-12 text-muted-foreground">
                                    <Icon icon="solar:menu-dots-square-linear" width={48} className="mx-auto mb-3 opacity-40" />
                                    <p>No menu items. Add one from the right panel.</p>
                                </div> :

              <div className="flex flex-col gap-1">
                                    {items.map((item, index) =>
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  className="flex items-center gap-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors cursor-grab active:cursor-grabbing"
                  style={{ padding: '0.75rem 1rem' }}>
                  
                                            {/* Drag handle */}
                                            <div className="text-muted-foreground/50 hover:text-muted-foreground cursor-grab">
                                                <Icon icon="solar:hamburger-menu-linear" width={20} />
                                            </div>

                                            {/* Item info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                                                    {item.title}
                                                    {item.isButton &&
                      <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                                            CTA
                                                        </span>
                      }
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate">
                                                    <span className="opacity-60">({item.url})</span>
                                                </div>
                                            </div>

                                            {/* Visibility toggle */}
                                            <button
                    onClick={() => toggleVisibility(index)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${item.visible ?
                    'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25' :
                    'bg-orange-500/15 text-orange-500 hover:bg-orange-500/25'}`
                    }>
                    
                                                <Icon icon={item.visible ? 'solar:eye-bold' : 'solar:eye-closed-linear'} width={14} />
                                                {item.visible ? 'Visible' : 'Hidden'}
                                            </button>

                                            {/* Delete */}
                                            <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteItem(index)}
                    className="h-8 px-3 text-xs">
                    
                                                Delete
                                            </Button>
                                        </div>
                )}
                                </div>
              }
                        </div>
                    </div>
                </div>

                {/* ═════ RIGHT — Add New Item ═════ */}
                <div className="lg:col-span-4 col-span-12">
                    <div className="rounded-xl border border-border overflow-hidden sticky top-24">
                        <div className="border-b border-border bg-primary/5 px-6 py-4">
                            <h5 className="font-semibold text-base flex items-center gap-2">
                                <Icon icon="solar:add-circle-linear" width={20} className="text-primary" />
                                Add New Menu Item
                            </h5>
                        </div>

                        <div className="p-6 flex flex-col gap-4">
                            <div>
                                <Label htmlFor="menu-title">Title</Label>
                                <Input
                  id="menu-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-2"
                  placeholder="e.g., About Us" />
                
                            </div>

                            <div>
                                <Label htmlFor="menu-url">URL</Label>
                                <Input
                  id="menu-url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="mt-2"
                  placeholder="e.g., #features or /about" />
                
                            </div>

                            <div className="flex items-center gap-2 py-1">
                                <input
                  id="menu-is-button"
                  type="checkbox"
                  checked={newIsButton}
                  onChange={(e) => setNewIsButton(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary" />
                
                                <Label htmlFor="menu-is-button" className="text-sm font-medium cursor-pointer">
                                    Display as Button (CTA)
                                </Label>
                            </div>

                            <Button onClick={addItem} className="mt-2" disabled={!newTitle.trim()}>
                                <Icon icon="solar:add-circle-bold" width={18} className="mr-2" />
                                Add Item
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>);

};

export default NavigationMenu;