'use client';

import { Paperclip, Upload, X } from 'lucide-react';
import { useId, useState, type DragEvent } from 'react';
import { cn } from '@/lib/cn';
import { formatNumber } from '@/lib/format';

export const TZ_ACCEPT = '.pdf,.doc,.docx,.dwg,.zip';
export const TZ_MAX_BYTES = 25 * 1024 * 1024;

const sizeText = (b: number) => (b > 1024 * 1024 ? `${formatNumber(Math.round(b / 104857.6) / 10)} МБ` : `${formatNumber(Math.ceil(b / 1024))} КБ`);

/** components/file-upload.md — пунктирная зона; PDF, DOCX, DWG, ZIP до 25 МБ. */
export function FileUpload({ file, onFile, uploading, accept = TZ_ACCEPT, maxSize = TZ_MAX_BYTES }: { file: File | null; onFile: (f: File | null) => void; uploading?: boolean; accept?: string; maxSize?: number }) {
  const id = useId();
  const [error, setError] = useState<string>();
  const [over, setOver] = useState(false);

  const take = (f: File | undefined) => {
    if (!f) return;
    const ext = `.${f.name.split('.').pop()?.toLowerCase()}`;
    if (!accept.split(',').includes(ext)) {
      setError('Этот формат не подходит: нужен PDF, DOC, DOCX, DWG или ZIP');
      return;
    }
    if (f.size > maxSize) {
      setError(`Файл ${sizeText(f.size)} — больше 25 МБ. Сожмите в ZIP или пришлите ссылку в комментарии`);
      return;
    }
    setError(undefined);
    onFile(f);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    take(e.dataTransfer.files[0]);
  };

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-border-default p-3">
        <Paperclip className="size-icon shrink-0 text-accent-default" strokeWidth={1.5} aria-hidden="true" />
        <span className="flex flex-1 flex-col">
          <span className="type-body break-all">{file.name}</span>
          <span className="type-small text-text-muted nums">{uploading ? 'Загружаем…' : sizeText(file.size)}</span>
        </span>
        <button type="button" onClick={() => onFile(null)} aria-label={`Убрать файл ${file.name}`} disabled={uploading} className="flex size-tap cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-text-default hover:bg-tint-ink disabled:opacity-disabled">
          <X className="size-icon" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed p-6 text-center hover:border-border-accent has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus-ring',
          over || error ? 'border-border-accent' : 'border-border-input-hover',
        )}
      >
        <Upload className="size-icon-lg text-accent-default" strokeWidth={1.5} aria-hidden="true" />
        <span className="type-body">Прикрепите ТЗ или перетащите файл сюда</span>
        <span className="type-small text-text-muted">PDF, DOCX, DWG, ZIP — до 25 МБ</span>
        <input id={id} type="file" accept={accept} className="sr-only" onChange={(e) => take(e.target.files?.[0])} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-e` : undefined} />
      </label>
      {error ? (
        <p id={`${id}-e`} role="alert" className="m-0 type-small text-status-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
