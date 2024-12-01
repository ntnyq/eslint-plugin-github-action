import type { YAMLAst } from './yaml'

export interface SourceCode {
  text: string
  ast: YAMLAst.YAMLProgram
  lines: string[]
  hasBOM: boolean
  parserServices?: {
    isYAML?: true
    parseError?: any
  }
  visitorKeys: {
    [nodeType: string]: string[]
  }

  getText(node?: YAMLNodeOrToken, beforeCount?: number, afterCount?: number): string

  getLines(): string[]

  getAllComments(): YAMLAst.Comment[]

  getComments(node: YAMLNodeOrToken): {
    leading: YAMLAst.Comment[]
    trailing: YAMLAst.Comment[]
  }

  getNodeByRangeIndex(index: number): null | YAMLAst.YAMLNode

  isSpaceBetweenTokens(first: YAMLToken, second: YAMLToken): boolean

  getLocFromIndex(index: number): YAMLAst.Position

  getIndexFromLoc(loc: YAMLAst.Position): number

  // Inherited methods from TokenStore
  // ---------------------------------

  getTokenByRangeStart(offset: number, options?: { includeComments?: boolean }): null | YAMLToken

  getFirstToken(node: YAMLAst.YAMLNode): YAMLAst.Token
  getFirstToken(node: YAMLAst.YAMLNode, options?: CursorWithSkipOptions): null | YAMLToken

  getFirstTokens(node: YAMLAst.YAMLNode, options?: CursorWithCountOptions): YAMLToken[]

  getLastToken(node: YAMLAst.YAMLNode): YAMLAst.Token
  getLastToken(node: YAMLAst.YAMLNode, options?: CursorWithSkipOptions): null | YAMLToken

  getLastTokens(node: YAMLAst.YAMLNode, options?: CursorWithCountOptions): YAMLToken[]

  getTokenBefore(node: YAMLNodeOrToken): null | YAMLAst.Token
  getTokenBefore(node: YAMLNodeOrToken, options?: CursorWithSkipOptions): null | YAMLToken

  getTokensBefore(node: YAMLNodeOrToken, options?: CursorWithCountOptions): YAMLToken[]

  getTokenAfter(node: YAMLNodeOrToken): null | YAMLAst.Token
  getTokenAfter(node: YAMLNodeOrToken, options?: CursorWithSkipOptions): null | YAMLToken

  getTokensAfter(node: YAMLNodeOrToken, options?: CursorWithCountOptions): YAMLToken[]

  getFirstTokenBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithSkipOptions,
  ): null | YAMLToken

  getFirstTokensBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithCountOptions,
  ): YAMLToken[]

  getLastTokenBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithSkipOptions,
  ): null | YAMLToken

  getLastTokensBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithCountOptions,
  ): YAMLToken[]

  getTokensBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    padding?: CursorWithCountOptions | FilterPredicate | number,
  ): YAMLToken[]

  getTokens(node: YAMLAst.YAMLNode, beforeCount?: number, afterCount?: number): YAMLToken[]
  getTokens(node: YAMLAst.YAMLNode, options: CursorWithCountOptions | FilterPredicate): YAMLToken[]

  commentsExistBetween(left: YAMLNodeOrToken, right: YAMLNodeOrToken): boolean

  getCommentsBefore(nodeOrToken: YAMLNodeOrToken): YAMLAst.Comment[]

  getCommentsAfter(nodeOrToken: YAMLNodeOrToken): YAMLAst.Comment[]

  getCommentsInside(node: YAMLAst.YAMLNode): YAMLAst.Comment[]
}
type CursorWithCountOptions =
  | {
      count?: number
      filter?: FilterPredicate
      includeComments?: boolean
    }
  | FilterPredicate
  | number

type CursorWithSkipOptions =
  | {
      filter?: FilterPredicate
      includeComments?: boolean
      skip?: number
    }
  | FilterPredicate
  | number

type FilterPredicate = (tokenOrComment: YAMLToken) => boolean

type YAMLNodeOrToken = YAMLAst.Token | YAMLAst.YAMLNode

type YAMLToken = YAMLAst.Comment | YAMLAst.Token
