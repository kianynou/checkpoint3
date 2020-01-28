import { TournamentsRepository } from './../repository/tournaments.repository';
import { Tournament } from 'src/models/tournament';
import { User } from 'src/models/user';
/**
 * Cette classe est un service
 * C'est ici que l'ensemble de la logique consernant les tournament doit apparaitre.
 * Attention ! Mettez le moins possible d'element dans le controller
 */
export class TournamentsService {

  // Make service => singletonTransformation de notre service en singleton
  private static instance: TournamentsService;
  static getInstance() {
      if (!this.instance) {
          this.instance = new TournamentsService();
      }
      return this.instance;
  }

  // Un singleton est une class ayant une instance unique a travers toute l'app
  private repository: TournamentsRepository;
  private constructor() {
      this.repository = TournamentsRepository.getInstance();
  }

  // Business logic

  /**
   * Return a promise which contains an array of tournaments.
   */
  getAll(): Promise<Tournament[]> {
      return this.repository.findAll();
  }

  /**
   * Return a promise which contains the tournament relative to the id in parameter.
   * @param id tournament id
   */
  getById(id: number): Promise<Tournament> {
      return this.repository.findById(id);
  }

  /**
   * Return a promise which contains the tournament relative to the searchForm in parameter.
   * @param searchForm 
   */
  getBySearchForm(searchForm: Tournament): Promise<Tournament> {      
    if (searchForm.name !== '' && searchForm.name.charAt(searchForm.name.length - 1) !== '%') {
      searchForm.name += '%';
    } else {
      searchForm.name = '%';
    }
    if (searchForm.city !== '' && searchForm.city.charAt(searchForm.city.length - 1) !== '%') {
      searchForm.city += '%';
    } else {
      searchForm.city ='%';
    }
    if (searchForm.format === '') {
      searchForm.format = '%';
    }
    if (searchForm.rule_id === '') {
      searchForm.rule_id = '%';
    }
    if (searchForm.type === '') {
      searchForm.type = '%';
    }
    if (!searchForm.end_day) {
      searchForm.end_day = new Date(2030,11,31);
    }
    return this.repository.searchTournament(searchForm);
  }

  /**
   * Return a promise which contains the tournaments with at least a free slot.
   * @param searchForm 
   */
  getWithFreeSlot(searchForm: Tournament): Promise<Tournament> {
    if (searchForm.name !== '' && searchForm.name.charAt(searchForm.name.length - 1) !== '%') {
      searchForm.name += '%';
    } else {
      searchForm.name = '%';
    }
    if (searchForm.city !== '' && searchForm.city.charAt(searchForm.city.length - 1) !== '%') {
      searchForm.city += '%';
    } else {
      searchForm.city ='%';
    }
    if (searchForm.format === '') {
      searchForm.format = '%';
    }
    if (searchForm.rule_id === '') {
      searchForm.rule_id = '%';
    }
    if (searchForm.type === '') {
      searchForm.type = '%';
    }
    if (!searchForm.end_day) {
      searchForm.end_day = new Date(2030,11,31);
    }
    return this.repository.findWithFreeSlot(searchForm);
  }


  /**
   * Return all tournaments where the actual user will participate.
   */
  getTournamentsByUserId(id: number): Promise<Tournament[]> {
    return this.repository.getTournamentsByUser(id);
  }


  getParticipant(tournamentId: number): Promise<User[]> 
  {
    return this.repository.getParticipant(tournamentId);
  }

  /**
   * Create a new tournament and return a promise which contains the created tournament.
   * @param tournament tournament to create
   */
  create(tournament: any): Promise<Tournament> {
    return this.repository.insert(tournament);
  }

  createParticipant(userId: number, tournamentId: number): Promise<any> {
    return this.repository.insertParticipant(userId, tournamentId);
  }

  /**
   * Update the tournament in parameter and return a promise which contains the updated tournament.
   * @param tournament tournament to update
   */
  update(tournament: any): Promise<Tournament> {
    return this.repository.update(tournament);
  }

  updateNbParticipant(tournament: any): Promise<Tournament> {
    return this.repository.updateNbParticipant(tournament);
  }

  /**
   * Delete the tournament related to the id in parameter. Return an empty promise.
   * @param id tournament id
   */
  delete(id: number): Promise<any> {
    return this.repository.delete(id);
  }
}
