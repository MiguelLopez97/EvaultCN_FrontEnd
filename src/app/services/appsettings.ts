import { environment } from '../../environments/environment.prod';

export class Appsettings {
    public static API_ENDPOINT = environment.apiUrl;
    public static VERSION = 'v0';
    public static API_ENDPOINT_FULL = `${environment.apiUrl}/api/${Appsettings.VERSION}`;
}
