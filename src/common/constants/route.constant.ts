export class RouteConstants {
  static readonly API_PREFIX = 'api';
  static readonly API_VERSION = '1';

  // Wallet routes
  static readonly WALLET = {
    BASE: 'wallet',
    CREATE: '',
    FIND_ONE: '/:id',
  };

  // Transaction routes
  static readonly TRANSACTION = {
    BASE: 'transaction',
    CREATE: '',
  };
}
