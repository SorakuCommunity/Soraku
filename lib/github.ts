import { cacheGet, cacheSet } from './redis'
import type { GithubDiscussion } from '@/types'

const GH_API = 'https://api.github.com/graphql'
const CACHE_TTL = 600 // 10 minutes

async function ghFetch(query: string): Promise<unknown> {
  const { GITHUB_TOKEN: token, GITHUB_REPO_OWNER: owner, GITHUB_REPO_NAME: repo } = process.env
  if (!token || !owner || !repo) return null

  const res = await fetch(GH_API, {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  if (!res.ok) return null
  return res.json()
}

export async function fetchDiscussions(): Promise<GithubDiscussion[]> {
  const { GITHUB_REPO_OWNER: owner, GITHUB_REPO_NAME: repo } = process.env
  if (!owner || !repo) return []

  const cacheKey = `gh:discussions:${owner}:${repo}`

  // Try Redis cache first
  const cached = await cacheGet<GithubDiscussion[]>(cacheKey)
  if (cached) return cached

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
    const data = await ghFetch(query) as { data?: { repository?: { discussions?: { nodes: GithubDiscussion[] } } } }
    const result = data?.data?.repository?.discussions?.nodes ?? []
    await cacheSet(cacheKey, result, CACHE_TTL)
    return result
  } catch {
    return []
  }
}

export async function fetchDiscussionByNumber(number: number): Promise<GithubDiscussion | null> {
  const { GITHUB_REPO_OWNER: owner, GITHUB_REPO_NAME: repo } = process.env
  if (!owner || !repo) return null

  const cacheKey = `gh:discussion:${owner}:${repo}:${number}`
  const cached = await cacheGet<GithubDiscussion>(cacheKey)
  if (cached) return cached

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
    const data = await ghFetch(query) as { data?: { repository?: { discussion: GithubDiscussion } } }
    const result = data?.data?.repository?.discussion ?? null
    if (result) await cacheSet(cacheKey, result, CACHE_TTL)
    return result
  } catch {
    return null
  }
}
