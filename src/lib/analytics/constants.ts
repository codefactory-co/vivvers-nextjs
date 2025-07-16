// Google Analytics event names and parameters
export const GA_EVENTS = {
  // Project engagement
  PROJECT_VIEW: 'project_view',
  PROJECT_LIKE: 'project_like',
  PROJECT_SHARE: 'project_share',
  PROJECT_COMMENT: 'project_comment',
  
  // Project discovery
  SEARCH_PROJECTS: 'search_projects',
  FILTER_PROJECTS: 'filter_projects',
  TAG_CLICK: 'tag_click',
  
  // Project creation
  PROJECT_UPLOAD_START: 'project_upload_start',
  PROJECT_UPLOAD_COMPLETE: 'project_upload_complete',
  PROJECT_EDIT: 'project_edit',
  
  // Authentication
  USER_SIGNUP: 'user_signup',
  USER_SIGNIN: 'user_signin',
  USER_PROFILE_VIEW: 'user_profile_view',
  
  // Navigation
  HOME_PAGE_VIEW: 'home_page_view',
  PROJECTS_PAGE_VIEW: 'projects_page_view',
  PROFILE_PAGE_VIEW: 'profile_page_view',
  
  // Content interaction
  EXTERNAL_LINK_CLICK: 'external_link_click',
  IMAGE_CAROUSEL_NAVIGATE: 'image_carousel_navigate',
  TECH_STACK_CLICK: 'tech_stack_click',
  
  // Social features
  USER_FOLLOW: 'user_follow',
  PROJECT_BOOKMARK: 'project_bookmark',
} as const;

// Event parameter types
export interface ProjectEventParams {
  project_id: string;
  project_title?: string;
  project_author?: string;
  project_tags?: string[];
}

export interface SearchEventParams {
  search_query?: string;
  results_count?: number;
  filter_type?: string;
  filter_value?: string;
}

export interface UserEventParams {
  user_id?: string;
  username?: string;
  signup_method?: 'email' | 'google' | 'github';
}

export interface NavigationEventParams {
  page_path: string;
  page_title?: string;
  referrer?: string;
}

export interface ContentEventParams {
  content_type: string;
  content_id?: string;
  link_url?: string;
  image_index?: number;
  tech_name?: string;
}