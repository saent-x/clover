import PageType from "./page-type";
export default class Api {
    private url;
    __makeRequest__(params: Object): Promise<{
        pageType: PageType;
        data: Object;
    }>;
    confirmOverride(username: string, password: string): Promise<Object>;
    login(username: string, password: string, override: any): Promise<Object>;
    refresh(id: number): Promise<Object>;
    logout(id: any): Promise<void>;
}
