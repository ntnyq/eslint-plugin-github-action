/**
 * @file YAML ESLint types
 */

import type { Rule } from 'eslint'
import type { JSONSchema4 } from 'json-schema'
import type { SourceCode } from './source-code'
import type { YAMLAst } from './yaml'

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

export type ReportDescriptor<TMessageIds extends string> =
  ReportDescriptorWithSuggestion<TMessageIds>
    & (ReportDescriptorLocOnly | ReportDescriptorNodeOptionalLoc)

export type ReportDescriptorBase<TMessageIds extends string> = {
  readonly messageId: TMessageIds
  readonly data?: ReportDescriptorMessageData
  readonly fix?: Rule.ReportFixer
}

export type ReportDescriptorLocOnly = {
  loc: Readonly<YAMLAst.Position> | Readonly<YAMLAst.SourceLocation>
}
export type ReportDescriptorMessageData = Readonly<Record<string, unknown>>

export type ReportDescriptorNodeOptionalLoc = {
  readonly node: YAMLAst.YAMLNode
  readonly loc?: Readonly<YAMLAst.Position> | Readonly<YAMLAst.SourceLocation>
}
export interface ReportDescriptorWithSuggestion<TMessageIds extends string>
  extends ReportDescriptorBase<TMessageIds> {
  readonly suggest?: readonly Rule.SuggestionReportDescriptor[]
}
export interface RuleContext<
  TMessageIds extends string,
  TOptions extends readonly unknown[] = [],
> {
  id: string
  options: TOptions
  parserPath: string
  settings: { yml?: YMLSettings; [name: string]: any }
  getAncestors(): YAMLAst.YAMLNode[]
  getFilename(): string
  getSourceCode(): SourceCode
  report(descriptor: ReportDescriptor<TMessageIds>): void
  parserServices?: {
    isYAML?: true
    parseError?: any
  }
}
export interface RuleCreateAndOptions<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
> {
  defaultOptions: Readonly<TOptions>
  create: (
    context: Readonly<RuleContext<TMessageIds, TOptions>>,
    optionsWithDefault: Readonly<TOptions>,
  ) => RuleListener
}

export interface RuleListener {
  Program?: (node: YAMLAst.YAMLProgram) => void
  'Program:exit'?: (node: YAMLAst.YAMLProgram) => void
  YAMLAlias?: (node: YAMLAst.YAMLAlias) => void
  'YAMLAlias:exit'?: (node: YAMLAst.YAMLAlias) => void
  YAMLAnchor?: (node: YAMLAst.YAMLAnchor) => void
  'YAMLAnchor:exit'?: (node: YAMLAst.YAMLAnchor) => void
  YAMLDirective?: (node: YAMLAst.YAMLDirective) => void
  'YAMLDirective:exit'?: (node: YAMLAst.YAMLDirective) => void
  YAMLDocument?: (node: YAMLAst.YAMLDocument) => void
  'YAMLDocument:exit'?: (node: YAMLAst.YAMLDocument) => void
  YAMLMapping?: (node: YAMLAst.YAMLMapping) => void
  'YAMLMapping:exit'?: (node: YAMLAst.YAMLMapping) => void
  YAMLPair?: (node: YAMLAst.YAMLPair) => void
  'YAMLPair:exit'?: (node: YAMLAst.YAMLPair) => void
  YAMLScalar?: (node: YAMLAst.YAMLScalar) => void
  'YAMLScalar:exit'?: (node: YAMLAst.YAMLScalar) => void
  YAMLSequence?: (node: YAMLAst.YAMLSequence) => void
  'YAMLSequence:exit'?: (node: YAMLAst.YAMLSequence) => void
  YAMLTag?: (node: YAMLAst.YAMLTag) => void
  'YAMLTag:exit'?: (node: YAMLAst.YAMLTag) => void
  YAMLWithMeta?: (node: YAMLAst.YAMLWithMeta) => void
  'YAMLWithMeta:exit'?: (node: YAMLAst.YAMLWithMeta) => void
  [key: string]: ((node: never) => void) | undefined
}

export interface RuleMetaData<
  TMessageIds extends string,
  TDocs = unknown,
  TOptions extends readonly unknown[] = [],
> {
  messages: Record<TMessageIds, string>
  schema: JSONSchema4 | readonly JSONSchema4[]
  type: 'layout' | 'problem' | 'suggestion'
  defaultOptions?: TOptions
  deprecated?: boolean
  docs?: RuleMetaDataDocs & TDocs
  fixable?: 'code' | 'whitespace'
  hasSuggestions?: boolean
  replacedBy?: readonly string[]
}

export interface RuleMetaDataDocs {
  description: string
  category?: string
  recommended?: boolean
  url?: string
}
export interface RuleModule<
  TMessageIds extends string,
  TOptions extends readonly unknown[] = [],
  TDocs = unknown,
> {
  defaultOptions: TOptions
  meta?: RuleMetaData<TMessageIds, TDocs, TOptions>
  create(context: RuleContext<TMessageIds, TOptions>): RuleListener
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
type YMLSettings = { indent?: number }
