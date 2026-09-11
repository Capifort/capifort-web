'use client'

import { useState } from 'react'
import { MembersTab } from '@/components/settings/members-tab'
import { DomainTab } from '@/components/settings/domain-tab'

type SettingsTab = 'members' | 'domain'

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'members', label: 'Members' },
  { id: 'domain', label: 'Domain' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('members')

  return (
    <div className="min-h-dvh">
      <div className="border-b border-slate-100 bg-white px-8 py-6">
        <h1 className="text-lg font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your organization's members and permissions.</p>

        <div className="mt-5 flex gap-1 border-b border-slate-100">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-violet-600 text-violet-700'
                  : 'border-b-2 border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-8">
        {activeTab === 'members' ? <MembersTab /> : <DomainTab />}
      </div>
    </div>
  )
}
