class AddSourceRefToPosts < ActiveRecord::Migration
  def change
    add_reference :posts, :source, index: true, foreign_key: true
  end
end
