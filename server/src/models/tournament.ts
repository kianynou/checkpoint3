export class Tournament {
    id!: number;
    name!: string;
    details!: string;
    nb_participant!: number;
    nb_participant_max!: number;
    price!: number;
    address!: string;
    format!: string;
    author!: string;
    picture!: string;
    start_day!: Date;
    end_day!: Date;
    city!: string;
    zipcode!: number;
    administrator!: string;
    external_link!: string;
    rule_id!: string;
    creator_id!: number;
    subscriberview!: boolean;
    connectedview!: boolean;
    type!: string;
    country!: string;
    contact!: string;
  
    constructor(input: Tournament) {
      Object.assign(this, input);
  }
  }