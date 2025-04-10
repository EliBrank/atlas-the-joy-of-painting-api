-- CreateTable
CREATE TABLE "Episode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "airDate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Color" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EpisodeColor" (
    "episodeId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,

    PRIMARY KEY ("episodeId", "colorId"),
    CONSTRAINT "EpisodeColor_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EpisodeColor_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EpisodeSubject" (
    "episodeId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,

    PRIMARY KEY ("episodeId", "subjectId"),
    CONSTRAINT "EpisodeSubject_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EpisodeSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Episode_title_key" ON "Episode"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");
