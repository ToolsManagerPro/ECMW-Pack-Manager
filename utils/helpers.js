export const exportToCSV = (data, filename = 'ecmw-packs-export.csv') => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const escaped = String(row[header]).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getStatusBadgeClass = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes('repot')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (s.includes('verif')) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (s.includes('repo ips')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (s.includes('down')) return 'bg-rose-100 text-rose-700 border-rose-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
};
