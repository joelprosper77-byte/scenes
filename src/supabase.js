import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://icpdlibwkhjfuwxphtfc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcGRsaWJ3a2hqZnV3eHBodGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MzY3NzQsImV4cCI6MjA5NDExMjc3NH0.hb3fg6C73H_Yuy8LMteNHWE7AZyFs2diLDrvPlIjfso'

export const supabase = createClient(supabaseUrl, supabaseKey)