import React, { useState } from 'react';
import { FaFilePdf, FaSpinner } from 'react-icons/fa';
import jsPDF from 'jspdf';
import '../../HelpDesk/admin/AdminPDFGenerator.css';

const AdminUsersPDFGenerator = ({ users }) => {
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    setGeneratingPDF(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const lineHeight = 7;

      // Header
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, pageWidth, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text('HELPDESK MANAGEMENT SYSTEM', margin, 15);
      doc.setFontSize(12);
      doc.text('Users Report', pageWidth - margin, 15, { align: 'right' });

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 25, { align: 'right' });

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(margin, 32, pageWidth - margin, 32);

      // Summary
      doc.setTextColor(41, 128, 185);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text('REPORT SUMMARY', margin, 40);

      doc.setDrawColor(220, 220, 220);
      doc.setFillColor(247, 250, 252);
      doc.roundedRect(margin, 45, 80, 20, 3, 3, 'FD');

      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.text(`Total Users: ${users.length}`, margin + 5, 52);

      // Table header
      const startY = 75;
      const columns = ["Name", "Email", "Uni ID", "Role", "Contact", "Faculty"];
      const columnWidths = [40, 60, 30, 20, 30, 40];

      doc.setFillColor(52, 73, 94);
      doc.rect(margin, startY, pageWidth - margin * 2, lineHeight + 4, 'F');

      doc.setDrawColor(70, 90, 110);
      let headerX = margin;
      columnWidths.forEach(width => {
        headerX += width;
        if (headerX < pageWidth - margin) {
          doc.line(headerX, startY, headerX, startY + lineHeight + 4);
        }
      });

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);

      let currentX = margin + 3;
      columns.forEach((column, index) => {
        doc.text(column, currentX, startY + lineHeight + 1);
        currentX += columnWidths[index];
      });

      // Table rows
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      let currentY = startY + lineHeight + 4;

      users.forEach((user, rowIndex) => {
        if (currentY > pageHeight - margin) {
          doc.addPage();
          doc.setFillColor(41, 128, 185);
          doc.rect(0, 0, pageWidth, 15, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text('HELPDESK MANAGEMENT SYSTEM - Users Report (Continued)', margin, 10);

          currentY = margin + 10;

          doc.setFillColor(52, 73, 94);
          doc.rect(margin, currentY, pageWidth - margin * 2, lineHeight + 4, 'F');
          doc.setDrawColor(70, 90, 110);
          headerX = margin;
          columnWidths.forEach(width => {
            headerX += width;
            if (headerX < pageWidth - margin) {
              doc.line(headerX, currentY, headerX, currentY + lineHeight + 4);
            }
          });

          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);

          currentX = margin + 3;
          columns.forEach((column, index) => {
            doc.text(column, currentX, currentY + lineHeight + 1);
            currentX += columnWidths[index];
          });

          currentY = currentY + lineHeight + 4;
        }

        if (rowIndex % 2 === 0) {
          doc.setFillColor(245, 247, 250);
          doc.rect(margin, currentY, pageWidth - margin * 2, lineHeight + 3, 'F');
        }

        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.1);
        doc.line(margin, currentY + lineHeight + 3, pageWidth - margin, currentY + lineHeight + 3);

        currentX = margin + 3;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        doc.setTextColor(44, 62, 80);
        doc.text(user.full_name || 'N/A', currentX, currentY + lineHeight);
        currentX += columnWidths[0];

        doc.setTextColor(60, 60, 60);
        doc.text(user.email || 'N/A', currentX, currentY + lineHeight);
        currentX += columnWidths[1];

        doc.text(user.uni_id || 'N/A', currentX, currentY + lineHeight);
        currentX += columnWidths[2];

        doc.text(user.role || 'N/A', currentX, currentY + lineHeight);
        currentX += columnWidths[3];

        doc.text(user.contact_no || 'N/A', currentX, currentY + lineHeight);
        currentX += columnWidths[4];

        doc.text(user.faculty || 'N/A', currentX, currentY + lineHeight);

        currentY += lineHeight + 3;
      });

      // Footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(247, 250, 252);
        doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
        doc.setDrawColor(220, 220, 220);
        doc.line(0, pageHeight - 15, pageWidth, pageHeight - 15);
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
        doc.text('Helpdesk Management System © 2025', margin, pageHeight - 5);
        const reportId = `Report #${new Date().getTime().toString().slice(-8)}`;
        doc.text(reportId, pageWidth - margin, pageHeight - 5, { align: 'right' });
      }

      const dateStr = new Date().toISOString().slice(0,10);
      const fileName = `helpdesk-users-report-${dateStr}-${users.length}-users.pdf`;
      doc.save(fileName);

    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF report. Error: " + err.message);
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <button
      className="admin-pdf-btn"
      onClick={generatePDF}
      disabled={generatingPDF || users.length === 0}
    >
      {generatingPDF ? (
        <><FaSpinner className="admin-spinner-icon" /> Generating PDF...</>
      ) : (
        <><FaFilePdf /> Export Users to PDF</>
      )}
    </button>
  );
};

export default AdminUsersPDFGenerator;