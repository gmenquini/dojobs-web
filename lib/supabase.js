import { createClient } from '@supabase/supabase-js'

const SUPA_URL = 'https://arztpaqushvbkxpcoefo.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyenRwYXF1c2h2Ymt4cGNvZWZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTg5MTYsImV4cCI6MjA4OTI3NDkxNn0.dMrAUU8j8VJSVqw56UW137WKOt9mo1Oh6Q3ELdIQOto'

export const supabase = createClient(SUPA_URL, SUPA_KEY)

export function distKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2-lat1)*Math.PI/180
  const dLng = (lng2-lng1)*Math.PI/180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}
