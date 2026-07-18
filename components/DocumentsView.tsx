import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from '@/entities/entitites';
import { DocumentIcon } from './DocumentIcon';
import { Button } from './ui/button';
import React from 'react';
import { attachDocumentToCustomer } from '@/actions';

export function DocumentsView({ documents, customerId }: { documents?: Upload[]; customerId: number }) {
  // It's a current practice to hide the file input and trigger it with a button click, so we will follow that practice here.
  // use refs instead of getElementById to avoid potential issues with server-side rendering and to follow React best practices.
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddDocument = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];
    if (file) {
      attachDocumentToCustomer(customerId, file);
    }
  };

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <Card className="bg-green-50/70">
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <input type="file" ref={fileInputRef} hidden onChange={handleFileSelected} />
        <Button onClick={handleAddDocument}>
          ➕ Ajouter un document
        </Button>
        <div className="space-y-2">
          {documents.map((document) => (
            <div key={document.id}>
              <DocumentIcon document={document} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
