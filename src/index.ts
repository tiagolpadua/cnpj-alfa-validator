/**
 * Types for CNPJ validation
 */
export interface CNPJValidationResult {
  isValid: boolean;
  errors?: string[];
}

export interface CNPJCalculationResult {
  checkDigits: string;
  isValid: boolean;
}

/**
 * Custom error class for CNPJ validation errors
 */
export class CNPJValidationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'CNPJValidationError';
  }
}

/**
 * Configuration constants for CNPJ validation
 */
const CNPJ_CONFIG = {
  BASE_LENGTH_WITHOUT_CHECK_DIGITS: 12,
  TOTAL_LENGTH_WITH_CHECK_DIGITS: 14,
  ASCII_ZERO: '0'.charCodeAt(0),
  ZERO_CNPJ: '00000000000000',
  CHECK_DIGIT_WEIGHTS: [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
} as const;

/**
 * Regular expressions for CNPJ validation
 */
const CNPJ_PATTERNS = {
  BASE_WITHOUT_CHECK_DIGITS: /^([A-Z\d]){12}$/,
  COMPLETE_WITH_CHECK_DIGITS: /^([A-Z\d]){12}(\d){2}$/,
  FORMATTING_CHARACTERS: /[./-]/g,
  INVALID_CHARACTERS: /[^A-Z\d./-]/,
  HAS_LOWERCASE: /[a-z]/,
} as const;

/**
 * Error messages
 */
const ERROR_MESSAGES = {
  INVALID_FOR_CHECK_DIGIT_CALCULATION:
    'Não é possível calcular o DV pois o CNPJ fornecido é inválido',
  EMPTY_CNPJ: 'CNPJ não pode estar vazio',
  INVALID_LENGTH: 'CNPJ deve ter 12 dígitos (sem DV) ou 14 dígitos (com DV)',
  INVALID_CHARACTERS: 'CNPJ contém caracteres inválidos',
  ZERO_CNPJ: 'CNPJ não pode ser composto apenas por zeros',
} as const;

/**
 * Utility class for CNPJ validation and manipulation
 */
export class CNPJ {
  /**
   * Validates a complete CNPJ (with check digits)
   * @param cnpj - The CNPJ string to validate
   * @returns True if the CNPJ is valid, false otherwise
   */
  static isValid(cnpj: string): boolean {
    try {
      const validation = this.validateWithDetails(cnpj);
      return validation.isValid;
    } catch {
      return false;
    }
  }

  /**
   * Validates a CNPJ and returns detailed validation results
   * @param cnpj - The CNPJ string to validate
   * @returns Detailed validation result with errors if any
   */
  static validateWithDetails(cnpj: string): CNPJValidationResult {
    const errors: string[] = [];

    if (!cnpj || cnpj.trim() === '') {
      errors.push(ERROR_MESSAGES.EMPTY_CNPJ);
      return { isValid: false, errors };
    }

    if (
      CNPJ_PATTERNS.INVALID_CHARACTERS.test(cnpj) ||
      CNPJ_PATTERNS.HAS_LOWERCASE.test(cnpj)
    ) {
      errors.push(ERROR_MESSAGES.INVALID_CHARACTERS);
      return { isValid: false, errors };
    }

    const cleanedCnpj = this.removeFormatting(cnpj).toUpperCase();

    if (!CNPJ_PATTERNS.COMPLETE_WITH_CHECK_DIGITS.test(cleanedCnpj)) {
      errors.push(ERROR_MESSAGES.INVALID_LENGTH);
      return { isValid: false, errors };
    }

    if (cleanedCnpj === CNPJ_CONFIG.ZERO_CNPJ) {
      errors.push(ERROR_MESSAGES.ZERO_CNPJ);
      return { isValid: false, errors };
    }

    const providedCheckDigits = cleanedCnpj.substring(
      CNPJ_CONFIG.BASE_LENGTH_WITHOUT_CHECK_DIGITS
    );
    const baseNumber = cleanedCnpj.substring(
      0,
      CNPJ_CONFIG.BASE_LENGTH_WITHOUT_CHECK_DIGITS
    );

    try {
      const calculatedCheckDigits = this.calculateCheckDigits(baseNumber);
      const isValid = providedCheckDigits === calculatedCheckDigits;

      if (!isValid) {
        errors.push('Dígitos verificadores inválidos');
      }

      return { isValid, errors: errors.length > 0 ? errors : undefined };
    } catch (error) {
      errors.push(
        error instanceof Error
          ? error.message
          : 'Erro desconhecido na validação'
      );
      return { isValid: false, errors };
    }
  }

  /**
   * Calculates check digits for a CNPJ base number (12 characters)
   * @param cnpj - The 12-character CNPJ base number
   * @returns The calculated check digits as a string
   * @throws Error if the input is invalid (for backward compatibility)
   */
  static calculaDV(cnpj: string): string {
    try {
      return this.calculateCheckDigits(cnpj);
    } catch (error) {
      // Maintain backward compatibility with original error message
      throw new Error(ERROR_MESSAGES.INVALID_FOR_CHECK_DIGIT_CALCULATION);
    }
  }

  /**
   * Calculates check digits for a CNPJ base number with detailed validation
   * @param cnpj - The 12-character CNPJ base number
   * @returns The calculated check digits as a string
   * @throws CNPJValidationError if the input is invalid
   */
  static calculateCheckDigits(cnpj: string): string {
    if (!cnpj || cnpj.trim() === '') {
      throw new CNPJValidationError(ERROR_MESSAGES.EMPTY_CNPJ, 'EMPTY_INPUT');
    }

    if (
      CNPJ_PATTERNS.INVALID_CHARACTERS.test(cnpj) ||
      CNPJ_PATTERNS.HAS_LOWERCASE.test(cnpj)
    ) {
      throw new CNPJValidationError(
        ERROR_MESSAGES.INVALID_CHARACTERS,
        'INVALID_CHARS'
      );
    }

    const cleanedCnpj = this.removeFormatting(cnpj).toUpperCase();

    if (!CNPJ_PATTERNS.BASE_WITHOUT_CHECK_DIGITS.test(cleanedCnpj)) {
      throw new CNPJValidationError(
        ERROR_MESSAGES.INVALID_FOR_CHECK_DIGIT_CALCULATION,
        'INVALID_FORMAT'
      );
    }

    const zeroBase = CNPJ_CONFIG.ZERO_CNPJ.substring(
      0,
      CNPJ_CONFIG.BASE_LENGTH_WITHOUT_CHECK_DIGITS
    );
    if (cleanedCnpj === zeroBase) {
      throw new CNPJValidationError(ERROR_MESSAGES.ZERO_CNPJ, 'ZERO_CNPJ');
    }

    return this.performCheckDigitCalculation(cleanedCnpj);
  }

  /**
   * Performs the actual check digit calculation algorithm
   * @param cnpjBase - Clean 12-character CNPJ base
   * @returns Calculated check digits
   */
  private static performCheckDigitCalculation(cnpjBase: string): string {
    let firstDigitSum = 0;
    let secondDigitSum = 0;

    for (let i = 0; i < CNPJ_CONFIG.BASE_LENGTH_WITHOUT_CHECK_DIGITS; i++) {
      const digitValue = cnpjBase.charCodeAt(i) - CNPJ_CONFIG.ASCII_ZERO;
      firstDigitSum += digitValue * CNPJ_CONFIG.CHECK_DIGIT_WEIGHTS[i + 1];
      secondDigitSum += digitValue * CNPJ_CONFIG.CHECK_DIGIT_WEIGHTS[i];
    }

    const firstDigit = this.calculateSingleCheckDigit(firstDigitSum);
    secondDigitSum +=
      firstDigit *
      CNPJ_CONFIG.CHECK_DIGIT_WEIGHTS[
        CNPJ_CONFIG.BASE_LENGTH_WITHOUT_CHECK_DIGITS
      ];
    const secondDigit = this.calculateSingleCheckDigit(secondDigitSum);

    return `${firstDigit}${secondDigit}`;
  }

  /**
   * Calculates a single check digit from a sum
   * @param sum - The weighted sum
   * @returns The calculated check digit
   */
  private static calculateSingleCheckDigit(sum: number): number {
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  /**
   * Removes formatting characters from CNPJ string
   * @param cnpj - CNPJ string with or without formatting
   * @returns Clean CNPJ string without formatting characters
   */
  private static removeFormatting(cnpj: string): string {
    return cnpj.replace(CNPJ_PATTERNS.FORMATTING_CHARACTERS, '');
  }

  /**
   * Formats a clean CNPJ string with standard formatting
   * @param cnpj - Clean CNPJ string (14 digits)
   * @returns Formatted CNPJ string (XX.XXX.XXX/XXXX-XX)
   */
  static format(cnpj: string): string {
    const cleaned = this.removeFormatting(cnpj);

    if (cleaned.length !== CNPJ_CONFIG.TOTAL_LENGTH_WITH_CHECK_DIGITS) {
      throw new CNPJValidationError(
        'CNPJ deve ter exatamente 14 caracteres para formatação',
        'INVALID_LENGTH'
      );
    }

    return cleaned.replace(
      /^(\w{2})(\w{3})(\w{3})(\w{4})(\w{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }
}
