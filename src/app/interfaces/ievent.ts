export interface IEvent {
    id: number,
    name: String,
    description: String,
    flexible_time: boolean,
    start_date: Date,
    end_date: Date,
    accesstoken: String,
    creator?: boolean
}
