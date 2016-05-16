class CreateSources < ActiveRecord::Migration
  def change
    create_table :sources do |t|
      t.string :name
      t.string :source_url
      t.string :profile_url

      t.timestamps null: false
    end
  end
end
