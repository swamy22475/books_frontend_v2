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
import { Badge } from 'src/components/ui/badge';
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
import { ArrowUp, ArrowDown, ChevronsUpDown, Eye, Plus, Pencil, Trash2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from
  'src/components/ui/dialog';





export const PaymentHistoryTable = ({
  data = [],
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    schoolName: '',
    plan: '',
    amount: '',
    paymentId: '',
    date: '',
    status: 'Pending'
  });

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setViewDialogOpen(true);
  };

  const handleAddTransaction = () => {
    // Reset form
    setIsEditing(false);
    setNewTransaction({
      schoolName: '',
      plan: '',
      amount: '',
      paymentId: '',
      date: '',
      status: 'Pending'
    });
    setAddDialogOpen(true);
  };

  const handleEditClick = (transaction) => {
    setIsEditing(true);
    setNewTransaction({ ...transaction });
    setAddDialogOpen(true);
  };

  const renderValue = (val) => {
    if (val === null || val === undefined) return '-';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  const paginationOptions = useMemo(() => {
    const sizes = [5, 10, 20, 50];
    // Always include at least one option so the dropdown isn't empty
    return sizes.filter(size => size <= Math.max(5, data.length));
  }, [data.length]);

  const columns = useMemo(() => {
    if (!data.length) return [];

    const keys = Object.keys(data[0]).filter((key) => {
      const val = data[0][key];
      return !Array.isArray(val);
    });

    const baseColumns = keys.map((col) => ({
      accessorKey: col,
      header: toTitleCase(col.replace(/([A-Z])/g, ' $1').trim()),
      cell: (info) => {
        const value = info.getValue();

        // Render status as badge
        if (col.toLowerCase() === 'status') {
          return (
            <Badge className="px-3 py-1 rounded bg-warning text-warning-foreground hover:bg-warning/90">
              {renderValue(value)}
            </Badge>);

        }

        // Render order ID
        if (col.toLowerCase().includes('orderid')) {
          return (
            <span className="text-gray-900 dark:text-white font-medium">
              {renderValue(value)}
            </span>);

        }

        // Render school name
        if (col.toLowerCase().includes('schoolname')) {
          return (
            <span className="text-gray-900 dark:text-white font-semibold">
              {renderValue(value)}
            </span>);

        }

        return (
          <span className="text-gray-900 dark:text-white font-medium">
            {renderValue(value)}
          </span>);

      },
      enableSorting: true,
      enableGlobalFilter: true
    }));

    // Add Actions column with eye icon
    const actionsColumn = {
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        return (
          <div className="flex gap-1 justify-center items-center h-full">
            <button
              onClick={() => handleViewTransaction(info.row.original)}
              className="p-1.5 rounded-md hover:bg-primary/10 transition-colors cursor-pointer"
              title="View Transaction"
            >
              <Eye className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(info.row.original);
              }}
              className="p-1.5 rounded-md hover:bg-primary/10 transition-colors cursor-pointer"
              title="Edit Transaction"
            >
              <Pencil className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTransactionToDelete(info.row.original.orderId || info.row.original.id);
                setDeleteDialogOpen(true);
              }}
              className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors cursor-pointer"
              title="Delete Transaction"
            >
              <Trash2 className="w-5 h-5 text-destructive" />
            </button>
          </div>
        );
      },
      enableSorting: false,
      enableGlobalFilter: false
    };

    return [...baseColumns, actionsColumn];
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
    link.setAttribute('download', 'payment-history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CardBox>
      <div>
        <div className="p-4 pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-xl font-semibold">All Subscription Payments</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              type="text"
              className="w-full sm:w-80 placeholder:text-gray-400 dark:placeholder:text-white/20"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search your relevant items..." />

            <Button onClick={handleDownload} className="p-2 px-4 rounded-md shrink-0">
              <Icon icon="material-symbols:download-rounded" width={24} height={24} />
            </Button>
            <Button onClick={handleAddTransaction} className="p-2 px-4 rounded-md shrink-0 flex items-center gap-1">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Transaction</span>
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
                        <TableHead key={header.id} className="cursor-pointer select-none px-0">
                          {header.isPlaceholder ? null :
                            <Button
                              className="flex items-center gap-1 px-4 bg-transparent hover:bg-transparent text-dark dark:text-white font-semibold"
                              onClick={header.column.getToggleSortingHandler()}>

                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {
                                {
                                  asc: <ArrowUp className="w-4 h-4 inline" />,
                                  desc: <ArrowDown className="w-4 h-4 inline" />
                                }[header.column.getIsSorted()] ??
                                <ChevronsUpDown className="w-2 h-2 inline" />
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

      {/* View Transaction Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Full details of the selected transaction.</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wide">Order ID</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{selectedTransaction.orderId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wide">Status</p>
                  <div className="mt-0.5">
                    <Badge className="px-3 py-1 rounded bg-warning text-warning-foreground">
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wide">School Name</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{selectedTransaction.schoolName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wide">Plan</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{selectedTransaction.plan}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wide">Amount</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">{selectedTransaction.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wide">Payment ID</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{selectedTransaction.paymentId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wide">Date</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{selectedTransaction.date}</p>
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

      {/* Add Transaction Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
            <DialogDescription>{isEditing ? "Update the details of the transaction." : "Fill in the details to add a new transaction."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label htmlFor="schoolName" className="text-sm font-medium mb-1.5">School Name</Label>
              <Input
                id="schoolName"
                type="text"
                placeholder="Enter school name"
                value={newTransaction.schoolName}
                onChange={(e) => setNewTransaction({ ...newTransaction, schoolName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="plan" className="text-sm font-medium mb-1.5">Plan</Label>
                <Select
                  value={newTransaction.plan}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, plan: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trial Plan">Trial Plan</SelectItem>
                    <SelectItem value="Growth Plan">Growth Plan</SelectItem>
                    <SelectItem value="Enterprise Plan">Enterprise Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount" className="text-sm font-medium mb-1.5">Amount</Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="₹0.00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="paymentId" className="text-sm font-medium mb-1.5">Payment ID</Label>
                <Input
                  id="paymentId"
                  type="text"
                  placeholder="Enter payment ID"
                  value={newTransaction.paymentId}
                  onChange={(e) => setNewTransaction({ ...newTransaction, paymentId: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium mb-1.5">Status</Label>
                <Select
                  value={newTransaction.status}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, status: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="date" className="text-sm font-medium mb-1.5">Date</Label>
              <Input
                id="date"
                type="text"
                placeholder="e.g. 14 Oct, 2025 12:27 PM"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => {
              if (isEditing && onEditTransaction) {
                onEditTransaction(newTransaction);
              } else if (!isEditing && onAddTransaction) {
                onAddTransaction(newTransaction);
              }
              setAddDialogOpen(false);
            }}>{isEditing ? "Update Transaction" : "Save Transaction"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => setTransactionToDelete(null)}>Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (transactionToDelete && onDeleteTransaction) {
                  onDeleteTransaction(transactionToDelete);
                }
                setDeleteDialogOpen(false);
                setTransactionToDelete(null);
              }}
            >
              Delete Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardBox>);

};