import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from '@/entities/entitites';
import { DocumentIcon } from './DocumentIcon';

export function DocumentsView({ documents }: { documents?: Upload[] }) {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <Card className="bg-green-50/70">
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
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
