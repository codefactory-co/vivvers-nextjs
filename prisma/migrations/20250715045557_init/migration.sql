-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "demo_url" TEXT,
    "github_url" TEXT,
    "features" TEXT[],
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_likes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tags" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_tech_stacks" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_tech_stacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "projects_category_idx" ON "projects"("category");

-- CreateIndex
CREATE INDEX "projects_created_at_idx" ON "projects"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "project_likes_user_id_project_id_key" ON "project_likes"("user_id", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "project_tags_project_id_tag_id_key" ON "project_tags"("project_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_tech_stacks_project_id_tag_id_key" ON "project_tech_stacks"("project_id", "tag_id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_likes" ADD CONSTRAINT "project_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_likes" ADD CONSTRAINT "project_likes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tech_stacks" ADD CONSTRAINT "project_tech_stacks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tech_stacks" ADD CONSTRAINT "project_tech_stacks_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
