import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { BUSINESS_ID } from '../config'

export default function Dashboard() {
    const items = useLiveQuery(() =>
        db.stockItems.where('businessId').equals(BUSINESS_ID).toArray()
    )
    const sales = useLiveQuery(() =>
        db.sales.where('businessId').equals(BUSINESS_ID).toArray()
    )
    const customers = useLiveQuery(() =>
        db.creditCustomers.where('businessId').equals(BUSINESS_ID).toArray()
    )
    const entries = useLiveQuery(() =>
        db.creditEntries.where('paid').equals(0).toArray()
    )

    const todaySales = sales?.filter(s => {
        const today = new Date().toDateString()
        return new Date(s.createdAt).toDateString() === today
    }) || []

    const todayRevenue = todaySales.reduce((sum, s) => sum + s.totalAmount, 0)
    const usdSales = todaySales.filter(s => s.paymentMode === 'usd' || s.paymentMode === 'cash').reduce((sum, s) => sum + s.totalAmount, 0)
    const ecocashSales = todaySales.filter(s => s.paymentMode === 'ecocash').reduce((sum, s) => sum + s.totalAmount, 0)
    const zigSales = todaySales.filter(s => s.paymentMode === 'zig').reduce((sum, s) => sum + s.totalAmount, 0)
    const lowStock = items?.filter(i => i.quantity <= i.reorderLevel) || []
    const totalOwed = entries?.reduce((sum, e) => sum + e.amount, 0) || 0

    return (
        <div className="p-4 min-h-screen" style={{ color: '#F0F0F0' }}>

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium mb-1" style={{ color: '#C8FF00' }}>Masikati!</p>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                </div>
                {/* Zimbabwe bird emblem hint */}
                <div style={{ color: '#C8FF00', opacity: 0.6 }}>
                    <ZimbabweBird />
                </div>
            </div>

            {/* Revenue card */}
            <div className="rounded-2xl p-5 mb-4 relative overflow-hidden" style={{ background: '#C8FF00' }}>
                <p className="text-sm font-semibold relative" style={{ color: '#1A1A1A' }}>Total Today</p>
                <p className="text-5xl font-black relative mt-1" style={{ color: '#0D0D0D' }}>${todayRevenue.toFixed(2)}</p>
                <p className="text-sm relative mt-1" style={{ color: '#1A3A00' }}>{todaySales.length} sales made</p>
            </div>

            {/* Cash balance breakdown */}
            <p className="text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: '#666' }}>Cash Balance</p>
            <div className="space-y-2 mb-4">
                {[
                    { label: 'USD Cash', amount: usdSales, icon: '$', color: '#1A5C1A' },
                    { label: 'EcoCash', amount: ecocashSales, icon: '📱', color: '#1A1A5C' },
                    { label: 'ZiG', amount: zigSales, icon: 'Z', color: '#5C3A1A' },
                ].map(({ label, amount, icon, color }) => (
                    <div key={label} className="rounded-xl p-4 flex items-center gap-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: color }}>
                            {icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: '#AAA' }}>{label}</p>
                            <p className="text-xl font-bold">${amount.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl p-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                    <p className="text-xs mb-1" style={{ color: '#666' }}>Stock Items</p>
                    <p className="text-3xl font-black" style={{ color: '#C8FF00' }}>{items?.length || 0}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                    <p className="text-xs mb-1" style={{ color: '#666' }}>Credit Customers</p>
                    <p className="text-3xl font-black" style={{ color: '#C8FF00' }}>{customers?.length || 0}</p>
                </div>
            </div>

            {/* Alerts */}
            {lowStock.length > 0 && (
                <div className="rounded-xl p-4 mb-3" style={{ background: '#1A0A00', border: '1px solid #FF6B00' }}>
                    <p className="text-sm font-semibold mb-1" style={{ color: '#FF6B00' }}>⚠️ Low Stock</p>
                    {lowStock.map(item => (
                        <p key={item.id} className="text-sm" style={{ color: '#FF9B50' }}>
                            {item.name} — only {item.quantity} left
                        </p>
                    ))}
                </div>
            )}

            {totalOwed > 0 && (
                <div className="rounded-xl p-4" style={{ background: '#1A0000', border: '1px solid #FF3B3B' }}>
                    <p className="text-sm font-semibold" style={{ color: '#FF3B3B' }}>📒 Outstanding Credit</p>
                    <p className="text-sm mt-1" style={{ color: '#FF7070' }}>${totalOwed.toFixed(2)} owed to you</p>
                </div>
            )}
        </div>
    )
}

function ZimbabweBird() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 4 C16 4 12 6 10 9 C8 12 9 14 9 14 C9 14 7 13 6 14 C5 15 6 17 8 17 C8 17 7 19 8 20 C9 21 11 20 12 19 L12 26 C12 27 13 28 16 28 C19 28 20 27 20 26 L20 19 C21 20 23 21 24 20 C25 19 24 17 24 17 C26 17 27 15 26 14 C25 13 23 14 23 14 C23 14 24 12 22 9 C20 6 16 4 16 4 Z" fill="currentColor"/>
            <circle cx="13" cy="10" r="1" fill="#0D0D0D"/>
        </svg>
    )
}