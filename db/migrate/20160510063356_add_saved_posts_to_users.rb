class AddSavedPostsToUsers < ActiveRecord::Migration
  def change
    add_reference :users, :saved_posts
  end
end
