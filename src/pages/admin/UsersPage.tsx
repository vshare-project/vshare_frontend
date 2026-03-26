import { useState } from 'react'
import { Search, User, Ban, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import type { User as UserType } from '@/types/user.types'
import { formatDate } from '@/utils/format'

const MOCK: UserType[] = [
  { id: '1', fullName: 'Nguyễn Văn An',  email: 'an@example.com',   phone: '0901234567', role: 'USER',  status: 'ACTIVE',   createdAt: '2024-01-15T08:00:00', totalRides: 23 },
  { id: '2', fullName: 'Trần Thị Bình',  email: 'binh@example.com', phone: '0912345678', role: 'USER',  status: 'ACTIVE',   createdAt: '2024-02-10T08:00:00', totalRides: 7  },
  { id: '3', fullName: 'Lê Văn Cường',   email: 'cuong@example.com',phone: '0923456789', role: 'STAFF', status: 'ACTIVE',   createdAt: '2023-12-01T08:00:00', totalRides: 0  },
  { id: '4', fullName: 'Phạm Thị Dung',  email: 'dung@example.com', phone: '0934567890', role: 'USER',  status: 'BANNED',   createdAt: '2024-01-20T08:00:00', totalRides: 2  },
  { id: '5', fullName: 'Hoàng Văn Em',   email: 'em@example.com',   phone: '0945678901', role: 'ADMIN', status: 'ACTIVE',   createdAt: '2023-11-01T08:00:00', totalRides: 0  },
]

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const filtered = MOCK.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  const roleVariant = (r: string) => r === 'ADMIN' ? 'danger' : r === 'STAFF' ? 'warning' : 'default'
  const statusVariant = (s: string) => s === 'ACTIVE' ? 'success' : 'danger'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Người dùng</h1>
        <p className="text-sm text-gray-400 mt-1">Quản lý tài khoản người dùng</p>
      </div>

      <div className="max-w-sm">
        <Input placeholder="Tìm theo tên, email..." leftIcon={<Search className="w-4 h-4" />}
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400">
                  {['Người dùng','Email','SĐT','Vai trò','Trạng thái','Chuyến đi','Ngày tạo','Hành động'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5 text-brand-400" />
                        </div>
                        <span className="font-medium text-gray-800 text-xs whitespace-nowrap">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-9000 text-xs">{u.email}</td>
                    <td className="px-5 py-3 font-mono text-gray-9000 text-xs">{u.phone}</td>
                    <td className="px-5 py-3"><Badge variant={roleVariant(u.role)}>{u.role}</Badge></td>
                    <td className="px-5 py-3"><Badge variant={statusVariant(u.status)}>{u.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khoá'}</Badge></td>
                    <td className="px-5 py-3 font-mono text-xs text-brand-600">{u.totalRides}</td>
                    <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 hover:text-red-400 transition-colors"><Ban className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            Hiển thị {filtered.length}/{MOCK.length} người dùng
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
