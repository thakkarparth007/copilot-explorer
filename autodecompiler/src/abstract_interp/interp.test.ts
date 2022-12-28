// import { parse } from '@babel/core';
import * as Babel from '@babel/core'
import { test } from '@jest/globals';
import { AExpressionInterp, Scope, z3ctx } from './interp';

// test `AExpressionInterp` class
// specifically, run it with `5 + (6 + 7)` and `18`
// both should return the same result
test('AExpressionInterp', async () => {
    const src1 = '5 + (6 + 7)';
    const src2 = '18';

    const ast1 = Babel.parse(src1);
    const ast2 = Babel.parse(src2);

    const interp1 = new AExpressionInterp("P1", new Scope());
    const interp2 = new AExpressionInterp("P2", new Scope());

    Babel.traverse(ast1, interp1);
    Babel.traverse(ast2, interp2);

    const result1 = interp1._getResult();
    const result2 = interp2._getResult();

    // check that the results are the same via z3
    const solver = new z3ctx.Solver();
    solver.add(result1.z3obj.neq(result2.z3obj));
    console.log(solver.toString());
    
    expect(await solver.check()).toBe('sat'); // because we've not yet added the theorems

    // sadly using forall quantifiers isn't supported by the high-level API
    // and the low-level API is a bit too low-level for this hacky project (for now)
    // so we'll have to add the theorems manually
    // also, we don't really expect expressions to be re-written dramatically and UIF may
    // be sufficient for now.
    // if UIFs aren't sufficient, we can always use this hacky solution :)
    solver.fromString(
        solver.toString() + "\n" +
        "(assert (forall ((x Real) (y Real)) (= (ADD_P_0_0_R_0 x y) (+ x y))))"
    );

    expect(await solver.check()).toBe('unsat'); // now that we've defined the required theorems, the results should be the same
});