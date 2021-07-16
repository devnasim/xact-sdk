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
    socket;

    constructor(options: ClientOptions) {
        this.options = options;
        this.socket = io(SOCKET_URL, {
            transports: ['websocket']
        });
    }

    /* Generate a QR Code */
    generateQRCode(scope = [ScopeEnum.PROFILE] as Scope): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const clientId = await this.waitForConnexion();
            axios
                .post(`${API_URL}/getQRCode`, {
                    appName: this.options.appName,
                    logo: this.options.logo,
                    scope: scope,
                    clientId
                })
                .then((resp: AxiosResponse) => {
                    resolve(resp.data);
                })
                .catch(reject);
        });
    }

    waitForConnexion(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.socket.on('xact.connexion', (clientId: string) => {
                resolve(clientId);
            });
        })
    }

    /* Receive connexion from users */
    connect() {
        const subject = new Subject<UserAccount>();
        const obs: Observable<UserAccount> = subject.asObservable();

        this.socket.on('xact.auth', (clientId, user: UserAccount) => {
            console.log('internal::sdk::', user);
            subject.next(user);
        });

        return obs;
    }
}
