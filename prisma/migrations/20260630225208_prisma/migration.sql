-- CreateTable
CREATE TABLE "lastfm_cache" (
    "key" TEXT NOT NULL,
    "value" JSONB,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lastfm_cache_pkey" PRIMARY KEY ("key")
);
