# AutoDecompiler Journal

The AutoDecompiler subproject is meant for exploring the feasibility of using ChatGPT/Codex for automatically decompiling obfuscated JS code. ChatGPT seemed quite promising on manual trials, but because verifying that the decompiled output matches the original code is a very tedious process, I decided to automate the process.

The basic idea is to develop a verifier that takes two JS functions, and checks if they (a) return the same value and (b) perform the same sequence of side-effects. I'm planning to write a JS interpreter that can symbolically execute the function to produce `(return value expression, sequence of side-effects)`. The verifier will then use Z3 to compare these tuples of original and decompiled code. I want this verification to be sound but not necessarily complete.

## Dec 21

- Heavily second-guessing if the approach is good. Not sure if I'm over-complicating this or this is necessary.
  - One simpler idea is to construct expression trees for the functions, and then compare the trees.
  
## Dec 29

- I'm getting quite convinced that the approach is good. One vague benefit of using Z3 is that we could potentially use it to automatically fix the broken decompilation, at least for simple cases where some code block should be wrapped inside an if statement, etc.
- Today I implemented a simple expression interpreter that can convert a small subset of JS expressions into Z3 expressions. These expressions can be compared using Z3, and we can determine if they're equal or not. This checking isn't complete, but it's sound. It can be made more complete by adding more theorems. But for now I'm just going ahead with representing operators as uninterpreted functions over specific sorts. I haven't yet taken care of type-casting issues, but one thing at a time.
- rant: JS ecosystem is unnecessarily complicated and riddled with a thousand options for doing the same thing. it's annoying. sigh.
- wrote down an [example](ex1.md) to motivate this project.