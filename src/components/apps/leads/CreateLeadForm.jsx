'use client';

import { useState, useContext, useEffect } from 'react';
import { LeadContext } from 'src/context/lead-context/index';
import CardBox from '../../shared/CardBox';
import { useNavigate } from 'react-router';

import { Label } from 'src/components/ui/label';
import { Input } from 'src/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger } from
'src/components/ui/dropdown-menu';
import { Button } from 'src/components/ui/button';
import { ChevronDown } from 'lucide-react';

const sources = ['Website', 'Referral', 'Social Media', 'Email Campaign', 'Cold Call'];
const assignees = ['Liam', 'Steve', 'Jack', 'John'];

const CreateLeadForm = () => {
  const { leads, addLead } = useContext(LeadContext);
  const [leadId, setLeadId] = useState(undefined);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [source, setSource] = useState(sources[0]);
  const [notes, setNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState(assignees[0]);

  const navigate = useNavigate();

  useEffect(() => {
    const maxId = leads.reduce((max, lead) => lead.Id > max ? lead.Id : max, 0);
    setLeadId(maxId + 1);
  }, [leads]);

  const handleSubmit = () => {
    if (!name || !email || !phone) {
      alert('Please fill out Name, Email, and Phone fields.');
      return;
    }

    const newLead = {
      Id: leadId,
      name,
      email,
      phone,
      company,
      source,
      status: 'New',
      notes,
      assignedTo,
      createdDate: new Date(),
      deleted: false
    };

    addLead(newLead);
    resetForm();
    navigate('/super/apps/leads');
  };

  const resetForm = () => {
    setLeadId(undefined);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setSource(sources[0]);
    setNotes('');
    setAssignedTo(assignees[0]);
  };

  return (
    <CardBox>
            <h2 className="text-lg font-semibold mb-4">Add New Lead</h2>
            <p>ID : {leadId !== undefined ? leadId : ''}</p>

            <div className="bg-background p-6 my-6 rounded-md">
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
                                    <ChevronDown className="h-4 w-4 ml-1" />
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
                            <Label>Assigned To</Label>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-md w-full justify-between">
                                    {assignedTo}
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-md w-full">
                                <DropdownMenuLabel>Select Assignee</DropdownMenuLabel>
                                {assignees.map((a) =>
                <DropdownMenuItem key={a} onClick={() => setAssignedTo(a)}>
                                        {a}
                                    </DropdownMenuItem>
                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
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

                <div className="flex flex-wrap items-center justify-end mt-6 gap-3">
                    <Button
            className="rounded-md bg-primary text-white hover:bg-primary/90"
            onClick={handleSubmit}>
            
                        Save Lead
                    </Button>
                    <Button
            className="rounded-md bg-red-500 text-white hover:bg-red-600"
            onClick={() => navigate('/super/apps/leads')}>
            
                        Cancel
                    </Button>
                </div>
            </div>
        </CardBox>);

};

export default CreateLeadForm;