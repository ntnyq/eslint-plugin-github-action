import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-invalid-key'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'top-level-keys.yml',
      code: $`
        name: CI
        
        run-name: CI
        
        on: push
        
        permissions:
          contents: read
          pull-requests: write
        
        env:
          SERVER: production
        
        defaults:
          run:
            shell: bash
        
        concurrency:
          group: example
          cancel-in-progress: true
        
        jobs:
          test:
            name: Test
            runs-on: ubuntu-latest
            steps:
              - name: Checkout
                uses: actions/checkout@v4
              - name: Run tests
                run: npm test
      `,
    },
    {
      filename: 'job-keys.yml',
      code: $`
        name: CI
        
        jobs:
          test:
            name: Unit Test
        
            permissions:
              contents: read
        
            needs: [lint]
        
            if: github.repository == 'ntnyq/eslint-plugin-github-action'
        
            runs-on: ubuntu-latest
        
            environment:
              name: Test
        
            concurrency:
              group: test
              cancel-in-progress: true
        
            outputs:
              test: true
        
            env:
              SERVER: production
        
            defaults:
              run:
                shell: bash
        
            steps:
              - run: npm run test
      `,
    },
    {
      filename: 'step-keys.yml',
      code: $`
        name: CI
        
        jobs:
          test:
            steps:
              - id: test
                if: github.repository == 'ntnyq/eslint-plugin-github-action'
                name: Checkout
                uses: actions/checkout@v4
                run: npm run test
                working-directory: ./src
                shell: bash
                with:
                  fetch-depth: 1
                env:
                  SERVER: production
                continue-on-error: true
                timeout-minutes: 10
      `,
    },
    {
      filename: 'strategy-keys.yml',
      code: $`
        name: CI
        
        jobs:
          test:
            strategy:
              fail-fast: true
              matrix:
                node-version: [14.x, 16.x]
                os: [ubuntu-latest, windows-latest, macos-latest]
              max-parallel: 3
      `,
    },
    {
      filename: 'container-keys.yml',
      code: $`
        name: CI
        
        jobs:
          test:
            container:
              image: ghcr.io/owner/image
              credentials:
                name: ntnyq
              env:
                SERVER: production
              ports:
                - 8080:8080
              volumes:
                - /var/run/docker.sock:/var/run/docker.sock
              options: --privileged
      `,
    },
    {
      filename: 'service-keys.yml',
      code: $`
        name: CI
        
        jobs:
          serve:
            services:
              nginx:
                image: ghcr.io/owner/image
                credentials:
                  name: ntnyq
                env:
                  SERVER: production
                ports:
                  - 8080:8080
                volumes:
                  - /var/run/docker.sock:/var/run/docker.sock
                options: --privileged
      `,
    },
  ],
  invalid: [
    {
      filename: 'top-level-keys.yml',
      code: $`
        workflow: CI
        
        dispatch: inputs
        
        push: branch
        
        test:
          contents: read
        
        check:
          SERVER: production
        
        matrix: [20.x, 22.x]
      `,
      errors(errors) {
        expect(errors).toMatchSnapshot()
      },
    },
    {
      filename: 'job-keys.yml',
      code: $`
        name: CI
        
        jobs:
          test:
            workflow: CI
        
            dispatch: inputs
        
            push: branch
        
            test:
              contents: read
        
            check:
              SERVER: production
        
            matrix: [20.x, 22.x]
      `,
      errors(errors) {
        expect(errors).toMatchSnapshot()
      },
    },
    {
      filename: 'step-keys.yml',
      code: $`
        name: CI
        
        jobs:
          test:
            steps:
              - workflow: CI
        
                dispatch: inputs
        
                push: branch
        
                test:
                  contents: read
        
                check:
                  SERVER: production
        
                matrix: [20.x, 22.x]
      `,
      errors(errors) {
        expect(errors).toMatchSnapshot()
      },
    },
    {
      filename: 'strategy-keys.yml',
      code: $`
        name: CI
        
        jobs:
          test:
            strategy:
              workflow: CI
        
              dispatch: inputs
        
              push: branch
        
              test:
                contents: read
        
              check:
                SERVER: production
      `,
      errors(errors) {
        expect(errors).toMatchSnapshot()
      },
    },
    {
      filename: 'container-keys.yml',
      code: $`
        name: CI
        
        jobs:
          test:
            container:
              workflow: CI
        
              dispatch: inputs
        
              push: branch
        
              test:
                contents: read
        
              check:
                SERVER: production
      `,
      errors(errors) {
        expect(errors).toMatchSnapshot()
      },
    },
    {
      filename: 'service-keys.yml',
      code: $`
        name: CI
        
        jobs:
          serve:
            services:
              nginx:
                workflow: CI
        
                dispatch: inputs
        
                push: branch
        
                test:
                  contents: read
        
                check:
                  SERVER: production
      `,
      errors(errors) {
        expect(errors).toMatchSnapshot()
      },
    },
  ],
})
