'use client'

import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import { Spinner } from '@/components/spinner'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const MAX_PAGE_WIDTH = 900

export type ViewerFocus = {
  page: number
  bbox?: number[] | null
  versionId?: string | null
  terms: string[]
}

export default function PdfPages({
  url,
  focus,
  shownVersionId,
}: {
  url: string
  focus?: ViewerFocus
  shownVersionId: string | null
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pageCount, setPageCount] = useState(0)
  const [pageWidth, setPageWidth] = useState(0)
  const [pageAspect, setPageAspect] = useState(1.414)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => setPageWidth(Math.min(container.clientWidth - 32, MAX_PAGE_WIDTH)))
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const bbox = focus?.bbox && (!focus.versionId || focus.versionId === shownVersionId) ? focus.bbox : null

  return (
    <div ref={containerRef} className="h-full w-full overflow-y-auto">
      <Document
        file={url}
        onLoadSuccess={(pdf) => {
          setPageCount(pdf.numPages)
          pdf.getPage(1).then((firstPage) => {
            const viewport = firstPage.getViewport({ scale: 1 })
            setPageAspect(viewport.height / viewport.width)
          })
        }}
        loading={
          <div className="flex h-full items-center justify-center gap-2 py-20 text-sm text-slate-400">
            <Spinner size={15} />
            Opening document…
          </div>
        }
        error={<p className="py-20 text-center text-sm text-red-600">Couldn&apos;t open this document.</p>}
        className="flex flex-col items-center gap-4 py-4"
      >
        {pageWidth > 0 &&
          Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <LazyPage
              key={pageNumber}
              pageNumber={pageNumber}
              width={pageWidth}
              placeholderHeight={pageWidth * pageAspect}
              isFocus={focus?.page === pageNumber}
              bbox={focus?.page === pageNumber ? bbox : null}
              terms={focus?.page === pageNumber && !bbox ? focus.terms : []}
            />
          ))}
      </Document>
    </div>
  )
}

function LazyPage({
  pageNumber,
  width,
  placeholderHeight,
  isFocus,
  bbox,
  terms,
}: {
  pageNumber: number
  width: number
  placeholderHeight: number
  isFocus: boolean
  bbox: number[] | null
  terms: string[]
}) {
  const pageRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(isFocus)
  const [scale, setScale] = useState(0)

  useEffect(() => {
    const page = pageRef.current
    if (!page) return
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setIsVisible(true), {
      rootMargin: '1200px 0px',
    })
    observer.observe(page)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isFocus) pageRef.current?.scrollIntoView({ block: 'start' })
  }, [isFocus])

  const centerHighlight = () => {
    if (!isFocus) return
    ;(highlightRef.current || pageRef.current)?.scrollIntoView({ block: 'center' })
  }

  return (
    <div ref={pageRef} className="bg-white shadow-sm" style={{ width, minHeight: placeholderHeight }}>
      {isVisible && (
        <Page
          pageNumber={pageNumber}
          width={width}
          renderAnnotationLayer={false}
          onLoadSuccess={(page) => setScale(width / page.originalWidth)}
          onRenderSuccess={centerHighlight}
          customTextRenderer={terms.length ? ({ str }) => markTerms(str, terms) : undefined}
          loading={<div style={{ width, height: placeholderHeight }} />}
        >
          {bbox && scale > 0 && (
            <div
              ref={highlightRef}
              className="pointer-events-none absolute z-10 rounded-sm bg-amber-300/35 ring-2 ring-amber-400"
              style={{
                left: bbox[0] * scale - 3,
                top: bbox[1] * scale - 3,
                width: (bbox[2] - bbox[0]) * scale + 6,
                height: (bbox[3] - bbox[1]) * scale + 6,
              }}
            />
          )}
        </Page>
      )}
    </div>
  )
}

function markTerms(text: string, terms: string[]) {
  const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const escapedTerms = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const matcher = new RegExp(`(${escapedTerms.join('|')})`, 'gi')
  return escapedText.replace(matcher, '<mark style="background: rgba(252, 211, 77, 0.5); color: transparent">$1</mark>')
}
