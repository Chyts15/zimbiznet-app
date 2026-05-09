import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { BUSINESS_ID } from '../config'

export default function Summary() {
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today')

    const sales = useLiveQuery(() =>
        db.sales.where('businessId').equals(BUSINESS_ID).toArray()
    )
    const stockItems = useLiveQuery(() =>
        db.stockItems.where('businessId').equals(BUSINESS_ID).toArray()
    )

    const getStartDate = () => {
        const d = new Date()
        if (period === 'today') d.setHours(0, 0, 0, 0)
        else if (period === 'week') d.setDate(d.getDate() - 7)
        else d.setMonth(d.getMonth() - 1)
        return d
    }

    const filtered = sales?.filter(s =>
        new Date(s.createdAt) >= getStartDate()
    ) || []

    const revenue = filtered.reduce((sum, s) => sum + s.totalAmount, 0)
    const cost = filtered.reduce((sum, s) => {
        const item = stockItems?.find(i => i.id === s.itemId)
        return sum + (item ? item.buyPrice * s.quantity : 0)
    }, 0)
    const profit = revenue - cost

    const byMode = filtered.reduce((acc: any, s) => {
        acc[s.paymentMode] = (acc[s.paymentMode] || 0) + s.totalAmount
        return acc
    }, {})

    return (
        <div className="p-4 min-h-screen" style={{ color: '#F0F0F0' }}>
            <h2 className="text-2xl font-bold mb-6">Summary</h2>

            {/* Period toggle */}
            <div className="flex rounded-xl p-1 mb-6" style={{ background: '#1A1A1A' }}>
                {(['today', 'week', 'month'] as const).map(p => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                        style={{
                            background: period === p ? '#C8FF00' : 'transparent',
                            color: period === p ? '#0D0D0D' : '#666'
                        }}
                    >
                        {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
                    </button>
                ))}
            </div>

            {/* Revenue */}
            <div className="rounded-xl p-5 mb-3" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#666' }}>Revenue</p>
                <p className="text-4xl font-black" style={{ color: '#C8FF00' }}>${revenue.toFixed(2)}</p>
            </div>

            {/* Cost + Profit */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl p-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                    <p className="text-xs mb-1" style={{ color: '#666' }}>Cost</p>
                    <p className="text-2xl font-bold">${cost.toFixed(2)}</p>
                </div>
                <div className="rounded-xl p-4" style={{
                    background: profit >= 0 ? '#0A1A00' : '#1A0000',
                    border: `1px solid ${profit >= 0 ? '#C8FF00' : '#FF3B3B'}`
                }}>
                    <p className="text-xs mb-1" style={{ color: '#666' }}>Profit</p>
                    <p className="text-2xl font-bold" style={{ color: profit >= 0 ? '#C8FF00' : '#FF3B3B' }}>
                        ${profit.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Payment breakdown */}
            {Object.keys(byMode).length > 0 && (
                <div className="rounded-xl p-4 mb-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#666' }}>Payment Methods</p>
                    {Object.entries(byMode).map(([mode, amount]: any) => (
                        <div key={mode} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #2A2A2A' }}>
                            <p className="text-sm capitalize" style={{ color: '#AAA' }}>{mode}</p>
                            <p className="text-sm font-bold" style={{ color: '#C8FF00' }}>${amount.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Recent sales */}
            {filtered.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#666' }}>Recent Sales</p>
                    {filtered.slice(-10).reverse().map(sale => {
                        const item = stockItems?.find(i => i.id === sale.itemId)
                        return (
                            <div key={sale.id} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid #1A1A1A' }}>
                                <div>
                                    <p className="text-sm font-medium">{item?.name || 'Unknown item'}</p>
                                    <p className="text-xs" style={{ color: '#666' }}>
                                        {sale.quantity}x · {sale.paymentMode} · {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <p className="text-sm font-bold" style={{ color: '#C8FF00' }}>${sale.totalAmount.toFixed(2)}</p>
                            </div>
                        )
                    })}
                </div>
            )}

            <p className="text-center text-xs mt-4" style={{ color: '#444' }}>{filtered.length} sales in this period</p>
        </div>
    )
}