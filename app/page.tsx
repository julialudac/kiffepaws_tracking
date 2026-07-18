import { CustomerViews } from "@/components/CustomerViews";
import { Forfait } from "@/entities/entitites";
import { getAllCustomersDTO, getAllForfaits } from "@/actions";
import { CustomerDTO } from "@/dto/dto";


export default async function Home() {
  // TODO use context to avoid passing props down the component tree. For now, I will pass the customers and forfaits as props to the CustomerViews component.
  // Same logic applies to the CustomerDetailView component, which is used in the customer/[id]/page.tsx file. We will pass the customer and forfaits as props to the CustomerDetailView component for now.
  const customers: CustomerDTO[] = await getAllCustomersDTO();
  const existingForfaits: Forfait[] = await getAllForfaits();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <CustomerViews customers={customers} forfaits={existingForfaits} />
      </main>
    </div>
  );
}
