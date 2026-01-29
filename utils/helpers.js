export const exportToCSV = (packs) => {
  const headers = ['Entity', 'Entity Prod', 'Platform', 'Team', 'Location', 'Pack', 'Server', 'Status'];
  const rows = packs.map(p => [
    p.entity,
    p.entityProd,
    p.platform,
    p.team,
    p.localExternal,
    p.pack,
    p.server,
    p.status
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `ecmw_packs_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
