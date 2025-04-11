import { CNPJ } from '../src';

describe('cnpj', () => {
  it('deve calcular corretamente o DV de CNPJs válidos', () => {
    expect(CNPJ.calculaDV('000000000001')).toEqual("91");
    expect(CNPJ.calculaDV('12.ABC.345/01DE')).toEqual("35");
  });

  it('deve lançar um erro quando um CNPJ inválido é informado para cálculo de DV', () => {
    const msgErro = "Não é possível calcular o DV pois o CNPJ fornecido é inválido";
    expect(() => CNPJ.calculaDV('')).toThrow(msgErro); //Vazio
    expect(() => CNPJ.calculaDV("'!@#$%&*-_=+^~")).toThrow(msgErro); //Apenas caracteres não permitido
    expect(() => CNPJ.calculaDV("$0123456789A")).toThrow(msgErro); //Caracter não permitido no início
    expect(() => CNPJ.calculaDV("012345?6789A")).toThrow(msgErro); //Caracter não permitido no meio
    expect(() => CNPJ.calculaDV("0123456789A#")).toThrow(msgErro); //Caracter não permitido no final
    expect(() => CNPJ.calculaDV("12ABc34501DE")).toThrow(msgErro); //Com letra minúscula
    expect(() => CNPJ.calculaDV("00000000000")).toThrow(msgErro); //Dígitos a menos
    expect(() => CNPJ.calculaDV("00000000000191")).toThrow(msgErro); //Dígitos a mais
  });

  it('deve validar corretamente CNPJs válidos', () => {
    expect(CNPJ.isValid("12.ABC.345/01DE-35")).toBeTruthy();
    expect(CNPJ.isValid("90.021.382/0001-22")).toBeTruthy();
    expect(CNPJ.isValid("90.024.778/0001-23")).toBeTruthy();
    expect(CNPJ.isValid("90.025.108/0001-21")).toBeTruthy();
    expect(CNPJ.isValid("90.025.255/0001-00")).toBeTruthy();
    expect(CNPJ.isValid("90.024.420/0001-09")).toBeTruthy();
    expect(CNPJ.isValid("90.024.781/0001-47")).toBeTruthy();
    expect(CNPJ.isValid("04.740.714/0001-97")).toBeTruthy();
    expect(CNPJ.isValid("44.108.058/0001-29")).toBeTruthy();
    expect(CNPJ.isValid("90.024.780/0001-00")).toBeTruthy();
    expect(CNPJ.isValid("90.024.779/0001-78")).toBeTruthy();
    expect(CNPJ.isValid("00000000000191")).toBeTruthy();
    expect(CNPJ.isValid("ABCDEFGHIJKL80")).toBeTruthy();
  });

  it('não deve validar CNPJs inválidos', () => {
    expect(CNPJ.isValid("")).toBeFalsy(); //Vazio
    expect(CNPJ.isValid("'!@#$%&*-_=+^~")).toBeFalsy(); //Apenas caracteres não permitido
    expect(CNPJ.isValid("$0123456789ABC")).toBeFalsy(); //Caracter não permitido no início
    expect(CNPJ.isValid("0123456?789ABC")).toBeFalsy(); //Caracter não permitido no meio
    expect(CNPJ.isValid("0123456789ABC#")).toBeFalsy(); //Caracter não permitido no fim
    expect(CNPJ.isValid("12.ABc.345/01DE-35")).toBeFalsy(); //Com letra minúscula
    expect(CNPJ.isValid("0000000000019")).toBeFalsy(); //Dígitos a menos
    expect(CNPJ.isValid("000000000001911")).toBeFalsy(); //Dígitos a mais
    expect(CNPJ.isValid("0000000000019L")).toBeFalsy(); //Letra na posição do segundo DV
    expect(CNPJ.isValid("000000000001P1")).toBeFalsy(); //Letra na posição do primeiro DV
    expect(CNPJ.isValid("00000000000192")).toBeFalsy(); //DV inválido
    expect(CNPJ.isValid("ABCDEFGHIJKL81")).toBeFalsy(); //DV inválido
    expect(CNPJ.isValid("00000000000000")).toBeFalsy(); //CNPJ zerado
    expect(CNPJ.isValid("00.000.000/0000-00")).toBeFalsy(); //CNPJ zerado com máscara
  });

});
