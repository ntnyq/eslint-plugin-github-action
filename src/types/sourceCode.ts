import type { YAMLAst } from './yaml'

/**
 * ESLint source-code utilities specialized for a parsed YAML file.
 */
export interface SourceCode {
  /**
   * Root syntax node containing the file's YAML documents.
   */
  ast: YAMLAst.YAMLProgram
  /**
   * Whether the original source began with a Unicode byte order mark.
   */
  hasBOM: boolean
  /**
   * Source lines without line-ending characters.
   */
  lines: string[]
  /**
   * Complete source text with its leading byte order mark removed.
   */
  text: string

  /**
   * Checks for comments between two non-overlapping nodes or tokens.
   *
   * @param left - Node or token preceding the source span to inspect.
   * @param right - Node or token following the source span to inspect.
   * @returns Whether the intervening span contains at least one comment.
   */
  commentsExistBetween(left: YAMLNodeOrToken, right: YAMLNodeOrToken): boolean

  /**
   * Retrieves every comment in the file.
   *
   * @returns Comments in source order.
   */
  getAllComments(): YAMLAst.Comment[]

  /**
   * Retrieves adjacent comments following a node or token.
   *
   * @param nodeOrToken - Node or token whose trailing comments are requested.
   * @returns Following comments up to the next non-comment token, in source
   * order.
   */
  getCommentsAfter(nodeOrToken: YAMLNodeOrToken): YAMLAst.Comment[]

  /**
   * Retrieves adjacent comments preceding a node or token.
   *
   * @param nodeOrToken - Node or token whose leading comments are requested.
   * @returns Preceding comments after the previous non-comment token, in source
   * order.
   */
  getCommentsBefore(nodeOrToken: YAMLNodeOrToken): YAMLAst.Comment[]

  /**
   * Retrieves comments contained within a node's character range.
   *
   * @param node - YAML node whose contents are inspected.
   * @returns Contained comments in source order.
   */
  getCommentsInside(node: YAMLAst.YAMLNode): YAMLAst.Comment[]

  /**
   * Retrieves a node's first token, excluding comments.
   *
   * @param node - YAML node whose token range is searched.
   * @returns First token, or null if the node contains no tokens.
   */
  getFirstToken(node: YAMLAst.YAMLNode): YAMLAst.Token | null

  /**
   * Converts a source position to a character offset in the BOM-free source
   * text.
   *
   * @param loc - Source position with a one-based line and zero-based column.
   * @returns Zero-based character offset corresponding to the position.
   */
  getIndexFromLoc(loc: YAMLAst.Position): number

  /**
   * Retrieves a node's last token, excluding comments.
   *
   * @param node - YAML node whose token range is searched.
   * @returns Last token, or null if the node contains no tokens.
   */
  getLastToken(node: YAMLAst.YAMLNode): YAMLAst.Token | null

  /**
   * Retrieves the source text split into lines.
   *
   * @returns Source lines without line-ending characters.
   */
  getLines(): string[]

  /**
   * Converts a character offset in the BOM-free source text to a source
   * position.
   *
   * @param index - Zero-based character offset, including the end-of-file
   * offset.
   * @returns Source position with a one-based line and zero-based column.
   */
  getLocFromIndex(index: number): YAMLAst.Position

  // Inherited methods from TokenStore
  // ---------------------------------

  /**
   * Finds the deepest syntax node containing a character offset.
   *
   * @param index - Zero-based character offset in the BOM-free source text.
   * @returns Innermost containing node, or null if no node contains the offset.
   */
  getNodeByRangeIndex(index: number): YAMLAst.YAMLNode | null

  /**
   * Retrieves the next token after a node or token, excluding comments.
   *
   * @param node - Node or token defining the start of the search.
   * @returns Next token, or null at the end of the token stream.
   */
  getTokenAfter(node: YAMLNodeOrToken): YAMLAst.Token | null
  /**
   * Retrieves the previous token before a node or token, excluding comments.
   *
   * @param node - Node or token defining the end of the search.
   * @returns Previous token, or null at the start of the token stream.
   */
  getTokenBefore(node: YAMLNodeOrToken): YAMLAst.Token | null

