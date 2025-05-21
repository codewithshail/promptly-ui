'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'

type Bookmark = {
  userId: string
  toolId: string
  createdAt: Date
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { userId, isSignedIn } = useAuth()
  
  useEffect(() => {
    if (isSignedIn && userId) {
      fetchBookmarks()
    } else {
      setBookmarks([])
      setIsLoading(false)
    }
  }, [isSignedIn, userId])
  
  const fetchBookmarks = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/bookmarks')
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks')
      }
      
      const data = await response.json()
      setBookmarks(data.map((item: any) => ({
        userId: item.userId,
        toolId: item.toolId,
        createdAt: new Date(item.createdAt)
      })))
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      toast.error("Failed to load bookmarks")
    } finally {
      setIsLoading(false)
    }
  }
  
  const addBookmark = async (toolId: string) => {
    if (!isSignedIn || !userId) {
        toast.error("Authentication required")
      return
    }
    
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolId }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add bookmark')
      }
      
      // Update local state
      setBookmarks(prev => [
        ...prev,
        {
          userId,
          toolId,
          createdAt: new Date()
        }
      ])
      
      return true
    } catch (error) {
      console.error('Error adding bookmark:', error)
      throw error
    }
  }
  
  const removeBookmark = async (toolId: string) => {
    if (!isSignedIn || !userId) {
        toast.error("Authentication required")
      return
    }
    
    try {
      const response = await fetch(`/api/bookmarks?toolId=${toolId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove bookmark')
      }
      
      // Update local state
      setBookmarks(prev => prev.filter(b => b.toolId !== toolId))
      
      return true
    } catch (error) {
      console.error('Error removing bookmark:', error)
      throw error
    }
  }
  
  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    refreshBookmarks: fetchBookmarks
  }
}