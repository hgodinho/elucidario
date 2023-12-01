import { pubGenConfig, cleanFalsy } from "../lib/utils";
import testPubGenConfig from "../../../publications/publicacao-teste/pub-gen.json";

describe("pubGenConfig", () => {
    it("should return the default config", () => {
        expect(pubGenConfig("publicacao-teste")).toEqual(testPubGenConfig);
    });
});

describe("cleanFalsy", () => {
    it("should remove falsy values from an object", () => {
        const obj = {
            a: undefined,
            b: null,
            c: false,
            d: 0,
            e: "",
            f: "f",
            g: {
                h: undefined,
                i: null,
                j: false,
                k: 0,
                l: "",
                m: "m",
                n: {
                    o: undefined,
                    p: null,
                    q: false,
                    r: 0,
                    s: "",
                    t: "t",
                },
            },
            u: [
                {
                    v: undefined,
                    w: null,
                    x: false,
                    y: 0,
                    z: "",
                    aa: "aa",
                    ab: {
                        ac: undefined,
                        ad: null,
                        ae: false,
                        af: 0,
                        ag: "",
                        ah: "ah",
                    },
                    ai: [
                        {
                            aj: undefined,
                            ak: null,
                            al: false,
                            am: 0,
                            an: "",
                            ao: "ao",
                        },
                    ],
                },
            ],
        };
        expect(cleanFalsy(obj)).toEqual({
            c: false,
            d: 0,
            f: "f",
            g: {
                j: false,
                k: 0,
                m: "m",
                n: {
                    q: false,
                    r: 0,
                    t: "t",
                },
            },
            u: [
                {
                    x: false,
                    y: 0,
                    aa: "aa",
                    ab: {
                        ae: false,
                        af: 0,
                        ah: "ah",
                    },
                    ai: [
                        {
                            al: false,
                            am: 0,
                            ao: "ao",
                        },
                    ],
                },
            ],
        });
    });
});
