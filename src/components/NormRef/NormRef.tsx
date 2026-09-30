import { FileText } from 'lucide-react';

export interface NormRefProps {
  code: string;
  /** Пункт — только если подтверждён инженером */
  clause?: string;
  href?: string;
}

const normClasses =
  'inline-flex items-center gap-2 border whitespace-nowrap border-norm-border px-2 py-1 font-code text-xs leading-tight text-norm-fg no-underline';

export function NormRef({ code, clause, href }: NormRefProps) {
  const body = (
    <>
      <FileText className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      <span>
        {code}
        {clause ? ` п. ${clause}` : null}
      </span>
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${normClasses} hover:bg-norm-bg-hover`}>
      {body}
    </a>
  ) : (
    <span className={normClasses}>{body}</span>
  );
}
