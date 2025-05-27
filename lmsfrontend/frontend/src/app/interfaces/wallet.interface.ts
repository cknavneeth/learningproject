export interface Transaction{
    type:'credit'|'debit'
    amount:number
    date:Date
    description:string
}

export interface WalletResponse{
    wallet:number
}

export interface TransactionsResponse{
    transactions:Transaction[]
}