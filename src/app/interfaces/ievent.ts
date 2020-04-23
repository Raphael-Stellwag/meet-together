export interface IEvent {
    choosen_time_place?: any;
    id: number,
    name: String,
    description: String,
    start_date: Date,
    end_date: Date,
    accesstoken: String,
    creator?: boolean,
    place: String,
    link: String
}
