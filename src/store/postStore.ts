import create from "zustand";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface PostsState {
  posts: { [key: number]: Post[] };
  fetchPageData: (page: number) => Promise<void>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const MAX_PAGES = 5;
const POSTS_PER_PAGE = 5;

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: {},
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  fetchPageData: async (page) => {
    if (!get().posts[page]) {
      const start = page - 2;
      const limit = POSTS_PER_PAGE * 5;
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${start}&_limit=${limit}`
      );
      const result = await response.json();

      const newPosts = { ...get().posts, [page]: result };

      for (let i = 0; i < limit; i += POSTS_PER_PAGE) {
        const pageIndex = page + i / POSTS_PER_PAGE;
        newPosts[pageIndex] = result.slice(i, i + POSTS_PER_PAGE);
      }
      const pages = Object.keys(newPosts).map(Number);

      if (pages.length > MAX_PAGES) {
        pages.sort((a, b) => Math.abs(a - page) - Math.abs(b - page));
        const pagesToRemove = pages.slice(MAX_PAGES);
        pagesToRemove.forEach((p) => delete newPosts[p]);
      }

      set({ posts: newPosts });
    }
  },
}));
