import React, { useState } from 'react';
import { Modal, Button } from './ui';
import { Download, FileSpreadsheet, FileCode, Printer, CheckCircle } from 'lucide-react';

export const ExportReportModal = ({ isOpen, onClose, data = [], title = "Civic Issues Report" }) => {
  const [downloaded, setDownloaded] = useState(false);

  const exportCSV = () => {
    if (!data.length) return;
    const headers = ['Issue ID', 'Title', 'Category', 'Priority', 'Status', 'Location', 'Assigned To', 'Date Reported'];
    const rows = data.map(item => [
      item.issueId || item.id,
      `"${(item.title || '').replace(/"/g, '""')}"`,
      item.category,
      item.priority,
      item.status,
      `"${(item.location || '').replace(/"/g, '""')}"`,
      item.assignedToName || item.assignedTo?.name || 'Unassigned',
      new Date(item.createdAt || Date.now()).toLocaleDateString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `civic-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
  };

  const exportJSON = () => {
    if (!data.length) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `civic-intelligence-export-${Date.now()}.json`;
    link.click();
    setDownloaded(true);
  };

  const printSummary = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Intelligence Report"
      subtitle="Generate audit-ready datasets and print summaries for executive review."
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 font-sans">
        {downloaded && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Report successfully downloaded to your device!
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-800 transition-all text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-xl">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Export as CSV / Excel</h4>
                <p className="text-xs text-slate-500">Formatted spreadsheet containing all {data.length} records</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={exportJSON}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-800 transition-all text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 rounded-xl">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Export as Raw JSON</h4>
                <p className="text-xs text-slate-500">Full API schema with geolocation & timestamps</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={printSummary}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-800 transition-all text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 rounded-xl">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Print Summary / PDF</h4>
                <p className="text-xs text-slate-500">Formatted printable view for offline review</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
