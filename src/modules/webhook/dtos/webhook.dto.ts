
class UserDto{
    id: string;
}

class NlpLocaleDto{
    locale: string;
    confidence: number;
}

class NlpEntityDto{

}

class MessageNlpDto{
    entities: NlpEntityDto;
    detected_locales: NlpLocaleDto[];
}

class MessageDto{
    mid: string;
    text: string;
    nlp: MessageNlpDto;
}

class WebhookMessagingDto{
    sender: UserDto;
    recipient: UserDto;
    timestamp: number;
    message: MessageDto;
}

class WebhookEntryContext{
    app_id: string;
    metadata: string;
}

class WebhookEntryDto{
    id: string;
    time: number;
    messaging: WebhookMessagingDto[];
    hop_context: WebhookEntryContext[]
}

export class WebhookDto{
    object: string;
    entry: WebhookEntryDto[];
}