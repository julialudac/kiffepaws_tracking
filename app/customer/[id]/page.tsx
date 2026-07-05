import { CustomerDetailView } from "@/components/CustomerViews";
import { fetchCustomer } from "./actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Note: this data could also be loaded client-side with a useEffect + fetch,
// but we fetch it on the server via a Server Action so the page renders with data already in hand.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const customer = await fetchCustomer(Number(id));

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Button variant="default" className="self-start">
          <Link href="/">← Retourner à la liste des suivis client</Link>
        </Button>
        <CustomerDetailView customer={customer} />
      </main>
    </div>
  );
}
