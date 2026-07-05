"use client"

import React from 'react';
import { Customer, CustomerForfait, Upload } from '../entities/entitites';
import { DocumentIcon } from './DocumentIcon';
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
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { ForfaitView } from './ForfaitView';

function CustomerCard({ customer, open, onOpenChange, actions }: { customer: Customer, open: boolean, onOpenChange: (open: boolean) => void, actions?: React.ReactNode }) {
  return (
    // Keep each customer card full-width so it doesn't shrink to the width of the longest collapsed line. -> w-full
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
            {customer.documents && customer.documents.length > 0 && (
              <Card className="bg-green-50 /70">
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {customer.documents.map((document: Upload) => (
                    <div key={document.id}> <DocumentIcon document={document} /> </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {customer.passedForfaits && customer.passedForfaits.length > 0 && (
              <Card className="mt-4 bg-orange-50/70 bg-orange-50/70">
                <CardHeader>
                  <CardTitle>Forfaits terminés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customer.passedForfaits.map((forfait: CustomerForfait) => (
                      <ForfaitView key={forfait.id} forfait={forfait} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {customer.ongoingForfaits && customer.ongoingForfaits.length > 0 && (
              <Card className="mt-4 bg-orange-50/70 bg-orange-50/70">
                <CardHeader>
                  <CardTitle>Forfaits en cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customer.ongoingForfaits.map((forfait: CustomerForfait) => (
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
  )
}

export function CustomerView({ customer, open, onOpenChange }: { customer: Customer, open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <CustomerCard
      customer={customer}
      open={open}
      onOpenChange={onOpenChange}
      actions={<Button variant="default"><Link href={`/customer/${customer.id}`}>Consulter</Link></Button>}
    />
  )
}

export function CustomerDetailView({ customer }: { customer: Customer }) {
  const [open, setOpen] = React.useState(true)
  return (
    <CustomerCard
      customer={customer}
      open={open}
      onOpenChange={setOpen}
    />
  )
}

export function CustomerViews({ customers }: { customers: Customer[] }) {
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
          />
          <br /> <br />
        </React.Fragment>
      ))}
    </div>
  )
}
