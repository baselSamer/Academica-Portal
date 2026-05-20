import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import type { FavoriteItem } from '../types'

/**
 * useFavorites — reads favorites from Redux store and provides add/remove actions.
 * @param currentUserId - The authenticated user's username. Favorites are filtered by this ID.
 */
export default function useFavorites(currentUserId = '') {
  const dispatch = useDispatch()
  const favorites = useSelector((state: RootState) =>
    state.database.favorites.filter(f => f.userId === currentUserId)
  )

  const favoriteProjects = useMemo(
    () => favorites.filter(f => f.type === 'project'),
    [favorites]
  )

  const favoritePortfolios = useMemo(
    () => favorites.filter(f => f.type === 'portfolio'),
    [favorites]
  )

  const addFavorite = (item: { id: string; userId: string; type: 'project' | 'portfolio'; title: string; subtitle: string; tags: string[]; rating?: number }) => {
    dispatch({
      type: 'database/addFavorite',
      payload: { ...item },
    })
  }

  const removeFavorite = (id: string, userId: string) => {
    dispatch({ type: 'database/removeFavorite', payload: { id, userId } })
  }

  const isFavorite = (id: string) => favorites.some(f => f.id === id)

  const dummyRecommended: FavoriteItem[] = [
    { id: 'rec-1', userId: currentUserId, type: 'project', title: 'Smart Library System', subtitle: 'Databases • Khaled Youssef', tags: ['Java', 'MySQL', 'Spring Boot'], rating: 4.7, savedAt: '' },
    { id: 'rec-2', userId: currentUserId, type: 'project', title: 'Blockchain Voting App', subtitle: 'Distributed Systems • Layla Ahmed', tags: ['Solidity', 'React', 'Ethereum'], rating: 4.9, savedAt: '' },
    { id: 'rec-3', userId: currentUserId, type: 'project', title: 'Healthcare Dashboard', subtitle: 'Data Science • Mostafa Ali', tags: ['Python', 'D3.js', 'Flask'], rating: 4.4, savedAt: '' },
  ]

  return {
    favorites,
    favoriteProjects,
    favoritePortfolios,
    recommendedProjects: dummyRecommended,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
}
