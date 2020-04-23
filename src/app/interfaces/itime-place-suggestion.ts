import { IParticipant } from './iparticipant';

export interface ITimePlaceSuggestion {
    id?: number;
    start_date: Date,
    end_date: Date,
    place: String,
    link: String,
    score?: number,
    can_attend?: IParticipant[]
}
