import { fetchCustomers } from "@/app/lib/data";
import { CustomerField } from "@/app/lib/definitions";
import CustomersTable from "@/app/ui/customers/table"
import { lusitana } from "@/app/ui/fonts";
import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import { Suspense } from "react";

export default async function Page({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  }) {
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const customers: any = await fetchCustomers();
    const totalPages = customers.length

    return (
        <div className="w-full">
       
         <Suspense key={query + currentPage} fallback={<div>Cargando...</div>}>
          <CustomersTable customers={customers} />
        </Suspense>
        {/* <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div> */}
      </div>
    );
}
