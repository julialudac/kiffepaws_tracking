import { Upload } from '@/entities/entitites';
import { getDocumentUrl } from '@/utils';

export function DocumentIcon({ document }: { document: Upload }) {
  return (
    <a href={getDocumentUrl(document)} target="_blank" rel="noreferrer noopener">
      <span aria-hidden="true" style={{ display: 'inline-block', width: 24, height: 24, marginRight: 8 }}>
        📄
      </span>
      <span>{document.title}</span>
    </a>
  );
}