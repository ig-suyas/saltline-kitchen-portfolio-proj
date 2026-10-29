import type { Metadata } from "next";
import { OrderApp } from "@/components/order/OrderApp";

export const metadata: Metadata = {
  title: "Order at Table",
  description: "A front-end demo of QR table ordering at Saltline Kitchen: pick a table, browse the menu, build a tray and send it. Nothing is sent.",
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  return (
    <OrderApp />
  );
}
