# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160512071509) do

  create_table "lists", force: :cascade do |t|
    t.string   "name"
    t.string   "description"
    t.string   "permission_level"
    t.integer  "owner_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  add_index "lists", ["name"], name: "index_lists_on_name", unique: true
  add_index "lists", ["owner_id"], name: "index_lists_on_owner_id"

  create_table "lists_posts", id: false, force: :cascade do |t|
    t.integer "post_id"
    t.integer "list_id"
  end

  add_index "lists_posts", ["list_id"], name: "index_lists_posts_on_list_id"
  add_index "lists_posts", ["post_id"], name: "index_lists_posts_on_post_id"

  create_table "posts", force: :cascade do |t|
    t.string   "title"
    t.string   "canonical_url"
    t.string   "summary"
    t.integer  "views"
    t.integer  "shares"
    t.integer  "saves"
    t.integer  "upvotes"
    t.integer  "downvotes"
    t.string   "content_type"
    t.string   "img_url"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.datetime "published_at"
    t.integer  "source_id"
  end

  add_index "posts", ["source_id"], name: "index_posts_on_source_id"

  create_table "saves", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "post_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "saves", ["post_id"], name: "index_saves_on_post_id"
  add_index "saves", ["user_id"], name: "index_saves_on_user_id"

  create_table "sources", force: :cascade do |t|
    t.string   "name"
    t.string   "source_url"
    t.string   "profile_url"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "username"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  add_index "users", ["username"], name: "index_users_on_username", unique: true

end
