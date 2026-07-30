/**
 * Inline SVG brand marks for the integrations / pipeline sections.
 * Inlined instead of loaded as images so the logo walls cost zero network
 * requests and inherit crisp rendering at any tile size.
 *
 * Brands whose real mark is a wordmark (or is not legible below 24px) are
 * rendered as a brand-coloured letter tile, which is how they appear in most
 * connector directories.
 */

export type BrandName =
  | 'pdf' | 'word' | 'excel' | 'powerpoint' | 'csv'
  | 'postgres' | 'mysql' | 'snowflake' | 'bigquery' | 'redshift'
  | 'slack' | 'notion' | 'confluence' | 'drive' | 'sharepoint'
  | 'github' | 'gitlab' | 'bitbucket'
  | 's3' | 'azure' | 'gcs' | 'dropbox' | 'box'
  | 'salesforce' | 'sap' | 'microsoft' | 'rest' | 'webhook'

export const brandLabels: Record<BrandName, string> = {
  pdf: 'PDF',
  word: 'Microsoft Word',
  excel: 'Microsoft Excel',
  powerpoint: 'Microsoft PowerPoint',
  csv: 'CSV',
  postgres: 'PostgreSQL',
  mysql: 'MySQL',
  snowflake: 'Snowflake',
  bigquery: 'Google BigQuery',
  redshift: 'Amazon Redshift',
  slack: 'Slack',
  notion: 'Notion',
  confluence: 'Confluence',
  drive: 'Google Drive',
  sharepoint: 'Microsoft SharePoint',
  github: 'GitHub',
  gitlab: 'GitLab',
  bitbucket: 'Bitbucket',
  s3: 'Amazon S3',
  azure: 'Azure Blob Storage',
  gcs: 'Google Cloud Storage',
  dropbox: 'Dropbox',
  box: 'Box',
  salesforce: 'Salesforce',
  sap: 'SAP',
  microsoft: 'Microsoft 365',
  rest: 'REST APIs',
  webhook: 'Webhooks',
}

function LetterMark({ label, color, className }: { label: string; color: string; className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-hidden>
      <rect width="24" height="24" rx="5.5" fill={color} />
      <text
        x="12"
        y="12.4"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={label.length > 2 ? 6.8 : 9}
        fontWeight="800"
        fill="#fff"
      >
        {label}
      </text>
    </svg>
  )
}

