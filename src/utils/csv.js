import Papa from 'papaparse';

export function exportLeadsToCSV(leads, filename) {
  if (!leads || !leads.length) return;

  const data = leads.map(lead => ({
    'Business Name': lead.businessName || '',
    'Category': lead.category || '',
    'Phone': lead.phone || '',
    'Website': lead.website || '',
    'Email': lead.email || '',
    'Address': lead.address || '',
    'Zip Code': lead.zipCode || '',
    'Niche': lead.niche || '',
    'Keyword': lead.keyword || '',
    'City': lead.city || '',
    'State': lead.state || '',
    'Country': lead.country || ''
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  
  const defaultFilename = `leadgen-export-${new Date().getTime()}.csv`;
  const exportFilename = filename || defaultFilename;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', exportFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
