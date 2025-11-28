// component-tagger-loader: no-op loader to neutralize visual-edits instrumentation.
// This loader intentionally returns the original source unchanged so that
// any build-time tagging/instrumentation is disabled.

module.exports = function componentTaggerLoader(source, inputSourceMap) {
  const callback = this.async();
  // Return original source and map unchanged.
  callback(null, source, inputSourceMap);
};
