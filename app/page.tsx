import { CustomerViews } from "@/components/CustomerViews";
import { Customer, Forfait } from "@/entities/entitites";
import { getAllCustomers, getAllForfaits } from "@/actions";


export default async function Home() {
  // TODO use context to avoid passing props down the component tree. For now, I will pass the customers and forfaits as props to the CustomerViews component.
  const customers: Customer[] = await getAllCustomers();
  const existingForfaits: Forfait[] = await getAllForfaits();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <CustomerViews customers={customers} forfaits={existingForfaits} />
      </main>
    </div>
  );
}
