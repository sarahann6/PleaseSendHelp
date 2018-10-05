import * as request from "request";
import * as queryString from "query-string";
import _ from "lodash";

const apiUrl = "https://api.robinhood.com/";

const endpoints = {
    login: "api-token-auth/",
    logout: "api-token-logout/",
    investmentProfile: "user/investment_profile/",
    accounts: "accounts/",
    achIavAuth: "ach/iav/auth/",
    achRelationships: "ach/relationships/",
    achTransfers: "ach/transfers/",
    achDepositSchedules: "ach/deposit_schedules/",
    applications: "applications/",
    dividends: "dividends/",
    edocuments: "documents/",
    earnings: "marketdata/earnings/",
    instruments: "instruments/",
    marginUpgrade: "margin/upgrades/",
    markets: "markets/",
    notifications: "notifications/",
    notificationDevices: "notifications/devices/",
    orders: "orders/",
    cancelOrder: "orders/",
    passwordReset: "password_reset/request/",
    quotes: "quotes/",
    documentRequests: "upload/document_requests/",
    user: "user/",

    userAdditionalInfo: "user/additional_info/",
    userBasicInfo: "user/basic_info/",
    userEmployment: "user/employment/",
    userInvestmentProfile: "user/investment_profile/",

    watchlists: "watchlists/",
    positions: "positions/",
    fundamentals: "fundamentals/",
    sp500Up: "midlands/movers/sp500/?direction=up",
    sp500Down: "midlands/movers/sp500/?direction=down",
    news: "midlands/news/",
    tag: "midlands/tags/tag/"
}

