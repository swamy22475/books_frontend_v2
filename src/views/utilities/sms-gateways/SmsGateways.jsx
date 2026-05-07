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
import CardBox from 'src/components/shared/CardBox';
import { Pencil, Plus, Star } from 'lucide-react';








const initialData = [
{ id: 1, name: 'Twilio', isDefault: true, status: 'active' },
{ id: 2, name: 'Gupshup', isDefault: false, status: 'inactive' },
{ id: 3, name: 'ThreeSixtyDialog', isDefault: false, status: 'inactive' }];


const BCrumb = [
{ to: '/', title: 'Home' },
{ to: '/super/settings/platform', title: 'Platform Configuration' },
{ title: 'SMS Gateways' }];


const SmsGateways = () => {
  const [gateways, setGateways] = useState(initialData);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState(null);
  const [formData, setFormData] = useState({ name: '', isDefault: false, status: 'active' });

  const filtered = gateways.filter((g) =>
  g.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingGateway(null);
    setFormData({ name: '', isDefault: false, status: 'active' });
    setDialogOpen(true);
  };

  const openEdit = (gw) => {
    setEditingGateway(gw);
    setFormData({ name: gw.name, isDefault: gw.isDefault, status: gw.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingGateway) {
      setGateways((prev) =>
      prev.map((g) => {
        if (g.id === editingGateway.id) return { ...g, ...formData };
        // If the edited one is set as default, unset others
        if (formData.isDefault) return { ...g, isDefault: false };
        return g;
      })
      );
    } else {
      const newGw = { id: Date.now(), ...formData };
      setGateways((prev) => {
        const updated = formData.isDefault ? prev.map((g) => ({ ...g, isDefault: false })) : prev;
        return [...updated, newGw];
      });
    }
    setDialogOpen(false);
  };

  const handleSetDefault = (id) => {
    setGateways((prev) =>
    prev.map((g) => ({ ...g, isDefault: g.id === id }))
    );
  };

  return (
    <>
            <BreadcrumbComp title="Manage SMS Gateways" items={BCrumb} />

            <CardBox>
                <div>
                    <div className="p-4 pt-0 flex items-center justify-between flex-wrap gap-4">
                        <h3 className="text-xl font-semibold">SMS Gateways</h3>
                        <div className="flex items-center gap-2">
                            <Input
                type="text"
                className="max-w-96 lg:min-w-96 placeholder:text-gray-400 dark:placeholder:text-white/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search gateways..." />
              
                            <Button onClick={openAdd} className="flex items-center gap-2">
                                <Plus className="size-5" />
                                Add Gateway
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto border rounded-md border-ld">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-semibold px-4">Name</TableHead>
                                    <TableHead className="font-semibold px-4">Platform Default</TableHead>
                                    <TableHead className="font-semibold px-4">Status</TableHead>
                                    <TableHead className="font-semibold px-4">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length > 0 ?
                filtered.map((gw) =>
                <TableRow key={gw.id} className="hover:bg-primary/10 transition-colors">
                                            <TableCell className="px-4 font-medium text-foreground">
                                                {gw.name}
                                            </TableCell>
                                            <TableCell className="px-4">
                                                {gw.isDefault ?
                    <Badge className="bg-primary text-white rounded-full px-3 py-1 text-xs font-medium gap-1">
                                                        <Star className="size-3 fill-current" />
                                                        Default
                                                    </Badge> :

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 px-3 rounded-full"
                      onClick={() => handleSetDefault(gw.id)}>
                      
                                                        Set Default
                                                    </Button>
                    }
                                            </TableCell>
                                            <TableCell className="px-4">
                                                <Badge
                      className={`rounded-full px-3 py-1 text-xs font-medium ${gw.status === 'active' ?
                      'bg-lightsuccess text-success' :
                      'bg-lightgray text-gray-500'}`
                      }>
                      
                                                    {gw.status === 'active' ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                        size="sm"
                        variant="lightprimary"
                        className="size-8! rounded-full"
                        title="Edit gateway"
                        onClick={() => openEdit(gw)}>
                        
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                ) :

                <TableRow>
                                        <TableCell colSpan={4} className="text-center p-6 text-muted-foreground">
                                            No SMS gateways found.
                                        </TableCell>
                                    </TableRow>
                }
                            </TableBody>
                        </Table>
                    </div>

                    <div className="p-4 text-sm text-muted-foreground">
                        Showing {filtered.length} of {gateways.length} entries
                    </div>
                </div>
            </CardBox>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingGateway ? 'Edit SMS Gateway' : 'Add New SMS Gateway'}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 pt-2">
                        <div>
                            <Label htmlFor="smsName">Gateway Name</Label>
                            <Input
                id="smsName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
                placeholder="e.g. Twilio" />
              
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-border p-3">
                            <Label htmlFor="smsDefault">Set as Platform Default</Label>
                            <Switch
                id="smsDefault"
                checked={formData.isDefault}
                onCheckedChange={(val) => setFormData({ ...formData, isDefault: val })} />
              
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-border p-3">
                            <Label htmlFor="smsStatus">Active</Label>
                            <Switch
                id="smsStatus"
                checked={formData.status === 'active'}
                onCheckedChange={(val) => setFormData({ ...formData, status: val ? 'active' : 'inactive' })} />
              
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>
                            {editingGateway ? 'Update' : 'Add'} Gateway
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>);

};

export default SmsGateways;