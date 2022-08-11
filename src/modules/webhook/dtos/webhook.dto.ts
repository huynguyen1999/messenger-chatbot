export class UserDto{
    id: string;
}

export class NlpLocaleDto{
    locale: string;
    confidence: number;
}

export class MessageNlpDto{
    entities: any;
    detected_locales: NlpLocaleDto[];
}

export class MessageDto{
    mid: string;
    text: string;
    nlp: MessageNlpDto;
}

export class WebhookEntryContext{
    app_id: string;
    metadata: string;
}
export class WebhookMessagingDto{
    sender: UserDto;
    recipient: UserDto;
    timestamp: number;
    message: MessageDto;
}
export class WebhookEntryDto{
    id: string;
    time: number;
    messaging: WebhookMessagingDto[];
    hop_context: WebhookEntryContext[]
}

export class WebhookDto{
    object: string;
    entry: WebhookEntryDto[];
}