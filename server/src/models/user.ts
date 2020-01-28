export class User {
    id! : number;           
    email! : string;          
    password!: string;

    constructor(input: User) {
        Object.assign(this, input);
    }
}