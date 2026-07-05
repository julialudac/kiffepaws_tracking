"use client"

import React from 'react';
import { Session, CustomerForfait } from '../entities/entitites';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from 'lucide-react';
import { addPassedSessionToForfait } from '@/actions';
import { SessionView } from './SessionView';

export function ForfaitView({ forfait }: { forfait: CustomerForfait }) {
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
