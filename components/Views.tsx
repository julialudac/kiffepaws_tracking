import React from 'react';
import { Customer, Session, CustomerForfait, Upload } from '../entities/entitites';
import { DocumentIcon } from './DocumentIcon';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDownIcon } from 'lucide-react';

function SessionView({ session, index }: { session: Session, index: number }) {
  return (
    <Card key={session.id}>
      <CardTitle>Séance n°{index + 1} - {session.theme}</CardTitle>
      <CardDescription>{session.date}</CardDescription>
      <CardContent><pre className="whitespace-pre-wrap break-words text-justify">{session.content}</pre></CardContent>
    </Card>
  )
}

function ForfaitView({ forfait }: { forfait: CustomerForfait }) {
  return (
    <Collapsible key={forfait.id} defaultOpen className="w-full">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="group flex w-full items-center gap-2 rounded-md py-1 text-left"
        >
          <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          <span>
            <span className="font-medium">{forfait.type}</span> ---
            <span>{forfait.passedSessions.length}/{forfait.numberOfSessions}</span>
          </span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        {forfait.passedSessions.map((session: Session, index: number) => (
          <SessionView key={session.id} session={session} index={index} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}


function CustomerView({ customer }: { customer: Customer }) {
  return (
    // Keep each customer card full-width so it doesn't shrink to the width of the longest collapsed line. -> w-full
    <Card key={customer.id} className="w-full bg-blue-50/70">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <CardHeader>
            <CardTitle>
              {customer.firstname} & {customer.dog.name}
              <ChevronDownIcon />
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

export function CustomerViews({ customers }: { customers: Customer[] }) {
  return (
    // Let the list container span the available width so each customer card can expand to the parent width 
    // instead of adapting to the longest line of its content -> w-full max-w-3xl
    <div id="customers" className="w-full max-w-3xl">
      <h1>Suivi de clients</h1>
      {customers.map((customer) => (
        <React.Fragment key={customer.id}>
          <CustomerView customer={customer} />
          <br /> <br />
        </React.Fragment>
      ))}
    </div>
  )
}