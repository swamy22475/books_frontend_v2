import { useState, useRef, useEffect } from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Badge } from 'src/components/ui/badge';
import { Icon } from '@iconify/react';
import CardBox from 'src/components/shared/CardBox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from 'src/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from 'src/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from 'src/components/ui/select';
import { Eye, Plus, Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from 'src/lib/api-client';

const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Client Logos' }
];

const ClientLogos = () => {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = useRef(null);

    const [newClient, setNewClient] = useState({
        client_name: '',
        website: '',
        logo_url: '',
        status: 'Active'
    });

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            // NOTE: backend URL prefix might vary in your setup. We implemented '/master/client-logos'
            const data = await api.get('/master/client-logos/');
            setClients(data || []);
        } catch (error) {
            console.error('Failed to fetch clients', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleAddClient = async () => {
        if (!newClient.client_name.trim()) return;

        setIsSaving(true);
        try {
            const payload = {
                client_name: newClient.client_name,
                website: newClient.website,
                logo_url: newClient.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(newClient.client_name)}&background=5D87FF&color=fff&size=128`,
                status: newClient.status
            };

            const added = await api.post('/master/client-logos/', payload);
            setClients([added, ...clients]);

            setNewClient({ client_name: '', website: '', logo_url: '', status: 'Active' });
            setLogoPreview(null);
            setAddDialogOpen(false);
        } catch (error) {
            console.error('Failed to add client', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClient = async () => {
        if (!selectedClient) return;

        setIsDeleting(true);
        try {
            await api.delete(`/master/client-logos/${selectedClient.id}`);
            const updatedClients = clients.filter((c) => c.id !== selectedClient.id);
            setClients(updatedClients);

            // Adjust page if we deleted the last item on the current page
            const newTotalPages = Math.ceil(updatedClients.length / pageSize);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }

            setDeleteDialogOpen(false);
            setSelectedClient(null);
        } catch (error) {
            console.error('Failed to delete client', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result);
            setNewClient({ ...newClient, logo_url: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const filteredClients = clients.filter((client) =>
        (client.client_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.website || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredClients.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedClients = filteredClients.slice(startIndex, startIndex + pageSize);

    return (
        <>
            <BreadcrumbComp title="Client Logos" items={BCrumb} />

            <CardBox>
                <div>
                    {/* Header */}
                    <div className="p-4 pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-semibold">All Clients</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">Manage client logos displayed on your landing page</p>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Input
                                type="text"
                                className="w-full sm:w-72 placeholder:text-gray-400 dark:placeholder:text-white/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search clients..."
                            />
                            <Button
                                onClick={() => {
                                    setNewClient({ client_name: '', website: '', logo_url: '', status: 'Active' });
                                    setLogoPreview(null);
                                    setAddDialogOpen(true);
                                }}
                                className="shrink-0 flex items-center gap-1.5"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Add Client</span>
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border rounded-md border-ld">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12 text-center">#</TableHead>
                                    <TableHead className="w-20">Logo</TableHead>
                                    <TableHead>Client Name</TableHead>
                                    <TableHead>Website</TableHead>
                                    <TableHead>Added On</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center p-8">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                                <p>Loading clients...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedClients.length > 0 ? (
                                    paginatedClients.map((client, index) => (
                                        <TableRow key={client.id} className="hover:bg-primary/10 transition-colors">
                                            <TableCell className="text-center text-gray-700 dark:text-white/70 font-medium">
                                                {startIndex + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-muted/30">
                                                    <img
                                                        src={client.logo_url}
                                                        alt={client.client_name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(client.client_name)}&background=5D87FF&color=fff&size=128`;
                                                        }}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold text-gray-900 dark:text-white">
                                                {client.client_name}
                                            </TableCell>
                                            <TableCell className="text-gray-700 dark:text-white/70">
                                                {client.website ? (
                                                    <a
                                                        href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline text-sm"
                                                    >
                                                        {client.website}
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-gray-700 dark:text-white/70 text-sm">
                                                {formatDate(client.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={`px-3 py-1 rounded text-xs font-semibold ${client.status === 'Active'
                                                        ? 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25'
                                                        : 'bg-orange-500/15 text-orange-500 hover:bg-orange-500/25'
                                                        }`}
                                                >
                                                    {client.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedClient(client);
                                                            setViewDialogOpen(true);
                                                        }}
                                                        className="p-1.5 rounded-md hover:bg-primary/10 transition-colors cursor-pointer"
                                                        title="View Client"
                                                    >
                                                        <Eye className="w-5 h-5 text-primary" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedClient(client);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                        className="p-1.5 rounded-md hover:bg-red-500/10 transition-colors cursor-pointer"
                                                        title="Delete Client"
                                                    >
                                                        <Trash2 className="w-5 h-5 text-red-500" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center p-8 text-gray-500 dark:text-white/70 font-medium"
                                        >
                                            <Icon icon="solar:user-block-rounded-linear" width={40} className="mx-auto mb-2 opacity-40" />
                                            <p>No clients found.</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer info & Pagination */}
                    <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Icon icon="solar:info-circle-linear" width={14} />
                            Total {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} found. Client logos are displayed on your landing page.
                        </p>

                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="h-8 shadow-sm flex items-center gap-1"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Prev</span>
                                </Button>
                                <span className="text-xs font-semibold text-muted-foreground min-w-[5rem] text-center">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="h-8 shadow-sm flex items-center gap-1"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardBox>

            {/* View Client Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Client Details</DialogTitle>
                        <DialogDescription>Full details of the selected client.</DialogDescription>
                    </DialogHeader>
                    {selectedClient && (
                        <div className="space-y-4 mt-2">
                            {/* Logo preview */}
                            <div className="flex justify-center">
                                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-border bg-muted/30 shadow-sm">
                                    <img
                                        src={selectedClient.logo_url}
                                        alt={selectedClient.client_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedClient.client_name)}&background=5D87FF&color=fff&size=128`;
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wide">Client Name</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{selectedClient.client_name}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wide">Website</p>
                                    {selectedClient.website ? (
                                        <a
                                            href={selectedClient.website.startsWith('http') ? selectedClient.website : `https://${selectedClient.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-primary hover:underline mt-0.5 block"
                                        >
                                            {selectedClient.website}
                                        </a>
                                    ) : (
                                        <span className="text-sm mt-0.5 block text-muted-foreground">-</span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wide">Status</p>
                                    <div className="mt-0.5">
                                        <Badge
                                            className={`px-3 py-1 rounded ${selectedClient.status === 'Active'
                                                ? 'bg-emerald-500/15 text-emerald-500'
                                                : 'bg-orange-500/15 text-orange-500'
                                                }`}
                                        >
                                            {selectedClient.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wide">Added On</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{formatDate(selectedClient.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Client Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Client</DialogTitle>
                        <DialogDescription>Add a new client with their logo to display on the landing page.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        {/* Logo upload */}
                        <div className="flex flex-col items-center gap-3">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-20 h-20 rounded-xl border-2 border-dashed border-border bg-muted/30 flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors overflow-hidden"
                            >
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Icon icon="solar:camera-add-linear" width={28} className="text-muted-foreground" />
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleLogoUpload}
                            />
                            <p className="text-xs text-muted-foreground">Click to upload logo</p>
                        </div>

                        <div>
                            <Label htmlFor="clientName" className="text-sm font-medium mb-1.5">Client Name *</Label>
                            <Input
                                id="clientName"
                                type="text"
                                placeholder="Enter client name"
                                value={newClient.client_name}
                                onChange={(e) => setNewClient({ ...newClient, client_name: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="website" className="text-sm font-medium mb-1.5">Website URL</Label>
                            <Input
                                id="website"
                                type="url"
                                placeholder="https://example.com"
                                value={newClient.website}
                                onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="status" className="text-sm font-medium mb-1.5">Status</Label>
                            <Select
                                value={newClient.status}
                                onValueChange={(value) => setNewClient({ ...newClient, status: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isSaving}>Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={handleAddClient}
                            disabled={!newClient.client_name.trim() || isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : 'Add Client'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Client</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{selectedClient?.client_name}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isDeleting}>Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDeleteClient} disabled={isDeleting}>
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ClientLogos;
