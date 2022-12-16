// neighbor-snippet-selector.js
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getNeighborSnippets = exports.neighborOptionToSelection = undefined;

const M_language_marker_constants = require("language-marker-constants");
const M_jaccard_scorer = require("jaccard-scorer");

function compareThisSnippet(e) {
  return [
    e.relativePath
      ? "Compare this snippet from " + e.relativePath + ":"
      : "Compare this snippet:",
  ].concat(e.snippet.split("\n"));
}

exports.neighborOptionToSelection = {
  none: {
    matcherFactory: M_jaccard_scorer.FixedWindowSizeJaccardMatcher.FACTORY(1),
    threshold: -1,
    numberOfSnippets: 0,
  },
  conservative: {
    matcherFactory: M_jaccard_scorer.FixedWindowSizeJaccardMatcher.FACTORY(10),
    threshold: 0.3,
    numberOfSnippets: 1,
  },
  medium: {
    matcherFactory: M_jaccard_scorer.FixedWindowSizeJaccardMatcher.FACTORY(20),
    threshold: 0.1,
    numberOfSnippets: 2,
  },
  eager: {
    matcherFactory: M_jaccard_scorer.FixedWindowSizeJaccardMatcher.FACTORY(60),
    threshold: 0,
    numberOfSnippets: 4,
  },
  eagerButLittle: {
    matcherFactory: M_jaccard_scorer.FixedWindowSizeJaccardMatcher.FACTORY(10),
    threshold: 0,
    numberOfSnippets: 1,
  },
};

exports.getNeighborSnippets = async function (
  curFile,
  relevantDocs,
  neighborTabsOpt,
  indentationMinLengthOpt,
  indentationMaxLengthOpt,
  snippetSelectionOpt,
  snippetSelectionK
) {
  const nbrOpt = exports.neighborOptionToSelection[neighborTabsOpt];

  // nbrMatchers is an instance of JaccardMatcher (set to compare to curFile)
  const nbrMatcher = (function (
    curFile,
    neighborTabsOpt,
    indentationMinLengthOpt,
    indentationMaxLengthOpt
  ) {
    const nbrOpt = {
      ...exports.neighborOptionToSelection[neighborTabsOpt],
    };
    if (
      undefined !== indentationMinLengthOpt &&
      undefined !== indentationMaxLengthOpt
    ) {
      nbrOpt.matcherFactory =
        M_jaccard_scorer.IndentationBasedJaccardMatcher.FACTORY(
          indentationMinLengthOpt,
          indentationMaxLengthOpt
        );
    }
    return nbrOpt.matcherFactory.to(curFile);
  })(
    curFile,
    neighborTabsOpt,
    indentationMinLengthOpt,
    indentationMaxLengthOpt
  );

  // go through each relevantDoc and find matches
  return (
    relevantDocs
      // ignore files that are too long or empty
      .filter((e) => e.source.length < 1e4 && e.source.length > 0)
      // select the first 20 files (already sorted by access time)
      .slice(0, 20)
      // search for matches in each file
      .reduce(
        (allMatches, curRelFile) =>
          allMatches.concat(
            // for curRelFile, find matches, and add relativePath to each match
            nbrMatcher
              .findMatches(curRelFile, snippetSelectionOpt, snippetSelectionK)
              .map((e) => ({
                relativePath: curRelFile.relativePath,
                ...e,
              }))
          ),
        []
      )
      // so far, the pipeline has "allMatches", which is an array of matches from all files
      // now filter out matches with low scores
      .filter((e) => e.score && e.snippet && e.score > nbrOpt.threshold)
      // sort by score
      .sort((e, t) => e.score - t.score)
      // take the last n matches (the ones with the highest scores)
      .slice(-nbrOpt.numberOfSnippets)
      // format the matches
      .map((t) => ({
        score: t.score,
        snippet: compareThisSnippet(t)
          .map(
            (t) =>
              M_language_marker_constants.comment(t, curFile.languageId) + "\n"
          )
          .join(""),
        startLine: t.startLine,
        endLine: t.endLine,
      }))
  );
};
