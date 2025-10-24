export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export interface User {
  id: string;
  name: string;
  email: string;
  bloodType: BloodType;
}

export interface UrgentRequest {
  id: string;
  bloodType: BloodType;
  location: string;
  postedAt: Date;
  name: string;
}

export interface DonationCenter {
  id: string;
  name: string;
  address: string;
  distance: string;
}

export interface Appointment {
  id: string;
  center: DonationCenter;
  date: string;
  time: string;
  userId: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri:string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        uri: string;
        text: string;
      }[];
    }
  };
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
  groundingChunks?: GroundingChunk[];
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}