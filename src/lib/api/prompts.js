const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

// ==========================================
// USER & CREATOR PROMPT ROUTES
// ==========================================

export const getPrompts = async () => {
  const res = await fetch(`${baseURl}/user/prompts`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return await res.json();
};

export const getMyPrompts = async (email) => {
  const res = await fetch(`${baseURl}/user/prompts?email=${email}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store", 
  });
  return await res.json();
};

export const getCreatorPrompts = async (email) => {
  if (!email) return { data: [], totalData: 0 };
  const res = await fetch(`${baseURl}/api/creator/prompts?email=${email}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store", 
  });
  return await res.json();
};

// ==========================================
//  PUBLIC & SINGLE PROMPT ROUTES
// ==========================================

export const fetchPublicPrompts = async ({
  search = "",
  category = "",
  aiTool = "",
  difficulty = "",
  sort = "latest",
  page = 1,
  limit = 9,
} = {}) => {
  const params = new URLSearchParams({ search, category, aiTool, difficulty, sort, page, limit });
  const res = await fetch(`${baseURl}/prompts/public?${params}`);
  return await res.json();
};

export const getPromptById = async (id) => {
  if (!id) return null;
  const cleanId = typeof id === "object" ? (id?.$oid || id?.toString()) : id;
  const res = await fetch(`${baseURl}/prompts/${cleanId}`);
  if (!res.ok) return null;
  return await res.json();
};

// ==========================================
// REVIEWS & BOOKMARKS ROUTES
// ==========================================

export const getPromptReviews = async (promptId) => {
  const res = await fetch(`${baseURl}/reviews/${promptId}`);
  return await res.json();
};

export const checkBookmarkStatus = async (email, promptId) => {
  if (!email) return { bookmarked: false };
  const res = await fetch(`${baseURl}/bookmarks/status?email=${email}&promptId=${promptId}`);
  return await res.json();
};

export const getUserBookmarks = async (email) => {
  if (!email) return { data: [] };
  const res = await fetch(`${baseURl}/bookmarks?email=${email}`);
  return await res.json();
};

export const getUserReviews = async (email) => {
  if (!email) return { data: [] };
  const res = await fetch(`${baseURl}/reviews?email=${email}`);
  return await res.json();
};


export const getAllPublicReviews = async () => {
  try {
    const res = await fetch(`${baseURl}/reviews`, { cache: "no-store" });
    if (!res.ok) return [];
    const result = await res.json();
    return result?.data || []; 
  } catch (error) {
    console.error("Error fetching public reviews:", error);
    return [];
  }
};

// ==========================================
//  ANALYTICS ROUTES
// ==========================================

export const getCreatorAnalytics = async (email, token) => {
  if (!email) return null;
  const res = await fetch(`${baseURl}/api/creator/analytics?email=${email}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    cache: "no-store",
  });
  return await res.json();
};

// ==========================================
//  LANDING PAGE FEATURED PRODUCTS
// ==========================================

export const getFeaturedPrompts = async () => {
  try {
    const res = await fetch(`${baseURl}/prompts/public?limit=6`, { cache: "no-store" });
    if (!res.ok) return []; 
    const result = await res.json();
    return result?.data || []; 
  } catch (error) {
    console.error("Error inside getFeaturedPrompts:", error);
    return [];
  }
};

export const getTopCreators = async () => {
  try {
    const res = await fetch(`${baseURl}/api/creators/top`, { 
      cache: "no-store" 
    });
    
    if (!res.ok) {
      console.error("Top Creators API response error:", res.status);
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error("Fetch failed inside getTopCreators:", error);
    return [];
  }
};