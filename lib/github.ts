import type { GithubDiscussion } from '@/types'

const GH_API = 'https://api.github.com/graphql'

function getGHHeaders() {
  return {
    Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  }
}

export async function fetchDiscussions(): Promise<GithubDiscussion[]> {
  const owner = process.env.GITHUB_REPO_OWNER
  const repo = process.env.GITHUB_REPO_NAME
  if (!process.env.GITHUB_TOKEN || !owner || !repo) return []

  const query = `query {
    repository(owner: "${owner}", name: "${repo}") {
      discussions(first: 20, orderBy: { field: CREATED_AT, direction: DESC }) {
        nodes {
          id number title body url upvoteCount createdAt
          author { login avatarUrl }
          category { name emoji }
          comments(first: 3) {
            totalCount
            nodes { id body upvoteCount createdAt author { login avatarUrl } }
          }
        }
      }
    }
  }`

  try {
    const res = await fetch(GH_API, {
      method: 'POST',
      headers: getGHHeaders(),
      body: JSON.stringify({ query }),
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data?.data?.repository?.discussions?.nodes ?? []) as GithubDiscussion[]
  } catch {
    return []
  }
}

export async function fetchDiscussionByNumber(
  number: number
): Promise<GithubDiscussion | null> {
  const owner = process.env.GITHUB_REPO_OWNER
  const repo = process.env.GITHUB_REPO_NAME
  if (!process.env.GITHUB_TOKEN || !owner || !repo) return null

  const query = `query {
    repository(owner: "${owner}", name: "${repo}") {
      discussion(number: ${number}) {
        id number title body url upvoteCount createdAt
        author { login avatarUrl }
        category { name emoji }
        comments(first: 50) {
          totalCount
          nodes { id body upvoteCount createdAt author { login avatarUrl } }
        }
      }
    }
  }`

  try {
    const res = await fetch(GH_API, {
      method: 'POST',
      headers: getGHHeaders(),
      body: JSON.stringify({ query }),
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return (data?.data?.repository?.discussion ?? null) as GithubDiscussion | null
  } catch {
    return null
  }
}
