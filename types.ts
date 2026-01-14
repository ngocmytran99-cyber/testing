
import React from 'react';

// Added ViewType to provide shared type for navigation targets across the app
export type ViewType = string;

export interface Creator {
  name: string;
  role: string;
  description: string;
  image: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export type ContentStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  authorId: string;
  content: string;
  status: ContentStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  categoryIds: string[];
  tags: string[];
  coverImage: string;
  seoScore?: number;
  seo: SEOData;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string; // For hierarchy
}

export type MediaType = 'image' | 'video' | 'document' | 'other';

export interface MediaAttachment {
  id: string;
  fileName: string;
  fileType: MediaType;
  mimeType: string;
  fileSize: number; // in bytes
  url: string;
  title: string;
  altText?: string;
  caption?: string;
  description?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface ContentBlock {
  id: string; // The stable content key (e.g., 'hero-title')
  type: 'text' | 'image' | 'icon-text' | 'video' | 'richtext' | 'link' | 'pricing-plan' | 'faq-item';
  value: string;
  label: string;
  metadata?: {
    group?: string; // e.g., 'Hero Section', 'Benefits'
    selector?: string; // css class to target for visual highlight
    locked?: boolean;
    alt?: string;
    icon?: string; // String identifier for lucide-react icon
    editable?: boolean;
    highlighted?: boolean;
    type?: string;
    link?: string; // Link URL for buttons/CTAs
  };
}

export interface PageData {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'private';
  updatedAt: string;
  blocks: ContentBlock[];
}

// Strictly CMS Roles
export type UserRole = 'administrator' | 'editor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  lastLogin?: string;
}

// Global CMS Settings
export interface GlobalSettings {
  // General
  siteTitle: string;
  tagline: string;
  siteIcon: string;
  headerLogo: string;
  footerLogo: string;
  siteUrl: string;
  adminEmail: string;
  defaultRole: string;
  language: string;
  timezone: string;
  // Writing
  defaultCategory: string;
  defaultFormat: string;
  defaultEditor: 'classic' | 'block';
  allowEditorSwitch: boolean;
  mailServer: string;
  mailPort: number;
  mailLogin: string;
  mailPassword?: string;
  updateServices: string;
  // Reading
  homepageDisplay: 'posts' | 'static';
  pageOnFront: string;
  pageForPosts: string;
  postsPerPage: number;
  postsInFeed: number;
  feedFullText: boolean;
  searchEngineVisibility: boolean;
  // Discussion
  allowComments: boolean;
  requireNameEmail: boolean;
  requireLogin: boolean;
  moderationKeys: string;
  // Media
  thumbWidth: number;
  thumbHeight: number;
  organizeUploads: boolean;
  // Permalinks
  permalinkStructure: string;
  // Privacy
  privacyPageId: string;
}

// Help Center Specific Types (Frontend compatible)
export type AudienceType = 'creator' | 'backer';

export interface CategoryMetadata {
  id: string;
  label: string;
  description: string;
  icon: string;
  audience: AudienceType;
  order?: number; // Added for custom sorting
}

export interface SubcategoryMetadata {
  id: string;
  categoryId: string;
  label: string;
  description: string;
  icon: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  readingTime: number;
  audience: AudienceType;
  category: string;
  subcategory: string;
  icon: string;
  updatedAt: string;
  isCritical?: boolean;
  status?: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
}

// Strictly Namespaced Help Desk CMS types
export interface HelpDeskCategory extends CategoryMetadata {}
export interface HelpDeskTopic extends SubcategoryMetadata {}
export interface HelpDeskArticle extends Article {}
