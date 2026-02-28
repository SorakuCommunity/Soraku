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
