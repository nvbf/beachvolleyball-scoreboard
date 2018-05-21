import { List, Map, toJS, fromJS } from "immutable";
import { isSetFinished, isMatchFinished } from "../../../src/domain/tide/logic";

import { BeachVolleyballSet } from "../../../src/domain/tide/state";

// TODO: remove old code and make sure that the code we test is the correct code!
describe("BeachVolleyballSet", () => {
  it("Is BeachVolleyballSet finished", () => {
    const score = new BeachVolleyballSet();
    expect(isSetFinished(score)).toEqual(false);
  });
});
