/**
 * @file YAML ESLint types
 */

import type { Rule } from 'eslint'
import type { JSONSchema4 } from 'json-schema'
import type { SourceCode } from './sourceCode'
import type { YAMLAst } from './yaml'

/**
 * Rule metadata requiring documentation for a named rule.
 *
 * @template TMessageIds - Message IDs declared by the rule.
 * @template TDocs - Additional plugin-specific documentation fields.
 * @template TOptions - Tuple of supported rule options.
 */
export interface NamedCreateRuleMeta<
  TMessageIds extends string,
  TDocs = unknown,
  TOptions extends readonly unknown[] = [],
> extends Omit<RuleMetaData<TMessageIds, TDocs, TOptions>, 'docs'> {
  /**
   * Standard and plugin-specific documentation used to describe the named rule.
   */
  docs: RuleMetaDataDocs & TDocs
}

/**
 * Diagnostic identified by a rule message and located by a node or source
 * position.
 *
 * @template TMessageIds - Message IDs available to diagnostics and suggestions.
 */
export type ReportDescriptor<TMessageIds extends string> =
  ReportDescriptorWithSuggestion<TMessageIds> &
    (ReportDescriptorLocOnly | ReportDescriptorNodeOptionalLoc)

/**
 * Message, interpolation data, and optional automatic fix for a diagnostic.
 *
 * @template TMessageIds - Message IDs declared by the rule.
 */
export type ReportDescriptorBase<TMessageIds extends string> = {
  /**
   * Key of the diagnostic's message template in the rule's metadata.
   */
  readonly messageId: TMessageIds
  /**
   * Values substituted into placeholders in the diagnostic's message template.
   */
  readonly data?: ReportDescriptorMessageData
  /**
   * Callback producing automatic text edits, or null when no fix is available.
   */
  readonly fix?: Rule.ReportFixer
}

/**
 * Diagnostic location supplied without requiring an AST node.
 */
export type ReportDescriptorLocOnly = {
  /**
   * Start position or source span, with one-based lines and zero-based columns.
   */
  loc: Readonly<YAMLAst.Position> | Readonly<YAMLAst.SourceLocation>
}

/**
 * Placeholder names mapped to values interpolated into a diagnostic message.
 */
export type ReportDescriptorMessageData = Readonly<Record<string, unknown>>

/**
 * Diagnostic attached to an AST node, optionally overriding its source
 * location.
 */
export type ReportDescriptorNodeOptionalLoc = {
  /**
   * YAML node associated with the diagnostic and used for its default location.
   */
  readonly node: YAMLAst.YAMLNode
  /**
   * Explicit position or span overriding the node's location.
   */
  readonly loc?: Readonly<YAMLAst.Position> | Readonly<YAMLAst.SourceLocation>
}

/**
 * Suggested fix described by a rule message ID or a literal description.
 *
 * @template TMessageIds - Message IDs declared in the rule's metadata.
 */
export type SuggestionReportDescriptor<TMessageIds extends string> =
  Rule.SuggestionReportOptions &
    (
      | {
          /**
           * Key of the suggestion's message template in the rule's metadata.
           */
          readonly messageId: TMessageIds
        }
      | {
          /**
           * Literal suggestion text used instead of a message template.
           */
          readonly desc: string
        }
    )

/**
 * Diagnostic supporting suggested edits that users can apply individually.
 *
 * @template TMessageIds - Message IDs available to diagnostics and suggestions.
 */
export interface ReportDescriptorWithSuggestion<
  TMessageIds extends string,
> extends ReportDescriptorBase<TMessageIds> {
  /**
   * Suggested fixes presented separately from automatic fixes.
   */
  readonly suggest?: readonly SuggestionReportDescriptor<TMessageIds>[]
}

/**
 * ESLint rule context specialized for YAML syntax and typed rule options.
 *
 * @template TMessageIds - Message IDs accepted by the report method.
 * @template TOptions - Tuple of options supplied to the rule.
 */
