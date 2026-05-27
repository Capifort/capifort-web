import { type ElementType, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

// ── Polymorphic base ───────────────────────────────────

type PolymorphicProps<T extends ElementType> = {
  as?: T
  children?: React.ReactNode
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>


// ── Display XL ─────────────────────────────────────────
// Monumental hero headlines. Fluid: 56px → 152px.

export function DisplayXL<T extends ElementType = 'h1'>({
  as,
  children,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? 'h1') as ElementType
  return (
    <Tag className={cn('type-display-xl', className)} {...props}>
      {children}
    </Tag>
  )
}


// ── Display ────────────────────────────────────────────
// Section headlines. Fluid: 40px → 112px.

export function Display<T extends ElementType = 'h2'>({
  as,
  children,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? 'h2') as ElementType
  return (
    <Tag className={cn('type-display', className)} {...props}>
      {children}
    </Tag>
  )
}


// ── Editorial Statement ────────────────────────────────
// Large supporting text. Fluid: 24px → 56px. Light weight.

export function EditorialStatement<T extends ElementType = 'p'>({
  as,
  children,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? 'p') as ElementType
  return (
    <Tag className={cn('type-editorial', className)} {...props}>
      {children}
    </Tag>
  )
}


// ── Statement ──────────────────────────────────────────
// Mid-size statement text. Fluid: 20px → 40px.

export function Statement<T extends ElementType = 'p'>({
  as,
  children,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? 'p') as ElementType
  return (
    <Tag className={cn('type-statement', className)} {...props}>
      {children}
    </Tag>
  )
}


// ── Headline ───────────────────────────────────────────
// Fixed 30px. Card/panel titles, section markers.

export function Headline<T extends ElementType = 'h3'>({
  as,
  children,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? 'h3') as ElementType
  return (
    <Tag className={cn('type-headline', className)} {...props}>
      {children}
    </Tag>
  )
}


// ── Title ──────────────────────────────────────────────
// Fixed 24px. Component titles, list headings.

export function Title<T extends ElementType = 'h4'>({
  as,
  children,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? 'h4') as ElementType
  return (
    <Tag className={cn('type-title', className)} {...props}>
      {children}
    </Tag>
  )
}


// ── Body ───────────────────────────────────────────────
// 15px body copy. Default for paragraphs.

export function Body<T extends ElementType = 'p'>({
  as,
  children,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? 'p') as ElementType
  return (
    <Tag className={cn('type-body', className)} {...props}>
      {children}
    </Tag>
  )
}


// ── System Label ───────────────────────────────────────
// 11px monospace uppercase. Category tags, system identifiers.

export function SystemLabel<T extends ElementType = 'span'>({
  as,
  children,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? 'span') as ElementType
  return (
    <Tag className={cn('type-label', className)} {...props}>
      {children}
    </Tag>
  )
}


// ── Mono Meta ──────────────────────────────────────────
// 13px monospace. Timestamps, IDs, data fields.

export function MonoMeta<T extends ElementType = 'span'>({
  as,
  children,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? 'span') as ElementType
  return (
    <Tag className={cn('type-mono', className)} {...props}>
      {children}
    </Tag>
  )
}


// ── Mono Large ─────────────────────────────────────────
// 15px monospace. Larger data display, terminal-style readouts.

export function MonoLarge<T extends ElementType = 'span'>({
  as,
  children,
  className,
  ...props
}: PolymorphicProps<T>) {
  const Tag = (as ?? 'span') as ElementType
  return (
    <Tag className={cn('type-mono-lg', className)} {...props}>
      {children}
    </Tag>
  )
}
