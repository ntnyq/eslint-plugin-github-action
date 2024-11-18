import tseslint from 'typescript-eslint'
import pluginGitHubAction from 'eslint-plugin-github-action'

export default tseslint.config(
  // typescript-eslint recommended rules
  ...tseslint.configs.recommended,

  // Plugin rules
  ...pluginGitHubAction.configs.recommended,
)
