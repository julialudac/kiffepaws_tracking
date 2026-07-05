"use client"

import React from 'react';
import { Session } from '../entities/entitites';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { removeSessionById, updateSessionById } from '@/actions';

export function SessionView({ session, index }: { session: Session, index: number }) {
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
