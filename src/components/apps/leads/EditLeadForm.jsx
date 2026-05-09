'use client';

import { useState, useContext, useEffect } from 'react';
import { LeadContext } from 'src/context/lead-context/index';
import CardBox from '../../shared/CardBox';
import { useNavigate, useParams } from 'react-router';

import { Label } from 'src/components/ui/label';
import { Input } from 'src/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from
    'src/components/ui/dropdown-menu';
import { Button } from 'src/components/ui/button';
import { ChevronDown, Loader2 } from 'lucide-react';

const sources = ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Call'];
const assignees = ['Liam', 'Steve', 'Jack', 'John'];
const statuses = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

const EditLeadForm = () => {
    const { leads, editLead, loading } = useContext(LeadContext);
    const { id } = useParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [source, setSource] = useState(sources[0]);
    const [notes, setNotes] = useState('');
    const [assignedTo, setAssignedTo] = useState(assignees[0]);
    const [status, setStatus] = useState('New');
    const [isFound, setIsFound] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && leads.length > 0) {
            const existingLead = leads.find(l => l.Id === parseInt(id));
            if (existingLead) {
                setName(existingLead.name || '');
                setEmail(existingLead.email || '');
                setPhone(existingLead.phone || '');
                setCompany(existingLead.company || '');
                setSource(existingLead.source || sources[0]);
                setNotes(existingLead.notes || '');
                setAssignedTo(existingLead.assignedTo || assignees[0]);
                setStatus(existingLead.status || 'New');
            } else {
                setIsFound(false);
            }
        }
    }, [id, leads, loading]);

    const handleSubmit = () => {
        if (!name || !email || !phone) {
            alert('Please fill out Name, Email, and Phone fields.');
            return;
        }

        const updatedLead = {
            Id: parseInt(id),
            name,
            email,
            phone,
            company,
            source,
            status,
            notes,
            assignedTo,
            deleted: false
        };

        editLead(updatedLead);
        navigate('/super/apps/leads');
    };

    if (loading) {
        return (
            <CardBox>
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </CardBox>
        );
    }

    if (!isFound) {
        return (
            <CardBox>
                <div className="p-6 text-center">
                    <h2 className="text-xl font-semibold mb-2">Lead Not Found</h2>
                    <Button onClick={() => navigate('/super/apps/leads')}>Back to Leads</Button>
                </div>
            </CardBox>
        );
    }

    return (
        <CardBox>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Edit Lead #{id}</h2>
            </div>

            <div className="bg-background p-6 my-6 rounded-md border shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="leadName">Full Name *</Label>
                        </div>
                        <Input
                            id="leadName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter full name"
                            className="w-full form-control" />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="leadEmail">Email Address *</Label>
                        </div>
                        <Input
                            id="leadEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            className="w-full form-control" />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="leadPhone">Phone Number *</Label>
                        </div>
                        <Input
                            id="leadPhone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                            className="w-full form-control" />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="leadCompany">School / Company</Label>
                        </div>
                        <Input
                            id="leadCompany"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Enter school or company name"
                            className="w-full form-control" />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label>Lead Source</Label>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-md w-full justify-between">
                                    {source}
                                    <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-md w-full">
                                <DropdownMenuLabel>Select Source</DropdownMenuLabel>
                                {sources.map((s) =>
                                    <DropdownMenuItem key={s} onClick={() => setSource(s)}>
                                        {s}
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label>Status</Label>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-md w-full justify-between">
                                    {status}
                                    <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-md w-full">
                                <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                                {statuses.map((s) =>
                                    <DropdownMenuItem key={s} onClick={() => setStatus(s)}>
                                        {s}
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="mt-6">
                    <div className="mb-2 block">
                        <Label>Assigned To</Label>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-md w-64 justify-between">
                                {assignedTo}
                                <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-md w-64">
                            <DropdownMenuLabel>Select Assignee</DropdownMenuLabel>
                            {assignees.map((a) =>
                                <DropdownMenuItem key={a} onClick={() => setAssignedTo(a)}>
                                    {a}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="mt-6">
                    <div className="mb-2 block">
                        <Label htmlFor="leadNotes">Notes</Label>
                    </div>
                    <Input
                        id="leadNotes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any additional notes about this lead..."
                        className="w-full form-control" />
                </div>

                <div className="flex flex-wrap items-center justify-end mt-6 gap-3 pt-4 border-t">
                    <Button
                        className="rounded-md bg-primary text-white hover:bg-primary/90 min-w-24"
                        onClick={handleSubmit}>
                        Save Changes
                    </Button>
                    <Button
                        variant="outline"
                        className="rounded-md"
                        onClick={() => navigate('/super/apps/leads')}>
                        Cancel
                    </Button>
                </div>
            </div>
        </CardBox>
    );
};

export default EditLeadForm;
