import {Client, UserAccount} from '../../packages/client/src/client';

/* Construct an instance of Client */
const client = new Client({
    appName: 'xact.ac',
    logo: 'https://media.swipepages.com/2021/5/logo_1-3x-750.png'
});

/* Generate QR Code in order to process authentication */
const generateQrCode = async () => {
    const qrCodeMain = await client.generateQRCode();
    console.log('qrCodeMain', qrCodeMain);
}

/* Get new Connexions */
const connectHandler = async () => {
    client.connect().subscribe((connexion: UserAccount) => {
        console.log('new connexion', connexion);
    });
}

generateQrCode();
connectHandler();
