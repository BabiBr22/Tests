// __tests__/funcoes.test.js

const { adicionar, subtrair, multiplicar, dividir } = require('../funcoes');

describe('Testes das funções matemáticas', () => {

    test('Adição de 2 + 3 deve ser igual a 5', () => {
        expect(adicionar(2, 3)).toBe(5);
    });

    test('Subtração de 5 - 3 deve ser igual a 2', () => {
        expect(subtrair(5, 3)).toBe(2);
    });

    test('Multiplicação de 4 * 3 deve ser igual a 12', () => {
        expect(multiplicar(4, 3)).toBe(12);
    });

    test('Divisão de 10 / 2 deve ser igual a 5', () => {
        expect(dividir(10, 2)).toBe(5);
    });

    test('Divisão por zero deve lançar erro', () => {
        expect(() => dividir(10, 0)).toThrow('Divisão por zero não é permitida');
    });
});
