class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title
      t.string :canonical_url
      t.string :summary
      t.integer :views
      t.integer :shares
      t.integer :saves
      t.integer :upvotes
      t.integer :downvotes
      t.string :content_type
      t.string :img_url

      t.timestamps null: false
    end
  end
end
