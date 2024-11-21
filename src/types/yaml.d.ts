/**
 * @file Types from 'yaml-eslint-parser'
 */

import type { AST } from 'yaml-eslint-parser'

export type YAMLToken = AST.Token
export type YAMLComment = AST.Comment
export type YAMLNode = AST.YAMLNode
export type YAMLDocument = AST.YAMLDocument
export type YAMLProgram = AST.YAMLProgram

export type { AST as YAMLAst } from 'yaml-eslint-parser'
