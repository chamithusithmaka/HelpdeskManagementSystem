import React, { useState } from 'react';
import { FaFilePdf, FaSpinner } from 'react-icons/fa';
import jsPDF from 'jspdf';
import './AdminPDFGenerator.css';

const AdminPDFGenerator = ({ tickets, filters }) => {
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    setGeneratingPDF(true);
    
    try {
      // Small delay to allow UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Initialize document
      const doc = new jsPDF({
        orientation: 'landscape',  // Use landscape for more space
        unit: 'mm',
        format: 'a4'
      });
      
      // Get page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const lineHeight = 7;
      
      // Set company logo/header (using a blue rectangle as a placeholder)
      doc.setFillColor(41, 128, 185); // A professional blue color
      doc.rect(0, 0, pageWidth, 25, 'F');
      
      // Add report title
      doc.setTextColor(255, 255, 255); // White text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text('HELPDESK MANAGEMENT SYSTEM', margin, 15);
      
      doc.setFontSize(12);
      doc.text('Support Tickets Report', pageWidth - margin, 15, { align: 'right' });
      
      // Reset text color and add date
      doc.setTextColor(100, 100, 100); // Dark gray
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 25, { align: 'right' });
      
      // Add a divider
      doc.setDrawColor(220, 220, 220); // Light gray
      doc.setLineWidth(0.5);
      doc.line(margin, 32, pageWidth - margin, 32);
      
      // Report summary section
      doc.setTextColor(41, 128, 185); // Blue
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text('REPORT SUMMARY', margin, 40);
      
      // Report filters in a boxed area
      doc.setDrawColor(220, 220, 220);
      doc.setFillColor(247, 250, 252); // Very light blue-gray
      doc.roundedRect(margin, 45, 80, 30, 3, 3, 'FD');
      
      // Filter information
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      
      doc.text(`Status: ${filters.status === 'all' ? 'All Statuses' : filters.status}`, margin + 5, 52);
      doc.text(`Priority: ${filters.priority === 'all' ? 'All Priorities' : filters.priority}`, margin + 5, 58);
      doc.text(`Search Term: ${filters.search || 'None'}`, margin + 5, 64);
      doc.text(`Total Tickets: ${tickets.length}`, margin + 5, 70);
      
      // Add ticket statistics on the right side
      const countByStatus = tickets.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      }, {});
      
      const countByPriority = tickets.reduce((acc, ticket) => {
        acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
        return acc;
      }, {});
      
      // Draw stats box
      doc.roundedRect(pageWidth - margin - 80, 45, 80, 30, 3, 3, 'FD');
      
      // Status stats
      doc.setFont("helvetica", "bold");
      doc.text('Tickets by Status:', pageWidth - margin - 75, 52);
      doc.setFont("helvetica", "normal");
      
      let statsY = 58;
      Object.entries(countByStatus).forEach(([status, count]) => {
        let statusColor;
        switch (status) {
          case 'Open': statusColor = [243, 156, 18]; break;
          case 'In Progress': statusColor = [52, 152, 219]; break;
          case 'Resolved': statusColor = [46, 204, 113]; break;
          case 'Closed': statusColor = [149, 165, 166]; break;
          default: statusColor = [80, 80, 80];
        }
        
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.text(`${status}: ${count}`, pageWidth - margin - 75, statsY);
        statsY += 6;
      });
      
      // Table header
      const startY = 85;
      const columns = ["ID", "Title", "Student ID", "Issue Type", "Status", "Priority", "Created", "Assignee"];
      
      // Calculate column widths - more space for title
      const columnWidths = [20, 80, 25, 35, 25, 25, 25, 25]; 
      
      // Draw table header
      doc.setFillColor(52, 73, 94); // Dark blue-gray header
      doc.rect(margin, startY, pageWidth - margin * 2, lineHeight + 4, 'F');
      
      // Draw column separators in header
      doc.setDrawColor(70, 90, 110);
      let headerX = margin;
      columnWidths.forEach(width => {
        headerX += width;
        if (headerX < pageWidth - margin) {
          doc.line(headerX, startY, headerX, startY + lineHeight + 4);
        }
      });
      
      doc.setTextColor(255, 255, 255); // White text for header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      
      let currentX = margin + 3; // Start with padding
      columns.forEach((column, index) => {
        doc.text(column, currentX, startY + lineHeight + 1);
        currentX += columnWidths[index];
      });
      
      // Draw table rows
      doc.setTextColor(60, 60, 60); // Dark gray text
      doc.setFont("helvetica", "normal");
      let currentY = startY + lineHeight + 4;
      
      tickets.forEach((ticket, rowIndex) => {
        // Check if we need a new page
        if (currentY > pageHeight - margin) {
          doc.addPage();
          
          // Add header to new page
          doc.setFillColor(41, 128, 185);
          doc.rect(0, 0, pageWidth, 15, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text('HELPDESK MANAGEMENT SYSTEM - Support Tickets Report (Continued)', margin, 10);
          
          // Reset starting position
          currentY = margin + 10;
          
          // Redraw table header
          doc.setFillColor(52, 73, 94);
          doc.rect(margin, currentY, pageWidth - margin * 2, lineHeight + 4, 'F');
          
          // Draw column separators in header
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
        
        // Add zebra striping for better readability
        if (rowIndex % 2 === 0) {
          doc.setFillColor(245, 247, 250);
          doc.rect(margin, currentY, pageWidth - margin * 2, lineHeight + 3, 'F');
        }
        
        // Draw row border
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.1);
        doc.line(margin, currentY + lineHeight + 3, pageWidth - margin, currentY + lineHeight + 3);
        
        // Draw column data
        currentX = margin + 3;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        
        // ID column
        doc.setTextColor(100, 100, 100);
        doc.text(ticket._id ? ticket._id.slice(-6).toUpperCase() : 'N/A', currentX, currentY + lineHeight);
        currentX += columnWidths[0];
        
        // Title column with ellipsis if too long
        const title = ticket.title || 'N/A';
        let truncatedTitle = title;
        if (title.length > 45) {
          truncatedTitle = title.substring(0, 42) + '...';
        }
        doc.setTextColor(44, 62, 80); // Darker for title
        doc.setFont("helvetica", "bold");
        doc.text(truncatedTitle, currentX, currentY + lineHeight);
        doc.setFont("helvetica", "normal");
        currentX += columnWidths[1];
        
        // Student ID column
        doc.setTextColor(60, 60, 60);
        doc.text(ticket.studentId || 'N/A', currentX, currentY + lineHeight);
        currentX += columnWidths[2];
        
        // Issue Type column
        doc.text(ticket.issueType || 'N/A', currentX, currentY + lineHeight);
        currentX += columnWidths[3];
        
        // Status column with colored text and small bullet
        const status = ticket.status || 'N/A';
        let statusColor;
        switch (status) {
          case 'Open':
            statusColor = [243, 156, 18];
            break;
          case 'In Progress':
            statusColor = [52, 152, 219];
            break;
          case 'Resolved':
            statusColor = [46, 204, 113];
            break;
          case 'Closed':
            statusColor = [149, 165, 166];
            break;
          default:
            statusColor = [60, 60, 60];
        }
        
        // Draw colored status bullet
        doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.circle(currentX + 3, currentY + lineHeight - 2, 2, 'F');
        
        // Draw status text
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.text(status, currentX + 7, currentY + lineHeight);
        currentX += columnWidths[4];
        
        // Priority column with colored text
        const priority = ticket.priority || 'N/A';
        let priorityColor;
        switch (priority) {
          case 'Low':
            priorityColor = [52, 152, 219];
            break;
          case 'Medium':
            priorityColor = [243, 156, 18];
            break;
          case 'High':
            priorityColor = [230, 126, 34];
            break;
          case 'Critical':
            priorityColor = [231, 76, 60];
            break;
          default:
            priorityColor = [60, 60, 60];
        }
        doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
        doc.text(priority, currentX, currentY + lineHeight);
        currentX += columnWidths[5];
        
        // Created column - formatted date
        doc.setTextColor(100, 100, 100);
        const createdDate = ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A';
        doc.text(createdDate, currentX, currentY + lineHeight);
        currentX += columnWidths[6];
        
        // Assignee column
        const assignee = ticket.assignedTo || 'Unassigned';
        doc.text(assignee, currentX, currentY + lineHeight);
        
        // Move to next row
        currentY += lineHeight + 3;
      });
      
      // Add page borders
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.rect(margin - 5, margin - 5, pageWidth - 2 * (margin - 5), pageHeight - 2 * (margin - 5), 'S');
      
      // Add footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Add footer background
        doc.setFillColor(247, 250, 252);
        doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
        
        doc.setDrawColor(220, 220, 220);
        doc.line(0, pageHeight - 15, pageWidth, pageHeight - 15);
        
        // Add page number
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
        
        // Add company info
        doc.text('Helpdesk Management System © 2025', margin, pageHeight - 5);
        
        // Add report ID on the right
        const reportId = `Report #${new Date().getTime().toString().slice(-8)}`;
        doc.text(reportId, pageWidth - margin, pageHeight - 5, { align: 'right' });
      }
      
      // Save the PDF with a descriptive filename
      const dateStr = new Date().toISOString().slice(0,10);
      const fileName = `helpdesk-tickets-report-${dateStr}-${tickets.length}-tickets.pdf`;
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
      disabled={generatingPDF || tickets.length === 0}
    >
      {generatingPDF ? (
        <><FaSpinner className="admin-spinner-icon" /> Generating PDF...</>
      ) : (
        <><FaFilePdf /> Export to PDF</>
      )}
    </button>
  );
};

export default AdminPDFGenerator;