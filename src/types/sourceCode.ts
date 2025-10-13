import type { YAMLAst } from './yaml'

export interface SourceCode {
  ast: YAMLAst.YAMLProgram
  hasBOM: boolean
  lines: string[]
  text: string
  commentsExistBetween(left: YAMLNodeOrToken, right: YAMLNodeOrToken): boolean
  getAllComments(): YAMLAst.Comment[]

  getCommentsAfter(nodeOrToken: YAMLNodeOrToken): YAMLAst.Comment[]

  getCommentsBefore(nodeOrToken: YAMLNodeOrToken): YAMLAst.Comment[]

  getCommentsInside(node: YAMLAst.YAMLNode): YAMLAst.Comment[]

  getFirstToken(node: YAMLAst.YAMLNode): YAMLAst.Token

  getIndexFromLoc(loc: YAMLAst.Position): number

  getLastToken(node: YAMLAst.YAMLNode): YAMLAst.Token

  getLines(): string[]

  getLocFromIndex(index: number): YAMLAst.Position

  // Inherited methods from TokenStore
  // ---------------------------------

  getNodeByRangeIndex(index: number): YAMLAst.YAMLNode | null

  getTokenAfter(node: YAMLNodeOrToken): YAMLAst.Token | null
  getTokenBefore(node: YAMLNodeOrToken): YAMLAst.Token | null

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

  getFirstToken(
    node: YAMLAst.YAMLNode,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null
  getFirstTokenBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null

  getFirstTokens(
    node: YAMLAst.YAMLNode,
    options?: CursorWithCountOptions,
  ): YAMLToken[]

  getFirstTokensBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithCountOptions,
  ): YAMLToken[]
  getLastToken(
    node: YAMLAst.YAMLNode,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null

  getLastTokenBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null

  getLastTokens(
    node: YAMLAst.YAMLNode,
    options?: CursorWithCountOptions,
  ): YAMLToken[]

  getLastTokensBetween(
    left: YAMLNodeOrToken,
    right: YAMLNodeOrToken,
    options?: CursorWithCountOptions,
  ): YAMLToken[]

  getText(
    node?: YAMLNodeOrToken,
    beforeCount?: number,
    afterCount?: number,
  ): string

  getTokenAfter(
    node: YAMLNodeOrToken,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null

  getTokenBefore(
    node: YAMLNodeOrToken,
    options?: CursorWithSkipOptions,
  ): YAMLToken | null

  getTokenByRangeStart(
    offset: number,
    options?: { includeComments?: boolean },
  ): YAMLToken | null
  getTokens(
    node: YAMLAst.YAMLNode,
    beforeCount?: number,
    afterCount?: number,
  ): YAMLToken[]

  getTokens(
    node: YAMLAst.YAMLNode,
    options: CursorWithCountOptions | FilterPredicate,
  ): YAMLToken[]

  getTokensAfter(
    node: YAMLNodeOrToken,
    options?: CursorWithCountOptions,
  ): YAMLToken[]

  getTokensBefore(
    node: YAMLNodeOrToken,
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
