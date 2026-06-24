'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Role {
  id: string
  role: string
  icon: string
  accent: string
  desc: string
  tasks: string[]
  qualifications: string[]
}

interface Props {
  communityRoles: Role[]
}

export default function RequirementsForm({ communityRoles }: Props) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  return (
    <div className="rounded-md border-2 border-black bg-surface p-6 shadow-[3px_3px_0px_#000]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-black bg-primary/20 text-lg">
          💬
        </div>
        <div>
          <h3 className="font-bold text-foreground">Community Manager</h3>
          <p className="text-xs text-muted">Kelola Discord server Soraku</p>
        </div>
      </div>

      <div className="relative">
        <select
          value={selectedRole || ''}
          onChange={(e) => setSelectedRole(e.target.value || null)}
          className="w-full appearance-none rounded-md border-2 border-black bg-surface px-3 py-2.5 pr-8 text-sm font-bold text-foreground focus:border-primary focus:outline-none"
        >
          <option value="">Pilih peran yang dilamar</option>
          {communityRoles.map((role) => (
            <option key={role.id} value={role.role}>
              {role.role}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>

      {selectedRole && (
        <div className="mt-4 border-t-2 border-black pt-4">
          {(() => {
            const role = communityRoles.find((r) => r.role === selectedRole)
            if (!role) return null

            return (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xl">{role.icon}</span>
                  <div>
                    <h4 className="font-bold text-foreground">{role.role}</h4>
                    <p className="text-xs text-muted">{role.desc}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="mb-2 text-xs font-bold text-muted">Tugas utama:</p>
                  <ul className="space-y-1">
                    {role.tasks.map((task, j) => (
                      <li key={j} className="text-xs text-muted">• {task}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold text-muted">Kualifikasi:</p>
                  <ul className="space-y-1">
                    {role.qualifications.map((qual, k) => (
                      <li key={k} className="text-xs text-muted">• {qual}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
