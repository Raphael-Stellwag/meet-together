import { EMessageGenerated } from '../enums/emessage-generated.enum';

export interface IMessage {
    id: number
    user_name: string
    content: string
    generated_content_description: EMessageGenerated
    time: Date
    user_id: number
    event_id: number
}
