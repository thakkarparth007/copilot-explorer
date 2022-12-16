// get-prompt-actual.js
Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.getPrompt =
    exports.newLineEnded =
    exports.normalizeLanguageId =
    exports.PromptOptions =
    exports.SuffixStartMode =
    exports.SuffixMatchOption =
    exports.SuffixOption =
    exports.LineEndingOptions =
    exports.LocalImportContextOption =
    exports.SnippetSelectionOption =
    exports.NeighboringTabsPositionOption =
    exports.NeighboringTabsOption =
    exports.SiblingOption =
    exports.PathMarkerOption =
    exports.LanguageMarkerOption =
    exports.TOKENS_RESERVED_FOR_SUFFIX_ENCODING =
    exports.MAX_EDIT_DISTANCE_LENGTH =
    exports.MAX_PROMPT_LENGTH =
    undefined;
const M_language_marker_constants = require("language-marker-constants");
const M_imports_and_docs_extractor = require("imports-and-docs-extractor");
const M_neighbor_snippet_selector = require("neighbor-snippet-selector");
const M_sibling_function_fetcher = require("sibling-function-fetcher");
const M_tokenizer = require("tokenizer");
const M_prompt_choices_and_wishlist = require("prompt-choices-and-wishlist");
const M_edit_distance = require("edit-distance");

// this thing's VERY weird.
// Looks like the getPrompt function remembers the previous used
// suffix, and if the suffix extracted currently is "roughly" the same
// then it uses the previous suffix.
// This is some weird caching thing, which idk why it's here.
// Probably the backend model can benefit from cached suffixes?????
// How? I can't imagine how.
// "roughly the same" computation is defined by the SuffixMatchOption (Equal/Levenshtein)
let cachedSuffix = {
    text: "",
    tokens: [],
};

var LanguageMarkerOption; // NoMarker, Top, Always
var PathMarkerOption; // NoMarker, Top, Always
var SiblingOption; // NoSiblings, SiblingsOverContext, ContextOverSiblings
var NeighboringTabsOption; // None, Conservative, Medium, Eager, EagerButLittle
var NeighboringTabsPositionOption; // TopOfText, DirectlyAboveCursor, AfterSiblings
var SnippetSelectionOption; // BestMatch, TopK
var LocalImportContextOption; // NoContext, Declarations
var LineEndingOptions; // ConvertToUnix, KeepOriginal
var SuffixMatchOption; // Equal, Levenshtein
var SuffixStartMode; // Cursor, CursorTrimStart, SiblingBlock, SiblingBlockTrimStart
var SuffixOption; // None, FifteenPercent

// Prompt can only have 1500 tokens
exports.MAX_PROMPT_LENGTH = 1500;
// This variable controls how cached suffix vs current suffix are compared
// if SuffixMatchOption is Levenshtein, then the edit distance is computed
// on the first 50 tokens of the suffix and the cached suffix.
// Again, I find this really weird.
exports.MAX_EDIT_DISTANCE_LENGTH = 50;
// Not sure how this encoding works. Maybe at a parent level when it
// is all converted to a string. Dk if that happens in the extension
// or a backend.
exports.TOKENS_RESERVED_FOR_SUFFIX_ENCODING = 5;

(function (e) {
    e.NoMarker = "nomarker";
    e.Top = "top";
    e.Always = "always";
})((LanguageMarkerOption = exports.LanguageMarkerOption || (exports.LanguageMarkerOption = {})));

(function (e) {
    e.NoMarker = "nomarker";
    e.Top = "top";
    e.Always = "always";
})((PathMarkerOption = exports.PathMarkerOption || (exports.PathMarkerOption = {})));

(function (e) {
    e.NoSiblings = "nosiblings";
    e.SiblingsOverContext = "siblingabove";
    e.ContextOverSiblings = "contextabove";
})((SiblingOption = exports.SiblingOption || (exports.SiblingOption = {})));

