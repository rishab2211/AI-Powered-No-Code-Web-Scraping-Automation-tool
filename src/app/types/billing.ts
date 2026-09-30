export enum PackId {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE"
}

export type CreditsPack = {
    id: PackId;
    name: string;
    label: string;
    credits: number;
    price: number; // Price in cents
    popular?: boolean;
    bonus?: number;
};

export const CreditsPack: CreditsPack[] = [
    {
        id: PackId.SMALL,
        name: "Starter Pack",
        label: "1,000 Credits",
        credits: 1000,
        price: 999,
        popular: false,
        bonus: 0,
    },
    {
        id: PackId.MEDIUM,
        name: "Pro Pack",
        label: "5,000 Credits",
        credits: 5000,
        price: 3999,
        popular: true,
        bonus: 500,
    },
    {
        id: PackId.LARGE,
        name: "Scale Pack",
        label: "10,000 Credits",
        credits: 10000,
        price: 6999,
        popular: false,
        bonus: 2000,
    }
];

export const getCreditsPack = (id: PackId) => CreditsPack.find(p => p.id === id);