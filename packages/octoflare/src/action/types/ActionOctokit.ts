import github from '@actions/github'

export type ActionOctokit = ReturnType<typeof github.getOctokit>
