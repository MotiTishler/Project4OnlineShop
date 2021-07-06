export default class Product{

    constructor(
        public id:number,
        public name:string,
        public cat_id:number,
        public price:number,
        public unit:string = 'unit',
        public image:string = '',
        public supplier:string = ''
    ){}
}