import React, { useState } from 'react';
import { FaFilePdf, FaSpinner } from 'react-icons/fa';
import jsPDF from 'jspdf';
import './AdminPDFGenerator.css';

const AdminOrderPDFGenerator = ({ orders, filters }) => {
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
      doc.text('ORDER MANAGEMENT SYSTEM', margin, 15);
      doc.setFontSize(12);
      doc.text('Order Report', pageWidth - margin, 15, { align: 'right' });

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
      doc.text('ORDER SUMMARY', margin, 40);

      doc.setDrawColor(220, 220, 220);
      doc.setFillColor(247, 250, 252);
      doc.roundedRect(margin, 45, 80, 30, 3, 3, 'FD');

      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);

      doc.text(`Status: ${filters?.status === 'All' ? 'All Statuses' : filters?.status || 'All'}`, margin + 5, 52);
      doc.text(`Search Term: ${filters?.search || 'None'}`, margin + 5, 58);
      doc.text(`Total Orders: ${orders.length}`, margin + 5, 64);

      // Status stats
      const countByStatus = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      doc.roundedRect(pageWidth - margin - 80, 45, 80, 30, 3, 3, 'FD');
      doc.setFont("helvetica", "bold");
      doc.text('Orders by Status:', pageWidth - margin - 75, 52);
      doc.setFont("helvetica", "normal");
      let statsY = 58;
      Object.entries(countByStatus).forEach(([status, count]) => {
        let statusColor;
        switch (status) {
          case 'Approved': statusColor = [46, 204, 113]; break;
          case 'Rejected': statusColor = [231, 76, 60]; break;
          case 'Pending': statusColor = [243, 156, 18]; break;
          case 'Cancelled': statusColor = [149, 165, 166]; break;
          case 'Completed': statusColor = [52, 152, 219]; break;
          default: statusColor = [80, 80, 80];
        }
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.text(`${status}: ${count}`, pageWidth - margin - 75, statsY);
        statsY += 6;
      });

      // Table header
      const startY = 85;
      const columns = ["Order ID", "User", "Status", "Total Items", "Total Price", "Placed On"];
      const columnWidths = [35, 35, 25, 25, 30, 40];

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

      orders.forEach((order, rowIndex) => {
        if (currentY > pageHeight - margin) {
          doc.addPage();
          doc.setFillColor(41, 128, 185);
          doc.rect(0, 0, pageWidth, 15, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text('HORDER MANAGEMENT SYSTEM - Order Report (Continued)', margin, 10);

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

        doc.setTextColor(100, 100, 100);
        doc.text(order.orderId ? order.orderId : order._id.slice(-8), currentX, currentY + lineHeight);
        currentX += columnWidths[0];

        doc.setTextColor(44, 62, 80);
        doc.text(order.username || 'N/A', currentX, currentY + lineHeight);
        currentX += columnWidths[1];

        let statusColor;
        switch (order.status) {
          case 'Approved': statusColor = [46, 204, 113]; break;
          case 'Rejected': statusColor = [231, 76, 60]; break;
          case 'Pending': statusColor = [243, 156, 18]; break;
          case 'Cancelled': statusColor = [149, 165, 166]; break;
          case 'Completed': statusColor = [52, 152, 219]; break;
          default: statusColor = [60, 60, 60];
        }
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.text(order.status, currentX, currentY + lineHeight);
        currentX += columnWidths[2];

        doc.setTextColor(60, 60, 60);
        doc.text(String(order.totalItems), currentX, currentY + lineHeight);
        currentX += columnWidths[3];

        doc.text('Rs. ' + String(order.totalPrice), currentX, currentY + lineHeight);
        currentX += columnWidths[4];

        const placedOn = order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A';
        doc.text(placedOn, currentX, currentY + lineHeight);

        currentY += lineHeight + 3;
      });

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.rect(margin - 5, margin - 5, pageWidth - 2 * (margin - 5), pageHeight - 2 * (margin - 5), 'S');

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
        doc.text('Order Management System © 2025', margin, pageHeight - 5);
        const reportId = `Report #${new Date().getTime().toString().slice(-8)}`;
        doc.text(reportId, pageWidth - margin, pageHeight - 5, { align: 'right' });
      }

      const dateStr = new Date().toISOString().slice(0,10);
      const fileName = `order-report-${dateStr}-${orders.length}-orders.pdf`;
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
      disabled={generatingPDF || orders.length === 0}
    >
      {generatingPDF ? (
        <><FaSpinner className="admin-spinner-icon" /> Generating PDF...</>
      ) : (
        <><FaFilePdf /> Download Order Report</>
      )}
    </button>
  );
};

export default AdminOrderPDFGenerator;