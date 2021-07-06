export default class CartItem{

    constructor(
        public id:number,
        public product_id:number,
        public name:string,
        public supplier:string,
        public amount:number,
        public cost:number,
        public image:string
    ){}

    addAnother(amount:number = 1){
        this.cost = (this.cost/this.amount)*amount
        this.amount += amount
    }

    remove(amount:number = 1){
        try{

            if (amount > this.amount){
                throw new Error(`can't remove ${amount} items from cart. there are only ${this.amount}!`)
            }

            (this.cost/this.amount)*amount
            this.amount -= amount
        }catch(err){
            console.log(err)
        }

    }
}