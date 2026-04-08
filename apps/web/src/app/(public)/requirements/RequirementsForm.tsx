'use client'

import { useState } from 'react'
import Link from 'next/link'

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
    <div className="rounded-2xl border border-white/[0.06] bg-[#1C1E22]/50 p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-lg">
          💬
        </div>
        <div>
          <h3 className="font-semibold text-[#D9DDE3]">Community Manager</h3>
          <p className="text-xs text-[#6E8FA6]">Kelola Discord server Soraku</p>
        </div>
      </div>

      <select
        value={selectedRole || ''}
        onChange={(e) => setSelectedRole(e.target.value || null)}
        className="w-full rounded-lg border border-white/[0.06] bg-white/5 px-3 py-2 text-sm text-[#D9DDE3] outline-none focus:border-[#4FA3D1]/30"
      >
        <option value="">Pilih peran yang dilamar</option>
        {communityRoles.map((role) => (
          <option key={role.id} value={role.role}>
            {role.role}
          </option>
        ))}
      </select>

      {selectedRole && (
        <div className="mt-4 border-t border-white/[0.06] pt-4">
          {(() => {
            const role = communityRoles.find((r) => r.role === selectedRole)
            if (!role) return null

            return (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xl">{role.icon}</span>
                  <div>
                    <h4 className="font-medium text-[#D9DDE3]">{role.role}</h4>
                    <p className="text-xs text-[#6E8FA6]">{role.desc}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="mb-2 text-xs font-medium text-[#6E8FA6]">Tugas utama:</p>
                  <ul className="space-y-1">
                    {role.tasks.map((task, j) => (
                      <li key={j} className="text-xs text-[#D9DDE3]/70">
                        • {task}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-[#6E8FA6]">Kualifikasi:</p>
                  <ul className="space-y-1">
                    {role.qualifications.map((qual, k) => (
                      <li key={k} className="text-xs text-[#D9DDE3]/70">
                        • {qual}
                      </li>
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
