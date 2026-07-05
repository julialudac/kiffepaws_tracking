"use client"

import React from 'react';
import { Customer, Session, CustomerForfait, Upload } from '../entities/entitites';
import { DocumentIcon } from './DocumentIcon';
import {
  Card,
  CardAction,
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
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { removeSessionById, updateSessionById, addPassedSessionToForfait } from '@/actions';

function SessionView({ session, index }: { session: Session, index: number }) {
  const deleteDialogRef = React.useRef<HTMLDialogElement>(null)
  const editDialogRef = React.useRef<HTMLDialogElement>(null)
  const titleInputRef = React.useRef<HTMLInputElement>(null)
  const dateInputRef = React.useRef<HTMLInputElement>(null)
  const contentInputRef = React.useRef<HTMLTextAreaElement>(null)

  const removeSession = (sessionId: number) => {
    removeSessionById(sessionId);
  }

  const openDeleteDialog = () => {
    deleteDialogRef.current?.showModal()
  }

  const closeDeleteDialog = () => {
    deleteDialogRef.current?.close()
  }

  const openEditDialog = () => {
    editDialogRef.current?.showModal()
  }

  const closeEditDialog = () => {
    editDialogRef.current?.close()
  }

  const saveEdit = () => {
    updateSessionById(session.id, {
      theme: titleInputRef.current?.value || undefined,
      date: dateInputRef.current?.value || undefined,
      content: contentInputRef.current?.value || undefined,
    });
    closeEditDialog();
  }

  return (
    <>
      <Card key={session.id}>
        <CardAction><Button onClick={openEditDialog}>✏️ Modifier</Button></CardAction>
        <CardAction><Button onClick={openDeleteDialog}>🗑️ Supprimer</Button></CardAction>
        <CardTitle>Séance n°{index + 1} - {session.theme}</CardTitle>
        <CardDescription>{session.date}</CardDescription>
        <CardContent><pre className="whitespace-pre-wrap break-words text-justify">{session.content}</pre></CardContent>
      </Card>
      <dialog
        ref={deleteDialogRef}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md p-6"
      >
        <p>Souhaitez-vous vraiment supprimer cette séance ?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={closeDeleteDialog}>
            Annuler
          </Button>
          <Button type="button" onClick={() => { removeSession(session.id); closeDeleteDialog() }}>
            Supprimer
          </Button>
        </div>
      </dialog>
      <dialog
        ref={editDialogRef}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md p-6"
      >
        <p className="font-medium">Modifier la séance</p>
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            Titre
            <input
              ref={titleInputRef}
              type="text"
              defaultValue={session.theme}
              className="rounded-md border px-2 py-1"
            />
          </label>
          <label className="flex flex-col gap-1">
            Date
            <input
              ref={dateInputRef}
              type="text"
              defaultValue={session.date}
              className="rounded-md border px-2 py-1"
            />
          </label>
          <label className="flex flex-col gap-1">
            Contenu
            <textarea
              ref={contentInputRef}
              defaultValue={session.content}
              className="min-h-32 rounded-md border px-2 py-1"
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={closeEditDialog}>
            Annuler
          </Button>
          <Button type="button" onClick={saveEdit}>
            Enregistrer
          </Button>
        </div>
      </dialog>
    </>
  )
}

function ForfaitView({ forfait }: { forfait: CustomerForfait }) {
  const addPassedSessionDialogRef = React.useRef<HTMLDialogElement>(null);
  const newPassedSessionTitleRef = React.useRef<HTMLInputElement>(null);
  const newPassedSessionDateRef = React.useRef<HTMLInputElement>(null);
  const newPassedSessionContentRef = React.useRef<HTMLTextAreaElement>(null);

  const openAddPassedSessionDialog = () => {
    addPassedSessionDialogRef.current?.showModal();
  }

  const closeAddPassedSessionDialog = () => {
    addPassedSessionDialogRef.current?.close();
  }

  const addPassedSession = () => {
    const newSession: Session = {
      // TODO: forfait.passedSessions.length + 1 is not really the correct id, because a passed session in another forfait could have the same id. With new database structure, this will be solved.
      // For now, we will generate a unique id by using the current timestamp, which is not perfect but will work for now.
      id: Date.now(),
      date: newPassedSessionDateRef.current!.value,
      theme: newPassedSessionTitleRef.current!.value,
      content: newPassedSessionContentRef.current!.value
    };
    addPassedSessionToForfait(forfait.id, newSession);
    closeAddPassedSessionDialog();
  }

  return (
    <>
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
        {forfait.passedSessions.length < forfait.numberOfSessions && (
          <Button onClick={openAddPassedSessionDialog}>➕ Ajouter un rapport de séance</Button>
        )}
        <CollapsibleContent className="mt-2 space-y-2">
          {forfait.passedSessions.map((session: Session, index: number) => (
            <SessionView key={session.id} session={session} index={index} />
          ))}
        </CollapsibleContent>
      </Collapsible>
      <dialog
        ref={addPassedSessionDialogRef}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md p-6">
        <p className="font-medium">Ajouter un nouveau rapport de séance</p>
        <label className="flex flex-col gap-1" htmlFor="title">Titre</label>
        <input className="rounded-md border px-2 py-1" type="text" id="title" name="title" defaultValue={`Séance ${forfait.passedSessions.length + 1}`} ref={newPassedSessionTitleRef} />
        <label className="flex flex-col gap-1" htmlFor="date">Date </label>
        <input
          className="rounded-md border px-2 py-1"
          type="text"
          id="date"
          name="date"
          defaultValue={new Date().toLocaleDateString("fr-FR")}
          ref={newPassedSessionDateRef}
        />
        <label className="flex flex-col gap-1" htmlFor="content">Contenu</label>
        <textarea className="rounded-md border px-2 py-1" id="content" name="content" defaultValue="" ref={newPassedSessionContentRef}></textarea>
        <Button onClick={addPassedSession}>Enregistrer</Button>
        <Button onClick={closeAddPassedSessionDialog}>Annuler</Button>
      </dialog>
    </>
  )
}


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