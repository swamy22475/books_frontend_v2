import { useState } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Badge } from 'src/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'src/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter } from
'src/components/ui/dialog';
import { Label } from 'src/components/ui/label';
import { Switch } from 'src/components/ui/switch';
import { Textarea } from 'src/components/ui/textarea';
import CardBox from 'src/components/shared/CardBox';
import { Pencil, Plus } from 'lucide-react';








const initialData = [
{
  id: 1,
  key: 'parent_fee_paid',
  description: 'Sent to parent when an online fee payment is successful.',
  status: 'active'
},
{
  id: 2,
  key: 'student_admission',
  description: 'Sent to parent when a new student admission is confirmed.',
  status: 'active'
},
{
  id: 3,
  key: 'exam_result_published',
  description: 'Sent to parents and students when exam results are published.',
  status: 'active'
},
{
  id: 4,
  key: 'attendance_absent',
  description: 'Sent to parent when a student is marked absent.',
  status: 'inactive'
},
{
  id: 5,
  key: 'password_reset',
  description: 'Sent when a user requests a password reset.',
  status: 'active'
}];


const BCrumb = [
{ to: '/', title: 'Home' },
{ to: '/super/settings/platform', title: 'Platform Configuration' },
{ title: 'Notification Types' }];


const NotificationTypes = () => {
  const [notifications, setNotifications] = useState(initialData);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ key: '', description: '', status: 'active' });

  const filtered = notifications.filter((n) =>
  n.key.toLowerCase().includes(search.toLowerCase()) ||
  n.description.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ key: '', description: '', status: 'active' });
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({ key: item.key, description: item.description, status: item.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingItem) {
      setNotifications((prev) =>
      prev.map((n) => n.id === editingItem.id ? { ...n, ...formData } : n)
      );
    } else {
      setNotifications((prev) => [
      ...prev,
      { id: Date.now(), ...formData }]
      );
    }
    setDialogOpen(false);
  };

  const toggleStatus = (id) => {
    setNotifications((prev) =>
    prev.map((n) => n.id === id ? { ...n, status: n.status === 'active' ? 'inactive' : 'active' } : n)
    );
  };

  return (
    <>
            <BreadcrumbComp title="Manage Notification Types" items={BCrumb} />

            <CardBox>
                <div>
                    <div className="p-4 pt-0 flex items-center justify-between flex-wrap gap-4">
                        <h3 className="text-xl font-semibold">Notification Types</h3>
                        <div className="flex items-center gap-2">
                            <Input
                type="text"
                className="max-w-96 lg:min-w-96 placeholder:text-gray-400 dark:placeholder:text-white/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..." />
              
                            <Button onClick={openAdd} className="flex items-center gap-2">
                                <Plus className="size-5" />
                                Add Type
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto border rounded-md border-ld">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-semibold px-4 min-w-[200px]">Name (Technical Key)</TableHead>
                                    <TableHead className="font-semibold px-4 min-w-[350px]">Description</TableHead>
                                    <TableHead className="font-semibold px-4">Platform Status</TableHead>
                                    <TableHead className="font-semibold px-4">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length > 0 ?
                filtered.map((item) =>
                <TableRow key={item.id} className="hover:bg-primary/10 transition-colors">
                                            <TableCell className="px-4">
                                                <code className="text-primary text-sm font-mono bg-lightprimary px-2 py-1 rounded">
                                                    {item.key}
                                                </code>
                                            </TableCell>
                                            <TableCell className="px-4 text-muted-foreground text-sm">
                                                {item.description}
                                            </TableCell>
                                            <TableCell className="px-4">
                                                <Badge
                      className={`rounded-full px-3 py-1 text-xs font-medium cursor-pointer ${item.status === 'active' ?
                      'bg-lightsuccess text-success' :
                      'bg-lightgray text-gray-500'}`
                      }
                      onClick={() => toggleStatus(item.id)}>
                      
                                                    {item.status === 'active' ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                        size="sm"
                        variant="lightprimary"
                        className="size-8! rounded-full"
                        title="Edit notification type"
                        onClick={() => openEdit(item)}>
                        
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                ) :

                <TableRow>
                                        <TableCell colSpan={4} className="text-center p-6 text-muted-foreground">
                                            No notification types found.
                                        </TableCell>
                                    </TableRow>
                }
                            </TableBody>
                        </Table>
                    </div>

                    <div className="p-4 text-sm text-muted-foreground">
                        Showing {filtered.length} of {notifications.length} entries
                    </div>
                </div>
            </CardBox>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Notification Type' : 'Add New Notification Type'}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 pt-2">
                        <div>
                            <Label htmlFor="notifKey">Technical Key</Label>
                            <Input
                id="notifKey"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                className="mt-2 font-mono"
                placeholder="e.g. parent_fee_paid" />
              
                        </div>
                        <div>
                            <Label htmlFor="notifDesc">Description</Label>
                            <Textarea
                id="notifDesc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2"
                rows={3}
                placeholder="Describe when this notification is triggered..." />
              
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-border p-3">
                            <Label htmlFor="notifStatus">Active</Label>
                            <Switch
                id="notifStatus"
                checked={formData.status === 'active'}
                onCheckedChange={(val) => setFormData({ ...formData, status: val ? 'active' : 'inactive' })} />
              
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>
                            {editingItem ? 'Update' : 'Add'} Type
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>);

};

export default NotificationTypes;