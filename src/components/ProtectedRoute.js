"use client"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function ProtectedRoute({ children }) {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.replace("/auth/login") 
    }
  }, [])

  return children
}
