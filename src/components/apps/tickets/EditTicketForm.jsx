'use client';

import { useState, useContext, useEffect } from 'react';
import { TicketContext } from 'src/context/ticket-context/index';

import { isValid, format } from 'date-fns';
import CardBox from '../../shared/CardBox';
import { useNavigate, useParams } from 'react-router';

import user1 from 'src/assets/images/profile/user-1.jpg';
import user2 from 'src/assets/images/profile/user-2.jpg';
import user3 from 'src/assets/images/profile/user-3.jpg';
import user8 from 'src/assets/images/profile/user-8.jpg';

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
import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Badge } from 'src/components/ui/badge';

const agents = [
    { id: 1, name: 'Liam', photo: user1 },
    { id: 2, name: 'Steve', photo: user2 },
    { id: 3, name: 'Jack', photo: user3 },
    { id: 4, name: 'John', photo: user8 }
];

const statuses = ['Open', 'Closed', 'Pending'];

const EditTicketForm = () => {
    const { tickets, editTicket, loading } = useContext(TicketContext);
    const { id } = useParams();

    const [ticketDate, setTicketDate] = useState(new Date().toISOString().split('T')[0]);
    const [ticketTitle, setTicketTitle] = useState('');
    const [ticketDescription, setTicketDescription] = useState('');
    const [ticketStatus, setTicketStatus] = useState('Open');
    const [selectedAgent, setSelectedAgent] = useState(agents[0]);
    const [agentPhoto, setAgentPhoto] = useState(agents[0].photo);
    const [isFound, setIsFound] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && tickets.length > 0) {
            const existingTicket = tickets.find(t => t.Id === parseInt(id));
            if (existingTicket) {
                setTicketTitle(existingTicket.ticketTitle);
                setTicketDescription(existingTicket.ticketDescription);
                setTicketStatus(existingTicket.Status);

                // Find matching agent
                const matchedAgent = agents.find(a => a.name === existingTicket.AgentName) || agents[0];
                setSelectedAgent(matchedAgent);
                setAgentPhoto(existingTicket.thumb || matchedAgent.photo);

                if (existingTicket.Date) {
                    try {
                        const dateStr = new Date(existingTicket.Date).toISOString().split('T')[0];
                        setTicketDate(dateStr);
                    } catch (e) { /* ignore */ }
                }
            } else {
                setIsFound(false);
            }
        }
    }, [id, tickets, loading]);

    const handleSubmit = () => {
        if (!ticketTitle || !ticketDescription) {
            alert('Please fill out all fields.');
            return;
        }

        const updatedTicket = {
            Id: parseInt(id),
            ticketTitle,
            ticketDescription,
            Status: ticketStatus,
            Label: ticketStatus === 'Closed' ? 'error' : ticketStatus === 'Pending' ? 'warning' : 'primary',
            thumb: agentPhoto,
            AgentName: selectedAgent.name,
            Date: new Date(ticketDate),
            deleted: false
        };

        editTicket(updatedTicket);
        navigate('/super/apps/tickets');
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
                    <h2 className="text-xl font-semibold mb-2">Ticket Not Found</h2>
                    <Button onClick={() => navigate('/super/apps/tickets')}>Back to Tickets</Button>
                </div>
            </CardBox>
        );
    }

    const parsedDate = isValid(new Date(ticketDate)) ? new Date(ticketDate) : new Date();
    const formattedOrderDate = format(parsedDate, 'EEEE, MMMM dd, yyyy');

    return (
        <CardBox>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Edit Ticket #{id}</h2>
                <Badge className={`px-3 py-1 text-sm ${ticketStatus === 'Open' ? 'bg-emerald-500/15 text-emerald-500' :
                        ticketStatus === 'Closed' ? 'bg-red-500/15 text-red-500' :
                            'bg-orange-500/15 text-orange-500'
                    }`}>
                    {ticketStatus}
                </Badge>
            </div>
            <p>Date : {formattedOrderDate}</p>

            <div className="bg-background p-6 my-6 rounded-md border shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="ticketTitle">Ticket Title</Label>
                        </div>
                        <Input
                            id="ticketTitle"
                            value={ticketTitle}
                            onChange={(e) => setTicketTitle(e.target.value)}
                            placeholder="Ticket Title"
                            className="w-full form-control" />
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="ticketDescription">Ticket Description</Label>
                        </div>
                        <Input
                            id="ticketDescription"
                            value={ticketDescription}
                            onChange={(e) => setTicketDescription(e.target.value)}
                            placeholder="Ticket Description"
                            className="w-full form-control" />
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between mt-6 gap-3 pt-4 border-t">
                    <div className="flex gap-4 items-center">
                        {/* Agent Dropdown */}
                        <div>
                            <Label className="block mb-2 text-xs text-muted-foreground uppercase">Assignee</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="rounded-md w-40 justify-between">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-5 w-5">
                                                <AvatarImage src={agentPhoto} />
                                            </Avatar>
                                            <span>{selectedAgent.name}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="rounded-md w-40">
                                    <DropdownMenuLabel>Select Agent</DropdownMenuLabel>
                                    {agents.map((agent) =>
                                        <DropdownMenuItem
                                            key={agent.id}
                                            onClick={() => {
                                                setSelectedAgent(agent);
                                                setAgentPhoto(agent.photo);
                                            }}>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={agent.photo} />
                                                    <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{agent.name}</span>
                                            </div>
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Status Dropdown */}
                        <div>
                            <Label className="block mb-2 text-xs text-muted-foreground uppercase">Status</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="rounded-md w-32 justify-between">
                                        {ticketStatus}
                                        <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="rounded-md w-32">
                                    <DropdownMenuLabel>Set Status</DropdownMenuLabel>
                                    {statuses.map((s) =>
                                        <DropdownMenuItem
                                            key={s}
                                            onClick={() => {
                                                setTicketStatus(s);
                                            }}>
                                            {s}
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 mt-4 sm:mt-0 items-end">
                        <Button
                            className="rounded-md bg-primary text-white hover:bg-primary/90 min-w-24"
                            onClick={handleSubmit}>
                            Save Changes
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-md"
                            onClick={() => navigate('/super/apps/tickets')}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </CardBox>
    );
};

export default EditTicketForm;
