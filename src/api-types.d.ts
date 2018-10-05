// TODO: consistent names for these interfaces

interface RobinhoodOptions {
    username?: string;
    password?: string;
    token?: string;
    mfaCode?: string;
}

interface EarningsOptions {
    instrument?: string;
    symbol?: string;
    range?: number;
}

interface OrdersOptions {
    updatedAt: string;
    instrument: string;
}

interface ApiResponse<T> {
    count?: number;
    previous?: string;
    results: T[];
    next?: string;
}

interface QuoteData {
    ask_price: string;
    ask_size: number;
    bid_price: string;
    bid_size: number;
    last_trade_price: string;
    last_extended_hours_trade_price?: string;
    previous_close: string;
    adjusted_previous_close: string;
    previous_close_date: string;
    symbol: string;
    trading_halted: boolean;
    has_traded: boolean;
    last_trade_price_source: string;
    updated_at: string;
    instrument: string;
}

interface InstrumentData {
    margin_initial_ratio: string;
    rhs_tradability: string;
    id: string;
    market: string;
    simple_name: string;
    min_tick_size?: string;
    maintenance_ratio: string;
    tradability: string;
    state: string;
    type: string;
    tradeable: boolean;
    fundamentals: string;
    quote: string;
    symbol: string;
    day_trade_ratio: string;
    name: string;
    tradable_chain_id: string;
    splits: string;
    url: string;
    country: string;
    bloomberg_unique: string;
    list_date: string;
}

interface InvestmentProfile {
    interested_in_options?: any;
    annual_income: string;
    investment_experience: string;
    updated_at: string;
    option_trading_experience: string;
    understand_option_spreads?: any;
    risk_tolerance: string;
    total_net_worth: string;
    liquidity_needs: string;
    investment_objective: string;
    source_of_funds: string;
    user: string;
    suitability_verified: boolean;
    professional_trader: boolean;
    tax_bracket: string;
    time_horizon: string;
    liquid_net_worth: string;
    investment_experience_collected: boolean;
}

interface Fundamentals {
    open: string;
    high: string;
    low: string;
    volume: string;
    average_volume_2_weeks: string;
    average_volume: string;
    high_52_weeks: string;
    dividend_yield: string;
    low_52_weeks: string;
    market_cap: string;
    pe_ratio: string;
    shares_outstanding: string;
    description: string;
    instrument: string;
    ceo: string;
    headquarters_city: string;
    headquarters_state: string;
    sector: string;
    num_employees: number;
    year_founded: number;
}

interface Popularity {
    instrument: string;
    num_open_positions: number;
}

interface Account {
    deactivated: boolean;
    updated_at: string;
    margin_balances: MarginBalances;
    portfolio: string;
    cash_balances?: any;
    can_downgrade_to_cash: string;
    withdrawal_halted: boolean;
    cash_available_for_withdrawal: string;
    type: string;
    sma: string;
    sweep_enabled: boolean;
    deposit_halted: boolean;
    buying_power: string;
    user: string;
    max_ach_early_access_amount: string;
    option_level: string;
    instant_eligibility: InstantEligibility;
    cash_held_for_orders: string;
    only_position_closing_trades: boolean;
    url: string;
    positions: string;
    created_at: string;
    cash: string;
    sma_held_for_orders: string;
    unsettled_debit: string;
    account_number: string;
    is_pinnacle_account: boolean;
    uncleared_deposits: string;
    unsettled_funds: string;
}

interface InstantEligibility {
    updated_at?: string;
    reason: string;
    reinstatement_date?: string;
    reversal?: any;
    state: string;
}

interface MarginBalances {
    updated_at: string;
    gold_equity_requirement: string;
    outstanding_interest: string;
    cash_held_for_options_collateral: string;
    uncleared_nummus_deposits: string;
    overnight_ratio: string;
    day_trade_buying_power: string;
    cash_available_for_withdrawal: string;
    sma: string;
    cash_held_for_nummus_restrictions: string;
    marked_pattern_day_trader_date?: any;
    unallocated_margin_cash: string;
    start_of_day_dtbp: string;
    overnight_buying_power_held_for_orders: string;
    day_trade_ratio: string;
    cash_held_for_orders: string;
    unsettled_debit: string;
    created_at: string;
    cash_held_for_dividends?: any;
    cash: string;
    start_of_day_overnight_buying_power: string;
    margin_limit: string;
    overnight_buying_power: string;
    uncleared_deposits: string;
    unsettled_funds: string;
    day_trade_buying_power_held_for_orders: string;
}

interface User {
    username: string;
    first_name: string;
    last_name: string;
    id_info: string;
    url: string;
    email_verified: boolean;
    created_at: string;
    basic_info: string;
    email: string;
    investment_profile: string;
    id: string;
    international_info: string;
    employment: string;
    additional_info: string;
}

interface Dividend {
    account: string;
    url: string;
    amount: string;
    payable_date: string;
    instrument: string;
    rate: string;
    record_date: string;
    position: string;
    withholding: string;
    id: string;
    paid_at: string;
}

interface Earnings {
    symbol: string;
    instrument: string;
    year: number;
    quarter: number;
    eps: EPS;
    report: Report;
    call?: Call;
}

interface Call {
    datetime: string;
    broadcast_url?: any;
    replay_url?: string;
}

interface Report {
    date: string;
    timing: string;
    verified: boolean;
}

interface EPS {
    estimate?: string;
    actual: string;
}

interface SP500 {
    instrument_url: string;
    symbol: string;
    updated_at: string;
    price_movement: PriceMovement;
    description: string;
}

interface PriceMovement {
    market_hours_last_movement_pct: string;
    market_hours_last_price: string;
}
