import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { BUSINESS_ID } from '../config'

export default function Stock() {
    const [showAdd, setShowAdd] = useState(false)
    const [name, setName] = useState('')
    const [qty, setQty] = useState('')
    const [buyPrice, setBuyPrice] = useState('')
    const [sellPrice, setSellPrice] = useState('')

    const items = useLiveQuery(() =>
        db.stockItems.where('businessId').equals(BUSINESS_ID).toArray()
    )

    const addItem = async () => {
        if (!name || !qty || !buyPrice || !sellPrice) return
        await db.stockItems.add({
            id: crypto.randomUUID(),
            name,
            quantity: Number(qty),
            buyPrice: Number(buyPrice),
            sellPrice: Number(sellPrice),
            currency: 'USD',
            reorderLevel: 5,
            businessId: BUSINESS_ID
        })
        setName(''); setQty(''); setBuyPrice(''); setSellPrice('')
        setShowAdd(false)
    }

    return (
        <div className="p-4 min-h-screen" style={{ color: '#F0F0F0' }}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Stock</h2>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: '#C8FF00', color: '#0D0D0D' }}
                >
                    + Add Item
                </button>
            </div>

            {showAdd && (
                <div className="rounded-xl p-4 mb-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                    <p className="font-semibold text-sm mb-3" style={{ color: '#C8FF00' }}>New Stock Item</p>
                    <input
                        className="w-full rounded-lg p-3 mb-2 text-sm"
                        style={{ background: '#0D0D0D', border: '1px solid #333', color: '#F0F0F0' }}
                        placeholder="Item name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        {[
                            { placeholder: 'Qty', value: qty, setter: setQty },
                            { placeholder: 'Buy $', value: buyPrice, setter: setBuyPrice },
                            { placeholder: 'Sell $', value: sellPrice, setter: setSellPrice },
                        ].map(({ placeholder, value, setter }) => (
                            <input
                                key={placeholder}
                                className="rounded-lg p-3 text-sm"
                                style={{ background: '#0D0D0D', border: '1px solid #333', color: '#F0F0F0' }}
                                placeholder={placeholder}
                                type="number"
                                value={value}
                                onChange={e => setter(e.target.value)}
                            />
                        ))}
                    </div>
                    <button
                        onClick={addItem}
                        className="w-full py-3 rounded-xl text-sm font-bold"
                        style={{ background: '#C8FF00', color: '#0D0D0D' }}
                    >
                        Save Item
                    </button>
                </div>
            )}

            <div className="space-y-3">
                {items?.map(item => (
                    <div
                        key={item.id}
                        className="rounded-xl p-4 flex items-center justify-between"
                        style={{ background: '#161616', border: `1px solid ${item.quantity <= item.reorderLevel ? '#FF6B00' : '#2A2A2A'}` }}
                    >
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm mt-0.5" style={{ color: '#888' }}>
                                Sell: ${item.sellPrice} · Buy: ${item.buyPrice}
                            </p>
                            <p className="text-xs mt-1 font-semibold" style={{
                                color: item.quantity <= item.reorderLevel ? '#FF6B00' : '#C8FF00'
                            }}>
                                {item.quantity} in stock
                            </p>
                        </div>
                        <SellButton item={item} />
                    </div>
                ))}
                {items?.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-3">🏺</p>
                        <p className="text-sm" style={{ color: '#444' }}>No stock items yet.</p>
                        <p className="text-xs mt-1" style={{ color: '#333' }}>Tap + Add Item to get started.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function SellButton({ item }: { item: any }) {
    const [qty, setQty] = useState('1')
    const [mode, setMode] = useState('cash')
    const [selling, setSelling] = useState(false)

    const sell = async () => {
        const quantity = Number(qty)
        if (quantity > item.quantity) return alert('Not enough stock')
        await db.stockItems.update(item.id, { quantity: item.quantity - quantity })
        await db.sales.add({
            id: crypto.randomUUID(),
            itemId: item.id,
            businessId: item.businessId,
            quantity,
            totalAmount: item.sellPrice * quantity,
            currency: item.currency,
            paymentMode: mode,
            createdAt: new Date().toISOString(),
            synced: false
        })
        setSelling(false)
        setQty('1')
    }

    if (!selling) {
        return (
            <button
                onClick={() => setSelling(true)}
                className="px-4 py-2 rounded-xl text-sm font-bold"
                style={{ background: '#C8FF00', color: '#0D0D0D' }}
            >
                SELL
            </button>
        )
    }

    return (
        <div className="flex flex-col gap-2 items-end">
            <input
                type="number"
                value={qty}
                onChange={e => setQty(e.target.value)}
                className="w-16 rounded-lg p-2 text-sm text-center"
                style={{ background: '#0D0D0D', border: '1px solid #444', color: '#F0F0F0' }}
            />
            <select
                value={mode}
                onChange={e => setMode(e.target.value)}
                className="rounded-lg p-2 text-xs"
                style={{ background: '#0D0D0D', border: '1px solid #444', color: '#F0F0F0' }}
            >
                <option value="cash">Cash</option>
                <option value="ecocash">EcoCash</option>
                <option value="zig">ZiG</option>
                <option value="usd">USD</option>
            </select>
            <div className="flex gap-2">
                <button
                    onClick={() => setSelling(false)}
                    className="text-xs px-2"
                    style={{ color: '#666' }}
                >
                    Cancel
                </button>
                <button
                    onClick={sell}
                    className="px-3 py-1 rounded-lg text-xs font-bold"
                    style={{ background: '#C8FF00', color: '#0D0D0D' }}
                >
                    Confirm
                </button>
            </div>
        </div>
    )
}