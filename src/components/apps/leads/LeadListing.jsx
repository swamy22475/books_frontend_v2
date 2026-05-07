'use client';

import { useContext } from 'react';
import { format } from 'date-fns';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
import { LeadContext } from 'src/context/lead-context';

import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from
  'src/components/ui/table';
import { Badge } from 'src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from
  'src/components/ui/tooltip';

const LeadListing = () => {
  const { leads, deleteLead, searchLeads, leadSearch, filter } =
    useContext(LeadContext);

  const navigate = useNavigate();

  const getVisibleLeads = (leads, filter, leadSearch) => {
    const searchLower = leadSearch.toLowerCase();
    const baseFilter = (l) =>
      !l.deleted && (
        l.name.toLowerCase().includes(searchLower) ||
        l.email.toLowerCase().includes(searchLower) ||
        l.company.toLowerCase().includes(searchLower));

    switch (filter) {
      case 'total_leads':
        return leads.filter(baseFilter);
      case 'New':
        return leads.filter((l) => baseFilter(l) && l.status === 'New');
      case 'Contacted':
        return leads.filter((l) => baseFilter(l) && l.status === 'Contacted');
      case 'Qualified':
        return leads.filter((l) => baseFilter(l) && l.status === 'Qualified');
      case 'Converted':
        return leads.filter((l) => baseFilter(l) && l.status === 'Converted');
      case 'Lost':
        return leads.filter((l) => baseFilter(l) && l.status === 'Lost');
      default:
        throw new Error(`Unknown filter: ${filter}`);
    }
  };

  const visibleLeads = getVisibleLeads(leads, filter, leadSearch);

  const statusBadge = (lead) => {
    switch (lead.status) {
      case 'New':
        return 'bg-lightinfo text-info dark:bg-lightinfo dark:text-info';
      case 'Contacted':
        return 'bg-lightwarning text-warning dark:bg-lightwarning dark:text-warning';
      case 'Qualified':
        return 'bg-lightsuccess text-success dark:bg-lightsuccess dark:text-success';
      case 'Converted':
        return 'bg-lightsecondary text-secondary dark:bg-lightsecondary dark:text-secondary';
      case 'Lost':
        return 'bg-lighterror text-error dark:bg-lighterror dark:text-error';
      default:
        return 'bg-lightprimary text-primary dark:bg-lightprimary dark:text-primary';
    }
  };

  const sourceBadge = (source) => {
    switch (source) {
      case 'Website':
        return 'bg-lightprimary text-primary dark:bg-lightprimary dark:text-primary';
      case 'Referral':
        return 'bg-lightsuccess text-success dark:bg-lightsuccess dark:text-success';
      case 'Social Media':
        return 'bg-lightinfo text-info dark:bg-lightinfo dark:text-info';
      case 'Email Campaign':
        return 'bg-lightwarning text-warning dark:bg-lightwarning dark:text-warning';
      case 'Cold Call':
        return 'bg-lightsecondary text-secondary dark:bg-lightsecondary dark:text-secondary';
      default:
        return 'bg-lightprimary text-primary dark:bg-lightprimary dark:text-primary';
    }
  };

  return (
    <div className="my-6">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <Button
          onClick={() => navigate('/super/apps/leads/create')}
          className="rounded-md whitespace-nowrap">

          <Icon icon="tabler:plus" height={18} className="mr-1" />
          Add Lead
        </Button>

        <div className="relative sm:max-w-60 w-full">
          <Icon
            icon="tabler:search"
            height={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="text"
            className="pl-10"
            onChange={(e) => searchLeads(e.target.value)}
            placeholder="Search by name, email, or company..." />

        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-base font-semibold py-3 whitespace-nowrap">Id</TableHead>
              <TableHead className="text-base font-semibold py-3 whitespace-nowrap">
                Name
              </TableHead>
              <TableHead className="text-base font-semibold py-3 whitespace-nowrap">
                Contact
              </TableHead>
              <TableHead className="text-base font-semibold py-3 whitespace-nowrap">
                Company
              </TableHead>
              <TableHead className="text-base font-semibold py-3 whitespace-nowrap">
                Source
              </TableHead>
              <TableHead className="text-base font-semibold py-3 whitespace-nowrap">
                Status
              </TableHead>
              <TableHead className="text-base font-semibold py-3 whitespace-nowrap">
                Assigned
              </TableHead>
              <TableHead className="text-base font-semibold py-3 whitespace-nowrap">Date</TableHead>
              <TableHead className="text-base font-semibold py-3 text-end">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleLeads.map((lead) =>
              <TableRow key={lead.Id}>
                <TableCell className="whitespace-nowrap">{lead.Id}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <h6 className="text-base">{lead.name}</h6>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{lead.email}</p>
                  <p className="text-xs text-muted-foreground">{lead.phone}</p>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <p className="text-sm">{lead.company}</p>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge className={`${sourceBadge(lead.source)} rounded-md`}>
                    {lead.source}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge className={`${statusBadge(lead)} rounded-md`}>{lead.status}</Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <p className="text-sm">{lead.assignedTo}</p>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(lead.createdDate), 'E, MMM d')}
                  </p>
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex justify-end gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="btn-circle"
                            onClick={() => navigate('/super/apps/leads/edit/' + lead.Id)}>
                            <Icon icon="tabler:edit" height="18" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Lead</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="btn-circle"
                            onClick={() => deleteLead(lead.Id)}>

                            <Icon icon="tabler:trash" height="18" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Lead</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>);

};

export default LeadListing;