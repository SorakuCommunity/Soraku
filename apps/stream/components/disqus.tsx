import { DiscussionEmbed } from "disqus-react";

type DisqusCommentsProps = {
  post: {
    name: string;
    url: string;
    title?: string; // Make title optional to prevent TypeError
    episode: number;
    id: number;
  };
};

const DisqusComments = ({ post }: DisqusCommentsProps) => {
  const disqusShortname = post.name || "aniwatchcommunity";
  const disqusConfig = {
    url: post.url || `https://1anime.one/anime/watch?id=${post.id}&ep=${post.episode}`, // Provide a default URL
    title: post.title ? `${post.title} - Episode ${post.episode}` : `Episode ${post.episode}`, // Handle optional title
  };

  return (
    <div>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

export default DisqusComments;