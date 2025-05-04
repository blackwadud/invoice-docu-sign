import jsPDF from 'jspdf';

/** Returns a Blob ready to upload to Firebase Storage */
export const generateInvoicePDF = (opts: {
  from: string;
  to: string;
  description: string;
}): Blob => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text('Invoice', 20, 20);

  doc.setFontSize(12);
  doc.text(`From: ${opts.from}`, 20, 40);
  doc.text(`To:   ${opts.to}`, 20, 50);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);

  doc.text('Description:', 20, 80);
  doc.text(opts.description, 20, 90, { maxWidth: 170 });

  return doc.output('blob');
};