(function (e) {
    e.None = "none";
    e.Conservative = "conservative";
    e.Medium = "medium";
    e.Eager = "eager";
    e.EagerButLittle = "eagerButLittle";
})((NeighboringTabsOption = exports.NeighboringTabsOption || (exports.NeighboringTabsOption = {})));

(function (e) {
    e.TopOfText = "top";
    e.DirectlyAboveCursor = "aboveCursor";
    e.AfterSiblings = "afterSiblings";
})(
    (NeighboringTabsPositionOption =
        exports.NeighboringTabsPositionOption ||
        (exports.NeighboringTabsPositionOption = {}))
);

(function (e) {
    e.BestMatch = "bestMatch";
    e.TopK = "topK";
})(
    (SnippetSelectionOption = exports.SnippetSelectionOption || (exports.SnippetSelectionOption = {}))
);

(function (e) {
    e.NoContext = "nocontext";
    e.Declarations = "declarations";
})(
    (LocalImportContextOption =
        exports.LocalImportContextOption || (exports.LocalImportContextOption = {}))
);

(function (e) {
    e.ConvertToUnix = "unix";
    e.KeepOriginal = "keep";
})((LineEndingOptions = exports.LineEndingOptions || (exports.LineEndingOptions = {})));

(SuffixOption = exports.SuffixOption || (exports.SuffixOption = {})).None = "none";
SuffixOption.FifteenPercent = "fifteenPercent";

(function (e) {
    e.Equal = "equal";
    e.Levenshtein = "levenshteineditdistance";
})((SuffixMatchOption = exports.SuffixMatchOption || (exports.SuffixMatchOption = {})));

(function (e) {
    e.Cursor = "cursor";
    e.CursorTrimStart = "cursortrimstart";
    e.SiblingBlock = "siblingblock";
    e.SiblingBlockTrimStart = "siblingblocktrimstart";
})((SuffixStartMode = exports.SuffixStartMode || (exports.SuffixStartMode = {})));

class PromptOptions {
    constructor(fs, kwargs) {
        this.fs = fs;
        this.maxPromptLength = exports.MAX_PROMPT_LENGTH;
        this.languageMarker = LanguageMarkerOption.Top;
        this.pathMarker = PathMarkerOption.Top;
        this.includeSiblingFunctions = SiblingOption.ContextOverSiblings;
        this.localImportContext = LocalImportContextOption.Declarations;
        this.neighboringTabs = NeighboringTabsOption.Eager;
        this.neighboringTabsPosition = NeighboringTabsPositionOption.TopOfText;
        this.lineEnding = LineEndingOptions.ConvertToUnix;
        this.suffixPercent = 0;
        this.suffixStartMode = SuffixStartMode.Cursor;
        this.suffixMatchThreshold = 0;
        this.suffixMatchCriteria = SuffixMatchOption.Levenshtein;
        this.fimSuffixLengthThreshold = 0;
        // override defaults with kwargs
        if (kwargs) for (const e in kwargs) this[e] = kwargs[e];
        if (this.suffixPercent < 0 || this.suffixPercent > 100)
            throw new Error(
                `suffixPercent must be between 0 and 100, but was ${this.suffixPercent}`
            );
        if (this.suffixPercent > 0 && this.includeSiblingFunctions != SiblingOption.NoSiblings)
            throw new Error(
                `Invalid option combination. Cannot set suffixPercent > 0 (${this.suffixPercent}) and includeSiblingFunctions ${this.includeSiblingFunctions}`
            );
        if (this.suffixMatchThreshold < 0 || this.suffixMatchThreshold > 100)
            throw new Error(
                `suffixMatchThreshold must be at between 0 and 100, but was ${this.suffixMatchThreshold}`
            );
        if (this.fimSuffixLengthThreshold < -1)
            throw new Error(
                `fimSuffixLengthThreshold must be at least -1, but was ${this.fimSuffixLengthThreshold}`
            );
        if (
            null != this.indentationMinLength &&
            null != this.indentationMaxLength &&
            this.indentationMinLength > this.indentationMaxLength
        )
            throw new Error(
                `indentationMinLength must be less than or equal to indentationMaxLength, but was ${this.indentationMinLength} and ${this.indentationMaxLength}`
            );
        if (
            this.snippetSelection === SnippetSelectionOption.TopK &&
            undefined === this.snippetSelectionK
        )
            throw new Error("snippetSelectionK must be defined.");
        if (
            this.snippetSelection === SnippetSelectionOption.TopK &&
            this.snippetSelectionK &&
            this.snippetSelectionK <= 0
        )
            throw new Error(
                `snippetSelectionK must be greater than 0, but was ${this.snippetSelectionK}`
            );
    }
}
exports.PromptOptions = PromptOptions;

