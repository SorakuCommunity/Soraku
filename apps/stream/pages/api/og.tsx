import { ImageResponse } from "@vercel/og";
import Image from "next/image";
import { AniListInfoTypes } from "types/info/AnilistInfoTypes";

export const config = {
  runtime: "edge"
};

async function getLogoData(url: string): Promise<string> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const byteArray = new Uint8Array(arrayBuffer);
  let binaryString = "";

  byteArray.forEach((byte) => {
    binaryString += String.fromCharCode(byte);
  });

  return `data:image/png;base64,${btoa(binaryString)}`;
}

export default async function handler(request: any) {
  const { searchParams } = request.nextUrl;
  const info: AniListInfoTypes = JSON.parse(searchParams.get("info") || "{}");
  const title = info?.title?.english || info?.title?.romaji || "Watch Now";
  const nativeTitle = info?.title?.native || info?.title?.romaji || "";
  const bannerImage = info?.bannerImage || "";
  const score = info?.averageScore ? `${info.averageScore / 10}/10` : "N/A";
  const genres = info?.genres?.join(", ") || "";

  const logoUrl = "https://1anime.app/android-chrome-512x512.png";
  const logoData = await getLogoData(logoUrl);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#0f0f0f",
        color: "white"
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "75%",
          display: "flex",
          alignItems: "flex-end",
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(15,15,15,0) 0%, rgba(15,15,15,0.8) 70%, rgba(15,15,15,1) 100%)" // Smoother gradient
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "40px",
            zIndex: 1,
            width: "100%" // Full width
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "20px"
            }}
          >
            <Image
              src={logoData}
              alt="1Anime Logo"
              width={60}
              height={60}
              style={{ borderRadius: "50%" }}
            />
            <span style={{ fontSize: "24px", fontWeight: "bold" }}>1Anime</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              width: "100%"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "70%"
              }}
            >
              <h1
                style={{
                  fontSize: "52px",
                  fontWeight: "bold",
                  margin: 0,
                  lineHeight: 1.2
                }}
              >
                {title}
              </h1>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "normal",
                  margin: "10px 0 0 0",
                  opacity: 0.8
                }}
              >
                {nativeTitle}
              </h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px"
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="#FFC107"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span style={{ fontSize: "40px", fontWeight: "bold" }}>
                  {score}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  justifyContent: "flex-end"
                }}
              >
                {genres
                  .split(", ")
                  .slice(0, 3)
                  .map((genre, index) => (
                    <div
                      key={index}
                      style={{
                        fontSize: "16px",
                        padding: "5px 12px",
                        backgroundColor: "rgba(128, 0, 128, 0.6)",
                        borderRadius: "20px"
                      }}
                    >
                      {genre}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "20px 40px",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <span style={{ opacity: 0.8 }}>
          Watch "{title}" now on 1Anime for FREE without ads!
        </span>
        <div
          style={{
            backgroundColor: "#9333ea",
            color: "white",
            padding: "12px 24px",
            borderRadius: "30px",
            fontWeight: "bold"
          }}
        >
          WATCH NOW
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630
    }
  );
}
