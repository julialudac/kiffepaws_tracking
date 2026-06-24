import React from 'react';
import { Customer, Session, CustomerForfait, Upload } from '../entities/entitites';
import { DocumentIcon } from './DocumentIcon';

function CustomerHeader({ customer }: { customer: Customer }) {
  return (
    <div>
      <h2>{customer.firstname} & {customer.dog.name}</h2>
      ------------------------------------------------------------
    </div>
  )
}

function SessionView({ session, index }: { session: Session, index: number }) {
  return (
    <div key={session.id}>
      <span>{index + 1}</span> ---
      <span>{session.date}</span> ---
      <span><strong>{session.theme}</strong></span>
      <pre>{session.content}</pre>
    </div>
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
    <div key={customer.id}>
      <CustomerHeader customer={customer} />
      Documents :
      <div>
        {customer.documents && customer.documents.map((document: Upload) => (
          <div key={document.id}> <DocumentIcon document={document} /> </div>
        ))}
      </div>
      Forfaits en cours :
      <div>
        {customer.ongoingForfaits && customer.ongoingForfaits.map((forfait: CustomerForfait) => (
          <ForfaitView key={forfait.id} forfait={forfait} />
        ))}
      </div>
      Forfaits terminés :
      <div>
        {customer.passedForfaits && customer.passedForfaits.map((forfait: CustomerForfait) => (
          <ForfaitView key={forfait.id} forfait={forfait} />
        ))}
      </div>
    </div>
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