export default class User{

    private _firstName:string = ""
    private _lastName:string = ""
    private _city:string = ""
    private _address:string = ""
    private _admin:boolean = false

    constructor(public id:string, public username:string, public password:string){

    }

    public set firstName(fnmae:string){
        this._firstName = fnmae
    }

    public get firstName(){
        return this._firstName
    }

    public set lastName(lnmae:string){
        this._lastName = lnmae
    }

    public get lastName(){
        return this._lastName
    }

    public set city(c:string){
        this._city = c
    }

    public get city(){
        return this._city
    }

    public set address(adr:string){
        this._address = adr
    }

    public get address(){
        return this._address
    }

    public set is_admin(isadmin:boolean){
        this._admin = isadmin
    }
    
    public get is_admin(){
        return this._admin
    }

}