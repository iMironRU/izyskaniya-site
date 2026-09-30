'use client';

import { Paperclip, Upload, X } from 'lucide-react';
import { useId, useState, type DragEvent } from 'react';
import { cn } from '@/lib/cn';
import { formatNumber } from '@/lib/format';

/** ТЗ и границы объекта в любом виде: документы, kml/kmz, dwg/dxf, таблицы координат, скриншоты карты. */
export const TZ_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.dwg,.dxf,.kml,.kmz,.zip,.jpg,.jpeg,.png';
export const TZ_MAX_BYTES = 25 * 1024 * 1024;

const sizeText = (b: number) => (b > 1024 * 1024 ? `${formatNumber(Math.round(b / 104857.6) / 10)} МБ` : `${formatNumber(Math.ceil(b / 1024))} КБ`);

/**
 * components/file-upload.md — пунктирная зона. Несколько файлов, вместе до 25 МБ.
 * Корпоративные заказчики присылают границы файлами — принимаем kml/kmz, dwg/dxf и координаты.
 */
export function FileUpload({ files, onFiles, uploading, accept = TZ_ACCEPT, maxSize = TZ_MAX_BYTES }: { files: File[]; onFiles: (f: File[]) => void; uploading?: boolean; accept?: string; maxSize?: number }) {
  const id = useId();
  const [error, setError] = useState<string>();
  const [over, setOver] = useState(false);
  const total = files.reduce((s, f) => s + f.size, 0);

  const take = (list: FileList | null | undefined) => {
    if (!list?.length) return;
    const allowed = accept.split(',');
    const incoming = [...list];
    const bad = incoming.find((f) => !allowed.includes(`.${f.name.split('.').pop()?.toLowerCase()}`));
    if (bad) {
      setError(`«${bad.name}» — такой формат не принимаем. Подойдут PDF, Word, Excel, DWG/DXF, KML/KMZ, координаты (CSV/TXT), ZIP или картинка`);
      return;
    }
    const next = [...files, ...incoming.filter((f) => !files.some((x) => x.name === f.name && x.size === f.size))];
    const sum = next.reduce((s, f) => s + f.size, 0);
    if (sum > maxSize) {
      setError(`Вместе ${sizeText(sum)} — больше 25 МБ. Сожмите в ZIP или пришлите ссылку в комментарии`);
      return;
    }
    setError(undefined);
    onFiles(next);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    take(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-2">
      {files.length ? (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {files.map((f) => (
            <li key={`${f.name}-${f.size}`} className="flex items-center gap-3 rounded-md border border-border-default p-3">
              <Paperclip className="size-icon shrink-0 text-accent-default" strokeWidth={1.5} aria-hidden="true" />
              <span className="flex flex-1 flex-col">
                <span className="type-body break-all">{f.name}</span>
                <span className="type-small text-text-muted nums">{uploading ? 'Загружаем…' : sizeText(f.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => onFiles(files.filter((x) => x !== f))}
                aria-label={`Убрать файл ${f.name}`}
                disabled={uploading}
                className="flex size-tap cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-text-default hover:bg-tint-ink disabled:opacity-disabled"
              >
                <X className="size-icon" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed text-center hover:border-border-accent has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus-ring',
          files.length ? 'p-3' : 'p-6',
          over || error ? 'border-border-accent' : 'border-border-input-hover',
        )}
      >
        <Upload className="size-icon-lg text-accent-default" strokeWidth={1.5} aria-hidden="true" />
        <span className="type-body">{files.length ? 'Добавить ещё файл' : 'Прикрепите ТЗ и границы объекта или перетащите файлы сюда'}</span>
        <span className="type-small text-text-muted">
          ТЗ, KML/KMZ, DWG/DXF, координаты, скриншот карты — вместе до 25 МБ{files.length ? ` · сейчас ${sizeText(total)}` : ''}
        </span>
        <input
          id={id}
          type="file"
          multiple
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            take(e.target.files);
            e.target.value = '';
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-e` : undefined}
        />
      </label>
      {error ? (
        <p id={`${id}-e`} role="alert" className="m-0 type-small text-status-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
