const { removeDuplicates } = require('../controllers/projectsControl');

describe('removeDuplicates', () => {
  test('removes duplicate objects by _id', () => {
    const input = [{ _id: 1 }, { _id: 2 }, { _id: 1 }];
    const expectedOutput = [{ _id: 1 }, { _id: 2 }];
    expect(removeDuplicates(input)).toEqual(expectedOutput);
  });

  test('returns the same array if no duplicates', () => {
    const input = [{ _id: 1 }, { _id: 2 }];
    expect(removeDuplicates(input)).toEqual(input);
  });

  test('returns an empty array if input is empty', () => {
    expect(removeDuplicates([])).toEqual([]);
  });
});
