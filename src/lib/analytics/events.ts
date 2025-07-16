import { 
  GA_EVENTS, 
  type ProjectEventParams, 
  type SearchEventParams, 
  type UserEventParams, 
  type ContentEventParams 
} from './constants';

// Base analytics tracking function
function trackEvent(eventName: string, parameters?: Record<string, string | number | boolean | string[] | undefined>) {
  // Only track in production with valid GA ID
  if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    console.log(`[Analytics Debug] ${eventName}:`, parameters);
    return;
  }
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}

// Project-related events
export const projectEvents = {
  view: (params: ProjectEventParams) => {
    trackEvent(GA_EVENTS.PROJECT_VIEW, {
      project_id: params.project_id,
      project_title: params.project_title,
      project_author: params.project_author,
      custom_project_tags: params.project_tags?.join(','),
    });
  },
  
  like: (params: ProjectEventParams) => {
    trackEvent(GA_EVENTS.PROJECT_LIKE, {
      project_id: params.project_id,
      project_title: params.project_title,
    });
  },
  
  share: (params: ProjectEventParams) => {
    trackEvent(GA_EVENTS.PROJECT_SHARE, {
      project_id: params.project_id,
      project_title: params.project_title,
    });
  },
  
  comment: (params: ProjectEventParams) => {
    trackEvent(GA_EVENTS.PROJECT_COMMENT, {
      project_id: params.project_id,
      project_title: params.project_title,
    });
  },
  
  uploadStart: () => {
    trackEvent(GA_EVENTS.PROJECT_UPLOAD_START);
  },
  
  uploadComplete: (params: ProjectEventParams) => {
    trackEvent(GA_EVENTS.PROJECT_UPLOAD_COMPLETE, {
      project_id: params.project_id,
      project_title: params.project_title,
      custom_project_tags: params.project_tags?.join(','),
    });
  },
  
  edit: (params: ProjectEventParams) => {
    trackEvent(GA_EVENTS.PROJECT_EDIT, {
      project_id: params.project_id,
      project_title: params.project_title,
    });
  },
};

// Search and discovery events
export const searchEvents = {
  search: (params: SearchEventParams) => {
    trackEvent(GA_EVENTS.SEARCH_PROJECTS, {
      search_term: params.search_query,
      results_count: params.results_count,
    });
  },
  
  filter: (params: SearchEventParams) => {
    trackEvent(GA_EVENTS.FILTER_PROJECTS, {
      filter_type: params.filter_type,
      filter_value: params.filter_value,
      results_count: params.results_count,
    });
  },
  
  tagClick: (tagName: string) => {
    trackEvent(GA_EVENTS.TAG_CLICK, {
      tag_name: tagName,
    });
  },
};

// User authentication events
export const userEvents = {
  signup: (params: UserEventParams) => {
    trackEvent(GA_EVENTS.USER_SIGNUP, {
      signup_method: params.signup_method,
    });
  },
  
  signin: (params: UserEventParams) => {
    trackEvent(GA_EVENTS.USER_SIGNIN, {
      signin_method: params.signup_method,
    });
  },
  
  profileView: (params: UserEventParams) => {
    trackEvent(GA_EVENTS.USER_PROFILE_VIEW, {
      viewed_user_id: params.user_id,
      viewed_username: params.username,
    });
  },
  
  follow: (params: UserEventParams) => {
    trackEvent(GA_EVENTS.USER_FOLLOW, {
      followed_user_id: params.user_id,
      followed_username: params.username,
    });
  },
};

// Navigation events
export const navigationEvents = {
  homePage: () => {
    trackEvent(GA_EVENTS.HOME_PAGE_VIEW, {
      page_location: window.location.href,
    });
  },
  
  projectsPage: () => {
    trackEvent(GA_EVENTS.PROJECTS_PAGE_VIEW, {
      page_location: window.location.href,
    });
  },
  
  profilePage: (username: string) => {
    trackEvent(GA_EVENTS.PROFILE_PAGE_VIEW, {
      page_location: window.location.href,
      profile_username: username,
    });
  },
};

// Content interaction events
export const contentEvents = {
  externalLinkClick: (params: ContentEventParams) => {
    trackEvent(GA_EVENTS.EXTERNAL_LINK_CLICK, {
      link_url: params.link_url,
      content_type: params.content_type,
      content_id: params.content_id,
    });
  },
  
  imageCarouselNavigate: (params: ContentEventParams) => {
    trackEvent(GA_EVENTS.IMAGE_CAROUSEL_NAVIGATE, {
      project_id: params.content_id,
      image_index: params.image_index,
    });
  },
  
  techStackClick: (params: ContentEventParams) => {
    trackEvent(GA_EVENTS.TECH_STACK_CLICK, {
      tech_name: params.tech_name,
      project_id: params.content_id,
    });
  },
  
  projectBookmark: (params: ProjectEventParams) => {
    trackEvent(GA_EVENTS.PROJECT_BOOKMARK, {
      project_id: params.project_id,
      project_title: params.project_title,
    });
  },
};