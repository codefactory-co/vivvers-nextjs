-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "community_posts_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "helpful_answers_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "social_links" JSONB;

-- CreateTable
CREATE TABLE "project_comments" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "project_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "parent_id" UUID,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "replies_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_comment_likes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "comment_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_posts" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "content_html" TEXT,
    "content_json" JSONB,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "author_id" UUID NOT NULL,
    "related_project_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_post_likes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_post_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_post_comments" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "content_html" TEXT,
    "content_json" JSONB,
    "post_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "parent_id" UUID,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "replies_count" INTEGER NOT NULL DEFAULT 0,
    "is_best_answer" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_post_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_post_comment_likes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "comment_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_post_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_post_tags" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_post_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_comments_project_id_idx" ON "project_comments"("project_id");

-- CreateIndex
CREATE INDEX "project_comments_author_id_idx" ON "project_comments"("author_id");

-- CreateIndex
CREATE INDEX "project_comments_parent_id_idx" ON "project_comments"("parent_id");

-- CreateIndex
CREATE INDEX "project_comments_like_count_idx" ON "project_comments"("like_count");

-- CreateIndex
CREATE INDEX "project_comments_replies_count_idx" ON "project_comments"("replies_count");

-- CreateIndex
CREATE INDEX "project_comments_created_at_idx" ON "project_comments"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "project_comment_likes_user_id_comment_id_key" ON "project_comment_likes"("user_id", "comment_id");

-- CreateIndex
CREATE INDEX "community_posts_author_id_idx" ON "community_posts"("author_id");

-- CreateIndex
CREATE INDEX "community_posts_created_at_idx" ON "community_posts"("created_at");

-- CreateIndex
CREATE INDEX "community_posts_likes_count_idx" ON "community_posts"("likes_count");

-- CreateIndex
CREATE INDEX "community_posts_views_count_idx" ON "community_posts"("views_count");

-- CreateIndex
CREATE UNIQUE INDEX "community_post_likes_user_id_post_id_key" ON "community_post_likes"("user_id", "post_id");

-- CreateIndex
CREATE INDEX "community_post_comments_post_id_idx" ON "community_post_comments"("post_id");

-- CreateIndex
CREATE INDEX "community_post_comments_author_id_idx" ON "community_post_comments"("author_id");

-- CreateIndex
CREATE INDEX "community_post_comments_parent_id_idx" ON "community_post_comments"("parent_id");

-- CreateIndex
CREATE INDEX "community_post_comments_is_best_answer_idx" ON "community_post_comments"("is_best_answer");

-- CreateIndex
CREATE INDEX "community_post_comments_created_at_idx" ON "community_post_comments"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "community_post_comment_likes_user_id_comment_id_key" ON "community_post_comment_likes"("user_id", "comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "community_post_tags_post_id_tag_id_key" ON "community_post_tags"("post_id", "tag_id");

-- AddForeignKey
ALTER TABLE "project_comments" ADD CONSTRAINT "project_comments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_comments" ADD CONSTRAINT "project_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_comments" ADD CONSTRAINT "project_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "project_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_comment_likes" ADD CONSTRAINT "project_comment_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_comment_likes" ADD CONSTRAINT "project_comment_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "project_comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_related_project_id_fkey" FOREIGN KEY ("related_project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_post_likes" ADD CONSTRAINT "community_post_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_post_likes" ADD CONSTRAINT "community_post_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_post_comments" ADD CONSTRAINT "community_post_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_post_comments" ADD CONSTRAINT "community_post_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_post_comments" ADD CONSTRAINT "community_post_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "community_post_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_post_comment_likes" ADD CONSTRAINT "community_post_comment_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_post_comment_likes" ADD CONSTRAINT "community_post_comment_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "community_post_comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_post_tags" ADD CONSTRAINT "community_post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_post_tags" ADD CONSTRAINT "community_post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
