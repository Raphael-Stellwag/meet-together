import { EMessageGenerated } from '../enums/emessage-generated.enum';

export interface IMessage {
    id?: number
    user_id?: number
    event_id?: number
    user_name?: string
    time?: Date
    content: string
    generated_content_description?: EMessageGenerated
}
