import { CommentCount } from "disqus-react";

type CommentCountProps = {
  post: {
    name: string;
    url: string;
    title?: string; // Make title optional to prevent TypeError
    episode: number;
    id: number;
  };
};

const CommentCountComponent = ({ post }: CommentCountProps) => {
  const disqusShortname = post.name || "aniwatchcommunity";
  
  return (
    <div>
      <CommentCount
        shortname={disqusShortname}
        config={{
          url: post.url || `https://1anime.one/anime/watch?id=${post.id}&ep=${post.episode}`, // Provide a default URL
          identifier: post.url || `https://1anime.one/anime/watch?id=${post.id}&ep=${post.episode}`, // Make identifier same as the URL
          title: post.title ? `${post.title} - Episode ${post.episode}` : `Episode ${post.episode}`, // Handle optional title
        }}
      >
            {/* Placeholder Text */}
    Comments
      </CommentCount>
    </div>
  );
};

export default CommentCountComponent;