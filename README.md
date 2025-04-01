# Wallet Backend

A NestJS-based wallet management system that allows creating wallets and handling transactions.

## Installation

```bash
yarn
```

## Running in Development Mode

```bash
yarn start:dev
```

## API Endpoints

### Root
- `GET /`: Hello world endpoint

### Wallet API

#### Create a Wallet
- **Endpoint**: `POST /wallet`
- **Description**: Creates a new wallet with a name and initial balance
- **Request Body**:
  ```json
  {
    "name": "Ideas",
    "balance": 99
  }
  ```
- **Example**:
  ```bash
  curl 'https://high-level-wallet-backend.onrender.com/wallet' \
    -H 'accept: application/json, text/plain, */*' \
    --data-raw '{"name":"Ideas","balance":99}'
  ```
- **Response**:
  ```json
  {
      "status": "SUCCESS",
      "data": {
          "balance": 99,
          "name": "Ideas",
          "_id": "67eb51c0c43d50f8c4f5cf62",
          "createdAt": "2025-04-01T02:38:56.322Z",
          "updatedAt": "2025-04-01T02:38:56.322Z",
          "__v": 0
      }
  }
  ```

#### Get Wallet by ID
- **Endpoint**: `GET /wallet/:id`
- **Description**: Retrieves wallet information by ID
- **Example**:
  ```bash
  curl 'https://high-level-wallet-backend.onrender.com/wallet/67eb51c0c43d50f8c4f5cf62' \
    -H 'accept: application/json, text/plain, */*'
  ```
- **Response**:
  ```json
  {
      "status": "SUCCESS",
      "data": {
          "_id": "67eb51c0c43d50f8c4f5cf62",
          "balance": 108,
          "name": "Ideas",
          "createdAt": "2025-04-01T02:38:56.322Z",
          "updatedAt": "2025-04-01T02:40:18.428Z",
          "__v": 1
      }
  }
  ```

#### Get Wallet by Name
- **Endpoint**: `GET /wallet/name/:name`
- **Description**: Retrieves wallet information by name
- **Example**:
  ```bash
  curl 'https://high-level-wallet-backend.onrender.com/wallet/name/Ideas'
  ```
- **Response**:
  ```json
  {
      "status": "SUCCESS",
      "data": {
          "_id": "67eb51c0c43d50f8c4f5cf62",
          "balance": 108,
          "name": "Ideas",
          "createdAt": "2025-04-01T02:38:56.322Z",
          "updatedAt": "2025-04-01T02:40:18.428Z",
          "__v": 1
      }
  }
  ```

### Transaction API

#### Create a Transaction
- **Endpoint**: `POST /transaction`
- **Description**: Creates a new transaction for a wallet
- **Request Body**:
  ```json
  {
    "walletId": "67eb51c0c43d50f8c4f5cf62",
    "amount": 100,
    "description": "123",
    "version": 1
  }
  ```
- **Notes**:
  - Positive amount for credit, negative amount for debit
  - Version is required for optimistic concurrency control

- **Credit Example**:
  ```bash
  curl 'https://high-level-wallet-backend.onrender.com/transaction' \
    -H 'accept: application/json, text/plain, */*' \
    --data-raw '{"walletId":"67eb51c0c43d50f8c4f5cf62","amount":100,"description":"123","version":1}'
  ```
- **Credit Response**:
  ```json
  {
      "status": "SUCCESS",
      "data": {
          "amount": 100,
          "description": "123",
          "balance": 208,
          "walletId": "67eb51c0c43d50f8c4f5cf62",
          "_id": "67eb52f4c43d50f8c4f5cf8d",
          "createdAt": "2025-04-01T02:44:04.639Z",
          "updatedAt": "2025-04-01T02:44:04.639Z",
          "__v": 0
      }
  }
  ```

