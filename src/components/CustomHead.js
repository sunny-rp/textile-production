import Head from "next/head";

const CustomHead = ({ title, description, image, video, isVideo, url }) => {
  const fullUrl = `${process.env.REDIRECT_URI}${url}`;
  const fullImage = `${process.env.REDIRECT_URI}${image}`;
  const fullVideo = `${process.env.REDIRECT_URI}${video}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      {/* <meta property="og:description" content={description} /> */}
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:video" content={isVideo ? fullVideo : ""} />
      <meta property="og:video:type" content={isVideo ? "video/mp4" : ""} />
      <meta property="og:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="robots" content="follow, index" />
      <link rel="canonical" href={fullUrl} />
      <meta
        name="keywords"
        content={
          " Direct Strategy,Intra Strategy,Triangular Strategy,Coin, Exchange, Kraken, Binance, Mexc, Gemini, TradingView chart, ETH, BTC, USDT, Sniper Trade, Smart Limit Orders, Auto Trade, Bot, Direct Strategy, Intra Strategy, Triangular Strategy"
        }
      />
    </Head>
  );
};

export default CustomHead;
