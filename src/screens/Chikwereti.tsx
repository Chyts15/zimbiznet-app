import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { BUSINESS_ID } from '../config'

export default function Chikwereti() {
    const [showAdd, setShowAdd] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [entryDesc, setEntryDesc] = useState('')
    const [entryAmount, setEntryAmount] = useState('')

    const customers = useLiveQuery(() =>
        db.creditCustomers.where('businessId').equals(BUSINESS_ID).toArray()
    )
    const entries = useLiveQuery(() => db.creditEntries.toArray())

    const getBalance = (customerId: string) =>
        entries?.filter(e => e.customerId === customerId && !e.paid)
            .reduce((sum, e) => sum + e.amount, 0) || 0

    const addCustomer = async () => {
        if (!name) return
        await db.creditCustomers.add({
            id: crypto.randomUUID(),
            name, phone,
            businessId: BUSINESS_ID
        })
        setName(''); setPhone(''); setShowAdd(false)
    }

    const addEntry = async () => {
        if (!entryDesc || !entryAmount || !selectedCustomer) return
        await db.creditEntries.add({
            id: crypto.randomUUID(),
            customerId: selectedCustomer.id,
            description: entryDesc,
            amount: Number(entryAmount),
            currency: 'USD',
            paid: false,
            createdAt: new Date().toISOString(),
            synced: false
        })
        setEntryDesc(''); setEntryAmount('')
    }

    const markPaid = async (entryId: string) => {
        await db.creditEntries.update(entryId, { paid: true })
    }

    const customerEntries = selectedCustomer
        ? entries?.filter(e => e.customerId === selectedCustomer.id) || []
        : []

    if (selectedCustomer) {
        return (
            <div className="p-4 min-h-screen" style={{ color: '#F0F0F0' }}>
                <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-sm mb-4 flex items-center gap-1"
                    style={{ color: '#C8FF00' }}
                >
                    ← Back
                </button>
                <h2 className="text-2xl font-bold mb-1">{selectedCustomer.name}</h2>
                <p className="text-sm mb-4" style={{ color: '#666' }}>{selectedCustomer.phone || 'No phone'}</p>

                <div className="rounded-xl p-5 mb-4" style={{ background: '#1A0000', border: '1px solid #FF3B3B' }}>
                    <p className="text-sm" style={{ color: '#FF7070' }}>Total owed</p>
                    <p className="text-4xl font-black" style={{ color: '#FF3B3B' }}>
                        ${getBalance(selectedCustomer.id).toFixed(2)}
                    </p>
                </div>

                <div className="rounded-xl p-4 mb-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                    <p className="font-semibold text-sm mb-3" style={{ color: '#C8FF00' }}>Add to Chikwereti</p>
                    <input
                        className="w-full rounded-lg p-3 mb-2 text-sm"
                        style={{ background: '#0D0D0D', border: '1px solid #333', color: '#F0F0F0' }}
                        placeholder="What did they take?"
                        value={entryDesc}
                        onChange={e => setEntryDesc(e.target.value)}
                    />
                    <input
                        className="w-full rounded-lg p-3 mb-3 text-sm"
                        style={{ background: '#0D0D0D', border: '1px solid #333', color: '#F0F0F0' }}
                        placeholder="Amount $"
                        type="number"
                        value={entryAmount}
                        onChange={e => setEntryAmount(e.target.value)}
                    />
                    <button
                        onClick={addEntry}
                        className="w-full py-3 rounded-xl text-sm font-bold"
                        style={{ background: '#C8FF00', color: '#0D0D0D' }}
                    >
                        Add Credit
                    </button>
                </div>

                <div className="space-y-2">
                    {customerEntries.map(entry => (
                        <div
                            key={entry.id}
                            className="rounded-xl p-4 flex items-center justify-between"
                            style={{
                                background: '#161616',
                                border: `1px solid ${entry.paid ? '#2A2A2A' : '#333'}`,
                                opacity: entry.paid ? 0.5 : 1
                            }}
                        >
                            <div>
                                <p className="text-sm font-medium">{entry.description}</p>
                                <p className="text-xs mt-0.5" style={{ color: '#666' }}>
                                    ${entry.amount} · {new Date(entry.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            {!entry.paid ? (
                                <button
                                    onClick={() => markPaid(entry.id)}
                                    className="text-xs px-3 py-1 rounded-lg font-bold"
                                    style={{ background: '#C8FF00', color: '#0D0D0D' }}
                                >
                                    Paid
                                </button>
                            ) : (
                                <span className="text-xs" style={{ color: '#444' }}>✓ Paid</span>
                            )}
                        </div>
                    ))}
                    {customerEntries.length === 0 && (
                        <p className="text-center text-sm py-8" style={{ color: '#444' }}>No entries yet.</p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 min-h-screen" style={{ color: '#F0F0F0' }}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Chikwereti</h2>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: '#C8FF00', color: '#0D0D0D' }}
                >
                    + Customer
                </button>
            </div>

            {showAdd && (
                <div className="rounded-xl p-4 mb-4" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                    <input
                        className="w-full rounded-lg p-3 mb-2 text-sm"
                        style={{ background: '#0D0D0D', border: '1px solid #333', color: '#F0F0F0' }}
                        placeholder="Customer name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        className="w-full rounded-lg p-3 mb-3 text-sm"
                        style={{ background: '#0D0D0D', border: '1px solid #333', color: '#F0F0F0' }}
                        placeholder="Phone (optional)"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    />
                    <button
                        onClick={addCustomer}
                        className="w-full py-3 rounded-xl text-sm font-bold"
                        style={{ background: '#C8FF00', color: '#0D0D0D' }}
                    >
                        Save Customer
                    </button>
                </div>
            )}

            <div className="space-y-3">
                {customers?.map(customer => (
                    <button
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                        className="w-full rounded-xl p-4 flex items-center justify-between text-left"
                        style={{ background: '#161616', border: '1px solid #2A2A2A' }}
                    >
                        <div>
                            <p className="font-semibold">{customer.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#666' }}>{customer.phone || 'No phone'}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg" style={{
                                color: getBalance(customer.id) > 0 ? '#FF3B3B' : '#C8FF00'
                            }}>
                                ${getBalance(customer.id).toFixed(2)}
                            </p>
                            <p className="text-xs" style={{ color: '#444' }}>owed</p>
                        </div>
                    </button>
                ))}
                {customers?.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-3">📒</p>
                        <p className="text-sm" style={{ color: '#444' }}>No customers yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}