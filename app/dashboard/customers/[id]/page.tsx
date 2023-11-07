import { fetchCardCustomerData, fetchCustomerById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import CustomerProfileHeader from "@/app/ui/customers/header";
import HeaderCustomerProfile from "@/app/ui/customers/header";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const customer = await fetchCustomerById(id);
  const invoices = await fetchCardCustomerData(id);
  if (!customer) notFound();
  console.log("invoices",invoices)
  return (
    <>
    {customer && (
      <div className="flex flex-col items-center gap-10 justify-between">
      <Image
        className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
        src={customer.image_url}
        alt="Bordered avatar"
        width={100}
        height={100}
      />
      <div><strong>name: </strong>{customer.name}</div>
      <div><strong>ID: </strong>{id}</div>

      <HeaderCustomerProfile id={id}/>
      
    </div>
    )}
    </>
  );
}
