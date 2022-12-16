// sibling-function-fetcher
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getSiblingFunctionStart = exports.getSiblingFunctions = undefined;

const M_get_prompt_actual = require("get-prompt-actual");
const M_get_prompt_parsing_utils = require("get-prompt-parsing-utils");

exports.getSiblingFunctions = async function ({
  source: source,
  offset: offset,
  languageId: languageId,
}) {
  var i;
  var s;
  const siblings = [];
  let beforeInsertion = "";
  let afterInsertion = source.substring(0, offset);

  if (M_get_prompt_parsing_utils.isSupportedLanguageId(languageId)) {
    const parseTree = await M_get_prompt_parsing_utils.parseTree(languageId, source);
    try {
      let idx = offset;
      for (; idx >= 0 && /\s/.test(source[idx]);)
        idx--;
      const curDescendent = parseTree.rootNode.descendantForIndex(idx);
      const ancestor = M_get_prompt_parsing_utils.getAncestorWithSiblingFunctions(
        languageId,
        curDescendent
      );
      if (ancestor) {
        const firstComment = M_get_prompt_parsing_utils.getFirstPrecedingComment(ancestor);
        // either firstComment.startIndex or ancestor.startIndex
        const startIdx =
          null !== (i = null == firstComment ? undefined : firstComment.startIndex) && undefined !== i
            ? i
            : ancestor.startIndex;
        let p;
        let f = 0;
        for (; " " == (p = source[startIdx - f - 1]) || "\t" == p;) f++;
        const ws = source.substring(startIdx - f, startIdx); // whitespace (i think)

        for (let sibling = ancestor.nextSibling; sibling; sibling = sibling.nextSibling)
          if (M_get_prompt_parsing_utils.isFunctionDefinition(languageId, sibling)) {
            const comment = M_get_prompt_parsing_utils.getFirstPrecedingComment(sibling);
            // either comment.startIndex or sibling.startIndex
            const startIdx =
              null !== (s = null == comment ? undefined : comment.startIndex) &&
                undefined !== s
                ? s
                : sibling.startIndex;
            // what. wouldn't startIdx always be less than offset?
            if (startIdx < offset) continue;
            const siblingSrc = source.substring(startIdx, sibling.endIndex);
            const siblingSrc2 = M_get_prompt_actual.newLineEnded(siblingSrc) + "\n" + ws;
            siblings.push(siblingSrc2);
          }
        beforeInsertion = source.substring(0, startIdx);
        afterInsertion = source.substring(startIdx, offset);
      }
    } finally {
      parseTree.delete();
    }
  }

  return {
    siblings: siblings,
    beforeInsertion: beforeInsertion,
    afterInsertion: afterInsertion,
  };
};
exports.getSiblingFunctionStart = async function ({
  source: source,
  offset: offset,
  languageId: languageId,
}) {
  var r;
  if (M_get_prompt_parsing_utils.isSupportedLanguageId(languageId)) {
    const parseTree = await M_get_prompt_parsing_utils.parseTree(languageId, source);
    try {
      let idx = offset;
      for (; idx >= 0 && /\s/.test(source[idx]);)
        idx--;

      const desc = parseTree.rootNode.descendantForIndex(idx);
      const ancestor = M_get_prompt_parsing_utils.getAncestorWithSiblingFunctions(
        languageId,
        desc
      );

      if (ancestor) {
        for (let sibling = ancestor.nextSibling; sibling; sibling = sibling.nextSibling)
          if (M_get_prompt_parsing_utils.isFunctionDefinition(languageId, sibling)) {
            const comment = M_get_prompt_parsing_utils.getFirstPrecedingComment(sibling);
            const startIdx =
              null !== (r = null == comment ? undefined : comment.startIndex) &&
                undefined !== r
                ? r
                : sibling.startIndex;
            if (startIdx < offset) continue;
            return startIdx;
          }
        if (ancestor.endIndex >= offset)
          return ancestor.endIndex;
      }
    } finally {
      parseTree.delete();
    }
  }
  return offset;
};
