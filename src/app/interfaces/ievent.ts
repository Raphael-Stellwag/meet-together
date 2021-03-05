export interface IEvent {
    id: number,
    name: string,
    description: string,
    start_date: Date,
    end_date: Date,
    accesstoken: string,
    creator?: boolean,
    place: string,
    link: string,
    choosen_time_place?: any;
    count_unread_messages?: number,
    last_read_message?: number | null,
    last_message_time?: Date
}
