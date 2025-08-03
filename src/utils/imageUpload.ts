import { supabase } from '../lib/supabase'

export interface UploadResult {
  url?: string
  error?: string
  success: boolean
}

/**
 * Upload property image to Supabase Storage
 */
export const uploadPropertyImage = async (
  propertyId: string,
  file: File,
  roomType: string,
  isPrimary: boolean = false
): Promise<UploadResult> => {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      return { error: 'File must be an image', success: false }
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return { error: 'File size must be less than 5MB', success: false }
    }

    // Generate file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${roomType}${isPrimary ? '-primary' : ''}.${fileExt}`
    const filePath = `properties/${propertyId}/${fileName}`

    console.log(`📤 Uploading image: ${filePath}`)

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Replace if exists
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { error: uploadError.message, success: false }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath)

    console.log(`✅ Image uploaded successfully: ${publicUrl}`)

    // Insert into property_images table
    const { error: dbError } = await supabase
      .from('property_images')
      .insert({
        property_id: propertyId,
        url: publicUrl,
        room_type: roomType,
        is_primary: isPrimary,
        alt_text: `${roomType} of property`,
        caption: `Beautiful ${roomType} view`,
        display_order: isPrimary ? 1 : 2
      })

    if (dbError) {
      console.error('Database insert error:', dbError)
      return { error: dbError.message, success: false }
    }

    return { url: publicUrl, success: true }
  } catch (error) {
    console.error('Upload error:', error)
    return { 
      error: error instanceof Error ? error.message : 'Unknown error', 
      success: false 
    }
  }
}

/**
 * Get optimized image URL with transformations
 */
export const getOptimizedImageUrl = (
  originalUrl: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
  } = {}
): string => {
  const { width = 800, height, quality = 80, format = 'webp' } = options
  
  try {
    const url = new URL(originalUrl)
    
    // Add Supabase image transformation parameters
    if (width) url.searchParams.set('width', width.toString())
    if (height) url.searchParams.set('height', height.toString())
    url.searchParams.set('quality', quality.toString())
    url.searchParams.set('format', format)
    
    return url.toString()
  } catch (error) {
    console.error('Error optimizing image URL:', error)
    return originalUrl // Return original if transformation fails
  }
}

/**
 * Delete image from storage and database
 */
export const deletePropertyImage = async (
  propertyId: string,
  imageUrl: string
): Promise<UploadResult> => {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl)
    const filePath = url.pathname.split('/').slice(-2).join('/') // Get last 2 parts

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('property-images')
      .remove([filePath])

    if (storageError) {
      return { error: storageError.message, success: false }
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('property_images')
      .delete()
      .eq('property_id', propertyId)
      .eq('url', imageUrl)

    if (dbError) {
      return { error: dbError.message, success: false }
    }

    return { success: true }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Unknown error', 
      success: false 
    }
  }
}

/**
 * List all images for a property
 */
export const getPropertyImages = async (propertyId: string) => {
  try {
    const { data, error } = await supabase
      .from('property_images')
      .select('*')
      .eq('property_id', propertyId)
      .order('display_order', { ascending: true })

    if (error) {
      throw error
    }

    return { data, success: true }
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'Unknown error', 
      success: false 
    }
  }
} 