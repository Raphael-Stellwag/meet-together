export interface IEvent {
    id: number,
    name: String,
    description: String,
    start_date: Date,
    end_date: Date,
    accesstoken: String,
    creator?: boolean,
    place: String,
    link: String,
    choosen_time_place?: any;
    count_unread_messages?: number,
    last_read_message?: number | null,
    last_message_time?: Date
}
