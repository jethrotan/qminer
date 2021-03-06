﻿/**
 * Copyright (c) 2015, Quintelligence d.o.o.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * The views and conclusions contained in the software and documentation are those
 * of the authors and should not be interpreted as representing official policies,
 * either expressed or implied, of the FreeBSD Project.
 */
 
console.log(__filename)
var assert = require('../../src/nodejs/scripts/assert.js'); //adds assert.run function
var qm = require('qminer');

describe('Feature Space Tests', function () {
    var base = undefined;
    var Store = undefined;

    beforeEach(function () {
        qm.delLock();
        qm.config('qm.conf', true, 8080, 1024);
        var backward = require('../../src/nodejs/scripts/backward.js');
        backward.addToProcess(process); // adds process.isArg function

        base = qm.create('qm.conf', "", true); // 2nd arg: empty schema, 3rd arg: clear db folder = true
        // prepare test set
        base.createStore({
            "name": "FtrSpaceTest",
            "fields": [
              { "name": "Value", "type": "float" },
              { "name": "Category", "type": "string" },
              { "name": "Categories", "type": "string_v" },
              { "name": "Date", "type": "datetime" },
              { "name": "Text", "type": "string" }
            ],
            "joins": [],
            "keys": []
        });
        Store = base.store("FtrSpaceTest");
        Store.add({ Value: 1.0, Category: "a", Categories: ["a", "q"], Date: "2014-10-10T00:11:22", Text: "Barclays dropped a bombshell on its investment bankers last week." });
        Store.add({ Value: 1.1, Category: "b", Categories: ["b", "w"], Date: "2014-10-11T00:11:22", Text: "Amid a general retreat by banks from bond trading and other volatile business lines, Barclays was particularly aggressive." });
        Store.add({ Value: 1.2, Category: "c", Categories: ["c", "e"], Date: "2014-10-12T00:11:22", Text: "In what CEO Antony Jenkins dubbed a “bold simplification,” Barclays will cut 7,000 jobs in its investment bank by 2016 and will trim the unit to 30% of the group’s risk-weighted assets." });
        Store.add({ Value: 1.3, Category: "a", Categories: ["a", "q"], Date: "2014-10-13T00:11:22", Text: "The bank is relegating £400 billion ($676 billion) in assets to its “non-core” unit, effectively quarantining them from the rest of the business." });
        Store.add({ Value: 1.4, Category: "b", Categories: ["b", "w"], Date: "2014-10-14T00:11:22", Text: "Just about every large lender these days has chucked a chunk of its toxic cast-offs into a so-called “bad bank,” but none with the same zeal as Barclays." });
        Store.add({ Value: 1.5, Category: "c", Categories: ["c", "e"], Date: "2014-10-15T00:11:22", Text: "The last time we drew up the league table for bad banks, UBS was on top." });
        Store.add({ Value: 1.6, Category: "a", Categories: ["a", "q"], Date: "2014-10-16T00:11:22", Text: "But Barclays has now taken the crown, with “non-core” assets accounting for nearly 30% of the bank’s total balance sheet." });
        Store.add({ Value: 1.7, Category: "b", Categories: ["b", "w"], Date: "2014-10-17T00:11:22", Text: "Details about a bad bank are typically relegated deep in the depths of a bank’s financial report, while it prominently trumpets the brilliant “adjusted” results of its unsullied core business." });
        Store.add({ Value: 1.8, Category: "c", Categories: ["c", "e"], Date: "2014-10-18T00:11:22", Text: "These assets still belong to the bank, and factor into its capital ratios and other important measures of financial soundness." });
        Store.add({ Value: 1.9, Category: "a", Categories: ["a", "q"], Date: "2014-10-19T00:11:22", Text: "But because selling everything at once would produce a huge loss, carving out an internal bad bank is the next best option." });
        Store.add({ Value: 2.0, Category: "b", Categories: ["b", "w"], Date: "2014-10-20T00:11:22", Text: "The Barbie doll is an icon that young girls have played with since 1959, when Barbie settled in as an American fixture in the lives of children, first in the United States and in more recent years, worldwide." });

    });
    afterEach(function () {
        base.close();
    });

    describe('Constructor Tests', function () {
        it('should construct a new feature space using a base and feature extractor', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            assert.notEqual(ftr, null);
        })
        it.skip('should throw an exception, if feature extractor is not given', function () {
            assert.throws(function () {
                var ftr = new qm.FeatureSpace(base);
            })
            console.log("should be seen on screen: base");
        })
        it.skip('should throw an exception, if only the feature extractor is given', function () {
            assert.throws(function () {
                var ftr = new qm.FeatureSpace({ type: "numeric", source: "FtrSpaceTest", field: "Value" });
            })
        })
        it.skip('should throw an exception, if no parameters are given', function () {
            assert.throws(function () {
                var ftr = new qm.FeatureSpace();
                console.log("should be seen on screen: none");
            })
        })

        it('shoud construct a new feature space using a base and feature extractor, the extractor gets the store object as source', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: Store.name, field: "Value" });
            assert.notEqual(ftr, null);
        })
    });

    describe('Dim Tests', function () {
        it('should return the dimension of the feature space', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            assert.notEqual(ftr, null);
            assert.equal(ftr.dim, 1);
        })
        it('should return the dimension of the feature space, where it takes two extractors', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            assert.notEqual(ftr, null);
            assert.equal(ftr.dim, 4);
        })
        it('should return dimension of the feature space, where it takes multiple extractors', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 2 },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4 }
            ]);
            assert.notEqual(ftr, null);
            assert.equal(ftr.dim, 16);
        })
    });

    describe('Dims Tests', function () {
        it('should return the dimensions of the feature space, for every extractor: 1 extractor', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            var arr = ftr.dims;
            assert.equal(arr.length, 1);
            assert.equal(arr[0], 1);
        })
        it('should return the dimensions of the feature space, for every extractor: 2 extractor', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            var arr = ftr.dims;
            assert.equal(arr.length, 2);
            assert.equal(arr[0], 1);
            assert.equal(arr[1], 3);
        })
        it('should return the dimensions of the feature space, for every extractor: 5 extractor', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 2 },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4 }
            ]);
            var arr = ftr.dims;
            assert.equal(arr.length, 5);
            assert.equal(arr[0], 1);
            assert.equal(arr[1], 3);
            assert.equal(arr[2], 2);
            assert.equal(arr[3], 6);
            assert.equal(arr[4], 4);
        })
    });

    describe('Add Tests', function () {
        it('should put a new feature extractor in the feature space', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            assert.equal(ftr.dim, 1);
            ftr.add({ type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] });
            assert.equal(ftr.dim, 4);
        })
        it('should throw an exception, if the added feature extractor is not valid', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            assert.throws(function () {
                ftr.add({ type: "categorical", source: "FtrSpaceTest" });
            })
        })
        it('should throw an exception, if there is no parameter given', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            assert.throws(function () {
                ftr.add();
            })
        })
    });

    describe('FtrVec Test', function () {
        it('should return a vector for the first record in store: constant', function () {
            var ftr = new qm.FeatureSpace(base, { type: "constant", source: "FtrSpaceTest" });
            var vec = ftr.ftrVec(Store[0]);
            assert.equal(vec.length, 1);
            assert.equal(vec[0], 1.0);
        })
        it('should return a vector for the first record in store: random', function () {
            var ftr = new qm.FeatureSpace(base, { type: "random", source: "FtrSpaceTest" });
            var vec = ftr.ftrVec(Store[0]);
            assert.equal(vec.length, 1);
            assert.ok(0 <= vec[0] <= 1.0);
        })
        it('should return a vector for the first record in store: numeric', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            var vec = ftr.ftrVec(Store[0]);
            assert.equal(vec.length, 1);
            assert.equal(vec[0], 1.0);

            var vec2 = ftr.ftrVec(Store[1]);
            assert.equal(vec2.length, 1);
            assert.equal(vec2[0], 1.1);
        })
        it('should return a vector for the first record in store: categorical', function () {
            var ftr = new qm.FeatureSpace(base, { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] });
            var vec = ftr.ftrVec(Store[0]);

            assert.equal(vec.length, 3);
            assert.equal(vec[0], 1);
            assert.equal(vec[1], 0);
            assert.equal(vec[2], 0);
        })
        it('should return a vector for the first record in store: multinomial', function () {
            var ftr = new qm.FeatureSpace(base, { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] });
            var vec = ftr.ftrVec(Store[0]);

            assert.equal(vec.length, 6);
            assert.equal(vec[0], 1);
            assert.equal(vec[1], 0);
            assert.equal(vec[2], 0);
            assert.equal(vec[3], 1);
            assert.equal(vec[4], 0);
            assert.equal(vec[5], 0);
        })
        it('should return a vector for the first record in store: text', function () {
            var ftr = new qm.FeatureSpace(base, { type: "text", source: "FtrSpaceTest", field: "Text", ngrams: [1, 4] });
            var vec = ftr.ftrVec(Store[0]);

            assert.equal(vec.length, 0);
        })
        it('should return a vector for the first record in store: pair', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "pair", source: "FtrSpaceTest",
                first: { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
                second: { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] }
            });

            var vec = ftr.ftrVec(Store[0]);
            assert.equal(vec.length, 0);
        })
        it.skip('should return a vector for the first record in store: dateWindow', function () {
            var ftr = new qm.FeatureSpace(base, { type: "dateWindow", source: "FtrSpaceTest", field: "Date", window: 3, unit: "12hours" });
            var vec = ftr.ftrVec(Store[0]);
            console.log(vec);
            vec.print();
        })
        it('should return a vector for the first record in store: jsfunc', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "jsfunc", source: "FtrSpaceTest", name: "TestFunc", dim: 1,
                fun: function (rec) { return rec.Categories.length; }
            });
            var vec = ftr.ftrVec(Store[0]);
            assert.equal(vec.length, 1);
            assert.equal(vec[0], 2);
        })
        it('should return a vector for the first record in store: two extractors', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            var vec = ftr.ftrVec(Store[0]);
            assert.equal(vec.length, 4);
            assert.equal(vec[0], 1.0);
            assert.equal(vec[1], 1);
            assert.equal(vec[2], 0);
            assert.equal(vec[3], 0);
        })
        it('should return a vector for the last record in store: multiple extractors', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 2 },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4 }
            ]);
            var vec = ftr.ftrVec(Store[10]);
            assert.equal(vec.length, 16);
            assert.equal(vec[0], 2.0);
            assert.equal(vec[1], 0);
            assert.equal(vec[2], 1);
            assert.equal(vec[3], 0);
            assert.equal(vec[6], 0);
            assert.equal(vec[7], 1);
            assert.equal(vec[8], 0);
            assert.equal(vec[9], 0);
            assert.equal(vec[10], 1);
            assert.equal(vec[11], 0);
        })
        it('should throw an exception, if no parameter is given', function () {
            var ftr = new qm.FeatureSpace(base, [
               { type: "numeric", source: "FtrSpaceTest", field: "Value" },
               { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
               { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 2 },
               { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] },
               { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4 }
            ]);
            assert.throws(function () {
                var vec = ftr.ftrVec();
            })
        })
        it.skip('should throw an exception, if the parameter is not a record of type store', function () {
            base.createStore({
                "name": "Mobile",
                "fields": [
                  { "name": "TeaMobile", "type": "float" },
                  { "name": "AvtoMobile", "type": "string" },
                  { "name": "PerpetumMobile", "type": "string_v" },
                ],
                "joins": [],
                "keys": []
            });
            base.store('Mobile').add({ TeaMobile: 10, AvtoMobile: "car", PerpetumMobile: ["more", "cars"] });
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            assert.throws(function () {
                ftr.ftrVec(base.store('Mobile')[0]);
            });
        })
    });

    describe('FtrSpVec Tests', function () {
        it('should return a sparse vector for the first record in store: constant', function () {
            var ftr = new qm.FeatureSpace(base, { type: "constant", source: "FtrSpaceTest" });
            var vec = ftr.ftrSpVec(Store[0]);
            assert.equal(vec.dim, 1);
            assert.equal(vec.at(0), 1.0);
        })
        it('should return a sparse vector for the first record in store: random', function () {
            var ftr = new qm.FeatureSpace(base, { type: "random", source: "FtrSpaceTest" });
            var vec = ftr.ftrSpVec(Store[0]);
            assert.equal(vec.dim, 1);
            assert.ok(0 <= vec.at(0) <= 1.0);
        })
        it('should return a sparse vector for the first record in store: numeric', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            var vec = ftr.ftrSpVec(Store[0]);
            assert.equal(vec.dim, 1);
            assert.equal(vec.at(0), 1.0);
        })
        it('should return a sparse vector for the first record in store: categorical', function () {
            var ftr = new qm.FeatureSpace(base, { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] });
            var vec = ftr.ftrSpVec(Store[0]);
            assert.equal(vec.dim, 3);
            assert.equal(vec.at(0), 1);
            assert.equal(vec.at(1), 0);
            assert.equal(vec.at(2), 0);
        })
        it('should return a sparse vector for the first record in store: multinomial', function () {
            var ftr = new qm.FeatureSpace(base, { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] });
            var vec = ftr.ftrSpVec(Store[0]);
            assert.equal(vec.dim, 6);
            assert.equal(vec.at(0), 1);
            assert.equal(vec.at(3), 1);
        })
        it.skip('should return a sparse vector for the first record in store: text', function () {
            var ftr = new qm.FeatureSpace(base, { type: "text", source: "FtrSpaceTest", field: "Text", ngrams: [1, 4] });
            var vec = ftr.ftrSpVec(Store[0]);
            assert.equal(vec.dim, 0);
        })
        it.skip('should return a sparse vector for the first record in store: pair', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "pair", source: "FtrSpaceTest",
                first: { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
                second: { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] }
            });

            var vec = ftr.ftrSpVec(Store[0]);
            assert.equal(vec.dim, 0);
        })
        it.skip('should return a sparse vector for the first record in store: dateWindow', function () {

        })
        it('should return a sparse vector for the first record in store: jsfunc', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "jsfunc", source: "FtrSpaceTest", name: "TestFunc", dim: 1,
                fun: function (rec) { return rec.Categories.length; }
            });
            var vec = ftr.ftrSpVec(Store[0]);
            assert.equal(vec.dim, 1);
            assert.equal(vec.at(0), 2);
        })
        it('should return a sparse vector for the first record in store: two extractors', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            var vec = ftr.ftrSpVec(Store[0]);
            assert.equal(vec.dim, 4);
            assert.equal(vec.at(0), 1);
            assert.equal(vec.at(1), 1);
            assert.equal(vec.at(3), 0);
        })
        it('should return a sparse vector for the last record in store: multiple extractors', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 2 },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4 }
            ]);
            var vec = ftr.ftrSpVec(Store[10]);
            assert.equal(vec.dim, 16);
            assert.equal(vec.at(0), 2.0);
            assert.equal(vec.at(1), 0);
            assert.equal(vec.at(2), 1);
            assert.equal(vec.at(3), 0);
            assert.equal(vec.at(6), 0);
            assert.equal(vec.at(7), 1);
            assert.equal(vec.at(8), 0);
            assert.equal(vec.at(9), 0);
            assert.equal(vec.at(10), 1);
            assert.equal(vec.at(11), 0);
        })
        it('should throw an exception, if no parameter is given', function () {
            var ftr = new qm.FeatureSpace(base, [
               { type: "numeric", source: "FtrSpaceTest", field: "Value" },
               { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
               { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 2 },
               { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] },
               { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4 }
            ]);
            assert.throws(function () {
                var vec = ftr.ftrSpVec();
            })
        })
        it.skip('should throw an exception, if the parameter is not a record of type store', function () {
            base.createStore({
                "name": "Mobile",
                "fields": [
                  { "name": "TeaMobile", "type": "float" },
                  { "name": "AvtoMobile", "type": "string" },
                  { "name": "PerpetumMobile", "type": "string_v" },
                ],
                "joins": [],
                "keys": []
            });
            base.store('Mobile').add({ TeaMobile: 10, AvtoMobile: "car", PerpetumMobile: ["more", "cars"] });
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            assert.throws(function () {
                ftr.ftrSpVec(base.store('Mobile')[0]);
            });
        })
    });

    describe('InvFtrVec Tests', function () {
        it('should return the values of the first record: constant', function () {
            var ftr = new qm.FeatureSpace(base, { type: "constant", source: "FtrSpaceTest" });
            var ftrvec = ftr.ftrVec(Store[0]);

            var vec = ftr.invFtrVec(ftrvec);
            assert.equal(vec.length, 1);
            assert.equal(vec.at(0), 1);
        })
        it('should throw an exception for extractor type: random', function () {
            var ftr = new qm.FeatureSpace(base, { type: "random", source: "FtrSpaceTest" });
            var ftrvec = ftr.ftrVec(Store[0]);
            assert.throws(function () {
                var vec = ftr.invFtrVec(ftrvec);
            });
        })
        it('should return the values of the first record: numeric, parameter is an array', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            var vec = ftr.invFtrVec([1]);

            assert.equal(vec.length, 1);
            assert.equal(vec.at(0), 1.0);
        })
        it('should return the values of the first record: numeric', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            var ftrvec = ftr.ftrVec(Store[0]);

            var vec = ftr.invFtrVec(ftrvec);
            assert.equal(vec.length, 1);
            assert.equal(vec.at(0), 1.0);
        })
        it('should throw an exception for extractor type: categorical', function () {
            var ftr = new qm.FeatureSpace(base, { type: "categorical", source: "FtrSpaceTest", field: "Category", value: ["a", "b", "c"] });
            var ftrvec = ftr.ftrVec(Store[0]);
            assert.throws(function () {
                var vec = ftr.invFtrVec(ftrvec);
                assert.equal(vec.length, 1);
                assert.equal(vec.at(0), "a");
            });
        })
        it('should throw an exception for extractor type: categorical, hashDimension', function () {
            var ftr = new qm.FeatureSpace(base, { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 4, value: ["a", "b", "c"] });
            var ftrvec = ftr.ftrVec(Store[0]);
            assert.throws(function () {
                var vec = ftr.invFtrVec(ftrvec);
            });
        })
        it('should throw an exception for extractor type: multinomial', function () {
            var ftr = new qm.FeatureSpace(base, { type: "multinomial", source: "FtrSpaceTest", field: "Categories", value: ["a", "b", "c", "q", "w", "e"] });
            var ftrvec = ftr.ftrVec(Store[0]);
            assert.throws(function () {
                var vec = ftr.invFtrVec(ftrvec);
                assert.equal(vec.length, 2);
                assert.equal(vec.at(0), "a");
                assert.equal(vec.at(1), "q");
            })
        })
        it('should throw an exception for extractor type: multinomial, hashDimension', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4,
                value: ["a", "b", "c", "q", "w", "e"]
            });
            var ftrvec = ftr.ftrVec(Store[0]);
            assert.throws(function () {
                var vec = ftr.invFtrVec(ftrvec);
            })
        })
        it('should throw an exception for extractor type: text', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "text", source: "FtrSpaceTest", field: "Text", ngrams: [1, 4]
            });
            ftr.updateRecord(Store[0]);
            var ftrvec = ftr.ftrVec(Store[0]);
            assert.throws(function () {
                var vec = ftr.invFtrVec(ftrvec);
            });
        })
        it('should throw an exception for extractor type: text, hashDimension', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "text", source: "FtrSpaceTest", field: "Text", hashDimension: 4, ngrams: [1, 4]
            });
            ftr.updateRecord(Store[0]);
            var ftrvec = ftr.ftrVec(Store[0]);
            assert.throws(function () {
                var vec = ftr.invFtrVec(ftrvec);
            });
        })
        it('should throw an exception for extractor type: pair', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "pair", source: "FtrSpaceTest",
                first: { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                second: { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] }
            });
            assert.throws(function () {
                var ftrvec = ftr.ftrVec(Store[0]);
                var vec = ftr.invFtrVec(ftrvec);
            })
        })
        it('should throw an exception for extractor type: pair (numeric, constant)', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "pair", source: "FtrSpaceTest",
                first: { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                second: { type: "constant", source: "FtrSpaceTest" }
            });
            assert.throws(function () {
                var ftrvec = ftr.ftrVec(Store[0]);
                var vec = ftr.invFtrVec(ftrVec);
            })
        })
        it.skip('should throw an exception for extractor type: dateWindow', function () {

        })
        it('should throw an exception for extractor type: jsfunc', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "jsfunc", source: "FtrSpaceTest", name: "TestFunc", dim: 1,
                fun: function (rec) { return rec.Categories.length }
            });
            var ftrvec = ftr.ftrVec(Store[0]);
            assert.throws(function () {
                var vec = ftr.invFtrVec(ftrvec);
            })
        })
        it('should throw an exception for a non-implemented extractors', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);

            assert.throws(function () {
                var vec = ftr.invFtrVec([1, 1, 0, 0]);
            });
        })
    });

    describe('InvFtr Tests', function () {
        it('should inverse the value for extractor type: constant', function () {
            var ftr = new qm.FeatureSpace(base, { type: "constant", source: "FtrSpaceTest" });
            var val = ftr.invFtr(0, 5);
            assert.equal(val, 1);
        })
        it('should throw an exception for extractor type: random', function () {
            var ftr = new qm.FeatureSpace(base, { type: "random", source: "FtrSpaceTest" });
            assert.throws(function () {
                var val = ftr.invFtr(0, 0.5);
            })
        })
        it('should inverse the value for extractor type: numeric', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            var val = ftr.invFtr(0, 1);

            assert.equal(val, 1.0);
        })
        it('should inverse the value for extractor type: numeric, normalize', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", normalize: true, field: "Value" });
            ftr.updateRecords(Store.recs);
            var val = ftr.invFtr(0, 0.8);
            assert.eqtol(val, 1.8);
        })
        it('should throw an exception for extractor type: categorical', function () {
            var ftr = new qm.FeatureSpace(base, { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] });
            assert.throws(function () {
                var val = ftr.invFtr(0, [1, 0, 0]);
            });
        })
        it('should throw an exception for extractor type: categorical, hashDimension', function () {
            var ftr = new qm.FeatureSpace(base, { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 4 });
            assert.throws(function () {
                var val = ftr.invFtr(0, [1, 0, 0, 0]);
            });
        })
        it('should throw an exception for extractor type: multinomial', function () {
            var ftr = new qm.FeatureSpace(base, { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] });
            assert.throws(function () {
                var val = ftr.invFtr(0, [1, 0, 0, 1, 0, 0]);
            });
        })
        it('should throw an exception for extractor type: multinomial, hashDimension', function () {
            var ftr = new qm.FeatureSpace(base, { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4 });
            assert.throws(function () {
                var val = ftr.invFtr(0, [1, 0, 1, 0]);
            });
        })
        it('should throw an exception for extractor type: text', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "text", source: "FtrSpaceTest", field: "Text", ngrams: [1, 4]
            });
            ftr.updateRecord(Store[0]);
            assert.throws(function () {
                var vec = ftr.invFtr(0, { "one": 1 });
            });
        })
        it('should throw an exception for extractor type: text, hashDimension', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "text", source: "FtrSpaceTest", field: "Text", hashDimension: 4, ngrams: [1, 4]
            });
            ftr.updateRecord(Store[0]);
            assert.throws(function () {
                var vec = ftr.invFtr(0, { "one": 1 });
            });
        })
        it.skip('should throw an exception for extractor type: pair', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "pair", source: "FtrSpaceTest",
                first: { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                second: { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] }
            });
            assert.throws(function () {
                var vec = ftr.invFtr(0, [10, [0, 1, 0]]);
            })
        })
        it.skip('should throw an exception for extractor type: pair (numeric, constant)', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "pair", source: "FtrSpaceTest",
                first: { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                second: { type: "constant", source: "FtrSpaceTest" }
            });
            assert.throws(function () {
                var vec = ftr.invFtr(0, [10, [0, 1, 0]]);
            })
        })
        it.skip('should throw an exception for extractor type: dateWindow', function () {

        })
        it('should throw an exception for extractor type: jsfunc', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "jsfunc", source: "FtrSpaceTest", name: "TestFunc", dim: 1,
                fun: function (rec) { return rec.Categories.length }
            });
            assert.throws(function () {
                var vec = ftr.invFtr(0, 2);
            })
        })

        it('should get the value by using the first extractor', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", value: ["a", "b", "c"] }
            ]);
            var val = ftr.invFtr(0, 5.0);

            assert.equal(val, 5);
        })
    })

    describe('GetFtrExtractor Tests', function () {
        it('should return the name of the first feature extractor: constant', function () {
            var ftr = new qm.FeatureSpace(base, { type: "constant", source: "FtrSpaceTest" });
            var name = ftr.getFtrExtractor(0);
            assert.equal(name, "Constant");
        })
        it('should return the name of the first feature extractor: random', function () {
            var ftr = new qm.FeatureSpace(base, { type: "random", source: "FtrSpaceTest" });
            var name = ftr.getFtrExtractor(0);
            assert.equal(name, "Random");
        })
        it('should return the name of the first feature extractor: numeric', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            var name = ftr.getFtrExtractor(0);
            assert.equal(name, "Numeric[Value]");
        })
        it('should return the name of the first feature extractor: categorical', function () {
            var ftr = new qm.FeatureSpace(base, { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] });
            var name = ftr.getFtrExtractor(0);
            assert.equal(name, "Categorical[Category]");
        })
        it('should return the name of the first feature extractor: multinomial', function () {
            var ftr = new qm.FeatureSpace(base, { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] });
            var name = ftr.getFtrExtractor(0);
            assert.equal(name, "Multinomial[Categories]");
        })
        it('should return the name of the first feature extractor: text', function () {
            var ftr = new qm.FeatureSpace(base, { type: "text", source: "FtrSpaceTest", field: "Text", ngrams: [1, 4] });
            var name = ftr.getFtrExtractor(0);
            assert.equal(name, "BagOfWords[Text]");
        })
        it('should return the name of the first feature extractor: pair', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "pair", source: "FtrSpaceTest",
                first: { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
                second: { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] }
            });
            var name = ftr.getFtrExtractor(0);
            assert.equal(name, "Pair[Categorical[Category],Multinomial[Categories]]");
        })
        it('should return the name of the first feature extractor: dateWindow', function () {
            var ftr = new qm.FeatureSpace(base, { type: "dateWindow", source: "FtrSpaceTest", field: "Date", window: 3, unit: "12hours" });
            var name = ftr.getFtrExtractor(0);
            assert.equal(name, "DateWnd[Date]");
        })
        it('should return the name of the first feature extractor: jsfunc', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "jsfunc", source: "FtrSpaceTest", name: "TestFunc", dim: 1,
                fun: function (rec) { return rec.Categories.length; }
            });
            var name = ftr.getFtrExtractor(0);
            assert.equal(name, "TestFunc");
        })
        it('should return the name of the second feature extractor', function () {
            var ftr = new qm.FeatureSpace(base, [
               { type: "numeric", source: "FtrSpaceTest", field: "Value" },
               { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            var name = ftr.getFtrExtractor(1);
            assert.equal(name, "Categorical[Category]");
        })
        it('should throw an exception, if index is out of bound, idx = 2', function () {
            var ftr = new qm.FeatureSpace(base, [
               { type: "numeric", source: "FtrSpaceTest", field: "Value" },
               { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            assert.throws(function () {
                var name = ftr.getFtrExtractor(2);
            })
        })
        it('should throw an exception, if index is out of bound, idx = -1', function () {
            var ftr = new qm.FeatureSpace(base, [
               { type: "numeric", source: "FtrSpaceTest", field: "Value" },
               { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            assert.throws(function () {
                var name = ftr.getFtrExtractor(-1);
            })
        })
        it('should throw an exception, if the parameter is a feature extractor', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            assert.throws(function () {
                var name = ftr.getFtrExtractor({ type: "numeric", source: "FtrSpaceTest", field: "Value" });
            })
        })
    });

    describe('GetFtr Tests', function () {
        it('should return the name of the feature of extractor type: constant', function () {
            var ftr = new qm.FeatureSpace(base, { type: "constant", source: "FtrSpaceTest" });
            var name = ftr.getFtr(0);
            assert.equal(name, "Constant");
        })
        it('should return the name of the feature of extractor type: random', function () {
            var ftr = new qm.FeatureSpace(base, { type: "random", source: "FtrSpaceTest" });
            var name = ftr.getFtr(0);
            assert.equal(name, "Random");
        })
        it('should return the name of the feature of extractor type: numeric', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            var name = ftr.getFtr(0);
            assert.equal(name, "Numeric[Value]");
        })
        it('should return the name of the feature of extractor type: numeric, normalize', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value", normalize: true });
            var name = ftr.getFtr(0);
            assert.equal(name, "Numeric[Value]");
        })
        it('should return the name of the features of extractor type: categorical', function () {
            var ftr = new qm.FeatureSpace(base, { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] });
            assert.equal(ftr.getFtr(0), "a");
            assert.equal(ftr.getFtr(1), "b");
            assert.equal(ftr.getFtr(2), "c");
        })
        it('should return the name of the features of extractor type: categorical, hashDimension', function () {
            var ftr = new qm.FeatureSpace(base, { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 3 });
            assert.equal(ftr.getFtr(0), "hash");
            assert.equal(ftr.getFtr(1), "hash");
            assert.equal(ftr.getFtr(2), "hash");
        })
        it('should return the name of the features of extractor type: multinomial', function () {
            var ftr = new qm.FeatureSpace(base, { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] });
            assert.equal(ftr.getFtr(0), "a");
            assert.equal(ftr.getFtr(1), "b");
            assert.equal(ftr.getFtr(2), "c");
            assert.equal(ftr.getFtr(3), "q");
            assert.equal(ftr.getFtr(4), "w");
            assert.equal(ftr.getFtr(5), "e");
        })
        it('should return the name of the features of extractor type: multinomial, hashDimension', function () {
            var ftr = new qm.FeatureSpace(base, { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 3 });
            assert.equal(ftr.getFtr(0), "hash");
            assert.equal(ftr.getFtr(1), "hash");
            assert.equal(ftr.getFtr(2), "hash");
        })
        it('should return the name of the features of extractor type: text', function () {
            var ftr = new qm.FeatureSpace(base, { type: "text", source: "FtrSpaceTest", field: "Text", hashDimension: 3, ngrams: [1, 4] });
            assert.equal(ftr.getFtr(0), "0");
            assert.equal(ftr.getFtr(1), "1");
            assert.equal(ftr.getFtr(2), "2");
        })
        it('should throw an exception for extractor type: pair', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "pair", source: "FtrSpaceTest",
                first: { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
                second: { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] }
            });
            assert.throws(function () {
                var type = ftr.getFtr(0);
            });
        })
        it.skip('should return the name of the features of extractor type: dateWindow', function () {

        })
        it('should reutrn the name of the feature of extractor type: jsfunc', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "jsfunc", source: "FtrSpaceTest", name: "TestFunc", dim: 1,
                fun: function (rec) { return rec.Categories.length; }
            });
            assert.equal(ftr.getFtr(0), "TestFunc[0]");
        })
        it('should return the name of the feature at second position', function () {
            var ftr = new qm.FeatureSpace(base, [
              { type: "numeric", source: "FtrSpaceTest", field: "Value" },
              { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            var name = ftr.getFtr(1);
            assert.equal(name, "a");
        })
        it('should return the name of the feature at third position', function () {
            var ftr = new qm.FeatureSpace(base, [
             { type: "numeric", source: "FtrSpaceTest", field: "Value" },
             { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            var name = ftr.getFtr(2);
            assert.equal(name, "b");
        })
        it('should throw an exception, if the index is out of bound, idx = 4', function () {
            var ftr = new qm.FeatureSpace(base, [
             { type: "numeric", source: "FtrSpaceTest", field: "Value" },
             { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            assert.throws(function () {
                var name = ftr.getFtr(4);
            })
        })
        it('should return the name of the first feature if idx < 0', function () {
            var ftr = new qm.FeatureSpace(base, [
                        { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                        { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            var name = ftr.getFtr(-1);
            assert.equal(name, "Numeric[Value]");
        })
    });

    describe('Filter Tests', function () {
        it('should return only the features of a sparse vector for extractor type: constant', function () {
            var ftr = new qm.FeatureSpace(base, { type: "constant", source: "FtrSpaceTest" });
            var in_vec = ftr.ftrSpVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.nnz, 1);
            assert.equal(out_vec.at(0), 1);
        })
        it('should return only the features of a dense vector for extractor type: constant', function () {
            var ftr = new qm.FeatureSpace(base, { type: "constant", source: "FtrSpaceTest" });
            var in_vec = ftr.ftrVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.length, 1);
            assert.equal(out_vec.at(0), 1);
        })
        it('should return only the features of a sparse vector for extractor type: random', function () {
            var ftr = new qm.FeatureSpace(base, { type: "random", source: "FtrSpaceTest" });
            var in_vec = ftr.ftrSpVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.nnz, 1);
            assert.ok(0 <= out_vec.at(0) <= 1);
        })
        it('should return only the features of a dense vector for extractor type: random', function () {
            var ftr = new qm.FeatureSpace(base, { type: "random", source: "FtrSpaceTest" });
            var in_vec = ftr.ftrVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.length, 1);
            assert.ok(0 <= out_vec.at(0) <= 1);
        })
        it('should return only the features of a sparse vector for extractor type: numeric', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            var in_vec = ftr.ftrSpVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.nnz, 1);
            assert.equal(out_vec.at(0), 1);
        })
        it('should return only the features of a dense vector for extractor type: numeric', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });
            var in_vec = ftr.ftrVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.length, 1);
            assert.equal(out_vec.at(0), 1);
        })
        it('should return only the features of a sparse vector for extractor type: numeric, normalize', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value", normalize: true });
            ftr.updateRecords(Store.recs);

            var in_vec = ftr.ftrSpVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.nnz, 1);
            assert.equal(out_vec.at(0), 0);
        })
        it('should return only the features of a dense vector for extractor type: numeric, normalize', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value", normalize: true });
            ftr.updateRecords(Store.recs);

            var in_vec = ftr.ftrVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.length, 1);
            assert.equal(out_vec.at(0), 0);
        })
        it('should return only the features of a sparse vector for extractor type: categorical', function () {
            var ftr = new qm.FeatureSpace(base, { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] });

            var in_vec = ftr.ftrSpVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.nnz, 1);
            assert.equal(out_vec.at(0), 1);
            assert.equal(out_vec.at(1), 0);
            assert.equal(out_vec.at(2), 0);
        })
        it('should return only the features of a dense vector for extractor type: categorical', function () {
            var ftr = new qm.FeatureSpace(base, { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] });

            var in_vec = ftr.ftrVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.length, 3);
            assert.equal(out_vec.at(0), 1);
            assert.equal(out_vec.at(1), 0);
            assert.equal(out_vec.at(2), 0);
        })
        it('should return only the features of a sparse vector for extractor type: multinomial', function () {
            var ftr = new qm.FeatureSpace(base, { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] });

            var in_vec = ftr.ftrSpVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.nnz, 2);
            assert.equal(out_vec.at(0), 1);
            assert.equal(out_vec.at(1), 0);
            assert.equal(out_vec.at(2), 0);
            assert.equal(out_vec.at(3), 1);
            assert.equal(out_vec.at(4), 0);
            assert.equal(out_vec.at(5), 0);
        })
        it('should return only the features of a dense vector for extractor type: multinomial', function () {
            var ftr = new qm.FeatureSpace(base, { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] });

            var in_vec = ftr.ftrVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.length, 6);
            assert.equal(out_vec.at(0), 1);
            assert.equal(out_vec.at(1), 0);
            assert.equal(out_vec.at(2), 0);
            assert.equal(out_vec.at(3), 1);
            assert.equal(out_vec.at(4), 0);
            assert.equal(out_vec.at(5), 0);
        })
        it.skip('should return only the features of a sparse vector for extractor type: text', function () {

        })
        it.skip('should return only the features of a dense vector for extractor type: text', function () {

        })
        it.skip('should return only the features of a sparse vector for extractor type: pair', function () {

        })
        it.skip('should return only the features of a dense vector for extractor type: pair', function () {

        })
        it.skip('should return only the features of a sparse vector for extractor type: dateWindow', function () {

        })
        it.skip('should return only the features of a dense vector for extractor type: dateWindow', function () {

        })
        it('should return only the features of a sparse vector for extractor type: text', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "jsfunc", source: "FtrSpaceTest", name: "TestFunc", dim: 1,
                fun: function (rec) { return rec.Categories.length; }
            });
            var in_vec = ftr.ftrSpVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.nnz, 1);
            assert.equal(out_vec.at(0), 2);
        })
        it('should return only the features of a dense vector for extractor type: text', function () {
            var ftr = new qm.FeatureSpace(base, {
                type: "jsfunc", source: "FtrSpaceTest", name: "TestFunc", dim: 1,
                fun: function (rec) { return rec.Categories.length; }
            });
            var in_vec = ftr.ftrVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.length, 1);
            assert.equal(out_vec.at(0), 2);
        })
        it('should return only the features of a sparse vector for a given feature extractor id = 0', function () {
            var ftr = new qm.FeatureSpace(base, [
               { type: "numeric", source: "FtrSpaceTest", field: "Value" },
               { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
               { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 2 },
               { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] },
               { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4 }
            ]);

            var in_vec = ftr.ftrSpVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.nnz, 1);
            assert.equal(out_vec.at(0), 1);
        })
        it('should return only the features of a sparse vector for the given feature extractor id = 1', function () {
            var ftr = new qm.FeatureSpace(base, [
               { type: "numeric", source: "FtrSpaceTest", field: "Value" },
               { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
               { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 2 },
               { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] },
               { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4 }
            ]);

            var in_vec = ftr.ftrSpVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 1);

            assert.equal(out_vec.nnz, 1);
            assert.equal(out_vec.at(1), 1);
        })
        it('should return only the features of a sparse vector for the given extractor id = 3, offset = false', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 2 },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4 }
            ]);

            var in_vec = ftr.ftrSpVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 3, false);

            assert.equal(out_vec.nnz, 2);
            assert.equal(out_vec.at(0), 1);
            assert.equal(out_vec.at(3), 1);
        })

        it('should return only the features of a vector for a given extractor id = 0', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 2 },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4 }
            ]);

            var in_vec = ftr.ftrVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 0);

            assert.equal(out_vec.length, 16);
            assert.equal(out_vec.at(0), 1);
        })
        it('should return only the features of a vector for a given extractor id = 1, offset = false', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 2 },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4 }
            ]);

            var in_vec = ftr.ftrVec(Store[0]);
            var out_vec = ftr.filter(in_vec, 1, false);

            assert.equal(out_vec.length, 3);
            assert.equal(out_vec.at(0), 1);
        })
        it.skip('should throw an exception if the vector length is less than the start index of the extractor', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 2 },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", hashDimension: 4 }
            ]);
            var in_vec = new qm.la.Vector([1, 0, 0, 1]);
            assert.throws(function () {
                var out_vec = ftr.filter(in_vec, 3, false);
            })

        })
    });

    describe('UpdateRecord Tests', function () {
        it('should update the feature space with a new record: constant', function () {
            var ftr = new qm.FeatureSpace(base, { type: "constant", source: "FtrSpaceTest" });
            ftr.updateRecord(Store[0]);
            assert.equal(ftr.ftrVec(Store[0]).at(0), 1);
        })
        it('should update the feature space with a new record: random', function () {
            var ftr = new qm.FeatureSpace(base, { type: "random", source: "FtrSpaceTest" });
            ftr.updateRecord(Store[0]);
            assert.ok(0 <= ftr.ftrVec(Store[0]).at(0) <= 1);
        })
        it('should update the feature space with a new record: numeric', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", field: "Value" });

            ftr.updateRecord(Store[0]);
            assert.equal(ftr.ftrVec(Store[0]).at(0), 1);

            ftr.updateRecord(Store[1]);
            assert.equal(ftr.ftrVec(Store[0]).at(0), 1);
            assert.equal(ftr.ftrVec(Store[1]).at(0), 1.1);

            ftr.updateRecord(Store[2]);
            assert.eqtol(ftr.ftrVec(Store[0]).at(0), 1);
            assert.eqtol(ftr.ftrVec(Store[1]).at(0), 1.1);
            assert.eqtol(ftr.ftrVec(Store[2]).at(0), 1.2);
        })
        it('should update the feature space with a new record: numeric, normalize', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", normalize: true, field: "Value" });

            ftr.updateRecord(Store[0]);
            assert.equal(ftr.ftrVec(Store[0]).at(0), 1);

            ftr.updateRecord(Store[1]);
            assert.equal(ftr.ftrVec(Store[0]).at(0), 0);
            assert.equal(ftr.ftrVec(Store[1]).at(0), 1);

            ftr.updateRecord(Store[2]);
            assert.eqtol(ftr.ftrVec(Store[0]).at(0), 0);
            assert.eqtol(ftr.ftrVec(Store[1]).at(0), 0.5);
            assert.eqtol(ftr.ftrVec(Store[2]).at(0), 1);
        })
        it('should update the feature space with a new record: categorical', function () {
            var ftr = new qm.FeatureSpace(base,
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            );
            ftr.updateRecord(Store[0]);
            assert.equal(ftr.ftrVec(Store[0]).at(0), 1);
            assert.equal(ftr.ftrVec(Store[0]).at(1), 0);
            assert.equal(ftr.ftrVec(Store[0]).at(2), 0);
        })
        it('should update the feature space with a new record: categorical, hashDimension', function () {
            var ftr = new qm.FeatureSpace(base,
                { type: "categorical", source: "FtrSpaceTest", field: "Category", hashDimension: 3 }
            );
            ftr.updateRecord(Store[0]);
            assert.equal(ftr.ftrVec(Store[0]).at(0), 0);
            assert.equal(ftr.ftrVec(Store[0]).at(1), 1);
            assert.equal(ftr.ftrVec(Store[0]).at(2), 0);
        })
        it('should update the feature space with a new record: multinomial', function () {
            var ftr = new qm.FeatureSpace(base,
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", values: ["a", "b", "c", "q", "w", "e"] }
            );

            assert.eqtol(ftr.ftrVec(Store[0]).at(0), 1);
            assert.eqtol(ftr.ftrVec(Store[0]).at(3), 1);

            ftr.updateRecord(Store[0]);
            assert.eqtol(ftr.ftrVec(Store[0]).at(0), 1);
            assert.eqtol(ftr.ftrVec(Store[0]).at(3), 1);
        })
        it('should update the feature space with a new record: multinomial, normalize', function () {
            var ftr = new qm.FeatureSpace(base,
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", normalize: true, values: ["a", "b", "c", "q", "w", "e"] }
            );
            assert.eqtol(ftr.ftrVec(Store[0]).at(0), 1 / Math.sqrt(2));
            assert.eqtol(ftr.ftrVec(Store[0]).at(3), 1 / Math.sqrt(2));

            ftr.updateRecord(Store[0]);
            assert.eqtol(ftr.ftrVec(Store[0]).at(0), 1 / Math.sqrt(2));
            assert.eqtol(ftr.ftrVec(Store[0]).at(3), 1 / Math.sqrt(2));
        })
        it('should update the feature space with a new record: text', function () {
            var ftr = new qm.FeatureSpace(base, { type: "text", source: "FtrSpaceTest", field: "Text", ngrams: [1, 1] });
            Store.add({ Value: 1.0, Category: "a", Categories: ["a", "q"], Date: "2014-10-10T00:11:22", Text: "Alphabet" });
            Store.add({ Value: 1.0, Category: "a", Categories: ["a", "q"], Date: "2014-10-10T00:11:22", Text: "Alpha" });
            ftr.updateRecord(Store[11]);
            ftr.updateRecord(Store[12]);
            assert.equal(ftr.ftrVec(Store[11]).length, 2);
            assert.equal(ftr.ftrVec(Store[11]).at(0), 1);
            assert.equal(ftr.ftrVec(Store[11]).at(1), 0);
            assert.equal(ftr.ftrVec(Store[12]).length, 2);
            assert.equal(ftr.ftrVec(Store[12]).at(0), 0);
            assert.equal(ftr.ftrVec(Store[12]).at(1), 1);

           //ftr.ftrVec(Store[13]); // C++ exception
        })
        //TODO check if it returns the real values (current is fishy)
        // It uses stopwords (letter a is skipped), it uses L2 normalization
        // and three words are kept: alpha, alphabet and alphabeth 
        // Suggestion: multiple tests based on tokenizer settings (normalization, stop words, ...)
        it.skip('should update the feature space with a new record: text, multiple records', function () {
            var ftr = new qm.FeatureSpace(base, { type: "text", source: "FtrSpaceTest", field: "Text" });
            Store.add({ Value: 1.0, Category: "a", Categories: ["a", "q"], Date: "2014-10-10T00:11:22", Text: "Alphabet" });
            Store.add({ Value: 1.0, Category: "a", Categories: ["a", "q"], Date: "2014-10-10T00:11:22", Text: "Alpha" });
            Store.add({ Value: 1.0, Category: "a", Categories: ["a", "q"], Date: "2014-10-10T00:11:22", Text: "Alpha Alphabet" });
            Store.add({ Value: 1.0, Category: "a", Categories: ["a", "q"], Date: "2014-10-10T00:11:22", Text: "Alpha Alphabeth a a" });
            

//length: 3 }
//ftr.ftrVec(Store[11]).print()
//1, 0, 0
//ftr.ftrVec(Store[12]).print()
//0, 1, 0
//ftr.ftrVec(Store[13]).print()
//0.92361, 0.383333, 0
//ftr.ftrVec(Store[14]).print()
//0, 0.20319, 0.979139	
            	
            ftr.updateRecord(Store[11]);
            ftr.updateRecord(Store[12]);
            ftr.updateRecord(Store[13]);
            ftr.updateRecord(Store[14]);
            assert.equal(ftr.ftrVec(Store[11]).length, 3);
            assert.equal(ftr.ftrVec(Store[11]).at(0), 1);
            assert.equal(ftr.ftrVec(Store[11]).at(1), 0);

            assert.equal(ftr.ftrVec(Store[12]).length, 3);
            assert.equal(ftr.ftrVec(Store[12]).at(0), 0);
            assert.equal(ftr.ftrVec(Store[12]).at(1), 1);

            assert.equal(ftr.ftrVec(Store[13]).length, 3);
            assert.equal(ftr.ftrVec(Store[13]).at(0), 1);
            assert.equal(ftr.ftrVec(Store[13]).at(1), 0);

            assert.equal(ftr.ftrVec(Store[14]).length, 3);
            assert.equal(ftr.ftrVec(Store[14]).at(0), 0);
            assert.equal(ftr.ftrVec(Store[14]).at(1), 1);
        })
        it('should return the correct value based on the last update', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", normalize: true, field: "Value" });
            ftr.updateRecord(Store[0]);
            ftr.updateRecord(Store[1]);

            assert.eqtol(ftr.ftrVec(Store[2]).at(0), 2);
        })
        it('should update the feature space with a new record, numeric, categorical and multinomial', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", normalize: true, field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] },
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", normalize: true, values: ["a", "b", "c", "q", "w", "e"] }
            ]);

            assert.eqtol(ftr.ftrVec(Store[0]).at(0), 1);
            assert.eqtol(ftr.ftrVec(Store[0]).at(1), 1);
            assert.eqtol(ftr.ftrVec(Store[0]).at(4), 1 / Math.sqrt(2));
            assert.eqtol(ftr.ftrVec(Store[0]).at(7), 1 / Math.sqrt(2));


            ftr.updateRecord(Store[0]);
            ftr.updateRecord(Store[1]);
            ftr.updateRecord(Store[2]);

            assert.eqtol(ftr.ftrVec(Store[0]).at(0), 0);
            assert.eqtol(ftr.ftrVec(Store[0]).at(1), 1);
            assert.eqtol(ftr.ftrVec(Store[0]).at(4), 1 / Math.sqrt(2));
            assert.eqtol(ftr.ftrVec(Store[0]).at(7), 1 / Math.sqrt(2));

            assert.eqtol(ftr.ftrVec(Store[1]).at(0), 1 / 2);
            assert.eqtol(ftr.ftrVec(Store[1]).at(2), 1);
            assert.eqtol(ftr.ftrVec(Store[1]).at(5), 1 / Math.sqrt(2));
            assert.eqtol(ftr.ftrVec(Store[1]).at(8), 1 / Math.sqrt(2));

            assert.eqtol(ftr.ftrVec(Store[2]).at(0), 1);
            assert.eqtol(ftr.ftrVec(Store[2]).at(3), 1);
            assert.eqtol(ftr.ftrVec(Store[2]).at(6), 1 / Math.sqrt(2));
            assert.eqtol(ftr.ftrVec(Store[2]).at(9), 1 / Math.sqrt(2));
        })
    });

    describe('UpdateRecords Tests', function () {
        it('should update the feature space by adding a whole record space', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", normalize: true, field: "Value" });
            var rs = Store.recs;

            ftr.updateRecords(rs);
            for (var i = 0; i < 11; i++) {
                assert.eqtol(ftr.ftrVec(Store[i]).at(0), i / 10);
            };
        })
        it('should update the feature space by adding a whole record space, multinomial', function () {
            var ftr = new qm.FeatureSpace(base,
                { type: "multinomial", source: "FtrSpaceTest", field: "Categories", normalize: true, values: ["a", "b", "c", "q", "w", "e"] }
            );
            var rs = Store.recs;
            ftr.updateRecords(rs);

            assert.eqtol(ftr.ftrVec(Store[0]).at(0), (1 / Math.sqrt(2)));
            assert.eqtol(ftr.ftrVec(Store[0]).at(3), (1 / Math.sqrt(2)));

            assert.eqtol(ftr.ftrVec(Store[10]).at(1), (1 / Math.sqrt(2)));
            assert.eqtol(ftr.ftrVec(Store[10]).at(4), (1 / Math.sqrt(2)));
        })
        it('should update the feature space by adding a whole record space, numeric, multinomial', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", normalize: true, field: "Value" },
                { type: "multinomial", source: "FtrSpaceTest", normalize: true, field: "Categories", values: ["a", "b", "c", "q", "w", "e"] },
            ]);
            var rs = Store.recs;
            ftr.updateRecords(rs);

            assert.eqtol(ftr.ftrVec(Store[0]).at(0), 0);
            assert.eqtol(ftr.ftrVec(Store[0]).at(1), (1 / Math.sqrt(2)));
            assert.eqtol(ftr.ftrVec(Store[0]).at(4), (1 / Math.sqrt(2)));

            assert.eqtol(ftr.ftrVec(Store[10]).at(0), 1);
            assert.eqtol(ftr.ftrVec(Store[10]).at(2), (1 / Math.sqrt(2)));
            assert.eqtol(ftr.ftrVec(Store[10]).at(5), (1 / Math.sqrt(2)));
        })
    });

    describe('FtrSpColMat Tests', function () {
        it('should return a sparse matrix gained from the numeric feature extractor', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", normalize: true, field: "Value" });
            var rs = Store.recs;
            var mat = ftr.ftrSpColMat(rs);

            assert.equal(mat.rows, 1);
            assert.equal(mat.cols, 11);
            assert.eqtol(mat.at(0, 0), 1);
            assert.eqtol(mat.at(0, 5), 1.5);
            assert.eqtol(mat.at(0, 10), 2);
        })
        it('should return a bigger space matrix gained from the numeric and categorical feature extractor', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            var rs = Store.recs;
            var mat = ftr.ftrSpColMat(rs);

            assert.equal(mat.rows, 4);
            assert.equal(mat.cols, 11);

            assert.eqtol(mat.at(0, 0), 1);
            assert.eqtol(mat.at(1, 0), 1);
            assert.eqtol(mat.at(3, 0), 0);

            assert.eqtol(mat.at(0, 5), 1.5);
            assert.eqtol(mat.at(3, 5), 1);

            assert.eqtol(mat.at(0, 10), 2);
            assert.eqtol(mat.at(2, 10), 1);
        })
    });

    describe('FtrColMat Tests', function () {
        it('should return a dense matrix gained from the numeric feature extractor', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", normalize: true, field: "Value" });
            var rs = Store.recs;
            var mat = ftr.ftrColMat(rs);

            assert.equal(mat.rows, 1);
            assert.equal(mat.cols, 11);
            assert.eqtol(mat.at(0, 0), 1);
            assert.eqtol(mat.at(0, 5), 1.5);
            assert.eqtol(mat.at(0, 10), 2);
        })
        it('should return a dense matrix gained from the numeric and categorical feature extractor', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            var rs = Store.recs;
            var mat = ftr.ftrColMat(rs);

            assert.equal(mat.rows, 4);
            assert.equal(mat.cols, 11);

            assert.eqtol(mat.at(0, 0), 1);
            assert.eqtol(mat.at(1, 0), 1);
            assert.eqtol(mat.at(3, 0), 0);

            assert.eqtol(mat.at(0, 5), 1.5);
            assert.eqtol(mat.at(3, 5), 1);

            assert.eqtol(mat.at(0, 10), 2);
            assert.eqtol(mat.at(2, 10), 1);
        })
    });

    describe('GetFtrDist Tests', function () {
        it('should return a vector with only one value 1.0', function () {
            var ftr = new qm.FeatureSpace(base, { type: "numeric", source: "FtrSpaceTest", normalize: true, field: "Value" });
            var arr = ftr.getFtrDist();

            assert.equal(arr.length, 1);
            assert.eqtol(arr[0], 1);
        })
        it('should return a vector of length 4 with values 1 and 1/3', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            var arr = ftr.getFtrDist();

            assert.equal(arr.length, 4);
            assert.eqtol(arr[0], 1);
            assert.eqtol(arr[1], 1 / 3);
            assert.eqtol(arr[2], 1 / 3);
            assert.eqtol(arr[3], 1 / 3);
        })
        it('should return a vector of length 3 with values equal 1/3, parameter is a feature extractor', function () {
            var ftr = new qm.FeatureSpace(base, [
                { type: "numeric", source: "FtrSpaceTest", field: "Value" },
                { type: "categorical", source: "FtrSpaceTest", field: "Category", values: ["a", "b", "c"] }
            ]);
            var arr = ftr.getFtrDist(1);

            assert.equal(arr.length, 3);
            assert.eqtol(arr[0], 1 / 3);
            assert.eqtol(arr[1], 1 / 3);
            assert.eqtol(arr[2], 1 / 3);
        })
    })


    // doesn't know how it parses
    describe.skip('ExtractStrings Test', function () {
        it('should extract the strings out of the record', function () {
            var ftr = new qm.FeatureSpace(base,
                { type: "text", source: "FtrSpaceTest", field: "Text", ngrams: [1, 1] }
            );
            ftr.updateRecord(Store[0]);

            console.log(ftr.extractStrings(Store[0]));

            assert.equal(ftr.extractStrings(Store[0]).length, 0);
        })
    })
})