const E = {
    javascriptreact: "javascript",
    jsx: "javascript",
    typescriptreact: "typescript",
    jade: "pug",
    cshtml: "razor",
};

function normalizeLanguageId(langId) {
    var t;
    langId = langId.toLowerCase();
    return null !== (t = E[langId]) && undefined !== t ? t : langId;
}

// ensure that the string ends with a newline except for empty strings
function newLineEnded(str) {
    return "" == str || str.endsWith("\n") ? str : str + "\n";
}

exports.normalizeLanguageId = normalizeLanguageId;
exports.newLineEnded = newLineEnded;

// type of relevantDocs[i] ==> {uri, source, relativePath, languageId}
// type of curFile ==> relevantDocs[i] + {offset}
exports.getPrompt = async function (fs, curFile, promptOpts = {}, relevantDocs = []) {
    var suffixVsCachedSuffixEditDist;
    const promptOptions = new PromptOptions(fs, promptOpts);
    let useCachedSuffix = false;

    const { source: curSrc, offset: offset } = curFile;
    if (offset < 0 || offset > curSrc.length)
        throw new Error(`Offset ${offset} is out of range.`);

    curFile.languageId = normalizeLanguageId(curFile.languageId);
    // Priorities is a class with helper methods to create prioritized properties
    const priorities = new M_prompt_choices_and_wishlist.Priorities();
    const beforeCursorPriority = priorities.justBelow(M_prompt_choices_and_wishlist.Priorities.TOP);
    const languageMarkerPriority =
        promptOptions.languageMarker == LanguageMarkerOption.Always
            ? priorities.justBelow(M_prompt_choices_and_wishlist.Priorities.TOP)
            : priorities.justBelow(beforeCursorPriority);
    const pathMarkerPriority =
        promptOptions.pathMarker == PathMarkerOption.Always
            ? priorities.justBelow(M_prompt_choices_and_wishlist.Priorities.TOP)
            : priorities.justBelow(beforeCursorPriority);
    const siblingsPriority =
        promptOptions.includeSiblingFunctions == SiblingOption.ContextOverSiblings
            ? priorities.justBelow(beforeCursorPriority)
            : priorities.justAbove(beforeCursorPriority);
    const localImportPriority = priorities.justBelow(beforeCursorPriority, siblingsPriority);
    const similarSnippetPriority = priorities.justBelow(localImportPriority);

    // PromptWishlist appears to be a class to which:
    // (a) you add a wishlist of elements you want in the final prompt
    //      along with the priorities you have in mind for each element
    // (b) and at the end it lets you "fulfill" the wishlist
    //      based on some constraints (prompt size, priorities)
    const pWishlist = new M_prompt_choices_and_wishlist.PromptWishlist(promptOptions.lineEnding);
    let langMarkerElemIdxs; // indices of language markers in the wishlist
    let pathMarkerElemIdxs; // indices of path markers in the wishlist

    // if language-marker option is enabled, add current file's language marker
    // to the wishlist
    if (promptOptions.languageMarker != LanguageMarkerOption.NoMarker) {
        // e.g., `#!/usr/bin/env python3` for python, or `Language: 
        const e = newLineEnded(M_language_marker_constants.getLanguageMarker(curFile));
        langMarkerElemIdxs = pWishlist.append(
            e,
            M_prompt_choices_and_wishlist.PromptElementKind.LanguageMarker,
            languageMarkerPriority
        );
    }

    // if path-marker option is enabled, add current file's path marker to the wishlist
    if (promptOptions.pathMarker != PathMarkerOption.NoMarker) {
        const e = newLineEnded(M_language_marker_constants.getPathMarker(curFile));
        if (e.length > 0) {
            pathMarkerElemIdxs = pWishlist.append(
                e,
                M_prompt_choices_and_wishlist.PromptElementKind.PathMarker,
                pathMarkerPriority
            );
        }
    }

    // if local-import-context option is enabled, add local import context to the wishlist
    if (promptOptions.localImportContext != LocalImportContextOption.NoContext) {
        // at least in current version, this seems to be defined only for typescript
        // and basically that returns a list of imported symbols
        for (const e of await M_imports_and_docs_extractor.extractLocalImportContext(
            curFile,
            promptOptions.fs
        )) {
            pWishlist.append(
                newLineEnded(e),
                M_prompt_choices_and_wishlist.PromptElementKind.ImportedFile,
                localImportPriority
            );
        }
    }
    
    // if neighboringTabs option is enabled and we have relevant docs, collect snippets from
    // those files.
    // This contains the "Compare this snippet from `path/to/file`:<snip>" parts of the prompt
    const neighborSnippets =
        promptOptions.neighboringTabs == NeighboringTabsOption.None || 0 == relevantDocs.length
            ? []
            : await M_neighbor_snippet_selector.getNeighborSnippets(
                curFile,
                relevantDocs,
                promptOptions.neighboringTabs,
                promptOptions.indentationMinLength,
                promptOptions.indentationMaxLength,
                promptOptions.snippetSelectionOption,
                promptOptions.snippetSelectionK
            );
    function addSnippetsToWishlist() {
        neighborSnippets.forEach((nbrSnip) =>
            pWishlist.append(
                nbrSnip.snippet,
                M_prompt_choices_and_wishlist.PromptElementKind.SimilarFile,
                similarSnippetPriority,
                M_tokenizer.tokenLength(nbrSnip.snippet),
                nbrSnip.score
            )
        );
    }
    // dk why this condition exists.
    // also dk who sets this option.
    // At least `prompt-extractor.js` (probably the only caller of this function)
    // doesn't set this option. Which means the default value from PromptOptions
    // is used, which is `TopOfText`.
    //
    // tldr: this condition seems to always be true.
    if (promptOptions.neighboringTabsPosition == NeighboringTabsPositionOption.TopOfText) {
        addSnippetsToWishlist();
    }

    // index in the wishlist of the elements that are of type `BeforeCursor`
    const beforeCursorElemIdxs = [];
    // I'm not sure what this is supposed to mean
    let U;

    // if sibling-functions option is disabled, `U` is the text before the cursor
    // not sure what U is supposed to mean
    if (promptOptions.includeSiblingFunctions == SiblingOption.NoSiblings) {
        U = curSrc.substring(0, offset);
    }
    // if sibling-functions option is enabled...
    else {
        const {
            siblings: siblings,
            beforeInsertion: beforeInsertion,
            afterInsertion: afterInsertion,
        } = await M_sibling_function_fetcher.getSiblingFunctions(curFile);

        // appendLineForLine returns indices of the elements it added to the wishlist
        pWishlist.appendLineForLine(
            beforeInsertion,
            M_prompt_choices_and_wishlist.PromptElementKind.BeforeCursor,
            beforeCursorPriority
        ).forEach((e) => beforeCursorElemIdxs.push(e));
        
        let siblingPriority = siblingsPriority;
        siblings.forEach((e) => {
            pWishlist.append(
                e,
                M_prompt_choices_and_wishlist.PromptElementKind.AfterCursor,
                siblingPriority
            );
            // reduce priority for next sibling (coz siblings were sorted, i think by closeness to
            // insertion point)
            siblingPriority = priorities.justBelow(siblingPriority);
        });
        if (promptOptions.neighboringTabsPosition == NeighboringTabsPositionOption.AfterSiblings) {
            addSnippetsToWishlist();
        }
        U = afterInsertion;
    }

    // dk who sets this option to DirectlyAboveCursor.
    if (promptOptions.neighboringTabsPosition == NeighboringTabsPositionOption.DirectlyAboveCursor) {
        const lastLineIdx = U.lastIndexOf("\n") + 1;
        const textBeforeLastLine = U.substring(0, lastLineIdx);
        const lastLineText = U.substring(lastLineIdx);
        
        // this is weird.....why would you wanna do this?
        // include stuff in curfile till before the last line
        // then add similar snippets and THEN add the last line?
        // wouldn't it break the flow?
        // i understand the last line needs to be at the end,
        // because model needs to complete that line,
        // but why break the current function...wat.
        // this branch anyway appears to not be used so i guess things are fine
        // but i might be wrong.
        pWishlist.appendLineForLine(
            textBeforeLastLine,
            M_prompt_choices_and_wishlist.PromptElementKind.BeforeCursor,
            beforeCursorPriority
        ).forEach((e) => beforeCursorElemIdxs.push(e));
        addSnippetsToWishlist();
        
        if (lastLineText.length > 0) {
            // also, maybe i've named this variable incorrectly
            // code above made it seem this only contained
            // BeforeCursor elements. but here something else
            // is going on.
            beforeCursorElemIdxs.push(
                pWishlist.append(
                    lastLineText,
                    M_prompt_choices_and_wishlist.PromptElementKind.AfterCursor,
                    beforeCursorPriority
                )
            );
            if (beforeCursorElemIdxs.length > 1) {
                // lol inverse dependency? i really don't get what's happening when nbrTabsOption == DirectlyAboveCursor
                pWishlist.require(beforeCursorElemIdxs[beforeCursorElemIdxs.length - 2], beforeCursorElemIdxs[beforeCursorElemIdxs.length - 1]);
            }
        }
    } else
        pWishlist.appendLineForLine(
            U,
            M_prompt_choices_and_wishlist.PromptElementKind.BeforeCursor,
            beforeCursorPriority
        ).forEach((e) => beforeCursorElemIdxs.push(e));
    
    if (LanguageMarkerOption.Top == promptOptions.languageMarker && beforeCursorElemIdxs.length > 0 && undefined !== langMarkerElemIdxs) {
        // idk why this dependency exists.
        pWishlist.require(langMarkerElemIdxs, beforeCursorElemIdxs[0]);
    }
    if (PathMarkerOption.Top == promptOptions.pathMarker && beforeCursorElemIdxs.length > 0 && undefined !== pathMarkerElemIdxs) {
        // again. why does this dependency exist?
        if (langMarkerElemIdxs) {
            pWishlist.require(pathMarkerElemIdxs, langMarkerElemIdxs);
        } else {
            pWishlist.require(pathMarkerElemIdxs, beforeCursorElemIdxs[0]);
        }
    }

    if (undefined !== langMarkerElemIdxs && undefined !== pathMarkerElemIdxs) {
        // um. why this anti-dependency? i don't get it. doesn't this contradict the
        // above dependency?
        pWishlist.exclude(pathMarkerElemIdxs, langMarkerElemIdxs);
    }

    let suffix = curSrc.slice(offset);
    // oh wow, suffix length threshold is a LOWER bound. i thought it was an upper bound.
    if (0 == promptOptions.suffixPercent || suffix.length <= promptOptions.fimSuffixLengthThreshold)
        return pWishlist.fulfill(promptOptions.maxPromptLength);
    
    // a random block. why not.
    // this stuff deals with suffix.
    {
        let suffixOffset = curFile.offset;
        if (
            promptOptions.suffixStartMode !== SuffixStartMode.Cursor &&
            promptOptions.suffixStartMode !== SuffixStartMode.CursorTrimStart
        ) {
            // this function appears to find where the next sibling function starts
            // AFTER the cursor (if no sibling function is found, it returns cursor offset)
            suffixOffset = await M_sibling_function_fetcher.getSiblingFunctionStart(curFile);
        }

        const budget = promptOptions.maxPromptLength - exports.TOKENS_RESERVED_FOR_SUFFIX_ENCODING;

        let prefixBudget = Math.floor((budget * (100 - promptOptions.suffixPercent)) / 100);
        let fulfilment = pWishlist.fulfill(prefixBudget);
        // suffixBudget may be greater than budget * suffixPercent / 100
        // because prefixBudget needn't be fully used.
        // i think.
        const suffixBudget = budget - fulfilment.prefixLength;
        
        let suffixText = curSrc.slice(suffixOffset);
        if (
            promptOptions.suffixStartMode != SuffixStartMode.SiblingBlockTrimStart &&
            promptOptions.suffixStartMode != SuffixStartMode.CursorTrimStart
        ) {
            suffixText = suffixText.trimStart();
        }

        const suffixTokens = M_tokenizer.takeFirstTokens(suffixText, suffixBudget);
        if (suffixTokens.tokens.length <= suffixBudget - 3) {
            // what's this 3?
            prefixBudget = budget - suffixTokens.tokens.length;
            // oh if suffix tokens are less than the suffix budget,
            // we can expand the prefix budget.
            // okay, nice you're greedy, I like that.
            fulfilment = pWishlist.fulfill(prefixBudget);
        }

        // SuffixMatchOption.Equal means the cached suffix is used
        // if the suffix is EXACTLY equal to the cached suffix.
        if (promptOptions.suffixMatchCriteria == SuffixMatchOption.Equal) {
            if (
                suffixTokens.tokens.length === cachedSuffix.tokens.length &&
                suffixTokens.tokens.every((e, t) => e === cachedSuffix.tokens[t])
            ) {
                useCachedSuffix = true;
            }
        } else {
            // this is the levenshtein distance stuff.
            // also, damn, what a long if statement.
            if (
                promptOptions.suffixMatchCriteria == SuffixMatchOption.Levenshtein &&
                suffixTokens.tokens.length > 0 &&
                promptOptions.suffixMatchThreshold > 0 &&
                100 *
                (null ===
                    (suffixVsCachedSuffixEditDist = M_edit_distance.findEditDistanceScore(
                        suffixTokens.tokens.slice(0, exports.MAX_EDIT_DISTANCE_LENGTH),
                        cachedSuffix.tokens.slice(0, exports.MAX_EDIT_DISTANCE_LENGTH)
                    )) || undefined === suffixVsCachedSuffixEditDist
                    ? undefined
                    : suffixVsCachedSuffixEditDist.score) <
                promptOptions.suffixMatchThreshold *
                Math.min(exports.MAX_EDIT_DISTANCE_LENGTH, suffixTokens.tokens.length)
            ) {
                useCachedSuffix = true;
            }
        }

        if (true === useCachedSuffix && cachedSuffix.tokens.length <= suffixBudget) {
            if (cachedSuffix.tokens.length <= suffixBudget - 3) {
                // again, recompute prefix budget (in case suffix budget is greater than
                // what's required by suffix)
                prefixBudget = budget - cachedSuffix.tokens.length;
                fulfilment = pWishlist.fulfill(prefixBudget);
            }
            fulfilment.suffix = cachedSuffix.text;
            fulfilment.suffixLength = cachedSuffix.tokens.length;
        } else {
            fulfilment.suffix = suffixTokens.text;
            fulfilment.suffixLength = suffixTokens.tokens.length;
            cachedSuffix = suffixTokens;
        }
        return fulfilment;
    }
};
