# Environment Variables Helper

This helper provides a simple way to access environment variables from `.env` files in the AirCloset automation project.

## Features

- Loads variables from `.env` files automatically
- Supports multiple environment configurations (dev, stage, prod, etc.)
- Type conversion helpers for string, number, and boolean values
- Singleton pattern for consistent access across your project
- Fallback to default values when environment variables are not defined

## Setup

1. Create a `.env` file in the project root (use `.env.example` as a template):

```bash
cp .env.example .env
```

2. Edit the `.env` file with your desired configuration.

3. (Optional) Create environment-specific files like `.env.dev`, `.env.stage`, or `.env.prod` for different environments.

## Usage

### Basic Usage

```typescript
import env from '../helpers/EnvHelper';

// Get environment variables
const baseUrl = env.get('BASE_URL');
const username = env.get('AUTH_USERNAME');

// Provide default values for missing variables
const timeout = env.get('TIMEOUT', '30000');
```

### Type Conversion

```typescript
// Get and parse numeric values
const timeout = env.getNumber('TIMEOUT', 30000);

// Get and parse boolean values
const headless = env.getBoolean('HEADLESS', true);
```

### Environment-specific Configuration

```typescript
// Load a specific environment configuration
env.loadEnvironment('prod'); // Loads from .env.prod

// Continue using env.get() as normal
const prodApiUrl = env.get('API_URL');
```

### Check If Variables Exist

```typescript
if (env.has('DB_HOST')) {
  // Use database configuration
}
```

### Get All Variables

```typescript
const allVars = env.getAll();
console.log(allVars);
```

## Best Practices

- Don't commit `.env` files to version control (they are in `.gitignore`)
- Use `.env.example` as a template with dummy values
- Use environment-specific files for different environments
- Provide sensible default values when getting environment variables

## Example Implementation

See `examples/env-helper-usage.spec.ts` for a complete example of how to use the EnvHelper in tests.
