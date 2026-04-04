-- CreateTable
CREATE TABLE "RemovedMedia" (
    "id" TEXT NOT NULL,
    "aniId" TEXT,
    "additions" TEXT[],

    CONSTRAINT "RemovedMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "setting" JSONB,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchListEpisode" (
    "id" TEXT NOT NULL,
    "aniId" TEXT,
    "title" TEXT,
    "aniTitle" TEXT,
    "image" TEXT,
    "episode" INTEGER,
    "timeWatched" INTEGER,
    "duration" INTEGER,
    "provider" TEXT,
    "nextId" TEXT,
    "nextNumber" INTEGER,
    "dub" BOOLEAN,
    "createdDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "userProfileId" TEXT NOT NULL,
    "watchId" TEXT NOT NULL,

    CONSTRAINT "WatchListEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_name_key" ON "UserProfile"("name");

-- AddForeignKey
ALTER TABLE "WatchListEpisode" ADD CONSTRAINT "WatchListEpisode_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("name") ON DELETE CASCADE ON UPDATE CASCADE;
