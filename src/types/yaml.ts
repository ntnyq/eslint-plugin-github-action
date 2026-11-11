/**
 * @file Types from 'yaml-eslint-parser'
 */

import type { AST } from 'yaml-eslint-parser'

/**
 * YAML comment with its text, source location, and character range.
 */
export type YAMLComment = AST.Comment
/**
 * Single YAML document containing directives, anchors, and optional content.
 */
export type YAMLDocument = AST.YAMLDocument
/**
 * Union of syntax tree nodes produced by yaml-eslint-parser.
 */
export type YAMLNode = AST.YAMLNode
/**
 * Root syntax node containing the YAML documents, comments, and tokens in a
 * file.
 */
export type YAMLProgram = AST.YAMLProgram
/**
 * YAML lexical token, excluding comments.
 */
export type YAMLToken = AST.Token

/**
 * Complete parser AST type namespace for YAML nodes, tokens, and source
 * locations.
 */
export type { AST as YAMLAst }