export interface RuleContext<
  TMessageIds extends string,
  TOptions extends readonly unknown[] = [],
> {
  /**
   * Working directory used by the current ESLint run.
   */
  cwd: string
  /**
   * Filename being linted, including a virtual filename when using a processor.
   */
  filename: string
  /**
   * Configured rule identifier, including its plugin namespace when applicable.
   */
  id: string
  /**
   * Effective language and parser options supplied by ESLint.
   */
  languageOptions: any
  /**
   * Configured rule options without the severity entry.
   */
  options: TOptions
  /**
   * Filename of the physical source file before processor-generated virtual
   * files.
   */
  physicalFilename: string
  /**
   * Parsed YAML source with text, token, comment, and location utilities.
   */
  sourceCode: SourceCode
  /**
   * Reports a diagnostic and its optional fixes to ESLint.
   *
   * @param descriptor - Message, location, interpolation data, and optional
   * fixes.
   */
  report(descriptor: ReportDescriptor<TMessageIds>): void
  /**
   * Shared configuration settings available to rules.
   */
  settings: {
    /**
     * YAML-specific settings shared with compatible rules.
     */
    yml?: YMLSettings
    /**
     * Additional settings keyed by their configured namespace or name.
     */
    [name: string]: any
  }
  /**
   * Optional parser integration data; modern ESLint exposes it on sourceCode.
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
}

/**
 * Rule factory accepting both the ESLint context and options merged with
 * defaults.
 *
 * @template TOptions - Tuple of supported rule options.
 * @template TMessageIds - Message IDs declared by the rule.
 */
export interface RuleCreateAndOptions<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
> {
  /**
   * Creates listeners for a single linted file.
   *
   * @param context - YAML-aware context provided for the rule invocation.
   * @param optionsWithDefault - Options merged with the rule's default options.
   * @returns Visitors invoked while ESLint traverses the YAML syntax tree.
   */
  create: (
    context: Readonly<RuleContext<TMessageIds, TOptions>>,
    optionsWithDefault: Readonly<TOptions>,
  ) => RuleListener
}

/**
 * YAML node visitors and selector-based listeners registered with ESLint.
 */
export interface RuleListener {
  /**
   * Visits a YAML file root before visiting its children.
   *
   * @param node - The YAML file root whose entry triggered the listener.
   */
  Program?: (node: YAMLAst.YAMLProgram) => void
  /**
   * Visits a YAML file root after visiting its children.
   *
   * @param node - The YAML file root whose exit triggered the listener.
   */
  'Program:exit'?: (node: YAMLAst.YAMLProgram) => void
  /**
   * Visits an alias referencing an anchor before visiting its children.
   *
   * @param node - The alias referencing an anchor whose entry triggered the
   * listener.
   */
  YAMLAlias?: (node: YAMLAst.YAMLAlias) => void
  /**
   * Visits an alias referencing an anchor after visiting its children.
   *
   * @param node - The alias referencing an anchor whose exit triggered the
   * listener.
   */
  'YAMLAlias:exit'?: (node: YAMLAst.YAMLAlias) => void
  /**
   * Visits an anchor declaration before visiting its children.
   *
   * @param node - The anchor declaration whose entry triggered the listener.
   */
  YAMLAnchor?: (node: YAMLAst.YAMLAnchor) => void
  /**
   * Visits an anchor declaration after visiting its children.
   *
   * @param node - The anchor declaration whose exit triggered the listener.
   */
  'YAMLAnchor:exit'?: (node: YAMLAst.YAMLAnchor) => void
  /**
   * Visits a document directive before visiting its children.
   *
   * @param node - The document directive whose entry triggered the listener.
   */
  YAMLDirective?: (node: YAMLAst.YAMLDirective) => void
  /**
   * Visits a document directive after visiting its children.
   *
   * @param node - The document directive whose exit triggered the listener.
   */
  'YAMLDirective:exit'?: (node: YAMLAst.YAMLDirective) => void
  /**
   * Visits a YAML document before visiting its children.
   *
   * @param node - The YAML document whose entry triggered the listener.
   */
  YAMLDocument?: (node: YAMLAst.YAMLDocument) => void
  /**
   * Visits a YAML document after visiting its children.
   *
   * @param node - The YAML document whose exit triggered the listener.
   */
  'YAMLDocument:exit'?: (node: YAMLAst.YAMLDocument) => void
  /**
   * Visits a mapping collection before visiting its children.
   *
   * @param node - The mapping collection whose entry triggered the listener.
   */
  YAMLMapping?: (node: YAMLAst.YAMLMapping) => void
  /**
   * Visits a mapping collection after visiting its children.
   *
   * @param node - The mapping collection whose exit triggered the listener.
   */
  'YAMLMapping:exit'?: (node: YAMLAst.YAMLMapping) => void
  /**
   * Visits a mapping key-value pair before visiting its children.
   *
   * @param node - The mapping key-value pair whose entry triggered the
   * listener.
   */
  YAMLPair?: (node: YAMLAst.YAMLPair) => void
  /**
   * Visits a mapping key-value pair after visiting its children.
   *
   * @param node - The mapping key-value pair whose exit triggered the listener.
   */
  'YAMLPair:exit'?: (node: YAMLAst.YAMLPair) => void
  /**
   * Visits a scalar value before visiting its children.
   *
   * @param node - The scalar value whose entry triggered the listener.
   */
  YAMLScalar?: (node: YAMLAst.YAMLScalar) => void
  /**
   * Visits a scalar value after visiting its children.
   *
   * @param node - The scalar value whose exit triggered the listener.
   */
  'YAMLScalar:exit'?: (node: YAMLAst.YAMLScalar) => void
  /**
   * Visits a sequence collection before visiting its children.
   *
   * @param node - The sequence collection whose entry triggered the listener.
   */
  YAMLSequence?: (node: YAMLAst.YAMLSequence) => void
  /**
   * Visits a sequence collection after visiting its children.
   *
   * @param node - The sequence collection whose exit triggered the listener.
   */
  'YAMLSequence:exit'?: (node: YAMLAst.YAMLSequence) => void
  /**
   * Visits an explicit YAML tag before visiting its children.
   *
   * @param node - The explicit YAML tag whose entry triggered the listener.
   */
  YAMLTag?: (node: YAMLAst.YAMLTag) => void
  /**
   * Visits an explicit YAML tag after visiting its children.
   *
   * @param node - The explicit YAML tag whose exit triggered the listener.
   */
  'YAMLTag:exit'?: (node: YAMLAst.YAMLTag) => void
  /**
   * Visits a value wrapped with an anchor or tag before visiting its children.
   *
   * @param node - The value wrapped with an anchor or tag whose entry triggered
   * the listener.
   */
  YAMLWithMeta?: (node: YAMLAst.YAMLWithMeta) => void
  /**
   * Visits a value wrapped with an anchor or tag after visiting its children.
   *
   * @param node - The value wrapped with an anchor or tag whose exit triggered
   * the listener.
   */
  'YAMLWithMeta:exit'?: (node: YAMLAst.YAMLWithMeta) => void
  /**
   * Additional listeners keyed by an ESLint selector or selector exit event.
   * The parameter type must be supplied by each selector-specific listener.
   *
   * @param node - Syntax node matched by the registered selector.
   */
  [key: string]: ((node: never) => void) | undefined
}

/**
 * Rule capabilities, option schema, message templates, and documentation.
 *
 * @template TMessageIds - Keys of the rule's diagnostic message templates.
 * @template TDocs - Additional plugin-specific documentation fields.
 * @template TOptions - Tuple of supported rule options.
 */
export interface RuleMetaData<
  TMessageIds extends string,
  TDocs = unknown,
  TOptions extends readonly unknown[] = [],
> {
  /**
   * Diagnostic and suggestion templates indexed by message ID.
   */
  messages: Record<TMessageIds, string>
  /**
   * JSON Schema validating the rule's options, excluding severity.
   */
  schema: JSONSchema4 | readonly JSONSchema4[]
  /**
   * Whether the rule reports layout issues, possible problems, or suggestions.
   */
  type: 'layout' | 'problem' | 'suggestion'
  /**
   * Fallback options merged with configured options when creating the rule.
   */
  defaultOptions?: TOptions
  /**
   * Whether the rule is deprecated and should be replaced or disabled.
   */
  deprecated?: boolean
  /**
   * Standard and plugin-specific information describing the rule.
   */
  docs?: RuleMetaDataDocs & TDocs
  /**
   * Kind of automatic edits the rule can produce; required for autofixing
   * rules.
   */
  fixable?: 'code' | 'whitespace'
  /**
   * Whether the rule can report suggestions; required when suggestions are
   * emitted.
   */
  hasSuggestions?: boolean
  /**
   * Replacement rule identifiers for a deprecated rule.
   */
  replacedBy?: readonly string[]
}

/**
 * Documentation fields describing a rule and how it is presented to users.
 */
export interface RuleMetaDataDocs {
  /**
   * Short explanation of the behavior enforced by the rule.
   */
  description: string
  /**
   * Documentation category used to group related rules.
   */
  category?: string
  /**
   * Whether the rule is marked as recommended by the plugin.
   */
  recommended?: boolean
  /**
   * URL of the rule's documentation page.
   */
  url?: string
}

/**
 * ESLint rule module specialized for YAML nodes, messages, and options.
 *
 * @template TMessageIds - Message IDs declared by the rule.
 * @template TOptions - Tuple of supported rule options.
 * @template TDocs - Additional plugin-specific documentation fields.
 */
export interface RuleModule<
  TMessageIds extends string,
  TOptions extends readonly unknown[] = [],
  TDocs = unknown,
> {
  /**
   * Metadata describing the rule's messages, options, documentation, and fixes.
   */
  meta: RuleMetaData<TMessageIds, TDocs, TOptions>
  /**
   * Creates the YAML listeners used to lint a single file.
   *
   * @param context - YAML-aware context supplied by ESLint.
   * @returns Visitors for YAML nodes and selectors.
   */
  create(context: RuleContext<TMessageIds, TOptions>): RuleListener
}

/**
 * Rule definition combining metadata with a factory receiving resolved options.
 *
 * @template TOptions - Tuple of supported rule options.
 * @template TMessageIds - Message IDs declared by the rule.
 * @template TDocs - Additional plugin-specific documentation fields.
 */
export interface RuleWithMeta<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
  TDocs = unknown,
> extends RuleCreateAndOptions<TOptions, TMessageIds> {
  /**
   * Metadata forwarded to the generated ESLint rule module.
   */
  meta: RuleMetaData<TMessageIds, TDocs, TOptions>
}

/**
 * Named rule definition used to generate documentation URLs and an ESLint
 * module.
 *
 * @template TOptions - Tuple of supported rule options.
 * @template TMessageIds - Message IDs declared by the rule.
 * @template TDocs - Additional plugin-specific documentation fields.
 */
export interface RuleWithMetaAndName<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
  TDocs = unknown,
> extends RuleCreateAndOptions<TOptions, TMessageIds> {
  /**
   * Rule metadata with required documentation for the URL-generating factory.
   */
  meta: NamedCreateRuleMeta<TMessageIds, TDocs, TOptions>
  /**
   * Rule name without the plugin namespace, used in its documentation URL.
   */
  name: string
}

/**
 * YAML formatting preferences shared through ESLint's settings.yml namespace.
 */
type YMLSettings = {
  /**
   * Preferred indentation width in spaces for compatible YAML formatting rules.
   */
  indent?: number
}
