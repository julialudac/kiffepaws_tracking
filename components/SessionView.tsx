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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { removeSessionById, updateSessionById } from '@/actions';

export function SessionView({ session, index }: { session: Session, index: number }) {
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const titleInputRef = React.useRef<HTMLInputElement>(null)
  const dateInputRef = React.useRef<HTMLInputElement>(null)
  const contentInputRef = React.useRef<HTMLTextAreaElement>(null)

  const removeSession = (sessionId: number) => {
    removeSessionById(sessionId);
  }

  const saveEdit = () => {
    updateSessionById(session.id, {
      theme: titleInputRef.current?.value || undefined,
      date: dateInputRef.current?.value || undefined,
      content: contentInputRef.current?.value || undefined,
    });
    setEditOpen(false);
  }

  return (
    <>
      <Card key={session.id}>
        <CardAction><Button onClick={() => setEditOpen(true)}>✏️ Modifier</Button></CardAction>
        <CardAction><Button onClick={() => setDeleteOpen(true)}>🗑️ Supprimer</Button></CardAction>
        <CardTitle>Séance n°{index + 1} - {session.theme}</CardTitle>
        <CardDescription>{session.date}</CardDescription>
        <CardContent><pre className="whitespace-pre-wrap break-words text-justify">{session.content}</pre></CardContent>
      </Card>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cette séance ?</DialogTitle>
            <DialogDescription>Souhaitez-vous vraiment supprimer cette séance ?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={() => { removeSession(session.id); setDeleteOpen(false) }}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la séance</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={saveEdit}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
