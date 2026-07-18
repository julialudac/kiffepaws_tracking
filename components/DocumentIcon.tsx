"use client"

import React from 'react';
import { Upload } from '@/entities/entitites';
import { getDocumentUrl } from '@/utils';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { removeDocumentById } from '@/actions';

export function DocumentIcon({ document }: { document: Upload }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <a href={getDocumentUrl(document)} target="_blank" rel="noreferrer noopener">
          <span aria-hidden="true" style={{ display: 'inline-block', width: 24, height: 24, marginRight: 8 }}>
            📄
          </span>
          <span>{document.title}</span>
        </a>
        <Button onClick={() => setIsDeleteModalOpen(true)}>🗑️ Supprimer le document</Button>
      </div>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le document</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer ce document ? Le document restera stocké sur le serveur mais ne sera plus associé à ce client.</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Annuler</Button>
            <Button type="button" onClick={() => {
              removeDocumentById(document.id);
              setIsDeleteModalOpen(false);
            }}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}