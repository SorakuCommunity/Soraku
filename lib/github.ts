/**
 * lib/github.ts — GitHub Discussions API with Redis cache (10 min TTL)
 */
import { cacheGet, cacheSet } from './redis'

const GITHUB_API = 'https://api.github.com'
const CACHE_TTL = 600 // 10 minutes

export async function getGitHubDiscussions(
  owner: string,
  repo: string,
  limit = 10
): Promise<unknown[]> {
  const cacheKey = `github:discussions:${owner}/${repo}`
  const cached = await cacheGet<unknown[]>(cacheKey)
  if (cached) return cached

  const query = `
    query($owner: String!, $repo: String!, $first: Int!) {
      repository(owner: $owner, name: $repo) {
        discussions(first: $first, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            id title url createdAt author { login avatarUrl }
            category { name emoji }
            upvoteCount comments { totalCount }
          }
        }
      }
    }
  `

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ''}`,
    },
    body: JSON.stringify({ query, variables: { owner, repo, first: limit } }),
  })

  if (!res.ok) return []
  const data = await res.json()
  const nodes = data?.data?.repository?.discussions?.nodes ?? []
  await cacheSet(cacheKey, nodes, CACHE_TTL)
  return nodes
}

export async function fetchDiscussionByNumber(
  numberOrOwner: number | string,
  repo?: string,
  number?: number
): Promise<unknown | null> {
  // Support both: fetchDiscussionByNumber(num) and fetchDiscussionByNumber(owner, repo, num)
  let owner: string
  let repoName: string
  let discussionNumber: number

  if (typeof numberOrOwner === 'number') {
    // Called as fetchDiscussionByNumber(number) — use env defaults
    owner = process.env.GITHUB_OWNER ?? 'SorakuCommunity'
    repoName = process.env.GITHUB_REPO ?? 'Soraku'
    discussionNumber = numberOrOwner
  } else {
    owner = numberOrOwner
    repoName = repo!
    discussionNumber = number!
  }

  const cacheKey = `github:discussion:${owner}/${repoName}:${discussionNumber}`
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  const query = `
    query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        discussion(number: $number) {
          id number title url createdAt bodyHTML
          author { login avatarUrl }
          category { name emoji }
          upvoteCount
          comments(first: 20) {
            nodes {
              id bodyHTML createdAt
              author { login avatarUrl }
            }
          }
        }
      }
    }
  `

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ''}`,
    },
    body: JSON.stringify({ query, variables: { owner, repo: repoName, number: discussionNumber } }),
  })

  if (!res.ok) return null
  const data = await res.json()
  const discussion = data?.data?.repository?.discussion ?? null
  if (discussion) await cacheSet(cacheKey, discussion, CACHE_TTL)
  return discussion
}
