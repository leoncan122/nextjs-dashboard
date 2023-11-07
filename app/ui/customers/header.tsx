import { fetchCardCustomerData } from "@/app/lib/data";
import { Card } from "../dashboard/cards";

export default async function HeaderCustomerProfile({ id }: { id: string }) {
  const { numberOfInvoices, totalPaidInvoices, totalPendingInvoices } = await fetchCardCustomerData(id);

  return (
    <div className="flex justify-between">
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
    </div>
  );
}
