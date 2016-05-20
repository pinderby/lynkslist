class RemoveUpAndDownvoteFromPosts < ActiveRecord::Migration
  def change
    remove_column :posts, :upvotes, :integer
    remove_column :posts, :downvotes, :integer
    change_column_default(:posts, :views, 0)
  end
end
