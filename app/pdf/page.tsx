"use client";

import { CustomerQuotation } from "@/components/pdf/customer-quotation";
import { PDFViewer } from "@react-pdf/renderer/lib/react-pdf.browser";

const mockProducts = Array.from({ length: 30 }, (_, i) => ({
  name: `Product ${i + 1} - Custom Gaming Component`,
  quantity: Math.floor(Math.random() * 5) + 1, // 1 to 5
  unitPrice: parseFloat((Math.random() * 1000 + 100).toFixed(2)), // RM100–1100
}));

const subtotal = mockProducts.reduce(
  (sum, item) => sum + item.unitPrice * item.quantity,
  0
);

const total = subtotal;

export default function Page() {
  return (
    <PDFViewer className="w-[500px] mx-auto min-h-screen">
      <CustomerQuotation
        date="03/07/2025"
        products={mockProducts}
        subTotal={subtotal}
        total={total}
      />
    </PDFViewer>
  );
}
