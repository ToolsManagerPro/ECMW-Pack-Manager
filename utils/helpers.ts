import { Pack } from '../types.ts';

export const generateId = (): string => Math.random().toString(36).substring(2, 11);

export const getStatusBadgeClass = (status: string): string => {
    const s = (status || '').toLowerCase();
    if (s.includes('repo') || s.includes('active')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s.includes('down') || s.includes('hold')) return 'bg-rose-50 text-rose-700 border-rose-100';
    return 'bg-amber-50 text-amber-700 border-amber-100';
};

export const exportToCSV = (packs: Pack[]) => {
    const headers = ['Entity', 'Pack Name', 'Server', 'Status', 'Profiles'];
    const rows = packs.map(p => [p.entity, p.pack, p.server, p.status, p.countProfiles]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `fleet_export.csv`;
    link.click();
};
