"use client"

import React from 'react';
import { Customer, CustomerForfait, Forfait } from '../entities/entitites';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList
} from "@/components/ui/combobox";
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { ForfaitView } from './ForfaitView';
import { Field, FieldGroup, FieldLabel } from './ui/field';
import { addForfaitToCustomer } from '@/actions';
import { DocumentsView } from './DocumentsView';

// TODO about dialog footer : dups in several components
// TODO refactor dups here 
// Note : There is a Radix UI bug that prevents to select an element in a combobox which is inside a dialog, with mouse and we have to select with keyboard!
// See https://github.com/shadcn-ui/ui/issues/1748 . Same issue with a drawer instead of a dialog. 
function CustomerCard({ customer, open, onOpenChange, actions, forfaits }: { customer: Customer, open: boolean, onOpenChange: (open: boolean) => void, actions?: React.ReactNode, forfaits: Forfait[] }) {
  const [isAddForfaitModalOpen, setIsAddForfaitModalOpen] = React.useState(false);
  const newForfaitTypeRef = React.useRef<HTMLInputElement>(null);
  const ongoingForfaits = customer.customerForfaits?.filter((f) => !f.isPassed) ?? [];
  const passedForfaits = customer.customerForfaits?.filter((f) => f.isPassed) ?? [];

  const addNewForfait = () => {
    const selectedForfaitName = newForfaitTypeRef.current!.value;
    if (!selectedForfaitName) {
      alert("Veuillez sélectionner un type de forfait.");
      return;
    }
    const selectedForfait: Forfait = forfaits.find(forfait => forfait.name === selectedForfaitName)!;
    addForfaitToCustomer(customer.id, selectedForfait);
    setIsAddForfaitModalOpen(false);
  }


  return (
    // Keep each customer card full-width so it doesn't shrink to the width of the longest collapsed line. -> w-full
    <>
      <Card key={customer.id} className="w-full bg-blue-50/70">
        {actions && <CardAction>{actions}</CardAction>}
        <Collapsible open={open} onOpenChange={onOpenChange}>
          <CollapsibleTrigger asChild>
            {/* The group class lets the chevron react to the trigger's open/closed state. */}
            <CardHeader className="group">
              <CardTitle className="flex items-center justify-between gap-2">
                <span>{customer.firstname} & {customer.dog.name}</span>
                <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <DocumentsView documents={customer.documents} customerId={customer.id} />
              {passedForfaits.length > 0 && (
                <Card className="mt-4 bg-orange-50/70 bg-orange-50/70">
                  <CardHeader>
                    <CardTitle>Forfaits terminés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {passedForfaits.map((forfait: CustomerForfait) => (
                        <ForfaitView key={forfait.id} forfait={forfait} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              {ongoingForfaits.length > 0 && (
                <Card className="mt-4 bg-orange-50/70 bg-orange-50/70">
                  <CardHeader>
                    <CardTitle>Forfaits en cours</CardTitle>
                    <Button onClick={() => setIsAddForfaitModalOpen(true)}>➕ Ajouter un nouveau forfait</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ongoingForfaits.map((forfait: CustomerForfait) => (
                        <ForfaitView key={forfait.id} forfait={forfait} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card >
      <Dialog open={isAddForfaitModalOpen} onOpenChange={setIsAddForfaitModalOpen}>
        <DialogContent onInteractOutside={(e) => { e.preventDefault() }}>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau forfait</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="forfaitSelect">Type de forfait</FieldLabel>
              <Combobox items={forfaits} name="forfaitSelect" id="forfaitSelect">
                <ComboboxInput ref={newForfaitTypeRef} placeholder="Select a framework" />
                <ComboboxContent>
                  <ComboboxList>
                    {(forfait: Forfait) => (
                      <ComboboxItem key={forfait.id} value={forfait.name}>
                        {forfait.name} ({forfait.numberOfSessions} séances)
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddForfaitModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={addNewForfait}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function CustomerView({ customer, open, onOpenChange, forfaits }: { customer: Customer, open: boolean, onOpenChange: (open: boolean) => void, forfaits: Forfait[] }) {
  return (
    <CustomerCard
      customer={customer}
      open={open}
      onOpenChange={onOpenChange}
      actions={<Button variant="default"><Link href={`/customer/${customer.id}`}>Consulter</Link></Button>}
      forfaits={forfaits}
    />
  )
}

export function CustomerDetailView({ customer, forfaits }: { customer: Customer, forfaits: Forfait[] }) {
  const [open, setOpen] = React.useState(true)
  return (
    <CustomerCard
      customer={customer}
      open={open}
      onOpenChange={setOpen}
      forfaits={forfaits}
    />
  )
}

export function CustomerViews({ customers, forfaits }: { customers: Customer[], forfaits: Forfait[] }) {
  const [openMap, setOpenMap] = React.useState<Record<number, boolean>>({})
  const allOpen = customers.length > 0 && customers.every((customer) => openMap[customer.id])

  function toggleAll() {
    const nextOpen = !allOpen
    setOpenMap(Object.fromEntries(customers.map((customer) => [customer.id, nextOpen])))
  }

  return (
    // Let the list container span the available width so each customer card can expand to the parent width
    // instead of adapting to the longest line of its content -> w-full max-w-3xl
    <div id="customers" className="w-full max-w-3xl">
      <div className="flex items-center justify-between gap-2">
        <h1>Suivi de clients</h1>
        <Button variant="outline" size="sm" onClick={toggleAll}>
          {allOpen ? "Tout réduire" : "Tout développer"}
        </Button>
      </div>
      {customers.map((customer) => (
        <React.Fragment key={customer.id}>
          <CustomerView
            customer={customer}
            open={!!openMap[customer.id]}
            onOpenChange={(open) => setOpenMap((prev) => ({ ...prev, [customer.id]: open }))}
            forfaits={forfaits}
          />
          <br /> <br />
        </React.Fragment>
      ))}
    </div>
  )
}
