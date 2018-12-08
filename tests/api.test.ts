import test from "ava";
import Api from "../src/api";

test('should create an instance without erroring', t => {
    t.notThrows(() => new Api());
});