export type Timeframe = '1D' | '5D' | '1M' | 'YTD' | '1Y' | 'MAX';

export interface ChartPoint {
  time: string;
  value: number;
}

export interface IndexConstituent {
  ticker: string;
  name: string;
  weight: number; // e.g. 14.2%
  price: number;
  change: number;
  changePct: number;
  sector: string;
}

export interface SGXIndex {
  id: string;
  ticker: string;
  name: string;
  category: 'sti' | 'iedge' | 'sector' | 'thematic' | 'bonds';
  categories: string[];
  subTitle: string;
  value: number;
  change: number;
  changePct: number;
  oneYearRet: number;
  constituentsCount: number;
  dayHigh: number;
  dayLow: number;
  prevClose: number;
  totalValueSGD: string;
  constituentsType: string;
  isBenchmark?: boolean;
  bookmarked?: boolean;
  chartData: Record<Timeframe, ChartPoint[]>;
  constituents: IndexConstituent[];
  description: string;
}

export interface SecurityStock {
  ticker: string;
  code: string;
  name: string;
  type: 'Equity' | 'REIT' | 'ETF' | 'Trust';
  sector: string;
  lastPrice: number;
  change: number;
  changePct: number;
  volume: string;
  turnoverSGD: string;
  dayHigh: number;
  dayLow: number;
  bidPrice: number;
  bidSize: number;
  askPrice: number;
  askSize: number;
  peRatio?: number;
  divYield?: number;
  marketCapSGD: string;
  sparkline: number[];
}

export interface DerivativeContract {
  code: string;
  name: string;
  assetClass: 'Equity Index' | 'Commodity' | 'FX' | 'Interest Rate';
  contractMonth: string;
  lastPrice: number;
  change: number;
  changePct: number;
  settlement: number;
  high: number;
  low: number;
  volume: number;
  openInterest: number;
  unit: string;
  tickSize: number;
}

export interface CorporateAction {
  id: string;
  ticker: string;
  name: string;
  event: string;
  amount?: string;
  exDate: string;
  recordDate: string;
  payDate: string;
}