export function BrandLogo({ brand, className = 'h-6 w-6' }: { brand: BrandName; className?: string }) {
  const shared = { className, viewBox: '0 0 24 24', role: 'img' as const, 'aria-label': brandLabels[brand] }

  switch (brand) {
    case 'slack':
      return (
        <svg {...shared}>
          <rect x="4.2" y="0.6" width="5.2" height="13.2" rx="2.6" fill="#36C5F0" />
          <rect x="10.2" y="4.2" width="13.2" height="5.2" rx="2.6" fill="#2EB67D" />
          <rect x="14.6" y="10.2" width="5.2" height="13.2" rx="2.6" fill="#ECB22E" />
          <rect x="0.6" y="14.6" width="13.2" height="5.2" rx="2.6" fill="#E01E5A" />
        </svg>
      )

    case 'notion':
      return (
        <svg {...shared}>
          <rect x="1.2" y="1.2" width="21.6" height="21.6" rx="4.5" fill="#fff" stroke="#0F172A" strokeWidth="1.6" />
          <path d="M8.2 17.2V6.8l7.6 10.4V6.8" stroke="#0F172A" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      )

    case 'drive':
      return (
        <svg {...shared}>
          <path d="M12 2.2 12 9 7.14 17.4 1.2 20.8 12 2.2z" fill="#00AC47" />
          <path d="M12 2.2 22.8 20.8 16.86 17.4 12 9 12 2.2z" fill="#FFBA00" />
          <path d="M1.2 20.8 7.14 17.4h9.72l5.94 3.4H1.2z" fill="#2684FC" />
        </svg>
      )

    case 'github':
      return (
        <svg {...shared}>
          <path
            fill="#181717"
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
          />
        </svg>
      )

    case 'gitlab':
      return (
        <svg {...shared}>
          <path d="M12 21.7 9 10.2h6l-3 11.5z" fill="#E24329" />
          <path d="M12 3 15 10.2H9L12 3z" fill="#E24329" />
          <path d="M12 21.7 9 10.2H0.6L12 21.7z" fill="#FC6D26" />
          <path d="M12 21.7 15 10.2h8.4L12 21.7z" fill="#FC6D26" />
          <path d="M0.6 10.2h4.9L3 5.1 0.6 10.2z" fill="#FCA326" />
          <path d="M23.4 10.2h-4.9L21 5.1l2.4 5.1z" fill="#FCA326" />
        </svg>
      )

    case 'snowflake':
      return (
        <svg {...shared} strokeLinecap="round">
          <g stroke="#29B5E8" strokeWidth="2.2">
            <line x1="12" y1="2.8" x2="12" y2="21.2" />
            <line x1="4" y1="7.4" x2="20" y2="16.6" />
            <line x1="4" y1="16.6" x2="20" y2="7.4" />
          </g>
          <circle cx="12" cy="12" r="2.6" fill="#29B5E8" />
        </svg>
      )

    case 'dropbox':
      return (
        <svg {...shared}>
          <g fill="#0061FF">
            <path d="M6.5 2 12 5.9 6.5 9.8 1 5.9 6.5 2z" />
            <path d="M17.5 2 23 5.9 17.5 9.8 12 5.9 17.5 2z" />
            <path d="M12 9.9 17.5 13.8 12 17.7 6.5 13.8 12 9.9z" />
            <path d="M6.5 15.2 12 18.8 17.5 15.2v1.6L12 21.8l-5.5-5v-1.6z" opacity=".85" />
          </g>
        </svg>
      )

    case 'microsoft':
    case 'sharepoint':
      return (
        <svg {...shared}>
          <rect x="2" y="2" width="9" height="9" fill="#F25022" />
          <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
          <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
          <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
        </svg>
      )

    case 'salesforce':
      return (
        <svg {...shared}>
          <g fill="#00A1E0">
            <circle cx="8.6" cy="13.4" r="4.6" />
            <circle cx="12.8" cy="10.4" r="5.4" />
            <circle cx="17.4" cy="13.8" r="4" />
            <rect x="4" y="13.2" width="16" height="4.8" rx="2.4" />
          </g>
        </svg>
      )

    case 'webhook':
      return (
        <svg {...shared} fill="none" stroke="#4F46E5" strokeWidth="2.1" strokeLinecap="round">
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="18" r="3" />
          <circle cx="12" cy="6" r="3" />
          <path d="M10.4 8.6 7.4 15M13.6 8.6l3 6.4M9 18h6" />
        </svg>
      )

    case 'pdf': return <LetterMark label="PDF" color="#E5252A" className={className} />
    case 'word': return <LetterMark label="W" color="#2B579A" className={className} />
    case 'excel': return <LetterMark label="X" color="#217346" className={className} />
    case 'powerpoint': return <LetterMark label="P" color="#C43E1C" className={className} />
    case 'csv': return <LetterMark label="CSV" color="#0F766E" className={className} />
    case 'postgres': return <LetterMark label="PG" color="#336791" className={className} />
    case 'mysql': return <LetterMark label="My" color="#00758F" className={className} />
    case 'bigquery': return <LetterMark label="BQ" color="#4285F4" className={className} />
    case 'redshift': return <LetterMark label="RS" color="#8C4FFF" className={className} />
    case 'confluence': return <LetterMark label="CF" color="#0052CC" className={className} />
    case 'bitbucket': return <LetterMark label="BB" color="#2684FF" className={className} />
    case 's3': return <LetterMark label="S3" color="#E25444" className={className} />
    case 'azure': return <LetterMark label="Az" color="#0078D4" className={className} />
    case 'gcs': return <LetterMark label="GCS" color="#1A73E8" className={className} />
    case 'box': return <LetterMark label="box" color="#0061D5" className={className} />
    case 'sap': return <LetterMark label="SAP" color="#0A6ED1" className={className} />
    case 'rest': return <LetterMark label="API" color="#334155" className={className} />
  }
}
