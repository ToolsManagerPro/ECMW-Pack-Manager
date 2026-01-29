
import { Pack } from '../types';

/**
 * Export array of objects to CSV file
 */
export const exportToCSV = (data: Pack[], filename: string = 'ecmw-packs-export.csv') => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]) as (keyof Pack)[];
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = String(row[header]).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate a random short unique ID
 */
export const generateId = () => Math.random().toString(36).substr(2, 9);

/**
 * Get color class for status badges
 */
export const getStatusBadgeClass = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('repot')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (s.includes('verif')) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (s.includes('repo ips')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (s.includes('add')) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
  if (s.includes('empty')) return 'bg-slate-100 text-slate-700 border-slate-200';
  if (s.includes('down')) return 'bg-rose-100 text-rose-700 border-rose-200';
  if (s.includes('hold')) return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
};