  /**
   * Child property names used to traverse each YAML syntax node type.
   */
  visitorKeys: {
    /**
     * Properties containing child nodes for the specified AST node type.
     */
    [nodeType: string]: string[]
  }
  /**
   * Optional data supplied by the parser integration.
   */
  parserServices?: {
    /**
     * Indicates that the parser produced a YAML syntax tree.
     */
    isYAML?: true
    /**
     * Parsing error exposed by the parser integration, when available.
     */
    parseError?: any
  }

  /**
   * Retrieves the first matching token within a node.
   *
   * @param node - YAML node whose token range is searched.
   * @param options - Skip count, predicate, or cursor options controlling
   * selection.
   * @returns Matching token or included comment, or null if none matches.
   */
  getFirstToken(
    node: YAMLAst.YAMLNode,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null
  /**
   * Retrieves the first matching token between two non-overlapping boundaries.
   *
   * @param left - Node or token preceding the searched span.
   * @param right - Node or token following the searched span.
   * @param options - Skip count, predicate, or cursor options controlling
   * selection.
   * @returns Matching token or included comment, or null if none matches.
   */
  getFirstTokenBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null

  /**
   * Retrieves matching tokens from the beginning of a node.
   *
   * @param node - YAML node whose token range is searched.
   * @param options - Maximum count, predicate, or cursor options controlling
   * selection.
   * @returns Selected tokens and included comments in source order.
   */
  getFirstTokens(
    node: YAMLAst.YAMLNode,
    options?: CursorWithCountOptions,
  ): YAMLToken[]

  /**
   * Retrieves matching tokens from the beginning of the span between two
   * boundaries.
   *
   * @param left - Node or token preceding the searched span.
   * @param right - Node or token following the searched span.
   * @param options - Maximum count, predicate, or cursor options controlling
   * selection.
   * @returns Selected tokens and included comments in source order.
   */
  getFirstTokensBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithCountOptions,
  ): YAMLToken[]
  /**
   * Retrieves the last matching token within a node.
   *
   * @param node - YAML node whose token range is searched.
   * @param options - Skip count, predicate, or cursor options controlling
   * selection.
   * @returns Matching token or included comment, or null if none matches.
   */
  getLastToken(
    node: YAMLAst.YAMLNode,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null

  /**
   * Retrieves the last matching token between two non-overlapping boundaries.
   *
   * @param left - Node or token preceding the searched span.
   * @param right - Node or token following the searched span.
   * @param options - Skip count, predicate, or cursor options controlling
   * selection.
   * @returns Matching token or included comment, or null if none matches.
   */
  getLastTokenBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null

  /**
   * Retrieves matching tokens from the end of a node.
   *
   * @param node - YAML node whose token range is searched.
   * @param options - Maximum count, predicate, or cursor options controlling
   * selection.
   * @returns Selected tokens and included comments in source order.
   */
  getLastTokens(
    node: YAMLAst.YAMLNode,
    options?: CursorWithCountOptions,
  ): YAMLToken[]

  /**
   * Retrieves matching tokens from the end of the span between two boundaries.
   *
   * @param left - Node or token preceding the searched span.
   * @param right - Node or token following the searched span.
   * @param options - Maximum count, predicate, or cursor options controlling
   * selection.
   * @returns Selected tokens and included comments in source order.
   */
  getLastTokensBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithCountOptions,
  ): YAMLToken[]

  /**
   * Retrieves a source slice or the complete BOM-free file text.
   *
   * @param node - Node or token delimiting the slice; omitted to return the
   * whole file.
   * @param beforeCount - Number of extra characters to include before the node.
   * @param afterCount - Number of extra characters to include after the node.
   * @returns Requested source text, bounded by the start and end of the file.
   */
  getText(
    node?: YAMLNodeOrToken,
    beforeCount?: number,
    afterCount?: number,
  ): string

