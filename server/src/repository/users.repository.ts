import { User } from './../models/user';
import { MysqlConnection } from './../loaders/mysql';

export class UsersRepository {

    private static instance: UsersRepository;
    private connection: MysqlConnection = MysqlConnection.getInstance();

    private table: string = 'user';

    static getInstance() {
        if (!this.instance) {
            this.instance = new UsersRepository();
        }
        return this.instance;
    }

    private constructor() {
    }

    findByEmail(email: string): Promise<User> {
        return this.connection.query(`SELECT * FROM ${this.table} WHERE email = ?`, [email])
            .then((results: any) => new User(results[0]));
    }


    findById(id: number): Promise<User> {
        return this.connection.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id])
        .then((results: any) => new User(results[0]));
    }

    insert(user: User) {
        return this.connection.query(
            `INSERT INTO ${this.table} (email, password) VALUES (?,?)`,
            [user.email, user.password]
        ).then((result: any) => {
            // After an insert the insert id is directly passed in the promise
            return this.findById(result.insertId);
        });
    }
    update(user: User) {
        return this.connection.query(
            `UPDATE ${this.table} SET email = ? WHERE id = ?`,
            [user.email, user.id]
        ).then(() => {
            return this.findById(user.id);
        });
    }
}