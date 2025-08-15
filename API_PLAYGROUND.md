# 🚀 API Playground

Welcome to the Account Abstraction API Playground! This interactive tool allows you to test all the ERC-4337 API endpoints in real-time.

## 🎯 Quick Start

1. **Navigate to the playground**: Visit `/playground` or `/api-playground`
2. **Select an endpoint**: Choose from the available API endpoints on the left sidebar
3. **Configure your request**: Set headers and request body (if needed)
4. **Execute**: Click the execute button to test the endpoint
5. **View results**: See the response, timing, and size information

## 📡 Available Endpoints

### Account Management
- **POST** `/api/aa/account/create` - Create a new smart account
- **GET** `/api/aa/account/[address]` - Get smart account details
- **POST** `/api/aa/account/deploy` - Deploy a smart account to blockchain

### Session Management
- **GET** `/api/aa/sessions/by-address/[address]` - Get active sessions for an address
- **GET** `/api/aa/sessions/[sessionId]` - Get session details by ID
- **DELETE** `/api/aa/sessions/[sessionId]/revoke` - Revoke a session key

### Transaction Management
- **POST** `/api/aa/transaction/execute` - Execute a single gasless transaction
- **POST** `/api/aa/transaction/batch` - Execute multiple transactions in a batch
- **GET** `/api/aa/transaction/[hash]` - Get transaction details by hash

## 🧪 Testing Features

### Real-time Validation
- JSON syntax validation for headers and request body
- Visual feedback for invalid inputs
- Disabled execute button until all inputs are valid

### Response Analysis
- HTTP status codes and response text
- Response time measurement
- Response size calculation
- Automatic JSON formatting

### User Experience
- Category-based endpoint filtering
- Copy-to-clipboard functionality
- Responsive design for all devices
- Loading states and error handling

## 🔑 Test Data

### Sample Addresses
- **Test Address**: `0x1234567890123456789012345678901234567890`
- **Test Contract**: `0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7`

### Sample Transaction Data
```json
{
  "userAddress": "0x1234567890123456789012345678901234567890",
  "to": "0x742d35Cc6434C0532925a3b8c5481a3d3E7Cc4A7",
  "data": "0xd09de08a",
  "value": "0"
}
```

## 🎮 Example Workflows

### 1. Create and Deploy Smart Account
1. Select "Create Smart Account" endpoint
2. Use the test address in the request body
3. Execute to get the smart account address
4. Switch to "Deploy Smart Account" endpoint
5. Use the returned address to deploy

### 2. Execute Gasless Transaction
1. Select "Execute Transaction" endpoint
2. Configure the transaction data
3. Execute to see the transaction hash
4. Use "Get Transaction Details" to check status

### 3. Batch Operations
1. Select "Batch Transactions" endpoint
2. Add multiple transactions to the array
3. Execute to process all transactions at once

## 🛠️ Development

### File Structure
```
src/app/
├── playground/          # /playground route (redirects to api-playground)
├── api-playground/      # Main API playground interface
└── api/aa/             # Actual API endpoints
    ├── account/         # Account management
    ├── sessions/        # Session management
    └── transaction/     # Transaction execution
```

### Key Components
- **API Endpoint Selection**: Left sidebar with categorized endpoints
- **Request Configuration**: Center panel for headers and body
- **Response Display**: Right panel showing results and metadata
- **Navigation**: Integration with the main app navigation

### Customization
- Add new endpoints by updating the `API_ENDPOINTS` array
- Modify categories by changing the `category` property
- Update test data and examples as needed

## 🚨 Error Handling

The playground includes comprehensive error handling:
- Invalid JSON detection
- Network error display
- HTTP error status reporting
- User-friendly error messages

## 🔗 Navigation

- **Main Navigation**: Added "API Playground" link in the header
- **Homepage Section**: Dedicated section promoting the playground
- **Direct Access**: Available at `/playground` and `/api-playground`

## 📱 Responsive Design

The playground is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎯 Next Steps

1. **Test all endpoints** to understand the API behavior
2. **Experiment with different parameters** to see how the system responds
3. **Use the playground** for development and debugging
4. **Share the playground** with your team for API testing

---

**Happy Testing! 🚀**

For more information, check out the main application or contact support.
