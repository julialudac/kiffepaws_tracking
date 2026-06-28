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
    <div key={forfait.id}>
      <span>&gt; {forfait.type}</span> ---
      <span>{forfait.passedSessions.length}/{forfait.numberOfSessions}</span> <br />
      {forfait.passedSessions.map((session: Session, index: number) => (
        <SessionView key={session.id} session={session} index={index} />
      ))}
    </div>
  )
}

function CustomerView({ customer }: { customer: Customer }) {
  return (
    <Card key={customer.id} >
      <CardHeader>
        <CardTitle>{customer.firstname} & {customer.dog.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {customer.documents && customer.documents.length > 0 && (
          <Card>
            <CardHeader>
              Documents
            </CardHeader>
            <CardContent>
              {customer.documents.map((document: Upload) => (
                <div key={document.id}> <DocumentIcon document={document} /> </div>
              ))}
            </CardContent>
          </Card>
        )}
        {customer.passedForfaits && customer.passedForfaits.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              Forfaits terminés
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
          <Card className="mt-4">
            <CardHeader>
              Forfaits en cours
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
    </Card >
  )
}

export function CustomerViews({ customers }: { customers: Customer[] }) {
  return (
    <div id="customers">
      {customers.map((customer) => (
        <React.Fragment key={customer.id}>
          <CustomerView customer={customer} />
          <br /> <br />
        </React.Fragment>
      ))}
    </div>
  )
}