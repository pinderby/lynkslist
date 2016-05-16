class CreateLists < ActiveRecord::Migration
  def change
    create_table :lists do |t|
      t.string :name
      t.string :description
      t.string :permission_level
      t.references :owner, references: :users, index: true, foreign_key: true

      t.timestamps null: false
    end
    add_index :lists, :name, unique: true

    create_table :lists_posts, id: false do |t|
      t.belongs_to :post, index: true
      t.belongs_to :list, index: true
    end
  end
end
