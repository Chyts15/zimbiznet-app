import { useState } from 'react'
import Dashboard from './screens/Dashboard'
import Stock from './screens/Stock'
import Chikwereti from './screens/Chikwereti'
import Summary from './screens/Summary'
import Sell from './screens/Sell'

const tabs = [
    { id: 'dashboard', label: 'Home',     icon: <TowerIcon /> },
    { id: 'stock',     label: 'Stock',    icon: <ClayPotIcon /> },
    { id: 'sell',      label: 'Sell',     icon: <SellIcon /> },
    { id: 'credit',    label: 'Credit',   icon: <NotebookIcon /> },
    { id: 'summary',   label: 'Summary',  icon: <DashboardIcon /> },
]

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard')

    const renderScreen = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard />
            case 'stock':     return <Stock />
            case 'sell':      return <Sell />
            case 'credit':    return <Chikwereti />
            case 'summary':   return <Summary />
            default:          return <Dashboard />
        }
    }

    return (
        <div className="min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden" style={{ background: '#0D0D0D' }}>

            {/* Zimbabwe flag strip at top */}
            <div className="fixed top-0 left-0 right-0 max-w-md mx-auto z-50 flex h-1">
                <div className="flex-1" style={{ background: '#006400' }} />
                <div className="flex-1" style={{ background: '#FFD200' }} />
                <div className="flex-1" style={{ background: '#D21034' }} />
                <div className="flex-1" style={{ background: '#000000' }} />
                <div className="flex-1" style={{ background: '#D21034' }} />
                <div className="flex-1" style={{ background: '#FFD200' }} />
                <div className="flex-1" style={{ background: '#006400' }} />
            </div>

            {/* Screen content */}
            <div className="flex-1 overflow-y-auto pb-20 pt-1">
                {renderScreen()}
            </div>

            {/* Bottom nav */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 border-t" style={{ background: '#161616', borderColor: '#2A2A2A' }}>
                <div className="flex">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex-1 py-3 flex flex-col items-center gap-1 transition-all"
                        >
                            <div style={{ color: activeTab === tab.id ? '#C8FF00' : '#555' }}>
                                {tab.icon}
                            </div>
                            <span className="text-[10px] font-medium" style={{ color: activeTab === tab.id ? '#C8FF00' : '#555' }}>
                {tab.label}
              </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ── Conical Tower (Home) ──────────────────────────────────────────────────────
function TowerIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {/* Main conical tower - tall cylinder narrowing at top */}
            <path d="M8 22 L8 8 C8 5 9.5 3 12 2 C14.5 3 16 5 16 8 L16 22 Z" fill="currentColor"/>
            {/* Tower top curve */}
            <ellipse cx="12" cy="8" rx="4" ry="1.5" fill="currentColor" opacity="0.6"/>
            {/* Chevron/herringbone pattern on tower */}
            <path d="M9 11 L12 9.5 L15 11" stroke="#0D0D0D" strokeWidth="0.6" fill="none"/>
            <path d="M9 13.5 L12 12 L15 13.5" stroke="#0D0D0D" strokeWidth="0.6" fill="none"/>
            <path d="M9 16 L12 14.5 L15 16" stroke="#0D0D0D" strokeWidth="0.6" fill="none"/>
            <path d="M9 18.5 L12 17 L15 18.5" stroke="#0D0D0D" strokeWidth="0.6" fill="none"/>
            {/* Left wall */}
            <path d="M3 22 L3 14 L8 14 L8 22 Z" fill="currentColor" opacity="0.45"/>
            {/* Right wall */}
            <path d="M16 14 L21 14 L21 22 L16 22 Z" fill="currentColor" opacity="0.45"/>
            {/* Ground */}
            <line x1="2" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
        </svg>
    )
}

// ── Clay Pot (Stock) ──────────────────────────────────────────────────────────
function ClayPotIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 4 L15 4 L15 5.5 C15 5.5 18 6.5 19 9.5 C20 12.5 19 16 17 18 C15.5 19.5 13 20 12 20 C11 20 8.5 19.5 7 18 C5 16 4 12.5 5 9.5 C6 6.5 9 5.5 9 5.5 Z" fill="currentColor"/>
            <rect x="8.5" y="3" width="7" height="2" rx="1" fill="currentColor"/>
            <path d="M8 9 C8 9 10 8 12 8 C14 8 16 9 16 9" stroke="#0D0D0D" strokeWidth="0.8" fill="none" opacity="0.4"/>
            <path d="M7.5 13 C7.5 13 9.5 12 12 12 C14.5 12 16.5 13 16.5 13" stroke="#0D0D0D" strokeWidth="0.8" fill="none" opacity="0.4"/>
        </svg>
    )
}

// ── Sell (up arrow in circle) ─────────────────────────────────────────────────
function SellIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 13 L12 9 L15 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9 L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    )
}

// ── Open Notebook + Pencil (Credit) ──────────────────────────────────────────
function NotebookIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 5 C4 4 5 3 6 3 L12 3 L12 21 L6 21 C5 21 4 20 4 19 Z" fill="currentColor" opacity="0.6"/>
            <path d="M12 3 L18 3 C19 3 20 4 20 5 L20 19 C20 20 19 21 18 21 L12 21 Z" fill="currentColor"/>
            <line x1="12" y1="3" x2="12" y2="21" stroke="#0D0D0D" strokeWidth="0.8"/>
            <line x1="14" y1="8" x2="18" y2="8" stroke="#0D0D0D" strokeWidth="0.8"/>
            <line x1="14" y1="11" x2="18" y2="11" stroke="#0D0D0D" strokeWidth="0.8"/>
            <line x1="14" y1="14" x2="18" y2="14" stroke="#0D0D0D" strokeWidth="0.8"/>
            <path d="M19 2 L22 5 L16 11 L13 11 L13 8 Z" fill="currentColor" opacity="0.9"/>
        </svg>
    )
}

// ── Car Dashboard (Summary) ───────────────────────────────────────────────────
function DashboardIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 14 C3 8.5 7 4 12 4 C17 4 21 8.5 21 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5 17 C4 15.5 3.5 14.5 3 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M19 17 C20 15.5 20.5 14.5 21 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="14" r="2" fill="currentColor"/>
            <path d="M12 14 L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="7" y1="14" x2="5" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            <line x1="17" y1="14" x2="19" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            <line x1="8.5" y1="9.5" x2="7" y2="8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            <line x1="15.5" y1="9.5" x2="17" y2="8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        </svg>
    )
}