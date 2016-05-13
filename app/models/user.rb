class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_many :saved_posts,  -> { uniq }, source: :post, :through => :saves
  has_many :saves, class_name: "Save"
end
