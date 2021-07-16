import {Observable, Subject} from 'rxjs';

export const API_URL: string = 'https://api.xact.ac/v1/xact';
export const SOCKET_URL: string = 'https://api.xact.ac';

const axios = require('axios');
import {io} from 'socket.io-client';
import {AxiosResponse} from 'axios';

export interface UserAccount {
    accountId: string;
    balance: string;
    profile: ProfileAccount
}

export interface ProfileAccount {
    country: string;
    email: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    first_name: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    last_name: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    profile_image: string;
}

export interface ClientOptions {
    appName: string;
    logo: string;
}

export type Scope = ScopeEnum[];

export enum ScopeEnum {
    PROFILE = 'profile',
}

export class Client {
    options;
    clientId: string;

    constructor(options: ClientOptions) {
        this.options = options;
    }

    /* Generate a QR Code */
    generateQRCode(scope = [ScopeEnum.PROFILE] as Scope): Promise<string> {
        return new Promise((resolve, reject) => {
            axios
                .post(`${API_URL}/getQRCode`, {
                    appName: this.options.appName,
                    logo: this.options.logo,
                    scope: scope,
                    clientId: this.clientId
                })
                .then((resp: AxiosResponse) => {
                    resolve(resp.data);
                })
                .catch(reject);
        });
    }

    /* Receive connexion from users */
    connect() {
        const subject = new Subject<UserAccount>();
        const obs: Observable<UserAccount> = subject.asObservable();

        const socket = io(SOCKET_URL, {
            transports: ['websocket']
        });

        socket.on('xact.connexion', (clientId: string) => {
            this.clientId = clientId;
        });

        socket.on('xact.auth', (user: UserAccount) => {
            subject.next(user);
        });

        return obs;
    }
}