- **Debit Example**:
  ```bash
  curl 'https://high-level-wallet-backend.onrender.com/transaction' \
    -H 'accept: application/json, text/plain, */*' \
    --data-raw '{"walletId":"67eb51c0c43d50f8c4f5cf62","amount":-20,"description":"debit","version":2}'
  ```
- **Debit Response**:
  ```json
  {
      "status": "SUCCESS",
      "data": {
          "amount": -20,
          "description": "debit",
          "balance": 188,
          "walletId": "67eb51c0c43d50f8c4f5cf62",
          "_id": "67eb52fec43d50f8c4f5cf91",
          "createdAt": "2025-04-01T02:44:14.782Z",
          "updatedAt": "2025-04-01T02:44:14.782Z",
          "__v": 0
      }
  }
  ```

#### Query Transactions
- **Endpoint**: `GET /transaction/query`
- **Description**: Retrieves transactions with filtering, pagination, search, and sorting capabilities
- **Query Parameters**:
  - `walletId`: ID of the wallet (required)
  - `skip`: Number of records to skip for pagination (default: 0)
  - `limit`: Maximum number of records to return (default: 10)
  - `search`: Search string for filtering by description or amount
  - `sortField`: Field to sort by (options: 'amount', 'date')
  - `sortOrder`: Sort direction (options: 'asc', 'desc')

- **Basic Query Example**:
  ```bash
  curl 'https://high-level-wallet-backend.onrender.com/transaction/query?walletId=67eb51c0c43d50f8c4f5cf62&skip=0&limit=10&search='
  ```
- **Response**:
  ```json
  {
      "status": "SUCCESS",
      "page": 1,
      "size": 10,
      "totalCount": 3,
      "data": [
          {
              "id": "67eb52fec43d50f8c4f5cf91",
              "walletId": "67eb51c0c43d50f8c4f5cf62",
              "amount": -20,
              "description": "debit",
              "balance": 188,
              "date": "2025-04-01T02:44:14.782Z"
          },
          {
              "id": "67eb52f4c43d50f8c4f5cf8d",
              "walletId": "67eb51c0c43d50f8c4f5cf62",
              "amount": 100,
              "description": "123",
              "balance": 208,
              "date": "2025-04-01T02:44:04.639Z"
          },
          {
              "id": "67eb5212c43d50f8c4f5cf70",
              "walletId": "67eb51c0c43d50f8c4f5cf62",
              "amount": 9,
              "description": "n",
              "balance": 108,
              "date": "2025-04-01T02:40:18.677Z"
          }
      ]
  }
  ```

- **Sort by Amount (Ascending) Example**:
  ```bash
  curl 'https://high-level-wallet-backend.onrender.com/transaction/query?walletId=67eb51c0c43d50f8c4f5cf62&skip=0&limit=10&search=&sortField=amount&sortOrder=asc'
  ```

- **Sort by Amount (Descending) Example**:
  ```bash
  curl 'https://high-level-wallet-backend.onrender.com/transaction/query?walletId=67eb51c0c43d50f8c4f5cf62&skip=0&limit=10&search=&sortField=amount&sortOrder=desc'
  ```

- **Sort by Date (Ascending) Example**:
  ```bash
  curl 'https://high-level-wallet-backend.onrender.com/transaction/query?walletId=67eb51c0c43d50f8c4f5cf62&skip=0&limit=10&search=&sortField=date&sortOrder=asc'
  ```

## Rules & Constraints

1. Wallet names must be unique - attempting to create a wallet with an existing name will fail
2. Minimum wallet balance is zero - debit transactions that would reduce balance below zero will be rejected
3. Maximum wallet balance is 1,000,000,000 - credit transactions that would increase balance above this limit will be rejected
4. Balances should contain up to 4 decimal places only

## Notes
- The search functionality works on both description and amount fields
- Transaction queries support sorting by date or amount in ascending or descending order
- The API is hosted at `https://high-level-wallet-backend.onrender.com`