import Dexie from 'dexie';

export interface Business {
    id: string;
    name: string;
    type: string;
    phone: string;
    city: string;
    currency: string;
}

export interface StockItem {
    id: string;
    name: string;
    quantity: number;
    buyPrice: number;
    sellPrice: number;
    currency: string;
    reorderLevel: number;
    businessId: string;
}

export interface Sale {
    id: string;
    itemId: string;
    businessId: string;
    quantity: number;
    totalAmount: number;
    currency: string;
    paymentMode: string;
    createdAt: string;
    synced: boolean;
}

export interface CreditCustomer {
    id: string;
    name: string;
    phone?: string;
    businessId: string;
}

export interface CreditEntry {
    id: string;
    customerId: string;
    description: string;
    amount: number;
    currency: string;
    paid: boolean;
    createdAt: string;
    synced: boolean;
}

export interface SyncQueue {
    id?: number;
    type: string;
    payload: any;
    createdAt: string;
}

class ZimBizDB extends Dexie {
    businesses!: any;
    stockItems!: any;
    sales!: any;
    creditCustomers!: any;
    creditEntries!: any;
    syncQueue!: any;

    constructor() {
        super('zimbiznet');
        this.version(1).stores({
            businesses:      'id, name, type',
            stockItems:      'id, businessId, name',
            sales:           'id, businessId, itemId, synced',
            creditCustomers: 'id, businessId, name',
            creditEntries:   'id, customerId, paid, synced',
            syncQueue:       '++id, type, createdAt'
        });
    }
}

export const db = new ZimBizDB();