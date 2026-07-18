"use client"

import React from 'react';
import { Session, CustomerForfait } from '../entities/entitites';
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from 'lucide-react';
import { addPassedSessionToForfait, removeForfaitById } from '@/actions';
import { SessionView } from './SessionView';

// TODO remove forfait modal is dup with remove session modal. Refactor to avoid dup code.
export function ForfaitView({ forfait }: { forfait: CustomerForfait }) {
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = React.useState(false);
  const newPassedSessionTitleRef = React.useRef<HTMLInputElement>(null);
  const newPassedSessionDateRef = React.useRef<HTMLInputElement>(null);
  const newPassedSessionContentRef = React.useRef<HTMLTextAreaElement>(null);

  const [isDeleteForfaitModalOpen, setIsDeleteForfaitModalOpen] = React.useState(false);

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
    setIsAddSessionModalOpen(false);
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
          <Button onClick={() => setIsAddSessionModalOpen(true)}>➕ Ajouter un rapport de séance</Button>
        )}
        <Button onClick={() => setIsDeleteForfaitModalOpen(true)}>🗑️ Supprimer le forfait !</Button>
        <CollapsibleContent className="mt-2 space-y-2">
          {forfait.passedSessions.map((session: Session, index: number) => (
            <SessionView key={session.id} session={session} index={index} />
          ))}
        </CollapsibleContent>
      </Collapsible>
      <Dialog open={isAddSessionModalOpen} onOpenChange={setIsAddSessionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau rapport de séance</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Titre</FieldLabel>
              <Input type="text" id="title" name="title" defaultValue={`Séance ${forfait.passedSessions.length + 1}`} ref={newPassedSessionTitleRef} />
            </Field>
            <Field>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <Input
                type="text"
                id="date"
                name="date"
                defaultValue={new Date().toLocaleDateString("fr-FR")}
                ref={newPassedSessionDateRef}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="content">Contenu</FieldLabel>
              <Textarea id="content" name="content" defaultValue="" ref={newPassedSessionContentRef}
                className="max-h-[260px] overflow-auto" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddSessionModalOpen(false)}>Annuler</Button>
            <Button type="button" onClick={addPassedSession}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteForfaitModalOpen} onOpenChange={setIsDeleteForfaitModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le forfait</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer ce forfait ?</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteForfaitModalOpen(false)}>Annuler</Button>
            <Button type="button" onClick={() => {
              removeForfaitById(forfait.id);
              setIsDeleteForfaitModalOpen(false);
            }}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
