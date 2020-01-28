import { Tournament } from './../models/tournament';
import { MysqlConnection } from './../loaders/mysql';
import { User } from 'src/models/user';

/**
 * Cette classe est un repository
 * C'est ici qu'on met tout les accès à la bdd
 * Attention, aucune logique javascript ne doit apparaitre ici.
 * Il s'agit seulement de la couche de récupération des données (requeêe sql)
 */
export class TournamentsRepository {

  private static instance: TournamentsRepository;
  private connection: MysqlConnection = MysqlConnection.getInstance();

  private table: string = 'tournament';

  static getInstance() {
      if (!this.instance) {
          this.instance = new TournamentsRepository();
      }
      return this.instance;
  }

  private constructor() {
  }
    /**
     * Make a query to the database to retrieve all tournaments and return it in a promise.
     */
    findAll(): Promise<Tournament[]> {
        return this.connection.query(`SELECT * from ${this.table} ORDER BY start_day`)
          .then((results: any) => {
            return results.map((tournament: any) => new Tournament(tournament));
          });
    }
  /**
   * Make a query to the database to retrieve one tournament by its id in parameter. 
   * Return the tournament found in a promise.
   * @param id tournament id
   */
  findById(id: number): Promise<Tournament> {
      return this.connection.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id])
        .then((results: any) => new Tournament(results[0]));
  }

  /**
   * Make a query to the database to retrive the tournaments by the paramater of the searchForm
   * @param tournament 
   */

  searchTournament(searchForm: Tournament): Promise<Tournament> {
      return this.connection.query(
        `SELECT * FROM ${this.table} WHERE name LIKE ? AND city LIKE ? AND format LIKE ? AND type LIKE ? AND rule_id LIKE ? AND start_day >= ? AND end_day <= ? ORDER BY start_day`,
        [searchForm.name, searchForm.city, searchForm.format, searchForm.type, searchForm.rule_id, searchForm.start_day, searchForm.end_day]
      ).then((results: any) => {
        return results.map((tournament: any) => new Tournament(tournament));
      });
    }

  /**
   * Make a query to the database to retrive the tournaments by the paramater of the searchForm
   * @param tournament 
   */
  findWithFreeSlot(searchForm: Tournament): Promise<Tournament> {
    return this.connection.query(
      `SELECT * FROM ${this.table} WHERE name LIKE ? AND city LIKE ? AND format LIKE ? AND type LIKE ? AND rule_id LIKE ? AND start_day >= ? AND end_day <= ? AND (nb_participant_max - nb_participant) > 0 ORDER BY start_day`,
      [searchForm.name, searchForm.city, searchForm.format, searchForm.type, searchForm.rule_id, searchForm.start_day, searchForm.end_day]
    ).then((results: any) => {
      return results.map((tournament: any) => new Tournament(tournament));
    });
  }
    

  /**
   * Make a query to the database to insert a new tournament and return the created tournament in a promise.
   * @param tournament tournament to create
   */
  insert(tournament: Tournament) {
    if (tournament.picture == ""){
      tournament.picture = "/40k.jpg"
    }
    return this.connection.query(
      `INSERT INTO ${this.table} (name, details, nb_participant, nb_participant_max, price, address, format, author, picture, start_day, end_day, city, zipcode, administrator,
          external_link, rule_id, creator_id, type, country, contact) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [tournament.name, tournament.details, tournament.nb_participant, tournament.nb_participant_max, tournament.price, tournament.address, tournament.format, tournament.author, 
      tournament.picture, tournament.start_day, tournament.end_day, tournament.city, tournament.zipcode, tournament.administrator, tournament.external_link, tournament.rule_id, tournament.creator_id,
      tournament.type, tournament.country, tournament.contact,
      ]
    ).then((result: any) => {
      // After an insert the insert id is directly passed in the promise
      return this.findById(result.insertId);
    });
  }

  insertParticipant(userId: number, tournamentId: number) {
    return this.connection.query(
      `INSERT INTO participant (user_id, tournament_id, classement) VALUES (?,?,0)`,
      [userId, tournamentId],
    ).then((result: any) => {
      // After an insert the insert id is directly passed in the promise
      return this.findById(tournamentId);
    });
  }


  getParticipant(tournamentId: number): Promise<User[]> {
    return this.connection.query(`select user.id, user.firstname, user.lastname, user.nickname, user.email, user.zip_code, user.city, user.country from participant JOIN user ON user.id = participant.user_id WHERE participant.tournament_id = ?`, [tournamentId],
    )
    .then((results: any) => {
      return results;
    });
  }
  
  /**
   * Return all tournaments where the actual user will participate.
   */

  getTournamentsByUser(userId: number): Promise<Tournament[]> {
    return this.connection.query(`SELECT tournament_id as id FROM participant WHERE user_id = ?`, [userId])
    .then((results: any) => {
      return results.map((tournament: any) => new Tournament(tournament));
    });
  }

  /**
   * Make a query to the database to update an existing tournament and return the updated tournament in a promise.
   * @param tournament tournament to update
   */
  update(tournament: Tournament) {
    return this.connection.query(
      `UPDATE ${this.table} SET name= ?, details= ?, nb_participant= ?, nb_participant_max= ?, price= ?, address= ?, format= ?, author= ?, picture= ?, start_day= ?, end_day= ?, city= ?, zipcode= ?, administrator= ?,
      external_link= ?, rule_id= ?, creator_id= ?, subscriberview= ?, connectedview= ? WHERE id = ?`,
      [tournament.name, tournament.details, tournament.nb_participant, tournament.nb_participant_max, tournament.price, tournament.format, tournament.author, tournament.author,
      tournament.picture, tournament.start_day, tournament.end_day, tournament.city, tournament.administrator, tournament.external_link, tournament.rule_id, tournament.creator_id,
      tournament.address, tournament.zipcode, tournament.subscriberview, tournament.connectedview, tournament.id]
    ).then(() => {
      return this.findById(tournament.id);
    });
  }

  updateNbParticipant(tournament: Tournament) {
    return this.connection.query(
      `UPDATE ${this.table} SET nb_participant = (nb_participant + 1) WHERE id = ?`, [tournament.id]
      ).then(() => {
        return this.findById(tournament.id);
      });
  }

  /**
   * Make a query to the database to delete an existing tournament and return an empry promise
   * @param id tournament id to delete
   */
  delete(id: number): Promise<any> {
    return this.connection.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
  }
}
