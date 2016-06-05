class AddPointsToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :points, :integer
    change_column_default(:posts, :points, 0)
  end
end
