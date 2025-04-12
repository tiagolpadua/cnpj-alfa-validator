# Validador de CNPJ com suporte a CNPJ Alfanumérico

Valida CNPJs com suporte a formatos alfanuméricos. Este projeto oferece uma implementação simples e eficiente para validar números de CNPJ, incluindo aqueles que contêm caracteres alfabéticos.

A lógica de validação é baseada na documentação oficial fornecida pelo SERPRO, disponível em: [CNPJ Alfanumérico - SERPRO](https://www.serpro.gov.br/menu/noticias/videos/cnpj-alfanumerico.zip).

<!-- [![travis][travis-image]][travis-url] -->
[![npm][npm-image]][npm-url]
![GitHub top language](https://img.shields.io/github/languages/top/tiagolpadua/cnpj-alfa-validator)
![GitHub last commit](https://img.shields.io/github/last-commit/tiagolpadua/cnpj-alfa-validator)

<!-- [travis-image]: https://travis-ci.org/carvalhoviniciusluiz/cpf-cnpj-validator.svg?branch=master -->
<!-- [travis-url]: https://travis-ci.org/carvalhoviniciusluiz/cpf-cnpj-validator -->
[npm-image]: https://img.shields.io/npm/v/cnpj-alfa-validator.svg?style=flat
[npm-url]: https://npmjs.org/package/cnpj-alfa-validator

## Instalação

```bash
npm i cnpj-alfa-validator -S
```

## Uso

```ts
import { CNPJ } from 'cnpj-alfa-validator';

CNPJ.calculaDV('000000000001'); // 91
CNPJ.calculaDV('12.ABC.345/01DE'); // 35

CNPJ.calculaDV(''); // Lança erro: 'Não é possível calcular o DV pois o CNPJ fornecido é inválido'
CNPJ.calculaDV('00000000000191'); // Lança erro: 'Não é possível calcular o DV pois o CNPJ fornecido é inválido'

CNPJ.isValid('12.ABC.345/01DE-35'); // true
CNPJ.isValid('00000000000191'); // true
CNPJ.isValid('00.000.000/0000-00'); // false
CNPJ.isValid(''); // false
```

## Licença

MIT