  /**
   * Retrieves a matching token after a node or token.
   *
   * @param node - Node or token defining the start of the search.
   * @param options - Skip count, predicate, or cursor options controlling
   * selection.
   * @returns Matching token or included comment, or null if none matches.
   */
  getTokenAfter(
    node: YAMLNodeOrToken,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null

  /**
   * Retrieves a matching token before a node or token.
   *
   * @param node - Node or token defining the end of the search.
   * @param options - Skip count, predicate, or cursor options controlling
   * selection.
   * @returns Matching token or included comment, or null if none matches.
   */
  getTokenBefore(
    node: YAMLNodeOrToken,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null

  /**
   * Retrieves the token whose character range starts at an exact offset.
   *
   * @param offset - Zero-based start offset in the BOM-free source text.
   * @param options - Controls whether comments are eligible for the lookup.
   * @param options.includeComments - Whether to include comment tokens in the
   * search.
   * @returns Token or included comment starting at the offset, or null if
   * absent.
   */
  getTokenByRangeStart(
    offset: number,
    options?: {
      /**
       * Whether to search comment tokens as well as regular tokens; defaults to
       * false.
       */
      includeComments?: boolean
    },
  ): YAMLToken | null
  /**
   * Retrieves a node's tokens with optional surrounding token padding.
   *
   * @param node - YAML node whose tokens are requested.
   * @param beforeCount - Number of extra tokens to include before the node.
   * @param afterCount - Number of extra tokens to include after the node.
   * @returns Tokens in source order, excluding comments.
   */
  getTokens(
    node: YAMLAst.YAMLNode,
    beforeCount?: number,
    afterCount?: number,
  ): YAMLToken[]

  /**
   * Retrieves a node's tokens using a filter and optional comment inclusion.
   *
   * @param node - YAML node whose tokens are requested.
   * @param options - Predicate or cursor options controlling token selection.
   * @returns Selected tokens and included comments in source order.
   */
  getTokens(
    node: YAMLAst.YAMLNode,
    options: CursorWithCountOptions | FilterPredicate,
  ): YAMLToken[]

  /**
   * Retrieves matching tokens following a node or token.
   *
   * @param node - Node or token defining the start of the search.
   * @param options - Maximum count, predicate, or cursor options controlling
   * selection.
   * @returns Selected tokens and included comments in source order.
   */
  getTokensAfter(
    node: YAMLNodeOrToken,
    options?: CursorWithCountOptions,
  ): YAMLToken[]

  /**
   * Retrieves matching tokens preceding a node or token.
   *
   * @param node - Node or token defining the end of the search.
   * @param options - Maximum count, predicate, or cursor options controlling
   * selection.
   * @returns Selected tokens and included comments in source order.
   */
  getTokensBefore(
    node: YAMLNodeOrToken,
    options?: CursorWithCountOptions,
  ): YAMLToken[]

  /**
   * Retrieves tokens between two non-overlapping nodes or tokens.
   *
   * @param left - Node or token preceding the requested span.
   * @param right - Node or token following the requested span.
   * @param padding - Extra token count on each side, predicate, or cursor
   * options.
   * @returns Selected tokens and included comments in source order.
   */
  getTokensBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    padding?: number | CursorWithCountOptions | FilterPredicate,
  ): YAMLToken[]
}
/**
 * Token selection by maximum count, predicate, or detailed cursor settings.
 * A numeric option specifies the count; a function specifies the filter.
 */
type CursorWithCountOptions =
  | number
  | FilterPredicate
  | {
      /**
       * Maximum matching token count; zero selects none, while omission selects
       * all.
       */
      count?: number
      /**
       * Predicate selecting which tokens are eligible for the result.
       */
      filter?: FilterPredicate
      /**
       * Whether to consider comments during selection; defaults to false.
       */
      includeComments?: boolean
    }

/**
 * Single-token selection by skip count, predicate, or detailed cursor settings.
 * A numeric option specifies the skip count; a function specifies the filter.
 */
type CursorWithSkipOptions =
  | number
  | FilterPredicate
  | {
      /**
       * Predicate selecting tokens before the skip count is applied.
       */
      filter?: FilterPredicate
      /**
       * Whether to consider comments during selection; defaults to false.
       */
      includeComments?: boolean
      /**
       * Number of matching tokens to skip in the search direction; defaults to
       * zero.
       */
      skip?: number
    }

/**
 * Predicate used by token cursors to select eligible tokens or comments.
 *
 * @param tokenOrComment - Token or included comment currently being considered.
 * @returns Whether the cursor should retain this token or comment.
 */
type FilterPredicate = (tokenOrComment: YAMLToken) => boolean

/**
 * YAML syntax node or non-comment token used as a source-range boundary.
 */
type YAMLNodeOrToken = YAMLAst.Token | YAMLAst.YAMLNode

/**
 * Token-store result that may include a YAML comment when requested.
 */
type YAMLToken = YAMLAst.Comment | YAMLAst.Token
