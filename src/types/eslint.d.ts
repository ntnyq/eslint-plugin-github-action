/**
 * @file YAML ESLint types
 */

import type { Rule } from 'eslint'
import type { JSONSchema4 } from 'json-schema'
import type { SourceCode } from './source-code'
import type { YAMLAst } from './yaml'

export type ReportDescriptor<TMessageIds extends string> =
  ReportDescriptorWithSuggestion<TMessageIds> &
    (ReportDescriptorLocOnly | ReportDescriptorNodeOptionalLoc)

export type ReportDescriptorBase<TMessageIds extends string> = {
  readonly data?: ReportDescriptorMessageData
  readonly fix?: Rule.ReportFixer
  readonly messageId: TMessageIds
}

export type ReportDescriptorLocOnly = {
  loc: Readonly<YAMLAst.Position> | Readonly<YAMLAst.SourceLocation>
}

export type ReportDescriptorMessageData = Readonly<Record<string, unknown>>
export type ReportDescriptorNodeOptionalLoc = {
  readonly loc?: Readonly<YAMLAst.Position> | Readonly<YAMLAst.SourceLocation>
  readonly node: YAMLAst.YAMLNode
}

export interface ReportDescriptorWithSuggestion<TMessageIds extends string>
  extends ReportDescriptorBase<TMessageIds> {
  readonly suggest?: readonly Rule.SuggestionReportDescriptor[]
}
export interface RuleContext<TMessageIds extends string, TOptions extends readonly unknown[] = []> {
  id: string
  options: TOptions
  settings: { [name: string]: any; yml?: YMLSettings }
  parserPath: string
  parserServices?: {
    isYAML?: true
    parseError?: any
  }
  getAncestors(): YAMLAst.YAMLNode[]
  getFilename(): string
  getSourceCode(): SourceCode
  report(descriptor: ReportDescriptor<TMessageIds>): void
}
export interface RuleCreateAndOptions<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
> {
  create: (
    context: Readonly<RuleContext<TMessageIds, TOptions>>,
    optionsWithDefault: Readonly<TOptions>,
  ) => RuleListener
  defaultOptions: Readonly<TOptions>
}
export interface RuleListener {
  YAMLDocument?: (node: YAMLAst.YAMLDocument) => void
  'YAMLDocument:exit'?: (node: YAMLAst.YAMLDocument) => void
  YAMLDirective?: (node: YAMLAst.YAMLDirective) => void
  'YAMLDirective:exit'?: (node: YAMLAst.YAMLDirective) => void
  YAMLAnchor?: (node: YAMLAst.YAMLAnchor) => void
  'YAMLAnchor:exit'?: (node: YAMLAst.YAMLAnchor) => void
  YAMLTag?: (node: YAMLAst.YAMLTag) => void
  'YAMLTag:exit'?: (node: YAMLAst.YAMLTag) => void
  YAMLMapping?: (node: YAMLAst.YAMLMapping) => void
  'YAMLMapping:exit'?: (node: YAMLAst.YAMLMapping) => void
  YAMLPair?: (node: YAMLAst.YAMLPair) => void
  'YAMLPair:exit'?: (node: YAMLAst.YAMLPair) => void
  YAMLSequence?: (node: YAMLAst.YAMLSequence) => void
  'YAMLSequence:exit'?: (node: YAMLAst.YAMLSequence) => void
  YAMLScalar?: (node: YAMLAst.YAMLScalar) => void
  'YAMLScalar:exit'?: (node: YAMLAst.YAMLScalar) => void
  YAMLAlias?: (node: YAMLAst.YAMLAlias) => void
  'YAMLAlias:exit'?: (node: YAMLAst.YAMLAlias) => void
  YAMLWithMeta?: (node: YAMLAst.YAMLWithMeta) => void
  'YAMLWithMeta:exit'?: (node: YAMLAst.YAMLWithMeta) => void
  Program?: (node: YAMLAst.YAMLProgram) => void
  'Program:exit'?: (node: YAMLAst.YAMLProgram) => void
  [key: string]: ((node: never) => void) | undefined
}

export interface RuleModule<
  TMessageIds extends string,
  TOptions extends readonly unknown[] = [],
  TDocs = unknown,
> {
  defaultOptions: TOptions
  create(context: RuleContext<TMessageIds, TOptions>): RuleListener
  meta?: RuleMetaData<TMessageIds, TDocs, TOptions>
}

type YMLSettings = { indent?: number }

/**
 * Rule meta related
 */
export interface NamedCreateRuleMeta<
  TMessageIds extends string,
  TDocs = unknown,
  TOptions extends readonly unknown[] = [],
> extends Omit<RuleMetaData<TMessageIds, TDocs, TOptions>, 'docs'> {
  docs: RuleMetaDataDocs & TDocs
}
export interface RuleMetaData<
  TMessageIds extends string,
  TDocs = unknown,
  TOptions extends readonly unknown[] = [],
> {
  deprecated?: boolean
  docs?: RuleMetaDataDocs & TDocs
  fixable?: 'code' | 'whitespace'
  hasSuggestions?: boolean
  messages: Record<TMessageIds, string>
  replacedBy?: readonly string[]
  schema: JSONSchema4 | readonly JSONSchema4[]
  type: 'layout' | 'problem' | 'suggestion'
  defaultOptions?: TOptions
}

export interface RuleMetaDataDocs {
  description: string
  url?: string
  category?: string
  recommended?: boolean
}
export interface RuleWithMeta<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
  TDocs = unknown,
> extends RuleCreateAndOptions<TOptions, TMessageIds> {
  meta: RuleMetaData<TMessageIds, TDocs, TOptions>
}
export interface RuleWithMetaAndName<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
  TDocs = unknown,
> extends RuleCreateAndOptions<TOptions, TMessageIds> {
  meta: NamedCreateRuleMeta<TMessageIds, TDocs, TOptions>
  name: string
}
