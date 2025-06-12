export interface Invoice {
  id: string;
  customerName: string;
  date: string;
  items: { id: string; invoiceId: string; productName: string; quantity: number; unitPrice: number }[];
}
