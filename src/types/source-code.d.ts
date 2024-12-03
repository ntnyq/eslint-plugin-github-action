import type { YAMLAst } from './yaml'

export interface SourceCode {
  ast: YAMLAst.YAMLProgram
  hasBOM: boolean
  lines: string[]
  text: string
  getAllComments(): YAMLAst.Comment[]
  getIndexFromLoc(loc: YAMLAst.Position): number

  getLines(): string[]

  getLocFromIndex(index: number): YAMLAst.Position

  getNodeByRangeIndex(index: number): YAMLAst.YAMLNode | null

  getText(node?: YAMLNodeOrToken, beforeCount?: number, afterCount?: number): string

  isSpaceBetweenTokens(first: YAMLToken, second: YAMLToken): boolean

  visitorKeys: {
    [nodeType: string]: string[]
  }

  parserServices?: {
    isYAML?: true
    parseError?: any
  }

  getComments(node: YAMLNodeOrToken): {
    leading: YAMLAst.Comment[]
    trailing: YAMLAst.Comment[]
  }

  // Inherited methods from TokenStore
  // ---------------------------------

  commentsExistBetween(left: YAMLNodeOrToken, right: YAMLNodeOrToken): boolean

  getCommentsAfter(nodeOrToken: YAMLNodeOrToken): YAMLAst.Comment[]
  getCommentsBefore(nodeOrToken: YAMLNodeOrToken): YAMLAst.Comment[]

  getCommentsInside(node: YAMLAst.YAMLNode): YAMLAst.Comment[]

  getFirstToken(node: YAMLAst.YAMLNode): YAMLAst.Token
  getFirstToken(node: YAMLAst.YAMLNode, options?: CursorWithSkipOptions): YAMLToken | null

  getFirstTokens(node: YAMLAst.YAMLNode, options?: CursorWithCountOptions): YAMLToken[]

  getLastToken(node: YAMLAst.YAMLNode): YAMLAst.Token
  getLastToken(node: YAMLAst.YAMLNode, options?: CursorWithSkipOptions): YAMLToken | null

  getLastTokens(node: YAMLAst.YAMLNode, options?: CursorWithCountOptions): YAMLToken[]

  getTokenAfter(node: YAMLNodeOrToken): YAMLAst.Token | null
  getTokenAfter(node: YAMLNodeOrToken, options?: CursorWithSkipOptions): YAMLToken | null

  getTokenBefore(node: YAMLNodeOrToken): YAMLAst.Token | null

  getTokenBefore(node: YAMLNodeOrToken, options?: CursorWithSkipOptions): YAMLToken | null

  getTokenByRangeStart(offset: number, options?: { includeComments?: boolean }): YAMLToken | null

  getTokens(node: YAMLAst.YAMLNode, beforeCount?: number, afterCount?: number): YAMLToken[]

  getTokens(node: YAMLAst.YAMLNode, options: CursorWithCountOptions | FilterPredicate): YAMLToken[]

  getTokensAfter(node: YAMLNodeOrToken, options?: CursorWithCountOptions): YAMLToken[]

  getTokensBefore(node: YAMLNodeOrToken, options?: CursorWithCountOptions): YAMLToken[]
  getFirstTokenBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null

  getFirstTokensBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithCountOptions,
  ): YAMLToken[]

  getLastTokenBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null

  getLastTokensBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithCountOptions,
  ): YAMLToken[]

  getTokensBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    padding?: number | CursorWithCountOptions | FilterPredicate,
  ): YAMLToken[]
}
type CursorWithCountOptions =
  | number
  | FilterPredicate
  | {
      count?: number
      filter?: FilterPredicate
      includeComments?: boolean
    }

type CursorWithSkipOptions =
  | number
  | FilterPredicate
  | {
      filter?: FilterPredicate
      includeComments?: boolean
      skip?: number
    }

type FilterPredicate = (tokenOrComment: YAMLToken) => boolean

type YAMLNodeOrToken = YAMLAst.Token | YAMLAst.YAMLNode

type YAMLToken = YAMLAst.Comment | YAMLAst.Token
