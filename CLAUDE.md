# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript library for validating Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica) numbers, including alphanumeric CNPJs. The validation logic is based on SERPRO's implementation and supports both traditional numeric CNPJs and the newer alphanumeric format.

## Development Commands

- **Build**: `npm run build` or `tsdx build`
- **Development**: `npm start` or `tsdx watch` (watches for changes)
- **Test**: `npm test` or `tsdx test`
- **Test with watch**: `npm run test:watch`
- **Test with coverage**: `npm run test:coverage`
- **Lint**: `npm run lint` or `tsdx lint`
- **Lint and fix**: `npm run lint:fix`
- **Bundle size analysis**: `npm run analyze`

## Architecture

The codebase follows a simple, focused structure:

- **Core Logic**: Single `CNPJ` class in `src/index.ts` with two main static methods:
  - `isValid(cnpj: string)`: Validates complete CNPJ with check digits
  - `calculaDV(cnpj: string)`: Calculates check digits for 12-character CNPJ base
  
- **Algorithm**: Uses weighted sum calculation with specific weights for each position, supporting both numeric (0-9) and alphabetic (A-Z) characters

- **Input Handling**: Automatically removes formatting characters (dots, slashes, hyphens) and validates against regex patterns

- **Error Handling**: Throws descriptive errors in Portuguese for invalid inputs during DV calculation

## Key Implementation Details

- Supports alphanumeric CNPJs with uppercase letters A-Z and digits 0-9
- Rejects all-zero CNPJs as invalid
- Uses ASCII value calculations for character processing
- Pre-commit hook runs linting automatically via Husky
- Bundle size limit enforced at 10KB for both CJS and ESM builds

## Testing

Tests are comprehensive and cover:

- Valid CNPJ validation (both numeric and alphanumeric)
- Invalid input rejection
- Error cases for DV calculation
- Edge cases like empty strings, invalid characters, wrong lengths
