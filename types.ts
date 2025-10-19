
export interface Account {
  id: string;
  phone: string;
  name: string;
  verified: boolean;
}

export interface Contact {
  id: string;
  phone: string;
  name: string;
}

export enum CampaignStatus {
  Draft = 'Draft',
  Scheduled = 'Scheduled',
  Sending = 'Sending',
  Completed = 'Completed',
  Paused = 'Paused',
}

export interface Message {
  text: string;
  media?: File;
}

export interface Campaign {
  id: string;
  name: string;
  accountId: string;
  contacts: Contact[];
  message: Message;
  status: CampaignStatus;
  schedule?: Date;
  delay: {
    min: number;
    max: number;
  };
  progress: {
    total: number;
    sent: number;
    failed: number;
  };
}
