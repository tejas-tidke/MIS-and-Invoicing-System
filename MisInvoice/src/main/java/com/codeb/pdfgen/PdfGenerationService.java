package com.codeb.pdfgen;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import com.codeb.entity.Invoice;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

@Service
public class PdfGenerationService {

    public byte[] generateInvoicePdf(Invoice invoice) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

          
            Paragraph title = new Paragraph("INVOICE")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(18)
                    .setBold();
            document.add(title);

            Table infoTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}));
            infoTable.setWidth(UnitValue.createPercentValue(100));

            addTableRow(infoTable, "Invoice Number:", invoice.getInvoiceNo());
            addTableRow(infoTable, "Date:", invoice.getCreatedAt().format(DateTimeFormatter.ISO_DATE));
            addTableRow(infoTable, "Client:", invoice.getChain().getCompanyName());
            addTableRow(infoTable, "GSTIN:", invoice.getChain().getGstnNo());

            document.add(infoTable);
            document.add(new Paragraph("\nService Details:").setBold().setFontSize(12));

            Table serviceTable = new Table(UnitValue.createPercentArray(new float[]{3, 1, 1, 1}));
            serviceTable.setWidth(UnitValue.createPercentValue(100));

            addServiceTableHeader(serviceTable);
            addServiceTableRow(serviceTable,
                    invoice.getServiceDetails(),
                    invoice.getQuantity(),
                    invoice.getCostPerUnit(),
                    invoice.getAmountPayable());

            document.add(serviceTable);

            Table totalTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}));
            totalTable.setWidth(UnitValue.createPercentValue(50));
            totalTable.setHorizontalAlignment(HorizontalAlignment.RIGHT);

            addTableRow(totalTable, "Subtotal:", invoice.getAmountPayable().toString());
            addTableRow(totalTable, "Amount Paid:", invoice.getAmountPayable().subtract(invoice.getBalance()).toString());
            addTableRow(totalTable, "Balance Due:", invoice.getBalance().toString());

            document.add(totalTable);
            document.close();

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private void addTableRow(Table table, String label, String value) {
        table.addCell(createCell(label, true));
        table.addCell(createCell(value, false));
    }

    private void addServiceTableHeader(Table table) {
        Stream.of("Description", "Qty", "Unit Price", "Amount")
                .forEach(header -> {
                    table.addCell(
                            new Cell()
                                    .add(new Paragraph(header))
                                    .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                    );
                });
    }

    private void addServiceTableRow(Table table, String desc, int qty, BigDecimal unitPrice, BigDecimal amount) {
        table.addCell(createCell(desc, false));
        table.addCell(createCell(String.valueOf(qty), false));
        table.addCell(createCell(unitPrice.toString(), false));
        table.addCell(createCell(amount.toString(), false));
    }

    private Cell createCell(String content, boolean isHeader) {
        Cell cell = new Cell().add(new Paragraph(content));
        cell.setPadding(5);
        if (isHeader) {
            cell.setBackgroundColor(ColorConstants.LIGHT_GRAY);
        }
        return cell;
    }
}
