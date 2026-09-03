import * as XLSX from 'xlsx';

/**
 * Build a filename based on job metadata: {niche}_{keyword}_{country}.xlsx
 * Sanitizes characters that aren't safe for filenames.
 */
function buildFilename(formData, extension = 'xlsx') {
  const sanitize = (str) =>
    (str || 'unknown')
      .toString()
      .trim()
      .replace(/[^a-zA-Z0-9 _-]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase();

  const niche = sanitize(formData?.niche);
  const keyword = sanitize(formData?.keyword);
  const country = sanitize(formData?.country);

  return `${niche}_${keyword}_${country}.${extension}`;
}

/**
 * Export leads array as an XLSX file.
 * Filename is auto-generated from formData: {niche}_{keyword}_{country}.xlsx
 */
export function exportLeadsToXLSX(leads, formData) {
  if (!leads || !leads.length) return false;

  try {
    const data = leads.map((lead) => ({
      'Business Name': lead.businessName || '',
      'Category': lead.category || '',
      'Phone': lead.phone || '',
      'Website': lead.website || '',
      'Email': lead.email || '',
      'Address': lead.address || '',
      'Zip Code': lead.zipCode || '',
      'Niche': lead.niche || formData?.niche || '',
      'Keyword': lead.keyword || formData?.keyword || '',
      'City': lead.city || formData?.city || '',
      'State': lead.state || formData?.state || '',
      'Country': lead.country || formData?.country || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Auto-size columns based on header width
    const colWidths = Object.keys(data[0]).map((key) => ({
      wch: Math.max(key.length + 2, 18),
    }));
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

    const filename = buildFilename(formData, 'xlsx');
    
    // Write using buffer + Blob to support browser environments smoothly
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Error generating XLSX file:', err);
    throw err;
  }
}

export { buildFilename };
