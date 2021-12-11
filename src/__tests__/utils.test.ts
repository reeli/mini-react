import {flat} from "../utils";

describe("flat", () => {
  it('should flat array', () => {
    expect(flat([1, 2, [3]])).toEqual([1, 2, 3])
  });
})
