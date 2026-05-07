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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'src/components/ui/select';
import { Switch } from 'src/components/ui/switch';
import CardBox from 'src/components/shared/CardBox';
import { Pencil, Trash2, Plus } from 'lucide-react';








const initialData = [
{ id: 1, name: 'Paypal', type: 'Payment', status: 'active' },
{ id: 2, name: 'Razorpay', type: 'Payment', status: 'active' },
{ id: 3, name: 'Stripe', type: 'Payment', status: 'active' }];


const BCrumb = [
{ to: '/', title: 'Home' },
{ to: '/super/settings/platform', title: 'Platform Configuration' },
{ title: 'Payment Gateways' }];


const PaymentGateways = () => {
  const [gateways, setGateways] = useState(initialData);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: 'Payment', status: 'active' });

  const filtered = gateways.filter((g) =>
  g.name.toLowerCase().includes(search.toLowerCase()) ||
  g.type.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingGateway(null);
    setFormData({ name: '', type: 'Payment', status: 'active' });
    setDialogOpen(true);
  };

  const openEdit = (gw) => {
    setEditingGateway(gw);
    setFormData({ name: gw.name, type: gw.type, status: gw.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingGateway) {
      setGateways((prev) =>
      prev.map((g) => g.id === editingGateway.id ? { ...g, ...formData } : g)
      );
    } else {
      setGateways((prev) => [
      ...prev,
      { id: Date.now(), ...formData }]
      );
    }
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    setGateways((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <>
            <BreadcrumbComp title="Manage Gateways" items={BCrumb} />

            <CardBox>
                <div>
                    <div className="p-4 pt-0 flex items-center justify-between flex-wrap gap-4">
                        <h3 className="text-xl font-semibold">Payment Gateways</h3>
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
                                    <TableHead className="font-semibold px-4">Type</TableHead>
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
                                                <Badge className="bg-lightprimary text-primary rounded-full px-3 py-1 text-xs font-medium">
                                                    {gw.type}
                                                </Badge>
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
                                                    <Button
                        size="sm"
                        variant="lighterror"
                        className="size-8! rounded-full"
                        title="Delete gateway"
                        onClick={() => handleDelete(gw.id)}>
                        
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                ) :

                <TableRow>
                                        <TableCell colSpan={4} className="text-center p-6 text-muted-foreground">
                                            No gateways found.
                                        </TableCell>
                                    </TableRow>
                }
                            </TableBody>
                        </Table>
                    </div>

                    <div className="p-4 text-sm text-muted-foreground">
                        Showing 1 to {filtered.length} of {gateways.length} entries
                    </div>
                </div>
            </CardBox>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingGateway ? 'Edit Gateway' : 'Add New Gateway'}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 pt-2">
                        <div>
                            <Label htmlFor="gwName">Gateway Name</Label>
                            <Input
                id="gwName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
                placeholder="e.g. Razorpay" />
              
                        </div>
                        <div>
                            <Label htmlFor="gwType">Type</Label>
                            <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val })}>
                
                                <SelectTrigger className="mt-2 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Payment">Payment</SelectItem>
                                    <SelectItem value="Subscription">Subscription</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-border p-3">
                            <Label htmlFor="gwStatus">Active</Label>
                            <Switch
                id="gwStatus"
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

export default PaymentGateways;