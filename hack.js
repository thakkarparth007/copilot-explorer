const babel = require('@babel/core');
const generate = require('@babel/generator').default;
const code = `
function n(r) {
    var o = t[r];
    if (void 0 !== o) return o.exports;
    var i = t[r] = {
        id: r,
        loaded: !1,
        exports: {}
    };
    return e[r].call(i.exports, i, i.exports, n), i.loaded = !0, i.exports
}
n.n = e => {
    var t = e && e.__esModule ? () => e.default : () => e;
    return n.d(t, {
        a: t
    }), t
}, n.d = (e, t) => {
    for (var r in t) n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, {
        enumerable: !0,
        get: t[r]
    })
}, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), n.r = e => {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
    }), Object.defineProperty(e, "__esModule", {
        value: !0
    })
}, n.nmd = e => (e.paths = [], e.children || (e.children = []), e);
`;
const output = babel.transformSync(code, {
  plugins: [
    function myCustomPlugin() {
      return {
        visitor: {
            ExpressionStatement(path) {
                if (path.node.expression.type != "SequenceExpression") {
                    return;
                }
                const exprs = path.node.expression.expressions;
                let exprStmts = exprs.map(e => { return babel.types.expressionStatement(e); });
                path.replaceWithMultiple(exprStmts);
            },
            ReturnStatement(path) {
                if (path.node.argument.type != "SequenceExpression") {
                    return;
                }
                const exprs = path.node.argument.expressions;
                let exprStmts = exprs.map(e => { return babel.types.expressionStatement(e); });
                let lastExpr = exprStmts.pop();
                let returnStmt = babel.types.returnStatement(lastExpr.expression);
                exprStmts.push(returnStmt);
                path.replaceWithMultiple(exprStmts);
            }
        },
      };
    },
  ],
});
console.log(output.code);

// const escope = require('escope');
// const esprima = require('esprima');
// const estraverse = require('estraverse');

// // const code = `
// //     function car() { return 5; }
// //     function foo() {
// //         var a = 1;
// //         var b = bar();
// //         var c = car();
// //     }
// // `;

// const code = `
//     a = 1, b = 2;
//     c != 3 && d == 4 && e == 5, f = 6;
// `;

// const ast = esprima.parse(code);
// const scopeManager = escope.analyze(ast);

// let currentScope = scopeManager.acquire(ast);   // global scope

// estraverse.traverse(ast, {
//     enter: function(node, parent) {
//         console.log("enter", node.type, node.body);
        
//         if (/Function/.test(node.type)) {
//             currentScope = scopeManager.acquire(node);  // get current function scope
//         }
//     },
//     leave: function(node, parent) {
//         if (/Function/.test(node.type)) {
//             currentScope = currentScope.upper;  // set to parent scope
//         }
        
//         console.log("leave", node.type, node.body);
//     }
// });