import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { BUSINESS_ID } from '../config'

export default function Sell() {
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [qty, setQty] = useState('1')
    const [mode, setMode] = useState('cash')
    const [done, setDone] = useState(false)

    const items = useLiveQuery(() =>
        db.stockItems.where('businessId').equals(BUSINESS_ID).toArray()
    )

    const sell = async () => {
        if (!selectedItem) return
        const quantity = Number(qty)
        if (quantity > selectedItem.quantity) return alert('Not enough stock')
        await db.stockItems.update(selectedItem.id, {
            quantity: selectedItem.quantity - quantity
        })
        await db.sales.add({
            id: crypto.randomUUID(),
            itemId: selectedItem.id,
            businessId: BUSINESS_ID,
            quantity,
            totalAmount: selectedItem.sellPrice * quantity,
            currency: selectedItem.currency,
            paymentMode: mode,
            createdAt: new Date().toISOString(),
            synced: false
        })
        setDone(true)
        setTimeout(() => {
            setSelectedItem(null)
            setQty('1')
            setMode('cash')
            setDone(false)
        }, 1500)
    }

    if (done) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen" style={{ color: '#F0F0F0' }}>
                <div className="text-6xl mb-4">✅</div>
                <p className="text-xl font-bold" style={{ color: '#C8FF00' }}>Sale recorded!</p>
                <p className="text-sm mt-2" style={{ color: '#666' }}>
                    ${(selectedItem?.sellPrice * Number(qty)).toFixed(2)} via {mode}
                </p>
            </div>
        )
    }

    return (
        <div className="p-4 min-h-screen" style={{ color: '#F0F0F0' }}>
            <h2 className="text-2xl font-bold mb-6">Quick Sell</h2>

            {/* Item selector */}
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#666' }}>
                Select Item
            </p>
            <div className="space-y-2 mb-6">
                {items?.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="w-full rounded-xl p-4 flex items-center justify-between text-left transition-all"
                        style={{
                            background: selectedItem?.id === item.id ? '#0A1A00' : '#161616',
                            border: `1px solid ${selectedItem?.id === item.id ? '#C8FF00' : '#2A2A2A'}`
                        }}
                    >
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#666' }}>{item.quantity} in stock</p>
                        </div>
                        <p className="font-bold text-lg" style={{ color: '#C8FF00' }}>${item.sellPrice}</p>
                    </button>
                ))}
                {items?.length === 0 && (
                    <p className="text-center text-sm py-8" style={{ color: '#444' }}>No stock items. Add items in the Stock tab first.</p>
                )}
            </div>

            {selectedItem && (
                <>
                    {/* Quantity */}
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#666' }}>Quantity</p>
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => setQty(q => String(Math.max(1, Number(q) - 1)))}
                            className="w-12 h-12 rounded-xl text-xl font-bold"
                            style={{ background: '#161616', border: '1px solid #2A2A2A', color: '#C8FF00' }}
                        >−</button>
                        <input
                            type="number"
                            value={qty}
                            onChange={e => setQty(e.target.value)}
                            className="flex-1 text-center text-2xl font-black rounded-xl py-3"
                            style={{ background: '#161616', border: '1px solid #C8FF00', color: '#C8FF00' }}
                        />
                        <button
                            onClick={() => setQty(q => String(Number(q) + 1))}
                            className="w-12 h-12 rounded-xl text-xl font-bold"
                            style={{ background: '#161616', border: '1px solid #2A2A2A', color: '#C8FF00' }}
                        >+</button>
                    </div>

                    {/* Payment method */}
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#666' }}>Payment Method</p>
                    <div className="grid grid-cols-4 gap-2 mb-6">
                        {[
                            { value: 'cash', label: 'Cash', icon: '💵' },
                            { value: 'ecocash', label: 'EcoCash', icon: '📱' },
                            { value: 'zig', label: 'ZiG', icon: 'Z' },
                            { value: 'usd', label: 'USD', icon: '$' },
                        ].map(({ value, label, icon }) => (
                            <button
                                key={value}
                                onClick={() => setMode(value)}
                                className="py-3 rounded-xl flex flex-col items-center gap-1 text-xs font-semibold transition-all"
                                style={{
                                    background: mode === value ? '#C8FF00' : '#161616',
                                    border: `1px solid ${mode === value ? '#C8FF00' : '#2A2A2A'}`,
                                    color: mode === value ? '#0D0D0D' : '#888'
                                }}
                            >
                                <span className="text-lg">{icon}</span>
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Total + confirm */}
                    <div className="rounded-xl p-4 mb-4 flex items-center justify-between" style={{ background: '#0A1A00', border: '1px solid #C8FF00' }}>
                        <p className="text-sm" style={{ color: '#888' }}>Total</p>
                        <p className="text-2xl font-black" style={{ color: '#C8FF00' }}>
                            ${(selectedItem.sellPrice * Number(qty)).toFixed(2)}
                        </p>
                    </div>

                    <button
                        onClick={sell}
                        className="w-full py-4 rounded-xl text-lg font-black"
                        style={{ background: '#C8FF00', color: '#0D0D0D' }}
                    >
                        Confirm Sale
                    </button>
                </>
            )}
        </div>
    )
}