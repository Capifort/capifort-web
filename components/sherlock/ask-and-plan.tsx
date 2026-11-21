'use client'

import { useState } from 'react'
import { AlertTriangle, FileText, Table2 } from 'lucide-react'
import { Spinner } from '@/components/spinner'
import type { InvestigationIntent, Plan, PlannerQuestion, PlanStep } from '@/lib/sherlock-api'

const WORKING_MESSAGES: Record<string, string> = {
  interpreting: 'Sherlock is reading your question and the workspace…',
  planning: 'Sherlock is drafting the plan…',
}

const AFFECTS_LABELS: Record<string, string> = {
  population: 'Changes which records are tested',
  criteria: 'Changes the test rule',
  classification: 'Changes how exceptions are classified',
}

export function PlannerWorking({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
      <Spinner size={14} /> {WORKING_MESSAGES[status] || 'Sherlock is working…'}
    </div>
  )
}

export function IntentCard({ intent }: { intent: InvestigationIntent }) {
  const scope = intent.scope
  const scopeItems = [
    scope?.period_start && scope?.period_end ? `${scope.period_start} to ${scope.period_end}` : '',
    scope?.legal_entities?.length ? scope.legal_entities.join(', ') : '',
    scope?.other || '',
  ].filter(Boolean)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">What Sherlock understood</p>
      <p className="mt-2 font-serif text-lg leading-snug text-slate-900">{intent.understood}</p>
      {intent.conditions && intent.conditions.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          {intent.conditions.map((condition) => (
            <li key={condition.id} className="flex gap-2">
              <span className="text-slate-400">{condition.id}</span>
              {condition.description}
            </li>
          ))}
        </ul>
      )}
      {scopeItems.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {scopeItems.map((item) => (
            <span key={item} className="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-600">
              {item}
            </span>
          ))}
        </div>
      )}
      {intent.sources && intent.sources.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {intent.sources.map((source) => (
            <span
              key={source.file_id}
              className="flex items-center gap-1.5 rounded-full bg-[#FBFAF7] px-2.5 py-0.5 text-xs text-slate-600"
            >
              {source.tabular ? (
                <Table2 size={12} strokeWidth={1.75} className="text-emerald-600" />
              ) : (
                <FileText size={12} strokeWidth={1.75} className="text-slate-400" />
              )}
              {source.file_name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function ClarifyCard({
  questions,
  submitting,
  onSubmit,
}: {
  questions: PlannerQuestion[]
  submitting: boolean
  onSubmit: (answers: Record<string, string>) => void
}) {
  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(questions.map((question) => [question.id, question.suggested]))
  )
  const [typedAnswers, setTypedAnswers] = useState<Record<string, string>>({})

  const submitAnswers = () => {
    const chosen = Object.fromEntries(
      questions.map((question) => [question.id, (typedAnswers[question.id] || '').trim() || answers[question.id]])
    )
    onSubmit(chosen)
  }

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-4">
      <p className="text-sm font-semibold text-slate-900">
        {questions.length === 1 ? 'One question before planning' : `${questions.length} questions before planning`}
      </p>
      <div className="mt-3 space-y-5">
        {questions.map((question) => (
          <div key={question.id}>
            <p className="text-sm text-slate-800">{question.text}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              {AFFECTS_LABELS[question.affects]} · {question.why}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {question.options.map((option) => {
                const selected = !typedAnswers[question.id] && answers[question.id] === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setAnswers({ ...answers, [question.id]: option.value })
                      setTypedAnswers({ ...typedAnswers, [question.id]: '' })
                    }}
                    className={`rounded-full border px-3.5 py-1.5 text-xs ${
                      selected
                        ? 'border-slate-900 font-medium text-slate-900 shadow-[inset_0_0_0_1px_#0f172a]'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {option.label}
                    {option.value === question.suggested && <span className="ml-1 text-slate-400">suggested</span>}
                  </button>
                )
              })}
              <input
                value={typedAnswers[question.id] || ''}
                onChange={(event) => setTypedAnswers({ ...typedAnswers, [question.id]: event.target.value })}
                placeholder="Or type an answer"
                className="min-w-[180px] flex-1 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={submitAnswers}
        disabled={submitting}
        className="mt-5 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-40"
      >
        {submitting ? 'Sending…' : 'Continue to plan'}
      </button>
    </div>
  )
}

function stepParams(step: PlanStep) {
  const params = Object.entries(step.params || {}).map(
    ([name, value]) => `${name}: ${typeof value === 'string' ? value : JSON.stringify(value)}`
  )
  const inputs = Object.entries(step.inputs || {}).map(([role, name]) => `${role} ← ${name}`)
  return [...inputs, ...params]
}

export function PlanReview({
  plan,
  approving,
  revising,
  onApprove,
  onRevise,
}: {
  plan: Plan
  approving: boolean
  revising: boolean
  onApprove: () => void
  onRevise: (instruction: string) => void
}) {
  const [instruction, setInstruction] = useState('')
  const errors = plan.validation?.errors || []
  const assumptions = plan.body.assumptions || []
  const answers = plan.body.answers || []

  return (
    <div className="space-y-4">
      {errors.length > 0 && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="flex items-center gap-2 font-medium">
            <AlertTriangle size={14} /> This plan has {errors.length} problem{errors.length > 1 ? 's' : ''} and cannot be
            approved yet
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            {errors.map((error, index) => (
              <li key={index}>
                {error.step_key ? `${error.step_key}: ` : ''}
                {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Plan v{plan.version}</p>
            <p className="mt-1 text-sm text-slate-800">{plan.body.objective}</p>
          </div>
          <button
            onClick={onApprove}
            disabled={approving || errors.length > 0}
            className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-40"
          >
            {approving ? 'Starting…' : `Approve v${plan.version} and run`}
          </button>
        </div>

        <ol className="mt-4">
          {plan.body.steps.map((step, index) => (
            <li key={step.key} className="grid grid-cols-[26px_minmax(0,1fr)_auto] gap-3 border-t border-slate-100 py-3">
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-slate-200 text-[11px] text-slate-500">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{step.title || step.key}</p>
                {step.why && <p className="mt-0.5 text-xs text-slate-500">{step.why}</p>}
                {stepParams(step).length > 0 && (
                  <p className="mt-1 break-words font-mono text-[11px] text-slate-400">{stepParams(step).join(' · ')}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">{step.agent}</p>
                {step.gate && (
                  <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 text-[11px] text-amber-700">
                    after review
                  </span>
                )}
                {step.after && step.after.length > 0 && (
                  <p className="mt-1 text-[11px] text-slate-400">after {step.after.join(', ')}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {(assumptions.length > 0 || answers.length > 0) && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
          {answers.length > 0 && (
            <>
              <p className="text-xs font-medium text-slate-500">Your answers</p>
              <ul className="mt-1 space-y-1 text-slate-700">
                {answers.map((item) => (
                  <li key={item.question}>
                    {item.question} <span className="font-medium">{item.answer}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {assumptions.length > 0 && (
            <>
              <p className="mt-3 text-xs font-medium text-slate-500">Assumptions you can change</p>
              <ul className="mt-1 space-y-1 text-slate-700">
                {assumptions.map((assumption) => (
                  <li key={assumption.key}>
                    <span className="text-slate-400">{assumption.key}:</span> {assumption.value}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-900">Ask for changes</p>
        <p className="mt-0.5 text-xs text-slate-500">Sherlock writes a new version; this one stays as it is.</p>
        <textarea
          value={instruction}
          onChange={(event) => setInstruction(event.target.value)}
          rows={2}
          placeholder="For example: use a 48 hour window and only legal entity IN01"
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
        />
        <button
          onClick={() => {
            onRevise(instruction)
            setInstruction('')
          }}
          disabled={revising || instruction.trim().length < 3}
          className="mt-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 disabled:opacity-40"
        >
          {revising ? 'Sending…' : 'Revise plan'}
        </button>
      </div>
    </div>
  )
}
