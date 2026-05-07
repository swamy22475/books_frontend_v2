import React from 'react';
import { Input } from 'src/components/ui/input';
import { Button } from 'src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import { Search, Download } from 'lucide-react';

const NotificationTableToolbar = ({
  searchQuery,
  onSearchChange,
  selectedRecipient,
  onRecipientChange,
  onExport,
  onPrint,
}) => {
  const handleExport = (format) => {
    onExport(format);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-3">
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter by Recipient */}
        <div className="md:col-span-1">
          <Select value={selectedRecipient} onValueChange={onRecipientChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Recipients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Recipients</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="guardian">Guardian</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export Actions */}
        <div className="flex gap-2 md:col-span-1 md:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('copy')}>
                📋 Copy to Clipboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                📄 CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                📊 Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                🔴 PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onPrint}>
                🖨️ Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default NotificationTableToolbar;
