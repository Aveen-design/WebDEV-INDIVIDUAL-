const PDFDocument = require('pdfkit');

const generateAgreementPDF = (booking, res) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="DriveNepal-Agreement-${booking.reference_code}.pdf"`
  );
  doc.pipe(res);

  doc.fontSize(22).font('Helvetica-Bold').fillColor('#14213d')
    .text('DriveNepal', 50, 50);
  doc.fontSize(10).font('Helvetica').fillColor('#888')
    .text('Nepal\'s trusted online vehicle rental platform', 50, 78);

  doc.moveTo(50, 100).lineTo(545, 100).strokeColor('#60A5FA').lineWidth(2).stroke();

  doc.fontSize(16).font('Helvetica-Bold').fillColor('#14213d')
    .text('Rental Agreement', 50, 115);
  doc.fontSize(10).font('Helvetica').fillColor('#666')
    .text(`Reference: ${booking.reference_code}`, 50, 135)
    .text(`Generated: ${new Date().toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}`, 50, 150)
    .text(`Status: ${booking.status.replace('_', ' ').toUpperCase()}`, 50, 165);

  doc.moveTo(50, 185).lineTo(545, 185).strokeColor('#e0e0e6').lineWidth(1).stroke();

  doc.fontSize(12).font('Helvetica-Bold').fillColor('#14213d').text('VEHICLE DETAILS', 50, 200);
  doc.fontSize(10).font('Helvetica').fillColor('#444')
    .text(`Title:          ${booking.vehicle_title}`, 50, 220)
    .text(`Brand / Model:  ${booking.brand} ${booking.model}`, 50, 236)
    .text(`Type:           ${booking.vehicle_type}`, 50, 252)
    .text(`Location:       ${booking.location}`, 50, 268);

  doc.moveTo(50, 288).lineTo(545, 288).strokeColor('#e0e0e6').lineWidth(1).stroke();

  doc.fontSize(12).font('Helvetica-Bold').fillColor('#14213d').text('RENTER DETAILS', 50, 303);
  doc.fontSize(10).font('Helvetica').fillColor('#444')
    .text(`Name:   ${booking.customer_name}`, 50, 323)
    .text(`Phone:  ${booking.customer_phone || 'N/A'}`, 50, 339);

  doc.fontSize(12).font('Helvetica-Bold').fillColor('#14213d').text('OWNER DETAILS', 300, 303);
  doc.fontSize(10).font('Helvetica').fillColor('#444')
    .text(`Name:   ${booking.owner_name}`, 300, 323)
    .text(`Phone:  ${booking.owner_phone || 'N/A'}`, 300, 339);

  doc.moveTo(50, 360).lineTo(545, 360).strokeColor('#e0e0e6').lineWidth(1).stroke();

  doc.fontSize(12).font('Helvetica-Bold').fillColor('#14213d').text('RENTAL PERIOD', 50, 375);
  const fmt = (d) => new Date(d).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.fontSize(10).font('Helvetica').fillColor('#444')
    .text(`Start Date:      ${fmt(booking.start_date)}`, 50, 395)
    .text(`End Date:        ${fmt(booking.end_date)}`, 50, 411)
    .text(`Total Days:      ${booking.total_days}`, 50, 427)
    .text(`Driver Required: ${booking.driver_required ? 'Yes' : 'No'}`, 50, 443);

  if (booking.pickup_location) {
    doc.text(`Pickup Location: ${booking.pickup_location}`, 50, 459);
  }

  doc.moveTo(50, 475).lineTo(545, 475).strokeColor('#e0e0e6').lineWidth(1).stroke();

  doc.fontSize(12).font('Helvetica-Bold').fillColor('#14213d').text('COST BREAKDOWN', 50, 490);

  const col1 = 50, col2 = 400, rowH = 16;
  let y = 510;

  doc.fontSize(10).font('Helvetica').fillColor('#444');
  doc.text(`Daily Rate:`, col1, y).text(`Rs ${Number(booking.daily_rate).toLocaleString()}`, col2, y);
  y += rowH;

  if (booking.driver_required && Number(booking.driver_rate) > 0) {
    doc.text(`Driver Rate:`, col1, y).text(`Rs ${Number(booking.driver_rate).toLocaleString()}`, col2, y);
    y += rowH;
  }

  doc.text(`Total Days:`, col1, y).text(`${booking.total_days}`, col2, y);
  y += rowH;
  doc.text(`Subtotal:`, col1, y).text(`Rs ${Number(booking.subtotal).toLocaleString()}`, col2, y);
  y += rowH;
  doc.text(`Platform Fee:`, col1, y).text(`Rs ${Number(booking.platform_fee).toLocaleString()}`, col2, y);
  y += rowH + 4;

  doc.moveTo(col1, y).lineTo(545, y).strokeColor('#14213d').lineWidth(1).stroke();
  y += 8;

  doc.fontSize(11).font('Helvetica-Bold').fillColor('#14213d')
    .text(`TOTAL AMOUNT:`, col1, y)
    .text(`Rs ${Number(booking.total_amount).toLocaleString()}`, col2, y);

  y += 40;
  doc.moveTo(50, y).lineTo(545, y).strokeColor('#e0e0e6').lineWidth(1).stroke();
  y += 15;

  doc.fontSize(11).font('Helvetica-Bold').fillColor('#14213d').text('TERMS & CONDITIONS', 50, y);
  y += 18;
  const terms = [
    '1. The renter must present a valid driving licence at the time of vehicle handover.',
    '2. The vehicle must be returned in the same condition as received.',
    '3. Any damage caused during the rental period is the renter\'s responsibility.',
    '4. Fuel costs are the responsibility of the renter unless otherwise agreed.',
    '5. Late returns may incur additional charges as agreed with the owner.',
    '6. Disputes can be raised through the DriveNepal platform within 48 hours of return.',
  ];
  doc.fontSize(9).font('Helvetica').fillColor('#555');
  terms.forEach((t) => {
    doc.text(t, 50, y, { width: 495 });
    y += 14;
  });

  y += 20;
  doc.moveTo(50, y).lineTo(545, y).strokeColor('#e0e0e6').lineWidth(1).stroke();
  y += 15;

  doc.fontSize(10).font('Helvetica-Bold').fillColor('#14213d')
    .text('Renter Signature', 50, y)
    .text('Owner Signature', 350, y);
  y += 40;
  doc.moveTo(50, y).lineTo(200, y).strokeColor('#999').lineWidth(1).stroke();
  doc.moveTo(350, y).lineTo(500, y).strokeColor('#999').lineWidth(1).stroke();
  y += 12;
  doc.fontSize(8).font('Helvetica').fillColor('#aaa')
    .text(booking.customer_name, 50, y)
    .text(booking.owner_name, 350, y);

  doc.fontSize(8).fillColor('#bbb')
    .text('This document is generated by DriveNepal and serves as a digital rental agreement.', 50, 780, { align: 'center', width: 495 });

  doc.end();
};

module.exports = { generateAgreementPDF };
