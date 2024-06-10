import { useLocation, useNavigate } from "react-router-dom";
import { usePostsStore } from "../store/postStore";
import { useEffect, useState } from "react";
import Post from "../components/Post";

const Pagination: React.FC = () => {
  const posts = usePostsStore((state) => state.posts);
  const fetchPageData = usePostsStore((state) => state.fetchPageData);
  const currentPage = usePostsStore((state) => state.currentPage);
  const setCurrentPage = usePostsStore((state) => state.setCurrentPage);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get("page") || "1", 10);

  useEffect(() => {
    const loadPageData = async () => {
      setIsLoading(true);
      if (currentPage !== page) {
        setCurrentPage(page);
      }
      await fetchPageData(page);
      if (page > 1) await fetchPageData(page - 1);
      await fetchPageData(page + 1);
      setIsLoading(false);
    };

    loadPageData().catch((error) => {
      console.error("Failed to load page data:", error);
      setIsLoading(false);
    });
  }, [page]);

  useEffect(() => {
    if (!isLoading && !posts[page]?.length) {
      navigate(`/?page=1`);
    }
  }, [isLoading, posts, page, navigate]);

  const handleNextPage = () => {
    navigate(`?page=${currentPage + 1}`);
  };

  const handlePrevPage = () => {
    navigate(`?page=${currentPage - 1}`);
  };

  const currentPosts = posts[currentPage] || [];

  return (
    <div>
      {isLoading && !posts[page] ? (
        <p>Loading...</p>
      ) : (
        <div>
          {currentPosts.map((post) => (
            <Post key={post.id} title={post.title} body={post.body} />
          ))}
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={!posts[currentPage + 1]?.length}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