export class Robinhood {
    private headers: { [header: string]: string } = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "en;q=1, fr;q=0.9, de;q=0.8, ja;q=0.7, nl;q=0.6, it;q=0.5",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "Connection": "keep-alive",
        "X-Robinhood-API-Version": "1.152.0",
        "User-Agent": "Robinhood/5.32.0 (com.robinhood.release.Robinhood; build:3814; iOS 10.3.3)",
    };

    private username: string | null;
    private password: string | null;
    private authToken: string | null;
    private mfaCode: string | null;

    private account: string | undefined;

    private request = request.defaults({});

    constructor(options: RobinhoodOptions = {}) {
        let opts = options || {};

        this.username = options.username || null;
        this.password = options.password || null;
        this.authToken = options.token || null;
        this.mfaCode = options.mfaCode || null;

        this.setHeaders();
    }

    private setHeaders() {
        this.request = request.defaults({
            headers: this.headers,
            json: true,
            gzip: true
        });
    }

    private buildAuthHeader(token: string) {
        this.headers.Authorization = `Token ${token}`;
    }

    private setAccount() {
        return this.accounts().then(body => {
            if (body.results && body.results instanceof Array && body.results.length > 0) {
                this.account = body.results[0].url;
            }
        });
    }

    private post<T = any>(endpoint: string, params: request.CoreOptions = {}) {
        return new Promise((resolve, reject) => {
            this.request.post({
                uri: apiUrl + endpoint,
                ...params
            }, (err, _resp, body) => {
                if (err) {
                    return reject(err);
                }

                resolve(body);
            });
        }) as Promise<T>;
    }

    private get<T = any>(endpoint: string, qs: any = undefined) {
        return new Promise((resolve, reject) => {
            this.request.get({
                uri: apiUrl + endpoint,
                qs
            }, (err, _resp, body) => {
                if (err) {
                    return reject(err);
                }

                resolve(body);
            });
        }) as Promise<T>;
    }

    login(): Promise<void> {
        if (this.authToken) {
            this.buildAuthHeader(this.authToken);
            this.setHeaders();
            return this.setAccount();
        }

        const form = {
            username: this.username,
            password: this.password,
            mfa_code: this.mfaCode || undefined
        };

        return this.post(endpoints.login, {
            form: form
        }).then(response => {
            if (response.mfa_required === true) {
                return response;
            } else {
                if (!response.token) {
                    throw "token not found " + JSON.stringify(response);
                }

                this.authToken = response.token;
                this.buildAuthHeader(this.authToken!);
                this.setHeaders();

                return this.setAccount();
            }
        });
    }

    setMfaCode(mfaCode: string) {
        this.mfaCode = mfaCode;
        return this.login();
    }

    getAuthToken() {
        return this.authToken;
    }

    expireToken() {
        return this.post<void>(endpoints.logout);
    }

    investmentProfile() {
        return this.get<InvestmentProfile>(endpoints.investmentProfile);
    }

    fundamentals(ticker: string) {
        return this.get<Fundamentals>(endpoints.fundamentals, { 
            symbols: ticker 
        });
    }

    instruments(symbol: string) {
        return this.get<ApiResponse<InstrumentData>>(endpoints.instruments, { 
            query: symbol.toUpperCase() 
        });
    }

    popularity(symbol: string) {
        return this.quoteData(symbol).then(data => {
            let symbolUuid = data.results[0].instrument.split("/")[4];

            return this.get<Popularity>(endpoints.instruments + symbolUuid + "/popularity");
        });
    }

    quoteData(symbol: string | string[]) {
        let symbolStr = Array.isArray(symbol) ? symbol = symbol.join(",") : symbol;

        return this.get<ApiResponse<QuoteData>>(endpoints.quotes, { 
            symbols: symbolStr.toUpperCase() 
        });
    }

    accounts() {
        return this.get<ApiResponse<Account>>(endpoints.accounts);
    }

    user() {
        return this.get<User>(endpoints.user);
    }

    dividends() {
        return this.get<ApiResponse<Dividend>>(endpoints.dividends);
    }

    earnings(options: EarningsOptions) {
        let qs = "";

        if (options.instrument) {
            qs = "?instrument=" + options.instrument;
        } else if (options.symbol) {
            qs = "?symbol=" + options.symbol;
        } else {
            qs = "?range=" + (options.range ? options.range : 1) + "day";
        }

        return this.get<ApiResponse<Earnings>>(endpoints.earnings + qs)
    }

    orders(options: OrdersOptions): Promise<any>;
    orders(orderId: string): Promise<any>;
    orders(optionsOrOrderId: string | OrdersOptions) {
        let id: string | null = null;
        let options: OrdersOptions | null = null;
        if (typeof optionsOrOrderId === "string") {
            id = optionsOrOrderId;
        } else {
            options = optionsOrOrderId;
        }

        let reqOptions = options && {
            "updated_at[gte]": options.updatedAt,
            ...options
        };

        let qs = (id ? id + "/" : "") + (reqOptions ? "?" + queryString.stringify(reqOptions) : "");
        return this.get(endpoints.orders + qs);
    }

    cancelOrder(order: string | any) {
        let cancelUrl: string | undefined;

        if (typeof order === "string") {
            cancelUrl = endpoints.cancelOrder + order + "/cancel/"
        } else if (order.cancel) {
            // TODO: strip apiUrl from front of string?
            cancelUrl = order.cancel;
        }

        if (cancelUrl) {
            return this.post(cancelUrl);
        } else {
            return Promise.reject({
                message: order.state === "cancelled" ? "Order already cancelled" : "Order cannot be cancelled",
                order: order
            });
        }
    }

    placeOrder(options: any) {
        return this.post(endpoints.orders, {
            form: {
                account: this.account,
                instrument: options.instrument.url,
                price: options.bidPrice,
                stop_price: options.stopPrice,
                quantity: options.quantity,
                side: options.transaction,
                symbol: options.instrument.symbol.toUpperCase(),
                time_in_force: options.time || "gfd",
                trigger: options.trigger || "immediate",
                type: options.type || "market"
            }
        });
    }

    placeBuyOrder(options: any) {
        options.transaction = "buy";
        return this.placeOrder(options);
    }

    placeSellOrder(options: any) {
        options.transaction = "sell";
        return this.placeOrder(options);
    }

    positions() {
        return this.get(endpoints.positions);
    }

    nonZeroPositions() {
        return this.get(endpoints.positions, { qs: { nonzero: true } });
    }

    news(symbol: string) {
        return this.get(endpoints.news + symbol + "/");
    }

    tag(tag: string) {
        return this.get(endpoints.tag + tag);
    }

    markets() {
        return this.get(endpoints.markets);
    }

    sp500Up() {
        return this.get<ApiResponse<SP500>>(endpoints.sp500Up);
    }

    sp500Down() {
        return this.get<ApiResponse<SP500>>(endpoints.sp500Down);
    }

    createWatchList(name: string) {
        return this.post(endpoints.watchlists, {
            form: {
                name: name
            }
        });
    }

    watchlists() {
        return this.get(endpoints.watchlists);
    }

    splits(instrument: string) {
        return this.get(endpoints.instruments + instrument + "/splits/");
    }

    historicals(symbol: string, intv: string, span: string) {
        return this.get(endpoints.quotes + "historicals/" + symbol + "/?interval=" + intv + "&span=" + span);
    }

    url(url: string) {
        return this.get(url);
    }
}

let x = new Robinhood({ username: "teschty", password: "rdhcset4821" });

(async () => {
    await x.login();
    let res = await x.createWatchList("tech");

    console.log(JSON.stringify(res))

})();
