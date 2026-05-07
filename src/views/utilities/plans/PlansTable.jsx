'use client';

import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender
} from
  '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from
  'src/components/ui/table';

import { Input } from 'src/components/ui/input';
import { Button } from 'src/components/ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from
  'src/components/ui/select';
import { Label } from 'src/components/ui/label';
import CardBox from 'src/components/shared/CardBox';
import { toTitleCase } from 'src/components/utilities/table/DataTable';
import { useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from 'src/components/ui/dialog'; export const PlansTable = ({
  data = [],
  onDeletePlan
}) => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const renderValue = (val) => {
    if (val === null || val === undefined) return '-';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  const paginationOptions = useMemo(() => {
    return [5, 10, 20, 50];
  }, []);

  const columns = useMemo(() => {
    if (!data.length) return [];

    const keys = Object.keys(data[0]).filter((key) => {
      const val = data[0][key];
      return !Array.isArray(val);
    });

    const baseColumns = keys.map((col) => ({
      accessorKey: col,
      header: toTitleCase(col.replace(/([A-Z_])/g, ' $1').trim()),
      cell: (info) => {
        const value = info.getValue();

        if (col.toLowerCase().includes('id')) {
          return (
            <span className="text-gray-900 dark:text-white font-medium max-w-50 truncate whitespace-nowrap">
              {renderValue(value)}
            </span>);
        }

        if (col.toLowerCase().includes('name')) {
          return (
            <span className="text-gray-900 dark:text-white font-semibold max-w-50 truncate whitespace-nowrap">
              {renderValue(value)}
            </span>);
        }

        if (typeof value === 'boolean') {
          return (
            <span className={`font-medium px-2 py-1 rounded text-xs ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {value ? 'Active' : 'Inactive'}
            </span>
          );
        }

        return (
          <span className="text-gray-900 dark:text-white font-medium max-w-50 truncate block">
            {renderValue(value)}
          </span>);

      },
      enableSorting: true,
      enableGlobalFilter: true
    }));

    const actionColumn = {
      id: 'action',
      header: 'Action',
      enableSorting: false,
      cell: (info) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size={'sm'}
              variant={'lighterror'}
              className="px-4 py-2 rounded"
              title="Delete plan"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setPlanToDelete(info.row.original.id);
                setDeleteDialogOpen(true);
              }}
            >
              Delete
            </Button>
          </div>);

      }
    };

    return [...baseColumns, actionColumn];
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: paginationOptions[0] || 10 } }
  });

  const handleDownload = () => {
    if (!data.length) return;

    const headers = columns.map((col) => String(col.header));
    const rows = data.map((item) =>
      columns.map((col) => {
        const column = col;
        const accessorKey = column.accessorKey;
        const value = accessorKey ? item[accessorKey] : '';
        if (Array.isArray(value)) return `"[array]"`;
        return `"${String(value ?? '').replace(/"/g, '""')}"`;
      })
    );

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'plans-data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CardBox>
      <div>
        <div className="p-4 pt-0 flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-xl font-semibold mb-2">Manage Subscription Plans</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Input
              type="text"
              className="max-w-96 lg:min-w-96 min-w-full placeholder:text-gray-400 dark:placeholder:text-white/20"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search your relevant items..." />

            <Button
              onClick={() => navigate('/super/utilities/plans/create')}
              className="flex items-center gap-2">

              Add New Plan
            </Button>
            <Button onClick={handleDownload} className="p-2 px-4 rounded-md">
              <Icon icon="material-symbols:download-rounded" width={24} height={24} />
            </Button>
          </div>
        </div>

        {data.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No data available.</p>
        ) : (
          <>
            <div className="overflow-x-auto border rounded-md border-ld">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) =>
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) =>
                        <TableHead key={header.id} className="cursor-pointer select-none min-w-42 px-0">
                          {header.isPlaceholder ? null :
                            <Button
                              className="flex items-center gap-1 px-4 bg-transparent hover:bg-transparent text-dark dark:text-white font-semibold"
                              onClick={header.column.getToggleSortingHandler()}>

                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {
                                {
                                  asc: <ArrowUp className="w-4 h-4 inline" />,
                                  desc: <ArrowDown className="w-4 h-4 inline" />
                                }[header.column.getIsSorted()] ?? (
                                  header.column.id !== 'action' ?
                                    <ChevronsUpDown className="w-2 h-2 inline" /> :
                                    null)
                              }
                            </Button>
                          }
                        </TableHead>
                      )}
                    </TableRow>
                  )}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.length > 0 ?
                    table.getRowModel().rows.map((row) =>
                      <TableRow key={row.id} className="hover:bg-primary/10 transition-colors">
                        {row.getVisibleCells().map((cell) =>
                          <TableCell key={cell.id} className="text-gray-700 dark:text-white/70">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        )}
                      </TableRow>
                    ) :

                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center p-6 text-gray-500 dark:text-white/70 font-medium">

                        No results found.
                      </TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border dark:border-white/10">
              <div className="flex gap-2">
                <Button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  variant={'secondary'}>

                  Previous
                </Button>
                <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  Next
                </Button>
              </div>

              <div className="text-forest-black dark:text-white/90 font-medium text-base">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>

              <div className="flex items-center gap-2">
                <Label
                  htmlFor="pageSize"
                  className="mr-0 text-forest-black dark:text-white/90 text-base font-medium whitespace-nowrap min-w-32">

                  Show:
                </Label>
                <Select
                  value={String(table.getState().pagination.pageSize)}
                  onValueChange={(value) => table.setPageSize(Number(value))}>

                  <SelectTrigger className="!w-18 cursor-pointer">
                    <SelectValue placeholder="Page size" />
                  </SelectTrigger>
                  <SelectContent>
                    {paginationOptions.map((size) =>
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <span className="text-forest-black dark:text-white/90 font-medium text-base">entries</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Subscription Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subscription plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => setPlanToDelete(null)}>Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (planToDelete && onDeletePlan) {
                  onDeletePlan(planToDelete);
                }
                setDeleteDialogOpen(false);
                setPlanToDelete(null);
              }}
            >
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardBox>);

};